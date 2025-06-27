import React, { useState, useEffect } from "react";
import './ManageAnnouncement.css';
import Loading from "../../../Components/Loading";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const ManageAnnouncement = () => {
  const navigate = useNavigate();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(""); // Selected announcement
  const [isloading, setIsLoading] = useState(false);
  const [announcementDetails, setAnnouncementDetails] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Fetch all announcements from the server
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/announcement/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    const data = await response.json();
    setAnnouncements(data.announcements);
    setIsLoading(false);
  };

  // Handle announcement change
  const handleAnnouncementChange = (e) => {
    const selectedId = e.target.value;
    const announcement = announcements.find((announcement) => announcement._id === selectedId);
    setSelectedAnnouncement(selectedId);

    if (announcement) {
      setAnnouncementDetails({
        title: announcement.title,
        description: announcement.description,
        date: announcement.date,
      });
    }
  };

  // Handle input changes (title, description, date)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle submit (saving announcement details)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const announcementData = {
      title: announcementDetails.title,
      description: announcementDetails.description,
      date: announcementDetails.date,
    };

    if (selectedAnnouncement) {
      await updateAnnouncement(selectedAnnouncement, announcementData);
    }
  };

  // API call to update an existing announcement
  const updateAnnouncement = async (announcementId, announcementData) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/announcement/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        announcementId,
        announcementData
      }),
    });
    const data = await response.json();
    if (data.status) {
      alert('Announcement updated!');
      fetchAnnouncements();
    }
    else {
      alert('Failed to update announcement!');
    }

  };

  // API call to delete an announcement
  const deleteAnnouncement = async (announcementId) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/announcement/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ announcementId }),
    });
    const data= await response.json();
    if (data.status) {
      alert('Announcement deleted!');
      navigate('/admin/announcements/manage-announcements');
    } else {
      alert('Failed to delete announcement!');
    }
  };
  if (isloading) {
    return <Loading />;
  }

  return (
    <div className="manage-announcement-container">
      <h2>Manage Announcement</h2>

      <form className="manage-announcement-form" onSubmit={handleSubmit}>
        {/* Announcement Dropdown */}
        <div className="manage-announcement-form-group">
          <label htmlFor="announcement">Select Announcement:</label>
          <select
            id="announcement"
            value={selectedAnnouncement}
            onChange={handleAnnouncementChange}
            required
          >
            <option value="">Select an Announcement</option>
            {announcements.map((announcement) => (
              <option key={announcement._id} value={announcement._id}>
                {announcement.title}
              </option>
            ))}
          </select>
        </div>

        {/* Announcement Details (Shown after selecting an announcement) */}
        {selectedAnnouncement && (
          <>
            <div className="manage-announcement-form-group">
              <label htmlFor="title">Announcement Title:</label>
              <div >
              <input
              className="des-title"
                type="text"
                id="title"
                name="title"
                value={announcementDetails.title}
                onChange={handleInputChange}
                required
              />
              </div>
            </div>

            <div className="manage-announcement-form-group">
              <label htmlFor="description">Announcement Description:</label>
              <textarea
              className="des-announcement"
                id="description"
                name="description"
                value={announcementDetails.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="manage-announcement-form-group">
              <label htmlFor="date">Announcement Date:</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={announcementDetails.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="manage-announcement-form-group">
              <button className="manage-announcement-button" type="submit">Save Announcement</button>
            </div>
          </>
        )}
      </form>

      {/* Delete Button for selected announcement */}
      {selectedAnnouncement && (
        <div className="manage-announcement-form-group">
          <button
            className="manage-announcement-button"
            onClick={() => deleteAnnouncement(selectedAnnouncement)}
          >
            Delete Announcement
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncement;
