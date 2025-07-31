import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import filesFoldersData from "../../../folderFilesData"; // Import mock data
import Ellipsis from "../Ellipsis";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";

const EditorFolderDetails = () => {
  const { folderName } = useParams();
  const [folderData, setFolderData] = useState(null);

  useEffect(() => {
    // Find folder data from the mock dataset
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
      // Here, you would handle moving the file in your actual API
    }
  };

  // function to trigger
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  // handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file && folderData) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Convert bytes to KB
      };

      // Update the folder state with the new file
      setFolderData((prevFolder) => ({
        ...prevFolder,
        files: [...prevFolder.files, newFile],
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
                // position: "absolute",
                // top: "20px",
                // right: "20px",
              }}
            >
              📤 Upload
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>
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
                    {" "}
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
          <Link to="/editordashboard">⬅ Back to File Explorer</Link>
        </div>
      </div>
    </div>
  );
};

export default EditorFolderDetails;
