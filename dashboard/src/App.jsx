import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthForm from "./components/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ActivityLogs from "./components/ActivityLogs/ActivityLogs"; // ✅ Import ActivityLogs component

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity-logs" element={<ActivityLogs />} /> {/* ✅ Add Route for Activity Logs */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
