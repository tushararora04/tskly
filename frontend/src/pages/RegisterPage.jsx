import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Logo from '../components/UI/Logo.jsx'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      setAuth(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 overflow-hidden">

      {/* Animated blobs */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-10"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', left: '20%' }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-10"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '10%', right: '20%' }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo + Name */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/20"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.15 }}
            >
              <Logo size={36} />
            </motion.div>
            <h1 className="text-5xl font-black text-white tracking-tight">tskly</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Get things done. Fast.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-6">Start organizing your work today</p>

          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-5 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="text-gray-400 text-xs font-medium mb-1.5 block uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 transition text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="text-gray-400 text-xs font-medium mb-1.5 block uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 transition text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="text-gray-400 text-xs font-medium mb-1.5 block uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 transition text-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account →'}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage