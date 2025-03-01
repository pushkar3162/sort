import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 5000;
const BASE_DIR = path.resolve("documents");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure base directory exists
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

// First create a temporary upload location
const tempStorage = multer.memoryStorage();
const upload = multer({ storage: tempStorage });

// Upload file and log version
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Request body:", req.body);

  const docName = req.body.docName;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!docName) {
    return res.status(400).json({ message: "Document name is required" });
  }

  // Create document directory
  const docDir = path.join(BASE_DIR, docName);
  if (!fs.existsSync(docDir)) {
    fs.mkdirSync(docDir, { recursive: true });
  }

  // Generate filename
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const versionNum = Date.now();
  const fileName = `v${versionNum}_${timestamp}${path.extname(
    req.file.originalname || ".txt"
  )}`;

  // Save the file
  const filePath = path.join(docDir, fileName);
  fs.writeFileSync(filePath, req.file.buffer);

  // Update history
  const logFile = path.join(docDir, "history.json");
  let history = [];
  if (fs.existsSync(logFile)) {
    history = JSON.parse(fs.readFileSync(logFile, "utf8"));
  }

  history.push({ version: versionNum, timestamp, fileName });
  fs.writeFileSync(logFile, JSON.stringify(history, null, 2));

  res.json({ message: "File uploaded and history updated!", fileName });
});

// Fetch version history
app.get("/history/:docName", (req, res) => {
  const docDir = path.join(BASE_DIR, req.params.docName);
  const logFile = path.join(docDir, "history.json");

  if (!fs.existsSync(logFile)) {
    return res.status(404).json({ message: "No history found" });
  }

  const history = JSON.parse(fs.readFileSync(logFile, "utf8"));
  res.json(history);
});

// Fetch specific version
app.get("/download/:docName/:fileName", (req, res) => {
  const filePath = path.join(BASE_DIR, req.params.docName, req.params.fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

