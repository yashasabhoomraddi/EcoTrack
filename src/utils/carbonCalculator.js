export const carbonFactors = {
  transport: { car: 0.21, bus: 0.08, bike: 0, walk: 0 },
  meals: { meat: 5.0, vegetarian: 2.5, vegan: 1.0 },
  energy: { electricity: 0.5, water: 0.3 },
  waste: { plastic: 2.0, general: 0.5 }
}

export const calculateCarbon = (type, data) => {
  if (type === 'transport') return data.distance * (carbonFactors.transport[data.mode] || 0)
  if (type === 'meal') return carbonFactors.meals[data.foodType] || 0
  if (type === 'energy') return data.usage * (carbonFactors.energy[data.energyType] || 0)
  if (type === 'waste') return data.amount * (carbonFactors.waste[data.wasteType] || 0)
  return 0
}