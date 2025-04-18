import axios from "axios";
import React from "react";
import Ellipsis from "./Ellipsis";

const Folder = ({ folder, fetchFolders, setSelectedFolder, onFolderClick }) => {
  // Generate dummy metadata if not provided
  const folderMetadata = folder.metadata || {
    name: folder.name,
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
        onFolderClick(folder);
      } else {
        setSelectedFolder(folder.id);
      }
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
  const dummyMetadata = {
    folder: {
      folderName: folder.name,
      creationDate: "2023-10-01",
      lastModified: "2023-10-05",
      description: "none",
    },
    file: {
      fileName: "example.txt",
      creationDate: "2023-10-02",
      lastModified: "2023-10-04",
      description: "none",
    },
  };
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
      link.setAttribute("download", `${folder.name}.pdf`); 
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
      await axios.delete(`http://localhost:8000/docs#/default/delete_endpoint_documents_delete__document_id__delete${folderId}`, {
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
  

  const handleRename = (folderId) => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (newName && newName !== folder.name) {
      console.log("Renaming folder:", folderId, "to", newName);
      // Example API call:
      // axios.put(`http://localhost:5000/api/folders/${folderId}`, { name: newName })
      //   .then(() => {
      //     fetchFolders();
      //   })
      //   .catch(error => {
      //     console.error("Error renaming folder:", error);
      //   });

      // For now, just refresh folders
      fetchFolders();
    }
  };

  return (
    <div className="folder" onClick={handleFolderClick}>
      <div className="folder-icon">📁</div>
      <div className="folder-name">{folder.name}</div>

      <div className="folder-actions">
        <Ellipsis
          folderId={folder.id}
          metadata={folderMetadata}
          onSaveMetadata={handleSaveMetadata}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onRename={handleRename}
        />
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
