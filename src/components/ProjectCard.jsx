import React from 'react';
import { Card, Col } from 'react-bootstrap';

const ProjectCard = ({ project, onClick }) => (
  <Col md={4} lg={4}>
    {project.show && 
      <Card
        className="h-100 shadow-sm rounded p-3 border card-hover cursor-pointer"
        onClick={onClick}
      >
        <Card.Body className="d-flex flex-column align-items-center text-center">
          <i className={`bi ${project.icon} display-6 mb-2 text-primary`}></i>
          <Card.Title className="h4">{project.title}</Card.Title>
          <Card.Subtitle className="text-muted mb-3 small">{project.desc}</Card.Subtitle>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary-subtle text-secondary-emphasis border">
                {tag}
              </span>
            ))}
          </div>
        </Card.Body>
      </Card>
    } 
    {!project.show && 
      <Card
        bg='light'
        className="h-100 shadow-sm rounded p-3 border card-hover cursor-pointer"
      >
        <Card.Body className="d-flex flex-column align-items-center text-center">
          <i className={`bi ${project.icon} display-6 mb-2 text-primary`}></i>
          <i className={`bi ${project.iconLock} display-6 mb-2 text-primary`}></i>
          <Card.Title className="h4">{project.title}</Card.Title>
          <Card.Subtitle className="text-muted mb-3 small">{project.desc}</Card.Subtitle>
          <h4>CONSULT BUILDER BRO TO UNLOCK...</h4>
        </Card.Body>
      </Card>
    }
  </Col>
);

export default ProjectCard;