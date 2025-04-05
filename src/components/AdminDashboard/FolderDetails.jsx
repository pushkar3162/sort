import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import filesFoldersData from "../../../folderFilesData"; // Import mock data
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FileMetadataModal from "../FileMetadataModal"; // Import the modal component

const FolderDetails = () => {
  const { folderName } = useParams();
  const [folderData, setFolderData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    // Find folder data from the mock dataset
    const folder = filesFoldersData.find((f) => f.name === folderName);
    console.log("folder:", folder);
    setFolderData(folder);
  }, [folderName]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !dropdownRefs.current[openDropdownId]?.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleSaveMetadata = (updatedMetadata) => {
    if (!selectedFile) return;
    
    console.log("Saving metadata for file:", selectedFile.id, updatedMetadata);
    // Update the file metadata in the state
    setFolderData((prev) => ({
      ...prev,
      files: prev.files.map((file) =>
        file.id === selectedFile.id ? { ...file, metadata: updatedMetadata } : file
      ),
    }));
    
    // Close the modal
    setIsMetadataModalOpen(false);
    setSelectedFile(null);
    alert("File metadata saved successfully!");
  };

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

  const handleDownload = (fileId) => {
    const file = folderData.files.find(f => f.id === fileId);
    if (file) {
      alert(`Downloading ${file.name}...`);
      // Simulate file download
    }
  };

  const openMetadataModal = (file) => {
    setSelectedFile(file);
    setIsMetadataModalOpen(true);
    setOpenDropdownId(null); // Close any open dropdown
  };

  const closeMetadataModal = () => {
    setIsMetadataModalOpen(false);
    setSelectedFile(null);
  };

  const toggleDropdown = (fileId) => {
    setOpenDropdownId(openDropdownId === fileId ? null : fileId);
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file && folderData) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Convert bytes to KB
        metadata: {
          name: file.name,
          createdAt: new Date().toISOString().split("T")[0],
          modifiedAt: new Date().toISOString().split("T")[0],
          owner: "Current User",
          tags: "",
          description: "",
          permissions: "Private"
        }
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
      <Navbar />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <div
          className="folder-contents"
          style={{
            margin: "20px",
            background: "#F4EBDC",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "calc(100% - 250px)",
            marginLeft: "250px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>📁 {folderName}</h2>
            <div>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <button
                onClick={triggerFileInput}
                style={{
                  backgroundColor: "#3a506b",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                className="upload-button"
              >
                📤 Upload File
              </button>
            </div>
          </div>

          {folderData ? (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "12px 8px" }}>Size</th>
                    <th style={{ textAlign: "left", padding: "12px 8px" }}>Last Modified</th>
                    <th style={{ textAlign: "right", padding: "12px 8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {folderData.files.map((file) => (
                    <tr key={file.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px 8px" }}>📄 {file.name}</td>
                      <td style={{ padding: "12px 8px" }}>{file.size}</td>
                      <td style={{ padding: "12px 8px" }}>
                        {file.metadata?.modifiedAt || "N/A"}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleDownload(file.id)}
                            style={{
                              backgroundColor: "#ff3b30",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "6px",
                              marginRight: "4px",
                              cursor: "pointer",
                              transition: "background-color 0.3s",
                            }}
                            className="download-button"
                          >
                            Download
                          </button>
                          <div 
                            style={{ position: "relative" }}
                            ref={el => dropdownRefs.current[file.id] = el}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(file.id);
                              }}
                              className="ellipsis-button"
                              style={{
                                backgroundColor: "#3a506b",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: "all 0.3s",
                              }}
                            >
                              <span style={{ fontSize: "18px", lineHeight: 0 }}>⋮</span>
                            </button>
                            <div
                              style={{
                                display: openDropdownId === file.id ? "block" : "none",
                                position: "absolute",
                                right: 0,
                                backgroundColor: "white",
                                minWidth: "120px",
                                boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                                zIndex: 1,
                                borderRadius: "8px",
                                overflow: "hidden",
                                marginTop: "5px",
                              }}
                              className="dropdown-content"
                            >
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleRename(file.id);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 16px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s",
                                }}
                                className="dropdown-item"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleMove(file.id);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 16px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s",
                                }}
                                className="dropdown-item"
                              >
                                Move
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  openMetadataModal(file);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 16px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s",
                                }}
                                className="dropdown-item"
                              >
                                Edit Metadata
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleDelete(file.id);
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "8px 16px",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  color: "#f44336",
                                  cursor: "pointer",
                                  transition: "background-color 0.2s",
                                }}
                                className="dropdown-item"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Loading folder data...</div>
          )}
          
          <div style={{ marginTop: "20px" }}>
            <Link 
              to="/dashboard" 
              style={{
                display: "inline-block",
                color: "#6B4226",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              ⬅ Back to File Explorer
            </Link>
          </div>
        </div>
      </div>
      
      {/* Metadata Modal */}
      <FileMetadataModal
        isOpen={isMetadataModalOpen}
        onClose={closeMetadataModal}
        metadata={selectedFile?.metadata}
        onSave={handleSaveMetadata}
      />
      
      {/* Add CSS for hover effects */}
      <style jsx>{`
        .ellipsis-button:hover {
          background-color: #8B5A34 !important;
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
        }
        
        .download-button:hover {
          background-color: #45a049 !important;
        }
        
        .upload-button:hover {
          background-color: #8B5A34 !important;
        }
      `}</style>
    </div>
  );
};

export default FolderDetails;