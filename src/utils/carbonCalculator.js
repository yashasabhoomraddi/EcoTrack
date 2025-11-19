export const carbonFactors = {
  transport: { 
    car: 0.21, 
    bus: 0.08, 
    bike: 0, 
    walk: 0,
    train: 0.05
  },
  meals: { 
    red_meat: 5.0, 
    chicken: 3.0, 
    plant_based: 1.0,
    processed: 2.5
  },
  energy: { 
    electricity_kwh: 0.5,
    natural_gas_kwh: 0.2,
    water_litres: 0.0003
  },
  waste: { 
    general_kg: 0.5,
    plastic_kg: 2.0,
    paper_kg: 0.8,
    organic_kg: 0.3
  }
}

export const calculateCarbon = (type, data) => {
  if (type === 'transport') return data.distance * (carbonFactors.transport[data.mode] || 0)
  if (type === 'meal') return (carbonFactors.meals[data.foodType] || 0) * (data.quantity || 1)
  if (type === 'energy') return data.usage * (carbonFactors.energy[data.energyType] || 0)
  if (type === 'waste') return data.amount * (carbonFactors.waste[data.wasteType] || 0)
  return 0
}