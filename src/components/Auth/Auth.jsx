import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../supabaseClient"

export default function Auth() {
  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
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
        const { error: precheck } = await supabase.auth.signInWithPassword({ email, password })
        if (!precheck) {
          setError("This email is already linked to an account. Please sign in instead.")
          setLoading(false)
          return
        }

        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
        } else {
          setError("Sign-up successful! Check your email for confirmation.")
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err?.message ?? "Unexpected error — try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="EcoTrack" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold text-green-800">EcoTrack</span>
            </div>
            <div className="hidden lg:block">
              <button 
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {mode === "signin" ? "Get Started Free" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Track smarter.<br />
              <span className="text-green-600">Live greener.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Cloud-powered carbon tracking tailored for modern living. Monitor your footprint, 
              get personalized insights, and build sustainable habits — all in one clean dashboard.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-700">Forever free plan</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-700">Infrastructure & Storage Security</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-gray-700">AI-powered insights across all activities</span>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-sm text-gray-500">
                Join thousands of eco-conscious users tracking their carbon footprint with EcoTrack.
              </p>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-green-100 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {mode === "signup" ? "Start your green journey" : "Welcome back"}
              </h2>
              <p className="text-gray-600 mt-2">
                {mode === "signup" 
                  ? "Create your account and start tracking your carbon footprint today." 
                  : "Sign in to continue to your dashboard."
                }
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  error.includes("successful") 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </form>

            {/* REMOVED GOOGLE LOGIN SECTION - Now directly shows account toggle */}

            <div className="text-center mt-6 text-sm text-gray-600">
              {mode === "signup" ? (
                <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-green-600 font-semibold hover:underline">
                  Sign in
                </button>
                </>
              ) : (
                <>Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-green-600 font-semibold hover:underline">
                  Create one
                </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 border-t border-green-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            © 2025 EcoTrack. All rights reserved. • Building a greener future together 🌱
          </div>
        </div>
      </div>
    </div>
  )
}