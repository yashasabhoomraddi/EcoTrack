import { useState } from 'react'
import { calculateCarbon } from '../../utils/carbonCalculator'
import { supabase } from '../../supabaseClient'

export default function EnergyForm({ user, onActivityLogged }) {
  const [energyType, setEnergyType] = useState('electricity_kwh')
  const [usage, setUsage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const activityData = {
      energyType,
      usage: parseFloat(usage)
    }
    
    const carbon = calculateCarbon('energy', activityData)
    
    const { error } = await supabase.from('activities').insert([
      { 
        user_id: user.id, 
        type: 'energy', 
        data: activityData, 
        carbon_kg: carbon,
        category: 'Energy'
      }
    ])
    
    if (!error) {
      // Clear the form
      setUsage('')
      setEnergyType('electricity_kwh')
      
      // Show success message
      alert('Energy activity logged successfully! ⚡')
      
      // Refresh the activities list
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
      <h3 className="text-lg font-semibold text-gray-800">Log Energy Consumption</h3>
      
      <div>
        <label htmlFor="energyType" className="block text-sm font-medium text-gray-700 mb-1">
          Energy Type
        </label>
        <select 
          id="energyType"
          value={energyType} 
          onChange={(e) => setEnergyType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="electricity_kwh">Electricity (kWh)</option>
          <option value="natural_gas_kwh">Natural Gas (kWh)</option>
          <option value="water_litres">Water (Litres)</option>
        </select>
      </div>

      <div>
        <label htmlFor="usage" className="block text-sm font-medium text-gray-700 mb-1">
          Usage Amount
        </label>
        <input 
          id="usage"
          type="number" 
          placeholder="Usage amount (kWh or Litres)" 
          min="1"
          step="0.1"
          value={usage} 
          onChange={(e) => setUsage(e.target.value)} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Energy'}
      </button>
    </form>
  )
}