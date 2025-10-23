import React from 'react';
import { Row } from 'react-bootstrap';
import ProjectCard from '../components/ProjectCard/ProjectCard';

const ProjectTypeSelection = ({ projectTypes, openProjectModal }) => (
  <Row className="g-3 g-md-4">
    {projectTypes.map((p, i) => (
      <ProjectCard key={i} project={p} onClick={() => openProjectModal(p.key)} />
    ))}
  </Row>
);

export default ProjectTypeSelection;