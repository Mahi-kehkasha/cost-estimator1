import React, { useState } from "react";
import { Container, Row, Col, Card, Accordion, Table, Button, Badge, Form, InputGroup } from "react-bootstrap";

// EstimatorViewerBootstrapSampleData.jsx
// React-Bootstrap component that displays a materials-only estimator JSON (sample provided by user).
// Usage: <EstimatorViewerBootstrapSampleData data={estimationJson} />
// If no `data` prop is provided, it uses the sample JSON supplied by the user.

export default function EstimatorViewerBootstrapSampleData({ data: initialData }) {
  const sampleData = initialData || {
    materials: [
      { item: "Bricks", unit: "number", quantity: 7000, rate_in_inr: 6.6, total_cost_in_inr: 46200, notes: "used for walls (external + internal)" },
      { item: "Cement", unit: "bags", quantity: 70, rate_in_inr: 350, total_cost_in_inr: 24500, notes: "used for RCC, plaster, mortar, etc." },
      { item: "Sand", unit: "cubic_feet", quantity: 250, rate_in_inr: 35, total_cost_in_inr: 8750, notes: "used for plastering and concrete work" },
      { item: "Steel (TMT)", unit: "kg", quantity: 550, rate_in_inr: 70, total_cost_in_inr: 38500, notes: "used for structural support" },
      { item: "Aggregate", unit: "cubic_feet", quantity: 450, rate_in_inr: 45, total_cost_in_inr: 20250, notes: "used for concrete works" },
      { item: "Flooring Tiles", unit: "sqft", quantity: 1000, rate_in_inr: 50, total_cost_in_inr: 50000, notes: "used for flooring throughout the house" },
      { item: "Paint", unit: "litres", quantity: 100, rate_in_inr: 120, total_cost_in_inr: 12000, notes: "used for interior and exterior painting" },
      { item: "Doors & Windows", unit: "set", quantity: 6, rate_in_inr: 15000, total_cost_in_inr: 90000, notes: "includes main door, internal doors, and windows" },
      { item: "Electrical Material", unit: "lumpsum", quantity: 1, rate_in_inr: 25000, total_cost_in_inr: 25000, notes: "includes wiring, fixtures, and switches" },
      { item: "Plumbing Material", unit: "lumpsum", quantity: 1, rate_in_inr: 20000, total_cost_in_inr: 20000, notes: "includes pipes, fittings, and fixtures" }
    ],
    total_estimated_cost_in_inr: 287650,
    notes: "Estimation is approximate and based on Indian average standards for Bengaluru."
  };

  const [estimation, setEstimation] = useState(sampleData);
  const [query, setQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatINR = (v) => (typeof v === 'number' ? `₹${v.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : v);

  const filtered = estimation.materials.filter((m) => m.item.toLowerCase().includes(query.toLowerCase()));

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(estimation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'estimation-sample.json'; a.click(); URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const rows = [['Item','Unit','Quantity','Rate','Total','Notes'], ...estimation.materials.map(m => [m.item, m.unit, m.quantity, m.rate_in_inr, m.total_cost_in_inr, m.notes])];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'estimation-sample.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h3 className="mb-0">Material Estimation</h3>
          <div className="text-muted">Material-only breakdown • Beautiful card + accordion view</div>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" className="me-2" onClick={() => { navigator.clipboard.writeText(JSON.stringify(estimation, null, 2)); alert('JSON copied to clipboard'); }}>Copy JSON</Button>
          <Button variant="success" className="me-2" onClick={downloadJSON}>Download JSON</Button>
          <Button variant="outline-success" onClick={downloadCSV}>Download CSV</Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total Estimated Cost</Card.Title>
              <h2 className="fw-bold">{formatINR(estimation.total_estimated_cost_in_inr)}</h2>
              <div className="text-muted small mt-2">{estimation.notes}</div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Quick Filters</Card.Title>
              <InputGroup className="mb-2">
                <Form.Control placeholder="Search item (e.g., brick)" value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button variant="outline-secondary" onClick={() => setQuery('')}>Clear</Button>
              </InputGroup>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="secondary">{estimation.materials.length} items</Badge>
                <Badge bg="info">Materials only</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Accordion defaultActiveKey="0">
            {filtered.map((m, idx) => (
              <Accordion.Item eventKey={idx.toString()} key={idx} onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}>
                <Accordion.Header>
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{m.item}</div>
                      <div className="text-muted small">{m.notes}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{formatINR(m.total_cost_in_inr)}</div>
                      <div className="text-muted small">{m.quantity?.toLocaleString ? m.quantity.toLocaleString() : m.quantity} {m.unit}</div>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={8}>
                      <Table borderless size="sm">
                        <tbody>
                          <tr>
                            <td className="text-muted">Item</td>
                            <td>{m.item}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Unit</td>
                            <td>{m.unit}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Quantity</td>
                            <td>{m.quantity?.toLocaleString ? m.quantity.toLocaleString() : m.quantity}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Rate</td>
                            <td>{formatINR(m.rate_in_inr)}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Total Cost</td>
                            <td className="fw-bold">{formatINR(m.total_cost_in_inr)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-between">
                      <div>
                        <Button variant="outline-primary" className="w-100 mb-2" onClick={() => { navigator.clipboard.writeText(JSON.stringify(m, null, 2)); alert('Item JSON copied'); }}>Copy Item JSON</Button>
                        <Button variant="outline-secondary" className="w-100" onClick={() => {
                          // download single item CSV
                          const csv = `"Item","Unit","Quantity","Rate","Total","Notes"\n"${m.item}","${m.unit}","${m.quantity}","${m.rate_in_inr}","${m.total_cost_in_inr}","${m.notes}"`;
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a'); a.href = url; a.download = `${m.item.replace(/\s+/g,'-')}.csv`; a.click(); URL.revokeObjectURL(url);
                        }}>Download Item CSV</Button>
                      </div>

                      <div className="text-muted small mt-3">Unit: {m.unit}</div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <Row>
        <Col className="text-center text-muted small">Tip: pass your own JSON as the <code>data</code> prop to the component to visualize your estimator output.</Col>
      </Row>
    </Container>
  );
}
