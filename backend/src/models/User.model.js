import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true })

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
  })

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)