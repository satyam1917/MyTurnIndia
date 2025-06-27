import React, { useState, useEffect } from "react";
import "./Resources.css";
import Cookies from "js-cookie";
import Loading from "../../../Components/Loading";

const DeleteResource = () => {
  const [founders, setFounders] = useState([]);
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
          setFounders(resource.teams);
          setIsLoading(false);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDeleteFounder = (founder) => {
    const id = founder._id;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/resource/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          alert("Founder deleted successfully");
          window.location.reload();
        } else {
          alert("Error deleting founder");
        }
      })
  };


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="resource-container">


      {/* Meet Our Founders Section */}
      <div className="founders">
        <center><h3>Meet Our Teams</h3></center>
        <div className="founders-list">
          {founders.map((founder, index) => (
            <div key={index} className="founder-card">
              <div className="founder-image-container">
                <img
                  src={import.meta.env.VITE_BACKEND_URL + "/images/" + founder.imageUrl}
                  alt={founder.name}
                  className="founder-image"
                />
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
                  disabled={true}
                />
                <input
                  type="text"
                  value={founder.position}
                  onChange={(e) =>
                    handleFounderChange(index, "position", e.target.value)
                  }
                  placeholder="Role"
                  className="founder-role"
                  disabled={true}
                />
                <textarea
                  value={founder.message}
                  onChange={(e) =>
                    handleFounderChange(index, "message", e.target.value)
                  }
                  placeholder="Founder Description"
                  rows="4"
                  className="founder-description"
                  disabled={true}
                />

                <button onClick={() => handleDeleteFounder(founder)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeleteResource;
