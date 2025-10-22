
export const basePrices = {
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

export const regionMultipliers = {
  Davengere: 1.0,
  Hassan: 1.05,
  Bangalore: 1.2,
  Chennai: 1.15,
};

export const qualityMultipliers = {
  Basic: 1.0,
  Premium: 1.15,
  Classic: 1.25,
  Royale: 1.4,
};

export const detailedPrices = {
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
}

export const constructionPackages = [
  ['Basic', 'Basic @ ₹1,950/sq.ft'],
  ['Standard', 'Standard @ ₹2,100/sq.ft'],
  ['Luxury', 'Luxury @ ₹2,200/sq.ft'],
  ['Royal', 'Royal @ ₹2,600/sq.ft']
];

export const villaTypes = ['Single Villa', 'Duplex', 'Multi-Duplex'];
export const regions = ['Hassan', 'Bangalore', 'Davengere', 'Chennai']; 
export const initialVillaForm = {
  type: villaTypes[0],
  area: 1200,
  unit: 'sq.ft',
  floors: 1,
  bedrooms: 2,
  bathrooms: 2,
  quality: constructionPackages[0],
  region: regions[0],
};



export const initialApartmentForm = {
  totalArea: '',
  units: '',
  floors: '',
  common: { parking: false, garden: false, gym: false, play: false },
  quality: '',
  region: ''
};

export const initialOfficeForm = {
  area: '',
  floors: '',
  layout: '',
  ac: '',
  elevators: '',
  region: ''
};

export const initialMallForm = {
  totalArea: '',
  floors: '',
  parkingCapacity: '',
  foodCourt: false,
  largeSpaces: false,
  quality: '',
  region: ''
};

export const initialRoadForm = {
  lengthKm: '',
  widthM: '',
  pavement: '',
  drainage: false,
  signage: false,
  region: ''
};

export const initialRenovationForm = {
  type: '',
  area: '',
  floorsAffected: '',
  rooms: [],
  ageYears: '',
  region: ''
}

export const presetSqftMap = {
  '2BHK': 900,
  '3BHK': 1200,
  '4BHK': 1500,
  '1200': 1200
}

export const projectTypeData = [
    { iconLock:'bi-lock', show:true,key: 'VILLA', title: 'Independent House', icon: 'bi-house', desc: ' residential building', tags: ['Foundation', 'Structure', 'Finishing'] },
    { iconLock:'bi-lock',show:false,key: 'APARTMENT', title: 'Apartment', icon: 'bi-building', desc: 'Multi-unit residential building', tags: ['Multi-story', 'Common Areas', 'Parking'] },
    { iconLock:'bi-lock',show:false,key: 'OFFICE', title: 'Office', icon: 'bi-briefcase', desc: 'Commercial office building', tags: ['Open Plan', 'AC Systems', 'Elevators'] },
    { iconLock:'bi-lock',show:false,key: 'MALL', title: 'Mall', icon: 'bi-cart', desc: 'Shopping complex construction', tags: ['Large Spaces', 'Parking', 'Food Court'] },
    { iconLock:'bi-lock',show:false,key: 'road', title: 'Road', icon: 'bi-sign-turn-right', desc: 'Road and infrastructure', tags: ['Asphalt', 'Drainage', 'Signage'] },
    { iconLock:'bi-lock',show:false,key: 'renovation', title: 'Renovation', icon: 'bi-hammer', desc: 'Existing structure renovation', tags: ['Partial Work', 'Upgrades', 'Modernization'] }
  ];

