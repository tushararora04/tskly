import mongoose from 'mongoose'

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  cardOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
}, { timestamps: true })

export default mongoose.model('Column', columnSchema)