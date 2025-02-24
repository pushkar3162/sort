import React, { useState } from "react";
import "./DocumentLogs.css";

const DocumentLogs = () => {
  const initialLogs = [
    { action: "Uploaded Document", user: "user123", timestamp: "2025-02-17 10:00 AM" },
    { action: "Edited Document", user: "user456", timestamp: "2025-02-18 02:30 PM" },
    { action: "Deleted Document", user: "user789", timestamp: "2025-02-19 09:45 AM" },
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
    setFilteredLogs(
      logs.filter(
        (log) =>
          log.user.toLowerCase().includes(userFilter.toLowerCase()) &&
          log.action.toLowerCase().includes(actionFilter.toLowerCase())
      )
    );
  };

  const clearFilters = () => {
    setUserFilter("");
    setActionFilter("");
    setFilteredLogs(initialLogs);
  };

  const handleBack = () => window.history.back();

  return (
    <div className="document-logs-container">
      <div className="document-logs-card">
        <h2 className="document-logs-title">📄 Document Modification Logs</h2>

        {/* Filter Section */}
        <div className="document-logs-filter-section">
          <div>
            <input
              type="text"
              placeholder="Filter by user"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              list="userSuggestions"
              className="document-logs-filter-input"
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
              className="document-logs-filter-input"
            />
            <datalist id="actionSuggestions">
              {actionSuggestions.map((action, index) => (
                <option key={index} value={action} />
              ))}
            </datalist>
          </div>
          <div className="document-logs-button-group">
            <button onClick={applyFilters} className="document-logs-btn document-logs-apply-btn">Apply</button>
            <button onClick={clearFilters} className="document-logs-btn document-logs-clear-btn">Clear</button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="document-logs-table-container">
          <table className="document-logs-logs-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={index} className={index % 2 === 0 ? "document-logs-even-row" : "document-logs-odd-row"}>
                    <td>{log.action}</td>
                    <td>{log.user}</td>
                    <td>{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="document-logs-no-data">No matching logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="document-logs-back-button">
          <button onClick={handleBack} className="document-logs-btn document-logs-back-btn">Back</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentLogs;
