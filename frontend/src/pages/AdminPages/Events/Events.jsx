import React, { useState } from "react";
import "./paid-event.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
    banner: null,
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: files[0], // Only get the first file
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
      toast.error("Date is required!");
      return;
    }
    if (!eventDetails.banner) {
      toast.error("Banner image is required!");
      return;
    }
    if (!eventDetails.location) {
      toast.error("Location is required!");
      return;
    }

    // Prepare data for file upload
    const formData = new FormData();
    formData.append("title", eventDetails.title);
    formData.append("description", eventDetails.description);
    formData.append("date", eventDetails.date);
    formData.append("banner", eventDetails.banner);
    formData.append("location", eventDetails.location);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/create-unpaid-event`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status) {
        toast.success("Event created successfully!");
        // Clear form after successful submission
        setEventDetails({
          title: "",
          description: "",
          amount: "",
          date: "",
          banner: null,
          location: "",
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
      <h2>Unpaid Event Details</h2>
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
        <div className="paid-events-form-group">
          <label htmlFor="banner">Banner Image</label>
          <input
            type="file"
            id="banner"
            name="banner"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="paid-events-form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventDetails.location}
            onChange={handleInputChange}
            required
            placeholder="Enter event location"
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

export default Events;
