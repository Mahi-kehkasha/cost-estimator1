import React, { useState, useEffect } from 'react';
import { Accordion, Card, Table, Form, Button, Row, Col } from 'react-bootstrap';

const EstimatorSummary = ({ recievedDraftEstimation }) => {
  const [editableData, setEditableData] = useState(recievedDraftEstimation);

  useEffect(() => {
    const updatedData = { ...editableData };
    const totalSubCost = updatedData.materials_and_labour_breakdown.reduce(
      (sum, material) => sum + material.total_cost_in_inr,
      0
    );
    updatedData.financial_summary.total_sub_cost_in_inr = totalSubCost;
    updatedData.financial_summary.contingency_cost_in_inr = (totalSubCost * updatedData.project_info.contingency_percent) / 100;
    updatedData.financial_summary.grand_total_cost_in_inr =
      totalSubCost + updatedData.financial_summary.contingency_cost_in_inr;
    updatedData.financial_summary.cost_per_sqft_in_inr =
      updatedData.financial_summary.grand_total_cost_in_inr / updatedData.project_info.builtup_area_sqft;

    setEditableData(updatedData);
  }, [editableData.materials_and_labour_breakdown]);

  // Handle input changes for editable fields
  const handleInputChange = (index, field, value) => {
    const updatedData = { ...editableData };
    const material = updatedData.materials_and_labour_breakdown[index];

    // Update the field
    material[field] = field === 'quantity' || field === 'rate_in_inr' ? parseFloat(value) : value;

    // Recalculate derived fields
    if (field === 'quantity' || field === 'rate_in_inr') {
      material.total_cost_in_inr = material.quantity * material.rate_in_inr;
    }

    setEditableData(updatedData);
  };

  // Save changes (rebuild JSON)
  const handleSave = () => {
    console.log('Updated JSON:', editableData);
    alert('Changes saved successfully!');
  };

  return (
    <Card className="shadow-sm border-success mb-4">
      <Card.Body>
        <Card.Title className="text-primary fw-bold">Estimator Summary</Card.Title>

        <Accordion defaultActiveKey="0" className="mt-4">
          {/* Project Information */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Project Information</Accordion.Header>
            <Accordion.Body>
              <div className="table-responsive">
                <Table bordered hover className="mb-0">
                  <tbody>
                    {Object.entries(editableData.project_info).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-semibold">{key.replace(/_/g, ' ').toUpperCase()}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Materials and Labour Breakdown */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Materials and Labour Breakdown</Accordion.Header>
            <Accordion.Body>
              <div className="table-responsive">
                <Table bordered hover className="mb-0">
                  <thead>
                    <tr className="table-primary">
                      <th>Item</th>
                      <th>Unit</th>
                      <th>Quantity</th>
                      <th>Rate (INR)</th>
                      <th>Total Cost (INR)</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableData.materials_and_labour_breakdown.map((material, index) => (
                      <tr key={index}>
                        <td>{material.item}</td>
                        <td>{material.unit}</td>
                        <td>
                          <Form.Control
                            type="number"
                            size="sm"
                            value={material.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            size="sm"
                            value={material.rate_in_inr}
                            onChange={(e) => handleInputChange(index, 'rate_in_inr', e.target.value)}
                          />
                        </td>
                        <td>₹ {material.total_cost_in_inr.toLocaleString()}</td>
                        <td>
                          <Form.Control
                            type="text"
                            size="sm"
                            value={material.notes}
                            onChange={(e) => handleInputChange(index, 'notes', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Thumb Rules */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>Thumb Rules Applied</Accordion.Header>
            <Accordion.Body>
              <div className="table-responsive">
                <Table bordered hover className="mb-0">
                  <tbody>
                    {Object.entries(editableData.thumb_rules_applied).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-semibold">{key.replace(/_/g, ' ').toUpperCase()}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Financial Summary */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>Financial Summary</Accordion.Header>
            <Accordion.Body>
              <div className="table-responsive">
                <Table bordered hover className="mb-0">
                  <tbody>
                    {Object.entries(editableData.financial_summary).map(([key, value]) => (
                      <tr key={key}>
                        <td className="fw-semibold">{key.replace(/_/g, ' ').toUpperCase()}</td>
                        <td>₹ {value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Save Button */}
        <div className="text-center text-md-end mt-4">
          <Button variant="success" onClick={handleSave} className="w-100 w-md-auto">
            Save Changes
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EstimatorSummary;