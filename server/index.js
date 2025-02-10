require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket, ObjectId } = require("mongodb");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(cors());


// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const conn = mongoose.connection;
let gfsBucket;

conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "videos" });
  console.log("GridFS Bucket initialized");
});

// Video Schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String,
  fileId: mongoose.Schema.Types.ObjectId,
});
const Video = mongoose.model("Video", videoSchema);

// Multer Setup (Stores File Temporarily)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload Video (Using GridFSBucket)
app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const uploadStream = gfsBucket.openUploadStream(req.file.filename);
    const fileStream = fs.createReadStream(req.file.path);
    fileStream.pipe(uploadStream);

    uploadStream.on("finish", async () => {
      // Remove local file after upload
      fs.unlinkSync(req.file.path);

      const video = new Video({
        title: req.body.title,
        description: req.body.description,
        filename: req.file.filename,
        fileId: uploadStream.id,
      });

      await video.save();
      res.status(201).json({ message: " Video uploaded successfully", video });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ message: " Error uploading video", error: err });
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving video", error });
  }
});

// Fetch Videos
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: " Failed to fetch videos", error });
  }
});

// Stream Video
app.get("/videos/stream/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: " Video not found" });

    const stream = gfsBucket.openDownloadStream(new ObjectId(video.fileId));
    res.set("Content-Type", "video/mp4");
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: " Error streaming video", error });
  }
});

app.delete("/videos/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete file from GridFS
    await gfsBucket.delete(new ObjectId(video.fileId));

    // Delete video metadata from MongoDB
    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error });
  }
});


/*app.put("/update/:id", upload.single("video"), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Update title and description
    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;

    // If a new video file is uploaded, replace the existing file
    if (req.file) {
      // Delete old file from GridFS
      await gfsBucket.delete(new ObjectId(video.fileId));

      // Upload new video to GridFS
      const uploadStream = gfsBucket.openUploadStream(req.file.filename);
      const fileStream = fs.createReadStream(req.file.path);
      fileStream.pipe(uploadStream);

      uploadStream.on("finish", async () => {
        // Remove local file after upload
        fs.unlinkSync(req.file.path);

        // Update video file details
        video.filename = req.file.filename;
        video.fileId = uploadStream.id;

        await video.save();
        res.status(200).json({ message: "Video updated successfully", video });
      });
    } else {
      await video.save();
      res.status(200).json({ message: "Video updated successfully", video });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error });
  }
});*/

app.put("/update/:id", upload.single("video"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    let updateData = { title, description };

    // Check if a new video file is uploaded
    if (req.file) {
      const video = await Video.findById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Delete the old video file from the server
      if (video.videoPath) {
        fs.unlinkSync(video.videoPath); // Remove the old file
      }

      updateData.videoPath = req.file.path; // Update video path
    }

    // Update video details in MongoDB
    const updatedVideo = await Video.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.listen(PORT, () => console.log(` Server running on port ${PORT}`));