import { useState } from 'react'
import { calculateCarbon } from '../../utils/carbonCalculator'
import { supabase } from '../../supabaseClient'

export default function WasteForm({ user, onActivityLogged }) {
  const [wasteType, setWasteType] = useState('general_kg')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const activityData = {
      wasteType,
      amount: parseFloat(amount)
    }
    
    const carbon = calculateCarbon('waste', activityData)
    
    const { error } = await supabase.from('activities').insert([
      { 
        user_id: user.id, 
        type: 'waste', 
        data: activityData, 
        carbon_kg: carbon,
        category: 'Waste'
      }
    ])
    
    if (!error) {
      // Clear the form
      setAmount('')
      setWasteType('general_kg')
      
      // Show success message
      alert('Waste activity logged successfully! 🗑️')
      
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
      <h3 className="text-lg font-semibold text-gray-800">Log Waste Generation</h3>
      
      <div>
        <label htmlFor="wasteType" className="block text-sm font-medium text-gray-700 mb-1">
          Waste Type
        </label>
        <select 
          id="wasteType"
          value={wasteType} 
          onChange={(e) => setWasteType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="general_kg">General Waste (kg)</option>
          <option value="plastic_kg">Plastic (kg)</option>
          <option value="paper_kg">Paper/Cardboard (kg)</option>
          <option value="organic_kg">Organic Waste (kg)</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (kg)
        </label>
        <input 
          id="amount"
          type="number" 
          placeholder="Amount in kilograms" 
          min="0.1"
          step="0.1"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Waste'}
      </button>
    </form>
  )
}