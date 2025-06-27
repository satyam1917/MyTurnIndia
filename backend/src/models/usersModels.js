const mongoose = require('mongoose');
const Course = require('./coursesModels');

const QuizResultSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  attemptedOn: { type: Date, default: Date.now },
  answers: { type: Map, of: String },
});

const CartItemSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  quantity: { type: Number, default: 1 },
});

const PurchasedCourseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  purchaseDate: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // progress in percentage
  complitionDate: { type: Date },
});

const PurchasedEventSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  purchaseDate: { type: Date, default: Date.now },
});

const SessionSchema = new mongoose.Schema({
  token: { type: String },
  device: { type: String, default: 'unknown' }, // optional, e.g., browser or device ID
  lastLogin: { type: Date },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },// hashed password
    role: { type: String, default: 'user' },
    profileImage: { type: String, default: 'profile.jpg' },
    otp: { type: Number, required: true }, 
    isEmailVerified: { type: Boolean, required: true },
    cart: [CartItemSchema],
    purchasedCourses: [PurchasedCourseSchema],
    purchasedEvents: [PurchasedEventSchema],
    quizResults: [QuizResultSchema],
    currentSession: SessionSchema,
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);

UserSchema.methods.updateCourseProgress = async function(courseId) {
  const user = this;

  // Find the purchased course by courseId
  const purchasedCourse = user.purchasedCourses.find(course => course.courseId.toString() === courseId.toString());

  if (!purchasedCourse) {
    throw new Error('Course not found in purchased courses.');
  }

  let totalQuizzes = 0;
  let completedQuizzes = 0;

  // Iterate through each video in the course to calculate total and completed quizzes
  const course = await Course.findById(courseId); // Find the course by ID
  for (let video of course.videos) {
    for (let quiz of video.quiz) {
      totalQuizzes++;
      const quizResult = user.quizResults.find(result => result.videoId.toString() === video._id.toString() && result.courseId.toString() === courseId.toString() && result.answers.size > 0); // Check if the quiz has been attempted
      if (quizResult) {
        completedQuizzes++; // Increment if the quiz has been completed
      }
    }
  }

  // Calculate progress percentage
  const progress = totalQuizzes === 0 ? 0 : (completedQuizzes / totalQuizzes) * 100;

  if(progress >= 100){
    purchasedCourse.complitionDate = new Date();
  }

  // Update the progress in the purchased course
  purchasedCourse.progress = progress;

  // Save the updated user document
  await user.save();
  
  return progress;
};


const User = mongoose.model('User', UserSchema);

module.exports = User;
