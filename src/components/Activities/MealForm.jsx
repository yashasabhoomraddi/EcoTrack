import { useState } from 'react'
import { calculateCarbon } from '../../utils/carbonCalculator'
import { supabase } from '../../supabaseClient'

export default function MealForm({ user }) {
  const [foodType, setFoodType] = useState('meat')
  const [quantity, setQuantity] = useState('1')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const carbon = calculateCarbon('meal', { foodType, quantity: parseInt(quantity) })
    const { error } = await supabase.from('activities').insert([
      { user_id: user.id, type: 'meal', data: { foodType, quantity }, carbon_kg: carbon }
    ])
    if (!error) {
      alert('Meal activity logged!')
      setQuantity('1')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <h3>Log Meal</h3>
      <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
        <option value="meat">Meat</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
      </select>
      <input 
        type="number" 
        placeholder="Quantity" 
        value={quantity} 
        onChange={(e) => setQuantity(e.target.value)} 
        required 
      />
      <button type="submit" disabled={loading}>Log Meal</button>
    </form>
  )
}