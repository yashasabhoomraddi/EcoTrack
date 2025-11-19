import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabaseClient'
import PersonalizedInsight from './PersonalizedInsight'

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
  
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
  
  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Carbon Footprint</h3>
          <p className="text-4xl font-bold text-green-600">{totalCarbon.toFixed(2)} kg CO₂</p>
          <p className="text-sm text-gray-500 mt-2">Equivalent to {Math.round(totalCarbon / 21)} trees needed to offset</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Activities Logged</h3>
          <p className="text-4xl font-bold text-blue-600">{activities.length}</p>
          <p className="text-sm text-gray-500 mt-2">Keep tracking to see your impact</p>
        </div>
      </motion.div>

      {/* Quick Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PersonalizedInsight activities={activities} />
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-green-100 p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">🌱</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 capitalize">
                    {activity.type}: {activity.data?.mode || activity.data?.foodType || 'Activity'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-red-600">
                {activity.carbon_kg.toFixed(2)} kg CO₂
              </span>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No activities logged yet.</p>
              <p className="text-sm">Start logging activities to see your carbon footprint!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}