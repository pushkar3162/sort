import React from "react";
import { Link } from "react-router-dom";

export function ViewerSidebar() {
  const linkStyle = {
    color: "#3A506B",
    fontWeight: "500",
    textDecoration: "none",
    fontFamily: "'Nunito', sans-serif", // Set font to Nunito
    fontSize: "19px", // Set font size to 22px
  };

  const linkHoverStyle = {
    color: "#2C3E50",
  };

  return (
    <div
      className="sidebar border-end p-3"
      style={{
        width: "250px",
        marginTop: "77px",
        height: "calc(100vh - 56px)",
        position: "fixed",
        top: "0",
        left: "0",
        backgroundColor: "#F4EBDC",
        fontFamily: "'Nunito', sans-serif", // Apply Nunito to the whole sidebar
      }}
    >
      {/* Load Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            className="nav-link d-flex align-items-center gap-2"
            to="/viewerdashboard"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.color = linkHoverStyle.color)}
            onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
          >
            <i className="bi bi-house-door"></i>
            Dashboard
          </Link>
        </li>
      </ul>

      <hr className="my-3" />

      <ul className="nav flex-column mb-auto">
        <li className="nav-item">
          <Link
            className="nav-link d-flex align-items-center gap-2"
            to="/settings"
            style={linkStyle}
            onMouseOver={(e) => (e.target.style.color = linkHoverStyle.color)}
            onMouseOut={(e) => (e.target.style.color = linkStyle.color)}
          >
            <i className="bi bi-gear"></i>
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ViewerSidebar;