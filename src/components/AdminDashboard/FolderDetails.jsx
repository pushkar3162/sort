import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";  // Import axios
import filesFoldersData from "../../../folderFilesData"; // Import mock data for fallback
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FileMetadataModal from "../FileMetadataModal"; // Import the modal component

// API service for folders and files
const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your actual API endpoint

const FolderDetails = () => {
  const { folderName } = useParams();
  const [folderData, setFolderData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRefs = useRef({});

  // Fetch folder data from API
  useEffect(() => {
    const fetchFolderData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/folders/${encodeURIComponent(folderName)}`);
        console.log("API folder data:", response.data);
        setFolderData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching folder data:", err);
        setError("Failed to load folder data. Using mock data as fallback.");
        // Fallback to mock data if API fails
        const folder = filesFoldersData.find((f) => f.name === folderName);
        console.log("Fallback to mock folder:", folder);
        setFolderData(folder);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderData();
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

  const handleSaveMetadata = async (updatedMetadata) => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/files/${selectedFile.id}/metadata`, updatedMetadata);
      
      // Update the file metadata in the local state
      setFolderData((prev) => ({
        ...prev,
        files: prev.files.map((file) =>
          file.id === selectedFile.id ? { ...file, metadata: updatedMetadata } : file
        ),
      }));
      
      alert("File metadata saved successfully!");
    } catch (err) {
      console.error("Error saving metadata:", err);
      alert(`Error saving metadata: ${err.response?.data?.message || err.message}`);
    } finally {
      // Close the modal regardless of outcome
      setIsMetadataModalOpen(false);
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_BASE_URL}/files/${fileId}`);
        
        // Update local state after successful deletion
        setFolderData((prev) => ({
          ...prev,
          files: prev.files.filter((file) => file.id !== fileId),
        }));
        
        alert("File deleted successfully!");
      } catch (err) {
        console.error("Error deleting file:", err);
        alert(`Error deleting file: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleRename = async (fileId) => {
    const newName = prompt("Enter new file name:");
    if (newName) {
      setIsLoading(true);
      try {
        await axios.put(`${API_BASE_URL}/files/${fileId}/rename`, { name: newName });
        
        // Update local state after successful rename
        setFolderData((prev) => ({
          ...prev,
          files: prev.files.map((file) =>
            file.id === fileId ? { ...file, name: newName } : file
          ),
        }));
        
        alert("File renamed successfully!");
      } catch (err) {
        console.error("Error renaming file:", err);
        alert(`Error renaming file: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleMove = async (fileId) => {
    const newFolderName = prompt("Enter the new folder name to move the file:");
    if (newFolderName) {
      setIsLoading(true);
      try {
        await axios.put(`${API_BASE_URL}/files/${fileId}/move`, { destinationFolder: newFolderName });
        
        // Remove file from current folder's state after successful move
        setFolderData((prev) => ({
          ...prev,
          files: prev.files.filter((file) => file.id !== fileId),
        }));
        
        alert(`File moved to ${newFolderName} successfully!`);
      } catch (err) {
        console.error("Error moving file:", err);
        alert(`Error moving file: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      // Get filename from Content-Disposition header or use a default name
      const contentDisposition = response.headers['content-disposition'];
      let filename;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        filename = filenameMatch ? filenameMatch[1] : `file-${fileId}`;
      } else {
        const file = folderData.files.find(f => f.id === fileId);
        filename = file ? file.name : `file-${fileId}`;
      }
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert(`Error downloading file: ${err.response?.data?.message || err.message}`);
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file && folderData) {
      setIsLoading(true);
      try {
        // Create FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', folderData.id);
        
        const response = await axios.post(`${API_BASE_URL}/files/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log("Uploaded file:", response.data);
        
        // Update the folder state with the new file
        setFolderData((prevFolder) => ({
          ...prevFolder,
          files: [...prevFolder.files, response.data],
        }));
        
        alert("File uploaded successfully!");
      } catch (err) {
        console.error("Error uploading file:", err);
        alert(`Error uploading file: ${err.response?.data?.message || err.message}`);
        
        // Fallback: Add file to UI even if API fails
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
        
        setFolderData((prevFolder) => ({
          ...prevFolder,
          files: [...prevFolder.files, newFile],
        }));
      } finally {
        setIsLoading(false);
        // Clear the file input
        event.target.value = null;
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
                disabled={isLoading}
              />
              <button
                onClick={triggerFileInput}
                style={{
                  backgroundColor: "#3a506b",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                  opacity: isLoading ? 0.7 : 1,
                }}
                className="upload-button"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "📤 Upload File"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: "#d32f2f", padding: "10px", marginBottom: "15px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
              {error}
            </div>
          )}

          {isLoading && !folderData ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading folder data...
            </div>
          ) : folderData ? (
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
                  {folderData.files.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                        No files in this folder
                      </td>
                    </tr>
                  ) : (
                    folderData.files.map((file) => (
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
                              disabled={isLoading}
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
                                disabled={isLoading}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No folder data available.</div>
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
      
      <FileMetadataModal
        isOpen={isMetadataModalOpen}
        onClose={closeMetadataModal}
        metadata={selectedFile?.metadata}
        documentId={selectedFile?.id} // Add the document ID here
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