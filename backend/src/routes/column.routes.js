import { Router } from 'express'
import {
  createColumn,
  updateColumn,
  deleteColumn
} from '../controllers/column.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protect)

router.post('/', createColumn)
router.patch('/:id', updateColumn)
router.delete('/:id', deleteColumn)

export default router