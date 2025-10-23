import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap'

const EstimatorSummary = ({ estimate, selectedProject, step }) => (
  <Card className="shadow-sm border-success mb-4">

    <Card.Header className="bg-success text-white">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-calculator-fill"></i>
        <h5 className="mb-0">📊 {step === 4 ? 'Estimator Summary' : 'Auto-Calculated Estimate'}</h5>
        <Badge bg="light" text="dark" className="ms-auto">
          {selectedProject.charAt(0).toUpperCase() + selectedProject.slice(1)} Project
        </Badge>
      </div>
    </Card.Header>
    <Card.Body>
      <Row className="mb-4">
        <Col md={8}>
          <div className="h5 mb-3">🏗️ Project Summary</div>
          <Row>
            <Col sm={6} md={3}>
              <div className="fw-bold text-primary">Built-up Area</div>
              <div className="h6">{estimate.totalArea.toLocaleString()} sqft</div>
            </Col>
            <Col sm={6} md={2}>
              <div className="fw-bold text-primary">Floors</div>
              <div className="h6">{estimate.floors}</div>
            </Col>
            <Col sm={6} md={3}>
              <div className="fw-bold text-primary">Quality</div>
              <div className="h6">{estimate.qualityFactor}x Multiplier</div>
            </Col>
            <Col sm={6} md={4}>
              <div className="fw-bold text-primary">Region</div>
              <div className="h6">{estimate.regionFactor}x Multiplier</div>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <div className="h5 mb-3">💰 Cost Breakdown</div>
          <div className="border-start border-3 border-success ps-3">
            <div className="fw-bold">₹{estimate.costPerSqft.toLocaleString()} per sqft</div>
            <div className="h4 text-success mb-0">₹{estimate.totalCost.toLocaleString()}</div>
            <small className="text-muted">Total Construction Cost</small>
          </div>
        </Col>
      </Row>

      {/* Material Breakdown Table */}
      <div className="mt-4">
        <h6 className="mb-3">📊 Material Quantities & Costs</h6>
        <div className="table-responsive">
          <table className="table table-sm table-striped">
            <thead className="table-dark">
              <tr>
                <th>Material</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Unit</th>
                <th className="text-end">Base Rate (₹)</th>
                <th className="text-end">Adjusted Rate (₹)</th>
                <th className="text-end">Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(estimate.materialGroups).map(([groupName, materials]) => {
                if (materials.length === 0) return null;
                return (
                  <React.Fragment key={groupName}>
                    <tr className="table-info">
                      <td colSpan={6} className="fw-bold text-center">
                        🏗️ {groupName} Materials
                      </td>
                    </tr>
                    {materials.map((detail) => (
                      <tr key={detail.material}>
                        <td className="fw-semibold">{detail.material}</td>
                        <td className="text-end">{detail.qty.toLocaleString()}</td>
                        <td className="text-end">{detail.unit}</td>
                        <td className="text-end">₹{detail.baseRate.toLocaleString()}</td>
                        <td className="text-end">₹{detail.adjustedRate.toLocaleString()}</td>
                        <td className="text-end fw-bold">₹{detail.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot className="table-dark">
              <tr>
                <th colSpan={5} className="text-end">Total Project Cost</th>
                <th className="text-end">₹{estimate.totalCost.toLocaleString()}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="alert alert-info mt-3 mb-0">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            <div>
              <strong>Note:</strong> Values are approximate; approx. 5–10% area may be used for setbacks or open space.
              Final costs may vary based on site-specific conditions and material availability.
              <strong> Approx ±10% variation possible depending on design and site conditions.</strong>
            </div>
          </div>
          <div className="d-flex gap-2 ms-3">
            {step === 2 && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setStep(3)}
              >
                Next: Specifications
              </Button>
            )}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => window.print()}
            >
              <i className="bi bi-download me-1"></i>
              {step === 3 ? 'Download Report' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default EstimatorSummary;