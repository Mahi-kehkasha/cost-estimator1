import React, { useMemo, useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap'
import StepBadge  from './components/StepBadge';
import Header from './components/Header';
import {calculateEstimation} from './utils/utils.jsx';
import RequirementModal from "./components/Modals/RequirementModal.jsx";
import { presetSqftMap , projectTypeData, detailedPrices} from './data/constants.jsx';

export default function App() {
  const [step, setStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [estimate, setEstimate] = useState(null)
  const projectTypes = useMemo(() => (projectTypeData), [])
  
  const [selectedProjDetails,setSelectedProjDetails]= useState(null);

  function handleEstimate(){
    if (selectedProjDetails ) {
       console.log(selectedProjDetails)
        const result = calculateEstimation(selectedProjDetails);
        console.log(result)
        setEstimate(result);
    } else {
      setEstimate(null);
    }
    setStep(3)
  }
  const [specSelections, setSpecSelections] = useState({});
  const [specQuantities, setSpecQuantities] = useState({});
  const [packageTier, setPackageTier] = useState('Custom');
  const [quantityPreset, setQuantityPreset] = useState('Custom');
  const specTable = useMemo(() => (detailedPrices), []);
  const specFeatures = useMemo(() => Object.keys(specTable), [specTable]);

  const setSpec = (feature, tier, value) => {
    setSpecSelections(prev => ({ ...prev, [feature]: `${tier} - ${value}` }))
  }

  const applyTierToAll = (tier) => {
    const next = {}
    Object.entries(specTable).forEach(([feature, tiers]) => {
      const value = tiers[tier]
      if (value) next[feature] = `${tier} - ${value}`
    })
    setSpecSelections(next)
  }

  const setQuantity = (feature, quantity) => {
    setSpecQuantities(prev => ({ ...prev, [feature]: quantity }))
  }

  const openProjectModal = (key) => {
    setSelectedProject(String(key).toLowerCase())
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false);

  function callParent(selectedProj){
    setSelectedProjDetails (selectedProj);
    setShowModal(false)
    setStep(2)
  }


  const toggleRoom = (room) => {
    setRenoForm(prev => {
      const exists = prev.rooms.includes(room)
      const rooms = exists ? prev.rooms.filter(r => r !== room) : [...prev.rooms, room]
      return { ...prev, rooms }
    })
  }

  const parseMoney = (text) => {
    if (!text) return { amount: 0, perSqft: false, perBag: false, perKg: false, perCft: false, perPiece: false }
    const perSqft = /sq\.?\s*ft/i.test(text)
    const perBag = /bag/i.test(text)
    const perKg = /kg/i.test(text)
    const perCft = /cft/i.test(text)
    const perPiece = /piece/i.test(text)
    const numMatch = String(text).replace(/[,₹\s]/g, '').match(/\d+(?:\.\d+)?/)
    const amount = numMatch ? Number(numMatch[0]) : 0
    return { amount, perSqft, perBag, perKg, perCft, perPiece }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 py-4 py-md-5">
      <Container>
        <Header/>
        {/* Stepper */}
        <Row className="g-3 justify-content-center mb-4 mb-md-5">
          <Col xs={6} md={3} >
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
          <>
            <Row className="g-3 g-md-4">
              {projectTypes.map(p => (
                <Col md={4} lg={4} key={p.key}>
                  <Card disabled="true" className="h-100 shadow-sm rounded p-3 border card-hover cursor-pointer" onClick={() => openProjectModal(p.key)}>
                    <Card.Body className="d-flex flex-column align-items-center text-center">
                      <i className={`bi ${p.icon} display-6 mb-2 text-primary`}></i>
                      <Card.Title className="h4">{p.title}</Card.Title>
                      <Card.Subtitle className="text-muted mb-3 small">{p.desc}</Card.Subtitle>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {p.tags.map((t, idx) => (
                          <span key={idx} className="badge bg-secondary-subtle text-secondary-emphasis border">{t}</span>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}


        {/* Specifications Step */}
        {step === 2 && (
          <>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-list-check text-primary"></i>
              <h3 className="fw-semibold mb-0">Project Specifications</h3>
            </div>
            <div className="text-muted mb-3">For project: <span className="fw-semibold text-dark text-capitalize">{selectedProject || 'project'}</span></div>


            <Row className="g-3 mb-3">
              <Col xs={12} sm={6} md={4} lg={3}>
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                  <Form.Label className="mb-0 text-nowrap">Package</Form.Label>
                  <Form.Select 
                    value={packageTier} 
                    onChange={(e) => { const t = e.target.value; setPackageTier(t); if (t !== 'Custom') applyTierToAll(t) }}
                    size="sm"
                  >
                    {['Basic','Standard','Luxury','Royal','Custom'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
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
                  >
                    {['1200','2BHK','3BHK','4BHK','Custom'].map(p => (
                      <option key={p} value={p}>{p === '1200' ? '1200 sqft' : p}</option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
            </Row>

            <Row className="g-3 g-md-4">
              {specFeatures.map((feature) => (
                <Col xs={12} sm={6} md={6} lg={4} xl={3} key={feature}>
                  <Card className="h-100 shadow-sm rounded p-3">
                    <Card.Body className="d-flex flex-column">
                      <div className="fw-semibold mb-2 text-truncate" title={feature}>{feature}</div>
                      <Form.Select
                        value={specSelections[feature] || ''}
                        disabled={packageTier !== 'Custom'}
                        onChange={(e) => {
                          const [tier] = e.target.value.split(' - ')
                          const value = specTable[feature][tier]
                          setSpec(feature, tier, value)
                        }}
                        className="mb-2"
                        size="sm"
                      >
                        <option value="">Select option</option>
                        {Object.entries(specTable[feature]).map(([tier, val]) => (
                          <option key={tier} value={`${tier} - ${val}`}>{`${tier} - ${val}`}</option>
                        ))}
                      </Form.Select>
                      <Form.Control
                        type="number"
                        placeholder="Qty"
                        value={specQuantities[feature] || ''}
                        onChange={(e) => setQuantity(feature, e.target.value)}
                        min="0"
                        step="0.01"
                        size="sm"
                        disabled={quantityPreset !== 'Custom'}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="d-flex justify-content-between mt-4 mb-3 border-top pt-3">
              <Button variant="secondary" className="rounded" onClick={() => setStep(1)}>Back</Button>
              <Button variant="primary" size="lg" className="rounded" onClick={() => handleEstimate()}>
                Next: Estimator Summary
              </Button>
            </div>
          </>
        )}

        {/* Auto-Calculation Display (kept visible in Steps 2 and 4) */}
        {!showModal && selectedProject && estimate && (step === 1 || step === 3) && (
          <Card className="shadow-sm border-success mb-4">
            <Card.Header className="bg-success text-white">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calculator-fill"></i>
                <h5 className="mb-0">📊 {step === 4 ? 'Estimator Summary' : 'Auto-Calculated Estimate'}</h5>
                <Badge bg="light" text="dark" className="ms-auto">
                  {selectedProject === 'road' ? 'Road Construction' :
                   selectedProject === 'renovation' ? 'Office Renovation' :
                   selectedProject.charAt(0).toUpperCase() + selectedProject.slice(1)} Project
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
        )}

        {showModal &&
          <RequirementModal showModal={showModal} hideModal={closeModal} callParent={callParent} selectedProject={selectedProject}/>
        }
      </Container>
    </div>
  )
}