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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

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
      document.getElementById("fileInput").value = "";
      fetchHistory(docName);
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleHistorySearch = (e) => {
    e.preventDefault();
    fetchHistory(selectedDoc);
  };

  const downloadFile = (fileName) => {
    window.location.href = `${API_URL}/download/${selectedDoc}/${fileName}`;
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#F4EBDC] py-12 px-4 text-[#3A506B]">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-[#3A506B] px-6 py-5">
          <h2 className="text-2xl font-bold text-white text-center">
            Document Version Control
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mx-6 mt-6 bg-green-100 border-l-4 border-green-500 p-4 rounded">
            {message}
          </div>
        )}

        <div className="p-6">
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Upload Document
            </h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block font-medium mb-2" htmlFor="docName">
                  Document Name:
                </label>
                <input
                  id="docName"
                  type="text"
                  className="w-full p-3 border rounded-lg text-[#3A506B]"
                  placeholder="Enter document name"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2" htmlFor="fileInput">
                  Select File:
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="w-full p-2 border rounded-lg text-[#3A506B]"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#3A506B] text-white py-3 px-4 rounded-lg"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </form>
          </div>

          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Check Document History
            </h3>
            <form onSubmit={handleHistorySearch}>
              <div className="mb-4">
                <label
                  className="block font-medium mb-2"
                  htmlFor="historyDocName"
                >
                  Document Name:
                </label>
                <input
                  id="historyDocName"
                  type="text"
                  className="w-full p-3 border rounded-lg text-[#3A506B]"
                  placeholder="Enter document name"
                  value={selectedDoc}
                  onChange={(e) => setSelectedDoc(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#3A506B] text-white py-3 px-4 rounded-lg"
                disabled={isFetching}
              >
                {isFetching ? "Fetching..." : "Fetch History"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Version;
