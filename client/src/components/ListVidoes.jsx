import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const ListVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/videos")
      .then(response => setVideos(response.data))
      .catch(error => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div className="container mx-auto p-6"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/list_videos_image.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
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
        <h1 className="text-6xl font-bold text-center flex-1 text-red-950">Uploaded Videos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="p-4 border rounded-lg shadow-lg bg-inherit   text-red-950 text-l">
            <h2 className="text-xl font-bold">{video.title}</h2>
            <p className="text-black">{video.description}</p>
            <video width="100%" controls>
              <source src={`http://localhost:5001/uploads/${video.filename}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListVideos;
