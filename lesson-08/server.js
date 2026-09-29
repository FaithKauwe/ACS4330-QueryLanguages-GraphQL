import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const characters = [
  { id: '1', name: 'Rick Sanchez', status: 'Alive', originId: '1', locationId: '3' },
  { id: '2', name: 'Morty Smith', status: 'Alive', originId: '2', locationId: '3' },
  { id: '3', name: 'Summer Smith', status: 'Alive', originId: '20', locationId: '20' },
  { id: '4', name: 'Beth Smith', status: 'Alive', originId: '20', locationId: '20' },
  { id: '5', name: 'Jerry Smith', status: 'Alive', originId: '20', locationId: '999' }
]

const locations = [
  { id: '1', name: 'Earth (C-137)', dimension: 'Dimension C-137' },
  { id: '2', name: 'Abadango', dimension: 'unknown' },
  { id: '3', name: 'Citadel of Ricks', dimension: 'unknown' },
  { id: '20', name: 'Earth (Replacement Dimension)', dimension: 'Replacement Dimension' }
]

const episodes = [
  { id: '1', name: 'Pilot', episode: 'S01E01', characterIds: ['1', '2', '3', '4', '5'] },
  { id: '2', name: 'Lawnmower Dog', episode: 'S01E02', characterIds: ['1', '2'] }
]

// typeDefs is the schema
const typeDefs = `#graphql
  type Character {
    id: ID!
    name: String!
    status: String!
    origin: Location
    location: Location
    episodes: [Episode!]!
  }

  type Location {
    id: ID!
    name: String!
    dimension: String
    residents: [Character!]!
  }

  type Episode {
    id: ID!
    name: String!
    episode: String!
    characters: [Character!]!
  }

  type Query {
    character(id: ID!): Character
    characters: [Character!]!
    location(id: ID!): Location
    locations: [Location!]!
    episode(id: ID!): Episode
    episodes: [Episode!]!
  }

  type Mutation {
    addCharacter(name: String!, status: String!, originId: ID!, locationId: ID!): Character!
  }
`
const resolvers = {
  Query: {
    character: (_, { id }) => characters.find((c) => c.id === id),
    characters: () => characters,
    location: (_, { id }) => locations.find((l) => l.id === id),
    locations: () => locations,
    episode: (_, { id }) => episodes.find((e) => e.id === id),
    episodes: () => episodes
  },
  Mutation: {
    addCharacter: (_, { name, status, originId, locationId }) => {
      const character = {
        id: String(characters.length + 1),
        name,
        status,
        originId,
        locationId
      }
      characters.push(character)
      return character
    }
  },
  Character: {
    origin: (parent) => {
      return locations.find((l) => l.id === parent.originId) || null
    },
    location: (parent) => {
      // missing locationId → null, do not throw
      return locations.find((l) => l.id === parent.locationId) || null
    },
    episodes: (parent) => {
      return episodes.filter((ep) => ep.characterIds.includes(parent.id))
    }
  },
  Location: {
    residents: (parent) => {
      return characters.filter((c) => c.locationId === parent.id)
    }
  },
  Episode: {
    characters: (parent) => {
      return parent.characterIds
        .map((id) => characters.find((c) => c.id === id))
        .filter(Boolean)
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
