import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const FolderMetadataModal = ({ isOpen, onClose, metadata, onSave }) => {
  // Initialize with provided metadata or default values
  const [editableMetadata, setEditableMetadata] = useState({
    name: metadata?.name || "",
    createdAt: metadata?.createdAt || new Date().toISOString().split("T")[0],
    modifiedAt: metadata?.modifiedAt || new Date().toISOString().split("T")[0],
    owner: metadata?.owner || "Current User",
    description: metadata?.description || "",
    permissions: metadata?.permissions || "Private",
  });

  // Re-initialize the state when metadata prop changes
  useEffect(() => {
    if (metadata) {
      setEditableMetadata({
        name: metadata.name || "",
        createdAt: metadata.createdAt || new Date().toISOString().split("T")[0],
        modifiedAt: metadata.modifiedAt || new Date().toISOString().split("T")[0],
        owner: metadata.owner || "Current User",
        description: metadata.description || "",
        permissions: metadata.permissions || "Private",
      });
    }
  }, [metadata]);

  // Handle body overflow when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (key, value) => {
    setEditableMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editableMetadata);
  };

  // Handle overlay click with proper event stopping
  const handleOverlayClick = (e) => {
    e.stopPropagation(); // Stop click event from reaching folder component
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit Folder Metadata</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="folder-name">Name</label>
            <input
              id="folder-name"
              type="text"
              value={editableMetadata.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="created-at">Created Date</label>
            <input
              id="created-at"
              type="date"
              value={editableMetadata.createdAt}
              onChange={(e) => handleChange("createdAt", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="modified-at">Modified Date</label>
            <input
              id="modified-at"
              type="date"
              value={editableMetadata.modifiedAt}
              onChange={(e) => handleChange("modifiedAt", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="owner">Owner</label>
            <input
              id="owner"
              type="text"
              value={editableMetadata.owner}
              onChange={(e) => handleChange("owner", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="permissions">Permissions</label>
            <select
              id="permissions"
              value={editableMetadata.permissions}
              onChange={(e) => handleChange("permissions", e.target.value)}
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
              <option value="Shared">Shared</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={editableMetadata.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              Save Changes
            </button>
            <button type="button" className="secondary-button" onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: #F4EBDC;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          padding: 24px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-title {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #444;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .primary-button {
          background-color: #3a506b;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .primary-button:hover {
          background-color: #1d4ed8;
        }

        .secondary-button {
          background-color: white;
          color: #333;
          border: 1px solid #ddd;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .secondary-button:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default FolderMetadataModal;