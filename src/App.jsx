import React from 'react';
import { Container, Navbar, Card, Row, Col } from 'react-bootstrap';
import Header from './components/Header/Header';
import Stepper from './containers/Stepper/Stepper';
import ProjectTypeSelection from './containers/ProjectTypeSelection/ProjectTypeSelection';
import DraftEstimate from './containers/DraftEstimate/DraftEstimate';
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
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column">
      {/* Header Section */}
      <header className="bg-primary text-white py-3">
        <Container>
          <Row className="align-items-center">
            <Col xs="auto">
              <img
                src={logo}
                alt="Builder Bro Logo"
                className="app-logo"
                style={{ height: '50px', marginRight: '10px' }}
              />
            </Col>
            <Col>
              <h1 className="mb-0 fw-bold">Builder Bro</h1>
              <p className="mb-0 small">Your trusted construction cost estimator</p>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <Container>
          <Stepper step={step} />
          <Card className="shadow-sm">
            <Card.Body>
              {step === 1 && (
                <ProjectTypeSelection projectTypes={projectTypes} openProjectModal={openProjectModal} />
              )}

              {step === 2 && (
                <DraftEstimate
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
      </main>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <p className="mb-0 small">
                &copy; {new Date().getFullYear()} Builder Bro. All rights reserved.
              </p>
            </Col>
            <Col xs="auto">
              <p className="mb-0 small">Powered by Aril Ventures</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}