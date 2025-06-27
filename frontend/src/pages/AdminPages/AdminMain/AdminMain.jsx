import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../../Components/SideBar";
import Dashboard from "../Dashboard/Dashboard";
import Revenue from "../Revenue/Revenue";
import Courses from "../Courses/Create_courses/Courses";
import Events from "../Events/Events";
import Feedback from "../Feedback/Feedback";
import MailSender from "../MailSender/MailSender";
import Resources from "../Resources/Resources";
import Upload from "../Courses/Upload_cources/Upload";
import ManageCourse from "../Courses/Manage-courses/Manage-courses";
import PaidEvents from "../Events/paid-event";
import ManageEvents from "../Events/Manage-event";
import ManageAnnouncement from "../Anouncements/ManageAnnouncement";
import Announcement from "../Anouncements/Announcement";
import DeleteResource from "../Resources/DeleteMember";
import AddMember from "../Resources/AddMember";

const AdminMain = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Dynamic content on the right */}
      <div style={{  marginLeft: "250px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/create-course" element={<Courses />} />
          <Route path="/upload-videos" element={< Upload/>} />
          <Route path="/manage-courses" element={< ManageCourse/>} />
          <Route path="/events/paid" element={<PaidEvents />} />
          <Route path="/events/unpaid" element={<Events />} /> 
          <Route path="/events/manage-events" element={<ManageEvents />} /> 
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/mail-sender" element={<MailSender />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/add-member" element={<AddMember/>} />
          <Route path="/delete-member" element={<DeleteResource/>} />
          <Route path="/announcements/manage-announcements" element={<ManageAnnouncement/>}/> 
          <Route path="/announcements/create-announcements" element={<Announcement/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default AdminMain;
