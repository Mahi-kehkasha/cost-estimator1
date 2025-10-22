import React from 'react';
import { Card } from 'react-bootstrap';

const ProjectTypeCard = ({ project, onClick }) => {
  const { key, title, icon, desc, tags, available } = project;

  return (
    <Card 
      className={`h-100 shadow-sm rounded p-3 border position-relative ${
        available ? 'card-hover cursor-pointer' : 'opacity-75'
      }`} 
      onClick={available ? onClick : undefined}
      style={{ 
        cursor: available ? 'pointer' : 'not-allowed',
        filter: available ? 'none' : 'grayscale(0.3)'
      }}
    >
      {!available && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded">
          <div className="text-center text-white">
            <i className="bi bi-clock-history display-4 mb-2"></i>
            <div className="fw-bold">Coming Soon</div>
            <small>This project type will be available soon</small>
          </div>
        </div>
      )}
      <Card.Body className="d-flex flex-column align-items-center text-center">
        <i className={`bi ${icon} display-6 mb-2 ${available ? 'text-primary' : 'text-muted'}`}></i>
        <Card.Title className="h4">{title}</Card.Title>
        <Card.Subtitle className="text-muted mb-3 small">{desc}</Card.Subtitle>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {tags.map((t, idx) => (
            <span key={idx} className={`badge ${available ? 'bg-secondary-subtle text-secondary-emphasis' : 'bg-light text-muted'} border`}>{t}</span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectTypeCard;
