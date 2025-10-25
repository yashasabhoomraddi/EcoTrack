import { useState } from 'react'
import TransportForm from './TransportForm'
import MealForm from './MealForm'

export default function ActivityLogger({ user }) {
  const [activeTab, setActiveTab] = useState('transport')
  
  return (
    <div className="activity-logger">
      <h2>Log New Activity</h2>
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('transport')} 
          className={activeTab === 'transport' ? 'active' : ''}
        >
          Transport
        </button>
        <button 
          onClick={() => setActiveTab('meal')} 
          className={activeTab === 'meal' ? 'active' : ''}
        >
          Meals
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'transport' && <TransportForm user={user} />}
        {activeTab === 'meal' && <MealForm user={user} />}
      </div>
    </div>
  )
}