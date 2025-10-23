export const initialVillaForm = {
    type: 'Single Villa',
    area: 1200,
    unit: 'sq.ft',
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    quality: 'Basic',
    region: 'Hassan',
  };
  
  export const initialApartmentForm = {
    totalArea: '',
    units: '',
    floors: '',
    common: { parking: false, garden: false, gym: false, play: false },
    quality: '',
    region: '',
  };
  
  export const initialOfficeForm = {
    area: '',
    floors: '',
    layout: '',
    ac: '',
    elevators: '',
    region: '',
  };
  
  export const initialMallForm = {
    totalArea: '',
    floors: '',
    parkingCapacity: '',
    foodCourt: false,
    largeSpaces: false,
    quality: '',
    region: '',
  };
  
  export const initialRoadForm = {
    lengthKm: '',
    widthM: '',
    pavement: '',
    drainage: false,
    signage: false,
    region: '',
  };
  
  export const initialRenovationForm = {
    type: '',
    area: '',
    floorsAffected: '',
    rooms: [],
    ageYears: '',
    region: '',
  };