import React, { useState } from "react";
import { Container, Row, Col, Card, Accordion, Table, Button, Badge, Form, InputGroup } from "react-bootstrap";
import TotalPrice from "./TotalPrice/TotalPrice";

export default function EstimatorViewerBootstrapSampleData({ data: initialData }) {
  const [estimation, setEstimation] = useState(initialData);
  const [query, setQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatINR = (v) => (typeof v === 'number' ? `₹${v.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : v);

  const filtered = estimation.materials_and_labour_breakdown.filter((m) =>
    m.item.toLowerCase().includes(query.toLowerCase())
  );

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(estimation, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estimation-sample.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const rows = [
      ["Item", "Unit", "Quantity", "Rate", "Total", "Notes"],
      ...estimation.materials_and_labour_breakdown.map((m) => [
        m.item,
        m.unit,
        m.quantity,
        m.rate_in_inr,
        m.total_cost_in_inr,
        m.notes,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estimation-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h3 className="mb-0">Material and Labour Estimation</h3>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(estimation, null, 2));
              alert("JSON copied to clipboard");
            }}
          >
            Copy JSON
          </Button>
          <Button variant="success" className="me-2" onClick={downloadJSON}>
            Download JSON
          </Button>
          <Button variant="outline-success" onClick={downloadCSV}>
            Download CSV
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          {/* Financial Summary */}
          <TotalPrice financial_summary={estimation.financial_summary} />

          {/* Quick Filters */}
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Quick Filters</Card.Title>
              <InputGroup className="mb-2">
                <Form.Control
                  placeholder="Search item (e.g., brick)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={() => setQuery("")}>
                  Clear
                </Button>
              </InputGroup>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="secondary">{estimation.materials_and_labour_breakdown.length} items</Badge>
                <Badge bg="info">Materials only</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Accordion defaultActiveKey="0">
            {JSON.stringify(filtered) === "[]" && (
              <div className="text-center text-muted">No items match your search.</div>
            )}
            {filtered.map((m, idx) => (
              <Accordion.Item
                eventKey={idx.toString()}
                key={idx}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              >
                <Accordion.Header>
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{m.item}</div>
                      <div className="text-muted small">{m.notes}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{formatINR(m.total_cost_in_inr)}</div>
                      <div className="text-muted small">
                        {m.quantity?.toLocaleString ? m.quantity.toLocaleString() : m.quantity} {m.unit}
                      </div>
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
                            <td>
                              {m.quantity?.toLocaleString ? m.quantity.toLocaleString() : m.quantity}
                            </td>
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
                        <Button
                          variant="outline-primary"
                          className="w-100 mb-2"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(m, null, 2));
                            alert("Item JSON copied");
                          }}
                        >
                          Copy Item JSON
                        </Button>
                        <Button
                          variant="outline-secondary"
                          className="w-100"
                          onClick={() => {
                            // download single item CSV
                            const csv = `"Item","Unit","Quantity","Rate","Total","Notes"\n"${m.item}","${m.unit}","${m.quantity}","${m.rate_in_inr}","${m.total_cost_in_inr}","${m.notes}"`;
                            const blob = new Blob([csv], { type: "text/csv" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${m.item.replace(/\s+/g, "-")}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Download Item CSV
                        </Button>
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
    </Container>
  );
}