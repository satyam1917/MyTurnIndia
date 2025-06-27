import React, { useState,useEffect } from "react";
import { Link, Navigate,useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBookOpen, FaCheckCircle } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import "./CoursePage.css";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Loading from "../../Components/Loading";

const CourseDetails = ({theme}) => {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${videoId}`)
          .then(response => response.json())
          .then(data => {
            if(data.success){
              setCourseData(data.course);
              setIsLoading(false);
            }
            else{
              toast.error(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            }
              
          })
          .catch(error => console.error('Error:', error));
  }, [videoId]);
  const course = {
    title: "React Development Masterclass",
    image: "https://via.placeholder.com/600x400",
    description:
      "Master React and build modern, scalable, and dynamic web applications. This course covers everything from basics to advanced techniques with real-world projects.",
    objectives: [
      "Learn React fundamentals and advanced concepts.",
      "Master state management using hooks and context API.",
      "Build real-world applications with React.",
      "Optimize React apps for performance and scalability.",
    ],
    features: [
      "Access to exclusive React projects.",
      "Lifetime access to the course materials.",
      "Certificate of completion.",
      "Community support and expert guidance.",
    ],
    prerequisites:
      "Basic understanding of HTML, CSS, and JavaScript. Familiarity with JavaScript ES6 features will be beneficial.",
    audience:
      "Web developers looking to dive deeper into React, and those interested in building scalable React applications.",
    lectures: [
      "Introduction to React",
      "JSX and Rendering",
      "Components and Props",
      "State Management",
      "React Hooks",
      "Routing with React Router",
      "Advanced Performance Optimization",
    ],
    tests: 5,
    price: 99.99,
    studentsEnrolled: 1500,
  };

  const handleEnroll= async()=>{
    const token = Cookies.get('token');
      let amount = courseData.price; // Example: Amount in INR (1000 paise = 10 INR)
      amount = Math.floor(amount);
      // Step 1: Create an order from the backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":"Brear "+token,
        },
        body: JSON.stringify({ amount }) // Send the amount in the request body
      });
      
      const data = await response.json(); // Parse the JSON response from the server
      if(data.message=="Unauthorize user"){
        navigate("/login");
      }

      // Step 2: Set up Razorpay options with the order details
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay key ID
        amount: data.order.amount, // Amount in paise
        currency: data.order.currency,
        order_id: data.order.id,
        handler: async function (response) {
          // Step 3: Verify the payment on the server after user completes payment
          const verificationResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",    
              "Authorization":"Brear "+token,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId:courseData._id,
              amount:amount
            })
          });
    
          const verificationData = await verificationResponse.json();
    
          if (verificationData.success) {
            navigate("/my-courses");
          } else {
            alert("Payment verification failed.");
            console.log("Payment verification failed.");
          }
        },
        prefill: {
          name: data.user.name,
          email: data.user.email
        },
        theme: {
          color: "#F37254"
        }
      };
    
      // Step 4: Open the Razorpay checkout window
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    
  }

  if(isLoading){
    return <Loading/>
  }
  return (
    <div className={`course-page-dec ${theme}`}>
      {/* Back Button */}
      <Link to="/" className="back-button">
        &larr; Back to Courses
      </Link>

      {/* Course Header */}
      
      <div className="course-header">
        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${courseData.banner}`} alt={course.title} className="course-image" />
        <div className="course-info-dec">
          <h1 className="course-title-dec">{courseData.title}</h1>
          <p className="course-description">{courseData.description}</p>

          <div className="course-stats">
            <div className="stat-dec">
              <strong>{courseData.videos.length} </strong>&nbsp;Lectures
            </div>
            <div className="stat-dec">
              <strong>{courseData.videos.length}</strong>&nbsp; Quizes
            </div>
           
          </div>

          <h2 className="course-price">
            <i className="fa fa-dollar-sign" /> ₹ {course.price}
          </h2>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="course-content">
        <h2>What You'll Learn</h2>
        <ul className="lecture-list">
          {courseData.videos.map((video, index) => (
            <li key={index} className="lecture-item">
              <FaCheckCircle style={{ color: "#1a73e8", marginRight: "10px" }} />
              {video.title}
            </li>
          ))}
        </ul>
{/* 
        <h2>Key Features</h2>
        <ul className="lecture-list">
          {course.features.map((feature, index) => (
            <li key={index} className="lecture-item">
              <MdOutlineDescription style={{ color: "#1a73e8", marginRight: "10px" }} />
              {feature}
            </li>
          ))}
        </ul> */}

        <h2>Course Prerequisites</h2>
        <p style={{textAlign:'start'}}>{courseData.prerequisites}</p>

        <h2>Who Should Take This Course?</h2>
        <p style={{textAlign:'start'}}>{courseData.whoShouldTake}</p>

        {/* <h2>Course Content</h2>
        <ul className="lecture-list">
          {course.lectures.map((lecture, index) => (
            <li key={index} className="lecture-item">
              <FaBookOpen style={{ color: "#1a73e8", marginRight: "10px" }} /> { lecture}
            </li>
          ))}
        </ul> */}
      </div>

      {/* Action Button */}
      <div className="action-buttons">
        <button className="primary-button-cp" onClick={handleEnroll}>
          <FaShoppingCart /> Enroll Now
        </button>

      </div>
    </div>
  );
};

export default CourseDetails;
