import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  background: { type: String, default: '#0079BF' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  columnOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }]
}, { timestamps: true })

export default mongoose.model('Board', boardSchema)