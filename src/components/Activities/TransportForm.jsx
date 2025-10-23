import { useState } from 'react'
import { calculateCarbon } from '../../utils/carbonCalculator'
import { supabase } from '../../supabaseClient'

export default function TransportForm({ user }) {
  const [mode, setMode] = useState('car')
  const [distance, setDistance] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const carbon = calculateCarbon('transport', { mode, distance: parseFloat(distance) })
    const { error } = await supabase.from('activities').insert([
      { user_id: user.id, type: 'transport', data: { mode, distance }, carbon_kg: carbon }
    ])
    if (!error) {
      alert('Transport activity logged!')
      setDistance('')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <h3>Log Transport</h3>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="car">Car</option>
        <option value="bus">Bus</option>
        <option value="bike">Bike</option>
        <option value="walk">Walk</option>
      </select>
      <input 
        type="number" 
        placeholder="Distance (km)" 
        value={distance} 
        onChange={(e) => setDistance(e.target.value)} 
        required 
      />
      <button type="submit" disabled={loading}>Log Activity</button>
    </form>
  )
}