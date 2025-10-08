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
    { key: 'villa', title: 'Villa', icon: 'bi-house', desc: ' residential building', tags: ['Foundation', 'Structure', 'Finishing'] },
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

  // Quality base rates and region multipliers
  const qualityRates = {
    'Basic': 1500,
    'Premium': 2000,
    'Classic': 2500,
    'Royale': 3000
  }

  const regionMultipliers = {
    'Davangere': 1.00,
    'Hassan': 1.05,
    'Bengaluru (Karnataka)': 1.20,
    'Chennai (Tamil Nadu)': 1.15,
    'North': 1.10,
    'South': 1.08,
    'East': 1.12,
    'West': 1.14,
    'Central': 1.06
  }

  // Universal calculation function for all project types
  const calculateAutoEstimate = () => {
    if (!selectedProject) return null

    const getProjectData = () => {
      switch(selectedProject) {
        case 'villa':
          return {
            area: Number(villaForm.area || 0),
            floors: Number(villaForm.floors || 1),
            bedrooms: Number(villaForm.bedrooms || 0),
            bathrooms: Number(villaForm.bathrooms || 0),
            quality: villaForm.quality || 'Basic',
            region: villaForm.region || 'Central'
          }
        case 'apartment':
          return {
            area: Number(apartmentForm.totalArea || 0),
            floors: Number(apartmentForm.floors || 1),
            bedrooms: Number(apartmentForm.units || 0),
            bathrooms: Math.ceil((apartmentForm.units || 1) * 1.5),
            quality: apartmentForm.quality || 'Basic',
            region: apartmentForm.region || 'Central'
          }
        case 'office':
          return {
            area: Number(officeForm.area || 0),
            floors: Number(officeForm.floors || 1),
            bedrooms: 0,
            bathrooms: Math.ceil((officeForm.area || 0) / 1500),
            quality: 'Premium',
            region: officeForm.region || 'Central'
          }
        case 'mall':
          return {
            area: Number(mallForm.totalArea || 0),
            floors: Number(mallForm.floors || 1),
            bedrooms: 0,
            bathrooms: Math.ceil((mallForm.totalArea || 0) / 500),
            quality: mallForm.quality || 'Basic',
            region: mallForm.region || 'Central'
          }
        case 'renovation':
          return {
            area: Number(renoForm.area || 0),
            floors: Number(renoForm.floorsAffected || 1),
            bedrooms: 0,
            bathrooms: Math.ceil(renoForm.rooms?.length || 2),
            quality: 'Classic',
            region: renoForm.region || 'Central'
          }
        case 'road':
          return {
            area: Number(roadForm.lengthKm || 0) * Number(roadForm.widthM || 0) * 10.764, // Convert to sqft
            floors: 1,
            bedrooms: 0,
            bathrooms: 0,
            quality: 'Basic',
            region: roadForm.region || 'Central'
          }
        default:
          return { area: 0, floors: 1, bedrooms: 0, bathrooms: 0, quality: 'Basic', region: 'Central' }
      }
    }

    const projectData = getProjectData()
    const { area, floors, bedrooms, bathrooms, quality, region } = projectData

    if (area === 0) return null

    const baseRate = qualityRates[quality] || 1500
    const regionMultiplier = regionMultipliers[region] || 1.00
    const costPerSqft = baseRate * regionMultiplier
    const totalCost = area * floors * costPerSqft

    // Calculate materials based on project type
    let materials = {}
    
    switch(selectedProject) {
      case 'villa':
        materials = {
          'Cement': Math.ceil(area * 0.4),
          'Steel (kg)': Math.ceil(area * 3.5),
          'Sand (cft)': Math.ceil(area * 0.8),
          'Bricks': Math.ceil(area * 7.5),
          'Electrical': Math.round(area * 80),
          'Plumbing': Math.round(area * 60),
          'Flooring': Math.round(area * 90)
        }
        break
      
      case 'apartment':
        materials = {
          'Cement': Math.ceil(area * 0.35 * floors),
          'Steel (kg)': Math.ceil(area * 3 * floors),
          'Sand (cft)': Math.ceil(area * 0.7 * floors),
          'Paint': Math.round(area * 20),
          'Electrical + Plumbing': Math.round(area * 120)
        }
        break
      
      case 'renovation':
        materials = {
          'Flooring': Math.round(area * 150),
          'Painting': Math.round(area * 25),
          'Electrical': Math.round(area * 180),
          'False Ceiling': Math.round(area * 90),
          'Glass & Partition': Math.round(area * 100)
        }
        break
      
      case 'mall':
        materials = {
          'Cement': Math.ceil(area * 0.5),
          'Steel (kg)': Math.ceil(area * 5),
          'HVAC': Math.round(area * 300),
          'Electrical': Math.round(area * 200),
          'Plumbing': Math.round(area * 100),
          'Flooring': Math.round(area * 150)
        }
        break
      
      case 'road':
        const roadAreaSqm = area / 10.764 // Convert back to sqm
        materials = {
          'Bitumen (kg)': Math.round(roadAreaSqm * 60),
          'Aggregate (tons)': Math.round(roadAreaSqm * 1.2 * 100) / 100,
          'Total Road Cost': Math.round(roadAreaSqm * 500)
        }
        break
      
      default:
        materials = {}
    }

    return {
      projectType: selectedProject,
      area,
      floors,
      bedrooms,
      bathrooms,
      quality,
      region,
      costPerSqft: Math.round(costPerSqft),
      totalCost: Math.round(totalCost),
      materials
    }
  }

  const calculateEstimate = () => {
    const area = getProjectArea()
    const breakdown = []
    let total = 0
    
    // Get project details for calculations
    const getProjectDetails = () => {
      if (selectedProject === 'villa') {
        return {
          area: Number(villaForm.area || 0),
          floors: Number(villaForm.floors || 1),
          bedrooms: Number(villaForm.bedrooms || 0),
          bathrooms: Number(villaForm.bathrooms || 0),
          quality: villaForm.quality || 'Basic'
        }
      }
      if (selectedProject === 'apartment') {
        return {
          area: Number(apartmentForm.totalArea || 0),
          floors: Number(apartmentForm.floors || 1),
          bedrooms: 0, // Will be calculated per unit
          bathrooms: 0, // Will be calculated per unit
          quality: apartmentForm.quality || 'Basic'
        }
      }
      if (selectedProject === 'office') {
        return {
          area: Number(officeForm.area || 0),
          floors: Number(officeForm.floors || 1),
          bedrooms: 0,
          bathrooms: Math.ceil((Number(officeForm.floors || 1) * Number(officeForm.area || 0)) / 1500), // 1 toilet per 1500 sqft
          quality: 'Standard'
        }
      }
      if (selectedProject === 'mall') {
        return {
          area: Number(mallForm.totalArea || 0),
          floors: Number(mallForm.floors || 1),
          bedrooms: 0,
          bathrooms: Math.ceil((Number(mallForm.totalArea || 0)) / 500), // 1 toilet per 500 sqft
          quality: mallForm.quality || 'Basic'
        }
      }
      if (selectedProject === 'renovation') {
        return {
          area: Number(renoForm.area || 0),
          floors: Number(renoForm.floorsAffected || 1),
          bedrooms: 0,
          bathrooms: 0,
          quality: 'Standard'
        }
      }
      return { area: 0, floors: 1, bedrooms: 0, bathrooms: 0, quality: 'Basic' }
    }

    const projectDetails = getProjectDetails()
    const { area: projectArea, floors, bedrooms, bathrooms, quality } = projectDetails

    // Calculate quantities based on project specifications
    const calculateQuantities = (feature, amount, value) => {
      const userQuantity = Number(specQuantities[feature]) || 0
      
      // If user provided quantity, use that
      if (userQuantity > 0) {
        return userQuantity
      }

      // Auto-calculate based on feature type
      switch (feature) {
        // Construction Materials
        case 'Cement':
          // 1 bag cement per ~1.5 sqft of construction
          const cementMultiplier = quality === 'Royal' ? 0.8 : quality === 'Premium' ? 0.9 : quality === 'Standard' ? 1.0 : 1.1
          return Math.ceil((projectArea * floors * cementMultiplier) / 1.5)

        case 'Steel':
          // 45-65 kg per sqft depending on quality
          const steelPerSqft = quality === 'Royal' ? 65 : quality === 'Premium' ? 55 : quality === 'Standard' ? 50 : 45
          return projectArea * floors * steelPerSqft

        case 'Aggregates (Sand)':
          // 0.3 cft per sqft
          return Math.ceil(projectArea * floors * 0.3)

        case 'Aggregates (Gravel)':
          // 0.2 cft per sqft
          return Math.ceil(projectArea * floors * 0.2)

        case 'Bricks':
          // 500-600 bricks per sqft depending on quality
          const brickPerSqft = quality === 'Royal' ? 600 : quality === 'Premium' ? 550 : quality === 'Standard' ? 525 : 500
          return projectArea * floors * brickPerSqft

        case 'Concrete Blocks':
          // 15-20 blocks per sqft
          const blocksPerSqft = quality === 'Royal' ? 20 : quality === 'Premium' ? 18 : quality === 'Standard' ? 16 : 15
          return projectArea * floors * blocksPerSqft

        // Doors
        case 'Main Door':
          return floors // 1 main door per floor

        case 'Internal Doors':
          if (bedrooms > 0) {
            return bedrooms + Math.ceil(bedrooms * 0.5) // bedrooms + half for other rooms
          }
          return Math.ceil(projectArea / 200) // 1 door per 200 sqft

        case 'Bathroom Doors':
          return bathrooms || Math.ceil(floors * 1.5) // 1.5 bathrooms per floor avg

        case 'Pooja Room Door':
          return Math.ceil(floors / 2) // 1 Pooja room every 2 floors

        // Windows & Grills
        case 'Windows':
          return Math.ceil(projectArea * floors / 100) // 1 window per 100 sqft

        case 'Window Grills':
          return Math.ceil(projectArea * floors / 80) // slightly more grills

        // Flooring (per sqft items)
        case 'Rooms & Kitchen Flooring':
        case 'Living & Dining Flooring':
        case 'Balcony Flooring':
        case 'Parking Tiles':
        case 'Staircase Flooring':
          return projectArea * floors

        // Electrical & Plumbing
        case 'Wiring':
          return Math.ceil(projectArea * floors * 2) // 2 meters per sqft

        case 'Switches & Sockets':
          return Math.ceil(projectArea * floors / 15) // 1 switch/socket per 15 sqft

        case 'Main Sink Faucet':
        case 'Kitchen Sink':
          return floors || 1

        case 'Sanitaryware & CP Fittings':
          return bathrooms || Math.ceil(floors * 1.5)

        // Tanks & Storage
        case 'Overhead Tank':
          return floors

        case 'Underground Sump':
          return floors

        // Painting
        case 'Interior Painting':
        case 'Exterior Painting':
          return Math.ceil(projectArea * floors * 0.8) // 80% of floor area for walls

        // Mirrors & Accessories
        case 'Mirror & Accessories':
          return bathrooms || Math.ceil(floors * 1.5)

        // Structural Elements
        case 'Staircase Railing':
          return floors > 1 ? floors - 1 : 1 // 1 railing per stair level

        // Default case
        default:
          // For per-sqft items, use area
          if (/sq\.?\s*ft/i.test(value)) {
            return projectArea * floors
          }
          return 1
      }
    }

    Object.entries(specSelections).forEach(([feature, selection]) => {
      const value = selection.split(' - ').slice(1).join(' - ')
      const { amount } = parseMoney(value)

      const qty = calculateQuantities(feature, amount, value)
      const line = amount * qty

      if (!isNaN(line) && line > 0) {
        total += line
        breakdown.push({
          feature,
          value,
          unitAmount: amount,
          qty,
          line
        })
      }
    })

    return { 
      area: projectArea, 
      total, 
      breakdown,
      projectDetails: {
        floors,
        bedrooms: bedrooms || Math.ceil(projectArea / 300),
        bathrooms: bathrooms || Math.ceil(floors * 1.5),
        quality
      }
    }
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
          <Col xs={6} md={2}>
            <StepBadge number={1} label="Project Details" active={step === 1} />
          </Col>
          <Col xs={6} md={2}>
            <StepBadge number={2} label="Auto Estimate" active={step === 2} />
          </Col>
          <Col xs={6} md={2}>
            <StepBadge number={3} label="Specifications" active={step === 3} />
          </Col>
          <Col xs={6} md={2}>
            <StepBadge number={4} label="Construction Cost" active={step === 4} />
          </Col>
          <Col xs={6} md={2}>
            <StepBadge number={5} label="Calculator" active={step === 5} />
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

        {/* Auto-Calculation Display after project selection */}
        {step === 2 && !showModal && selectedProject && (() => {
          const estimate = calculateAutoEstimate()
          if (!estimate) return null
          
          return (
            <Row className="justify-content-center mb-4">
              <Col lg={10}>
                <Card className="shadow-sm border-success">
                  <Card.Header className="bg-success text-white">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-calculator-fill"></i>
                      <h5 className="mb-0">🚀 Quick Estimate Preview</h5>
                      <Badge bg="light" text="dark" className="ms-auto">
                        {selectedProject === 'road' ? 'Road' :
                         selectedProject === 'renovation' ? 'Renovation' :
                         selectedProject.charAt(0).toUpperCase() + selectedProject.slice(1)} Project
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="py-3">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="row g-3">
                          <Col sm={6} md={3}>
                            <div className="text-center">
                              <div className="fw-bold text-primary">{estimate.area.toLocaleString()} sqft</div>
                              <div className="small text-muted">Built-up Area</div>
                            </div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="text-center">
                              <div className="fw-bold text-primary">{estimate.floors}</div>
                              <div className="small text-muted">Floors</div>
                            </div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="text-center">
                              <div className="fw-bold text-primary">{estimate.quality}</div>
                              <div className="small text-muted">Quality</div>
                            </div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="text-center">
                              <div className="fw-bold text-primary">{estimate.region === 'Bengaluru (Karnataka)' ? 'Bangalore' : estimate.region}</div>
                              <div className="small text-muted">Region</div>
                            </div>
                          </Col>
                        </div>
                      </Col>
                      <Col md={4} className="text-md-end">
                        <div className="border-start border-3 border-success ps-3">
                          <div className="fw-bold text-dark">₹{estimate.costPerSqft.toLocaleString()}/sqft</div>
                          <div className="fw-bold text-success h4 mb-1">₹{estimate.totalCost.toLocaleString()}</div>
                          <div className="small text-muted">Total Project Cost</div>
                        </div>
                      </Col>
                    </Row>

                    <div className="alert alert-light mt-3 mb-0 py-2">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-clock text-info me-2"></i>
                        <div className="small">
                          <strong>Real-time calculation:</strong> Estimates update automatically as you change inputs.
                          Approx. 5–10% area may be used for setbacks or open space.
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )
        })()}

        {/* Specifications Step */}
        {step === 3 && (
          <>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-list-check text-primary"></i>
              <h3 className="fw-semibold mb-0">Project Specifications</h3>
            </div>
            <div className="text-muted mb-3">For project: <span className="fw-semibold text-dark text-capitalize">{selectedProject || 'project'}</span></div>

            {/* Auto-calculation preview */}
            {(() => {
              const estimate = calculateAutoEstimate()
              if (!estimate) return null
              
              return (
                <Card className="shadow-sm border-info mb-4">
                  <Card.Header className="bg-info text-white">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-gear-fill"></i>
                      <h6 className="mb-0">📊 Auto-Calculated Estimate Preview</h6>
                    </div>
                  </Card.Header>
                  <Card.Body className="py-3">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <Row>
                          <Col sm={6} md={3}>
                            <div className="fw-bold text-primary">Area</div>
                            <div className="h6">{estimate.area.toLocaleString()} sqft</div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="fw-bold text-primary">Quality</div>
                            <div className="h6">{estimate.quality}</div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="fw-bold text-primary">Region</div>
                            <div className="h6">{estimate.region}</div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="fw-bold text-primary">Cost/sqft</div>
                            <div className="h6">₹{estimate.costPerSqft.toLocaleString()}</div>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={4} className="text-md-end">
                        <div className="fw-bold text-success h5 mb-1">
                          ₹{estimate.totalCost.toLocaleString()}
                        </div>
                        <Badge bg="success">Auto-calculated</Badge>
                        <div className="small text-muted mt-1">
                          Materials: {Object.keys(estimate.materials).length} items
                        </div>
                      </Col>
                    </Row>
                    
                    <div className="alert alert-light mt-3 mb-0 py-2">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-lightbulb text-warning me-2"></i>
                        <div className="small">
                          <strong>Automatic:</strong> All specifications and material quantities are auto-calculated based on your project inputs.
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )
            })()}

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

            <div className="d-flex justify-content-between mt-4 mb-3 border-top pt-3">
              <Button variant="secondary" className="rounded" onClick={() => setStep(2)}>Back</Button>
              <Button variant="primary" size="lg" className="rounded" onClick={() => setStep(5)}>
                <i className="bi bi-calculator me-2"></i>Proceed to Calculator
              </Button>
            </div>
          </>
        )}

        {/* Auto-Calculation Display - shows when modal closes */}
        {!showModal && selectedProject && (villaForm.area || apartmentForm.totalArea || officeForm.area || mallForm.totalArea || renoForm.area || roadForm.lengthKm) && (
          <Card className="shadow-sm border-success mb-4">
            <Card.Header className="bg-success text-white">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calculator-fill"></i>
                <h5 className="mb-0">📊 Auto-Calculated Estimate</h5>
                <Badge bg="light" text="dark" className="ms-auto">
                  {selectedProject === 'road' ? 'Road Construction' :
                   selectedProject === 'renovation' ? 'Office Renovation' :
                   selectedProject.charAt(0).toUpperCase() + selectedProject.slice(1)} Project
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {(() => {
                const estimate = calculateAutoEstimate()
                if (!estimate) return null
                
                return (
                  <>
                    <Row className="mb-4">
                      <Col md={8}>
                        <div className="h5 mb-3">🏗️ Project Summary</div>
                        <Row>
                          <Col sm={6} md={3}>
                            <div className="fw-bold text-primary">Built-up Area</div>
                            <div className="h6">{estimate.area.toLocaleString()} sqft</div>
                          </Col>
                          <Col sm={6} md={2}>
                            <div className="fw-bold text-primary">Floors</div>
                            <div className="h6">{estimate.floors}</div>
                          </Col>
                          <Col sm={6} md={3}>
                            <div className="fw-bold text-primary">Quality</div>
                            <div className="h6">{estimate.quality}</div>
                          </Col>
                          <Col sm={6} md={4}>
                            <div className="fw-bold text-primary">Region</div>
                            <div className="h6">{estimate.region}</div>
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

                    <Row>
                      <Col md={12}>
                        <div className="h6 mb-3">📦 Material Requirements</div>
                        <div className="row">
                          {Object.entries(estimate.materials).map(([material, quantity]) => (
                            <Col xs={6} sm={4} md={3} key={material} className="mb-2">
                              <div className="bg-light rounded p-2 text-center">
                                <div className="fw-bold text-dark">{material}</div>
                                <div className="text-primary">{quantity.toLocaleString()}</div>
                              </div>
                            </Col>
                          ))}
                        </div>
                      </Col>
                    </Row>

                    <div className="alert alert-info mt-3 mb-0">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      <strong>Note:</strong> Values are approximate; approx. 5–10% area may be used for setbacks or open space.
                      Final costs may vary based on site-specific conditions and material availability.
                    </div>
                  </>
                )
              })()}
            </Card.Body>
          </Card>
        )}

        {/* Construction Cost Step */}
        {step === 4 && (
          <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-calculator-fill text-success"></i>
              <h3 className="fw-semibold mb-0">Construction Cost Estimation</h3>
            </div>
            
            {selectedProject === 'villa' && villaForm.area && villaForm.floors && villaForm.quality && villaForm.region && (
              <>
                {(() => {
                  const constructionCost = calculateConstructionCost()
                  const slabMaterials = calculateSlabMaterials()
                  return (
                    <>
                      <Row className="mb-4">
                        <Col md={6}>
                          <Card className="shadow-sm border-success">
                            <Card.Header className="bg-success text-white">
                              <h5 className="mb-0">🏗️ Construction Cost Summary</h5>
                            </Card.Header>
                            <Card.Body>
                              <div className="mb-3">
                                <div className="fw-bold">Project Details:</div>
                                <div className="text-muted small">
                                  Area: {constructionCost.area} sqft • Floors: {constructionCost.floors} • 
                                  Quality: {constructionCost.quality} • Region: {constructionCost.region}
                                </div>
                              </div>
                              <div className="mb-3">
                                <div className="fw-bold">Cost per sqft: ₹{constructionCost.costPerSqft.toLocaleString()}</div>
                                <div className="fw-bold">Total Construction Cost: ₹{constructionCost.totalCost.toLocaleString()}</div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="shadow-sm border-info">
                            <Card.Header className="bg-info text-white">
                              <h5 className="mb-0">🧱 Slab Construction Materials</h5>
                            </Card.Header>
                            <Card.Body>
                              <div className="table-responsive">
                                <table className="table table-sm">
                                  <tbody>
                                    <tr><td><strong>Slab Volume:</strong></td><td>{slabMaterials.slabVolumeCum} m³</td></tr>
                                    <tr><td><strong>Cement:</strong></td><td>{slabMaterials.cementBags} bags ({slabMaterials.cementKg} kg)</td></tr>
                                    <tr><td><strong>Sand:</strong></td><td>{slabMaterials.sandCum} m³</td></tr>
                                    <tr><td><strong>Aggregate:</strong></td><td>{slabMaterials.aggregateCum} m³</td></tr>
                                    <tr><td><strong>Steel:</strong></td><td>{slabMaterials.steelKg.toLocaleString()} kg</td></tr>
                                    <tr><td><strong>Water:</strong></td><td>{slabMaterials.waterLitres.toLocaleString()} litres</td></tr>
                                  </tbody>
                                </table>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Card className="mb-4">
                        <Card.Header>
                          <h5 className="mb-0">📝 Notes</h5>
                        </Card.Header>
                        <Card.Body>
                          <ul className="mb-0">
                            <li>Values are approximate; 5–10% of area may be used for setbacks/open space.</li>
                            <li>Materials listed are for slab construction only.</li>
                            <li>All quantities and costs are auto-calculated—no manual entry required.</li>
                            <li>Final costs may vary based on site-specific conditions and material availability.</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </>
                  )
                })()}
              </>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" className="rounded" onClick={() => setStep(3)}>Back to Specifications</Button>
              <Button variant="primary" size="lg" className="rounded" onClick={() => setStep(5)}>
                Go to Calculator
              </Button>
            </div>
          </>
        )}

        {/* Detailed Estimation Step */}
        {step === 5 && (
          <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-calculator-fill text-success"></i>
              <h3 className="fw-semibold mb-0">Estimate</h3>
            </div>
            <Card className="shadow-sm rounded">
              <Card.Body>
                {(() => {
                  const { area, total, breakdown, projectDetails } = calculateEstimate()
                  return (
                    <>
                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="fw-semibold">Project Summary:</div>
                          <div className="text-muted small">
                            Area: {area} sqft • Floors: {projectDetails.floors} • 
                            Bedrooms: {projectDetails.bedrooms} • Bathrooms: {projectDetails.bathrooms}
                          </div>
                          <div className="text-muted small">Quality: {projectDetails.quality}</div>
                        </Col>
                        <Col md={6}>
                          <div className="text-end">
                            <div className="badge bg-info">Auto-calculated quantities</div>
                          </div>
                        </Col>
                      </Row>
                      
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
                                <td className="text-end">{Number(b.qty).toLocaleString()}</td>
                                <td className="text-end">₹{b.unitAmount}</td>
                                <td className="text-end fw-semibold">₹{b.line.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-dark">
                            <tr>
                              <th colSpan={4} className="text-end">Total Estimated Cost</th>
                              <th className="text-end">₹{total.toLocaleString()}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <div className="alert alert-warning mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Note:</strong> Values are approximate; 5–10% may vary due to site-specific factors such as soil conditions, accessibility, and local material availability.
                      </div>
                    </>
                  )
                })()}
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" className="rounded" onClick={() => setStep(3)}>Back to Specifications</Button>
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
                      {['Davangere', 'Hassan', 'Bengaluru (Karnataka)', 'Chennai (Tamil Nadu)', 'North', 'South', 'East', 'West', 'Central'].map(r => (
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