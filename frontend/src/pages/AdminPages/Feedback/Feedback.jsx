import React, { useState, useEffect } from "react";
import "./Feedback.css";
import Cookies from "js-cookie";
import Loading from "../../../Components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const response = fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFeedback(data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSearch = (feedback) => {
    return (
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSort = (a, b) => {
    return sortBy === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  };

  const deleteFeedback = (feedback) => {
    // Replace with your API endpoint for deleting the feedback
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/reviews/${feedback.reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ courseId: feedback.courseId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Remove the deleted feedback from the state
        toast.success("Feedback deleted successfully");
        location.reload();
        // setFeedback((prevFeedback) => prevFeedback.filter((item) => item.id !== id));
      })
      .catch((error) => {
        toast.error("Error deleting feedback");
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="feedback-container">
      <ToastContainer />
      <h1>Manage Feedback</h1>

      {/* Search and Sort Section */}
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by Name or Course"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Feedback Table */}
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course Name</th>
            <th>Rating</th>
            <th>Feedback</th>
            <th>Date</th>
            <th>Actions</th> {/* Action column for delete button */}
          </tr>
        </thead>
        <tbody>
          {feedback
            .filter(handleSearch) // Apply search filter
            .sort(handleSort) // Apply sorting based on selected sort option
            .map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.courseName}</td>
                <td>{feedback.rating}</td>
                <td>{feedback.feedback}</td>
                <td>{feedback.date}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteFeedback(feedback)} // Pass review id to delete function
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;
