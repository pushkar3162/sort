import axios from "axios";
import { useRef } from "react";
import UploadForm from "./UploadForm";
import { FaUpload } from "react-icons/fa";

const EditorUploadButton = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload successful:", res.data);
      onUploadSuccess(); // Refresh file list after upload
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <>
      <button style={styles.button} onClick={() => fileInputRef.current.click()}>
        <FaUpload /> Upload
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        onChange={handleFileChange}
      />
    </>
  );
};

const styles = {
  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default EditorUploadButton;
