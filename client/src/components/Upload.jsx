import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Upload() {
  const location = useLocation();
  const existingVideo = location.state?.video || null; // Get video data if updating

  const [title, setTitle] = useState(existingVideo?.title || "");
  const [description, setDescription] = useState(existingVideo?.description || "");
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existingVideo) {
      setTitle(existingVideo.title);
      setDescription(existingVideo.description);
    }
  }, [existingVideo]);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    const validFormats = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
    const maxSize = 50 * 1024 * 1024; // 50MB limit

    if (file) {
      if (!validFormats.includes(file.type)) {
        setVideo(null);
        setError("Invalid format. Only MP4, MKV, MOV, and AVI are allowed.");
        return;
      }
      if (file.size > maxSize) {
        setVideo(null);
        setError("File size exceeds 50MB limit.");
        return;
      }
      setVideo(file);
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description || (!video && !existingVideo)) {
      setError("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (video) formData.append("video", video);

    try {
      setUploading(true);
      setError("");

      if (existingVideo) {
        // Update existing video
        await axios.put(`https://video-streams-api-backend.vercel.app/update/${existingVideo._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video updated successfully!");
      } else {
        // Upload new video
        await axios.post("https://video-streams-api-backend.vercel.app/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video uploaded successfully!");
      }

      setTitle("");
      setDescription("");
      setVideo(null);
    } catch (err) {
      toast.error("Error processing video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/bg_image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-5xl font-bold mb-6 text-green-600">
        {existingVideo ? "Update Video" : "Upload Video"}
      </h1>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-2xl font-medium mb-1 text-green-950">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-green-950 text-white"
          placeholder="Enter video title"
        />

        <label className="block text-2xl font-medium mb-1 text-green-950">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-green-950 text-white"
          placeholder="Enter video description"
          rows="3"
        />

        <label className="block text-2xl font-medium mb-1 text-green-950">Upload Video</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 mb-4 border rounded bg-green-950 text-white" />

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {video && <p className="text-green-500 mb-4">{video.name} selected</p>}

        <div className="flex justify-center gap-6 mt-4">
          <button type="submit" className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-40" disabled={uploading}>
            {uploading ? "Processing..." : existingVideo ? "Update" : "Upload"}
          </button>

          <Link to="/">
            <button type="button" className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40">Home</button>
          </Link>
        </div>
      </form>
      <Toaster position="top-center" />
    </div>
  );
}

export default Upload;
