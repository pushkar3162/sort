import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import ActivityLogs from "../components/ActivityLogs/ActivityLogs"; // ✅ Import ActivityLogs component

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      
      {/* ✅ Nested Routes for ActivityLogs */}
      <Routes>
        <Route path="activity-logs" element={<ActivityLogs />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
