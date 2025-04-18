import React, { useState, useEffect } from "react";
import "./ActivityLogs.css";
import axios from "axios";
import Filters from "./Filters";
import LogTable from "./LogTable";
import { useNavigate } from "react-router-dom"; // ✅ For back navigation

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({ user: "", action: "" });

  const navigate = useNavigate(); // ✅ React Router navigation

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/logs/users");
        const fetchedLogs = response.data.logs;
        setLogs(fetchedLogs);
        setFilteredLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const applyFilters = () => {
    const { user, action } = filters;
    const filtered = logs.filter(
      (log) =>
        log.username.toLowerCase().includes(user.toLowerCase()) &&
        log.action.toLowerCase().includes(action.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setFilters({ user: "", action: "" });
    setFilteredLogs(logs);
  };

  return (
    <div className="container">
      {/* ✅ Back Button at Top-Left */}
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h2 className="title">User Activity Logs</h2>

      <Filters
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        logs={logs}
      />

      <div className="table-container">
        <LogTable logs={filteredLogs} />
      </div>
    </div>
  );
};

export default ActivityLogs;
