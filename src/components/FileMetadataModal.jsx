import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const FileMetadataModal = ({ isOpen, onClose, metadata, documentId, onSave }) => {
  // Initialize with provided metadata or default values
  // Only keeping title (name), tags, and permissions
  const [editableMetadata, setEditableMetadata] = useState({
    title: metadata?.title || "",
    tags: metadata?.tags || [],
    permissions: metadata?.permissions || ["Private"],
  });

  // Re-initialize the state when metadata prop changes
  useEffect(() => {
    if (metadata) {
      setEditableMetadata({
        title: metadata.title || "",
        tags: Array.isArray(metadata.tags) ? metadata.tags : (metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : []),
        permissions: metadata.permissions || ["Private"],
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

  const handleTagsChange = (e) => {
    // Convert comma-separated string to array of tags
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleChange("tags", tagsArray);
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Include the documentId in the save operation
    onSave({ ...editableMetadata, documentId });
  };

  const stopPropagation = (e) => e.stopPropagation();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="metadata-modal-overlay" onClick={onClose}>
      <div className="metadata-modal" onClick={stopPropagation}>
        <h3>Edit Document Metadata</h3>
        <p>Document ID: {documentId}</p>
        <table className="metadata-table">
          <tbody>
            <tr>
              <td>Title</td>
              <td>
                <input
                  type="text"
                  value={editableMetadata.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Tags</td>
              <td>
                <input
                  type="text"
                  value={editableMetadata.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="Separate with commas"
                />
              </td>
            </tr>
            <tr>
              <td>Permissions</td>
              <td>
                <select
                  value={editableMetadata.permissions[0]}
                  onChange={(e) => handleChange("permissions", [e.target.value])}
                >
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Shared">Shared</option>
                </select>
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