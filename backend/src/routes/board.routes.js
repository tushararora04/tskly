import { Router } from 'express'
import {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard
} from '../controllers/board.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protect)

router.route('/')
  .get(getBoards)
  .post(createBoard)

router.route('/:id')
  .get(getBoardById)
  .patch(updateBoard)
  .delete(deleteBoard)

export default router