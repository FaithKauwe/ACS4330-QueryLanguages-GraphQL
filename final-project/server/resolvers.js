function dateToString(value) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return d.toISOString().slice(0, 10)
}

const resolvers = {
  Query: {
    items: (_, __, { FrozenItem }) => FrozenItem.find().exec(),
    item: (_, { id }, { FrozenItem }) => FrozenItem.findById(id).exec(),
    itemsByName: (_, { search }, { FrozenItem }) => {
      return FrozenItem.find({
        name: { $regex: search, $options: 'i' },
      }).exec()
    },
    expiringSoon: (_, { months }, { FrozenItem }) => {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - months)
      return FrozenItem.find({ frozenOn: { $lte: cutoff } }).exec()
    },
    categories: (_, __, { Category }) => Category.find().exec(),
    category: (_, { id }, { Category }) => Category.findById(id).exec(),
    freezers: (_, __, { Freezer }) => Freezer.find().exec(),
    freezer: (_, { id }, { Freezer }) => Freezer.findById(id).exec(),
  },
  Mutation: {
    addItem: (_, { name, frozenOn, weight, categoryId, freezerId }, { FrozenItem }) => {
      return FrozenItem.create({
        name,
        frozenOn,
        weight,
        categoryId,
        freezerId,
      })
    },
    deleteItem: async (_, { id }, { FrozenItem }) => {
      return FrozenItem.findByIdAndDelete(id).exec()
    },
  },
  FrozenItem: {
    frozenOn: (item) => dateToString(item.frozenOn),
    category: (item, _, { Category }) => Category.findById(item.categoryId).exec(),
    freezer: (item, _, { Freezer }) => Freezer.findById(item.freezerId).exec(),
  },
  Category: {
    items: (category, _, { FrozenItem }) => {
      return FrozenItem.find({ categoryId: category.id }).exec()
    },
  },
  Freezer: {
    items: (freezer, _, { FrozenItem }) => {
      return FrozenItem.find({ freezerId: freezer.id }).exec()
    },
  },
}

export default resolvers
