import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Ellipsis from "../Ellipsis";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";

const EditorFolderDetails = () => {
  const { folderName } = useParams();
  const navigate = useNavigate();
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFolderFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await axios.get(
        "http://localhost:8000/folders/all-documents",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const folder = response.data.find((f) => f.folder_name === folderName);

      if (!folder) {
        console.warn(`Folder "${folderName}" not found.`);
        setFolderData(null);
        return;
      }

      setFolderData(folder); // Set full folder object
    } catch (error) {
      console.error("Failed to fetch folder contents:", error);
      setFolderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderFiles();
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
      // Add actual API logic here
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

      setFolderData((prev) => ({
        ...prev,
        files: [...prev.files, newFile],
      }));
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
      <EditorNavbar />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <EditorSidebar />
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>📁 {folderName}</h1>
            <button
              onClick={triggerFileInput}
              style={{
                backgroundColor: "gray",
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

          {loading ? (
            <p>Loading...</p>
          ) : folderData ? (
            <>
              {folderData.files && folderData.files.length > 0 ? (
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
                      <span>📄 {file}</span>
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
                <p>No files in this folder.</p>
              )}
            </>
          ) : (
            <p>Folder not found!</p>
          )}

          <Link to="/editordashboard">⬅ Back to File Explorer</Link>
        </div>
      </div>
    </div>
  );
};

export default EditorFolderDetails;
