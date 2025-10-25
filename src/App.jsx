import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth/Auth'
import Dashboard from './components/Dashboard/Dashboard'
import ActivityLogger from './components/Activities/ActivityLogger'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState(false)

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setSupabaseError(true)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
      setLoading(false)
    }).catch((error) => {
      console.error('Supabase error:', error)
      setSupabaseError(true)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Show setup instructions if Supabase is not configured
  if (supabaseError) {
    return (
      <div className="setup-guide">
        <div className="setup-content">
          <h2>🔧 Setup Required</h2>
          <p>To run EcoTrack locally, contact the project owner for Supabase credentials.</p>
          <p><strong>Message the project maintainer for:</strong></p>
          <pre>
{`VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY`}
          </pre>
          <p>Then create a <code>.env</code> file in the project root with these values.</p>
        </div>
      </div>
    )
  }

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