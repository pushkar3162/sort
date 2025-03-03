import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import Test from "./components/Test";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import EditorDashboard from "./pages/EditorDashboard";
import ActivityLogs from "./components/ActivityLogs/ActivityLogs"; // ✅ Import ActivityLogs
import RoleBasedUI from "./components/RoleBasedUI";
import MembersList from "./components/MembersList";
import UploadForm from "./components/UploadForm";
import Notifications from "./components/Notification";
import DocumentLogs from "./components/DocumentLogs/DocumentLogs";
import Doc from "./components/Doc";
import Version from "./components/version";
import ViewerDashboard from "./pages/ViewerDashboard" // ✅ Import Version

const App = () => {
  const [members, setMembers] = useState([]); // Centralized members state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/editordashboard/*" element={<EditorDashboard />} />
        <Route path="/viewerdashboard/*" element={<ViewerDashboard />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/test/:folderName" element={<Test />} />
        
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="/document-logs" element={<DocumentLogs />} />
        <Route path="/doc" element={<Doc />} />
        <Route path="/version" element={<Version />} />
       
        <Route
          path="/add-user"
          element={<RoleBasedUI members={members} setMembers={setMembers} />}
        />
        <Route
          path="/members-list"
          element={<MembersList members={members} setMembers={setMembers} />}
        />
      </Routes>
    </Router>
  );
  
};

export default App;
