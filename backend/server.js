// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, specify your client's origin
    methods: ["GET", "POST"],
  },
});

// Store the current state
let files = [];
let comments = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // IMPORTANT: Send current state immediately on connection
  // This ensures new tabs get the current data right away
  socket.emit("initialData", { files, comments });

  // Also keep the old event for backwards compatibility
  socket.on("requestInitialData", () => {
    socket.emit("initialData", { files, comments });
  });

  // Handle file uploads
  socket.on("fileUploaded", (updatedFiles) => {
    files = updatedFiles;
    // Broadcast to ALL clients including sender
    io.emit("fileUploaded", files);
  });

  // Handle comment updates
  socket.on("commentUpdated", ({ index, value }) => {
    comments[index] = value;
    // Broadcast to ALL clients including sender
    io.emit("commentUpdated", { index, value });
  });

  // Handle file removals
  socket.on("fileRemoved", (updatedFiles) => {
    files = updatedFiles;
    // Broadcast to ALL clients including sender
    io.emit("fileRemoved", files);

    // Also need to clean up comments that no longer have associated files
    // This is a simple approach - you might need more sophisticated sync
    // between files and comments in a real app
    const newComments = {};
    for (const index in comments) {
      if (index < files.length) {
        newComments[index] = comments[index];
      }
    }
    comments = newComments;
    io.emit("commentsFullUpdate", comments);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
