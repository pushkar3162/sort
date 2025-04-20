import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FileMetadataModal from "./FileMetadataModal";
import FolderMetadataModal from "./FolderMetadataModal";

const EllipsisMenu = ({ 
  position, 
  onMetadataEdit, 
  onDownload, 
  onRename, 
  onMove, 
  onDelete, 
  fileId, 
  folderId,
  onClose 
}) => {
  const isFile = !!fileId;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (typeof document === "undefined") {
    return null; // SSR safety
  }

  const handleAction = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const style = {
    top: `${position.top}px`,
    left: `${position.left}px`,
  };

  return createPortal(
    <div className="ellipsis-menu-portal" ref={menuRef} style={style}>
      <p onClick={(e) => handleAction(onMetadataEdit, e)}>Edit Metadata</p>
      {onDownload && (
        <p onClick={(e) => handleAction(() => onDownload(fileId || folderId), e)}>
          Download
        </p>
      )}
      {onRename && (
        <p onClick={(e) => handleAction(() => onRename(fileId || folderId), e)}>
          Rename
        </p>
      )}
      {onMove && isFile && (
        <p onClick={(e) => handleAction(() => onMove(fileId), e)}>
          Move
        </p>
      )}
      {onDelete && (
        <p className="delete-option" onClick={(e) => handleAction(() => onDelete(fileId || folderId), e)}>
          Delete
        </p>
      )}
      <style jsx>{`
        .ellipsis-menu-portal {
          position: fixed;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          min-width: 150px;
          overflow: visible;
        }

        .ellipsis-menu-portal p {
          margin: 0;
          padding: 10px 16px;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.2s ease;
        }

        .ellipsis-menu-portal p:hover {
          background-color: #f5f5f5;
        }

        .delete-option {
          color: #ff3b30 !important;
          font-weight: 500;
        }

        .delete-option:hover {
          background-color: rgba(255, 59, 48, 0.1) !important;
        }
      `}</style>
    </div>,
    document.body
  );
};

const Ellipsis = ({
  folderId,
  fileId,
  metadata,
  onSaveMetadata,
  onDelete,
  onRename,
  onDownload,
  onMove,
  onModalStateChange  // New prop to communicate modal state to parent
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const isFolder = !!folderId;
  const isFile = !!fileId;

  // Close menu when any modal opens anywhere
  useEffect(() => {
    const handleModalOpen = () => {
      setIsMenuOpen(false);
    };

    // Custom event for modal open that will be dispatched by all modals
    window.addEventListener("modalOpen", handleModalOpen);

    return () => {
      window.removeEventListener("modalOpen", handleModalOpen);
    };
  }, []);

  // Communicate modal state changes to parent component
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(isMetadataModalOpen);
    }
  }, [isMetadataModalOpen, onModalStateChange]);

  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position the menu below and to the right of the button
      setMenuPosition({
        top: rect.bottom + 5,
        left: rect.left - 120 + rect.width / 2,
      });
    }

    setIsMenuOpen(!isMenuOpen);
  };

  const handleMetadataEdit = () => {
    setIsMenuOpen(false);
    setIsMetadataModalOpen(true);
    
    // Dispatch custom event to close other menus
    window.dispatchEvent(new Event("modalOpen"));
  };

  const handleSaveMetadata = (updatedMetadata) => {
    // Pass the updated metadata to the parent component
    onSaveMetadata(updatedMetadata);
    // Close the modal
    setIsMetadataModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsMetadataModalOpen(false);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="ellipsis-container">
        <button
          className="ellipsis-button"
          onClick={handleMenuToggle}
          aria-label="Options"
          disabled={isMetadataModalOpen}
          ref={buttonRef}
        >
          ⋮
        </button>

        {isMenuOpen && !isMetadataModalOpen && (
          <EllipsisMenu
            position={menuPosition}
            onMetadataEdit={handleMetadataEdit}
            onDownload={onDownload}
            onRename={onRename}
            onMove={onMove}
            onDelete={onDelete}
            fileId={fileId}
            folderId={folderId}
            onClose={handleCloseMenu}
          />
        )}
      </div>

      {isMetadataModalOpen && isFile && (
        <FileMetadataModal
          isOpen={isMetadataModalOpen}
          onClose={handleCloseModal}
          metadata={metadata}
          onSave={handleSaveMetadata}
        />
      )}
      {isMetadataModalOpen && isFolder && (
        <FolderMetadataModal
          isOpen={isMetadataModalOpen}
          onClose={handleCloseModal}
          metadata={metadata}
          onSave={handleSaveMetadata}
        />
      )}

      <style jsx>{`
        .ellipsis-container {
          position: relative;
          display: inline-block;
          margin-right: 10px;
        }

        .ellipsis-button {
          color: black;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 20px;
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          background-color: transparent;
        }

        .ellipsis-button:hover {
          background-color: #3a506b;
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .ellipsis-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default Ellipsis;