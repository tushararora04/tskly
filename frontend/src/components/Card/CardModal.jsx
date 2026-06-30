import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api.js'

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'high', label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
]

function CardModal({ card, onClose, onUpdate }) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [priority, setPriority] = useState(card.priority || 'medium')
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.split('T')[0] : '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch(`/cards/${card._id}`, {
        title,
        description,
        priority,
        dueDate: dueDate || null
      })
      onUpdate()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-5">
            <input
              className="text-white font-bold text-lg bg-transparent border-none focus:outline-none focus:bg-gray-800 rounded-lg px-2 py-1 -ml-2 flex-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition ml-3 mt-1"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Add a more detailed description..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 text-sm resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="mb-5">
            <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <motion.button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                    priority === p.value
                      ? p.color
                      : 'bg-gray-800 text-gray-500 border-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label className="text-gray-400 text-xs font-medium mb-2 block uppercase tracking-wider">
              Due Date
            </label>
            <input
              type="date"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-5 bg-gray-800 text-gray-400 rounded-xl text-sm hover:text-white transition border border-gray-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CardModal