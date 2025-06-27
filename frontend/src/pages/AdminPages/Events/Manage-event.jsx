import React, { useState, useEffect } from "react";
import './Manage-event.css';
import Loading from "../../../Components/Loading";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  const [mode, setMode] = useState(""); // "paid" or "unpaid"
  const [selectedEvent, setSelectedEvent] = useState(""); // Selected event
  const [loading, setLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
    location: "", // Added location field
    amount: "", // Amount field for paid events
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    console.log(mode);
  }, [mode]);

  // Fetch events from the server
  const fetchEvents = async () => {
    console.log(mode);
    setLoading(true);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/events?paid=${mode === "paid"}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    const data = await response.json();
    setEvents(data);
    setLoading(false);
  };

  // Handle mode change (paid/unpaid)
  const handleModeChange = (e) => {
    setMode(e.target.value);
    setSelectedEvent(""); // Reset event selection
    setEventDetails({ title: "", description: "", date: "", image: "", location: "", amount: "" });
  };

  // Handle event change
  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    const event = events.find((event) => event._id === selectedId);
    setSelectedEvent(selectedId);

    if (event) {
      setEventDetails({
        title: event.title,
        description: event.description,
        date: event.date,
        image: event.banner,
        location: event.location, // Set the location from the event
        amount: event.isPaid ? event.amount : "", // Amount field should be empty for unpaid events
      });
    }
  };

  // Handle input changes (title, description, date, image, location, amount)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle submit (saving event details)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      title: eventDetails.title,
      description: eventDetails.description,
      date: eventDetails.date,
      banner: eventDetails.image,
      location: eventDetails.location, // Include location in the event data
      isPaid: mode === "paid",
      amount: eventDetails.amount || 0,
    };

    if (selectedEvent) {
      await updateEvent(selectedEvent, eventData);
    }
  };

  // API call to update an existing event
  const updateEvent = async (eventId, eventData) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(eventData),
    });
    const data = await response.json();
    alert('Event updated!');
    fetchEvents();
  };

  // API call to delete an event
  const deleteEvent = async (eventId) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("token")}`,
      }
    });
    if (response.ok) {
      alert('Event deleted!');
      fetchEvents();
    } else {
      alert('Failed to delete event!');
    }
  };

  return (
    <div className="manage-event-container">
      <h2>Manage Event</h2>

      <form className="manage-event-form" onSubmit={handleSubmit}>
        {/* Mode Dropdown (Paid/Unpaid) */}
        <div className="manage-event-form-group">
          <label htmlFor="mode">Event Mode:</label>
          <select
            id="mode"
            value={mode}
            onChange={handleModeChange}
            required
          >
            <option value="">Select Mode</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Event Dropdown (Shows after selecting mode) */}
        {mode && (
          <div className="manage-event-form-group">
            <label htmlFor="event">Select Event:</label>
            <select
              id="event"
              value={selectedEvent}
              onChange={handleEventChange}
              required
            >
              <option value="">Select an Event</option>
              {events
                .filter((event) => event.isPaid === (mode === "paid"))
                .map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Event Details (Shown after selecting an event) */}
        {selectedEvent && (
          <>
            <div className="manage-event-form-group">
              <label htmlFor="title">Event Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={eventDetails.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="manage-event-form-group">
              <label htmlFor="description">Event Description:</label>
              <textarea
                id="description"
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="manage-event-form-group">
              <label htmlFor="date">Event Date:</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={eventDetails.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="manage-event-form-group">
              <label htmlFor="image">Event Image URL:</label>
              <input
                type="text"
                id="image"
                name="image"
                value={eventDetails.image}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Location Input */}
            <div className="manage-event-form-group">
              <label htmlFor="location">Event Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={eventDetails.location}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Amount (only for paid events) */}
            {mode === "paid" && (
              <div className="manage-event-form-group">
                <label htmlFor="amount">Event Amount (₹):</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={eventDetails.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="manage-event-form-group">
              <button className="manage-event-button" type="submit">Save Event</button>
            </div>
          </>
        )}
      </form>
      <br></br>
      {/* Delete Button for selected event */}
      {selectedEvent && (
        <div className="manage-event-form-group">
          <button
            className="manage-event-button"
            onClick={() => deleteEvent(selectedEvent)}
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
