import React, { useMemo, useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap'

function StepBadge({ number, label, active }) {
  return (
    <div className={`d-flex align-items-center gap-2 p-3 rounded ${active ? 'bg-primary text-white' : 'bg-light'}`}>
      <Badge bg={active ? 'light' : 'secondary'} text={active ? 'dark' : undefined} className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
        {number}
      </Badge>
      <div className="fw-semibold small text-uppercase">{label}</div>
    </div>
  )
}

const FeatureItem = ({ text }) => (
  <li className="d-flex align-items-start gap-2 mb-2">
    <i className="bi bi-check2-circle text-success"></i>
    <span>{text}</span>
  </li>
)

export default function App() {
  const [step, setStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const projectTypes = useMemo(() => ([
    { key: 'villa', title: 'Villa', icon: 'bi-house', desc: 'Single-family residential building', tags: ['Foundation', 'Structure', 'Finishing'] },
    { key: 'apartment', title: 'Apartment', icon: 'bi-building', desc: 'Multi-unit residential building', tags: ['Multi-story', 'Common Areas', 'Parking'] },
    { key: 'office', title: 'Office', icon: 'bi-briefcase', desc: 'Commercial office building', tags: ['Open Plan', 'AC Systems', 'Elevators'] },
    { key: 'mall', title: 'Mall', icon: 'bi-cart', desc: 'Shopping complex construction', tags: ['Large Spaces', 'Parking', 'Food Court'] },
    { key: 'road', title: 'Road', icon: 'bi-sign-turn-right', desc: 'Road and infrastructure', tags: ['Asphalt', 'Drainage', 'Signage'] },
    { key: 'renovation', title: 'Renovation', icon: 'bi-hammer', desc: 'Existing structure renovation', tags: ['Partial Work', 'Upgrades', 'Modernization'] }
  ]), [])

  // Forms state per project type
  const [villaForm, setVillaForm] = useState({
    type: '',
    area: '',
    unit: 'sq.ft',
    floors: '',
    bedrooms: '',
    bathrooms: '',
    quality: '',
    region: ''
  })
  const [apartmentForm, setApartmentForm] = useState({
    totalArea: '',
    units: '',
    floors: '',
    common: { parking: false, garden: false, gym: false, play: false },
    quality: '',
    region: ''
  })
  const [officeForm, setOfficeForm] = useState({
    area: '',
    floors: '',
    layout: '',
    ac: '',
    elevators: '',
    region: ''
  })
  const [mallForm, setMallForm] = useState({
    totalArea: '',
    floors: '',
    parkingCapacity: '',
    foodCourt: false,
    largeSpaces: false,
    quality: '',
    region: ''
  })
  const [roadForm, setRoadForm] = useState({
    lengthKm: '',
    widthM: '',
    pavement: '',
    drainage: false,
    signage: false,
    region: ''
  })
  const [renoForm, setRenoForm] = useState({
    type: '',
    area: '',
    floorsAffected: '',
    rooms: [],
    ageYears: '',
    region: ''
  })

  // Specifications selections
  const [specSelections, setSpecSelections] = useState({})
  const [specQuantities, setSpecQuantities] = useState({})
  const [packageTier, setPackageTier] = useState('Custom') // Basic | Standard | Premium | Royal | Custom

  const specTable = useMemo(() => ({
    // Construction Materials
    'Cement': { Basic: '₹350/bag', Standard: '₹380/bag', Premium: '₹420/bag', Royal: '₹450/bag' },
    'Steel': { Basic: '₹65/kg', Standard: '₹70/kg', Premium: '₹75/kg', Royal: '₹80/kg' },
    'Aggregates (Sand)': { Basic: '₹1,200/cft', Standard: '₹1,300/cft', Premium: '₹1,400/cft', Royal: '₹1,500/cft' },
    'Aggregates (Gravel)': { Basic: '₹1,000/cft', Standard: '₹1,100/cft', Premium: '₹1,200/cft', Royal: '₹1,300/cft' },
    'Bricks': { Basic: '₹8/piece', Standard: '₹9/piece', Premium: '₹10/piece', Royal: '₹11/piece' },
    'Concrete Blocks': { Basic: '₹45/piece', Standard: '₹50/piece', Premium: '₹55/piece', Royal: '₹60/piece' },
    
    // Finishing Materials
    'Ceramic Wall Dado': { Basic: '₹60/sqft', Standard: '₹70/sqft', Premium: '₹80/sqft', Royal: '₹90/sqft' },
    'Windows': {
      Basic: 'UPVC (2 track, mesh)',
      Standard: 'UPVC (3 track, mesh – Prominance/NCL Veka)',
      Premium: 'UPVC (3 track, mesh – Prominance/NCL Veka)',
      Royal: 'UPVC (Fenesta or equivalent)'
    },
    'Interior Painting': {
      Basic: 'JK Putty + Tractor Emulsion',
      Standard: 'JK Putty + Apcolite Premium',
      Premium: 'JK Putty + Apcolite Premium',
      Royal: 'JK Putty + Royale Luxury Emulsion'
    },
    'Living & Dining Flooring': { Basic: '₹100/sqft', Standard: '₹120/sqft', Premium: '₹140/sqft', Royal: '₹160/sqft' },
    'Rooms & Kitchen Flooring': { Basic: '₹90/sqft', Standard: '₹100/sqft', Premium: '₹120/sqft', Royal: '₹140/sqft' },
    'Balcony Flooring': { Basic: '₹50/sqft (anti-skid)', Standard: '₹60/sqft', Premium: '₹80/sqft', Royal: '₹90/sqft' },
    'Parking Tiles': { Basic: '₹50/sqft', Standard: '₹60/sqft', Premium: '₹70/sqft', Royal: '₹70/sqft' },
    'Staircase Flooring': { Basic: '₹70/sqft (Sadarahalli Granite)', Standard: '₹90/sqft', Premium: '₹110/sqft', Royal: '₹140/sqft' },
    
    // Electrical & Plumbing
    'Wiring': { Basic: 'Finolex silver FR or equivalent', Standard: 'Finolex silver FR or equivalent', Premium: 'Finolex silver FR or equivalent', Royal: 'Finolex silver FR or equivalent' },
    'Switches & Sockets': { Basic: 'Anchor or equivalent', Standard: 'GM or equivalent', Premium: 'Legrand Mylinc', Royal: 'Legrand Myrius / Schneider Unica Pure' },
    'Main Sink Faucet': { Basic: '₹2,000', Standard: '₹2,500', Premium: '₹3,500', Royal: '₹3,500' },
    'Sanitaryware & CP Fittings': { Basic: '₹50,000/1000sqft (Parryware)', Standard: '₹60,000 (Jaquar)', Premium: '₹70,000 (Jaquar)', Royal: '₹80,000 (Kohler)' },
    'Kitchen Sink': { Basic: '₹4,000 (Futura/Carysil)', Standard: '₹6,000', Premium: '₹8,000', Royal: '₹8,000' },
    
    // Doors & Windows
    'Main Door': { Basic: '₹25,000 (Teak)', Standard: '₹35,000', Premium: '₹40,000', Royal: '₹50,000' },
    'Internal Doors': { Basic: '₹8,000 (Membrane/Flush + Sal Wood)', Standard: '₹10,000', Premium: '₹13,000', Royal: '₹15,000' },
    'Bathroom Doors': { Basic: 'WPC', Standard: 'WPC', Premium: 'WPC', Royal: 'WPC' },
    'Pooja Room Door': { Basic: '₹18,000', Standard: '₹24,000', Premium: '₹28,000', Royal: '₹32,000' },
    'Window Grills': { Basic: '₹195/sqft (MS)', Standard: '₹195/sqft (MS)', Premium: '₹195/sqft (MS)', Royal: '₹195/sqft (MS)' },
    
    // Structural Elements
    'Overhead Tank': { Basic: 'Sintex 1000L', Standard: 'Sintex 1500L', Premium: 'Sintex 2000L', Royal: 'Sintex 2000L' },
    'Underground Sump': { Basic: '5000L', Standard: '6000L', Premium: '7000L', Royal: '8000L' },
    'Staircase Railing': { Basic: 'MS', Standard: 'SS 202', Premium: 'SS 304', Royal: 'SS 304 Glass' },
    
    // Painting & Finishing
    'Exterior Painting': { Basic: 'Asian Primer + Emulsion', Standard: 'Apex / Equivalent', Premium: 'Apex', Royal: 'Apex Ultima' },
    'Mirror & Accessories': { Basic: '₹5,000 till 1000 sqft', Standard: '₹6,000', Premium: '₹7,000', Royal: '₹9,000' },
    
    // Specifications
    'Ceiling Height': { Basic: '10 feet', Standard: '10 feet', Premium: '10 feet', Royal: '10 feet' },
    'Extras': { Basic: '–', Standard: '–', Premium: 'Solar heater provision', Royal: 'EV Charging, Gas line' }
  }), [])

  const specFeatures = useMemo(() => Object.keys(specTable), [specTable])

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

  const requiredKeysForProject = useMemo(() => ({
    villa: ['type', 'area', 'floors', 'quality', 'region'],
    apartment: ['totalArea', 'units', 'floors', 'quality', 'region'],
    office: ['area', 'floors', 'layout', 'ac', 'elevators', 'region'],
    mall: ['totalArea', 'floors', 'quality', 'region'],
    road: ['lengthKm', 'widthM', 'pavement', 'region'],
    renovation: ['type', 'area', 'floorsAffected', 'rooms', 'ageYears', 'region']
  }), [])

  const requiredInvalid = useMemo(() => {
    if (!selectedProject) return []
    const keys = requiredKeysForProject[selectedProject] || []
    const map = {
      villa: villaForm,
      apartment: apartmentForm,
      office: officeForm,
      mall: mallForm,
      road: roadForm,
      renovation: renoForm
    }
    const form = map[selectedProject] || {}
    return keys.filter(k => {
      const v = form[k]
      if (Array.isArray(v)) return v.length === 0
      return String(v ?? '').trim() === ''
    })
  }, [selectedProject, villaForm, apartmentForm, officeForm, mallForm, roadForm, renoForm, requiredKeysForProject])

  const openProjectModal = (key) => {
    setSelectedProject(String(key).toLowerCase())
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false)
  const goBackInModal = () => setShowModal(false)
  const proceedFromRole = () => setStep(2)

  const onNextFromRequirements = () => {
    if (requiredInvalid.length > 0) return
    setShowModal(false)
    // go to Specifications step
    setStep(3)
  }

  const setField = (name, value) => {
    if (selectedProject === 'villa') setVillaForm(prev => ({ ...prev, [name]: value }))
    if (selectedProject === 'apartment') setApartmentForm(prev => ({ ...prev, [name]: value }))
    if (selectedProject === 'office') setOfficeForm(prev => ({ ...prev, [name]: value }))
    if (selectedProject === 'mall') setMallForm(prev => ({ ...prev, [name]: value }))
    if (selectedProject === 'road') setRoadForm(prev => ({ ...prev, [name]: value }))
    if (selectedProject === 'renovation') setRenoForm(prev => ({ ...prev, [name]: value }))
  }

  const setApartmentCommon = (key, checked) => {
    setApartmentForm(prev => ({ ...prev, common: { ...prev.common, [key]: checked } }))
  }
  const toggleBoolean = (setter, key, checked) => setter(prev => ({ ...prev, [key]: checked }))
  const toggleRoom = (room) => {
    setRenoForm(prev => {
      const exists = prev.rooms.includes(room)
      const rooms = exists ? prev.rooms.filter(r => r !== room) : [...prev.rooms, room]
      return { ...prev, rooms }
    })
  }

  // ---------- Estimation helpers ----------
  const getProjectArea = () => {
    if (selectedProject === 'villa') return Number(villaForm.area || 0)
    if (selectedProject === 'apartment') return Number(apartmentForm.totalArea || 0)
    if (selectedProject === 'office') return Number(officeForm.area || 0)
    if (selectedProject === 'mall') return Number(mallForm.totalArea || 0)
    if (selectedProject === 'renovation') return Number(renoForm.area || 0)
    return 0
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

  const calculateEstimate = () => {
    const area = getProjectArea()
    const breakdown = []
    let total = 0
    Object.entries(specSelections).forEach(([feature, selection]) => {
      const value = selection.split(' - ').slice(1).join(' - ')
      const { amount, perSqft, perBag, perKg, perCft, perPiece } = parseMoney(value)
      const userQuantity = Number(specQuantities[feature]) || 0
      
      let qty = 1
      let line = amount
      
      if (userQuantity > 0) {
        // User specified quantity takes priority
        qty = userQuantity
        line = amount * qty
      } else if (perSqft) {
        // Auto-calculate based on area
        qty = area
        line = amount * area
      } else if (perBag || perKg || perCft || perPiece) {
        // For materials, use default quantities if no user input
        qty = 1
        line = amount
      }
      
      if (!isNaN(line) && line > 0) {
        total += line
        breakdown.push({ 
          feature, 
          value, 
          perSqft, 
          perBag, 
          perKg, 
          perCft, 
          perPiece,
          unitAmount: amount, 
          qty, 
          line 
        })
      }
    })
    return { area, total, breakdown }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 py-4 py-md-5">
      <Container>
        {/* Header */}
        <div className="text-center mb-4 mb-md-5">
          <h1 className="fw-bold">BuilderBro Cost Estimator</h1>
          <p className="text-secondary mb-0">Professional construction cost estimation tool for architects and engineers</p>
        </div>

        {/* Stepper */}
        <Row className="g-3 justify-content-center mb-4 mb-md-5">
          <Col xs={6} md={3}>
            <StepBadge number={1} label="Project Details" active={step === 1} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={2} label="Specifications" active={step === 2} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={3} label="Calculate" active={step === 3} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={4} label="Results & Report" active={step === 4} />
          </Col>
        </Row>

        {step === 1 && (
          <>
            {/* Role selection */}
            <div className="text-center mb-3 mb-md-4">
              <h3 className="fw-semibold">Choose Your Role</h3>
            </div>

            <Row className="g-4 align-items-stretch">
              <Col md={6}>
                <Card className="h-100 shadow rounded p-3 card-hover cursor-pointer" onClick={proceedFromRole}>
                  <Card.Body>
                    <div className="text-center mb-3">
                      <i className="bi bi-person-fill display-5 text-primary"></i>
                    </div>
                    <Card.Title className="h4 text-center">Client</Card.Title>
                    <Card.Subtitle className="text-muted text-center mb-3">I need a quick cost estimate for my project</Card.Subtitle>
                    <ul className="list-unstyled mt-3 mb-0">
                      <FeatureItem text="Simple form with basic details" />
                      <FeatureItem text="Automatic calculations" />
                      <FeatureItem text="Professional reports" />
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow rounded p-3">
                  <Card.Body>
                    <div className="text-center mb-3">
                      <i className="bi bi-tools display-5 text-warning"></i>
                    </div>
                    <Card.Title className="h4 text-center">Architect/Engineer</Card.Title>
                    <Card.Subtitle className="text-muted text-center mb-3">I have detailed specifications and quantities</Card.Subtitle>
                    <ul className="list-unstyled mt-3 mb-0">
                      <FeatureItem text="Manual quantity inputs" />
                      <FeatureItem text="Detailed specifications" />
                      <FeatureItem text="Professional BOQ reports" />
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {step === 2 && (
          <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-ladder text-warning"></i>
              <h3 className="fw-semibold mb-0">Select Your Project Type</h3>
            </div>
            <Row className="g-3 g-md-4">
              {projectTypes.map(p => (
                <Col md={4} lg={4} key={p.key}>
                  <Card className="h-100 shadow-sm rounded p-3 border card-hover cursor-pointer" onClick={() => openProjectModal(p.key)}>
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

            <div className="text-center mt-4">
              <Button variant="secondary" className="rounded" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </>
        )}

        {/* Specifications Step */}
        {step === 3 && (
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
                    {['Basic','Standard','Premium','Royal','Custom'].map(t => (
                      <option key={t} value={t}>{t}</option>
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
                      />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" className="rounded" onClick={() => setStep(2)}>Back</Button>
              <Button variant="primary" size="lg" className="rounded" onClick={() => setStep(4)}>
                Proceed to Estimation
              </Button>
            </div>
          </>
        )}

        {/* Estimation Step */}
        {step === 4 && (
          <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-calculator-fill text-success"></i>
              <h3 className="fw-semibold mb-0">Estimate</h3>
            </div>
            <Card className="shadow-sm rounded">
              <Card.Body>
                {(() => {
                  const { area, total, breakdown } = calculateEstimate()
                  return (
                    <>
                      <div className="mb-3">Built-up Area considered: <span className="fw-semibold">{area || 0}</span></div>
                      <div className="table-responsive">
                        <table className="table align-middle table-striped">
                          <thead className="table-dark">
                            <tr>
                              <th className="text-nowrap">Feature</th>
                              <th className="text-nowrap d-none d-md-table-cell">Selection</th>
                              <th className="text-end text-nowrap">Qty</th>
                              <th className="text-end text-nowrap">Rate</th>
                              <th className="text-end text-nowrap">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {breakdown.map((b) => (
                              <tr key={b.feature}>
                                <td className="text-nowrap">
                                  <div className="fw-semibold">{b.feature}</div>
                                  <div className="text-muted small d-md-none">{b.value}</div>
                                </td>
                                <td className="d-none d-md-table-cell text-truncate" style={{maxWidth: '200px'}} title={b.value}>{b.value}</td>
                                <td className="text-end">{b.qty}</td>
                                <td className="text-end">₹{b.unitAmount}</td>
                                <td className="text-end fw-semibold">₹{b.line.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-dark">
                            <tr>
                              <th colSpan={4} className="text-end">Total</th>
                              <th className="text-end">₹ {total.toLocaleString()}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  )
                })()}
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" className="rounded" onClick={() => setStep(3)}>Back</Button>
              <Button variant="outline-primary" className="rounded" onClick={() => window.print()}>Print / Save PDF</Button>
            </div>
          </>
        )}

        {/* Requirements Modal */}
        <Modal show={showModal} onHide={closeModal} centered dialogClassName="modal-dialog-centered">
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center gap-2">
              <i className="bi bi-clipboard-check text-primary"></i>
              {selectedProject === 'villa' ? 'Single-Family Villa Requirements' : 'Project Requirements'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject === 'villa' && (
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Villa Type *</Form.Label>
                    <Form.Select value={villaForm.type} onChange={e => setField('type', e.target.value)} className={requiredInvalid.includes('type') ? 'is-invalid' : ''}>
                      <option value="">Select Villa Type</option>
                      {['Single Villa', 'Duplex', 'Multi-Duplex'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Built-up Area *</Form.Label>
                    <div className="input-group">
                      <Form.Control type="number" placeholder="Enter area" value={villaForm.area} onChange={e => setField('area', e.target.value)} className={requiredInvalid.includes('area') ? 'is-invalid' : ''} />
                      <Form.Select value={villaForm.unit} onChange={e => setField('unit', e.target.value)} style={{ maxWidth: 120 }}>
                        <option>sq.ft</option>
                        <option>sq.m</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Floors *</Form.Label>
                    <Form.Select value={villaForm.floors} onChange={e => setField('floors', e.target.value)} className={requiredInvalid.includes('floors') ? 'is-invalid' : ''}>
                      <option value="">Select Floors</option>
                      {Array.from({ length: 5 }, (_, i) => i + 1).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Bedrooms</Form.Label>
                    <Form.Control type="number" placeholder="Enter bedrooms" value={villaForm.bedrooms} onChange={e => setField('bedrooms', e.target.value)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Bathrooms</Form.Label>
                    <Form.Control type="number" placeholder="Enter bathrooms" value={villaForm.bathrooms} onChange={e => setField('bathrooms', e.target.value)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Construction Quality *</Form.Label>
                    <Form.Select value={villaForm.quality} onChange={e => setField('quality', e.target.value)} className={requiredInvalid.includes('quality') ? 'is-invalid' : ''}>
                      <option value="">Select Construction Package</option>
                      {['Basic', 'Classic', 'Premium', 'Royale'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={villaForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['North', 'South', 'East', 'West', 'Central'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            )}

            {selectedProject === 'apartment' && (
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Total Built-up Area *</Form.Label>
                    <Form.Control type="number" value={apartmentForm.totalArea} onChange={e => setField('totalArea', e.target.value)} className={requiredInvalid.includes('totalArea') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Units *</Form.Label>
                    <Form.Control type="number" value={apartmentForm.units} onChange={e => setField('units', e.target.value)} className={requiredInvalid.includes('units') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Floors *</Form.Label>
                    <Form.Select value={apartmentForm.floors} onChange={e => setField('floors', e.target.value)} className={requiredInvalid.includes('floors') ? 'is-invalid' : ''}>
                      <option value="">Select Floors</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Common Areas</Form.Label>
                    <div className="d-flex flex-wrap gap-3 pt-1">
                      {[
                        ['parking', 'Parking'],
                        ['garden', 'Garden'],
                        ['gym', 'Gym'],
                        ['play', 'Play Area']
                      ].map(([k, label]) => (
                        <Form.Check key={k} type="checkbox" label={label} checked={apartmentForm.common[k]} onChange={e => setApartmentCommon(k, e.target.checked)} />
                      ))}
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Construction Quality *</Form.Label>
                    <Form.Select value={apartmentForm.quality} onChange={e => setField('quality', e.target.value)} className={requiredInvalid.includes('quality') ? 'is-invalid' : ''}>
                      <option value="">Select Construction Package</option>
                      {['Basic', 'Classic', 'Premium', 'Royale'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={apartmentForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['North', 'South', 'East', 'West', 'Central'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            )}

            {selectedProject === 'office' && (
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Built-up Area *</Form.Label>
                    <Form.Control type="number" value={officeForm.area} onChange={e => setField('area', e.target.value)} className={requiredInvalid.includes('area') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Floors *</Form.Label>
                    <Form.Select value={officeForm.floors} onChange={e => setField('floors', e.target.value)} className={requiredInvalid.includes('floors') ? 'is-invalid' : ''}>
                      <option value="">Select Floors</option>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Layout Type *</Form.Label>
                    <div className="d-flex gap-3 pt-1">
                      {[
                        ['open', 'Open Plan'],
                        ['partitioned', 'Partitioned']
                      ].map(([v, label]) => (
                        <Form.Check key={v} type="radio" name="office-layout" label={label} checked={officeForm.layout === v} onChange={() => setField('layout', v)} />
                      ))}
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">AC Systems *</Form.Label>
                    <Form.Select value={officeForm.ac} onChange={e => setField('ac', e.target.value)} className={requiredInvalid.includes('ac') ? 'is-invalid' : ''}>
                      <option value="">Select AC System</option>
                      {['Centralized', 'Split', 'None'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Elevators *</Form.Label>
                    <Form.Control type="number" value={officeForm.elevators} onChange={e => setField('elevators', e.target.value)} className={requiredInvalid.includes('elevators') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={officeForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['North', 'South', 'East', 'West', 'Central'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            )}

            {selectedProject === 'mall' && (
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Total Built-up Area *</Form.Label>
                    <Form.Control type="number" value={mallForm.totalArea} onChange={e => setField('totalArea', e.target.value)} className={requiredInvalid.includes('totalArea') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Floors *</Form.Label>
                    <Form.Select value={mallForm.floors} onChange={e => setField('floors', e.target.value)} className={requiredInvalid.includes('floors') ? 'is-invalid' : ''}>
                      <option value="">Select Floors</option>
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Parking Capacity</Form.Label>
                    <Form.Control type="number" value={mallForm.parkingCapacity} onChange={e => setField('parkingCapacity', e.target.value)} />
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <div className="d-flex gap-4">
                      <Form.Check type="checkbox" label="Food Court" checked={mallForm.foodCourt} onChange={e => toggleBoolean(setMallForm, 'foodCourt', e.target.checked)} />
                      <Form.Check type="checkbox" label="Large Spaces" checked={mallForm.largeSpaces} onChange={e => toggleBoolean(setMallForm, 'largeSpaces', e.target.checked)} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Construction Quality *</Form.Label>
                    <Form.Select value={mallForm.quality} onChange={e => setField('quality', e.target.value)} className={requiredInvalid.includes('quality') ? 'is-invalid' : ''}>
                      <option value="">Select Construction Package</option>
                      {['Basic', 'Classic', 'Premium', 'Royale'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={mallForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['North', 'South', 'East', 'West', 'Central'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            )}

            {selectedProject === 'road' && (
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Road Length (km) *</Form.Label>
                    <Form.Control type="number" value={roadForm.lengthKm} onChange={e => setField('lengthKm', e.target.value)} className={requiredInvalid.includes('lengthKm') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Road Width (m) *</Form.Label>
                    <Form.Control type="number" value={roadForm.widthM} onChange={e => setField('widthM', e.target.value)} className={requiredInvalid.includes('widthM') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Pavement Type *</Form.Label>
                    <Form.Select value={roadForm.pavement} onChange={e => setField('pavement', e.target.value)} className={requiredInvalid.includes('pavement') ? 'is-invalid' : ''}>
                      <option value="">Select Pavement</option>
                      {['Asphalt', 'Concrete', 'Gravel'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <div className="d-flex gap-4">
                      <Form.Check type="checkbox" label="Drainage Requirement" checked={roadForm.drainage} onChange={e => toggleBoolean(setRoadForm, 'drainage', e.target.checked)} />
                      <Form.Check type="checkbox" label="Signage & Markings" checked={roadForm.signage} onChange={e => toggleBoolean(setRoadForm, 'signage', e.target.checked)} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={roadForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['North', 'South', 'East', 'West', 'Central'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            )}

            {selectedProject === 'renovation' && (
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Type of Renovation *</Form.Label>
                    <Form.Select value={renoForm.type} onChange={e => setField('type', e.target.value)} className={requiredInvalid.includes('type') ? 'is-invalid' : ''}>
                      <option value="">Select Type</option>
                      {['Partial Work', 'Upgrades', 'Modernization'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Built-up Area *</Form.Label>
                    <Form.Control type="number" value={renoForm.area} onChange={e => setField('area', e.target.value)} className={requiredInvalid.includes('area') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Floors Affected *</Form.Label>
                    <Form.Select value={renoForm.floorsAffected} onChange={e => setField('floorsAffected', e.target.value)} className={requiredInvalid.includes('floorsAffected') ? 'is-invalid' : ''}>
                      <option value="">Select Floors</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Rooms to Renovate *</Form.Label>
                    <div className="d-flex flex-wrap gap-3 pt-1">
                      {['Bedrooms', 'Kitchen', 'Bathrooms', 'Living Area'].map(rm => (
                        <Form.Check key={rm} type="checkbox" label={rm} checked={renoForm.rooms.includes(rm)} onChange={() => toggleRoom(rm)} />
                      ))}
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Estimated Age of Structure (years) *</Form.Label>
                    <Form.Control type="number" value={renoForm.ageYears} onChange={e => setField('ageYears', e.target.value)} className={requiredInvalid.includes('ageYears') ? 'is-invalid' : ''} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={renoForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['North', 'South', 'East', 'West', 'Central'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-between flex-wrap modal-footer-sticky">
            <Button variant="secondary" onClick={goBackInModal}>Back</Button>
            <div className="d-flex align-items-center gap-2">
              {requiredInvalid.length > 0 && (
                <span className="text-danger small">Please fill required fields</span>
              )}
              <Button variant="primary" size="lg" className="rounded" onClick={onNextFromRequirements}>
                <i className="bi bi-gear-fill me-2"></i>
                Next: Select Specifications
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}