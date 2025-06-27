import React, { useState } from "react";
import "./Courses.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseAmount, setCourseAmount] = useState("");
  const [courseBanner, setCourseBanner] = useState(null);
  const [coursePrerequisites, setCoursePrerequisites] = useState("");
  const [whoShouldTake, setWhoShouldTake] = useState("");
  const [expiryDays, setExpiryDays] = useState(0);
  const [category, setCategory] = useState("General");
  const [educatorName, setEducatorName] = useState("");
  const [designation, setDesignation] = useState("");
  const [courseLevel, setCourseLevel] = useState("Technology");
  const [skills, setSkills] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [educatorSignature, setEducatorSignature] = useState(null); // State for educator's signature

  // Handle course submission with validation
  const handleSubmitCourse = async () => {
    // Validation checks
    if (!courseName) {
      toast.error("Course Name is required!");
      return;
    }
    if (!courseDescription) {
      toast.error("Course Description is required!");
      return;
    }
    if (!courseAmount || isNaN(courseAmount) || courseAmount <= 0) {
      toast.error("Please enter a valid course amount!");
      return;
    }
    if (!courseBanner) {
      toast.error("Course Banner is required!");
      return;
    }
    if (!coursePrerequisites) {
      toast.error("Prerequisites are required!");
      return;
    }
    if (!whoShouldTake) {
      toast.error("Please specify who should take this course!");
      return;
    }
    if (expiryDays <= 0) {
      toast.error("Please specify a valid expiry date!");
      return;
    }
    if (!educatorName) {
      toast.error("Educator Name is required!");
      return;
    }
    if (!skills) {
      toast.error("Skills are required!");
      return;
    }
    if (!designation) {
      toast.error("Designation is required!");
      return;
    }
    // Create FormData object to send data, including the file
    const formData = new FormData();
    formData.append('title', courseName);
    formData.append('description', courseDescription);
    formData.append('category', category);
    formData.append('educator', educatorName);
    formData.append('level', courseLevel);
    formData.append('skill', skills);
    formData.append('price', courseAmount);
    formData.append('expiresDays', expiryDays);
    formData.append('isLive', isLive);
    formData.append('designation', designation);
    formData.append('prerequisites', coursePrerequisites);
    formData.append('whoShouldTake', whoShouldTake);
    
    // Append the files to the array (for Multer's handling)
    if (courseBanner) {
      formData.append('files[]', courseBanner);  // Banner file
    }
    else{
      toast.error("Course Banner is required!");
      return;
    }
    if (educatorSignature) {
      formData.append('files[]', educatorSignature);  // Educator signature file
    }
    else{
      toast.error("Educator Signature is required!");
      return;
    }

    try {
      // Send POST request to the server to create the course
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.status) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the course.");
    }
  };

  return (
    <div className="course-container">
      <h1>Add Course</h1>
      <div className="course-form">
        {/* Basic Details */}
        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            placeholder="Enter course name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course Description</label>
          <textarea
            placeholder="Enter course description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course Amount</label>
          <input
            type="number"
            placeholder="Enter course amount"
            value={courseAmount}
            onChange={(e) => setCourseAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course Banner</label>
          <input
            name="banner"
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={(e) => setCourseBanner(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Prerequisites</label>
          <textarea
            placeholder="Enter any Prerequisites"
            value={coursePrerequisites}
            onChange={(e) => setCoursePrerequisites(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Who Should Take</label>
          <textarea
            placeholder="Who should take this course?"
            value={whoShouldTake}
            onChange={(e) => setWhoShouldTake(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expiry Date (Days)</label>
          <input
            type="number"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Placement">Placement</option>
          </select>
        </div>

        <div className="form-group">
          <label>Educator Name</label>
          <input
            type="text"
            placeholder="Enter educator name"
            value={educatorName}
            onChange={(e) => setEducatorName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Educator Designation</label>
          <input
            type="text"
            placeholder="Enter educator designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course Level</label>
          <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Skills Covered</label>
          <input
            type="text"
            placeholder="Enter skills (comma-separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />
            Is Live
          </label>
        </div>

        <div className="form-group">
          <label>Educator Signature</label>
          <input
            name="signature"
            type="file"
            accept="image/*"
            onChange={(e) => setEducatorSignature(e.target.files[0])}
          />
        </div>

        <button className="submit-button" onClick={handleSubmitCourse}>
          Submit Course
        </button>
      </div>
    </div>
  );
};

export default Course;
