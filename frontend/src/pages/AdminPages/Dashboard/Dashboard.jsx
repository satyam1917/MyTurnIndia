import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Cookies from "js-cookie";
import Loading from "../../../Components/Loading";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./Dashboard.css"; // Import the CSS file for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlySalesData, setMonthlySalesData] = useState(null);
  const [yearlySalesData, setYearlySalesData] = useState(null);
  const [bestSellingCourses, setBestSellingCourses] = useState(null);
  const [salesData, setSalesData] = useState({
    monthly: [],
    yearly: [],
  });

  // Fetch course and sales data from the backend API
  useEffect(() => {
    const fetchCourseData = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/sales-and-revenue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + Cookies.get('token'),
        },
      });
      const data = await response.json();
      return data.courses;
    };

    const fetchSalesData = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/monthly-and-yearly-sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + Cookies.get('token'),
        },
      });
      const data = await response.json();
      return {
        monthly: data.monthly || [],  // Default to empty array if no data
        yearly: data.yearly || [],    // Default to empty array if no data
      };
    };

    const loadData = async () => {
      const courseDataFromServer = await fetchCourseData();
      setCourseData(courseDataFromServer);
      const salesDataFromServer = await fetchSalesData();
      setSalesData(salesDataFromServer);

      setMonthlySalesData({
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
          {
            label: "Monthly Revenue (in ₹)",
            data: salesDataFromServer.monthly,
            backgroundColor: "#3498db",
            borderColor: "#2980b9",
            borderWidth: 1,
          },
        ],
      });

      setYearlySalesData({
        labels: ["2022", "2023", "2024", "2025"],
        datasets: [
          {
            label: "Yearly Revenue (in ₹)",
            data: salesDataFromServer.yearly,
            backgroundColor: ["#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      });

      setBestSellingCourses({
        labels: courseDataFromServer.map((course) => course.title),
        datasets: [
          {
            label: "Course Sales",
            data: courseDataFromServer.map((course) => course.sales),
            backgroundColor: "#2ecc71",
            borderColor: "#27ae60",
            borderWidth: 1,
          },
        ],
      });

      setIsLoading(false);  // Stop loading spinner
    };

    loadData(); // Fetch the data and load into the state

  }, []); // Empty array ensures this runs only on mount

  // Ensure the data is ready before rendering the charts
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard. Here you can track sales and course performance.</p>
      </div>

      <div className="chart-container">
        {/* Conditionally render Monthly Sales Bar Chart */}
        {monthlySalesData && (
          <div className="chart-card">
            <h3>Monthly Revenue</h3>
            <Bar data={monthlySalesData} options={{ responsive: true }} />
          </div>
        )}

        {/* Conditionally render Yearly Sales Pie Chart */}
        {yearlySalesData && (
          <div className="chart-card">
            <h3>Yearly Revenue</h3>
            <Pie data={yearlySalesData} options={{ responsive: true }} />
          </div>
        )}

        {/* Conditionally render Best Selling Courses Bar Chart */}
        {bestSellingCourses && (
          <div className="chart-card">
            <h3>Best Selling Courses</h3>
            <Bar data={bestSellingCourses} options={{ responsive: true }} />
          </div>
        )}
      </div>

      <div className="course-list-container">
        <h3>Course Performance</h3>
        <div className="course-list">
          {courseData.map((course) => (
            <div className="course-card" key={course._id}>
              <h4>{course.title}</h4>
              <p><strong>Sales:</strong> {course.sales}</p>
              <p><strong>Revenue:</strong>  ₹{course.revenue}</p>
              {/* <p><strong>Rating:</strong> {course.averageRating || "No ratings yet"}</p>
              <button>View Details</button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
