import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Logo from '../components/UI/Logo.jsx'

const BACKGROUNDS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fd746c 0%, #ff9068 100%)',
  'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
]

function BoardsPage() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0])
  const [search, setSearch] = useState('')

  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => { fetchBoards() }, [])

  const fetchBoards = async () => {
    try {
      const { data } = await api.get('/boards')
      setBoards(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const { data } = await api.post('/boards', {
        title: newTitle,
        background: selectedBg
      })
      setBoards([data, ...boards])
      setNewTitle('')
      setCreating(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (e, boardId) => {
    e.stopPropagation()
    if (!confirm('Delete this board?')) return
    try {
      await api.delete(`/boards/${boardId}`)
      setBoards(boards.filter(b => b._id !== boardId))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = boards.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-5"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-5"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-[#0a0a0f]/80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="inline-flex items-center justify-center w-9 h-9 bg-[#0f172a] border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/20"
            animate={{ y: [0, -3, 0], rotate: [0, 3, 0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.1 }}
          >
            <Logo size={20} />
          </motion.div>
          <span className="text-white font-black text-xl tracking-tight">tskly</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search boards..."
              className="bg-gray-900 border border-gray-800 text-white rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-px h-6 bg-gray-800" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-400 text-sm hidden sm:block">{user?.name}</span>
          </div>

          <motion.button
            onClick={clearAuth}
            className="text-gray-500 hover:text-red-400 text-sm transition px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign out
          </motion.button>
        </div>
      </motion.nav>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative">

        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-black text-white tracking-tight">
            Your Workspace
          </h1>
          <p className="text-gray-500 mt-2">
            {boards.length} board{boards.length !== 1 ? 's' : ''} · Get things done
          </p>
        </motion.div>

        {/* Boards Grid */}
        {loading ? (
        <div className="flex items-center justify-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        </div>
        ) : (
          <>
          {filtered.length === 0 && search && (
  <motion.div
    className="text-center py-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <p className="text-gray-600 text-lg">No boards found for "{search}"</p>
  </motion.div>
)}

{boards.length === 0 && !search && (
  <motion.div
    className="flex flex-col items-center justify-center py-20 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div
      className="text-6xl mb-4"
      animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      🚀
    </motion.div>
    <h3 className="text-white font-bold text-xl mb-2">No boards yet</h3>
    <p className="text-gray-500 text-sm mb-6">Create your first board to start organizing your work</p>
  </motion.div>
)}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filtered.map((board, i) => (
                  <motion.div
                    key={board._id}
                    onClick={() => navigate(`/board/${board._id}`)}
                    className="h-40 rounded-2xl p-5 cursor-pointer relative overflow-hidden group"
                    style={{ background: board.background }}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 rounded-2xl" />

                    <motion.button
                      onClick={(e) => handleDelete(e, board._id)}
                      className="absolute top-3 right-3 w-7 h-7 bg-black/20 hover:bg-red-500/80 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white text-xs"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-lg leading-tight drop-shadow-sm">
                        {board.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-white/60 text-xs">
                          {board.columnOrder?.length || 0} lists
                        </p>
                        <span className="text-white/30 text-xs">·</span>
                        <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition">
                          Open →
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                onClick={() => setCreating(true)}
                className="h-40 rounded-2xl border-2 border-dashed border-gray-800 hover:border-blue-500/50 text-gray-600 hover:text-blue-400 transition-all flex flex-col items-center justify-center gap-3 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: filtered.length * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="text-4xl"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
                <span className="text-sm font-medium">New Board</span>
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Create Board Modal */}
      <AnimatePresence>
        {creating && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreating(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="text-white font-bold text-lg mb-1">Create board</h3>
                <p className="text-gray-500 text-sm mb-5">Give your board a name and style</p>

                <motion.div
                  className="h-28 rounded-xl mb-4 flex items-end p-4 relative overflow-hidden"
                  style={{ background: selectedBg }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="text-white font-bold text-sm relative z-10 drop-shadow">
                    {newTitle || 'Board name...'}
                  </span>
                </motion.div>

                <div className="flex gap-2 mb-5 flex-wrap">
                  {BACKGROUNDS.map((bg, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setSelectedBg(bg)}
                      className={`w-8 h-8 rounded-lg transition-all ${selectedBg === bg ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-105'}`}
                      style={{ background: bg }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>

                <form onSubmit={handleCreate} className="space-y-3">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Board title"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 text-sm"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <motion.button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm shadow-lg shadow-blue-500/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create Board
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setCreating(false)}
                      className="px-4 bg-gray-800 text-gray-400 rounded-xl text-sm hover:text-white transition border border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BoardsPage