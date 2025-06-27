import React, { useState } from "react";
import "./Resources.css";
import Cookies from "js-cookie";
import {toast, ToastContainer} from 'react-toastify';

const AddMember = () => {

  // State to store new member's details
  const [newMember, setNewMember] = useState({
    imageFile: null, // Storing the file object
    name: "",
    position: "",
    message: "",
  });


  // Handle input changes for new member
  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a file URL for the preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMember((prev) => ({
          ...prev,
          imageFile: file, // Store the file object
          imagePreview: reader.result, // Store the preview URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add the new member to the founders list
  const handleAddMember = () => {
    const formData = new FormData();
    if (!newMember.imageFile) {
      toast.error("Please select an image file.");
      return;
    }
    if (!newMember.name) {
      toast.error("Please enter a name.");
      return;
    }
    if (!newMember.position) {
      toast.error("Please enter a position.");
      return;
    }
    if (!newMember.message) {
      toast.error("Please enter a message.");
      return;
    }
    formData.append("image", newMember.imageFile);
    formData.append("name", newMember.name);
    formData.append("position", newMember.position);
    formData.append("message", newMember.message);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/resource/add-founder`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${Cookies.get("token")}`,  
      }
    }).then((res) => res.json()).then((data) => {
      if (data.status) {
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
    });
    // Reset the new member input fields
    setNewMember({
      imageFile: null,
      name: "",
      position: "",
      message: "",
      imagePreview: null,
    });
  };

  return (
    <div className="add-member-container">
    <ToastContainer/>
      <h2>Add New Member</h2>

      {/* Input fields for new member */}
      <div className="add-member-form">
        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {newMember.imagePreview && (
          <div className="image-preview">
            <img
              src={newMember.imagePreview}
              alt="Preview"
              className="image-preview-img"
            />
          </div>
        )}

        <input
          type="text"
          name="name"
          value={newMember.name}
          onChange={handleNewMemberChange}
          placeholder="Founder Name"
        />
        <input
          type="text"
          name="position"
          value={newMember.position}
          onChange={handleNewMemberChange}
          placeholder="Founder Position"
        />
        <textarea
          name="message"
          value={newMember.message}
          onChange={handleNewMemberChange}
          placeholder="Founder Message"
          rows="4"
        />
        <button style={{color:"red"}} onClick={handleAddMember}>Add Member</button>
      </div>


    </div>
  );
};

export default AddMember;
