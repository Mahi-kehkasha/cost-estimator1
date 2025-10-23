import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectCard from './ProjectCard';


const mockProject = {
  show: true,
  title: 'Test Project',
  desc: 'This is a test project',
  icon: 'bi-house',
  iconLock: 'bi-lock',
  tags: ['Tag1', 'Tag2'],
};

test('renders ProjectCard with enabled state', () => {
  render(<ProjectCard project={mockProject} onClick={() => {}} />);
  expect(screen.getByText('Test Project')).toBeInTheDocument();
  expect(screen.getByText('This is a test project')).toBeInTheDocument();
  expect(screen.getByText('Tag1')).toBeInTheDocument();
  expect(screen.getByText('Tag2')).toBeInTheDocument();
});

test('renders ProjectCard with disabled state', () => {
  render(<ProjectCard project={{ ...mockProject, show: false }} onClick={() => {}} />);
  expect(screen.getByText('LOCKED')).toBeInTheDocument();
  expect(screen.queryByText('Tag1')).not.toBeInTheDocument();
});