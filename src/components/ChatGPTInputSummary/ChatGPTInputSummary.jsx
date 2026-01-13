import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";

// ProjectInfoCard.jsx
// A beautiful, lightweight summary card for displaying basic project information.
// Usage: <ProjectInfoCard project={projectData} />

export default function ProjectInfoCard({ project }) {
  const defaultProject = {
    projectType: "Independent House",
    area: 1200,
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
  };

  const p = project || defaultProject;

  // Optional image suggestions based on projectType
  const imageSuggestions = {
    "Independent House": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "Apartment": "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
    "Villa": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  };

  const imageUrl =
    imageSuggestions[p.projectType] || imageSuggestions["Independent House"];

  return (
    <Card className="shadow-sm border-0 overflow-hidden mb-4">
      <Row className="g-0 align-items-center">
        {/* Left Image Section */}
        <Col xs={12} md={4}>
          <div
            className="h-100"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "200px",
            }}
          />
        </Col>

        {/* Right Info Section */}
        <Col xs={12} md={8}>
          <Card.Body className="p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
              <div className="flex-grow-1">
                <h4 className="mb-0 fw-bold fs-5 fs-md-4">{p.projectType}</h4>
                <div className="text-muted small">
                  Estimated Build Details
                </div>
              </div>
              <Badge bg="primary" className="fs-6 flex-shrink-0">
                {p.area} sqft
              </Badge>
            </div>

            <Row className="text-center mt-3 g-2">
              <Col xs={4}>
                <h6 className="fw-semibold mb-0">{p.floors}</h6>
                <div className="text-muted small">Floor(s)</div>
              </Col>
              <Col xs={4}>
                <h6 className="fw-semibold mb-0">{p.bedrooms}</h6>
                <div className="text-muted small">Bedroom(s)</div>
              </Col>
              <Col xs={4}>
                <h6 className="fw-semibold mb-0">{p.bathrooms}</h6>
                <div className="text-muted small">Bathroom(s)</div>
              </Col>
            </Row>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}
