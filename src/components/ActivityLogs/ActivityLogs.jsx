import React, { useState } from "react";
import "./ActivityLogs.css";
import { FaFilter, FaTimes } from "react-icons/fa";

const ActivityLogs = () => {
  const initialLogs = [
    { user: "user1@example.com", action: "Uploaded Document", document: "Report.pdf", timestamp: "18/2/2025, 3:30:00 pm" },
    { user: "admin@example.com", action: "Deleted Document", document: "Old_Manual.pdf", timestamp: "17/2/2025, 9:00:00 pm" },
    { user: "editor@example.com", action: "Edited Metadata", document: "Project_Plan.pdf", timestamp: "16/2/2025, 5:50:00 pm" },
  ];

  const [logs] = useState(initialLogs);
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [filteredLogs, setFilteredLogs] = useState(initialLogs);

  const applyFilters = () => {
    const filtered = logs.filter(
      (log) =>
        log.user.toLowerCase().includes(userFilter.toLowerCase()) &&
        log.action.toLowerCase().includes(actionFilter.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setUserFilter("");
    setActionFilter("");
    setFilteredLogs(initialLogs);
  };

  return (
    <div className="container">
      <h2 className="title">User Activity Logs</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by user"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by action"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        />
        <button onClick={applyFilters} className="filter-btn">
          <FaFilter /> Apply
        </button>
        <button onClick={clearFilters} className="clear-btn">
          <FaTimes /> Clear
        </button>
      </div>
      <div className="table-container">
        <table className="activity-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Document</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.document}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;