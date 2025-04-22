import React from "react";

const LogTable = ({ logs }) => {
  return (
    <table className="logs-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Action</th>
          <th>Document</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {logs.length > 0 ? (
          logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.document}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No activity logs found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default LogTable;
