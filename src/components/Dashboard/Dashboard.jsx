import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Charts from './Charts'  // ⬅️ ADD THIS

export default function Dashboard({ user }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchActivities()
  }, [user])
  
  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setActivities(data)
    setLoading(false)
  }
  
  const totalCarbon = activities.reduce((sum, activity) => sum + (activity.carbon_kg || 0), 0)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div className="dashboard">
      <h2>Your Carbon Footprint</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Carbon</h3>
          <p>{totalCarbon.toFixed(2)} kg CO₂</p>
        </div>
        <div className="stat-card">
          <h3>Activities</h3>
          <p>{activities.length} logged</p>
        </div>
      </div>

      {/* ⬅️ ADD THIS */}
      {activities.length > 0 && <Charts activities={activities} />}

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {activities.slice(0, 5).map(activity => (
          <div key={activity.id} className="activity-item">
            <span>{activity.type}: {activity.data.mode || activity.data.foodType}</span>
            <span>{activity.carbon_kg} kg CO₂</span>
          </div>
        ))}
      </div>
    </div>
  )
}