// src/components/Auth/Auth.jsx
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../supabaseClient"

export default function Auth() {
  const [mode, setMode] = useState("signin") // "signin" | "signup"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // if already signed in, redirect to dashboard
    supabase.auth.getSession().then((res) => {
      if (res?.data?.session) window.location.replace("/dashboard")
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) window.location.replace("/dashboard")
    })
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  const validate = () => {
    setError(null)
    if (!email || !password) {
      setError("Email and password are required.")
      return false
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return false
    }
    return true
  }

  const onSubmit = async (e) => {
  e.preventDefault()
  if (!validate()) return
  setLoading(true)
  setError(null)

  try {
    if (mode === "signup") {
      // ✅ Step 1: check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("auth.users") // this doesn’t actually work, so we’ll handle it through auth api
        .select("email")
        .eq("email", email)

      // Supabase’s public client can’t directly query auth.users for security reasons
      // so we’ll handle detection through sign-in attempt instead:
      const { error: precheck } = await supabase.auth.signInWithPassword({ email, password })
      if (!precheck) {
        setError("This email is already linked to an account. Please sign in instead.")
        setLoading(false)
        return
      }

      // ✅ Step 2: now try signup normally
      const { error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setError(error.message)
      } else {
        setError("Sign-up successful! Check your email for confirmation (if enabled).")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // redirect handled by auth listener
    }
  } catch (err) {
    setError(err?.message ?? "Unexpected error — try again.")
  } finally {
    setLoading(false)
  }
}


  const handleGoogle = async () => {
    setError(null)
    try {
      await supabase.auth.signInWithOAuth({ provider: "google" })
      // OAuth flow handled externally — listener will redirect
    } catch (err) {
      setError(err?.message ?? "Google sign-in failed.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      {/* header */}
      <header className="w-full bg-white/90 backdrop-blur-lg border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-6">
              <a href="/" className="flex items-center gap-2.5">
                <img src="/logo.jpeg" alt="EcoTrack" className="w-9 h-9 rounded-md object-cover" />
                <span className="text-green-800 font-bold text-xl">EcoTrack</span>
              </a>

              <nav className="hidden md:flex items-center gap-2">
                <a href="#" className="text-gray-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-md transition-all text-sm font-medium">Home</a>
                <a href="#" className="text-gray-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-md transition-all text-sm font-medium">About</a>
                <a href="#" className="text-gray-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-md transition-all text-sm font-medium">Contact</a>
              </nav>
            </div>

            <div className="hidden lg:block text-sm text-gray-500 italic">
              Sustainability starts with awareness 🌱
            </div>
          </div>
        </div>
      </header>

      {/* main area */}
      <main className="flex-1 flex items-start justify-center pt-16 sm:pt-20 pb-12 px-4">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
          aria-labelledby="auth-title"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-emerald-100/60 border border-green-50 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>

            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <img src="/logo.jpeg" alt="EcoTrack" className="w-14 h-14 rounded-lg object-cover mx-auto mb-4" />
                <h1 id="auth-title" className="text-3xl font-bold text-gray-800">
                  {mode === "signup" ? "Create your Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  {mode === "signup" ? "Join EcoTrack to start building greener habits." : "Sign in to continue to your dashboard."}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                  required
                />

                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                  required
                />

                {error && <div className="text-sm text-red-600 text-center pt-1">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-green-600 text-white py-3 rounded-lg font-semibold text-base hover:bg-green-700 active:scale-[.98] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {loading ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <div className="text-sm text-gray-500">or</div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                onClick={handleGoogle}
                className="w-full py-2.5 border border-gray-300 rounded-lg flex items-center justify-center gap-2.5 font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="text-center mt-6 text-sm text-gray-700">
                {mode === "signup" ? (
                  <>Already have an account? <button onClick={() => setMode("signin")} className="text-green-700 font-semibold hover:underline focus:outline-none focus:underline">Sign in</button></>
                ) : (
                  <>Don’t have an account? <button onClick={() => setMode("signup")} className="text-green-700 font-semibold hover:underline focus:outline-none focus:underline">Create one</button></>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            © 2025 EcoTrack • Building greener habits together
          </div>
        </motion.section>
      </main>
    </div>
  )
}

