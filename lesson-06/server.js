import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const petList = [
    { name: 'Pono', species: 'Dog', age: 3 },
    { name: 'Duke', species: 'Dog', age: 13 },
    { name: 'Hina', species: 'Cat', age: 1 },
    { name: 'Myshkin', species: 'Cat', age: 19 },
    { name: 'Tavi', species: 'Cat', age: 15 }
  ]

  const bookList = [
    { title: 'Service Model', author: 'Adrian Tchaikovsky', isbn: 10},
    { title: 'The Last Unicorn', author: 'Peter S. Beagle', isbn: 11},
    { title: 'Fight Club', author: 'Chuck Palahniuk', isbn: 12},
    { title: 'Alchemised', author: 'SenLinYu', isbn: 13},
    { title: 'Wuthering Heights', author: 'Emily bronte', isbn: 14}
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

type Book{
  title: String!
  author: String!
  isbn: Int!
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
  books: [Book!]!
  getBook(index: Int!): Book
  firstBook: Book
  lastBook: Book
}

 type Mutation {
	addPet(name: String!, species: Species!, age: Int!): Pet!
  updatePet(id: Int!, name: String, species: Species, age: Int): Pet
  deletePet(id: Int!): Pet
  addBook(title: String!, author: String!, isbn: Int!): Book!
  editBook(id: Int!, title: String, author: String, isbn: Int): Book
  deleteBook(id: Int!): Book
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
      },
      books: () => {
        return bookList
      },
      getBook: (_, { index }) => {
        return bookList[index]
      },
      firstBook: () => {
        return bookList[0]
      },
      lastBook: () => {
        return bookList[bookList.length - 1]
      }
    },
    Mutation: {
      addPet: (_, { name, species, age }) => {
        const pet = { name, species, age }
        petList.push(pet)
        return pet
      },
      updatePet: (_, { id, name, species, age }) => {
        const pet = petList[id]
        if (pet === undefined) {
          return null
        }
        // omit ! on optional args so omitted fields stay unchanged; != null so age 0 still updates
        if (name != null) pet.name = name
        if (species != null) pet.species = species
        if (age != null) pet.age = age
        return pet
      },
      deletePet: (_, { id }) => {
        if (petList[id] === undefined) {
          return null
        }
        // splice is JS method that removes the indicated item in an array and returns it
        const [deleted] = petList.splice(id, 1)
        return deleted
      },
      addBook: (_, { title, author, isbn }) => {
        const book = { title, author, isbn }
        bookList.push(book)
        return book
      },
      editBook: (_, { id, title, author, isbn }) => {
        const book = bookList[id]
        if (book === undefined) {
          return null
        }
        if (title != null) book.title = title
        if (author != null) book.author = author
        if (isbn != null) book.isbn = isbn
        return book
      },
      deleteBook: (_, { id }) => {
        if (bookList[id] === undefined) {
          return null
        }
        const [deleted] = bookList.splice(id, 1)
        return deleted
      }
    }
  }
  const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)