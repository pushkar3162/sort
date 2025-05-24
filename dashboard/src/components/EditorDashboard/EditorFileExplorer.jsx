import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link, useNavigate } from "react-router-dom";

import Folder from "../Folder.jsx";
import { Height } from "@mui/icons-material";
import { maxHeight } from "@mui/system";
import { FaSort, FaSyncAlt } from "react-icons/fa";
import filesFoldersData from "../../../folderFilesData.js";






const EditorFileExplorer = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
  



  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/folders");
      console.log("Fetched folders:", res.data);
      
      setFolders(res.data ||[]);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setFolders([]);
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
           <button style={styles.button} onClick={() => navigate("/Upload")}>
            ⬆ Upload
          </button>
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
        <div style={styles.folderContainer}>
  {folders.length > 0 ? (
    <>
      {folders.map((folder) => (
        <Link key={folder.id} to={`/editordashboard/${folder.folder_name}`}>
          <Folder
            folder={folder}
            fetchFolders={fetchFolders}
            setSelectedFolder={setSelectedFolder}
          />
        </Link>
      ))}
    </>
  ) : (
    <p>No folders available. Click "New" to create one!</p>
  )}
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
