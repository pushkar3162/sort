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
        {/* Back button inside the card */}
        <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
          🔙 Back
        </button>

        <h2 style={styles.heading}>📋 Members List</h2>
        <button style={styles.addButton} onClick={() => navigate("/add-user")}>
          ➕ Add Member
        </button>
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
                <td colSpan="3" style={styles.noMembers}>No members added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100vh",
    padding: "20px",
   
    fontFamily: "'Open Sans', 'Lora', sans-serif",
  },
  card: {
    backgroundColor: "#D8C3A5", // Warm Sand
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "900px",
    position: "relative",
    maxHeight: "80vh",  // Limit max height
    overflowY: "auto",  // Enable scrolling
  },

  heading: {
    marginBottom: "20px",
    fontSize: "28px",
    color: "#3A506B", // Deep Steel Blue
    fontWeight: "bold",
    fontFamily: "'Space Grotesk', 'Montserrat ExtraBold', sans-serif",
  },
  addButton: {
    backgroundColor: "#3A506B", // Deep Steel Blue
    color: "white",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginBottom: "15px",
    fontFamily: "'Lexend', 'Inter', sans-serif",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },
  addButtonHover: {
    backgroundColor: "#264653", // Deep Teal on Hover
    transform: "scale(1.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    marginTop: "10px",
    backgroundColor: "#FAF0E6", // Light Beige
  },
  th: {
    backgroundColor: "#D8C3A5", // Warm Sand
    color: "#3A506B", // Deep Steel Blue
    padding: "14px",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "'Montserrat', sans-serif",
    textTransform: "uppercase",
  },
  thActions: {
    backgroundColor: "#D8C3A5",
    color: "#3A506B",
    padding: "14px",
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tr: {
    borderBottom: "1px solid #A9927D", // Muted Taupe
  },
  td: {
    padding: "12px",
    color: "#5A382D", // Dark Brown Text
    textAlign: "center",
  },
  tdActions: {
    textAlign: "center",
    padding: "10px",
  },
  noMembers: {
    padding: "15px",
    textAlign: "center",
    color: "#5A382D",
    fontStyle: "italic",
  },
  deleteButton: {
    backgroundColor: "#C1121F", // Rich Red for Delete
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontFamily: "'Poppins Medium', sans-serif",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },
  deleteButtonHover: {
    backgroundColor: "#E35335", // Light Warm Orange
    transform: "scale(1.08) translateY(-2px)", // Adds a bounce effect
    transition: "background 0.3s ease, transform 0.2s ease-in-out",
},

  backButton: {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "12px 18px",
    borderRadius: "8px",
    backgroundColor: "#A4161A", // Rich Red
    color: "white",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Poppins Medium', sans-serif",
    transition: "background 0.3s ease-in-out, transform 0.2s",
  },
  backButtonHover: {
    backgroundColor: "#F77F00", // Warm Orange on Hover
    transform: "scale(1.05)",
  },
};





export default MembersList;
