import React from 'react';
import ProjectSpecifications from '../../components/ProjectSpecifications/ProjectSpecifications';

const ProjectSpecificationStep = ({
  specFeatures,
  specSelections,
  specQuantities,
  packageTier,
  quantityPreset,
  specTable,
  setSpec,
  setQuantity,
  applyTierToAll,
  setPackageTier,
  selectedProjDetails,
  onBack,
  onNext,
}) => (
  <ProjectSpecifications
    selectedProjDetails={selectedProjDetails}
  />
);

export default ProjectSpecificationStep;