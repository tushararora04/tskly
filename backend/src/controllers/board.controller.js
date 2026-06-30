import Board from '../models/Board.model.js'
import Column from '../models/Column.model.js'
import Card from '../models/Card.model.js'

export async function getBoards(req, res) {
  try {
    const boards = await Board.find({ owner: req.user._id })
    res.json(boards)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createBoard(req, res) {
  try {
    const { title, background } = req.body
    const board = await Board.create({
      title,
      background,
      owner: req.user._id
    })
    res.status(201).json(board)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function getBoardById(req, res) {
  try {
    const board = await Board.findById(req.params.id)
      .populate({
        path: 'columnOrder',
        populate: { path: 'cardOrder', model: 'Card' }
      })
    if (!board) return res.status(404).json({ message: 'Board nahi mila' })
    res.json(board)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateBoard(req, res) {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!board) return res.status(404).json({ message: 'Board nahi mila' })
    res.json(board)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function deleteBoard(req, res) {
  try {
    const board = await Board.findByIdAndDelete(req.params.id)
    if (!board) return res.status(404).json({ message: 'Board nahi mila' })
    await Column.deleteMany({ board: board._id })
    await Card.deleteMany({ board: board._id })
    res.json({ message: 'Board delete ho gaya' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}