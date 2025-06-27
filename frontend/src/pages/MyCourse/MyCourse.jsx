import React, { useEffect, useState } from "react";
import "./MyCourse.css";
import { FaStar } from "react-icons/fa"; // Star icon for rating
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyCourse = ({theme}) => {
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState([]); // State for courses data
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [filter, setFilter] = useState({
    sort: "recent",
    category: "all",
    progress: "all",
  }); // State for filters
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [selectedCourse, setSelectedCourse] = useState(null); // Store selected course
  const [rating, setRating] = useState(1); // State to store the rating
  const [review, setReview] = useState(""); // State to store the review text

  // Fetch courses data on component mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/purchased-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Brear " + Cookies.get('token'),
      },
      body: JSON.stringify({ category: "all" }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCoursesData(data.purchasedCourses || []); // Fallback to an empty array
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  // Filter courses based on selected filters
  const filteredCourses = (coursesData || []).filter((course) => {
    if (filter.category !== "all" && course.category !== filter.category) {
      return false;
    }
    if (filter.progress === "completed" && course.progress < 100) {
      return false;
    }
    if (filter.progress === "inProgress" && course.progress === 100) {
      return false;
    }
    return true;
  });

  // Navigate to the course page on click
  const handleCourseClick = (course) => {
    navigate(`/learning/${course._id}`);
  };

  // Handle Rating Click and show modal
  const handleRatingClick = (course, event) => {
    event.stopPropagation(); // Prevents event from bubbling up to the parent element
    setSelectedCourse(course); // Store the selected course
    setShowModal(true); // Show the modal
  };

  // Handle rating and review form submission
  const handleSubmitReview = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Brear " + Cookies.get('token'),
        },
        body: JSON.stringify({ courseId: selectedCourse._id, rating, reviewText:review }),
      });
      const data = await response.json();
      if (data.status) {
        toast.success(data.message);
        location.reload();
      }else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    // You can add your API call here to save the rating and review
    setShowModal(false); // Close the modal after submitting
  };

  // Handle modal close (cancel button)
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  // Render loading spinner if data is still loading
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={`my-course ${theme}`}>
      <ToastContainer />
      <header className="my-course-header">
        <h1>My Courses</h1>
        <p>Curated learning experiences tailored just for you.</p>
      </header>

      {/* Filters Section */}
      <div className="filters">
        <select name="sort" onChange={handleFilterChange} value={filter.sort}>
          <option value="recent">Recently Accessed</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        
        <select
          name="progress"
          onChange={handleFilterChange}
          value={filter.progress}
        >
          <option value="all">All Progress</option>
          <option value="completed">Completed</option>
          <option value="inProgress">In Progress</option>
        </select>
      </div>

      {/* Course Grid */}
      <div className="course-grid">
        {filteredCourses.map((course) => (
          <div key={course._id} className="course-card-mc" onClick={() => handleCourseClick(course)}>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/${course.banner}`}
              alt={course.title}
              className="course-image"
            />
            <div className="course-info">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">{course.educator}</p>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="progress-text">{Math.round(course.progress)}% Complete</p>
              <div className="rating" onClick={(event) => handleRatingClick(course, event)}>
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < course.rating ? "gold" : "#ddd"}
                    size={20}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Modal Dialog Box */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h2>Rate and Review {selectedCourse?.title}</h2>
            <div className="rating-input">
              <label>Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                {[...Array(5)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} Star{index + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="review-input" style={{color: 'white !important'}}>
              <label>Review:</label>
              <div className="rating-textarea">
              <textarea
              style={{
                color: 'white ',
              }}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here"
              ></textarea>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={handleSubmitReview}>Submit</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourse;
