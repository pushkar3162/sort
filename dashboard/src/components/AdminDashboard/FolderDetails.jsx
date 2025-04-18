import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import filesFoldersData from "../../../folderFilesData"; // Import mock data
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Ellipsis from "../Ellipsis";
import axios from "axios";

const FolderDetails = () => {
  const { folderName } = useParams();
  const [folderData, setFolderData] = useState(null);

  useEffect(() => {
    const folder = filesFoldersData.find((f) => f.name === folderName);
    console.log("folder:", folder);
    setFolderData(folder);
  }, [folderName]);

  const handleDelete = (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setFolderData((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file.id !== fileId),
      }));
    }
  };

  const handleRename = (fileId) => {
    const newName = prompt("Enter new file name:");
    if (newName) {
      setFolderData((prev) => ({
        ...prev,
        files: prev.files.map((file) =>
          file.id === fileId ? { ...file, name: newName } : file
        ),
      }));
    }
  };

  const handleMove = (fileId) => {
    const newFolderName = prompt("Enter the new folder name to move the file:");
    if (newFolderName) {
      alert(`Moving file ${fileId} to folder ${newFolderName}`);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && folderData) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      };

      setFolderData((prevFolder) => ({
        ...prevFolder,
        files: [...prevFolder.files, newFile],
      }));
    }
  };

  const createFolder = async () => {
    const name = prompt("Enter folder name:");
    if (name) {
      try {
        await axios.post("http://localhost:5000/api/folders/create", { name });
        alert("Folder created successfully!");
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F4EBDC",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Navbar />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <div
          className="folder-contents"
          style={{
            margin: "auto",
            background: "#F4EBDC",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            minWidth: "60%",
          }}
        >
          {/* 🔸 Top Section: Title on left, buttons on right */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <h1 style={{ margin: 0 }}>📁 {folderName}</h1>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={createFolder}
                style={{
                  backgroundColor: "#3A506B",
                  color: "white",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                📂 New Folder
              </button>

              <button
                onClick={triggerFileInput}
                style={{
                  backgroundColor: "#3A506B",
                  color: "white",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                📤 Upload
              </button>

              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* 🔹 File List */}
          {folderData ? (
            <ul>
              {folderData.files.map((file) => (
                <li
                  key={file.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px 0",
                  }}
                >
                  <span>
                    📄 {file.name} ({file.size})
                  </span>
                  <Ellipsis
                    fileId={file.id}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    onMove={handleMove}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Folder not found!</p>
          )}

          {/* 🔙 Back Button */}
          <Link to="/dashboard" style={{ marginTop: "20px", display: "inline-block" }}>
            ⬅ Back to File Explorer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FolderDetails;
