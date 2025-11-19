// components/Activities/MealForm.jsx
import { useState } from 'react'
// Make sure this path is correct for your carbonCalculator
import { calculateCarbon } from '../../utils/carbonCalculator' 
import { supabase } from '../../supabaseClient'

export default function MealForm({ user, onActivityLogged }) {
  // Updated states to match emissionFactors.json
  const [foodType, setFoodType] = useState('red_meat')
  const [quantity, setQuantity] = useState('1')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const activityData = {
      foodType,
      quantity: parseInt(quantity)
    }

    // This utility function needs to exist and match these keys
    const carbon = calculateCarbon('meals', activityData) 
    
    const { error } = await supabase.from('activities').insert([
      { 
        user_id: user.id, 
        type: 'meal', 
        data: activityData, 
        carbon_kg: carbon,
        category: 'Meals' // ⬅️ THIS IS THE FIX
      }
    ])
    
    if (!error) {
      // alert('Meal activity logged!') // Replaced alert with callback
      setQuantity('1')
      setFoodType('red_meat')
      if (onActivityLogged) onActivityLogged() // Optional: refresh dashboard
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Log Meal</h3>
      
      <div>
        <label htmlFor="foodType" className="block text-sm font-medium text-gray-700 mb-1">
          Food Type
        </label>
        <select 
          id="foodType"
          value={foodType} 
          onChange={(e) => setFoodType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="red_meat">Red Meat</option>
          <option value="chicken">Chicken</option>
          <option value="plant_based">Plant-Based</option>
          <option value="processed">Processed</option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Servings
        </label>
        <input 
          id="quantity"
          type="number" 
          placeholder="Number of servings" 
          min="1"
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Meal'}
      </button>
    </form>
  )
}