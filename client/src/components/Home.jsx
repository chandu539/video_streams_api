import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/home_image.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
      > 
      <h1 className="text-7xl  text-orange-400 font-bold mb-10">Welcome to Streamify</h1>
      <p className="text-2xl font-bold mb-10 text-yellow-900 text-center">
        Stream your favorite videos effortlessly. <br></br>Upload new videos and explore the list of available content.
      </p>
      <div className="flex gap-4">
        <Link to="/upload" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-lg">
          Upload Video
        </Link>
        <Link to="/videos" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-lg">
          Browse Videos
        </Link>
      </div>
    </div>
  );
}

export default Home;
