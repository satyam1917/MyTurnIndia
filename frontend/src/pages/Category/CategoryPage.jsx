import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { FaStar } from 'react-icons/fa'; 
import { BsFillPlayCircleFill } from 'react-icons/bs'; 
import './CategoryPage.css';

const CategoryPage = ({theme}) => {
  const { categoryName } = useParams();

  const [courseCategories, setCourseCategories] = useState([
      {
        name: "Tech",
        description:
          "Explore the latest in technology, programming, software development, and more.",
        courses: [],
      },
      {
        name: "Finance",
        description:
          "Learn the principles of finance, accounting, investments, and financial management.",
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
          console.log(data);
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
      fetchCourses("Finance", 1);
      fetchCourses("Placement", 2);
    }, []); // Empty dependency array ensures this runs once when the component mounts
  

  // Find the category that matches the categoryName from URL params
  const category = courseCategories.find(
    (category) => category.name.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className={`category-page-container-cat ${theme}`}>
      <h2>{category?.name} Courses</h2>
      <p>{category?.description}</p>

      <div className="courses-list-category-cat">
        {category?.courses.map((course, index) => (
          <div key={index} className="course-card-category">
            <img className="course-image" src={`${import.meta.env.VITE_BACKEND_URL}/images/${course.banner}`} alt={course.title} />
            <div className="course-details">
              <h3>{course.title}</h3>
              <p className="organization"><strong>Educator:</strong> {course.educator}</p>
              <div className="rating">
                <FaStar />
                <span>{course.averageRating}/5</span>
              </div>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Skills:</strong> {course.skill}</p>
              <p className="price">₹ {course.price}</p>
              <Link to={`/course-Details/${course._id}`} className="cta-button-category">
                
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
