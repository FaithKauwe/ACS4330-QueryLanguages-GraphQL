import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import 'dotenv/config'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import Pet from './models/Pet.js'
import Shelter from './models/Shelter.js'

await mongoose.connect(process.env.MONGO_URI)
console.log('Connected to MongoDB')

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({ Pet, Shelter }),
})

console.log(`Server ready at: ${url}`)
