import mongoose from 'mongoose'

const petSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  species: {
    type: String,
    required: true,
    enum: ['cat', 'dog', 'bird', 'rabbit', 'other'],
  },
  age: { type: Number, min: 0, max: 40 },
  shelterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    index: true,
  },
})

export default mongoose.model('Pet', petSchema)
