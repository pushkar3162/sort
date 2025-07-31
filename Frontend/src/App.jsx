import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ActivityLogs from "./components/ActivityLogs/ActivityLogs";
import FolderDetails from "./components/AdminDashboard/FolderDetails";
import AuthForm from "./components/AuthForm";
import Doc from "./components/Doc";
import DocumentLogs from "./components/DocumentLogs/DocumentLogs";
import EditorFolderDetails from "./components/EditorDashboard/EditorFolderDetails";
import MembersList from "./components/MembersList";
import Notifications from "./components/Notification";
import RoleBasedUI from "./components/RoleBasedUI";
import UploadForm from "./components/UploadForm";
import Version from "./components/version";
import ViewerFolderDetails from "./components/ViewerDashboard/ViewerFolderDetails";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import EditorDashboard from "./pages/EditorDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";
import AiFeatures from "./pages/AiFeatures";
import ProtectedLayout from "./components/ProtectedLayout";
import RoleBasedC from "./components/RoleBasedC";
import FolderUpload from "./components/folderupload";
const App = () => {
  const [members, setMembers] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthForm />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard/*" element={<RoleBasedC />} />
          <Route path="/editordashboard/*" element={<EditorDashboard />} />
          <Route path="/viewerdashboard/*" element={<ViewerDashboard />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dashboard/:folderName" element={<FolderDetails />} />
          <Route path="/editordashboard/:folderName" element={<EditorFolderDetails />} />
          <Route path="/viewerdashboard/:folderName" element={<ViewerFolderDetails />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/document-logs" element={<DocumentLogs />} />
          <Route path="/doc" element={<Doc />} />
          <Route path="/version" element={<Version />} />
          <Route path="/add-user" element={<RoleBasedUI members={members} setMembers={setMembers} />} />
          <Route path="/members-list" element={<MembersList members={members} setMembers={setMembers} />} />
          <Route path="/ai-features" element={<AiFeatures />} />
          <Route path="/dashboard/:folderName" element={<FolderUpload />} />


          <Route path="/folder-upload" element={<FolderUpload />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
