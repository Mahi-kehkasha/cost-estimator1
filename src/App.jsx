import React, { useState } from 'react';
import { Container, Navbar, Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import Stepper from './containers/Stepper/Stepper';
import ProjectTypeSelection from './containers/ProjectTypeSelection/ProjectTypeSelection';
import DraftEstimate from './containers/DraftEstimate/DraftEstimate';
import ApproveRejectDraft from './containers/ApproveRejectDraft/ApproveRejectDraft';
import RequirementModal from './components/Modals/RequirementModal';
import { useProjectState } from './hooks/useProjectState';
import './App.css'; // Optional: Add custom styles
import logo from './assets/beeProgress.png'; // Import the logo

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [user, setUser] = useState(null); // Store user data (e.g., profile photo)

  const {
    step,
    setStep,
    selectedProject,
    showModal,
    setPackageTier,
    projectTypes,
    setSpec,
    applyTierToAll,
    setQuantity,
    openProjectModal,
    closeModal,
    handleSetProjectDetails,
    selectedProjDetails,
    goToReviewDraft,
    recievedDraftEstimation
  } = useProjectState();

  // Simulate login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({
      name: 'Yunus',
      profilePhoto: logo, // Placeholder profile photo
    });
  };

  // Simulate logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column">
      {/* Header Section */}
      <header className="bg-primary text-white py-2 py-md-3">
        <Container>
          <Row className="align-items-center g-2">
            <Col xs="auto" className="flex-shrink-0">
              <img
                src={logo}
                alt="Builder Bro Logo"
                className="app-logo"
                style={{ height: '40px', width: 'auto' }}
              />
            </Col>
            <Col className="flex-grow-1 min-w-0">
              <h1 className="mb-0 fw-bold fs-5 fs-md-4">Builder Bro</h1>
              <p className="mb-0 small d-none d-sm-block">Your trusted construction cost estimator</p>
            </Col>
            <Col xs="auto" className="flex-shrink-0">
              {/* Login/Profile Section */}
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic" className="d-flex align-items-center">
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="rounded-circle d-none d-sm-inline-block"
                      style={{ height: '35px', width: '35px', marginRight: '8px' }}
                    />
                    <span className="text-white d-none d-md-inline">{user.name}</span>
                    <span className="text-white d-md-none">Menu</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button variant="outline-light" size="sm" className="d-md-none" onClick={handleLogin}>
                  Login
                </Button>
              )}
              {!isLoggedIn && (
                <Button variant="outline-light" className="d-none d-md-inline-block" onClick={handleLogin}>
                  Login
                </Button>
              )}
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
                  selectedProjDetails={selectedProjDetails}
                  goToReviewDraft={goToReviewDraft}
                />
              )}

              {step === 3 && (
                <>
                  <ApproveRejectDraft
                    recievedDraftEstimation={recievedDraftEstimation}
                  />
                </>

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
          <Row className="align-items-center text-center text-md-start">
            <Col xs={12} md>
              <p className="mb-1 mb-md-0 small">
                &copy; {new Date().getFullYear()} Builder Bro. All rights reserved.
              </p>
            </Col>
            <Col xs={12} md="auto">
              <p className="mb-0 small">Powered by Aril Ventures</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}