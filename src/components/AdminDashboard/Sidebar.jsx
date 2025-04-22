import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Sidebar() {
  return (
    <div
      className="sidebar border border-right col-md-2 col-lg-2 p-0 vh-100 fs-5"
      style={{ 
        width: "250px",
        backgroundColor: "#F8F5F0",
        position: "fixed",
        top: "56px",
        left: "0",
        height: "calc(100vh - 56px)",
        overflowY: "auto",
      }}
    >
      <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2 active" 
              to="/dashboard" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-house-door-fill"></i>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="#" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-chat-dots-fill"></i>
              Messages
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="/notifications" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-bell-fill"></i>
              Notifications
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="#" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-person-circle"></i>
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="/activity-logs" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-clipboard-check-fill"></i>
              User Activity Log
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="/document-logs" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-file-earmark-text-fill"></i>
              Document Log
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase"></h6>
        <hr className="my-3" />

        <ul className="nav flex-column mb-auto">
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="#" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-gear-fill"></i>
              Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="/doc" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-folder-fill"></i>
              My Documents
            </Link>
          </li>

          {/* ✅ New AI Features Button */}
          <li className="nav-item">
            <Link 
              className="nav-link d-flex align-items-center gap-2" 
              to="/ai-features" 
              style={{ 
                color: "#3A506B",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e9e5de"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <i className="bi bi-robot"></i> 
              AI Features
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;