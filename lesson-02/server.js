import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const petList = [
    { name: 'Pono', species: 'Dog', age: 3 },
    { name: 'Duke', species: 'Dog', age: 13 },
    { name: 'Hina', species: 'Cat', age: 1 },
    { name: 'Myshkin', species: 'Cat', age: 19 },
    { name: 'Tavi', species: 'Cat', age: 15 }
  ]

// typeDefs is the schema
const typeDefs = `#graphql
  type About {
    message: String!
  }

 enum Species {
  Dog
  Cat
}

type Pet {
  name: String!
  species: Species!
  age: Int!
}

type Time {
  hour : Int!
  minute : Int!
  second : Int!
}

type Roll {
  total: Int!
  sides: Int!
  rolls: [Int!]!
}

  type Query {
  allPets: [Pet!]! # returns a collection of Pet
  getPet(index: Int!): Pet
  firstPet: Pet
  lastPet: Pet
  getTime: Time
  getRandom(range: Int!): Int!
  getRoll(sides: Int!, rolls: Int!): Roll
  petCount: Int!
  petsInRange(start: Int!, count: Int!): [Pet!]!
  getPetBySpecies(species: Species!): [Pet!]!
  allSpecies: [Species!]!
}
  
 
  

`
const resolvers = {
    Query: {
      allPets: () => {
        return petList
      },
      getPet: (_, { index }) => {
        return petList[index]
      },
      firstPet: () => {
        return petList[0]
      },
      lastPet: () => {
        return petList[petList.length - 1]
      },
      getTime: () => {
        const now = new Date()
        return {
          hour: now.getHours(),
          minute: now.getMinutes(),
          second: now.getSeconds()
        }
      },
      getRandom: (_, { range }) => {
        return Math.floor(Math.random() * range)
      },
      getRoll: (_, { sides, rolls }) => {
        const rollResults = []
        for (let i = 0; i < rolls; i++) {
          rollResults.push(Math.floor(Math.random() * sides) + 1)
        }
        const total = rollResults.reduce((sum, n) => sum + n, 0)
        return {
          total,
          sides,
          rolls: rollResults
        }
      },
      petCount: () => {
        return petList.length
      },
      petsInRange: (_, { start, count }) => {
        return petList.slice(start, start + count)
      },
      // loop through each object with filter and check if the pet.species argument provided in the query matches the 
      // pet.species field of the object in the iteration of the loop. filter returns the new array of matching items
      getPetBySpecies: (_, { species }) => {
        return petList.filter((pet) => pet.species === species)
      },
    // grab the species field off each object in petList using map, that creates a list with duplicates. Use Set
    // to eliminate duplicates, since Sets only retain unique values, but GQL can't use a set, so convert to an array that GQL
    // can use by callin the spread operator ... on the set
      allSpecies: () => {
        return [...new Set(petList.map((pet) => pet.species))]
      }
    }
  }
  const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)