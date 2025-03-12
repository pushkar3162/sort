import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import FileExplorer from "../components/FileExplorer";
import ActivityLogs from "../components/ActivityLogs/ActivityLogs";
import DocumentLogs from "../components/DocumentLogs/DocumentLogs";

const Dashboard = () => {
  return (
    <div>
      <Navbar /> {/* Navbar includes the theme toggle */}
      <Sidebar className="sidebar" />

      <Routes>
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="document-logs" element={<DocumentLogs />} />
      </Routes>

      <main className="main-content">
        <FileExplorer />
      </main>
    </div>
  );
};

export default Dashboard;
