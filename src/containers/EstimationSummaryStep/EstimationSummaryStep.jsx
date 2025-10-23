import React from 'react';
import EstimatorSummary from '../../components/EstimationSummary/EstimatorSummary';

const EstimationSummaryStep = ({ estimate, selectedProject, step }) => (
  <EstimatorSummary estimate={estimate} selectedProject={selectedProject} step={step} />
);

export default EstimationSummaryStep;