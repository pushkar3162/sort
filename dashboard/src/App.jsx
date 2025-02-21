import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthForm from "./components/AuthForm";
import RoleBasedUI from "./components/RoleBasedUI";
import MembersList from "./components/MembersList";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [members, setMembers] = useState([]); // Centralized members state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
