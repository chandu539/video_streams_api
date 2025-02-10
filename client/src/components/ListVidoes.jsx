import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';


const ListVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get("https://video-streams-api-backend.vercel.app/videos")
      .then((response) => setVideos(response.data))
      .catch((error) => console.error("Error fetching videos:", error));
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://video-streams-api-backend.vercel.app/videos/${id}`);
      console.log(response.data);  
  
      toast.success("Video deleted successfully", { duration: 5000 });
  
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video", { duration: 5000 });
    }
  };
  

  return (
    <div
      className="container mx-auto p-6"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/list_videos_image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex items-center justify-between w-full mb-10">
        <Link to="/">
          <button
            type="button"
            className="bg-orange-100 hover:bg-red-950 text-black font-bold py-2 px-4 rounded w-40"
          >
            Home
          </button>
        </Link>
        <h1 className="text-6xl font-bold text-center flex-1 text-red-950">
          Uploaded Videos
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="p-4 border rounded-lg shadow-lg bg-inherit text-red-950 text-l"
          >
            <h2 className="text-xl font-bold">{video.filename}</h2>
            <video width="100%" controls>
              <source
                src={`http://localhost:5003/videos/stream/${video._id}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="flex gap-28 mt-6 ml-5">
            <Link
              to="/upload"
              className="bg-red-800 hover:bg-red-950 text-white py-2 px-4 rounded-lg text-lg"
              >
              Update
            </Link>

              <button
                onClick={() => handleDelete(video._id)}
                className="bg-red-800 hover:bg-red-950 text-white py-2 px-4 rounded-lg text-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListVideos;
