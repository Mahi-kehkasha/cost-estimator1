import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StepBadge from '../components/StepBadge';

const Stepper = ({ step }) => (
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
);

export default Stepper;