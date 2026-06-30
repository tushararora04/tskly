import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api.js'
import socket from '../services/socket.js'
import BoardView from '../components/Board/BoardView.jsx'
import Logo from '../components/UI/Logo.jsx'

function BoardPage() {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoard()
  }, [id])

  // ---- Socket.io setup ----
  useEffect(() => {
    socket.connect()
    socket.emit('joinBoard', id)

    const handleUpdate = () => {
      fetchBoard()
    }

    socket.on('cardCreated', handleUpdate)
    socket.on('cardUpdated', handleUpdate)
    socket.on('cardDeleted', handleUpdate)
    socket.on('cardMoved', handleUpdate)
    socket.on('columnCreated', handleUpdate)
    socket.on('columnUpdated', handleUpdate)
    socket.on('columnDeleted', handleUpdate)

    return () => {
      socket.emit('leaveBoard', id)
      socket.off('cardCreated', handleUpdate)
      socket.off('cardUpdated', handleUpdate)
      socket.off('cardDeleted', handleUpdate)
      socket.off('cardMoved', handleUpdate)
      socket.off('columnCreated', handleUpdate)
      socket.off('columnUpdated', handleUpdate)
      socket.off('columnDeleted', handleUpdate)
      socket.disconnect()
    }
  }, [id])
  // ---- END ----

  const fetchBoard = async () => {
    try {
      const { data } = await api.get(`/boards/${id}`)
      setBoard(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>
      <motion.nav
        className="border-b border-gray-800/50 px-6 py-3 flex items-center gap-4 shrink-0 backdrop-blur-sm bg-[#0a0a0f]/80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1"
          whileHover={{ x: -2 }}
        >
          ← Back
        </motion.button>

        <div className="w-px h-4 bg-gray-700" />

        <div className="flex items-center gap-2">
          <motion.div
            className="inline-flex items-center justify-center w-8 h-8 bg-[#0f172a] border border-blue-500/30 rounded-lg shadow-lg shadow-blue-500/20"
            animate={{ y: [0, -3, 0], rotate: [0, 3, 0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.1 }}
          >
            <Logo size={18} />
          </motion.div>
          <span className="text-white font-black tracking-tight">tskly</span>
        </div>

        <div className="w-px h-4 bg-gray-700" />

        <h1 className="text-white font-semibold text-sm">{board?.title}</h1>
      </motion.nav>

      <div className="flex-1 overflow-hidden">
        {board && <BoardView board={board} onBoardUpdate={fetchBoard} />}
      </div>
    </div>
  )
}

export default BoardPage