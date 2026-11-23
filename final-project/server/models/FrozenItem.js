import mongoose from 'mongoose'

const frozenItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  frozenOn: { type: Date, required: true },
  weight: { type: Number, required: true, min: 0 },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  freezerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freezer',
    required: true,
    index: true,
  },
})

export default mongoose.model('FrozenItem', frozenItemSchema)
