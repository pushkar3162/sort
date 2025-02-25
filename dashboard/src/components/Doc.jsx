import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  ListGroup,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to WebSocket server

const Doc = () => {
  const [files, setFiles] = useState([]); // Start with an empty list
  const [comments, setComments] = useState({});

  useEffect(() => {
    socket.on("fileUploaded", (updatedFiles) => {
      setFiles(updatedFiles);
    });

    socket.on("commentUpdated", ({ index, value }) => {
      setComments((prev) => ({ ...prev, [index]: value }));
    });

    socket.on("fileRemoved", (updatedFiles) => {
      setFiles(updatedFiles);
    });

    return () => {
      socket.off("fileUploaded");
      socket.off("commentUpdated");
      socket.off("fileRemoved");
    };
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      socket.emit("fileUploaded", updatedFiles);
    }
  };

  const handleCommentChange = (index, value) => {
    setComments({ ...comments, [index]: value });
    socket.emit("commentUpdated", { index, value });
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    const updatedComments = { ...comments };
    delete updatedComments[index];
    setComments(updatedComments);
    socket.emit("fileRemoved", updatedFiles);
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center bg-success text-light"
    >
      <Card className="w-50 p-4 shadow-lg bg-primary">
        <Card.Title className="text-center mb-3">
          Upload & Manage Documents
        </Card.Title>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Upload Document</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                className="border-0 shadow-sm"
              />
            </Form.Group>
          </Col>
        </Row>
        <ListGroup>
          {files.length > 0 ? (
            files.map((file, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center bg-light shadow-sm rounded p-3"
              >
                <div>
                  <strong className="text-dark">{file.name}</strong>
                  <Form.Control
                    type="text"
                    placeholder="Add a comment"
                    value={comments[index] || ""}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    className="mt-2 border-0 shadow-sm"
                  />
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="shadow-sm"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-center mt-3 text-white">No files uploaded.</p>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default Doc;
