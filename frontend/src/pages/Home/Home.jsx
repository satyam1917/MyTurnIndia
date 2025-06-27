import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Corrected the typo here
import { Link } from "react-router-dom";
import "./Home.css";
import { FaRocket } from "react-icons/fa";
import Loading from "../../Components/Loading";

const HomePage = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(""); // State to hold the video URL

  const [courseCategories, setCourseCategories] = useState([
    {
      name: "Tech and Finance",
      description:
        "Learn the principles of finance, accounting, investments, and financial management while exploring the latest advancements in technology, programming, software development, and more.",
      courses: [],
    },
    {
      name: "Placement Guarantee",
      description:
        "Our placement guarantee courses are designed to equip you with the skills and knowledge required to succeed in top industries, ensuring you are job-ready upon completion.",
      courses: [],
    },
  ]);

  useEffect(() => {
    // Function to fetch courses for a specific category
    const fetchCourses = async (category, index) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: category }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        // Update state with the fetched courses
        setCourseCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[index].courses = data.courses; // Assign the fetched courses to the correct category
          return updatedCategories;
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    // Fetch Tech and Finance courses
    fetchCourses("Technology", 0);
    fetchCourses("Placement", 1);

    // Fetch the video URL from the backend
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resource/`); // Replace with your video endpoint
        if (response.ok) {
          const data = await response.json();
          const videoUrl = data.resources[0].video; // Extract the video URL from the response
          setVideoUrl(videoUrl); // Set the video URL in state
        } else {
          throw new Error("Video not found");
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchVideo(); // Fetch the video URL

  }, []); // Empty dependency array ensures this runs once when the component mounts

  const navigate = useNavigate(); // Corrected the typo here

  const handleClick = () => {
    const isLoggedIn = localStorage.getItem("token"); // Check if the user is logged in
    if (isLoggedIn) {
      navigate("/category/placement%20guarantee"); // Redirect to Placement Guarantee
    } else {
      navigate("/login"); // Redirect to Login
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`homepage-home ${theme}`}>
          <div className="content-home">
            {/* Full-Screen Video Background */}
            {videoUrl && (
              <video className="background-video-home" autoPlay loop muted playsInline>
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}

            <div className="text-content-home">
              <h1>
                Welcome to <span className="coursera-home">My Turn India</span>
                
              </h1>
              <h2>Your Gateway to Learning</h2>
              <p className="description-home">
              My Turn India offers specialized tech, finance, and placement guarantee courses to help you advance your career and secure job opportunities.
              </p>
              <button className="cta-button-home" onClick={handleClick}>
                <FaRocket className="cta-icon-home" />
                Start Learning
              </button>
            </div>
          </div>

          <section className="course-categories-home">
            {courseCategories.map((category, index) => (
              <div key={index} className="course-category-home">
                <div className="category-header-home">
                  <div>
                    <h3 className="category-title-home">{category.name}</h3>
                    <p className="category-description-home">{category.description}</p>
                  </div>
                  <Link to={`/category/${category.name.toLowerCase()}`} className="see-more-link-home">
                    See More Courses
                  </Link>
                </div>
                <div className="course-cards-home">
                  {category.courses.slice(0, 3).map((course, index) => (
                    <div key={index} className="course-card-home">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/${course.banner}`}
                        alt="course"
                      />
                      <h4>{course.title}</h4>
                      <p>
                        <strong>Educator :</strong> {course.educator}
                      </p>
                      <p>{course.averageRating} Star | {course.reviews.length} reviews</p>
                     
                      <p>{course.level}</p>
                      <p>
                        <strong>Skills: </strong>{course.skill}
                      </p>
                      <button
                        className="cta-button-home"
                        onClick={() => {
                          window.location.href = `/course-Details/${course._id}`;
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </>
  );
};

export default HomePage;
