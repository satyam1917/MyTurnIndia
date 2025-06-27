import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie package
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/logo.png';
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaInfoCircle,
  FaEnvelope,
  FaLaptopCode,
  FaChartLine,
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaBook,
  FaShieldAlt
} from 'react-icons/fa';
import './Navbar.css';
import * as jwt_decode from 'jwt-decode';




/******  571e4a45-4295-48c2-8a1d-4113bbe26516  *******/
const Navbar = ({toggleTheme, theme}) => {
  const location = useLocation(); // Hook to get the current route path
  const navigate = useNavigate(); // Get the navigate function

  // Function to add an active class to the current link
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUser, setIsUser] = useState(false);

  // Check if the token is available in cookies
  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (token) {
      if (jwt_decode.jwtDecode(Cookies.get('token')).role === "admin") {
        setIsUser(false);
      } else {
        setIsUser(true);
      }
      setIsLoggedIn(true); // If token exists, user is logged in
    } else {
      setIsLoggedIn(false); // Otherwise, the user is not logged in
    }
  }, []); // Empty dependency array to run this effect only once when the component mounts

  // Logout function
  const handleLogout = () => {
    Cookies.remove('token'); // Remove the token from cookies
    setIsLoggedIn(false); // Update state to reflect the user is logged out
    navigate('/'); // Navigate to the homepage ("/")
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${theme}`}>
      {/* Left: Logo */}
      <div className="navbar-left">
      <Link to="/about-us">
    <img src={logo} alt="myturnindia" className="logo" />
  </Link>
      </div>

      {/* Center: Links */}
      <ul className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <a href="/" className="nav-link">
            <FaHome className="icon" /> Home
          </a>
        </li>
        <li className="nav-item">
          <div className="nav-link dropdown">
            <span>Courses</span>
            <ul className="dropdown-menu">
              <li>
                <Link to="/category/tech" className={`dropdown-item ${isActive('/category/tech')}`}>
                  <FaLaptopCode className="dropdown-icon" /> Tech Courses
                </Link>
              </li>
              <li>
                <Link to="/category/finance" className={`dropdown-item ${isActive('/category/finance')}`}>
                  <FaChartLine className="dropdown-icon" /> Finance Courses
                </Link>
              </li>
              <li>
                <Link to="/category/placement guarantee" className={`dropdown-item ${isActive('/category/finance')}`}>
                  <FaShieldAlt className="dropdown-icon" /> Placement Guarantee Courses
                </Link>
              </li>
            </ul>
          </div>
        </li>
        
        <li className="nav-item">
          <a href="/events" className="nav-link">
            <FaInfoCircle className="icon" /> Events
          </a>
        </li>
        {isLoggedIn && isUser && (
          <>
            <li className="nav-item">
              <a href="/my-courses" className="nav-link">
                <FaBook className="icon" /> My Courses
              </a>
            </li>
           
            <li className="nav-item">
              <a href="/profile" className="nav-link">
                <FaUserCircle className="icon" /> Profile
              </a>
            </li>

            

          </>
        )}

<li className="nav-item">
          <a href="/about-us" className="nav-link">
            <FaInfoCircle className="icon" /> About Us
          </a>
        </li>
        <li className="nav-item">
          <a href="/contact-us" className="nav-link">
            <FaEnvelope className="icon" /> Contact Us
          </a>
        </li>

        

        {isLoggedIn && !isUser && (
          <>
            <li className="nav-item">
              <a href="/admin" className="nav-link">
                <FaBook className="icon" />Admin
              </a>
            </li>
          </>
        )}

<button className="theme-toggle-btn" onClick={toggleTheme}>
  {theme === "light" ? (
    <FaMoon className="icon" />
  ) : (
    <FaSun className="icon" />
  )}
</button>
      </ul>

      {/* Right: Buttons */}
      <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
        {!isLoggedIn ? (
          <>
            <a href="/login" className="btn login-btn">
              <FaSignInAlt className="icon" /> Login
            </a>
            <a href="/register" className="btn register-btn">
              <FaUserPlus className="icon" /> Register
            </a>
          </>
        ) : (
          <button className="btn login-btn" onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> Logout
          </button>
        )}
      </div>

      {/* Hamburger Icon for Small Screens */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
