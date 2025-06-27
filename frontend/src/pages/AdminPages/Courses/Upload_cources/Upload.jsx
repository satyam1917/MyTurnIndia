import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Upload.css";
import Cookies from 'js-cookie';
import Loading from "../../../../Components/Loading";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({ id: "", title: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState({
    title: "",
    videoFile: null,
    materials: [{ materialTitle: "", materialFile: null }],
    quiz: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('token'),
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCourses(data.courseDetails);
          setIsLoading(false);
        } else {
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
  }, []);

  const notify = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,  // Add this for auto-close functionality
        hideProgressBar: false,
        closeOnClick: true,  // Ensure closeOnClick is true
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const course = courses.find(course => course.id === courseId);
    setSelectedCourse(course || { id: "", title: "" });
  };


  const handleMaterialChange = (materialIndex, e) => {
    const { name, value, files } = e.target;
    const updatedMaterials = [...video.materials];

    // Handling file changes properly
    if (name === "materialTitle") {
      updatedMaterials[materialIndex][name] = value;
    } else if (name === "materialFile" && files.length > 0) {
      updatedMaterials[materialIndex][name] = files[0]; // Correctly set the file here
    }

    setVideo({ ...video, materials: updatedMaterials });
  };

  const handleQuizChange = (quizIndex, e) => {
    const { name, value } = e.target;
    const updatedQuiz = [...video.quiz];

    if (name.startsWith("option")) {
      const optionIndex = parseInt(name.split("-")[1], 10);
      updatedQuiz[quizIndex].options[optionIndex] = value;
    } else {
      updatedQuiz[quizIndex][name] = value;
    }

    setVideo({ ...video, quiz: updatedQuiz });
  };

  const addMaterial = () => {
    const updatedMaterials = [...video.materials, { materialTitle: "", materialFile: null }];
    setVideo({ ...video, materials: updatedMaterials });
  };

  const addQuiz = () => {
    const updatedQuiz = [...video.quiz, { question: "", options: ["", "", "", ""], correctAnswer: "" }];
    setVideo({ ...video, quiz: updatedQuiz });
  };

  const removeQuiz = (quizIndex) => {
    const updatedQuiz = video.quiz.filter((_, index) => index !== quizIndex);
    setVideo({ ...video, quiz: updatedQuiz });
  };

  const removeMaterial = (materialIndex) => {
    const updatedMaterials = video.materials.filter((_, index) => index !== materialIndex);
    setVideo({ ...video, materials: updatedMaterials });
  };

  const handleSubmit = async () => {
    if (!video.title) {
      notify("Please enter a video title", "error");
      return;
    }

    if (!video.videoFile) {
      notify("Please select a video", "error");
      return;
    }

    // Validate materials before submitting
    if (video.materials.some((material) => !material.materialTitle || !material.materialFile)) {
      notify("Please provide valid material information", "error");
      return;
    }

    if (video.quiz.some((quiz) => !quiz.question || !quiz.correctAnswer || quiz.options.some(option => !option))) {
      notify("Please complete all quiz questions and options", "error");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("courseId", selectedCourse.id);
      formData.append("title", video.title);
      formData.append("materials[]", video.videoFile);

      // Append materials
      video.materials.forEach((material, index) => {
        formData.append(`materials[]`, material.materialFile); // File
        formData.append(`materials[]`, material.materialTitle); // Title
      });

      // Append quiz questions
      video.quiz.forEach((quiz, index) => {
        formData.append(`quiz[${index}][question]`, quiz.question);
        quiz.options.forEach((option, optIndex) => {
          formData.append(`quiz[${index}][options][${optIndex}]`, option);
        });
        formData.append(`quiz[${index}][correctAnswer]`, quiz.correctAnswer);
      });

      // Send data to the backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/upload-video`, {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        body: formData,
      });

      const result = await response.json();
      if (result.status) {
        // notify("Video, materials, and quiz uploaded successfully!", "success");
        navigate("/admin/upload-videos");
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      notify("Failed to upload video and materials. Please try again.", "error");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="upload-container">
      <h1>Upload Course Content</h1>
      <div className="upload-section">
        <label className="upload-label">Select Course:</label>
        <select className="upload-select" value={selectedCourse.id} onChange={handleCourseChange}>
          <option value="">Select a course</option>
          {courses.map((course, index) => (
            <option key={index} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <h2>Upload Video</h2>
      <div className="upload-video-container">
        <h3>Video Details</h3>

        <div className="upload-input-group">
          <label>Video Title:</label>
          <input
            type="text"
            name="title"
            className="upload-input"
            placeholder="Enter video title"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
          />
        </div>

        <div className="upload-input-group">
          <label>Video Link:</label>
          <input
            type="file"
            name="videoLink"
            className="upload-input"
            onChange={(e) => setVideo({ ...video, videoFile: e.target.files[0] })}
          />
        </div>

        <h3>Materials</h3>
        {video.materials.map((material, materialIndex) => (
          <div key={materialIndex} className="upload-material-container">
            <div className="upload-input-group">
              <label>Material Title:</label>
              <input
                type="text"
                name="materialTitle"
                className="upload-input"
                placeholder="Enter material title"
                value={material.materialTitle}
                onChange={(e) => handleMaterialChange(materialIndex, e)}
              />
            </div>
            <div className="upload-input-group">
              <label>Upload Material File:</label>
              <input
                type="file"
                name="materialFile"
                className="upload-file"
                onChange={(e) => handleMaterialChange(materialIndex, e)}
              />
            </div>
            <button className="upload-remove-button" onClick={() => removeMaterial(materialIndex)}>
              Remove Material
            </button>
          </div>
        ))}
        <button className="upload-button" onClick={addMaterial}>Add Material</button>

        <h3>Quiz</h3>
        {video.quiz.map((q, quizIndex) => (
          <div key={quizIndex} className="upload-quiz-container">
            <div className="upload-input-group">
              <label>Question:</label>
              <input
                type="text"
                name="question"
                className="upload-input"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => handleQuizChange(quizIndex, e)}
              />
            </div>
            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="upload-input-group">
                <label>Option {optIndex + 1}:</label>
                <input
                  type="text"
                  name={`option-${optIndex}`}
                  className="upload-input"
                  placeholder={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) => handleQuizChange(quizIndex, e)}
                />
              </div>
            ))}
            <div className="upload-input-group">
              <label>Correct Answer:</label>
              <input
                type="text"
                name="correctAnswer"
                className="upload-input"
                placeholder="Enter correct answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuizChange(quizIndex, e)}
              />
            </div>

            {/* Remove Question Button */}
            <button className="upload-remove-button" onClick={() => removeQuiz(quizIndex)}>
              Remove Question
            </button>
          </div>
        ))}
        <button className="upload-button" onClick={addQuiz}>Add Quiz</button>
      </div>

      <button className="upload-button" onClick={handleSubmit}>Submit</button>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default Upload;
