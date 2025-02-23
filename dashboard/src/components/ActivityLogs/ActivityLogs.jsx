import React, { useState } from "react";
import "./ActivityLogs.css"; // Make sure this CSS file exists for styling.

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

  const userSuggestions = logs
    .map((log) => log.user)
    .filter((user) => user.toLowerCase().startsWith(userFilter.toLowerCase()));
  const actionSuggestions = logs
    .map((log) => log.action)
    .filter((action) => action.toLowerCase().startsWith(actionFilter.toLowerCase()));

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

  const handleBack = () => {
    // Navigate to the previous page (or another intended page)
    window.history.back(); // Navigates to the previous page in the browser's history
  };

  return (
    <div className="container">
      <h2 className="title">User Activity Logs</h2>
      <div className="filters">
        <div>
          <input
            type="text"
            placeholder="Filter by user"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            list="userSuggestions"
          />
          <datalist id="userSuggestions">
            {userSuggestions.map((user, index) => (
              <option key={index} value={user} />
            ))}
          </datalist>
        </div>
        <div>
          <input
            type="text"
            placeholder="Filter by action"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            list="actionSuggestions"
          />
          <datalist id="actionSuggestions">
            {actionSuggestions.map((action, index) => (
              <option key={index} value={action} />
            ))}
          </datalist>
        </div>
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={clearFilters}>Clear Filters</button>
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
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;
