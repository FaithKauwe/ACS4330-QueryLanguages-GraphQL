const resolvers = {
  Query: {
    pets: (_, __, { Pet }) => Pet.find().exec(),
    pet: (_, { id }, { Pet }) => Pet.findById(id).exec(),
    shelters: (_, __, { Shelter }) => Shelter.find().exec(),
    shelter: (_, { id }, { Shelter }) => Shelter.findById(id).exec(),
  },
  Mutation: {
    addPet: (_, args, { Pet }) => Pet.create(args),

    updatePet: (_, { id, ...fields }, { Pet }) => {
      return Pet.findByIdAndUpdate(id, fields, {
        returnDocument: 'after',
        runValidators: true,
      }).exec()
    },

    deletePet: async (_, { id }, { Pet }) => {
      const result = await Pet.findByIdAndDelete(id)
      return result !== null
    },

    addShelter: (_, args, { Shelter }) => Shelter.create(args),
  },
  Pet: {
    shelter: (pet, _, { Shelter }) => {
      if (!pet.shelterId) return null
      return Shelter.findById(pet.shelterId).exec()
    },
  },
  Shelter: {
    pets: (shelter, _, { Pet }) => Pet.find({ shelterId: shelter.id }).exec(),
  },
}

export default resolvers
