import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaInfoCircle, FaBullhorn, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { format } from "date-fns";
import "./Events.css";
import Loading from "../../Components/Loading";
import Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';
import Done from "../../assets/done.gif";
import { useNavigate } from "react-router-dom";

const EventsPage = ({theme}) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user  is logged in
  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies
    if (token) {
      if (jwt_decode.jwtDecode(Cookies.get('token')).role !== "admin") {
        fetchEventsWithPurchase();
      } else {
        fetchEvents();
      }
    }
    else {
      fetchEvents();
    }
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

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/get-all-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Brear " + Cookies.get('token'),
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      if (data.status) {

        setEvents(data.events);
        setIsLoading(false);
      }
      else {

      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  const fetchEventsWithPurchase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/events-with-purchased-tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Brear " + Cookies.get('token'),
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      if (data.status) {

        setEvents(data.events);
        setIsLoading(false);
      }
      else {

      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  const buyPass = async (id, amount) => {
    const token = Cookies.get('token');
    amount = Math.floor(amount);
    // Step 1: Create an order from the backend
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Brear " + token,
      },
      body: JSON.stringify({ amount }) // Send the amount in the request body
    });

    const data = await response.json(); // Parse the JSON response from the server
    console.log(data);
    if (data.message == "Unauthorize user") {
      navigate("/login");
    }

    // Step 2: Set up Razorpay options with the order details
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay key ID
      amount: data.order.amount, // Amount in paise
      currency: data.order.currency,
      order_id: data.order.id,
      handler: async function (response) {
        // Step 3: Verify the payment on the server after user completes payment
        const verificationResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/verify-event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Brear " + token,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            eventId: id,
            amount: amount
          })
        });

        const verificationData = await verificationResponse.json();

        if (verificationData.success) {
          navigate("/events");
        } else {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: data.user.name,
        email: data.user.email
      },
      theme: {
        color: "#F37254"
      }
    };

    // Step 4: Open the Razorpay checkout window
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={`events-page ${theme}`}>
      <div className="events-hero">
      <header className="header-events">
        <div className="header-overlay">
          <h1>Upcoming Events & Announcements</h1>
          <p>Stay updated with our latest events, announcements, and community activities.</p>
          <a href="#events" className="cta-button">Explore Events</a>
        </div>
      </header>

      {/* Paid Events Section */}
      <section className="events-section" id="paid-events">
        <h2>Paid Events</h2>
        <div className="events-container">
          {events
            .filter(event => event.type === "paid")
            .map((event, index) => (
              <div key={index} className="event-card-user">
                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${event.image}`} alt={event.title} />
                <div className="card-content">
                  <h3>{event.title}</h3>
                  <p><FaCalendarAlt /> {format(new Date(event.date), "MMMM dd, yyyy h:mm aa")}</p>
                  <p><FaInfoCircle /> {event.description}</p>
                  <p><FaMapMarkerAlt /> Location: {event.location}</p>
                  <p><FaRupeeSign /> Amount: {event.amount}</p>
                  {event.isPurchased ? (
                    <div className="pass-status">
                      <h4 className="purchased-label"> Purchased</h4>
                      <img src={Done} alt="Done" />
                    </div>
                  ) : (
                    <button className="buy-pass-button" onClick={() => buyPass(event.id, event.amount)}>Buy Event Pass</button>
                  )
                  } 
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Unpaid Events Section */}
      <section className="events-section" id="unpaid-events">
        <h2>Unpaid Events</h2>
        <div className="events-container">
          {events
            .filter(event => event.type === "unpaid")
            .map((event, index) => (
              <div key={index} className="event-card-user">
                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${event.image}`} alt={event.title} />
                <div className="card-content">
                  <h3>{event.title}</h3>
                  <p><FaCalendarAlt /> {format(new Date(event.date), "MMMM dd, yyyy h:mm aa")}</p>
                  <p><FaInfoCircle /> {event.description}</p>
                  <p><FaMapMarkerAlt /> Location: {event.location}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <h2><FaBullhorn /> Announcements</h2>
        <div className="announcements-container">
          {announcements.map((announcement, index) => (
            <div key={index} className="announcement-card">
              <h3>{announcement.title}</h3>
              <p><FaCalendarAlt /> {format(new Date(announcement.date), "MMMM dd, yyyy")}</p>
              <p><FaInfoCircle /> {announcement.description}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};

export default EventsPage;
