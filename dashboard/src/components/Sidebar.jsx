import React from "react";

function Sidebar() {
  return (
    <div
      className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary vh-100  fs-5"
      style={{ width: "300px" }}
    >
      <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              className="nav-link d-flex align-items-center gap-2 active"
              aria-current="page"
              href="#"
            >
              <i className="bi bi-house-fill"></i>
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center gap-2" href="#">
              <i className="bi bi-chat-left"></i>
              Messages
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center gap-2" href="#">
              <i className="bi bi-app-indicator"></i>
              Notifications
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center gap-2" href="#">
              <i className="bi bi-person-fill"></i>
              Profile
            </a>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase"></h6>

        <hr className="my-3" />

        <ul className="nav flex-column mb-auto">
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center gap-2" href="#">
              <i className="bi bi-gear-wide-connected"></i>
              Settings
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link d-flex align-items-center gap-2" href="#">
              <i className="bi bi-door-closed"></i>
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
