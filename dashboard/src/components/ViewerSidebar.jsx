import React from "react";
import { Link } from "react-router-dom";

export function ViewerSidebar() {
  return (
    <div
      className="sidebar border-end p-3 bg-body-tertiary"
      style={{
        width: "250px",
        marginTop: "56px", // ✅ Push below navbar
        height: "calc(100vh - 56px)", // ✅ Ensure it fits screen
        position: "fixed", // ✅ Keep it fixed on the left
        top: "0",
        left: "0",
        backgroundColor: "#f8f9fa",
      }}
    >
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center gap-2" to="/viewerdashboard">
            <i className="bi bi-house-door"></i>
            Dashboard
          </Link>
        </li>
      </ul>

      <hr className="my-3" />

      <ul className="nav flex-column mb-auto">
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center gap-2" to="/settings">
            <i className="bi bi-gear"></i>
            Settings
          </Link>
        </li>
        
      </ul>
    </div>
  );
}

export default ViewerSidebar;
