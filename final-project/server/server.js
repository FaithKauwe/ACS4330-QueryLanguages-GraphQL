import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import 'dotenv/config'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import seed from './seed.js'
import FrozenItem from './models/FrozenItem.js'
import Category from './models/Category.js'
import Freezer from './models/Freezer.js'

await mongoose.connect(process.env.MONGO_URI)
console.log('Connected to MongoDB')

await seed({ Category, Freezer, FrozenItem })

const server = new ApolloServer({ typeDefs, resolvers })
const port = Number(process.env.PORT) || 4000

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async () => ({ FrozenItem, Category, Freezer }),
})

console.log(`Server ready at: ${url}`)
