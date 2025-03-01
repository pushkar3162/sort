import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Version() {
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !docName) {
      setError("Please select a file and enter a document name.");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docName", docName);

    try {
      await axios.post(`${API_URL}/upload`, formData);
      setMessage("File uploaded successfully!");
      setFile(null);
      // Reset the file input
      document.getElementById("fileInput").value = "";
      fetchHistory(docName);
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading file.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch history for a document
  const fetchHistory = async (docName) => {
    if (!docName.trim()) return;

    setIsFetching(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/history/${docName}`);
      setHistory(response.data);
      setSelectedDoc(docName);
    } catch (error) {
      setError("No history found for this document.");
      setHistory([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle history search form submission
  const handleHistorySearch = (e) => {
    e.preventDefault();
    fetchHistory(selectedDoc);
  };

  // Download a specific file version
  const downloadFile = (fileName) => {
    window.location.href = `${API_URL}/download/${selectedDoc}/${fileName}`;
  };

  // Format timestamp to show only day and month
  const formatTimestamp = (timestamp) => {
    try {
      // Try to create a valid date object
      let date;

      if (!isNaN(Number(timestamp))) {
        // If timestamp is a number (Unix timestamp)
        date = new Date(Number(timestamp));
      } else {
        // Otherwise try to parse as string
        date = new Date(timestamp);
      }

      // Check if date is valid
      if (!isNaN(date.getTime())) {
        // Format to show only day and month
        const options = {
          day: "numeric",
          month: "short",
        };
        return date.toLocaleDateString(undefined, options);
      }

      return "Invalid date";
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-5">
          <h2 className="text-2xl font-bold text-white text-center">
            Document Version Control
          </h2>
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="mx-6 mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <div className="flex">
              <div className="py-1">
                <svg
                  className="h-6 w-6 text-red-500 mr-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {message && (
          <div className="mx-6 mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <div className="flex">
              <div className="py-1">
                <svg
                  className="h-6 w-6 text-green-500 mr-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>{message}</div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Upload Section */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
              Upload Document
            </h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="docName"
                >
                  Document Name:
                </label>
                <input
                  id="docName"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                  placeholder="Enter document name"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="fileInput"
                >
                  Select File:
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="w-full p-2 text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex justify-center items-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </button>
            </form>
          </div>

          {/* Fetch History Section */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
              Check Document History
            </h3>
            <form onSubmit={handleHistorySearch}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="historyDocName"
                >
                  Document Name:
                </label>
                <input
                  id="historyDocName"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all"
                  placeholder="Enter document name"
                  value={selectedDoc}
                  onChange={(e) => setSelectedDoc(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex justify-center items-center"
                disabled={isFetching}
              >
                {isFetching ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Fetching...
                  </>
                ) : (
                  "Fetch History"
                )}
              </button>
            </form>
          </div>

          {/* History Display */}
          {history.length > 0 && (
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
                Version History for "{selectedDoc}"
              </h3>
              <ul className="divide-y divide-gray-200">
                {history.map((entry, index) => (
                  <li
                    key={index}
                    className="py-4 hover:bg-gray-50 rounded transition-colors duration-150"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                            Version {entry.version.toString().slice(-6)}
                          </span>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {entry.fileName}
                        </div>
                      </div>
                      <button
                        onClick={() => downloadFile(entry.fileName)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          ></path>
                        </svg>
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Version;
