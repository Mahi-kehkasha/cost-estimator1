import { useState, useMemo } from 'react';
import { calculateEstimation } from '../utils/utils';
import { detailedPrices } from '../data/constants/detailedPrices';
import { projectTypeData } from '../data/constants/projectTypes';

export const useProjectState = () => {
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [selectedProjDetails, setSelectedProjDetails] = useState(null);
  const [specSelections, setSpecSelections] = useState({});
  const [specQuantities, setSpecQuantities] = useState({});
  const [packageTier, setPackageTier] = useState('Custom');
  const [quantityPreset, setQuantityPreset] = useState('Custom');

  const projectTypes = useMemo(() => projectTypeData, []);
  const specTable = useMemo(() => detailedPrices, []);
  const specFeatures = useMemo(() => Object.keys(specTable), [specTable]);

  const handleEstimate = () => {
    if (selectedProjDetails) {
      const result = calculateEstimation(selectedProjDetails);
      setEstimate(result);
    } else {
      setEstimate(null);
    }
    setStep(3);
  };

  const setSpec = (feature, tier, value) => {
    setSpecSelections((prev) => ({ ...prev, [feature]: `${tier} - ${value}` }));
  };

  const applyTierToAll = (tier) => {
    const next = {};
    Object.entries(specTable).forEach(([feature, tiers]) => {
      const value = tiers[tier];
      if (value) next[feature] = `${tier} - ${value}`;
    });
    setSpecSelections(next);
  };

  const setQuantity = (feature, quantity) => {
    setSpecQuantities((prev) => ({ ...prev, [feature]: quantity }));
  };

  const openProjectModal = (key) => {
    setSelectedProject(String(key).toLowerCase());
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const callParent = (selectedProj) => {
    setSelectedProjDetails(selectedProj);
    setShowModal(false);
    setStep(2);
  };

  return {
    step,
    setStep,
    selectedProject,
    setSelectedProject,
    showModal,
    setShowModal,
    estimate,
    setEstimate,
    selectedProjDetails,
    setSelectedProjDetails,
    specSelections,
    setSpecSelections,
    specQuantities,
    setSpecQuantities,
    packageTier,
    setPackageTier,
    quantityPreset,
    setQuantityPreset,
    projectTypes,
    specTable,
    specFeatures,
    handleEstimate,
    setSpec,
    applyTierToAll,
    setQuantity,
    openProjectModal,
    closeModal,
    callParent,
  };
};