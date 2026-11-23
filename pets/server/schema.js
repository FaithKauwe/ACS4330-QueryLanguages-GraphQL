const typeDefs = `#graphql
  type Shelter {
    id: ID!
    name: String!
    city: String!
    pets: [Pet!]!
  }

  type Pet {
    id: ID!
    name: String!
    species: String!
    age: Int
    shelter: Shelter
  }

  type Query {
    pets: [Pet!]!
    pet(id: ID!): Pet
    shelters: [Shelter!]!
    shelter(id: ID!): Shelter
  }

  type Mutation {
    addPet(name: String!, species: String!, age: Int, shelterId: ID): Pet!
    updatePet(id: ID!, name: String, species: String, age: Int, shelterId: ID): Pet
    deletePet(id: ID!): Boolean!
    addShelter(name: String!, city: String!): Shelter!
  }
`

export default typeDefs
