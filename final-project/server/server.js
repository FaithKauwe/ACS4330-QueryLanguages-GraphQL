import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const freezers = [
  { id: '1', name: 'Kitchen' },
  { id: '2', name: 'Garage' }
]

const categories = [
  { id: '1', name: 'Protein' },
  { id: '2', name: 'Vegetable' },
  { id: '3', name: 'Ready Made Meal' },
  { id: '4', name: 'Dessert' },
  { id: '5', name: 'Fruit' },
  { id: '6', name: 'Random' }
]

const items = [
  {
    id: '1',
    name: 'chicken thighs',
    frozenOn: '2026-04-01',
    weight: 2.5,
    categoryId: '1',
    freezerId: '2'
  },
  {
    id: '2',
    name: 'peas',
    frozenOn: '2026-08-15',
    weight: 1,
    categoryId: '2',
    freezerId: '1'
  },
  {
    id: '3',
    name: 'lasagna',
    frozenOn: '2025-12-01',
    weight: 3,
    categoryId: '3',
    freezerId: '2'
  },
  {
    id: '4',
    name: 'ice cream',
    frozenOn: '2026-09-20',
    weight: 0.5,
    categoryId: '4',
    freezerId: '1'
  },
  {
    id: '5',
    name: 'peaches',
    frozenOn: '2026-07-10',
    weight: 1.5,
    categoryId: '5',
    freezerId: '1'
  },
  {
    id: '6',
    name: 'white rice',
    frozenOn: '2026-03-18',
    weight: 2,
    categoryId: '6',
    freezerId: '2'
  }
]

const typeDefs = `#graphql
  type FrozenItem {
    id: ID!
    name: String!
    frozenOn: String!
    weight: Float!
    category: Category!
    freezer: Freezer!
  }

  type Category {
    id: ID!
    name: String!
    items: [FrozenItem!]!
  }

  type Freezer {
    id: ID!
    name: String!
    items: [FrozenItem!]!
  }

  type Query {
    items: [FrozenItem!]!
    item(id: ID!): FrozenItem
    itemsByName(search: String!): [FrozenItem!]!
    expiringSoon(months: Int!): [FrozenItem!]!
    categories: [Category!]!
    category(id: ID!): Category
    freezers: [Freezer!]!
    freezer(id: ID!): Freezer
  }

  type Mutation {
    addItem(
      name: String!
      frozenOn: String!
      weight: Float!
      categoryId: ID!
      freezerId: ID!
    ): FrozenItem!
    deleteItem(id: ID!): FrozenItem
  }
`

function monthsAgo(dateStr, months) {
  const frozen = new Date(dateStr)
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  return frozen <= cutoff
}

const resolvers = {
  Query: {
    items: () => items,
    item: (_, { id }) => items.find((i) => i.id === id),
    itemsByName: (_, { search }) => {
      const q = search.toLowerCase()
      return items.filter((i) => i.name.toLowerCase().includes(q))
    },
    expiringSoon: (_, { months }) => items.filter((i) => monthsAgo(i.frozenOn, months)),
    categories: () => categories,
    category: (_, { id }) => categories.find((c) => c.id === id),
    freezers: () => freezers,
    freezer: (_, { id }) => freezers.find((f) => f.id === id)
  },
  Mutation: {
    addItem: (_, { name, frozenOn, weight, categoryId, freezerId }) => {
      const item = {
        id: String(items.length + 1),
        name,
        frozenOn,
        weight,
        categoryId,
        freezerId
      }
      items.push(item)
      return item
    },
    deleteItem: (_, { id }) => {
      const index = items.findIndex((i) => i.id === id)
      if (index === -1) return null
      const [deleted] = items.splice(index, 1)
      return deleted
    }
  },
  FrozenItem: {
    category: (parent) => categories.find((c) => c.id === parent.categoryId),
    freezer: (parent) => freezers.find((f) => f.id === parent.freezerId)
  },
  Category: {
    items: (parent) => items.filter((i) => i.categoryId === parent.id)
  },
  Freezer: {
    items: (parent) => items.filter((i) => i.freezerId === parent.id)
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
