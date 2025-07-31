import React, { useState, useEffect } from "react";

const EditorDocumentLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/editor-document-logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📜 Document Log</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">File</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Editor</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{log.date}</td>
              <td className="border p-2">{log.fileName}</td>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.editor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditorDocumentLog;
