import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth/Auth'
import Dashboard from './components/Dashboard/Dashboard'
import ActivityLogger from './components/Activities/ActivityLogger'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="loading">Loading EcoTrack...</div>

  if (!user) return <Auth />

  return (
    <div className="app">
      <header>
        <h1>🌱 EcoTrack</h1>
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      </header>
      <main>
        <ActivityLogger user={user} />
        <Dashboard user={user} />
      </main>
    </div>
  )
}