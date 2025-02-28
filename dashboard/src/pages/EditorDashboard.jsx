import React from "react";
import "./EditorDashboard.css";
import EditorSidebar from "../components/EditorSidebar";
import EditorNavbar from "../components/EditorNavbar";
import { Routes, Route } from "react-router-dom";
import EditorFileExplorer from "../components/EditorFileExplorer";
import EditorUpload from "../components/EditorUpload";
import EditorDocumentLogs from "../components/EditorDocumentLogs";

const EditorDashboard = () => {
  return (
    <div className="editor-dashboard-container">  {/* Apply container class */}
      <EditorNavbar />
      <div className="editor-dashboard-content">  {/* Apply dashboard content class */}
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
