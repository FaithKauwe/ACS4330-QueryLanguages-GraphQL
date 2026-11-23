import mongoose from 'mongoose'

const freezerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
})

export default mongoose.model('Freezer', freezerSchema)
