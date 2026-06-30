import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import api from '../../services/api.js'
import ColumnItem from '../Column/ColumnItem.jsx'
import CardItem from '../Card/CardItem.jsx'

function BoardView({ board, onBoardUpdate }) {
  const [addingColumn, setAddingColumn] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  const handleAddColumn = async (e) => {
    e.preventDefault()
    if (!columnTitle.trim()) return
    try {
      await api.post('/columns', {
        title: columnTitle,
        boardId: board._id
      })
      setColumnTitle('')
      setAddingColumn(false)
      onBoardUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDragStart = ({ active }) => {
    const card = findCard(active.id)
    setActiveCard(card)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveCard(null)
    if (!over || active.id === over.id) return

    const sourceColumn = findColumnByCardId(active.id)
    const destColumn = findColumnByCardId(over.id) || findColumnById(over.id)

    if (!sourceColumn || !destColumn) return

    const destCardOrder = destColumn.cardOrder.map(c => c._id)
    const activeIndex = destCardOrder.indexOf(active.id)
    const overIndex = destCardOrder.indexOf(over.id)

    let newCardOrder = [...destCardOrder]

    if (sourceColumn._id === destColumn._id) {
      newCardOrder.splice(activeIndex, 1)
      newCardOrder.splice(overIndex, 0, active.id)
    } else {
      newCardOrder = newCardOrder.filter(id => id !== active.id)
      const insertAt = overIndex === -1 ? newCardOrder.length : overIndex
      newCardOrder.splice(insertAt, 0, active.id)
    }

    try {
        await api.post('/cards/move', {
            cardId: active.id,
            sourceColumnId: sourceColumn._id,
            destColumnId: destColumn._id,
            destCardOrder: newCardOrder,
            boardId: board._id
          })
      onBoardUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const findCard = (cardId) => {
    for (const col of board.columnOrder) {
      const card = col.cardOrder.find(c => c._id === cardId)
      if (card) return card
    }
    return null
  }

  const findColumnByCardId = (cardId) => {
    return board.columnOrder.find(col =>
      col.cardOrder.some(c => c._id === cardId)
    )
  }

  const findColumnById = (colId) => {
    return board.columnOrder.find(col => col._id === colId)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">

        {board.columnOrder.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center w-full py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              📋
            </motion.div>
            <h3 className="text-white font-semibold text-lg mb-1">This board is empty</h3>
            <p className="text-gray-500 text-sm">Add your first list to get started</p>
          </motion.div>
        )}

        {board.columnOrder.map((column, i) => (
          <motion.div
            key={column._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ColumnItem
              column={column}
              boardId={board._id}
              onUpdate={onBoardUpdate}
            />
          </motion.div>
        ))}

        <AnimatePresence>
          {addingColumn ? (
            <motion.form
              onSubmit={handleAddColumn}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-3 w-64 shrink-0 space-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <input
                autoFocus
                type="text"
                placeholder="List title..."
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600 text-sm"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <motion.button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-xl font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add List
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setAddingColumn(false)}
                  className="px-3 bg-gray-800 text-gray-400 rounded-xl text-sm hover:text-white transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              onClick={() => setAddingColumn(true)}
              className="w-64 shrink-0 h-12 rounded-2xl border-2 border-dashed border-gray-700 hover:border-blue-500/50 text-gray-600 hover:text-blue-400 transition flex items-center justify-center gap-2 text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              + Add a list
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCard && (
          <div className="rotate-2 opacity-90">
            <CardItem card={activeCard} onUpdate={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default BoardView