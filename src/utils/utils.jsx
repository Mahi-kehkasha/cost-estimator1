import { basePrices, regionMultipliers, qualityMultipliers } from '../data/constants';

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
        LivingDiningFlooring: Math.round(totalArea * 150),
        InteriorPainting: Math.round(totalArea * 25),
        ExteriorPainting: Math.round(totalArea * 5),
        Electrical: Math.round(totalArea * 180),
        FalseCeiling: Math.round(totalArea * 90),
        GlassPartition: Math.round(totalArea * 100),
        Windows: Math.round(totalArea * 0.2),
        MainDoor: Math.round(totalArea / 2000),
        InternalDoors: Math.round(totalArea / 500),
        OverheadTank: Math.round(totalArea / 5000),
        UndergroundSump: Math.round(totalArea / 10000),
        MainSinkFaucet: Math.round(totalArea / 1000),
        SanitarywareCPFittings: Math.round(totalArea / 200)
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
      LivingDiningFlooring: 0.25, InteriorPainting: 0.10, ExteriorPainting: 0.05,
      Electrical: 0.15, FalseCeiling: 0.12, GlassPartition: 0.15,
      Windows: 0.08, MainDoor: 0.02, InternalDoors: 0.03,
      OverheadTank: 0.01, UndergroundSump: 0.01, MainSinkFaucet: 0.01,
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

export { calculateEstimation };