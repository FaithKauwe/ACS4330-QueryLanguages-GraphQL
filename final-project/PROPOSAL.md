# Freezer tracker

## 1. What the app does

A small app for what’s in my kitchen freezer and garage freezer: what it is, when it went in, how much it weighs, and whether it’s getting old.

## 2. Types and fields

Three kinds of things: a frozen item, a food category (Protein, Vegetable, Ready Made Meal, Dessert, and so on), and which freezer it’s in.

```graphql
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
```

`frozenOn` is a date string (when it went into the freezer). `weight` is pounds.

## 3. Relationships

- Each item belongs to one category (chicken thighs → Protein).
- Each item lives in one freezer (Kitchen or Garage).
- A category lists every item in that category.
- A freezer lists every item in that freezer.

In the data, items store `categoryId` and `freezerId`. The API fills in the full category and freezer when you ask for them.

## 4. Queries

```graphql
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
```

- Everything, or one item by id.
- Search by name (do I have chicken thighs).
- Things frozen longer than `months` (for example 6).
- Browse by category or by freezer.

## 5. Mutations

```graphql
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
```

Add something when it goes in; remove it when we eat it or throw it out.
I'd like to implement this using QR codes with water proof stickers, I've looked into buying a little printer that prints them and then I would scan the QR sticker with my phone's camera which would take me to my Freezer website where I enter new information for a new item.  Scan in, scna out is the goal but this is just the scehma realtionships. 