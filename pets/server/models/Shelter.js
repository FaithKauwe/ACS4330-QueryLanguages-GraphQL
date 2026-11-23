import mongoose from 'mongoose'

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
})

export default mongoose.model('Shelter', shelterSchema)
