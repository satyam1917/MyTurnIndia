const Course = require("../models/coursesModels");
const User = require("../models/usersModels");
const Admin = require("../models/adminModels");
const Order = require("../models/ordersModels");
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage,registerFont} = require('canvas');


const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.body; // Retrieve category from the request body

    // Fetch courses by category
    const courses = await Course.find({ category: category });

    // Map over the courses and calculate the average rating for each course
    const coursesWithRatings = courses.map(course => {
      const averageRating = course.calculateAverageRating(); // Calculate average rating

      // Return course data with the calculated average rating
      return {
        ...course.toObject(),
        averageRating, // Add the average rating to the course
      };
    });

    // Respond with the courses and their average ratings
    res.status(200).json({
      success: true,
      courses: coursesWithRatings,
    });

  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('title'); // Select the title field, _id is included by default
    const courseDetails = courses.map(course => ({
      id: course._id,  // Extract the _id as id
      title: course.title // Extract the title
    }));
    res.status(200).json({ success: true, courseDetails }); // Return the array of course details
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    res.status(200).json({ success: true, course: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPurchasedCourses = async (req, res) => {
  const userId = req.userId;
  try {
    // Fetch the user by ID and populate the 'courseId' from purchasedCourses
    const user = await User.findById(userId).populate({
      path: 'purchasedCourses.courseId', // Populate the courseId field
      select: 'title description category educator price banner duration level skill reviews expiresDays' // Include expiresDays in the selection
    }).exec();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Extract the purchased course details and filter out expired courses
    const purchasedCourses = user.purchasedCourses.map(purchasedCourse => {
      const course = purchasedCourse.courseId;

      // Calculate if the course has expired
      const purchaseDate = new Date(purchasedCourse.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + course.expiresDays); // Add the expiresDays to purchaseDate
      const currentDate = new Date();

      // Check if the course has expired
      if (expiryDate < currentDate) {
        return null; // Skip the expired course
      }

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        educator: course.educator,
        price: course.price,
        banner: course.banner,
        duration: course.duration,
        level: course.level,
        skill: course.skill,
        purchaseDate: purchasedCourse.purchaseDate,
        progress: purchasedCourse.progress,
        rating: course.calculateAverageRating(),
      };
    }).filter(course => course !== null); // Filter out null (expired) courses

    return res.status(200).json({ success: true, purchasedCourses });

  } catch (error) {
    return res.status(500).json({ message: 'Error fetching purchased courses', error });
  }
};

const uploadVideo = async (req, res) => {

  try {
    const { courseId, videoData } = req.body;
    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ status: false, message: 'Course not found' });
      return;
    }

    // Construct the new video with quiz
    const newVideo = {
      title: videoData.title,
      videoUrl: videoData.videoUrl,
      materials: videoData.materials.map(q => ({
        title: q.title,
        url: q.url
      })), // Optional PDF URL
      quiz: videoData.quiz.map(q => ({
        question: q.question,
        options: q.options,
        correctOption: q.correctOption
      }))
    };

    // Add the new video to the course's 'videos' array
    course.videos.push(newVideo);

    // Save the updated course
    await course.save();
    res.status(200).json({ status: true, message: 'Video and quiz added successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error adding video and quiz' });
  }

}

const fetchCourseContent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId;  // Assuming user ID is available in req.user

    // Validate that courseId is provided
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    // Fetch the course by ID and select only necessary fields (videos and title)
    const course = await Course.findById(courseId).select('videos title').lean();

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Fetch user's quiz results for the course
    const user = await User.findById(userId).select('quizResults').lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Transform the data to the desired format
    const formattedData = course.videos.map(video => {
      const isQuiz = video.quiz.length > 0;  // Check if the quiz exists
      let quizScore = null;
      let maxScore = null;
      let isQuizAttempted = false;  // Initialize to false

      // If quiz exists, check if the user has attempted the quiz
      if (isQuiz) {
        // Find the quiz result for the specific video
        const quizResult = user.quizResults.find(result =>
          result.courseId.toString() === courseId &&
          result.videoId.toString() === video._id.toString()
        );

        if (quizResult) {
          quizScore = quizResult.score;
          maxScore = quizResult.maxScore;
          isQuizAttempted = true;  // Set to true if the user attempted the quiz
        }
      }

      return {
        title: video.title,
        videoUrl: video.videoUrl,
        materials: video.materials.map(material => ({
          name: material.title,  // Assuming 'title' is the field for the material name
          link: material.url,    // Assuming 'url' is the field for the material URL
        })),
        quiz: isQuiz,
        id: video._id,
        quizScore,  // Adding the score for the user if available
        maxScore,   // Adding the max score for the quiz if available
        isQuizAttempted  // Adding the flag indicating if the quiz was attempted
      };
    });

    const userData = await User.findById(userId);

    // Send the response with the formatted data
    const data = {
      userName: userData.name,
      progress: await userData.updateCourseProgress(courseId),
      title: course.title,
      videos: formattedData
    };

    res.status(200).json({ success: true, lectures: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const fetchQuiz = async (req, res) => {
  try {
    const { videoId } = req.body;
    const course = await Course.findOne({ "videos._id": videoId });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const video = course.videos.find((video) => video._id.toString() === videoId.toString());

    if (!video || !video.quiz || video.quiz.length === 0) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const formattedQuizzes = video.quiz.map((quiz, index) => ({
      id: index + 1,
      question: quiz.question,
      options: quiz.options,
      correctAnswer: quiz.options[quiz.correctOption], // Using index to find correct answer
    }));

    return res.status(200).json({ success: true, quizzes: formattedQuizzes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

const updateData = async (req, res) => {
  try {
    const newAdmin = new Admin({
      name: 'Manish Kumar',  // Required
      email: 'manishkumar16036@gmail.com',  // Required
      password: '$2b$10$NvFYiFgUP3HZrJa./8CAkerBHH5IuStBPZ3WR.c4hLE63tgzwn.yG', // Required (hashed in practice)
      otp: '1516',  // Default value, but you can also provide a custom OTP if needed
      role: 'admin',  // Default value ('admin'), but you can explicitly set it
    });

    // Save the new admin to the database
    await newAdmin.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { videoId, answers } = req.body;
    const userId = req.userId; // Assuming authentication middleware attaches `user`
    const user = await User.findById(userId);

    // Fetch the course and video details
    const course = await Course.findOne({ "videos._id": videoId });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const video = course.videos.find((v) => v._id.toString() === videoId.toString());
    if (!video || !video.quiz || video.quiz.length === 0) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const maxScore = video.quiz.length;
    let score = 0;

    // Calculate the score
    const correctAnswers = {};
    let i = 1;
    video.quiz.forEach((quiz) => {
      correctAnswers[quiz._id] = quiz.options[quiz.correctOption];
      if (answers[i] === quiz.options[quiz.correctOption]) {
        score++;
      }
      i++;
    });

    // Create and save the result
    const result = {
      courseId: course._id,
      videoId,
      score,
      maxScore,
      answers, // Map of questionId: user's answer
      attemptedOn: new Date(),
    };

    user.quizResults.push(result);
    await user.updateCourseProgress(course._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: { quizResults: result },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addReviewToCourse = async (req, res) => {
  try {
    const { courseId, rating, reviewText } = req.body;
    const userId = req.userId;
    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {

      return res.status(404).json({ status: false, message: 'Course not found' });
    }

    // Check if the user has already submitted a review for this course
    const existingReviewIndex = course.reviews.findIndex(review => review.reviewedBy.toString() === userId.toString());

    if (existingReviewIndex !== -1) {
      // If a review exists, update the review
      course.reviews[existingReviewIndex].rating = rating;
      course.reviews[existingReviewIndex].reviewText = reviewText;
      course.reviews[existingReviewIndex].createdAt = new Date(); // Optionally, update the timestamp
    } else {
      // If no review exists, add a new review
      const newReview = {
        rating,           // Rating value (between 1 to 5)
        reviewText,       // The review text itself
        reviewedBy: userId, // Reference to the user who submitted the review
        createdAt: new Date() // Timestamp of when the review was created
      };
      course.reviews.push(newReview);
    }

    // Save the updated course document
    await course.save();

    res.status(200).json({ status: true, message: 'Review added/updated successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


const generateCertificate = async (req, res) => {
  registerFont(path.join(__dirname, '../assets/fonts/text.ttf'), { family: 'custom' });
  try {
    const { courseId, title } = req.body;
    const userId = req.userId;  // Assuming user ID is available in req.user

    const user = await User.findById(userId);

    const purchasedCourse = user.purchasedCourses.find(course => course.courseId.toString() === courseId.toString());
    const complitionDate = new Date(purchasedCourse.complitionDate);
    const day = String(complitionDate.getDate()).padStart(2, '0');
    const month = String(complitionDate.getMonth() + 1).padStart(2, '0');
    const year = complitionDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const existingCourse = user.purchasedCourses.find(course => course.courseId.toString() === courseId.toString());

    if (!existingCourse) {
      return res.status(400).json({ status: false, message: 'User has not purchased this course' });
    }

    const templatePath = path.join(__dirname, '../assets/template.png');
    const template = await loadImage(templatePath);
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(template, 0, 0);
    ctx.fillStyle = '#ffffff';

    // Font sizes
    const fontSize = 50;
    const smallerFontSize = 40;
    const courseTextFontSize = 30;

    // Add Name (starting from a specific point)
    ctx.font = '80px Times New Roman';
    ctx.textAlign = 'center';  // Set text alignment to left to control position
    ctx.textBaseline = 'middle'; // Align text vertically to the middle
    // const nameWidth = ctx.measureText(user.name).width;
    const nameX = (canvas.width / 2)-20; // Center of the canvas width
    const nameY = 705; // Y position
    ctx.fillText(user.name, nameX, nameY);

    ctx.fillStyle = '#000';

    // Add Date (starting from a specific point)
    ctx.font = `${smallerFontSize}px Arial`;
    
    ctx.fillText(formattedDate, 200, 1200);



    // Add certificate description text (centered)
    ctx.font = `35px Arial`;
    ctx.textAlign = 'center'; // Center-align the text
    ctx.textBaseline = 'middle'; // Align text vertically to the middle
    const certificateText = `Has Successfully completed “${course.title}” \n an online course authorized by “${course.educator}”\n offered by myturnindia.`;

    // X coordinate is canvas width / 2 for centering
    const certificateTextX = canvas.width / 2;
    // Adjust Y position as needed (e.g., halfway down the canvas)
    const certificateTextY = canvas.height / 2;

    // For multi-line text, split by newline character and draw each line
    const lines = certificateText.split('\n');
    const lineHeight = 40; // Adjust line height as needed
    lines.forEach((line, index) => {
      ctx.fillText(line, 1000, 840 + index * lineHeight);
    });
    // Add Signature Image
    const signaturePath = path.join(__dirname, '../assets/images', course.signature); // Path to the signature image
    const signature = await loadImage(signaturePath);

    // Set desired signature width and height
    const signatureWidth = 260; // Set the desired width
    const signatureHeight = 70; // Set the desired height

    // Add Name (starting from a specific point)
    ctx.font = `30px Arial`;
    ctx.textAlign = 'left';  // Set text alignment to left to control position
    ctx.fillText(course.educator, 1320, 1180);

    ctx.font = `30px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(course.designation, 1300, 1220);


    ctx.drawImage(signature, 1270, 1070, signatureWidth, signatureHeight);  // Draw the signature image

    const outputPath = path.join(__dirname, '../assets/certificates', `${user.name}.png`);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
      res.sendFile(outputPath, (err) => {
        if (err) {
          return res.status(500).json({ status: false, message: 'Error sending file' });
        }
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};









module.exports = { generateCertificate, addReviewToCourse, updateData, getCoursesByCategory, getCourseById, getPurchasedCourses, uploadVideo, fetchCourseContent, fetchQuiz, submitQuiz, getAllCourses };