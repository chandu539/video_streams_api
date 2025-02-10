import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UpdateVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5003/videos/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setDescription(response.data.description);
        setExistingVideo(response.data.videoUrl);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching video details:", error);
        toast.error("Failed to fetch video details");
        setLoading(false);
      });
  }, [id]);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(file);
    } else {
      toast.error("Please upload a valid video file.");
      setVideo(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description) {
      toast.error("Title and description are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (video) formData.append("video", video);

    try {
      setUpdating(true);
      await axios.put(`http://localhost:5003/videos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Video updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center text-3xl">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-5xl font-bold mb-6 text-green-600">Update Video</h1>
      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block text-2xl font-medium mb-1">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-green-950 text-white"
        />

        <label className="block text-2xl font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded bg-green-950 text-white"
          rows="3"
        />

        <label className="block text-2xl font-medium mb-1">Upload New Video (Optional)</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full p-2 mb-4 border rounded bg-green-950 text-white"
        />

        {existingVideo && (
          <video width="100%" controls className="mt-4">
            <source src={`http://localhost:5003/videos/stream/${id}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div className="flex justify-center gap-6 mt-4">
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-40"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </button>

          <Link to="/">
            <button
              type="button"
              className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40"
            >
              Home
            </button>
          </Link>
        </div>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

export default UpdateVideo;
