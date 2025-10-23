import React from 'react';
import { Card, Col } from 'react-bootstrap';
import styles from './styles/ProjectCard.module.css';

const ProjectCard = ({ project, onClick }) => (
  <Col md={4} lg={4}>
    <Card
      className={`h-100 shadow-sm rounded p-3 border ${styles.cardHover} ${
        project.show ? styles.cursorPointer : styles.disabledCard
      }`}
      onClick={project.show ? onClick : undefined} // Disable click if project.show is false
    >
      <Card.Body className="d-flex flex-column align-items-center text-center">
        <i className={`bi ${project.icon} display-6 mb-2 text-primary`}></i>
        {!project.show && (
          <i className={`bi ${project.iconLock} display-6 mb-2 text-primary`}></i>
        )}
        <Card.Title className="h4">{project.title}</Card.Title>
        <Card.Subtitle className="text-muted mb-3 small">{project.desc}</Card.Subtitle>
        {project.show ? (
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="badge bg-secondary-subtle text-secondary-emphasis border"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <h6 className="text-muted">LOCKED</h6>
        )}
      </Card.Body>
    </Card>
  </Col>
);

export default ProjectCard;