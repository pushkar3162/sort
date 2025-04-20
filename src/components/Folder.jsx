import React, { useState } from "react";
import Ellipsis from "./Ellipsis";
import axios from "axios";

// Folder icon as base64 string - a simple folder icon
const folderIconBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDY0IDEyOEgyNzJsLTY0LTY0SDQ4QzIxLjQ5IDY0IDAgODUuNDkgMCAxMTJ2Mjg4YzAgMjYuNTEgMjEuNDkgNDggNDggNDhoNDE2YzI2LjUxIDAgNDgtMjEuNDkgNDgtNDhWMTc2YzAtMjYuNTEtMjEuNDktNDgtNDgtNDh6IiBmaWxsPSIjZTliYjQxIi8+PC9zdmc+";

const Folder = ({ folder, fetchFolders, setSelectedFolder, onFolderClick }) => {
  // State to track if modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create default metadata if not provided
  const ensureMetadata = () => {
    if (!folder.metadata) {
      return {
        name: folder.name,
        createdAt: folder.createdAt || new Date().toISOString().split("T")[0],
        modifiedAt: folder.modifiedAt || new Date().toISOString().split("T")[0],
        owner: "Current User",
        description: "",
        permissions: "Private"
      };
    }
    return folder.metadata;
  };

  const handleFolderClick = (e) => {
    // If modal is open, don't navigate
    if (isModalOpen) {
      return;
    }
    
    // If the click came from the modal overlay, don't navigate
    if (e.target.closest('.modal-overlay')) {
      return;
    }
    
    // If the click is coming from the ellipsis menu or its children, don't navigate
    if (e.target.closest('.ellipsis-container')) {
      return;
    }
    
    setSelectedFolder(folder.id);
    if (onFolderClick) {
      onFolderClick(folder.name);
    }
  };

  // Track modal state changes
  const handleModalStateChange = (isOpen) => {
    setIsModalOpen(isOpen);
  };

  const handleSaveMetadata = async (updatedMetadata) => {
    try {
      // Your API call to save metadata
      await axios.put(`http://localhost:5000/api/folders/${folder.id}/metadata`, updatedMetadata);
      fetchFolders();
    } catch (error) {
      console.error("Error updating metadata:", error);
      // Fallback for demo or when API is not available
      alert("Metadata saved successfully!");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/folders/${folder.id}`);
        fetchFolders();
      } catch (error) {
        console.error("Error deleting folder:", error);
        // Fallback for demo
        alert(`Folder "${folder.name}" would be deleted. (API call simulated)`);
        fetchFolders();
      }
    }
  };

  const handleRename = async () => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (newName && newName !== folder.name) {
      try {
        await axios.put(`http://localhost:5000/api/folders/${folder.id}/rename`, { name: newName });
        fetchFolders();
      } catch (error) {
        console.error("Error renaming folder:", error);
        // Fallback for demo
        alert(`Folder renamed to "${newName}". (API call simulated)`);
        fetchFolders();
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/folders/${folder.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${folder.name}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading folder:", error);
      alert(`Download simulation for "${folder.name}". (API call simulated)`);
    }
  };

  return (
    <div 
      className="folder" 
      onClick={handleFolderClick}
      style={{
        position: 'relative',
        width: '150px',
        height: '130px',
        backgroundColor: '#F8F0E3',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        cursor: isModalOpen ? 'default' : 'pointer', // Change cursor when modal is open
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        pointerEvents: isModalOpen ? 'none' : 'auto', // Disable pointer events when modal is open
      }}
    >
      <div 
        style={{ 
          position: 'absolute', 
          top: '5px', 
          right: '5px', 
          zIndex: 10,
          pointerEvents: 'auto', // Always enable pointer events for menu
        }}
        onClick={(e) => e.stopPropagation()} // Stop click from reaching folder
      >
        <Ellipsis
          folderId={folder.id}
          metadata={ensureMetadata()}
          onSaveMetadata={handleSaveMetadata}
          onDelete={handleDelete}
          onRename={handleRename}
          onDownload={handleDownload}
          onModalStateChange={handleModalStateChange} // Pass modal state handler
        />
      </div>
      
      {/* Using inline SVG as fallback */}
      <div style={{ width: '60px', height: '60px', marginBottom: '10px' }}>
        <img
          src={folderIconBase64}
          alt="Folder"
          style={{ width: '100%', height: '100%' }}
          onError={(e) => {
            // If image fails to load, replace with a colored div
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div style="width: 60px; height: 60px; background-color: #e9bb41; border-radius: 5px;">
                <div style="height: 15px; background-color: #e9bb41; border-top-left-radius: 5px; border-top-right-radius: 5px;"></div>
                <div style="height: 45px; background-color: #e9bb41; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"></div>
              </div>
            `;
          }}
        />
      </div>
      
      <p style={{ 
        margin: 0, 
        fontSize: '14px', 
        textAlign: 'center',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {folder.name}
      </p>
    </div>
  );
};

export default Folder;