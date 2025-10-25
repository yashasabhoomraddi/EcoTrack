import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are missing
let supabase

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase: Running in demo mode - Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  
  // Create a mock client to prevent crashes
  supabase = {
    auth: {
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } } 
      }),
      signIn: () => Promise.resolve({ error: { message: 'Setup .env file for authentication' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: { message: 'Setup .env file for database access' } }),
      insert: () => Promise.resolve({ error: { message: 'Setup .env file for database access' } }),
      update: () => Promise.resolve({ error: { message: 'Setup .env file for database access' } }),
      delete: () => Promise.resolve({ error: { message: 'Setup .env file for database access' } })
    }),
    channel: () => ({
      subscribe: () => ({
        on: () => ({})
      })
    })
  }
} else {
  // Normal Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }