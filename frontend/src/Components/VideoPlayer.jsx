import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaArrowsAlt, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi";
import { BsFillGearFill } from "react-icons/bs";
import "./VideoPlayer.css";

// Helper function to format time in MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
};

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper function to prevent context menu (right-click)
  const handleContextMenu = (e) => {
    e.preventDefault();
    alert("Right-click is disabled for this video.");
  };

  // Disable text selection and dragging over the video player
  const disableSelectAndDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Prevent browser from showing any download options
  const preventDownload = (e) => {
    e.preventDefault();
    alert("Downloading the video is disabled.");
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        document.fullscreenElement === videoRef.current ||
        document.webkitFullscreenElement === videoRef.current
      ) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  const handleProgress = () => {
    const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(percentage);
  };

  const handleSeek = (e) => {
    const seekTime =
      (e.nativeEvent.offsetX / e.target.offsetWidth) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  const handleVolumeChange = (e) => {
    const volumeLevel = e.target.value;
    setVolume(volumeLevel);
    videoRef.current.volume = volumeLevel;
  };

  return (
    <div
      className="video-player"
      onDragStart={disableSelectAndDrag}
      onSelect={disableSelectAndDrag}
      onContextMenu={handleContextMenu} // Prevent right-click
    >
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleProgress}
        onClick={handlePlayPause}
        onContextMenu={handleContextMenu} // Disable context menu for video
        onDragStart={preventDownload} // Prevent video download drag
        controlsList="nodownload nofullscreen noremoteplayback"
        onPlay={() => console.log("Video is playing")}
        onPause={() => console.log("Video is paused")}
        onError={() => console.log("Error loading the video")}
      ></video>
      <div className="controls">
        <button className="play-pause" onClick={handlePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <div className="progress-bar" onClick={handleSeek}>
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="time-display">
          <span>{formatTime(videoRef.current?.currentTime || 0)}</span> /{" "}
          <span>{formatTime(videoRef.current?.duration || 0)}</span>
        </div>

        <div className="speed-controls">
          <span className="speed-label">Speed:</span>
          <select
            value={playbackRate}
            onChange={(e) => handleSpeedChange(e.target.value)}
            className="speed-selector"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <button className="fullscreen" onClick={toggleFullscreen}>
          <FaArrowsAlt />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
