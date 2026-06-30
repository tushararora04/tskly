import Column from '../models/Column.model.js'
import Board from '../models/Board.model.js'
import Card from '../models/Card.model.js'

export async function createColumn(req, res) {
  try {
    const { title, boardId } = req.body
    const column = await Column.create({ title, board: boardId })
    await Board.findByIdAndUpdate(boardId, { $push: { columnOrder: column._id } })

    const io = req.app.get('io')
    io.to(boardId).emit('columnCreated', { column })

    res.status(201).json(column)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateColumn(req, res) {
  try {
    const column = await Column.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!column) return res.status(404).json({ message: 'Column nahi mila' })

    const io = req.app.get('io')
    io.to(column.board.toString()).emit('columnUpdated', { column })

    res.json(column)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function deleteColumn(req, res) {
  try {
    const column = await Column.findByIdAndDelete(req.params.id)
    if (!column) return res.status(404).json({ message: 'Column nahi mila' })
    await Card.deleteMany({ column: column._id })
    await Board.findByIdAndUpdate(column.board, { $pull: { columnOrder: column._id } })

    const io = req.app.get('io')
    io.to(column.board.toString()).emit('columnDeleted', { columnId: column._id })

    res.json({ message: 'Column delete ho gaya' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}