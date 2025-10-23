import React from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';

// Constants for package tiers and quantity presets
const PACKAGE_TIERS = ['Basic', 'Standard', 'Luxury', 'Royal', 'Custom'];
const QUANTITY_PRESETS = ['1200', '2BHK', '3BHK', '4BHK', 'Custom'];

const ProjectSpecifications = ({
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
  setQuantityPreset,
  onBack,
  onNext,
}) => {
  // Helper function to generate dropdown options
  const generateOptions = (options, formatFn = (opt) => opt) =>
    options.map((option) => (
      <option key={option} value={option}>
        {formatFn(option)}
      </option>
    ));

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <i className="bi bi-list-check text-primary"></i>
        <h3 className="fw-semibold mb-0">Project Specifications</h3>
      </div>

      {/* Package and Quantity Preset Selectors */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} md={4} lg={3}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
            <Form.Label className="mb-0 text-nowrap">Package</Form.Label>
            <Form.Select
              value={packageTier}
              onChange={(e) => {
                const tier = e.target.value;
                setPackageTier(tier);
                if (tier !== 'Custom') applyTierToAll(tier);
              }}
              size="sm"
              aria-label="Select Package Tier"
            >
              {generateOptions(PACKAGE_TIERS)}
            </Form.Select>
          </div>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
            <Form.Label className="mb-0 text-nowrap">Quantity Preset</Form.Label>
            <Form.Select
              value={quantityPreset}
              onChange={(e) => setQuantityPreset(e.target.value)}
              size="sm"
              aria-label="Select Quantity Preset"
            >
              {generateOptions(QUANTITY_PRESETS, (preset) =>
                preset === '1200' ? '1200 sqft' : preset
              )}
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Specification Cards */}
      <Row className="g-3 g-md-4">
        {specFeatures.map((feature) => (
          <Col xs={12} sm={6} md={6} lg={4} xl={3} key={feature}>
            <Card className="h-100 shadow-sm rounded p-3">
              <Card.Body className="d-flex flex-column">
                {/* Feature Title */}
                <div className="fw-semibold mb-2 text-truncate" title={feature}>
                  {feature}
                </div>

                {/* Specification Selector */}
                <Form.Select
                  value={specSelections[feature] || ''}
                  disabled={packageTier !== 'Custom'}
                  onChange={(e) => {
                    const [tier] = e.target.value.split(' - ');
                    const value = specTable[feature][tier];
                    setSpec(feature, tier, value);
                  }}
                  className="mb-2"
                  size="sm"
                  aria-label={`Select specification for ${feature}`}
                >
                  <option value="">Select option</option>
                  {Object.entries(specTable[feature]).map(([tier, val]) => (
                    <option key={tier} value={`${tier} - ${val}`}>
                      {`${tier} - ${val}`}
                    </option>
                  ))}
                </Form.Select>

                {/* Quantity Input */}
                <Form.Control
                  type="number"
                  placeholder="Qty"
                  value={specQuantities[feature] || ''}
                  onChange={(e) => setQuantity(feature, e.target.value)}
                  min="0"
                  step="0.01"
                  size="sm"
                  disabled={quantityPreset !== 'Custom'}
                  aria-label={`Enter quantity for ${feature}`}
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4 mb-3 border-top pt-3">
        <Button variant="secondary" className="rounded" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" size="lg" className="rounded" onClick={onNext}>
          Next: Estimator Summary
        </Button>
      </div>
    </>
  );
};

export default ProjectSpecifications;