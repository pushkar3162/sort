import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use(express.json());

let files = [];

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("fileUploaded", (updatedFiles) => {
    files = updatedFiles;
    io.emit("fileUploaded", files);
  });

  socket.on("commentUpdated", ({ index, value }) => {
    io.emit("commentUpdated", { index, value });
  });

  socket.on("fileRemoved", (updatedFiles) => {
    files = updatedFiles;
    io.emit("fileRemoved", files);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
