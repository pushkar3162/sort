import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MembersList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem("members")) || [];
    setMembers(storedMembers);
  }, []);

  const handleDelete = (email) => {
    const updatedMembers = members.filter((member) => member.email !== email);
    setMembers(updatedMembers);
    localStorage.setItem("members", JSON.stringify(updatedMembers));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back
        </button>
        <h2 style={styles.heading}>📋 Members List</h2>
        <button style={styles.addButton} onClick={() => navigate("/add-user")}>
          ➕ Add Member
        </button>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member, index) => (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{member.email}</td>
                    <td style={styles.td}>{member.role}</td>
                    <td style={styles.tdActions}>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(member.email)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={styles.noMembers}>
                    No members added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#F4EBDC", // Base color
    fontFamily: "'Open Sans', sans-serif",
  },
  card: {
    backgroundColor: "#F4EBDC", // Secondary color
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
    width: "80%",
    maxWidth: "900px",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "28px",
    color: "#3A506B", // Primary color
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#3A506B ", // Primary color
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "16px",
    transition: "all 0.3s ease-in-out",
  },
  addButtonHover: {
    backgroundColor: "#2C3E50", // Darker shade on hover
  },
  tableWrapper: {
    maxHeight: "400px",
    overflowY: "auto",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#F4EBDC", // Base color
    borderRadius: "8px",
  },
  th: {
    backgroundColor: "#B08968 ", // Primary color
    color: "white",
    padding: "14px",
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  thActions: {
    backgroundColor: "#B08968 ",
    color: "white",
    padding: "14px",
    textAlign: "center",
    fontWeight: "bold",
  },
  tr: {
    borderBottom: "2px solid #D8C3A5", // Secondary color
  },
  td: {
    padding: "12px",
    color: "#3A506B", // Primary color
    textAlign: "center",
  },
  tdActions: {
    textAlign: "center",
    padding: "10px",
  },
  noMembers: {
    padding: "20px",
    textAlign: "center",
    color: "#3A506B",
    fontStyle: "italic",
  },
  deleteButton: {
    backgroundColor: "#A4161A", // Rich Red for Delete
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    backgroundColor: "#3A506B", // Primary color
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease-in-out",
  },
};

export default MembersList;
