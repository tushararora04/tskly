import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  labels: [{ type: String }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null }
}, { timestamps: true })

export default mongoose.model('Card', cardSchema)