import React from 'react';
import { Container, Navbar, Card } from 'react-bootstrap';
import Header from './components/Header/Header';
import Stepper from './containers/Stepper/Stepper';
import ProjectTypeSelection from './containers/ProjectTypeSelection/ProjectTypeSelection';
import ProjectSpecificationStep from './containers/ProjectSpecificationStep/ProjectSpecificationStep';
import EstimationSummaryStep from './containers/EstimationSummaryStep/EstimationSummaryStep';
import RequirementModal from './components/Modals/RequirementModal';
import { useProjectState } from './hooks/useProjectState';
import './App.css'; // Optional: Add custom styles
import logo from './assets/beeProgress.png'; // Import the logo

export default function App() {
  const {
    step,
    setStep,
    selectedProject,
    showModal,
    setPackageTier,
    estimate,
    projectTypes,
    specFeatures,
    specSelections,
    specQuantities,
    packageTier,
    quantityPreset,
    specTable,
    handleEstimate,
    setSpec,
    applyTierToAll,
    setQuantity,
    openProjectModal,
    closeModal,
    handleSetProjectDetails,
    selectedProjDetails,
  } = useProjectState();

  return (
    <div className="bg-body-tertiary min-vh-100 py-4 py-md-5">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="Bee Progress Logo"
            className="app-logo"
            style={{ height: '40px', marginRight: '10px' }} />
          <span className="fw-bold text-primary">Bee Progress</span>
        </Navbar.Brand>

        <Stepper step={step} />
        <Card className="shadow-sm">
          <Card.Body>
            {step === 1 && (
              <ProjectTypeSelection projectTypes={projectTypes} openProjectModal={openProjectModal} />
            )}

            {step === 2 && (
              <>
                <ProjectSpecificationStep
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
                  selectedProjDetails={selectedProjDetails}
                  onBack={() => setStep(1)}
                  onNext={handleEstimate}
                />
              </>
            )}

            {step === 3 && (
              <EstimationSummaryStep
                estimate={estimate}
                selectedProject={selectedProject}
                step={step}
              />
            )}

            {showModal && (
              <RequirementModal
                showModal={showModal}
                hideModal={closeModal}
                selectedProject={selectedProject}
                handleSetProjectDetails={handleSetProjectDetails}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}