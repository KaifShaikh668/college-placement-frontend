import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

const degreeList = [
  "Bachelor of Arts (B.A) in Psychology",
  "Bachelor of Arts (B.A) in Political Science",
  "Bachelor of Arts (B.A) in History",
  "Bachelor of Arts (B.A) in Hindi",
  "Bachelor of Arts (B.A) in Economics",
  "Bachelor of Arts in Multimedia and Mass Communication (B.A.M.M.C.)",
  "Bachelor of Commerce (B.Com)",
  "Bachelor of Management Studies (B.M.S.)",
  "B.Com (Accounting and Finance)",
  "B.Com (Banking and Insurance)",
  "B.Com. (Financial Management)",
  "Bachelor of Science (B.Sc.)",
  "Bachelor of Science (Mathematics)",
  "Bachelor of Science (Physics)",
  "Bachelor of Science (Chemistry)",
  "B.Sc (Information Technology)"
];

export default function AcademicDetails() {
  return (
    <Card className="p-4 shadow-sm" style={{ borderRadius: "12px" }}>
      <h5 className="fw-bold mb-3">Academic Information</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Select Degree</Form.Label>
          <Form.Select required>
            <option>Select Degree</option>
            {degreeList.map((degree, i) => (
              <option key={i}>{degree}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>10th Percentage</Form.Label>
              <Form.Control type="number" placeholder="Enter %" required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>12th Percentage</Form.Label>
              <Form.Control type="number" placeholder="Enter %" required />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Current CGPA</Form.Label>
          <Form.Control type="number" placeholder="Enter CGPA" required />
        </Form.Group>
      </Form>
    </Card>
  );
}
