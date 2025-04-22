import React, { useState, useEffect } from "react";
import "./DocumentLogs.css";

const DocumentLogs = () => {
  const [logs, setLogs] = useState([]);

  // Fetch logs from the API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/logs/documents");
        const data = await response.json();
        console.log("Fetched Logs:", data.logs);
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchLogs();
  }, []);

  const handleBack = () => window.history.back();

  return (
    <div className="document-logs-container">
      <div className="document-logs-card">
        <h2 className="document-logs-title">📄 Document Modification Logs</h2>

        {/* Logs Table */}
        <div className="document-logs-table-container">
          <table className="document-logs-logs-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Action</th>
                <th>Document Title</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index} className={index % 2 === 0 ? "document-logs-even-row" : "document-logs-odd-row"}>
                    <td>{log.user_id}</td>
                    <td>{log.action}</td>
                    <td>{log.document_title || "Untitled"}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="document-logs-no-data">No logs available</td>
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