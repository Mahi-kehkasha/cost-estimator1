import React, { useMemo, useState, useEffect, useCallback } from 'react'
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

// Base prices and multipliers (no changes needed here)
const basePrices = { /* ... your existing basePrices ... */ }
const regionMultipliers = { /* ... your existing regionMultipliers ... */ }
const qualityMultipliers = { /* ... your existing qualityMultipliers ... */ }
const calcQuantities = { /* ... your existing calcQuantities ... */ }
const calculateEstimation = { /* ... your existing calculateEstimation ... */ }
const getUnitForMaterial = { /* ... your existing getUnitForMaterial ... */ }

export default function App() {
  // Core app state
  const [step, setStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [estimate, setEstimate] = useState(null)

  // Project configuration state
  const [packageTier, setPackageTier] = useState('Custom')
  const [quantityPreset, setQuantityPreset] = useState('Custom')
  const [specSelections, setSpecSelections] = useState({})
  const [specQuantities, setSpecQuantities] = useState({})

  // Area calculation helpers
  const presetSqftMap = useMemo(() => ({
    '2BHK': 900,
    '3BHK': 1200,
    '4BHK': 1500,
    '1200': 1200
  }), [])

  const getActiveSqft = useCallback((fallbackSqft) => {
    if (quantityPreset && quantityPreset !== 'Custom') {
      const presetVal = presetSqftMap[quantityPreset]
      if (presetVal) return presetVal
      if (quantityPreset === '1200') return 1200
    }
    return fallbackSqft
  }, [quantityPreset, presetSqftMap])

  // Forms state
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

  const getProjectArea = useCallback(() => {
    if (!selectedProject) return 0
    switch (selectedProject.toLowerCase()) {
      case 'villa': return getActiveSqft(Number(villaForm.area || 0))
      case 'apartment': return getActiveSqft(Number(apartmentForm.totalArea || 0))
      case 'office': return getActiveSqft(Number(officeForm.area || 0))
      case 'mall': return getActiveSqft(Number(mallForm.totalArea || 0))
      case 'renovation': return getActiveSqft(Number(renoForm.area || 0))
      default: return 0
    }
  }, [
    selectedProject,
    villaForm.area,
    apartmentForm.totalArea,
    officeForm.area,
    mallForm.totalArea,
    renoForm.area,
    getActiveSqft
  ])

  // Auto-calculation effect
  useEffect(() => {
    if (selectedProject) {
      let projectData = null;
      const currentArea = getProjectArea();
      
      if (currentArea > 0) {
        if (selectedProject === 'villa' && villaForm.floors && villaForm.quality && villaForm.region) {
          projectData = {
            projectType: 'Villa',
            area: currentArea,
            floors: Number(villaForm.floors),
            region: villaForm.region,
            quality: villaForm.quality
          };
        } else if (selectedProject === 'apartment' && apartmentForm.floors && apartmentForm.quality && apartmentForm.region) {
          projectData = {
            projectType: 'Apartment',
            area: currentArea,
            floors: Number(apartmentForm.floors),
            region: apartmentForm.region,
            quality: apartmentForm.quality
          };
        } else if (selectedProject === 'office' && officeForm.floors && officeForm.region) {
          projectData = {
            projectType: 'Office',
            area: currentArea,
            floors: Number(officeForm.floors),
            region: officeForm.region,
            quality: 'Premium'
          };
        } else if (selectedProject === 'mall' && mallForm.floors && mallForm.quality && mallForm.region) {
          projectData = {
            projectType: 'Mall',
            area: currentArea,
            floors: Number(mallForm.floors),
            region: mallForm.region,
            quality: mallForm.quality
          };
        } else if (selectedProject === 'renovation' && renoForm.floorsAffected && renoForm.region) {
          projectData = {
            projectType: 'Office',
            area: currentArea,
            floors: Number(renoForm.floorsAffected),
            region: renoForm.region,
            quality: 'Premium'
          };
        } else if (selectedProject === 'road' && roadForm.lengthKm && roadForm.widthM && roadForm.region) {
          const roadArea = Number(roadForm.lengthKm) * Number(roadForm.widthM) * 10.764;
          projectData = {
            projectType: 'Road',
            area: roadArea,
            floors: 1,
            region: roadForm.region,
            quality: 'Basic'
          };
        }
      }
      
      if (projectData) {
        const result = calculateEstimation(projectData);
        setEstimate(result);
      } else {
        setEstimate(null);
      }
    } else {
      setEstimate(null);
    }
  }, [
    selectedProject,
    villaForm,
    apartmentForm,
    officeForm,
    mallForm,
    roadForm,
    renoForm,
    getProjectArea
  ]);

  // ... Rest of your component code (event handlers, JSX, etc.) ...

  return (
    // ... Your existing JSX ...
  )
}