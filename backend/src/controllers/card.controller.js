import Card from '../models/Card.model.js'
import Column from '../models/Column.model.js'

export async function createCard(req, res) {
  try {
    const { title, columnId, boardId } = req.body
    const card = await Card.create({
      title,
      column: columnId,
      board: boardId
    })
    await Column.findByIdAndUpdate(columnId, {
      $push: { cardOrder: card._id }
    })

    const io = req.app.get('io')
    io.to(boardId).emit('cardCreated', { card, columnId })

    res.status(201).json(card)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateCard(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!card) return res.status(404).json({ message: 'Card nahi mila' })

    const io = req.app.get('io')
    io.to(card.board.toString()).emit('cardUpdated', { card })

    res.json(card)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function deleteCard(req, res) {
  try {
    const card = await Card.findByIdAndDelete(req.params.id)
    if (!card) return res.status(404).json({ message: 'Card nahi mila' })
    await Column.findByIdAndUpdate(card.column, {
      $pull: { cardOrder: card._id }
    })

    const io = req.app.get('io')
    io.to(card.board.toString()).emit('cardDeleted', { cardId: card._id, columnId: card.column })

    res.json({ message: 'Card delete ho gaya' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function moveCard(req, res) {
  try {
    const { cardId, sourceColumnId, destColumnId, destCardOrder, boardId } = req.body

    if (sourceColumnId !== destColumnId) {
      await Column.findByIdAndUpdate(sourceColumnId, {
        $pull: { cardOrder: cardId }
      })
      await Card.findByIdAndUpdate(cardId, { column: destColumnId })
    }

    await Column.findByIdAndUpdate(destColumnId, {
      cardOrder: destCardOrder
    })

    const io = req.app.get('io')
    io.to(boardId).emit('cardMoved', {
      cardId, sourceColumnId, destColumnId, destCardOrder
    })

    res.json({ message: 'Card move ho gaya' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}