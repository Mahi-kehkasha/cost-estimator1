import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import StepBadge from './components/StepBadge';
import ProjectCard from './components/ProjectCard';
import ProjectSpecifications from './components/ProjectSpecifications';
import EstimatorSummary from './components/EstimatorSummary';
import RequirementModal from './components/Modals/RequirementModal';
import { useProjectState } from './hooks/useProjectState';

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
    callParent,
  } = useProjectState();

  return (
    <div className="bg-body-tertiary min-vh-100 py-4 py-md-5">
      <Container>
        <Header />
        {/* Stepper */}
        <Row className="g-3 justify-content-center mb-4 mb-md-5">
          <Col xs={6} md={3}>
            <StepBadge number={1} label="Select Your Project Type" active={step === 1} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={2} label="Specify your project" active={step === 2} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={3} label="Estimator Summary" active={step === 3} />
          </Col>
        </Row>

        {step === 1 && (
          <Row className="g-3 g-md-4">
            {projectTypes.map((p, i) => (
              <ProjectCard key={i} project={p} onClick={() => openProjectModal(p.key)} />
            ))}
          </Row>
        )}

        {step === 2 && (
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
            onBack={() => setStep(1)}
            onNext={handleEstimate}
            setPackageTier={setPackageTier}
          />
        )}

        {step === 3 && (
          <EstimatorSummary estimate={estimate} selectedProject={selectedProject} step={step} />
        )}

        {showModal && (
          <RequirementModal
            showModal={showModal}
            hideModal={closeModal}
            selectedProject={selectedProject}
            callParent={callParent}
          />
        )}
      </Container>
    </div>
  );
}