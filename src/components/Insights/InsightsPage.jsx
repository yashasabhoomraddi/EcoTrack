import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../supabaseClient'
import Charts from '../Dashboard/Charts'
import WhatIfSimulator from '../Dashboard/WhatIfSimulator'
import PersonalizedInsight from '../Dashboard/PersonalizedInsight'

export default function InsightsPage({ user }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchActivities()
    }
  }, [user])

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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading insights...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Charts activities={activities} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <PersonalizedInsight activities={activities} />
        <WhatIfSimulator />
      </motion.div>
    </div>
  )
}