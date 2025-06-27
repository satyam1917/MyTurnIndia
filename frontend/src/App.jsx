import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';  // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

import './App.css';

// Import components and pages
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './pages/Login/Login';
import Registration from './pages/Register/Register';
import Home from './pages/Home/Home';
import OtpVerification from './Components/OtpVerification';
import ForgotPassword from './Components/ForgotPassword';
import CategoryPage from './pages/Category/CategoryPage';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';
import CourseDetails from './pages/CoursePage/CoursePage';
import EventsPage from './pages/Events/Events';
import MyCourse from './pages/MyCourse/MyCourse';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminLogin from './pages/AdminPages/AdminLogin/Login';
import AdminForgot from './pages/AdminPages/AdminLogin/AdminForgotPassword';
import AdminMain from './pages/AdminPages/AdminMain/AdminMain';
import Course from './pages/LearningPage/LearningPage';
import ExamPage from './pages/ExamPage/ExamPage';
import TermsAndConditions from './pages/Terms/Terms';
import PrivacyPolicy from './pages/Policy/Policy';

function App() {
  // Theme state: Light or Dark
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Update body class based on theme
  useEffect(() => {
    document.body.className = theme;

    // Disable right-click on the whole website and show toast notification
    // const preventRightClick = (e) => {
    //   e.preventDefault();
    //   toast.error("Right-click is disabled on this website.", {
    //     position: "top-center",
    //     autoClose: 3000,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     theme: "dark",
    //   });
    // };

    // // Add event listener to prevent right-click
    // document.addEventListener('contextmenu', preventRightClick);

    // return () => {
    //   // Cleanup event listener on component unmount
    //   document.removeEventListener('contextmenu', preventRightClick);
    // };
  }, [theme]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent toggleTheme={toggleTheme} theme={theme} />
      </Router>
    </GoogleOAuthProvider>
  );
}

function AppContent({ toggleTheme, theme }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Automatically set light theme for admin routes
  useEffect(() => {
    if (isAdminRoute && theme !== 'light') {
      const newTheme = 'light';
      localStorage.setItem('theme', newTheme);
      document.body.className = newTheme;
    }
  }, [isAdminRoute, theme]);

  return (
    <div className="app-container">
      {/* Show Navbar and Footer only for non-admin routes */}
      {!isAdminRoute && <Navbar toggleTheme={toggleTheme} theme={theme} />}
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/course-details/:videoId" element={<CourseDetails />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/my-courses" element={<MyCourse />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/learning/:courseId" element={<Course />} />
        <Route path="/exam/:quizId" element={<ExamPage />} />
        <Route path='/terms' element={<TermsAndConditions/>}/>
        <Route path='/privacy' element={<PrivacyPolicy/>}/>

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-forgot-password" element={<AdminForgot />} />
        <Route path="/admin/*" element={<AdminMain />} />
      </Routes>
      {!isAdminRoute && <Footer theme={theme} />}
    </div>
  );
}

export default App;
