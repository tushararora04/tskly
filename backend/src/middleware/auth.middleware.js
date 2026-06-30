import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Login karo pehle' })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    next()
  } catch (error) {
    res.status(401).json({ message: 'Token galat hai ya expire ho gaya' })
  }
}