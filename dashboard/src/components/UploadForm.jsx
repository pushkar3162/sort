import { useState, useEffect } from "react";
import axios from "axios";
import "./UploadForm.css";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [permissions, setPermissions] = useState("");
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");
  const [folderFiles, setFolderFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // 🔸 New state for current user ID

  // 🔸 Fetch current user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/auth/get-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.user_id); // Set userId from response
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!userId) {
      alert("User information not loaded. Please try again in a few seconds.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const tagList = tags.split(",").map((tag) => tag.trim());
    formData.append("tags", JSON.stringify(tagList));

    const emailList = permissions.split(",").map((email) => email.trim());
    formData.append("permissions", JSON.stringify(emailList));

    formData.append("uploaded_by", userId); // 🔸 Dynamically set current user ID
    formData.append("folder_name", folderName);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch("http://localhost:8000/documents/upload", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setFile(null);
        setTitle("");
        setTags("");
        setPermissions("");
        setFolderName("");
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
    if (folderName) {
      fetchFolderFiles();
    }
  }, [folderName]);

  return (
    <div className="upload-form-container">
      <div className="upload-form">
        <h2>Upload Document</h2>
        {message && <p className="upload-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Tags (comma-separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <label>Permissions (comma-separated emails):</label>
          <input
            type="text"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            placeholder="example1@email.com, example2@email.com"
            required
          />

          <label>Choose File:</label>
          <input type="file" onChange={handleFileChange} required />

          <label>Folder Name:</label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            required
          />

          <button type="submit" className="upload-submit">
            Upload
          </button>
        </form>

        {/* Folder File List */}
        <div className="folder-file-list">
          <h3>Files in "{folderName}"</h3>
          {loading ? (
            <p>Loading files...</p>
          ) : folderFiles.length > 0 ? (
            <ul>
              {folderFiles.map((file, index) => (
                <li key={index}>
                  {typeof file === "string" ? file : file.original_name}
                </li>
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

export default UploadForm;
