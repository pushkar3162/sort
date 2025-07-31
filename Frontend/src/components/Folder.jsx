import axios from "axios";
import React from "react";
import Ellipsis from "./Ellipsis";

const Folder = ({ folder, fetchFolders, setSelectedFolder, onFolderClick }) => {
  // Generate dummy metadata if not provided
  const folderMetadata = folder.metadata || {
    name: folder.folder_name,
    createdAt: folder.createdAt || "2025-01-15",
    modifiedAt: folder.modifiedAt || "2025-03-10",
    owner: "John Doe",
    size: `${Math.floor(Math.random() * 500)} KB`,
    tags: "important, work",
    description: "This folder contains important work documents",
    permissions: "Private",
  };

  const handleFolderClick = (e) => {
    // Check if the click is coming from the ellipsis container
    if (!e.target.closest(".ellipsis-container")) {
      if (onFolderClick) {
        onFolderClick(folder.folder_name);
      } else {
        setSelectedFolder(folder.id);
      }
    }
  };

  const handleCreateFolder = async () => {
    const newFolderName = prompt("Enter the name of the new folder:");
    if (!newFolderName || !newFolderName.trim()) {
      alert("Folder name cannot be empty.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/folders/create",
        { name: newFolderName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        alert("Folder created successfully!");
        fetchFolders(); // Refresh the folder list
      } else {
        alert("Failed to create folder.");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Error creating folder. Please try again.");
    }
  };


  // <<<<<<< HEAD
  const handleSaveMetadata = (updatedMetadata) => {
    console.log("Saving metadata for folder:", folder.id, updatedMetadata);

    // In a real application, you would make an API call here
    // Example:
    // axios.post(`http://localhost:5000/api/folders/${folder.id}/metadata`, updatedMetadata)
    //   .then(() => {
    //     fetchFolders();
    //   })
    //   .catch(error => {
    //     console.error("Error saving metadata:", error);
    //   });

    // For now, we'll just display an alert
    alert("Metadata saved successfully!");
  };
  // =======
  // Dummy metadata for folders and files
  
  <p
  onClick={(e) =>
    handleAction(() => {
      console.log("Trying to download folderId:", folderId);
      onDownload?.(folderId);
    }, e)
  }
  >
    Download
  </p>

  // >>>>>>> 38a585181ad3b3c7f143a1990db18a3ed4097651
  const handleDownload = async (folderId) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get(
        `http://localhost:8000/docs#/default/download_endpoint_documents_download__document_id__get`, // Replace URL as per your FastAPI route
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${folder.folder_name}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download folder.");
    }
  };
  
  const handleDelete = async (folderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?"
    );
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/folders/delete/${folder.folder_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert("Folder deleted successfully!");
      fetchFolders(); // Refresh list
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete folder.");
    }
  };
  

  const handleRename = () => {
    const newName = prompt("Enter new folder name:")?.trim();
  
    if (newName && newName !== folder.folder_name) {
      console.log("Renaming folder:", folder.folder_name, "to", newName);
  
      // Create FormData and append the new_name field
      const formData = new FormData();
      formData.append('new_name', newName);
  
      axios.put(
        `http://127.0.0.1:8000/folders/rename/${folder.folder_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for form data
          },
        }
      )
      .then(() => {
        fetchFolders();
      })
      .catch(error => {
        if (error.response) {
          console.error("Error renaming folder:", error.response.data);
        } else {
          console.error("Error renaming folder:", error.message);
        }
      });
    } else {
      console.warn("Invalid folder name. Rename aborted.");
    }
  };
  
  




  return (
    <div className="folder-container">
    <div className="folder" onClick={handleFolderClick}>
      <div className="folder-icon">📁</div>
      <div className="folder-name">{folder.folder_name}</div>

      <div className="folder-actions">
        <Ellipsis
          foldername={folder.folder_name}
          folderId={folder.id}
          metadata={folderMetadata}
          onSaveMetadata={handleSaveMetadata}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onRename={handleRename}
        />
      </div>
      </div>
      
      
      <style>
        {`
          .folder {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            position: relative;
          }
          .folder:hover {
            background-color: #f5f5f5;
          }
          .folder-icon {
            font-size: 32px;
          }
          .folder-name {
            margin-top: 5px;
            text-align: center;
            word-break: break-word;
          }
          .folder-actions {
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 5;
          }
        `}
      </style>
    </div>
  );
};

export default Folder;
