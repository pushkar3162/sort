import { useEffect, useRef, useState } from "react";
import MetadataModal from "./MetadataModal";

const Ellipsis = ({
  folderId,
  fileid,
  metadata,
  onSaveMetadata,
  onDelete,
  onRename,
  onDownload,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMetadataEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsMetadataModalOpen(true);
  };

  const handleSaveMetadata = (updatedMetadata) => {
    onSaveMetadata(updatedMetadata);
  };

  const handleCloseModal = () => {
    setIsMetadataModalOpen(false);
  };

  const handleAction = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action) {
      action();
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="ellipsis-container" ref={menuRef}>
        <button
          className="ellipsis-button"
          onClick={handleMenuToggle}
          aria-label="Folder options"
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div className="ellipsis-menu">
            <p onClick={handleMetadataEdit}>Edit Metadata</p>
            <p onClick={(e) => handleAction(() => onDownload?.(folderId), e)}>
              Download
            </p>
            <p onClick={(e) => handleAction(() => onRename?.(folderId), e)}>
              Rename
            </p>
            <p onClick={(e) => handleAction(() => onDelete?.(folderId), e)}>
              Delete
            </p>
          </div>
        )}

        <style >{`
          .ellipsis-container {
            position: relative;
            display: inline-block;
          }
          .ellipsis-button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 20px;
            padding: 5px;
          }
          .ellipsis-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 999;
          }
          .ellipsis-menu p {
            margin: 0;
            padding: 8px 12px;
            cursor: pointer;
            white-space: nowrap;
          }
          .ellipsis-menu p:hover {
            background-color: #f1f1f1;
          }
        `}</style>
      </div>

      <MetadataModal
        isOpen={isMetadataModalOpen}
        onClose={handleCloseModal}
        metadata={metadata}
        onSave={handleSaveMetadata}
      />
    </>
  );
};

export default Ellipsis;
