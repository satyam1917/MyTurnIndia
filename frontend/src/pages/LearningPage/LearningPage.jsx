import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./LearningPage.css";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Loading from "../../Components/Loading";
import done from "../../assets/done.gif";
import { ToastContainer, toast } from 'react-toastify';
import VideoPlayer from "../../Components/VideoPlayer";

const Course = ({ theme }) => {
  const courseId = useParams().courseId;
  const [lectures, setLectures] = useState(null);
  //const [activeTab, setActiveTab] = useState("content");
  const [activeLecture, setActiveLecture] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch courses for a specific category
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/course-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Brear " + Cookies.get('token'),
      },
      body: JSON.stringify({ courseId: courseId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserName(data.lectures.userName);
        setLectures(data.lectures.videos);
        setIsLoading(false);
        setTitle(data.lectures.title);
        setCompletionPercentage(data.lectures.progress);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error); +
          setIsLoading(false);
      });
  }, []);



  // Calculate course completion percentage


  // Handle lecture click to change the active lecture and video
  const handleLectureClick = (index) => {
    setActiveLecture(index);
  };

  // Redirect to Exam Page (Quiz)
  const startQuiz = (quizId) => {
    setIsModalOpen(false);
    navigate(`/exam/${quizId}`);
  };

  const handleBackClick = () => {
    navigate("/my-courses");
  };

  const handleQuizClick = (quizId) => {
    navigate(`/exam/${quizId}`);
  };
  const downloadFileFromURL=(fileURL, filename)=> {
    // Create an anchor element
    const link = document.createElement('a');
    
    // Set the href attribute to the file URL
    link.href = fileURL;
    
    // Set the download attribute to specify the filename
    link.download = filename;

    link.target="_blank";
    
    // Append the anchor to the document body (it’s not necessary to see it)
    document.body.appendChild(link);
    
    // Programmatically trigger a click to start the download
    link.click();
    
    // Remove the anchor element from the document after the click
    document.body.removeChild(link);
  }

  const handleCertificateClick = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/certificate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Brear " + Cookies.get('token'),
      },
      body: JSON.stringify({ courseId: courseId,title:title }),
    })
      .then((response) =>{
        if (response.status === 200) {
          toast.success("Certificate generated successfully");
          downloadFileFromURL(`${import.meta.env.VITE_BACKEND_URL}/certificate/${userName}.png`, 'downloadedFile.pdf');
        } else {
          toast.error("Error generating certificate");
        }
      })
  }

  if (isLoading) {
    return <Loading />
  }
  //const completionPercentage = ((activeLecture + 1) / lectures.length) * 100;
  return (
    <div className={`course-container-lern ${theme}`}>
      <ToastContainer />
      <div className="adjust-class">
        {/* Top Header Section with Back Icon */}
        <div className="course-top-bar-lern">
          <button className="back-button-lern" onClick={handleBackClick}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>

        {/* Header Section */}
        <header className="course-header-lern">
          <h1>{title}</h1>
          <div className="course-progress">
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={completionPercentage}
                text={`${completionPercentage.toFixed(0)}%`}
                styles={buildStyles({
                  textColor: "#333",
                  pathColor: "#007bff",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
            {completionPercentage === 100 && (
              <button className="download-certificate-btn" onClick={() => handleCertificateClick()}>
                Download Certificate
              </button>
            )}
          </div>
        </header>

        {/* Video Section */}
        <div className="course-video-lern">
          {/* <ReactPlayer
          url={import.meta.env.VITE_BACKEND_URL + "/materials/"+lectures[activeLecture].videoUrl}
          controls={true}
          width="100%"
          height="100%"
          className="video-player-lern"
        /> */}
          
          <VideoPlayer src={import.meta.env.VITE_BACKEND_URL + "/materials/"+lectures[activeLecture].videoUrl}/>

        </div>

        {/* Lectures List */}
        <div className="lectures-list-lern">
          {lectures.map((lecture, index) => (
            <div
              key={index}
              className={`lecture-item-lern ${activeLecture === index ? "active" : ""}`}
              onClick={() => handleLectureClick(index)}
            >
              {lecture.title}
            </div>
          ))}
        </div>


        {/* Materials Section */}
        <div className="materials-section-lern">
          <h3>Materials for {lectures[activeLecture].title}</h3>
          <ul>
            {lectures[activeLecture].materials.map((material, index) => (
              <li key={index}>
                <a href={`${import.meta.env.VITE_BACKEND_URL}/materials/${material.link}`} target="_blank" rel="noopener noreferrer" download>
                  {material.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quiz Section */}
        <div className="quiz-container-lern">
          <h3 className="quiz-title">
            Quiz :
            {lectures[activeLecture].quiz ? (
              lectures[activeLecture].isQuizAttempted ? (
                <>
                  {lectures[activeLecture].title} (Marks : {lectures[activeLecture].quizScore + "/" + lectures[activeLecture].maxScore}) <img src={done} alt="done" width="70px" />
                </>
              ) : (
                <a onClick={() => handleQuizClick(lectures[activeLecture].id)} className="quiz-link">
                  {lectures[activeLecture].title}
                </a>
              )
            ) : "No Quiz Available"}
          </h3>

        </div>

        {/* Quiz Modal for Instructions */}
        {isModalOpen && (
          <div className="modal-lern">
            <div className="modal-content-lern">
              <h2>Quiz Instructions</h2>
              <ul>
                <li>Read the questions carefully.</li>
                <li>There is a time limit of 5 minutes to complete the quiz.</li>
                <li>You can only attempt the quiz once.</li>
              </ul>
              <button className="start-quiz-btn-lern" onClick={() => startQuiz(selectedQuiz)}>
                Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;