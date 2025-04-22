const EditorUploadButton = ({ onUploadSuccess, buttonStyle }) => {
  const handleUpload = () => {
    setTimeout(() => {
      alert("File uploaded successfully!");
      onUploadSuccess();
    }, 1000);
  };

  return (
    <button
      style={{ ...defaultButtonStyle, ...buttonStyle }}
      onClick={handleUpload}
    >
      📤 Upload
    </button>
  );
};

const defaultButtonStyle = {
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
};

export default EditorUploadButton;
