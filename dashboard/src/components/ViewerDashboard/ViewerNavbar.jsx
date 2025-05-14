import React from "react";
import { useNavigate } from "react-router-dom";
import Themetoggle from "../Themetoggle";


const ViewerNavbar = () => {
  const navigate = useNavigate();

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
          <span className="text-white d-none d-md-block fw-bold">VIEWER</span>
        </div>

        <ul className="navbar-nav d-flex flex-row align-items-center gap-3">
        
          <li className="nav-item">
            <div className="vr bg-light"></div>
          </li>
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="nav-link d-flex align-items-center text-white bg-transparent border-0"
              style={{ cursor: "pointer" }}
            >
              <span className="me-1">
                <svg
                  className="bi bi-box-arrow-right"
                  width="20"
                  height="20"
                  fill="#6667ab"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L7.707 8l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8A.5.5 0 0 1 1 8z"
                  />
                </svg>
              </span>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ViewerNavbar;