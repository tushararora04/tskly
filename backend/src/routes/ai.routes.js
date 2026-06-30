import express from 'express'
import { parseTaskFromText, breakdownTask } from '../controllers/ai.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/parse-task', protect, parseTaskFromText)
router.post('/breakdown', protect, breakdownTask)

export default router