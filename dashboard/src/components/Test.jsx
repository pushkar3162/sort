import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import filesFoldersData from "../../folderFilesData"; // Import mock data
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Test = () => {
  const { folderName } = useParams();
  const [folderData, setFolderData] = useState(null);

  useEffect(() => {
    // Find folder data from the mock dataset
    const folder = filesFoldersData.find((f) => f.name === folderName);
    console.log("folder:", folder);
    setFolderData(folder);
  }, [folderName]);

  return (
    <div style={{ backgroundColor: "#F4EBDC", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", position: "absolute", top: 0, left: 0 }}>
      <Navbar />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <div
          className="folder-contents"
          style={{
            margin: "auto",
            background: "#F4EBDC",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            minWidth: "60%"
          }}
        >
          <h1>📁 {folderName}</h1>
          {folderData ? (
            <ul>
              {folderData.files.map((file) => (
                <li key={file.id}>
                  📄 {file.name} ({file.size})
                </li>
              ))}
            </ul>
          ) : (
            <p>Folder not found!</p>
          )}
          <Link to="/dashboard">⬅ Back to File Explorer</Link>
        </div>
      </div>
    </div>
  );
};

export default Test;
