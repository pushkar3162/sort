import { useRef, useState } from "react";
import "./UploadForm.css"; // Make sure this CSS file exists

const FolderUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // To reset file input

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

    const token = localStorage.getItem("auth_token");

    try {
      const folderName = "RR"; // Replace with dynamic folder name if needed

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
        <h2>Upload Document to Folder</h2>
        {message && <p className="upload-message">{message}</p>}
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default FolderUpload;
