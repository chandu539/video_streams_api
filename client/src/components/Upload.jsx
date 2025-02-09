import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
      setError('');
    } else {
      setVideo(null);
      setError('Please upload a valid video file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description || !video) {
      setError('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', video);

    try {
      setUploading(true);
      setError('');

      await axios.post('https://video-streams-api.vercel.app/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setVideo(null);
    } catch (err) {
      toast.error('Error uploading video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/bg_image.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-5xl font-bold mb-6 text-green-600">Upload Video</h1>
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
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full p-2 mb-4 border rounded bg-green-950 text-white"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {video && <p className="text-green-500 mb-4">{video.name} selected</p>}

        <div className="flex justify-center gap-6 mt-4">
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-40"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default Upload;
