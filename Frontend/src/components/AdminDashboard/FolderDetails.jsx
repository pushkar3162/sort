import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import filesFoldersData from "../../../folderFilesData"; // Import mock data
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Ellipsis from "../Ellipsis";
import axios from "axios";

const FolderDetails = () => {
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
        setFolderData([]);
        return;
      }
      console.log("Folder data:", folder.files);
      setFolderData(folder.files || []);
      console.log("Folder data:", folderData);
    } catch (error) {

      console.error("Failed to fetch folder contents:", error);
      setFolderData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   fetchFolderFiles();
  }, [folderName]);

  const handleDelete = async (file) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        // Get auth token
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
          alert("You are not logged in. Please log in to delete files.");
          return;
        }

        // Fetch documents to find the matching document_id
        const response = await axios.get("http://127.0.0.1:8000/documents");
        const documents = response.data || {};
        
        if (!documents.documents) {
          console.error("No documents found");
          alert("Unable to fetch documents. Please try again.");
          return;
        }

        // Find matching document by name/title
        const matchedDocument = documents.documents.find(
          (doc) => doc.title === file || doc.name === file
        );

        if (!matchedDocument) {
          console.error("No matching document found for:", file);
          alert("Document not found in backend. Unable to delete.");
          return;
        }

        console.log("Matched document for deletion:", matchedDocument);

        // Make DELETE API call using document_id
        const deleteResponse = await axios.delete(
          `http://127.0.0.1:8000/documents/delete/${matchedDocument.document_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (deleteResponse.status === 200 || deleteResponse.status === 204) {
          // Update the folder data state after successful deletion
          setFolderData((prev) => {
            if (!prev) return prev;
            return prev.filter((f) => f !== file);
          });
          
          console.log('Document deleted successfully');
          alert('Document deleted successfully');
          
          // Refresh folder contents to ensure we have the latest data
          await fetchFolderFiles();
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        
        if (error.response) {
          // API error
          console.error('API Error:', error.response.data);
          alert(`Failed to delete document: ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
          // Network error
          alert('Network error. Please check your connection and try again.');
        } else {
          // Other error
          alert('An unexpected error occurred. Please try again.');
        }
      }
    }
  };


const handleRename = async (file) => {
  const newName = prompt("Enter new file name:");

  if (!newName || !newName.trim()) {
    alert("File name cannot be empty.");
    return;
  }

  try {
    // Get auth token
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      alert("You are not logged in. Please log in to rename files.");
      return;
    }

    // Fetch documents to find the matching document_id
    const response = await axios.get("http://127.0.0.1:8000/documents");
    const documents = response.data || {};
    
    if (!documents.documents) {
      console.error("No documents found");
      alert("Unable to fetch documents. Please try again.");
      return;
    }

    // Find matching document by name/title
    const matchedDocument = documents.documents.find(
      (doc) => doc.title === file || doc.name === file
    );

    if (!matchedDocument) {
      console.error("No matching document found for:", file);
      alert("Document not found in backend. Unable to rename.");
      return;
    }

    console.log("Matched document for rename:", matchedDocument);

    // First, rename in the documents API
    const renameResponse = await axios.put(
      `http://127.0.0.1:8000/documents/rename/${matchedDocument.document_id}`,
      new URLSearchParams({
        current_title: matchedDocument.title,
        new_title: newName.trim(),
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (renameResponse.status === 200) {
      // Then, update the file name in the folders/all-documents API
      try {
        const foldersResponse = await axios.put(
          `http://127.0.0.1:8000/folders/rename-file`,
          {
            folder_name: folderName,
            old_file_name: file,
            new_file_name: newName.trim()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (foldersResponse.status === 200) {
          // Update the folder data state after successful rename
          setFolderData((prev) => {
            if (!prev) return prev;
            return prev.map((f) => {
              if (f === file) {
                return newName.trim();
              }
              return f;
            });
          });

          console.log("File renamed successfully in both APIs.");
          alert("File renamed successfully!");
          
          // Refresh folder contents to ensure we have the latest data
          await fetchFolderFiles();
        }
      } catch (folderError) {
        console.error("Failed to update folder file name:", folderError);
        alert("File was renamed in documents but failed to update in folder. Please refresh the page.");
      }
    }
  } catch (error) {
    console.error("Failed to rename file:", error.response?.data || error.message);
    
    if (error.response) {
      if (error.response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("auth_token");
        // Redirect to login if needed
      } else {
        alert(`Failed to rename file: ${error.response.data?.message || 'Server error'}`);
      }
    } else {
      alert("Network error. Please check your connection and try again.");
    }
  }
};

// Updated search results display with rename functionality


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
  const formData = new FormData();
  formData.append("folder_name", name.trim());
  const createFolder = async () => {
    const name = prompt("Enter folder name:");
    if (name) {
      try {
        await axios.post("http://127.0.0.1:8000/folders/create", { name });
        alert("Folder created successfully!");
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  };

  const handleDownload = async (file) => {
    try {
      // Get auth token
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        alert("You are not logged in. Please log in to download files.");
        return;
      }

      // Fetch documents to find the matching document_id
      const response = await axios.get("http://127.0.0.1:8000/documents");
      const documents = response.data || {};
      
      if (!documents.documents) {
        console.error("No documents found");
        alert("Unable to fetch documents. Please try again.");
        return;
      }

      // Find matching document by name/title
      const matchedDocument = documents.documents.find(
        (doc) => doc.title === file || doc.name === file
      );

      if (!matchedDocument) {
        console.error("No matching document found for:", file);
        alert("Document not found in backend. Unable to download.");
        return;
      }

      console.log("Matched document for download:", matchedDocument);

      // Make download API call
      const downloadResponse = await axios.get(
        `http://127.0.0.1:8000/documents/download/${matchedDocument.document_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for handling file downloads
        }
      );

      // Create a blob from the response data
      const blob = new Blob([downloadResponse.data]);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the file name for the download
      link.setAttribute('download', file);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      
      if (error.response) {
        // API error
        console.error('API Error:', error.response.data);
        alert(`Failed to download file: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // Network error
        alert('Network error. Please check your connection and try again.');
      } else {
        // Other error
        alert('An unexpected error occurred. Please try again.');
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
                onClick={() => navigate("/folder-upload")}
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
              {folderData.map((file) => (
                <li
                  key={file}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px 0",
                  }}
                >
                  <span>
                    📄 {file} 
                  </span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Ellipsis
                      fileId={file}
                      onDelete={handleDelete}
                      onRename={handleRename}
                      onMove={handleMove}
                      onDownload={handleDownload}
                    />
                  </div>
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
