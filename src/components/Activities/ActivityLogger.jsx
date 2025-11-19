import { useState } from 'react'
import TransportForm from './TransportForm'
import MealForm from './MealForm'
import WasteForm from './WasteForm'
import EnergyForm from './EnergyForm'

export default function ActivityLogger({ user, onActivityLogged }) {
  const [activeTab, setActiveTab] = useState('transport')
  
  const tabs = [
    { id: 'transport', label: '🚗 Transport', component: TransportForm },
    { id: 'meal', label: '🍽️ Meals', component: MealForm },
    { id: 'waste', label: '🗑️ Waste', component: WasteForm },
    { id: 'energy', label: '⚡ Energy', component: EnergyForm }
  ]

  const ActiveForm = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div style={{ width: '100%', maxWidth: '100%', padding: '0 8px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Log New Activity
      </h2>
      
      {/* 4 Tabs - Simple Flex Layout */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        marginBottom: '1.5rem',
        width: '100%',
        flexWrap: 'wrap'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: '1 1 calc(25% - 6px)',
              minWidth: '80px',
              padding: '10px 6px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              background: activeTab === tab.id ? '#16a34a' : 'white',
              color: activeTab === tab.id ? 'white' : '#4b5563',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div style={{ width: '100%' }}>
        {ActiveForm && (
          <ActiveForm user={user} onActivityLogged={onActivityLogged} />
        )}
      </div>
    </div>
  )
}