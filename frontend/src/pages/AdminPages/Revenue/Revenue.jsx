import React, { useState, useEffect } from "react";
import "./Revenue.css";
import Loading from "../../../Components/Loading";
import Cookies from "js-cookie";


const Revenue = () => {
  const [extraCharge, setExtraCharge] = useState(0); // Store the extra charge value
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filteredRevenue, setFilteredRevenue] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/revenue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRevenueData(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching revenue data:", error);
        setIsLoading(false);
      });
  }, []);

  // Adding extra charges to revenue
  const adjustedRevenue = filteredRevenue.map((entry) => ({
    ...entry,
    revenue: entry.revenue + extraCharge,
  }));

  // Calculate the total filtered revenue
  const totalFilteredRevenue = adjustedRevenue.reduce(
    (acc, curr) => acc + curr.revenue,
    0
  );

  // Function to handle extra charge input change
  const handleExtraChargeChange = (e) => {
    setExtraCharge(parseFloat(e.target.value) || 0); // Ensure it's a number
  };

  // Watch for changes in customStartDate and customEndDate to filter revenue dynamically
  useEffect(() => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);

      const filtered = revenueData.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });

      setFilteredRevenue(filtered);
    } else {
      setFilteredRevenue([]); // Clear filtered revenue if dates are invalid
    }
  }, [customStartDate, customEndDate]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="revenue-container">
      <div className="revenue-title">
        <h1>Revenue Dashboard</h1>
        <p>Track your revenue by custom date ranges dynamically.</p>
      </div>

     

      {/* Custom Date Filter */}
      <div className="custom-date-filter">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={customStartDate}
          onChange={(e) => setCustomStartDate(e.target.value)}
        />
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={customEndDate}
          onChange={(e) => setCustomEndDate(e.target.value)}
        />
      </div>

      <div className="total-revenue-container">
        {/* Total Revenue for Selected Date Range */}
        <div className="revenue-card">
          <h3>Total Revenue</h3>
          <p>₹{totalFilteredRevenue.toFixed(2)}</p>
        </div>

        {/* Detailed Revenue Entries */}
        {adjustedRevenue.length > 0 ? (
          <div className="revenue-details">
            <h3>Revenue Details</h3>
            <ul>
              {adjustedRevenue.map((entry, index) => (
                <li key={index}>
                  {entry.date}: ${entry.revenue.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No revenue data available for the selected date range.</p>
        )}
      </div>
    </div>
  );
};

export default Revenue;
