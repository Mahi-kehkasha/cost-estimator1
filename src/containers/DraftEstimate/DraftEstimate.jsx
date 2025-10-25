import React from 'react';
import DraftEstimateSpecifications from '../../components/DraftEstimateSpecifications/DraftEstimateSpecifications';

const DraftEstimate = ({
  selectedProjDetails,
  goToReviewDraft
}) => (
  <DraftEstimateSpecifications
    selectedProjDetails={selectedProjDetails}
    goToReviewDraft={goToReviewDraft}
  />
);

export default DraftEstimate;