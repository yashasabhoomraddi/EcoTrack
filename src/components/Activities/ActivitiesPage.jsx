import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabaseClient'
import ActivityLogger from './ActivityLogger'

export default function ActivitiesPage({ user, onActivityLogged }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (!error) setActivities(data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user?.id) {
      fetchActivities()
    }
  }, [user])

  const handleActivityLogged = () => {
    fetchActivities()
    if (onActivityLogged) onActivityLogged()
  }

  // Get appropriate icon for each activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'transport':
        return '🚗'
      case 'meal':
        return '🍽️'
      case 'waste':
        return '🗑️'
      case 'energy':
        return '⚡'
      default:
        return '🌱'
    }
  }

  // Get display text for activity
  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'transport':
        return `${activity.data?.mode || 'Transport'} - ${activity.data?.distance || 0} km`
      case 'meal':
        return `${activity.data?.foodType || 'Meal'} - ${activity.data?.quantity || 1} serving(s)`
      case 'waste':
        return `${activity.data?.wasteType || 'Waste'} - ${activity.data?.amount || 0} kg`
      case 'energy':
        return `${activity.data?.energyType || 'Energy'} - ${activity.data?.usage || 0} units`
      default:
        return 'Activity'
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading activities...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Activity Tracker</h1>
        <p className="text-lg text-gray-600">Log your daily activities and track your carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Activity Logger */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sticky top-24">
            <ActivityLogger user={user} onActivityLogged={handleActivityLogged} />
          </div>
        </div>

        {/* Activity History */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity History</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg">
                        {getActivityIcon(activity.type)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg capitalize">
                        {activity.type}: {getActivityText(activity)}
                      </p>
                      <p className="text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString()} • 
                        {new Date(activity.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-red-600 text-lg">
                    {activity.carbon_kg?.toFixed(2)} kg CO₂
                  </span>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl mb-2">No activities logged yet</p>
                  <p className="text-lg">Start logging activities to see your carbon footprint!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}