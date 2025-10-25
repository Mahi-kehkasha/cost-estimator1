import React from 'react';
import DraftEstimateSpecifications from '../../components/DraftEstimateSpecifications/DraftEstimateSpecifications';

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
  <DraftEstimateSpecifications
    selectedProjDetails={selectedProjDetails}
  />
);

export default ProjectSpecificationStep;