import axios from "axios";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaSort, FaSyncAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import filesFoldersData from "../../../folderFilesData.js";
import EditorUploadButton from "./EditorUpload.jsx"; // Import Upload Button
import Folder from "../Folder.jsx";

const EditorFileExplorer = () => {
  const [folders, setFolders] = useState(filesFoldersData);
  const [sortBy, setSortBy] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/folders");
      setFolders(res.data.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const sortFolders = (criteria) => {
    let sortedFolders = [...folders];

    if (criteria === "name") {
      sortedFolders.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "modifiedDate") {
      sortedFolders.sort(
        (a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)
      );
    } else if (criteria === "size") {
      sortedFolders.sort((a, b) => a.size - b.size);
    }

    setSortBy(criteria);
    setFolders(sortedFolders);
    setIsDropdownOpen(false);
  };

  const filteredFolders = folders.filter((folder) => {
    return folder.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={styles.fileExplorer}>
        <h1 style={styles.title}>📂 Editor File Manager</h1>

        {/* Toolbar Section */}
        <div style={styles.toolbar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search documents..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            style={styles.button}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaSort /> Sort By {sortBy && `(${sortBy})`}
          </button>
          <button style={styles.button} onClick={fetchFolders}>
            <FaSyncAlt /> Refresh
          </button>
          {/* Upload Button */}
          <EditorUploadButton
            onUploadSuccess={fetchFolders}
            buttonStyle={styles.button}
          />
        </div>

        {/* Sorting Dropdown */}
        {isDropdownOpen && (
          <div style={styles.dropdown}>
            <p style={styles.dropdownItem} onClick={() => sortFolders("name")}>
              Name
            </p>
            <p
              style={styles.dropdownItem}
              onClick={() => sortFolders("modifiedDate")}
            >
              Modified Date
            </p>
            <p style={styles.dropdownItem} onClick={() => sortFolders("size")}>
              Size
            </p>
          </div>
        )}

        {/* Folder Display */}
        <div style={styles.folderWrapper}>
          <div style={styles.folderContainer}>
            {filteredFolders.map((folder, index) => (
              <Link
                key={index}
                to={`/editordashboard/${folder.name}`}
                style={styles.folderLink}
              >
                <Folder
                  key={folder.id}
                  folder={folder}
                  fetchFolders={fetchFolders}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Inline Styles
const styles = {
  fileExplorer: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "calc(100% - 250px)",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: "250px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    width: "100%",
  },
  searchInput: {
    flex: "1",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    minWidth: "200px",
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#3A506B", // Updated color
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: "100px",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    width: "150px",
    zIndex: 1000,
  },
  folderWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  folderContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "15px",
    maxWidth: "900px",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default EditorFileExplorer;
