import React from "react";
import "./ViewerDashboard.css";
import ViewerSidebar from "../components/ViewerSidebar";
import ViewerNavbar from "../components/ViewerNavbar";
import { Routes, Route } from "react-router-dom";
import ViewerFileExplorer from "../components/ViewerFile";

export const ViewerDashboard = () => {
  return (
    <div className="editor-dashboard-container">  {/* Apply container class */}
      <ViewerNavbar />
      <div className="editor-dashboard-content">  {/* Apply dashboard content class */}
        <ViewerSidebar className="editor-sidebar" />
        <main className="editor-main-content">
          <ViewerFileExplorer />
        </main>
      </div>
    </div>
  );
};

export default ViewerDashboard;
