import React, { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const ClientSpecificationsInput = ({ onBack }) => {
  const [specifications, setSpecifications] = useState({});
  const [quantities, setQuantities] = useState({});
  const [selectedQuality, setSelectedQuality] = useState('');

  const materials = [
    { id: 'cement', label: 'Cement', unit: 'bags' },
    { id: 'steel', label: 'Steel', unit: 'kg' },
    { id: 'aggregatesGravel', label: 'Aggregates (Gravel)', unit: 'cft' },
    { id: 'aggregatesSand', label: 'Aggregates (Sand)', unit: 'cft' },
    { id: 'bricks', label: 'Bricks', unit: 'pcs' },
    { id: 'concreteBlocks', label: 'Concrete Blocks', unit: 'pcs' },
    { id: 'ceramicWallDado', label: 'Ceramic Wall Dado', unit: 'sqft' },
    { id: 'windows', label: 'Windows', unit: 'sqft' },
    { id: 'interiorPainting', label: 'Interior Painting', unit: 'sqft' },
    { id: 'livingDiningFlooring', label: 'Living & Dining Flooring', unit: 'sqft' },
    { id: 'roomsKitchenFlooring', label: 'Rooms & Kitchen Flooring', unit: 'sqft' },
    { id: 'balconyFlooring', label: 'Balcony Flooring', unit: 'sqft' },
    { id: 'parkingTiles', label: 'Parking Tiles', unit: 'sqft' },
    { id: 'staircaseFlooring', label: 'Staircase Flooring', unit: 'sqft' },
    { id: 'sanitarywareCPFittings', label: 'Sanitaryware & CP Fittings', unit: 'nos' },
    { id: 'kitchenSink', label: 'Kitchen Sink', unit: 'nos' },
    { id: 'mainDoor', label: 'Main Door', unit: 'nos' },
    { id: 'internalDoors', label: 'Internal Doors', unit: 'nos' },
    { id: 'bathroomDoors', label: 'Bathroom Doors', unit: 'nos' },
    { id: 'poojaRoomDoor', label: 'Pooja Room Door', unit: 'nos' },
    { id: 'windowGrills', label: 'Window Grills', unit: 'sqft' },
    { id: 'overheadTank', label: 'Overhead Tank', unit: 'nos' },
    { id: 'undergroundSump', label: 'Underground Sump', unit: 'nos' },
    { id: 'staircaseRailing', label: 'Staircase Railing', unit: 'sqft' },
    { id: 'exteriorPainting', label: 'Exterior Painting', unit: 'sqft' },
    { id: 'mirrorAccessories', label: 'Mirror & Accessories', unit: 'nos' }
  ];

  const handleSpecificationChange = (materialId, value) => {
    setSpecifications(prev => ({
      ...prev,
      [materialId]: value
    }));
  };

  const handleQuantityChange = (materialId, value) => {
    setQuantities(prev => ({
      ...prev,
      [materialId]: value
    }));
  };

  const handleCalculate = () => {
    // Open calculation in new tab
    const calculationUrl = `/calculate?quality=${selectedQuality}&specs=${encodeURIComponent(JSON.stringify(specifications))}&quantities=${encodeURIComponent(JSON.stringify(quantities))}`;
    window.open(calculationUrl, '_blank');
  };

  const filteredMaterials = selectedQuality 
    ? materials.filter(material => specifications[material.id] === selectedQuality)
    : materials;

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Project Specifications</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Filter by Quality</Form.Label>
                <Form.Select 
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                >
                  <option value="">Show All</option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="luxury">Luxury</option>
                  <option value="royal">Royal</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3">
            {filteredMaterials.map(material => (
              <Col md={3} key={material.id}>
                <Card className="h-100">
                  <Card.Body>
                    <Form.Label>{material.label}</Form.Label>
                    <Form.Select 
                      className="mb-2"
                      onChange={(e) => handleSpecificationChange(material.id, e.target.value)}
                    >
                      <option value="">Select option</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="luxury">Luxury</option>
                      <option value="royal">Royal</option>
                    </Form.Select>
                    <Form.Control
                      type="number"
                      placeholder={`Qty (${material.unit})`}
                      onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleCalculate}>
              Calculate Cost
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ClientSpecificationsInput;