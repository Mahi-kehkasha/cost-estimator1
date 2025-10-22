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

// ---------- Base Prices (Complete List) ----------
const basePrices = {
  Cement: 370, // per bag
  Steel: 79, // per kg
  Sand: null, // keep null if not provided
  Bricks: 39, // per piece
  RedBricks: 13,
  CeramicWallDado: 70,
  Windows: 350,
  InteriorPainting: 55,
  LivingDiningFlooring: 70,
  RoomsKitchenFlooring: 50,
  BalconyFlooring: 60,
  ParkingTiles: 60,
  StaircaseFlooring: 70,
  Electrical: 250,
  MainSinkFaucet: 2000,
  SanitarywareCPFittings: 5000,
  KitchenSink: 4000,
  MainDoor: 25000,
  InternalDoors: 8000,
  BathroomDoors: 4500,
  PoojaRoomDoor: 18000,
  WindowGrills: 195,
  OverheadTank: 8000,
  UndergroundSump: 100000,
  StaircaseRailing: 195,
  ExteriorPainting: 55,
  MirrorAccessories: 5000
};

// ---------- Multipliers ----------
const regionMultipliers = {
  Davengere: 1.0,
  Hassan: 1.05,
  Bangalore: 1.2,
  Chennai: 1.15,
};

const qualityMultipliers = {
  Basic: 1.0,
  Premium: 1.15,
  Classic: 1.25,
  Royale: 1.4,
};

// ---------- Realistic Quantity Formulas ----------
function calcQuantities(projectType, totalArea, floors = 1) {
  const floorMultiplier = floors > 1 ? (1 + (floors - 1) * 0.05) : 1;
  const steelMultiplier = floors > 1 ? (1 + (floors - 1) * 0.1) : 1;

  switch (projectType) {
    case "Villa":
      return {
        Cement: Math.round(totalArea * 0.4),
        Steel: Math.round(totalArea * 3.5),
        Sand: Math.round(totalArea * 0.8),
        Bricks: Math.round(totalArea * 7.5),
        InteriorPainting: Math.round(totalArea * 2.2), // walls + ceiling
        ExteriorPainting: Math.round(totalArea * 0.4), // external walls
        LivingDiningFlooring: Math.round(totalArea * 0.35), // 35% of total area
        RoomsKitchenFlooring: Math.round(totalArea * 0.55), // 55% of total area
        Electrical: Math.round(totalArea * 300), // complete wiring
        Plumbing: Math.round(totalArea * 250), // complete plumbing
        Windows: Math.round(totalArea * 0.18), // 18% window area
        MainDoor: 1, // main entrance
        InternalDoors: Math.round(totalArea / 180), // one door per 180 sqft
        BathroomDoors: Math.round(totalArea / 250), // one door per bathroom
        OverheadTank: Math.ceil(totalArea / 1000), // one tank per 1000 sqft
        UndergroundSump: 1, // one sump per villa
        StaircaseRailing: Math.round(totalArea * 0.08), // 8% of total area
        WindowGrills: Math.round(totalArea * 0.18), // same as window area
        MainSinkFaucet: Math.ceil(totalArea / 1000), // one per kitchen
        KitchenSink: Math.ceil(totalArea / 1000), // one per kitchen
        SanitarywareCPFittings: Math.ceil(totalArea / 350), // one set per bathroom
        MirrorAccessories: Math.ceil(totalArea / 350) // one set per bathroom
      };

    case "Apartment":
      return {
        Cement: Math.round(totalArea * 0.35 * floorMultiplier),
        Steel: Math.round(totalArea * 3 * steelMultiplier),
        Sand: Math.round(totalArea * 0.7),
        Bricks: Math.round(totalArea * 6),
        InteriorPainting: Math.round(totalArea * 2.0), // Interior walls + ceiling
        ExteriorPainting: Math.round(totalArea * 0.3), // External walls
        LivingDiningFlooring: Math.round(totalArea * 0.35), // Common areas + units
        RoomsKitchenFlooring: Math.round(totalArea * 0.55), // Bedrooms + kitchen
        Electrical: Math.round(totalArea * 350), // Complete wiring + common areas
        Plumbing: Math.round(totalArea * 300), // Complete plumbing + common areas
        Windows: Math.round(totalArea * 0.15), // Window area per unit
        MainDoor: Math.ceil(totalArea / 800), // One per apartment unit
        InternalDoors: Math.ceil(totalArea / 120), // More doors for apartment units
        BathroomDoors: Math.ceil(totalArea / 180), // One per bathroom
        OverheadTank: Math.ceil(totalArea / 1500), // Larger tanks for apartments
        UndergroundSump: Math.ceil(totalArea / 4000), // Bigger sump for apartment
        StaircaseRailing: Math.round(totalArea * 0.12), // Common staircases
        WindowGrills: Math.round(totalArea * 0.15), // Same as window area
        MainSinkFaucet: Math.ceil(totalArea / 400), // One per apartment
        KitchenSink: Math.ceil(totalArea / 400), // One per apartment
        SanitarywareCPFittings: Math.ceil(totalArea / 250), // Sets per bathroom
        MirrorAccessories: Math.ceil(totalArea / 250) // Sets per bathroom
      };

    case "Office":
      return {
        LivingDiningFlooring: Math.round(totalArea * 1.0), // Full floor coverage
        InteriorPainting: Math.round(totalArea * 2.2), // Walls + ceiling
        ExteriorPainting: Math.round(totalArea * 0.4), // External walls
        Electrical: Math.round(totalArea * 1.2), // Complete office wiring
        FalseCeiling: Math.round(totalArea * 0.95), // Almost full coverage
        GlassPartition: Math.round(totalArea * 0.4), // 40% partition area
        Windows: Math.round(totalArea * 0.25), // 25% window area
        MainDoor: Math.ceil(totalArea / 1000), // One main entrance per 1000 sqft
        InternalDoors: Math.ceil(totalArea / 200), // One door per 200 sqft
        OverheadTank: Math.ceil(totalArea / 2000), // Larger tanks for office
        UndergroundSump: Math.ceil(totalArea / 5000), // Bigger sump for office
        MainSinkFaucet: Math.ceil(totalArea / 500), // One per pantry/washroom
        SanitarywareCPFittings: Math.ceil(totalArea / 300) // Sets for washrooms
      };

    case "Mall":
      return {
        Cement: Math.round(totalArea * 0.5),
        Steel: Math.round(totalArea * 5),
        HVAC: Math.round(totalArea * 300),
        Electrical: Math.round(totalArea * 200),
        LivingDiningFlooring: Math.round(totalArea * 150),
        InteriorPainting: Math.round(totalArea * 20),
        ExteriorPainting: Math.round(totalArea * 10),
        Windows: Math.round(totalArea * 0.3),
        MainDoor: Math.round(totalArea / 5000),
        OverheadTank: Math.round(totalArea / 10000),
        UndergroundSump: Math.round(totalArea / 20000),
        MainSinkFaucet: Math.round(totalArea / 2000),
        SanitarywareCPFittings: Math.round(totalArea / 500)
      };

    case "Road":
      const areaSqm = totalArea / 10.764; // Convert sqft to sqm
      return {
        Bitumen: Math.round(areaSqm * 60 / 10),
        Aggregate: Math.round(areaSqm * 1.2 / 10 * 100) / 100,
        RoadCost: Math.round(areaSqm * 500)
      };

    default:
      return {};
  }
}

// ---------- Realistic Construction Cost Calculation ----------
function calculateEstimation({ projectType, area, floors, region, quality }) {
  const totalArea = area * floors;
  const regionFactor = regionMultipliers[region] || 1.0;
  const qualityFactor = qualityMultipliers[quality] || 1.0;

  // Realistic base rates per sqft for different project types
  const baseRatesPerSqft = {
    Villa: 1250,        // ₹1,250 per sqft base rate
    Apartment: 1100,    // ₹1,100 per sqft base rate  
    Office: 2000,       // ₹2,000 per sqft base rate
    Mall: 2800,         // ₹2,800 per sqft base rate
    Road: 500           // ₹500 per sqft base rate
  };

  const baseRate = baseRatesPerSqft[projectType] || 2500;
  
  // Calculate total cost with multipliers applied only once
  const totalCost = totalArea * baseRate * regionFactor * qualityFactor;
  const costPerSqft = totalCost / totalArea;

  // Generate realistic material breakdown based on total cost
  const quantities = calcQuantities(projectType, totalArea, floors);
  const costDetails = {};
  const materialGroups = {
    Structure: [],
    Finishing: [],
    Electrical: [],
    Plumbing: [],
    Doors: [],
    Others: []
  };

  // Calculate material costs as percentages of total cost
  const materialPercentages = {
    Villa: {
      Cement: 0.12, Steel: 0.15, Bricks: 0.08, Sand: 0.05,
      InteriorPainting: 0.08, ExteriorPainting: 0.03, LivingDiningFlooring: 0.10,
      RoomsKitchenFlooring: 0.12, Electrical: 0.08, Windows: 0.05,
      MainDoor: 0.02, InternalDoors: 0.03, BathroomDoors: 0.02,
      OverheadTank: 0.01, UndergroundSump: 0.02, StaircaseRailing: 0.01,
      MainSinkFaucet: 0.01, KitchenSink: 0.01, SanitarywareCPFittings: 0.03
    },
    Apartment: {
      Cement: 0.10, Steel: 0.12, Bricks: 0.07, Sand: 0.04,
      InteriorPainting: 0.07, ExteriorPainting: 0.02, LivingDiningFlooring: 0.12,
      RoomsKitchenFlooring: 0.15, Electrical: 0.10, Windows: 0.06,
      MainDoor: 0.01, InternalDoors: 0.04, BathroomDoors: 0.03,
      OverheadTank: 0.01, UndergroundSump: 0.02, StaircaseRailing: 0.02,
      MainSinkFaucet: 0.01, KitchenSink: 0.01, SanitarywareCPFittings: 0.04
    },
    Office: {
      LivingDiningFlooring: 0.20, InteriorPainting: 0.12, ExteriorPainting: 0.06,
      Electrical: 0.15, FalseCeiling: 0.10, GlassPartition: 0.12,
      Windows: 0.10, MainDoor: 0.03, InternalDoors: 0.05,
      OverheadTank: 0.02, UndergroundSump: 0.02, MainSinkFaucet: 0.01,
      SanitarywareCPFittings: 0.02
    },
    Mall: {
      Cement: 0.08, Steel: 0.10, HVAC: 0.20, Electrical: 0.12,
      LivingDiningFlooring: 0.15, InteriorPainting: 0.08, ExteriorPainting: 0.05,
      Windows: 0.10, MainDoor: 0.01, OverheadTank: 0.01,
      UndergroundSump: 0.01, MainSinkFaucet: 0.01, SanitarywareCPFittings: 0.02
    },
    Road: {
      Bitumen: 0.40, Aggregate: 0.30, RoadCost: 0.30
    }
  };

  const percentages = materialPercentages[projectType] || materialPercentages.Villa;

  for (const [item, qty] of Object.entries(quantities)) {
    const percentage = percentages[item] || 0;
    if (percentage === 0) continue;

    const materialCost = totalCost * percentage;
    const baseRate = basePrices[item];
    const adjustedRate = baseRate ? baseRate * regionFactor * qualityFactor : 0;
    const calculatedQty = baseRate ? Math.round(materialCost / adjustedRate) : qty;

    const unit = getUnitForMaterial(item);
    const detail = {
      material: item,
      qty: calculatedQty,
      unit: unit,
      baseRate: baseRate || 0,
      adjustedRate: Math.round(adjustedRate * 100) / 100,
      subtotal: Math.round(materialCost * 100) / 100
    };

    costDetails[item] = detail;
    
    // Group materials for better organization
    if (['Cement', 'Steel', 'Sand', 'Bricks', 'RedBricks'].includes(item)) {
      materialGroups.Structure.push(detail);
    } else if (['InteriorPainting', 'ExteriorPainting', 'LivingDiningFlooring', 'RoomsKitchenFlooring', 'BalconyFlooring', 'ParkingTiles', 'StaircaseFlooring', 'CeramicWallDado'].includes(item)) {
      materialGroups.Finishing.push(detail);
    } else if (['Electrical', 'Windows', 'WindowGrills'].includes(item)) {
      materialGroups.Electrical.push(detail);
    } else if (['MainSinkFaucet', 'SanitarywareCPFittings', 'KitchenSink', 'OverheadTank', 'UndergroundSump'].includes(item)) {
      materialGroups.Plumbing.push(detail);
    } else if (['MainDoor', 'InternalDoors', 'BathroomDoors', 'PoojaRoomDoor'].includes(item)) {
      materialGroups.Doors.push(detail);
    } else {
      materialGroups.Others.push(detail);
    }
  }

  return {
    totalArea,
    floors,
    regionFactor,
    qualityFactor,
    costDetails,
    materialGroups,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerSqft: Math.round(costPerSqft * 100) / 100,
    projectType
  };
}

// Helper function to get units for materials
function getUnitForMaterial(material) {
  const unitMap = {
    Cement: 'bags',
    Steel: 'kg',
    Sand: 'cft',
    Bricks: 'pcs',
    RedBricks: 'pcs',
    Bitumen: 'kg',
    Aggregate: 'tons',
    InteriorPainting: 'sqft',
    ExteriorPainting: 'sqft',
    LivingDiningFlooring: 'sqft',
    RoomsKitchenFlooring: 'sqft',
    BalconyFlooring: 'sqft',
    ParkingTiles: 'sqft',
    StaircaseFlooring: 'sqft',
    CeramicWallDado: 'sqft',
    Electrical: 'sqft',
    Windows: 'sqft',
    WindowGrills: 'sqft',
    FalseCeiling: 'sqft',
    GlassPartition: 'sqft',
    HVAC: 'sqft',
    Plumbing: 'sqft',
    StaircaseRailing: 'sqft',
    MainDoor: 'nos',
    InternalDoors: 'nos',
    BathroomDoors: 'nos',
    PoojaRoomDoor: 'nos',
    MainSinkFaucet: 'nos',
    KitchenSink: 'nos',
    SanitarywareCPFittings: 'nos',
    OverheadTank: 'nos',
    UndergroundSump: 'nos',
    MirrorAccessories: 'nos',
    RoadCost: 'sqm'
  };
  return unitMap[material] || 'nos';
}

export default function App() {
  // State declarations
  const [step, setStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [estimate, setEstimate] = useState(null)
  const [quantityPreset, setQuantityPreset] = useState('Custom')
  
  // Preset sqft mappings
  const presetSqftMap = useMemo(() => ({
    '2BHK': 900,
    '3BHK': 1200,
    '4BHK': 1500,
    '1200': 1200
  }), [])

  // Area calculation helpers
  const getActiveSqft = useCallback((fallbackSqft) => {
    if (quantityPreset && quantityPreset !== 'Custom') {
      const presetVal = presetSqftMap[quantityPreset]
      if (presetVal) return presetVal
      if (quantityPreset === '1200') return 1200
    }
    return fallbackSqft
  }, [quantityPreset, presetSqftMap])

  const projectTypes = useMemo(() => ([
    { key: 'villa', title: 'Villa', icon: 'bi-house', desc: 'Single-family residential building', tags: ['Foundation', 'Structure', 'Finishing'], available: true },
    { key: 'apartment', title: 'Apartment', icon: 'bi-building', desc: 'Multi-unit residential building', tags: ['Multi-story', 'Common Areas', 'Parking'], available: false },
    { key: 'office', title: 'Office', icon: 'bi-briefcase', desc: 'Commercial office building', tags: ['Open Plan', 'AC Systems', 'Elevators'], available: false },
    { key: 'mall', title: 'Mall', icon: 'bi-cart', desc: 'Shopping complex construction', tags: ['Large Spaces', 'Parking', 'Food Court'], available: false },
    { key: 'road', title: 'Road', icon: 'bi-sign-turn-right', desc: 'Road and infrastructure', tags: ['Asphalt', 'Drainage', 'Signage'], available: false },
    { key: 'renovation', title: 'Renovation', icon: 'bi-hammer', desc: 'Existing structure renovation', tags: ['Partial Work', 'Upgrades', 'Modernization'], available: false }
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

  // Get project area helper - defined after form states
  const getProjectArea = useCallback(() => {
    if (selectedProject === 'villa') return getActiveSqft(Number(villaForm.area || 0))
    if (selectedProject === 'apartment') return getActiveSqft(Number(apartmentForm.totalArea || 0))
    if (selectedProject === 'office') return getActiveSqft(Number(officeForm.area || 0))
    if (selectedProject === 'mall') return getActiveSqft(Number(mallForm.totalArea || 0))
    if (selectedProject === 'renovation') return getActiveSqft(Number(renoForm.area || 0))
    return 0
  }, [selectedProject, villaForm.area, apartmentForm.totalArea, officeForm.area, mallForm.totalArea, renoForm.area, getActiveSqft])

  // Auto-calculation effect with dynamic updates
  useEffect(() => {
    if (selectedProject) {
      let projectData = null;
      const currentArea = getProjectArea(); // Get the current project area
      
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
          quality: 'Premium' // Default for office
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
          projectType: 'Office', // Use Office calculation for renovation
          area: currentArea,
          floors: Number(renoForm.floorsAffected),
          region: renoForm.region,
          quality: 'Premium' // Default for renovation
        };
      } else if (selectedProject === 'road' && roadForm.lengthKm && roadForm.widthM && roadForm.region) {
        const roadArea = Number(roadForm.lengthKm) * Number(roadForm.widthM) * 10.764; // Convert to sqft
        projectData = {
          projectType: 'Road',
          area: roadArea,
          floors: 1,
          region: roadForm.region,
          quality: 'Basic' // Default for road
        };
      }
      
      if (projectData && projectData.area > 0) {
        const result = calculateEstimation(projectData);
        setEstimate(result);
      } else {
        setEstimate(null);
      }
    } else {
      setEstimate(null);
    }
  }, [selectedProject, villaForm, apartmentForm, officeForm, mallForm, roadForm, renoForm, getProjectArea, quantityPreset]);

  // Specifications selections
  const [specSelections, setSpecSelections] = useState({})
  const [specQuantities, setSpecQuantities] = useState({})
  const [packageTier, setPackageTier] = useState('Custom') // Basic | Standard | Premium | Royal | Custom

  const specTable = useMemo(() => ({
    // Construction Materials
    'Cement': { Basic: '₹370/bag', Standard: '₹380/bag', Premium: '₹420/bag', Royal: '₹450/bag' },
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
    
    'Electrical Wiring': { Basic: 'Finolex silver FR or equivalent', Standard: 'Finolex silver FR or equivalent', Premium: 'Finolex silver FR or equivalent', Royal: 'Finolex silver FR or equivalent' },
    'Switches & Sockets': { Basic: 'Anchor or equivalent', Standard: 'GM or equivalent', Premium: 'Legrand Mylinc', Royal: 'Legrand Myrius / Schneider Unica Pure' },
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
        {/* Header */}
        <div className="text-center mb-4 mb-md-5">
          <h1 className="fw-bold">BuilderBro Cost Estimator</h1>
          <p className="text-secondary mb-0">Professional construction cost estimation tool for architects and engineers</p>
        </div>

        {/* Stepper */}
        <Row className="g-3 justify-content-center mb-4 mb-md-5">
          <Col xs={6} md={3}>
            <StepBadge number={1} label="Project Type" active={step === 1} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={2} label="Auto Estimate" active={step === 2} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={3} label="Specifications" active={step === 3} />
          </Col>
          <Col xs={6} md={3}>
            <StepBadge number={4} label="Estimator Summary" active={step === 4} />
          </Col>
        </Row>

        {step === 1 && (
          <>
            {/* Project type selection (Client only) */}
            <div className="text-center mb-3 mb-md-4">
              <h3 className="fw-semibold">Project Type</h3>
            </div>

            <Row className="g-4 align-items-stretch">
              <Col md={6}>
                <Card className="h-100 shadow rounded p-3 card-hover cursor-pointer" onClick={() => {
                  // Prefill defaults for Client flow
                  setQuantityPreset('1200')
                  setVillaForm(prev => ({
                    ...prev,
                    area: prev.area || 1200,
                    unit: prev.unit || 'sq.ft',
                    bedrooms: prev.bedrooms || 1
                  }))
                  proceedFromRole()
                }}>
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
                  <Card 
                    className={`h-100 shadow-sm rounded p-3 border position-relative ${
                      p.available 
                        ? 'card-hover cursor-pointer' 
                        : 'opacity-75'
                    }`} 
                    onClick={p.available ? () => openProjectModal(p.key) : undefined}
                    style={{ 
                      cursor: p.available ? 'pointer' : 'not-allowed',
                      filter: p.available ? 'none' : 'grayscale(0.3)'
                    }}
                  >
                    {!p.available && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded">
                        <div className="text-center text-white">
                          <i className="bi bi-clock-history display-4 mb-2"></i>
                          <div className="fw-bold">Coming Soon</div>
                          <small>This project type will be available soon</small>
                        </div>
                      </div>
                    )}
                    <Card.Body className="d-flex flex-column align-items-center text-center">
                      <i className={`bi ${p.icon} display-6 mb-2 ${p.available ? 'text-primary' : 'text-muted'}`}></i>
                      <Card.Title className="h4">{p.title}</Card.Title>
                      <Card.Subtitle className="text-muted mb-3 small">{p.desc}</Card.Subtitle>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {p.tags.map((t, idx) => (
                          <span key={idx} className={`badge ${p.available ? 'bg-secondary-subtle text-secondary-emphasis' : 'bg-light text-muted'} border`}>{t}</span>
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
              <Button variant="secondary" className="rounded" onClick={() => setStep(2)}>Back</Button>
              <Button variant="primary" size="lg" className="rounded" onClick={() => setStep(4)}>
                Next: Estimator Summary
              </Button>
            </div>
          </>
        )}

        {/* Auto-Calculation Display (kept visible in Steps 2 and 4) */}
        {!showModal && selectedProject && estimate && (step === 2 || step === 4) && (
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
                    {step === 4 ? (
                      <>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => setStep(3)}
                        >
                          <i className="bi bi-arrow-left me-1"></i>
                          Back to Specifications
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => window.print()}
                        >
                          <i className="bi bi-download me-1"></i>
                          Download Report
                        </Button>
                      </>
                    ) : step === 2 ? (
                      <>
                        <Button 
                          variant="outline-light"
                          size="sm"
                          onClick={() => setStep(3)}
                        >
                          Next: Specifications
                        </Button>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => window.print()}
                        >
                          <i className="bi bi-download me-1"></i>
                          Download PDF
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
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
                      {[
                        ['Basic', 'Basic @ ₹1,950/sq.ft'],
                        ['Standard', 'Standard @ ₹2,100/sq.ft'],
                        ['Luxury', 'Luxury @ ₹2,200/sq.ft'],
                        ['Royal', 'Royal @ ₹2,600/sq.ft']
                      ].map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={villaForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['Hassan','Bangalore','Davengere','Chennai'].map(r => (
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
                      {[
                        ['Basic', 'Basic @ ₹1,950/sq.ft'],
                        ['Standard', 'Standard @ ₹2,100/sq.ft'],
                        ['Luxury', 'Luxury @ ₹2,200/sq.ft'],
                        ['Royal', 'Royal @ ₹2,600/sq.ft']
                      ].map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={apartmentForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['Hassan','Bangalore','Davengere','Chennai'].map(r => (
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
                      {['Hassan','Bangalore','Davengere','Chennai'].map(r => (
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
                      {[
                        ['Basic', 'Basic @ ₹1,950/sq.ft'],
                        ['Standard', 'Standard @ ₹2,100/sq.ft'],
                        ['Luxury', 'Luxury @ ₹2,200/sq.ft'],
                        ['Royal', 'Royal @ ₹2,600/sq.ft']
                      ].map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={mallForm.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                      <option value="">Select Region</option>
                      {['Hassan','Bangalore','Davengere','Chennai'].map(r => (
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
                      {['Hassan','Bangalore','Davengere','Chennai'].map(r => (
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
                      {['Hassan','Bangalore','Davengere','Chennai'].map(r => (
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