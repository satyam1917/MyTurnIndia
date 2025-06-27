const express = require('express');
const { getCoursesByCategory, getCourseById, getPurchasedCourses, fetchCourseContent, fetchQuiz, submitQuiz, getAllCourses, addReviewToCourse, generateCertificate, updateData } = require('../controllers/coursesControllers');
const adminAuth = require('../middleware/adminauth');
const userAuth = require('../middleware/userAuth');
const { createCourse, uploadVideo, getCourse, updateVideo, getAllReviews, deleteReview, monthlyAndYearlySales, salesAndRevenue, fetchRevenueData, fetchUserCourses } = require('../controllers/admin/courseController');
const coursesRouter = express.Router();
const {upload,materialUpload}=require('../multer/multerConfig');

coursesRouter.post('/',getCoursesByCategory);
coursesRouter.post('/create',upload.array('files[]'),adminAuth,createCourse);
coursesRouter.post('/upload-video',materialUpload.array("materials[]"),adminAuth,uploadVideo);
coursesRouter.post('/course-content',userAuth,fetchCourseContent);
coursesRouter.post('/quizzes',userAuth,fetchQuiz);
coursesRouter.post('/submit-quiz',userAuth,submitQuiz);
coursesRouter.get('/:id',getCourseById);
coursesRouter.get('/',adminAuth,getAllCourses);
coursesRouter.post('/purchased-courses',userAuth,getPurchasedCourses);
coursesRouter.post('/get-all-courses',adminAuth,getCourse);
coursesRouter.post('/update-video',adminAuth,updateVideo);
coursesRouter.post('/add-review',userAuth,addReviewToCourse);
coursesRouter.post('/reviews',adminAuth,getAllReviews);
coursesRouter.post('/updateData',updateData);
coursesRouter.delete('/reviews/:id',adminAuth,deleteReview);
coursesRouter.post('/monthly-and-yearly-sales',adminAuth,monthlyAndYearlySales);
coursesRouter.post('/sales-and-revenue',adminAuth,salesAndRevenue);
coursesRouter.post('/revenue',adminAuth,fetchRevenueData);
coursesRouter.post('/mailsender',adminAuth,fetchUserCourses);
coursesRouter.post('/certificate',userAuth,generateCertificate);





module.exports = coursesRouter;