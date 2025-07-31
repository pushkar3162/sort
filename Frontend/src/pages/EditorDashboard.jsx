import "./EditorDashboard.css";
import EditorSidebar from "../components/EditorDashboard/EditorSidebar";
import EditorNavbar from "../components/EditorDashboard/EditorNavbar";
import { Routes, Route } from "react-router-dom";
import EditorFileExplorer from "../components/EditorDashboard/EditorFileExplorer";
import EditorUpload from "../components/EditorDashboard/EditorUpload";
import EditorDocumentLogs from "../components/EditorDashboard/EditorDocumentLogs";

const EditorDashboard = () => {
  return (
    <div className="editor-dashboard-container">
      {" "}
      {/* Apply container class */}
      <EditorNavbar />
      <div className="editor-dashboard-content">
        {" "}
        {/* Apply dashboard content class */}
        <EditorSidebar className="editor-sidebar" />
        <main className="editor-main-content">
          <Routes>
            <Route path="document-log" element={<EditorDocumentLogs />} />
          </Routes>
          <EditorFileExplorer />
          <EditorUpload />
        </main>
      </div>
    </div>
  );
};

export default EditorDashboard;
