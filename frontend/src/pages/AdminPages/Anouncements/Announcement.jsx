import React, { useState } from "react";
import "./Announcement.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Announcement = () => {
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!eventDetails.title) {
      toast.error("Title is required!");
      return;
    }
    if (!eventDetails.description) {
      toast.error("Description is required!");
      return;
    }
    if (!eventDetails.date) {
      toast.error("Date and Time is required!");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/announcement/create`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          title: eventDetails.title,
          description: eventDetails.description,
          date: eventDetails.date,
        }),
      });

      const result = await response.json();
      console.log(result);
      if (result.status) {
        toast.success("Announcement added successfully!");
        // Clear form after successful submission
        setEventDetails({
          title: "",
          description: "",
          date: "",
        });
      } else {
        toast.error(result.message || "Failed to create event!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="paid-events-container">
      <h2>Add Announcement</h2>
      <form className="paid-events-form" onSubmit={handleSubmit}>
        <div className="paid-events-form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventDetails.title}
            onChange={handleInputChange}
            required
            placeholder="Enter event title"
          />
        </div>
        <div className="paid-events-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventDetails.description}
            onChange={handleInputChange}
            required
            placeholder="Enter event description"
          />
        </div>
        
        <div className="paid-events-form-group">
          <label htmlFor="date">Date</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={eventDetails.date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button className="paid-events-button" type="submit">
          Save Event
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Announcement;
