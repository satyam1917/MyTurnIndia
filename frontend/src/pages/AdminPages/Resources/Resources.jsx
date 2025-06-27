import React, { useState, useEffect } from "react";
import "./Resources.css";
import Cookies from "js-cookie";
import Loading from "../../../Components/Loading";

const Resource = () => {
  const [aboutUs, setAboutUs] = useState("");
  const [founders, setFounders] = useState([]);
  const [contactInfo, setContactInfo] = useState({});
  const [homeVideoURL, setHomeVideoURL] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null); 

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/resource/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          const resource = data.resources[0]; // Assuming we have a single resource
          setId(resource._id);
          setAboutUs(resource.whoWeAre);
          setFounders(resource.teams);
          setContactInfo({
            phone: resource.mobile,
            email: resource.email,
            socialLinks: {
              instagram: resource.instagram,
              twitter: resource.twitter,
              facebook: resource.facebook,
              linkedin: resource.linkedin,
            },
          });
          setHomeVideoURL(resource.video);
          setIsLoading(false);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle the input changes for the founders, contact info, and about us
  const handleFounderChange = (index, field, value) => {
    const updatedFounders = [...founders];
    updatedFounders[index][field] = value;
    setFounders(updatedFounders);
  };

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setContactInfo((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAboutUsChange = (e) => {
    setAboutUs(e.target.value);
  };

  const handleHomeVideoChange = (e) => {
    setHomeVideoURL(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSave = () => {
    const updatedData = {
      _id: id,
      whoWeAre: aboutUs,
      mobile: contactInfo.phone,
      email: contactInfo.email,
      instagram: contactInfo.socialLinks.instagram,
      twitter: contactInfo.socialLinks.twitter,
      facebook: contactInfo.socialLinks.facebook,
      linkedin: contactInfo.socialLinks.linkedin,
      video: homeVideoURL,
      teams: founders,
    };


    // Send updated data to the API
    fetch(`${import.meta.env.VITE_BACKEND_URL}/resource/`, {
      method: "PUT", // or "PATCH" depending on your API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({updatedData}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          alert("Changes saved successfully!");
        } else {
          alert("Error saving changes.");
        }
      })
      .catch((error) => console.error("Error saving data:", error));

    setIsEditable(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="resource-container">
      {/* About Us Section */}
      <section className="about-us">
        <h2>Who We Are</h2>
        <textarea
          className="editable-textarea"
          value={aboutUs}
          onChange={handleAboutUsChange}
          rows="5"
          disabled={!isEditable}
        />
      </section>

      {/* Meet Our Founders Section */}
      <div className="founders">
        <h3>Meet Our Founders</h3>
        <div className="founders-list">
          {founders.map((founder, index) => (
            <div key={index} className="founder-card">
              <div className="founder-image-container">
                <img
                  src={import.meta.env.VITE_BACKEND_URL + "/images/"+founder.imageUrl}
                  alt={founder.name}
                  className="founder-image"
                />
                {/* {isEditable && (
                  <div className="edit-photo">
                    <input
                      type="url"
                      value={founder.imageUrl}
                      onChange={(e) =>
                        handleFounderChange(index, "imageUrl", e.target.value)
                      }
                      placeholder="Paste Image URL"
                      className="image-input"
                    />
                    <button className="upload-btn">Upload Photo</button>
                  </div>
                )} */}
              </div>

              <div className="founder-details">
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) =>
                    handleFounderChange(index, "name", e.target.value)
                  }
                  placeholder="Founder Name"
                  className="founder-name"
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  value={founder.position}
                  onChange={(e) =>
                    handleFounderChange(index, "position", e.target.value)
                  }
                  placeholder="Role"
                  className="founder-role"
                  disabled={!isEditable}
                />
                <textarea
                  value={founder.message}
                  onChange={(e) =>
                    handleFounderChange(index, "message", e.target.value)
                  }
                  placeholder="Founder Description"
                  rows="4"
                  className="founder-description"
                  disabled={!isEditable}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us Section */}
      <section className="contact-us">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <input
            type="text"
            value={contactInfo.phone}
            onChange={(e) => handleContactChange("phone", e.target.value)}
            placeholder="Phone Number"
            disabled={!isEditable}
          />
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => handleContactChange("email", e.target.value)}
            placeholder="Email"
            disabled={!isEditable}
          />
        </div>

        <div className="social-media">
          {Object.keys(contactInfo.socialLinks).map((platform) => (
            <div key={platform}>
              <input
                type="url"
                value={contactInfo.socialLinks[platform]}
                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                placeholder={`Enter ${platform} URL`}
                disabled={!isEditable}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Home Video Section */}
      <section className="home-video">
        <h2>Home Video</h2>
        <input
          type="url"
          value={homeVideoURL}
          onChange={handleHomeVideoChange}
          placeholder="Enter Home Video URL"
          disabled={!isEditable}
        />
      </section>

      {/* Edit and Save Button */}
      <div className="buttons">
        <button className="edit-btn" onClick={toggleEdit}>
          {isEditable ? "Cancel Edit" : "Edit"}
        </button>
        {isEditable && (
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Resource;
