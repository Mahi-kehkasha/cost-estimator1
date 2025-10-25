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
            <Col xs="auto">
              {/* Login/Profile Section */}
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic" className="d-flex align-items-center">
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ height: '40px', width: '40px', marginRight: '10px' }}
                    />
                    <span className="text-white">{user.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button variant="outline-light" onClick={handleLogin}>
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