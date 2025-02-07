require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();


app.use(
  cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE",  
    allowedHeaders: "Content-Type,Authorization", 
    credentials: true,
  })
);


app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Define video schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String,  
});


const Video = mongoose.model("Video", videoSchema);

// Multer setup 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoPath = req.file.path; 

    const newVideo = new Video({
      title,
      description,
      filename: req.file.filename,  
    });
    
    await newVideo.save();
    res.status(201).json({
      message: "Video uploaded successfully!",
      video: newVideo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error uploading video",
      error: err.message,
    });
  }
});

app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();  
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
