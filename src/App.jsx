import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth/Auth'
import Dashboard from './components/Dashboard/Dashboard'
import ActivitiesPage from './components/Activities/ActivitiesPage'
import InsightsPage from './components/Insights/InsightsPage'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [activities, setActivities] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      if (session?.user) {
        fetchActivities(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
      if (session?.user) {
        fetchActivities(session.user.id)
      } else {
        setActivities([])
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchActivities = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Database error:', error)
        setActivities([])
      } else {
        setActivities(data || [])
      }
    } catch (error) {
      console.error('Fetch activities error:', error)
      setActivities([])
    }
    setLoading(false)
  }

  const handleActivityLogged = () => {
    if (user) {
      fetchActivities(user.id)
    }
  }

  const renderPage = () => {
    const userWithActivities = user ? { ...user, activities } : null

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={userWithActivities} />
      case 'activities':
        return <ActivitiesPage user={userWithActivities} onActivityLogged={handleActivityLogged} />
      case 'insights':
        return <InsightsPage user={userWithActivities} />
      default:
        return <Dashboard user={userWithActivities} />
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading EcoTrack...</p>
      </div>
    </div>
  )

  if (!user) return <Auth />

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="EcoTrack" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold text-green-800">EcoTrack</span>
            </div>
            
            {/* REMOVED PROFILE - Only 3 pages now */}
            <nav className="flex items-center gap-1">
              {['dashboard', 'activities', 'insights'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user.email?.split('@')[0]}
              </span>
              <button 
                onClick={() => supabase.auth.signOut()} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  )
}