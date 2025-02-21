import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleBasedUI = ({ members, setMembers }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setSuccess("");

    if (newEmail === "") {
      setError("Email is required.");
    } else if (!validateEmail(newEmail)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error || email.trim() === "") return;
  
    const isDuplicate = members.some(member => member.email === email);
    if (isDuplicate) {
      setError("This email is already added.");
      return;
    }
  
    const updatedMembers = [...members, { email, role }];
    setMembers(updatedMembers);
    localStorage.setItem("members", JSON.stringify(updatedMembers));
    setSuccess("User added successfully!");
    setEmail("");
    setRole("Viewer");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate("/members-list")} style={styles.membersButton}>
          📋 Members
        </button>

        <h2 style={styles.heading}>Assign Role</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <label style={styles.label}>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
            <option value="Viewer">Viewer</option>
            <option value="Editor">Editor</option>
          </select>

          <div style={styles.buttonContainer}>
            <button type="button" onClick={() => navigate("/dashboard")} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton} disabled={!!error}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Open Sans', 'Lora', sans-serif",
  },

  card: {
    backgroundColor: "#D8C3A5", // Warm Sand
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    width: "400px",
    textAlign: "center",
    position: "relative",
    color: "#3A506B", // Deep Steel Blue
  },

  membersButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#16A085", // Teal Green
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#3A506B", // Deep Steel Blue
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  label: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#3A506B", // Deep Steel Blue
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #A9927D", // Muted Taupe
    outline: "none",
    backgroundColor: "#FAF0E6", // Light Beige
  },

  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #A9927D", // Muted Taupe
    outline: "none",
    backgroundColor: "#FAF0E6", // Light Beige
  },

  error: {
    color: "#C1121F", // Rich Red
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "left",
  },

  success: {
    color: "#3A506B", // Deep Steel Blue
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "left",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },

  cancelButton: {
    backgroundColor: "#95A5A6", // Soft Gray
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },

  submitButton: {
    backgroundColor: "#3A506B", // Deep Steel Blue
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
};


export default RoleBasedUI;
