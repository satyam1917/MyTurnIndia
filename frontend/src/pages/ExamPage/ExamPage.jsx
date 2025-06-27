import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Loading from "../../Components/Loading";
import "./ExamPage.css";

const ExamPage = () => {
  const quizId = useParams().quizId;
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // Default is 5 minutes (300 seconds)
  const [answers, setAnswers] = useState({});
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/quizzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
      body: JSON.stringify({ videoId: quizId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.quizzes);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
      });
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // Submit automatically when time is over
    } else {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer); // Clean up the interval on component unmount
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    setIsExamFinished(true);

    // Ensure that each question has an answer, even if it's 'no answer'
    const finalAnswers = questions.reduce((acc, question) => {
      acc[question.id] = answers[question.id] || "no answer";
      return acc;
    }, {});

    const payload = {
      videoId: quizId,
      answers: finalAnswers,
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/submit-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate("/learning/" + data.data.quizResults.courseId);
        } else {
          console.error("Failed to submit quiz:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="exam-page-container">
      <div className="exam-header">
        <h1 className="exam-title">Quiz Exam</h1>
        <div className="timer">
          <p>
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </p>
        </div>
      </div>

      <div className="questions-container">
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <h2>{question.question}</h2>
            <div className="options">
              {question.options.map((option, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="submit-container">
        <button
          className={`submit-btn ${isExamFinished ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={isExamFinished || timeLeft === 0}
        >
          {isExamFinished ? "Exam Submitted" : "Finish Exam"}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
