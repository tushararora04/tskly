import mongoose from 'mongoose'

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database se connect ho gaye!')
  } catch (error) {
    console.log('Database connect nahi hua:', error.message)
    process.exit(1)
  }
}