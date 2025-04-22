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
    const handleConnect = () => setConnectionStatus("connected");
    const handleDisconnect = () => setConnectionStatus("disconnected");
    const handleError = () => setConnectionStatus("error");
    const handleInitialData = (data) => {
      if (data.files) setFiles(data.files);
      if (data.comments) setComments(data.comments);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("initialData", handleInitialData);
    socket.on("fileUploaded", setFiles);
    socket.on("commentUpdated", ({ index, value }) =>
      setComments((prev) => ({ ...prev, [index]: value }))
    );
    socket.on("commentsFullUpdate", setComments);
    socket.on("fileRemoved", setFiles);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("initialData", handleInitialData);
      socket.off("fileUploaded", setFiles);
      socket.off("commentUpdated");
      socket.off("commentsFullUpdate");
      socket.off("fileRemoved");
    };
  }, []);

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{ backgroundColor: "#F4EBDC" }} // Set background color
    >
      <Card
        className="w-75 p-4 shadow-lg"
        style={{
          backgroundColor: "#F4EBDC",
          color: "#3A506B", // Set text color
          border: "2px solid white", // White border
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.5)", // White shadow effect
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title style={{ color: "#3A506B" }}>
            Document Management System
          </Card.Title>
        </div>

        <div className="text-center mb-3">
          <Badge
            style={{ backgroundColor: "#3A506B", color: "#F4EBDC" }} // Status badge styling
          >
            {connectionStatus.charAt(0).toUpperCase() +
              connectionStatus.slice(1)}
          </Badge>
        </div>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="fw-bold" style={{ color: "#3A506B" }}>
                Upload Documents
              </Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files).map(
                    (file, index) => ({
                      name: file.name,
                      size: file.size || 0,
                      type: file.type || "",
                      lastModified: file.lastModified || Date.now(),
                      id: `file-${Date.now()}-${index}`,
                    })
                  );
                  setFiles((prev) => [...prev, ...newFiles]);
                  socket.emit("fileUploaded", [...files, ...newFiles]);
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Card.Subtitle className="mb-2 mt-3" style={{ color: "#3A506B" }}>
          Document List ({files.length} documents)
        </Card.Subtitle>

        <ListGroup>
          {files.length > 0 ? (
            files.map((file, index) => (
              <ListGroup.Item
                key={file.id || index}
                style={{
                  backgroundColor: "rgba(0, 123, 255, 0.1)",
                  borderLeft: "5px solid #007bff",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                  color: "#3A506B", // Ensures text color applies correctly
                }}
              >
                <div className="ms-2 me-auto w-100">
                  <div className="fw-bold d-flex justify-content-between">
                    <span>{file.name}</span>
                    <span className="text-muted small">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Add a comment"
                    value={comments[index] || ""}
                    onChange={(e) => {
                      setComments({ ...comments, [index]: e.target.value });
                      socket.emit("commentUpdated", {
                        index,
                        value: e.target.value,
                      });
                    }}
                    className="mt-2"
                    style={{ color: "#3A506B", borderColor: "#3A506B" }} // Styling for input
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                      socket.emit(
                        "fileRemoved",
                        files.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-center mt-3" style={{ color: "#3A506B" }}>
              No documents uploaded.
            </p>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default Document;
