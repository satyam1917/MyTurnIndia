import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; // Import the CSS
import Cookies from 'js-cookie';
import Loading from '../../Components/Loading';

const Profile = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState(" ");
  
  const [isEditable, setIsEditable] = useState(false);
  const [imageUploadInProgress, setImageUploadInProgress] = useState(false); // Track the upload progress

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUploadInProgress(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        // Send the image to the server
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/upload-profile-image`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + Cookies.get('token'),
          },
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setImage(data.fileName); // Assuming the server returns the updated image URL
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // alert('An error occurred while uploading the image.');
      } finally {
        setImageUploadInProgress(false);
      }
    }
  };

  const toggleEdit = async() => {
    if(isEditable){
      try {
        // Send the image to the server
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/upload-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get('token'),
          },
          body: JSON.stringify({name,email,phone}),
        });

        const data = await response.json();
        if (data.success) {
          alert('Changes saved successfully!');
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // alert('An error occurred while uploading the image.');
      }
    }
    setIsEditable(!isEditable);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/user-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Cookies.get('token'),
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setPhone(data.user.phone);
          setName(data.user.name);
          setEmail(data.user.email);
          setImage(data.user.profileImage); // Assuming the user data includes the profile image URL
          setIsLoading(false);
        }
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={`profile-container ${theme}`}>
      <div className="profile-card">
        <h1 className="profile-title">Profile Details</h1>

        <div className="profile-header">
        <div className="profile-pic-container" style={{ position: "relative", textAlign: "center" }}>
  {!image && (
    <div
      className="add-image-placeholder"
      onClick={() => document.getElementById("file-input").click()}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "180px",
        width: "180px",
        border: "2px dashed #ccc",
        borderRadius: "50%",
        cursor: "pointer",
        backgroundColor: "#f9f9f9",
        color: "#666",
      }}
    >
      <span>Add Image</span>
    </div>
  )}

  {image && (
    <img
      src={import.meta.env.VITE_BACKEND_URL + "/images/"+image}
      alt="Profile"
      className="profile-picture"
      style={{
        height: "180px",
        width: "180px",
        borderRadius: "50%",
        objectFit: "cover",
        cursor: "pointer",
      }}
      onClick={() => document.getElementById("file-input").click()}
    />
  )}

  <input
    type="file"
    name='profileImage'
    id="file-input"
    className="file-input"
    onChange={handleImageUpload}
    accept="image/*"
    style={{ display: "none" }}
    disabled={imageUploadInProgress} // Disable during upload
  />

  {imageUploadInProgress && (
    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#666" }}>
      Uploading...
    </p>
  )}
</div>

          <div className="profile-info">
            <h2 className="profile-name">
              {isEditable ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="editable-input"
                />
              ) : (
                <span>{name}</span>
              )}
            </h2>
            <p className="profile-email">{email}</p>
            <p className="profile-phone">
              {isEditable ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="editable-input"
                />
              ) : (
                <span>{phone}</span>
              )}
            </p>
          </div>
        </div>

        <div className="edit-toggle">
          <button className="edit-btn" onClick={toggleEdit}>
            {isEditable ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
