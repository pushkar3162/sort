import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import ActivityLogs from "../components/ActivityLogs/ActivityLogs"; // ✅ Import ActivityLogs component
import DocumentLogs from "../components/DocumentLogs/DocumentLogs";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      
      {/* ✅ Nested Routes for ActivityLogs */}
      <Routes>
        <Route path="activity-logs" element={<ActivityLogs />} />
        
      </Routes>
      <Routes>
      <Route path="document-logs" element={<DocumentLogs />} />   
      </Routes>
      
    </div>
  );
};

export default Dashboard;
