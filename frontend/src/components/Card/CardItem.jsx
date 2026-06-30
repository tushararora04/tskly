import { motion } from 'framer-motion'
import api from '../../services/api.js'

function CardItem({ card, onUpdate }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/cards/${card._id}`)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <motion.div
      className="bg-gray-800 border border-gray-700 hover:border-violet-500/40 rounded-xl px-3 py-2.5 cursor-pointer group transition"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-white text-sm font-medium leading-snug">
          {card.title}
        </p>
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          className="text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </div>

      {card.labels?.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {card.labels.map((label) => (
            <span
              key={label}
              className="bg-violet-500/20 text-violet-300 text-xs px-2 py-0.5 rounded-lg"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {card.dueDate && (
        <p className="text-gray-500 text-xs mt-2">
          📅 {new Date(card.dueDate).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  )
}

export default CardItem