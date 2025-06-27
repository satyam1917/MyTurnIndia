const Course = require('../../models/coursesModels');
const Order = require('../../models/ordersModels');
const User = require('../../models/usersModels');
const createCourse = async (req, res) => {
  try {
    const { title, description, category, educator, level, skill, price, expiresDays, isLive, prerequisites, whoShouldTake,designation} = req.body;

    // Ensure that a banner image was uploaded
    if (!req.files) {
      return res.status(400).json({ status: false, message: 'Banner image is required' });
    }


    // // Create a new course using the provided data
    const newCourse = new Course({
      title,
      description,
      category,
      educator,
      banner: req.files[0].filename, // Use the banner image URL
      signature: req.files[1].filename,
      level,
      skill,
      price,
      expiresDays,
      isLive,
      prerequisites,
      whoShouldTake,
      designation,
      createdBy: req.userId
    });

    // Save the course to the database
    await newCourse.save();

    // Return success response
    res.status(201).json({ status: true, message: 'Course created successfully', course: newCourse });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

const uploadVideo = async (req, res) => {
  let newVideo = null; // Ensure newVideo is always defined
  
  try {
    const { courseId, materialTitles, quiz, title } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, message: 'No files were uploaded' });
    }

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ status: false, message: 'Course not found' });
    }

    if (Array.isArray(req.files) && req.files.length > 1) {
      if (typeof (quiz) === 'undefined') {
        // Construct the new video without quiz
        newVideo = {
          title: title,
          videoUrl: req.files[0].filename,
          materials: materialTitles.map((url, index) => (
            req.files[index + 1] ? {
              title: materialTitles[index],
              url: req.files[index + 1].filename
            } : null
          )).filter(item => item !== null), // Filter out any null items
          quiz: []
        };
      } else {
        // Construct the new video with quiz
        newVideo = {
          title: title,
          videoUrl: req.files[0].filename,
          materials: materialTitles.map((url, index) => (
            req.files[index + 1] ? {
              title: materialTitles[index],
              url: req.files[index + 1].filename
            } : null
          )).filter(item => item !== null), // Filter out any null items
          quiz: quiz.map(q => ({
            question: q.question,
            options: q.options,
            correctOption: q.correctAnswer
          }))
        };
      }
    } else {
      if (typeof (quiz) === 'undefined') {
        // Construct the new video without quiz
        newVideo = {
          title: title,
          videoUrl: req.files[0].filename,
          materials: [],
          quiz: []
        };
      } else {
        // Construct the new video with quiz
        newVideo = {
          title: title,
          videoUrl: req.files[0].filename,
          materials: [],
          quiz: quiz.map(q => ({
            question: q.question,
            options: q.options,
            correctOption: q.correctAnswer
          }))
        };
      }
    }

    // Add the new video to the course's 'videos' array
    course.videos.push(newVideo);
    await course.save();
    res.status(200).json({ status: true, message: 'Video and quiz added successfully', data: newVideo });
  } catch (err) {
    // In case of an error, handle it gracefully
    res.status(500).json({ status: false, message: 'Error adding video and quiz', error: err.message });
  }
};



const getCourse = async (req, res) => {
  try {
    // Fetch all courses including their videos, quizzes, and reviews
    const courses = await Course.find()
      .populate({
        path: 'reviews.reviewedBy', // Populate the user details for each review
        select: 'name email' // Only select name and email of the reviewer
      })
      .populate('createdBy', 'name') // Populate the creator details of the course
      .exec();

    // Format the data into the desired structure
    const demoData = courses.map(course => ({
      id: course._id.toString(), // Using course's _id for the course id
      title: course.title,
      videos: course.videos.map(video => ({
        id: video._id.toString(), // Using video's _id for the video id
        title: video.title,
        videoUrl: video.videoUrl,
        materials: video.materials.map(material => ({
          id: material._id.toString(), // Using material's _id for the material id
          title: material.title,
          url: material.url
        })),
        quiz: video.quiz.map((quiz, index) => ({
          id: `quiz${index + 1}`, // Assigning a sequential id for each quiz
          question: quiz.question,
          options: quiz.options,
          correctOption: quiz.correctOption
        }))
      }))
    }));

    // Print the formatted data
    res.status(200).json({ success: true, data: demoData });
    return demoData;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { courseId, videoId, videoData } = req.body;
    
    // Find the course and update the video directly
    const course = await Course.findOneAndUpdate(
      { _id: courseId, 'videos._id': videoId }, // Filter by courseId and videoId
      {
        $set: {
          'videos.$.title': videoData.title,        // Update video title
          'videos.$.videoUrl': videoData.videoUrl,   // Update video URL
          'videos.$.materials': videoData.materials,  // Update materials
          'videos.$.quiz': videoData.quiz,           // Update quiz
        },
      },
      { new: true }  // Return the updated document
    );

    if (!course) {
      return res.status(404).json({ status: false, message: 'Course or video not found' });
    }

    // Return the updated video in the response
    const updatedVideo = course.videos.find(video => video._id.toString() === videoId);

    res.status(200).json({ 
      status: true, 
      message: 'Video updated successfully', 
      data: updatedVideo
    });

  } catch (err) {
    res.status(500).json({ status: false, message: 'Error updating video' });
  }
};

const getAllReviews = async (req, res) => {
  try {
    // Fetch all courses and populate reviewer details in reviews
    const courses = await Course.find()
      .populate('reviews.reviewedBy', 'name email') // Populate reviewer details for each review
      .exec();

    // Collect all reviews in the desired format
    const allReviews = [];

    courses.forEach(course => {
      course.reviews.forEach((review, index) => {
        allReviews.push({
          id: allReviews.length + 1,  // Set unique id for each review
          courseId: course._id.toString(),
          reviewId: review._id.toString(),
          name: review.reviewedBy.name,
          email: review.reviewedBy.email,
          courseName: course.title,  // Course name
          rating: review.rating,
          feedback: review.reviewText,
          date: review.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        });
      });
    });

    return res.status(200).json({ status: true, data: allReviews });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;
    // Find the course by its ID
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ status: false, message: 'Course not found' });
    }

    // Find the review in the course's reviews array by review ID
    const reviewIndex = course.reviews.findIndex(review => review._id.toString() === id);

    if (reviewIndex === -1) {
      return res.status(404).json({ status: false, message: 'Review not found' });
    }

    // Remove the review from the reviews array
    course.reviews.splice(reviewIndex, 1);

    // Save the course after removing the review
    await course.save();

    return res.status(200).json({ status: true, message: 'Review deleted successfully'});
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Server error' });
  }
};

const salesAndRevenue = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'courseId',
          as: 'orders'
        }
      },
      {
        $project: {
          title: 1,
          sales: { $size: "$orders" },
          revenue: { $sum: "$orders.price" },
          _id: 1,
        }
      }
    ]);
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const monthlyAndYearlySales = async (req, res) => {
  try {
    // Aggregate sales by month
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$purchaseDate" }, // Group by month
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    // Create an array of monthly sales data with 12 entries (for each month)
    const monthlySalesData = Array(12).fill(0); // Initialize array with 0 values
    monthlySales.forEach(sale => {
      // Ensure month is between 1-12 and adjust index accordingly
      if (sale._id >= 1 && sale._id <= 12) {
        monthlySalesData[sale._id - 1] = sale.totalSales;
      }
    });

    // Aggregate sales by year for the years 2022, 2023, 2024, 2025
    const yearlySales = await Order.aggregate([
      {
        $match: {
          $or: [
            { $expr: { $eq: [{ $year: "$purchaseDate" }, 2022] } },
            { $expr: { $eq: [{ $year: "$purchaseDate" }, 2023] } },
            { $expr: { $eq: [{ $year: "$purchaseDate" }, 2024] } },
            { $expr: { $eq: [{ $year: "$purchaseDate" }, 2025] } },
          ],
        },
      },
      {
        $group: {
          _id: { $year: "$purchaseDate" }, // Group by year
          totalSales: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by year
    ]);


    // Create an array of yearly sales data for the years 2022, 2023, 2024, 2025
    const yearlySalesData = [2022, 2023, 2024, 2025].map(year => {
      const yearData = yearlySales.find(sale => sale._id === year);
      return yearData ? yearData.totalSales : 0; // Return the sales or 0 if no sales data for that year
    });

    // Respond with the data in the desired format
    res.json({
      monthly: monthlySalesData, // Sales per month (12 months)
      yearly: yearlySalesData,   // Sales per year (2022, 2023, 2024, 2025)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchRevenueData=async(req,res)=>{
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" }
          },
          revenue: { $sum: "$price" }
        }
      },
      {
        $sort: { "_id": 1 } // Sort by date (ascending)
      },
      {
        $project: {
          date: "$_id",
          revenue: 1,
          _id: 0
        }
      }
    ]);

    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Server error' });
  }
};

const fetchUserCourses = async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: 'purchasedCourses.courseId', // Populate courseId with course details
        select: 'title' // We need the title of the course (not the entire course object)
      });

    // Map the users to the required format
    const userData = users.map(user => {
      // Get the name of the course from the populated field
      const courseName = user.purchasedCourses.length > 0
        ? user.purchasedCourses[0].courseId.title // Get the title of the course from populated courseId
        : 'N/A'; // If the user has no purchased courses, set course as 'N/A'

      return {
        id: user._id, // User ID
        name: user.name, // User's name
        email: user.email, // User's email
        course: courseName // The title of the first course they have purchased
      };
    });

    return res.status(200).json({ status: true, data: userData });
  } catch (error) {
    return res.status(500).json({status: false, message: error.message });
  }
};

module.exports = {fetchUserCourses,fetchRevenueData,monthlyAndYearlySales,salesAndRevenue,deleteReview,getAllReviews, createCourse, uploadVideo,getCourse,updateVideo };