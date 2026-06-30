import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import boardRoutes from './routes/board.routes.js'
import columnRoutes from './routes/column.routes.js'
import cardRoutes from './routes/card.routes.js'
import aiRoutes from './routes/ai.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Server chal raha hai!' })
})

export default app