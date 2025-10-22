import React from 'react';
import ProjectSpecifications from '../components/ProjectSpecifications';

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
  onBack,
  onNext,
}) => (
  <ProjectSpecifications
    specFeatures={specFeatures}
    specSelections={specSelections}
    specQuantities={specQuantities}
    packageTier={packageTier}
    quantityPreset={quantityPreset}
    specTable={specTable}
    setSpec={setSpec}
    setQuantity={setQuantity}
    applyTierToAll={applyTierToAll}
    setPackageTier={setPackageTier}
    onBack={onBack}
    onNext={onNext}
  />
);

export default ProjectSpecificationStep;