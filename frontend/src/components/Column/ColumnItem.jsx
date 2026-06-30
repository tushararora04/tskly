import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import api from '../../services/api.js'
import CardModal from '../Card/CardModal.jsx'

const PRIORITY_STYLES = {
  low: 'bg-blue-500/20 text-blue-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
}

const PRIORITY_DOT = {
  low: 'bg-blue-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400',
}

function SortableCard({ card, onUpdate, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  }

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && !isDragging

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        onClick={() => onClick(card)}
        className="bg-gray-800/80 border border-gray-700/80 hover:border-blue-500/50 hover:bg-gray-800 rounded-xl px-3.5 py-3 cursor-grab active:cursor-grabbing group transition-all relative overflow-hidden"
        whileHover={{ scale: 1.02, y: -2 }}
        layout
      >
        {/* Priority accent bar */}
        {card.priority && (
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${PRIORITY_DOT[card.priority]}`} />
        )}

        <div className="flex items-start justify-between gap-2 pl-1">
          <p className="text-white text-sm font-medium leading-snug">{card.title}</p>
          <motion.button
            onClick={async (e) => {
              e.stopPropagation()
              await api.delete(`/cards/${card._id}`)
              onUpdate()
            }}
            className="text-gray-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs shrink-0"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        {card.description && (
          <p className="text-gray-500 text-xs mt-1.5 pl-1 line-clamp-1">
            {card.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2.5 pl-1 flex-wrap">
          {card.priority && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide ${PRIORITY_STYLES[card.priority]}`}>
              {card.priority}
            </span>
          )}
          {card.dueDate && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/60 text-gray-400'}`}>
              📅 {new Date(card.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function ColumnItem({ column, boardId, onUpdate }) {
  const [addingCard, setAddingCard] = useState(false)
  const [cardTitle, setCardTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)

  // ---- NEW: AI mode states ----
  const [aiMode, setAiMode] = useState(null) // null | 'quick' | 'breakdown'
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  // ---- END NEW ----

  const { setNodeRef } = useDroppable({ id: column._id })

  const handleAddCard = async (e) => {
    e.preventDefault()
    if (!cardTitle.trim()) return
    try {
      await api.post('/cards', {
        title: cardTitle,
        columnId: column._id,
        boardId
      })
      setCardTitle('')
      setAddingCard(false)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  // ---- NEW: AI quick add (natural language -> single card) ----
  const handleAiQuickAdd = async (e) => {
    e.preventDefault()
    if (!aiText.trim()) return
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/parse-task', { text: aiText })
      await api.post('/cards', {
        title: data.title,
        description: data.description || '',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || null,
        columnId: column._id,
        boardId
      })
      setAiText('')
      setAiMode(null)
      onUpdate()
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  // ---- NEW: AI breakdown (big task -> multiple cards) ----
  const handleAiBreakdown = async (e) => {
    e.preventDefault()
    if (!aiText.trim()) return
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/breakdown', { text: aiText })
      for (const sub of data.subtasks) {
        await api.post('/cards', {
          title: sub.title,
          priority: sub.priority || 'medium',
          columnId: column._id,
          boardId
        })
      }
      setAiText('')
      setAiMode(null)
      onUpdate()
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }
  // ---- END NEW ----

  const handleDeleteColumn = async () => {
    if (!confirm(`Delete "${column.title}"?`)) return
    try {
      await api.delete(`/columns/${column._id}`)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const cardCount = column.cardOrder?.length || 0

  return (
    <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-3 w-72 shrink-0 flex flex-col gap-2 max-h-[calc(100vh-120px)]">

      {/* Header */}
      <div className="flex items-center justify-between px-1.5 py-1 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h3 className="text-white font-semibold text-sm">{column.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded-md font-medium">
            {cardCount}
          </span>
          <motion.button
            onClick={handleDeleteColumn}
            className="text-gray-600 hover:text-red-400 transition text-xs"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex flex-col gap-2 overflow-y-auto min-h-[60px]">
        {cardCount === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gray-800/60 flex items-center justify-center mb-2">
              <span className="text-lg opacity-40">📭</span>
            </div>
            <p className="text-gray-600 text-xs">No cards yet</p>
          </motion.div>
        ) : (
          <SortableContext
            items={column.cardOrder.map(c => c._id)}
            strategy={verticalListSortingStrategy}
          >
            {column.cardOrder?.map((card) => (
              <SortableCard
                key={card._id}
                card={card}
                onUpdate={onUpdate}
                onClick={setSelectedCard}
              />
            ))}
          </SortableContext>
        )}
      </div>

      {/* Add Card */}
      <AnimatePresence mode="wait">
        {aiMode ? (
          // ---- NEW: AI input form ----
          <motion.form
            key="ai-form"
            onSubmit={aiMode === 'quick' ? handleAiQuickAdd : handleAiBreakdown}
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-medium px-1">
              ✨ {aiMode === 'quick' ? 'Quick Add (AI)' : 'Breakdown Task (AI)'}
            </div>
            <textarea
              autoFocus
              rows={2}
              placeholder={aiMode === 'quick' ? 'e.g. fix login bug by friday, high priority' : 'e.g. Launch new marketing campaign'}
              className="w-full bg-gray-800 border border-purple-500/40 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-600 text-sm resize-none"
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              disabled={aiLoading}
            />
            <div className="flex gap-2">
              <motion.button
                type="submit"
                disabled={aiLoading}
                className="flex-1 bg-purple-600 text-white text-xs py-2 rounded-xl font-medium disabled:opacity-50"
                whileHover={{ scale: aiLoading ? 1 : 1.02 }}
                whileTap={{ scale: aiLoading ? 1 : 0.98 }}
              >
                {aiLoading ? 'Thinking...' : aiMode === 'quick' ? 'Create Card' : 'Break it down'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => { setAiMode(null); setAiText('') }}
                className="px-3 bg-gray-800 text-gray-400 rounded-xl text-xs hover:text-white transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ✕
              </motion.button>
            </div>
          </motion.form>
          // ---- END NEW ----
        ) : addingCard ? (
          <motion.form
            key="manual-form"
            onSubmit={handleAddCard}
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              autoFocus
              rows={2}
              placeholder="Card title..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 text-sm resize-none"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <motion.button
                type="submit"
                className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Card
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setAddingCard(false)}
                className="px-3 bg-gray-800 text-gray-400 rounded-xl text-xs hover:text-white transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ✕
              </motion.button>
            </div>
          </motion.form>
        ) : (
          // ---- NEW: row with 3 buttons instead of 1 ----
          <motion.div key="buttons-row" className="flex gap-1.5">
            <motion.button
              onClick={() => setAddingCard(true)}
              className="flex-1 text-left text-gray-600 hover:text-blue-400 text-xs px-2 py-2 rounded-xl hover:bg-gray-800/60 transition flex items-center gap-1.5"
              whileHover={{ x: 2 }}
            >
              <span className="text-sm">+</span> Add a card
            </motion.button>
            <motion.button
              onClick={() => setAiMode('quick')}
              className="px-2.5 text-purple-400 hover:text-purple-300 text-xs rounded-xl hover:bg-purple-500/10 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Quick add with AI"
            >
              ✨
            </motion.button>
            <motion.button
              onClick={() => setAiMode('breakdown')}
              className="px-2.5 text-purple-400 hover:text-purple-300 text-xs rounded-xl hover:bg-purple-500/10 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Break down a big task"
            >
              🧩
            </motion.button>
          </motion.div>
          // ---- END NEW ----
        )}
      </AnimatePresence>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  )
}

export default ColumnItem