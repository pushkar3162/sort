import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Themetoggle from "../Themetoggle";
import Searchbar from "../Searchbar";

const EditorNavbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-#3A506B py-2 px-5">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            className="rounded-circle me-2"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Editor Avatar"
            width="40"
            height="40"
            
          />
          <span className="text-white d-none d-md-block fw-bold">EDITOR</span>
        </div>

</div>
      {/* Right Section - Theme Toggle & Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
       
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "1px solid #ffffff",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default EditorNavbar;