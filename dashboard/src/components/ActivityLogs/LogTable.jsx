import React from "react";

const LogTable = ({ logs }) => {
  return (
    <table className="activity-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Username</th>
          <th>Action</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <tr key={index}>
              <td>{log.user_id}</td>
              <td>{log.username}</td>
              <td>{log.action}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>No logs found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default LogTable;
