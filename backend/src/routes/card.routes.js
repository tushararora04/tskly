import { Router } from 'express'
import {
  createCard,
  updateCard,
  deleteCard,
  moveCard
} from '../controllers/card.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protect)

router.post('/', createCard)
router.post('/move', moveCard)
router.patch('/:id', updateCard)
router.delete('/:id', deleteCard)

export default router