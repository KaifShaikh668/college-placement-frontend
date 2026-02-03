import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";

const statesOfIndia = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh"
];

export default function AddressDetails() {
  return (
    <Card className="p-4 shadow-sm" style={{ borderRadius: "12px" }}>
      <h5 className="fw-bold mb-3">Address Information</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Street Address</Form.Label>
          <Form.Control type="text" placeholder="Enter address" required />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" placeholder="Enter city" required />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Select required>
                <option>Select State</option>
                {statesOfIndia.map((state, idx) => (
                  <option key={idx}>{state}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>PIN Code</Form.Label>
          <Form.Control type="text" placeholder="Enter PIN Code" maxLength={6} required />
        </Form.Group>
      </Form>
    </Card>
  );
}
