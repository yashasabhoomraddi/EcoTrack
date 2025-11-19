// components/Activities/TransportForm.jsx
import { useState } from 'react'
import { calculateCarbon } from '../../utils/carbonCalculator'
import { supabase } from '../../supabaseClient'

export default function TransportForm({ user, onActivityLogged }) {
  const [mode, setMode] = useState('car')
  const [distance, setDistance] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const activityData = {
      mode,
      distance: parseFloat(distance)
    }
    
    const carbon = calculateCarbon('transport', activityData)
    
    const { error } = await supabase.from('activities').insert([
      { 
        user_id: user.id, 
        type: 'transport', 
        data: activityData, 
        carbon_kg: carbon,
        category: 'Transport'
      }
    ])
    
    if (!error) {
      // Clear the form
      setDistance('')
      setMode('car')
      
      // Show success message
      alert('Transport activity logged successfully! 🚗')
      
      // Refresh the activities list (FIXED PART)
      if (onActivityLogged) {
        onActivityLogged()
      }
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Log Transport</h3>
      
      <div>
        <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
          Mode of Transport
        </label>
        <select 
          id="mode"
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="bike">Bike</option>
          <option value="walk">Walk</option>
        </select>
      </div>

      <div>
        <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
          Distance (km)
        </label>
        <input 
          id="distance"
          type="number" 
          placeholder="Distance in km" 
          min="0"
          step="0.1"
          value={distance} 
          onChange={(e) => setDistance(e.target.value)} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Activity'}
      </button>
    </form>
  )
}