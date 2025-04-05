import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const FileMetadataModal = ({ isOpen, onClose, metadata, onSave }) => {
  // Initialize with provided metadata or default values
  const [editableMetadata, setEditableMetadata] = useState({
    name: metadata?.name || "",
    createdAt: metadata?.createdAt || new Date().toISOString().split("T")[0],
    modifiedAt: metadata?.modifiedAt || new Date().toISOString().split("T")[0],
    owner: metadata?.owner || "Current User",
    tags: metadata?.tags || "",
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
        tags: metadata.tags || "",
        description: metadata.description || "",
        permissions: metadata.permissions || "Private",
      });
    }
  }, [metadata]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (key, value) => {
    setEditableMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(editableMetadata);
  };

  const stopPropagation = (e) => e.stopPropagation();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="metadata-modal-overlay" onClick={onClose}>
      <div className="metadata-modal" onClick={stopPropagation}>
        <h3>Edit File Metadata</h3>
        <table className="metadata-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <input
                  type="text"
                  value={editableMetadata.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Created</td>
              <td>
                <input
                  type="date"
                  value={editableMetadata.createdAt}
                  onChange={(e) => handleChange("createdAt", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Modified</td>
              <td>
                <input
                  type="date"
                  value={editableMetadata.modifiedAt}
                  onChange={(e) => handleChange("modifiedAt", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>
                <input
                  type="text"
                  value={editableMetadata.owner}
                  onChange={(e) => handleChange("owner", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Tags</td>
              <td>
                <input
                  type="text"
                  value={editableMetadata.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="Separate with commas"
                />
              </td>
            </tr>
            <tr>
              <td>Permissions</td>
              <td>
                <select
                  value={editableMetadata.permissions}
                  onChange={(e) => handleChange("permissions", e.target.value)}
                >
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Shared">Shared</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td>
                <textarea
                  value={editableMetadata.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows="3"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="modal-buttons">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button
            className="cancel-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
        <style jsx>{`
          .metadata-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
          }
          .metadata-modal {
            background: #F4EBDC;
            padding: 20px;
            border-radius: 8px;
            width: 500px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
          }
          .metadata-modal h3 {
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .metadata-table {
            width: 100%;
            border-collapse: collapse;
          }
          .metadata-table td {
            padding: 8px;
            border-bottom: 1px solid #eee;
          }
          .metadata-table td:first-child {
            width: 120px;
            font-weight: 500;
          }
          .metadata-table input,
          .metadata-table select,
          .metadata-table textarea {
            
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }
          .metadata-table textarea {
            resize: vertical;
          }
          .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
          }
          .save-button {
            background: #3a506b;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          .save-button:hover {
            background: #0056b3;
          }
          .cancel-button {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          .cancel-button:hover {
            background: #e9ecef;
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};

export default FileMetadataModal;