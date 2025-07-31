import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./UploadForm.css";

const FolderUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [folderFiles, setFolderFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !folderName) {
      alert("Please select a file and provide a folder name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `http://localhost:8000/folders/${folderName}/upload`,
        {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchFolderFiles(); // Refresh file list
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file. Please try again.");
    }
  };

  const fetchFolderFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await axios.get(
        "http://localhost:8000/folders/all-documents",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const folder = response.data.find((f) => f.folder_name === folderName);

      if (!folder) {
        console.warn(`Folder "${folderName}" not found.`);
        setFolderFiles([]);
        return;
      }

      setFolderFiles(folder.files || []);
    } catch (error) {
      console.error("Failed to fetch folder contents:", error);
      setFolderFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (folderName) fetchFolderFiles();
  }, [folderName]);

  return (
    <div className="upload-form-container">
      <div className="upload-form">
        <h2>Upload Document to Folder: {folderName || "Enter Folder Name"}</h2>
        {message && <p className="upload-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>Folder Name:</label>
          <input
            type="text"
            name="folder_name"
            value={folderName}
            onChange={handleFolderNameChange}
            required
          />

          <label>Choose File:</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />

          <button type="submit" className="upload-submit">
            Upload
          </button>
        </form>

        <div className="folder-file-list">
          <h3>Files in "{folderName}"</h3>
          {loading ? (
            <p>Loading files...</p>
          ) : folderFiles.length > 0 ? (
            <ul>
              {folderFiles.map((filename, index) => (
                <li key={index}>{filename}</li>
              ))}
            </ul>
          ) : (
            <p>No files found in this folder.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderUpload;
