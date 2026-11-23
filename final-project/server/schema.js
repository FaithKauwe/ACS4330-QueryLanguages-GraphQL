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

export default typeDefs
