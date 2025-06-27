import React, { useState, useEffect } from "react";
import Loading from "../../../../Components/Loading";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const ManageCourse = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/get-all-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCourses(data.data);
          setIsLoading(false);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course);
    setSelectedVideo(null); // Reset selected video
  };

  const handleVideoChange = (e) => {
    const videoId = e.target.value;
    const video = selectedCourse.videos.find((v) => v.id === videoId);
    setSelectedVideo(video);
  };

  const handleInputChange = (type, id, field, value, subIndex = null) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          videos: course.videos.map((video) => {
            if (video.id === selectedVideo.id) {
              if (type === "video") {
                return { ...video, [field]: value };
              }
              if (type === "material") {
                return {
                  ...video,
                  materials: video.materials.map((mat) =>
                    mat.id === id ? { ...mat, [field]: value } : mat
                  ),
                };
              }
              if (type === "quiz") {
                return {
                  ...video,
                  quiz: video.quiz.map((q) => {
                    if (q.id === id) {
                      if (subIndex !== null) {
                        const updatedOptions = [...q.options];
                        updatedOptions[subIndex] = value;
                        return { ...q, options: updatedOptions };
                      } else {
                        return { ...q, [field]: value };
                      }
                    }
                    return q;
                  }),
                };
              }
            }
            return video;
          }),
        };
      }
      return course;
    });
    setCourses(updatedCourses); // Update courses state with changes
    setSelectedVideo(updatedCourses.find(course => course.id === selectedCourse.id)?.videos.find(video => video.id === selectedVideo.id)); // Update selected video
  };

  const handleSubmit = () => {
    if (selectedVideo!==null) {
      setIsLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/update-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          videoId: selectedVideo.id,
          videoData: selectedVideo,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          if (data.status) {
            toast.success('Video updated successfully', {autoClose: 2000});
          } else {
            toast.error('Error updating video', {autoClose: 2000});
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error:", error);
        });
    }
    else {
      toast.error('Please select a video', { autoClose: 2000 });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{width: '1200px', margin: 'auto'}}>
      <h1>Course Editor</h1>

      {/* Course Selector */}
      <div>
        <label>Select Course:</label>
        <select onChange={handleCourseChange}>
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Video Selector */}
      {selectedCourse && (
        <div>
          <label>Select Video:</label>
          <select onChange={handleVideoChange}>
            <option value="">-- Select a Video --</option>
            {selectedCourse.videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Details */}
      {selectedVideo && (
        <div>
          <h2>Edit Video</h2>
          <div>
            <label>Title:</label>
            <input
            className="form-control"
            style={{color: 'white !important'}}
              type="text"
              value={selectedVideo.title}
              onChange={(e) =>
                handleInputChange("video", null, "title", e.target.value)
              }
            />
          </div>
          <div>
            <label>Video URL:</label>
       
          <input
            name="banner"
            type="file"
            accept="video/*"
            
          />
          </div>

          {/* Materials */}
          <h3>Materials</h3>
          {selectedVideo.materials.map((mat) => (
            <div key={mat.id}>
              <label>Title:</label>
              <input
                type="text"
                value={mat.title}
                onChange={(e) =>
                  handleInputChange("material", mat.id, "title", e.target.value)
                }
              />
              <label>URL:</label>
              <input
                type="text"
                value={mat.url}
                onChange={(e) =>
                  handleInputChange("material", mat.id, "url", e.target.value)
                }
              />
            </div>
          ))}

          {/* Quiz */}
          <h3>Quiz</h3>
          {selectedVideo.quiz.map((q) => (
            <div key={q.id}>
              <label>Question:</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleInputChange("quiz", q.id, "question", e.target.value)
                }
              />
              <h4>Options:</h4>
              {q.options.map((option, index) => (
                <div key={index}>
                  <label>Option {index + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleInputChange("quiz", q.id, "options", e.target.value, index)
                    }
                  />
                </div>
              ))}
              <label>Correct Option:</label>
              <input
                type="number"
                value={q.correctOption}
                onChange={(e) =>
                  handleInputChange("quiz", q.id, "correctOption", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ManageCourse;
