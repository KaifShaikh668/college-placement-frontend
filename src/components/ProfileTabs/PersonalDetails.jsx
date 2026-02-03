import React, { useState } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";

export default function PersonalDetails() {
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Card className="p-4 shadow-sm" style={{ borderRadius: "12px" }}>
      <h5 className="fw-bold mb-3">Personal Information</h5>

      {/* PROFILE PHOTO */}
      <div className="d-flex mb-4">
        <div style={{ position: "relative" }}>
          <img
            src={photo || "https://i.pravatar.cc/100"}
            alt="profile"
            className="rounded-circle"
            width="100"
            height="100"
            style={{ objectFit: "cover", border: "3px solid #4353ff" }}
          />

          <label
            htmlFor="upload-photo"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#4353ff",
              color: "white",
              borderRadius: "50%",
              padding: "6px",
              cursor: "pointer"
            }}
          >
            <FaCamera size={15} />
          </label>

          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter full name" required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" max={new Date().toISOString().split("T")[0]} required />
            </Form.Group>
          </Col>
        </Row>

        {/* RESUME UPLOAD */}
        <Form.Group className="mt-2">
          <Form.Label>Upload Resume (PDF)</Form.Label>
          <Form.Control type="file" accept=".pdf" />
        </Form.Group>
      </Form>
    </Card>
  );
}
