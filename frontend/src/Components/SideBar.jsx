import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon from react-icons
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as jwt_decode from 'jwt-decode';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [showEventsDropdown, setShowEventsDropdown] = useState(false); // State for Events dropdown
  const [showAnnouncementsDropdown, setShowAnnouncementsDropdown] = useState(false); // State for Announcements dropdown
  const [showresourcesDropdown, setShowresourcesDropdown] = useState(false); // State for Announcements dropdown

  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (token) {
      if (jwt_decode.jwtDecode(Cookies.get('token')).role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsLoggedIn(true); // If token exists, user is logged in
    } else {
      setIsLoggedIn(false); // Otherwise, the user is not logged in
    }
  }, []); // Empty dependency array to run this effect only once when the component mounts

  const sidebarStyle = {
    width: "250px",
    background: "#2c3e50",
    color: "white",
    padding: "20px",
    height: "100vh",
    position: "fixed",
    display: "flex",
    flexDirection: "column", // Flex column to align items vertically
    justifyContent: "space-between", // Space between top links and logout section
    left: 0,
    top: 0,
  };

  const linkStyle = {
    color: "#ecf0f1",
    textDecoration: "none",
    display: "block",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "4px",
  };

  const activeStyle = {
    backgroundColor: "#34495e",
  };

  const dropdownStyle = {
    display: showCoursesDropdown ? "block" : "none",
    marginLeft: "20px",
    marginTop: "5px",
    backgroundColor: "#34495e",
    borderRadius: "4px",
    padding: "10px",
  };

  const eventsDropdownStyle = {
    display: showEventsDropdown ? "block" : "none", // Dropdown display for events
    marginLeft: "20px",
    marginTop: "5px",
    backgroundColor: "#34495e",
    borderRadius: "4px",
    padding: "10px",
  };

  const announcementsDropdownStyle = {
    display: showAnnouncementsDropdown ? "block" : "none", // Dropdown display for announcements
    marginLeft: "20px",
    marginTop: "5px",
    backgroundColor: "#34495e",
    borderRadius: "4px",
    padding: "10px",
  };
  const resourcesDropdownStyle = {
    display: showresourcesDropdown ? "block" : "none", // Dropdown display for announcements
    marginLeft: "20px",
    marginTop: "5px",
    backgroundColor: "#34495e",
    borderRadius: "4px",
    padding: "10px",
  };

  const dropdownLinkStyle = {
    color: "#ecf0f1",
    textDecoration: "none",
    display: "block",
    margin: "5px 0",
    padding: "5px",
    borderRadius: "4px",
  };

  const logoutSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "auto",
    cursor: "pointer",
    color: "#ecf0f1",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#e74c3c",
    textAlign: "center",
  };

  if (!isAdmin || !isLoggedIn) {
    navigate("/"); // Redirect if not an admin or not logged in
  } else {
    return (
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white" }}>Admin Panel</h2>
          <NavLink
            to="/admin/dashboard"
            style={linkStyle}
            activeStyle={activeStyle}
          >
            Dashboard
          </NavLink>
          <NavLink to="/admin/revenue" style={linkStyle} activeStyle={activeStyle}>
            Revenue
          </NavLink>

          {/* Courses with Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowCoursesDropdown(true)}
            onMouseLeave={() => setShowCoursesDropdown(false)}
          >
            <span style={{ ...linkStyle, cursor: "pointer" }}>Courses</span>
            <div style={dropdownStyle}>
              <NavLink
                to="/admin/manage-courses"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Manage Courses
              </NavLink>
              <NavLink
                to="/admin/create-course"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Create Courses
              </NavLink>
              <NavLink
                to="/admin/upload-videos"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Upload Videos
              </NavLink>
            </div>
          </div>

          {/* Events with Paid/Unpaid Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowEventsDropdown(true)}
            onMouseLeave={() => setShowEventsDropdown(false)}
          >
            <span style={{ ...linkStyle, cursor: "pointer" }}>Events</span>
            <div style={eventsDropdownStyle}>
              <NavLink
                to="/admin/events/manage-events"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Manage Events
              </NavLink>
              <NavLink
                to="/admin/events/paid"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Paid Events
              </NavLink>
              <NavLink
                to="/admin/events/unpaid"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Unpaid Events
              </NavLink>
            </div>
          </div>

          {/* Announcements Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowAnnouncementsDropdown(true)}
            onMouseLeave={() => setShowAnnouncementsDropdown(false)}
          >
            <span style={{ ...linkStyle, cursor: "pointer" }}>Announcements</span>
            <div style={announcementsDropdownStyle}>
              <NavLink
                to="/admin/announcements/manage-announcements"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Manage Announcements
              </NavLink>
              <NavLink
                to="/admin/announcements/create-announcements"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Create Announcements
              </NavLink>
            </div>
          </div>

          <NavLink to="/admin/feedback" style={linkStyle} activeStyle={activeStyle}>
            Feedback
          </NavLink>
          <NavLink
            to="/admin/mail-sender"
            style={linkStyle}
            activeStyle={activeStyle}
          >
            Mail Sender
          </NavLink>
          {/* <NavLink
            to="/admin/resources"
            style={linkStyle}
            activeStyle={activeStyle}
          >
            Resources
          </NavLink> */}
          {/* Resources Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowresourcesDropdown(true)}
            onMouseLeave={() => setShowresourcesDropdown(false)}
          >
            <span style={{ ...linkStyle, cursor: "pointer" }}>Resources</span>
            <div style={resourcesDropdownStyle}>
              <NavLink
                to="/admin/resources"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Update Resources
              </NavLink>
              <NavLink
                to="/admin/add-member"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Add Member
              </NavLink>
              <NavLink
                to="/admin/delete-member"
                style={dropdownLinkStyle}
                activeStyle={activeStyle}
              >
                Delete Member
              </NavLink>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <NavLink to="/logout" style={logoutSectionStyle}>
          <FaSignOutAlt size={20} />
          Logout
        </NavLink>
      </div>
    );
  }
};

export default Sidebar;
