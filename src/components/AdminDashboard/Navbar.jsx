import { useNavigate } from "react-router-dom";
import Themetoggle from "../Themetoggle";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-2 px-5"
      style={{ backgroundColor: "#3A506B" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span className="text-white d-none d-md-block fw-bold">ADMIN</span>
        </div>

        <ul className="navbar-nav d-flex flex-row align-items-center gap-3">
          {/* Invite Members Button with Enhanced Hover Effect */}
          <li className="nav-item">
            <button
              className="btn fw-bold"
              onClick={() => navigate("/add-user")}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "2px solid white",
                borderRadius: "6px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e0e0e0"; // Darker shade on hover
                e.target.style.border = "2px solid #ccc"; // Slightly darker border
                e.target.style.transform = "scale(1.05)"; // Slightly enlarges
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white"; // Revert to white
                e.target.style.border = "2px solid white"; // Revert border
                e.target.style.transform = "scale(1)"; // Back to normal size
              }}
            >
              Invite Members
            </button>
          </li>

          {/* Theme Toggle Button with Enhanced Hover Effect */}
          <li className="nav-item">
            <div
              style={{
                border: "2px solid white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.77)"; // Light transparent effect

                e.target.style.transform = "scale(1.1)"; // Slightly enlarges
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"; // Revert to transparent
                e.target.style.border = "2px solid white"; // Revert border
                e.target.style.transform = "scale(1)"; // Back to normal size
              }}
            >
              <Themetoggle />
            </div>
          </li>

          <li className="nav-item">
            <div className="vr bg-light"></div>
          </li>

          {/* Logout Button */}
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="nav-link d-flex align-items-center text-white bg-transparent border-0"
              style={{
                cursor: "pointer",
                padding: "6px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "black";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "white";
              }}
            >
              <span className="me-1">
                <svg
                  className="bi bi-box-arrow-right"
                  width="20"
                  height="20"
                  fill="currentColor"
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

export default Navbar;
