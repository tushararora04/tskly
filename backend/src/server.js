import dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

await connectDB()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('joinBoard', (boardId) => {
    socket.join(boardId)
    console.log(`Socket ${socket.id} joined board ${boardId}`)
  })

  socket.on('leaveBoard', (boardId) => {
    socket.leave(boardId)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

app.set('io', io)

httpServer.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} pe`)
})