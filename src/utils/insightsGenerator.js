// utils/insightsGenerator.js

/**
 * Analyzes all user activities and returns a personalized insight.
 * @param {Array} activities - Array of user's logged activities. 
 * (e.g., [{ category: 'Transport', carbon_kg: 2.5 }, { category: 'Meals', carbon_kg: 5.1 }])
 * @returns {String} A personalized, actionable string.
 */
export function getPersonalizedInsight(activities) {
  if (!activities || activities.length === 0) {
    return "Start logging activities to get personalized insights!";
  }

  // 1. Tally up the total CO2 for each main category
  const totals = activities.reduce((acc, activity) => {
    const category = activity.category || 'Other'; // 'Transport', 'Meals', etc.
    
    // ⬇️ THIS IS THE CORRECTED LINE ⬇️
    const co2 = activity.carbon_kg || 0;
    // ⬆️ THIS WAS activity.co2 ⬆️
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += co2;
    return acc;
  }, {});

  // 2. Find the category with the highest CO2 impact
  let worstCategory = 'None';
  let maxCo2 = 0;

  for (const [category, totalCo2] of Object.entries(totals)) {
    if (totalCo2 > maxCo2) {
      maxCo2 = totalCo2;
      worstCategory = category;
    }
  }

  // 3. Return a specific, actionable insight
  switch (worstCategory) {
    case 'Transport':
      return "Your biggest impact is from Transport. Try swapping one car trip for a bus or train ride this week to see a difference!";
    case 'Meals':
      return "Meals are your top source of emissions. Swapping just two 'Red Meat' meals for 'Plant-Based' could cut your food footprint significantly.";
    case 'Energy':
      return "Energy use is your high-impact area. Try unplugging electronics when not in use or switching to LED bulbs.";
    case 'Waste':
      return "Waste is your biggest category. Focusing on composting and reducing single-use plastics can make a big dent!";
    default:
      // This will now only show if all logged CO2 is 0
      return "You're doing great! Keep logging to track your progress and find new ways to save.";
  }
}