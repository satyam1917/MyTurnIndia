import React, { useState, useEffect } from "react";
import "./MailSender.css";
import Loading from "../../../Components/Loading";
import Cookies from "js-cookie";
import { use } from "react";

// const usersData = [
//   { id: 1, name: "John Doe", email: "john.doe@example.com", course: "React" },
//   { id: 2, name: "Jane Smith", email: "jane.smith@example.com", course: "Angular" },
//   { id: 3, name: "Alex Johnson", email: "alex.johnson@example.com", course: "React" },
//   { id: 4, name: "Emily Davis", email: "emily.davis@example.com", course: "Vue" },
//   { id: 5, name: "Michael Brown", email: "michael.brown@example.com", course: "Angular" },
// ];

const MailSender = () => {
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    const response = fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/mailsender`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }).then((res) => res.json()).then((data) => {
      console.log(data.data);
      setUsersData(data.data);
      setIsLoading(false);
    })
  }, []);

  const filteredUsers =
    selectedCourse === "All"
      ? usersData
      : usersData.filter((user) => user.course === selectedCourse);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSendEmail = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }

    const selectedEmails = usersData
      .filter((user) => selectedUsers.includes(user.id))
      .map((user) => user.email)
      .join(",");

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEmails}`;
    window.open(gmailLink, "_blank");
  };

  if(isLoading){
    return <Loading/>;
  }

  return (
    <div className="mail-sender-container">
      <h2>Bulk Mail & Messaging System</h2>
      <p>Filter users by course and select recipients:</p>

      <div className="filter-container">
        <label htmlFor="course-filter">Filter by Course:</label>
        <select
          id="course-filter"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="All">All Courses</option>
          <option value="React">React</option>
          <option value="Angular">Angular</option>
          <option value="Vue">Vue</option>
        </select>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.course}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="send-email-btn" onClick={handleSendEmail}>
        Send Email
      </button>
    </div>
  );
};

export default MailSender;
