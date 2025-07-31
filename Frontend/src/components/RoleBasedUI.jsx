import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleBasedUI = ({ members, setMembers }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error || email.trim() === "") return;

    const isDuplicate = members.some((member) => member.email === email);
    if (isDuplicate) {
      setError("This email is already added.");
      return;
    }

    const token = localStorage.getItem("auth_token");
    const formData = new FormData();
    formData.append("email", email);
    formData.append ("new_role",role);   

    try {
      const response = await fetch("http://localhost:8000/auth/change-role", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to assign role.");
        return;
      }

      const updatedMembers = [...members, { email, role }];
      setMembers(updatedMembers);
      localStorage.setItem("members", JSON.stringify(updatedMembers));
      setSuccess("User role assigned successfully!");
      setEmail("");
      setRole("viewer");
      setError("");
    } catch (err) {
      console.error("Error while assigning role:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button
          onClick={() => navigate("/members-list")}
          style={styles.membersButton}
        >
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={!!error}
            >
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
    backgroundColor: "#F4EBDC",
  },

  card: {
    backgroundColor: "#F4EBDC",
    padding: "25px",
    borderRadius: "12px",
    border: "2px solid white",
    boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.5)",
    width: "450px",
    textAlign: "center",
    position: "relative",
    color: "#3A506B",
  },

  membersButton: {
    position: "absolute",
    top: "15px",
    right: "10px",
    backgroundColor: "#B08968",
    color: "black",
    border: "none",
    padding: "5px 10px",
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
    color: "#3A506B",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },

  label: {
    alignSelf: "flex-start",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#3A506B",
    marginLeft: "10%",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #A9927D",
    outline: "none",
    backgroundColor: "#FAF0E6",
    width: "80%",
    display: "block",
  },

  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #A9927D",
    outline: "none",
    backgroundColor: "#FAF0E6",
    width: "80%",
    display: "block",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "80%",
    marginTop: "10px",
  },

  cancelButton: {
    backgroundColor: "#3A506B",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
    width: "30%",
  },

  submitButton: {
    backgroundColor: "#3A506B",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.3s ease",
    width: "30%",
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  },

  success: {
    color: "green",
    fontSize: "12px",
    marginTop: "5px",
  },
};

export default RoleBasedUI;