import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { io } from "socket.io-client";

// Connect to WebSocket server

const socket = io("http://localhost:5000");

const Document = () => {
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  useEffect(() => {
    // Set up connection status
    const handleConnect = () => {
      setConnectionStatus("connected");
      console.log("Connected to server");
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
      console.log("Disconnected from server");
    };

    const handleError = (error) => {
      setConnectionStatus("error");
      console.log("Connection error:", error);
    };

    // Handle initial data load from server
    const handleInitialData = (data) => {
      console.log("Received initial data:", data);
      if (data.files && Array.isArray(data.files)) {
        setFiles(data.files);
      }
      if (data.comments && typeof data.comments === "object") {
        setComments(data.comments);
      }
    };

    // Handle file updates
    const handleFileUploaded = (updatedFiles) => {
      console.log("Files updated:", updatedFiles);
      setFiles(updatedFiles);
    };

    // Handle comment updates
    const handleCommentUpdated = ({ index, value }) => {
      console.log(`Comment updated for index ${index}:`, value);
      setComments((prev) => ({ ...prev, [index]: value }));
    };

    // Handle full comments update
    const handleCommentsFullUpdate = (updatedComments) => {
      console.log("Full comments update:", updatedComments);
      setComments(updatedComments);
    };

    // Handle file removals
    const handleFileRemoved = (updatedFiles) => {
      console.log("Files after removal:", updatedFiles);
      setFiles(updatedFiles);
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("initialData", handleInitialData);
    socket.on("fileUploaded", handleFileUploaded);
    socket.on("commentUpdated", handleCommentUpdated);
    socket.on("commentsFullUpdate", handleCommentsFullUpdate);
    socket.on("fileRemoved", handleFileRemoved);

    // Clean up event listeners when component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("initialData", handleInitialData);
      socket.off("fileUploaded", handleFileUploaded);
      socket.off("commentUpdated", handleCommentUpdated);
      socket.off("commentsFullUpdate", handleCommentsFullUpdate);
      socket.off("fileRemoved", handleFileRemoved);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      // Create file objects with only the necessary properties
      // This is important because File objects aren't serializable for socket.io
      const serializableFiles = [...files, ...newFiles].map((file, index) => ({
        name: file.name,
        size: file.size || 0,
        type: file.type || "",
        lastModified: file.lastModified || Date.now(),
        id: file.id || `file-${Date.now()}-${index}`, // Ensure each file has a unique ID
      }));

      setFiles(serializableFiles);
      socket.emit("fileUploaded", serializableFiles);
    }
  };

  const handleCommentChange = (index, value) => {
    setComments({ ...comments, [index]: value });
    socket.emit("commentUpdated", { index, value });
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    socket.emit("fileRemoved", updatedFiles);
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light"
    >
      <Card className="w-75 p-4 shadow-lg">
        <Card.Title className="text-center mb-3 text-primary">
          Document Management System
        </Card.Title>

        {/* Connection status indicator */}
        <div className="text-center mb-3">
          <Badge
            bg={
              connectionStatus === "connected"
                ? "success"
                : connectionStatus === "disconnected"
                ? "danger"
                : connectionStatus === "error"
                ? "warning"
                : "secondary"
            }
          >
            {connectionStatus === "connected"
              ? "Connected"
              : connectionStatus === "disconnected"
              ? "Disconnected"
              : connectionStatus === "error"
              ? "Connection Error"
              : "Connecting..."}
          </Badge>
        </div>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Upload Documents</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                className="border shadow-sm"
              />
              <Form.Text className="text-muted">
                Select one or more files to upload and share with others
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Card.Subtitle className="mb-2 mt-3">
          Document List ({files.length} documents)
        </Card.Subtitle>

        <ListGroup>
          {files.length > 0 ? (
            files.map((file, index) => (
              <ListGroup.Item
                key={file.id || index}
                className="d-flex justify-content-between align-items-start bg-white shadow-sm rounded p-3 mb-2"
              >
                <div className="ms-2 me-auto w-100">
                  <div className="fw-bold text-dark d-flex justify-content-between">
                    <span>{file.name}</span>
                    <span className="text-muted small">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Add a comment"
                    value={comments[index] || ""}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    className="mt-2 border shadow-sm"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="shadow-sm mt-2"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-center mt-3 text-muted">
              No documents uploaded. Add documents to get started.
            </p>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default Document;
