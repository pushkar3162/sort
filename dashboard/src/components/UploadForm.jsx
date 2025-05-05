import { useState } from "react";
import "./UploadForm.css"; // Import UploadForm CSS

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [permissions, setPermissions] = useState(""); // Now storing emails
  const [folderName, setFolderName] = useState(""); // 🔹 New state for folder_name
  const [message, setMessage] = useState(""); // State to handle success message

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
  
    const tagList = tags.split(",").map((tag) => tag.trim());
    formData.append("tags", JSON.stringify(tagList)); // ✅ Send as JSON string
  
    const emailList = permissions.split(",").map((email) => email.trim());
    formData.append("permissions", JSON.stringify(emailList)); // ✅ Same here
  
    formData.append("uploaded_by", "1");
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
      } else {
        const errorData = await response.json();
        setMessage(`Upload failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file. Please try again.");
    }
  };
  
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

          {/* 🔹 New input for folder_name */}
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
      </div>
    </div>
  );
};

export default UploadForm;
