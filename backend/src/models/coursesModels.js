const mongoose = require('mongoose');

// Schema for individual Quiz
const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of options
  correctOption: { type: Number, required: true }, // Index of the correct option
});

//Schema for Materials
const MaterialsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});


// Schema for individual Video
const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  materials: [ MaterialsSchema ], // Optional URL for PDF
  quiz: [QuizSchema], // Quiz for the video
});

// Schema for individual Review
const ReviewSchema = new mongoose.Schema({
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5,  // Rating can be between 1 and 5
  },
  reviewText: { type: String, required: true },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model who gave the review
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

// Main Course Schema
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    educator: { type: String, required: true },
    designation: { type: String, required: true },
    banner: { type: String, required: true },
    signature: { type: String, required: true },
    level: { type: String, required: true },
    skill: { type: String, required: true },
    price: { type: Number, required: true },
    expiresDays: { type: Number, required: true },
    prerequisites: { type: String, required: true },
    whoShouldTake: { type: String, required: true }, // Who Should Take
    isLive: { type: Boolean, required: true },
    videos: [VideoSchema], // Array of videos in the course
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    reviews: [ReviewSchema], // Array of reviews
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);

// Method to calculate the average rating of a course
CourseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  // Calculate the sum of all ratings and then divide by the number of reviews
  const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return total / this.reviews.length;
};

// Create Course model
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
