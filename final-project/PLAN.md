# Freezer tracker — data plan (Week 1)

Reuses the ACS 4330 freezer app. Last term this lived in in-memory arrays. This plan is how those types land in MongoDB.

## Types and fields

### FrozenItem

| Field | GraphQL | Database | Notes |
|---|---|---|---|
| id | `ID!` | `_id` | Mongoose virtual `id` |
| name | `String!` | String, required, trim | e.g. chicken thighs |
| frozenOn | `String!` | Date, required | stored as a Date; API can still expose a string |
| weight | `Float!` | Number, required, min 0 | pounds |
| category | `Category!` | `categoryId` (ObjectId, ref Category, required, indexed) | see relationships |
| freezer | `Freezer!` | `freezerId` (ObjectId, ref Freezer, required, indexed) | see relationships |

### Category

| Field | GraphQL | Database | Notes |
|---|---|---|---|
| id | `ID!` | `_id` | |
| name | `String!` | String, required, trim | Protein, Vegetable, Ready Made Meal, Dessert, Fruit, Random |
| items | `[FrozenItem!]!` | not stored | nested resolver: items with this `categoryId` |

### Freezer

| Field | GraphQL | Database | Notes |
|---|---|---|---|
| id | `ID!` | `_id` | |
| name | `String!` | String, required, trim | Kitchen, Garage |
| items | `[FrozenItem!]!` | not stored | nested resolver: items with this `freezerId` |

Seed categories and the two freezers; items are what the user adds and deletes.

## Relationships: embed vs reference

**Item → Category: reference** (`categoryId` on the item).

A category is its own thing: we list categories, filter the UI by type, and many items share Protein. Embedding a copy of `{ name: "Protein" }` on every item would duplicate names and make renaming a category painful. Embedding every item *inside* a Category document would make “search all items” and “expiring soon across types” scan every category.

**Item → Freezer: reference** (`freezerId` on the item).

Kitchen and Garage are queried on their own. Items are also queried without a freezer (`itemsByName`, `expiringSoon`). Embedding all packs inside a freezer document would force those queries to unpack both freezers, and moving an item kitchen → garage would mean rewriting two big documents.

**Category.items and Freezer.items: not embedded arrays.**

The other side of the same references. Nested resolvers run `FrozenItem.find({ categoryId })` and `FrozenItem.find({ freezerId })` only when the client asks for `items`.

That matches Pet → Shelter from the Pets lesson: store IDs, expose objects on the API.

## Why not embed anything this week

Vaccinations-on-a-pet is a good embed: the child has no life outside the parent. Nothing in this schema is like that. Weight and `frozenOn` are fields on the item, not child documents.

## Indexes

`categoryId` and `freezerId` on FrozenItem — those are the fields the nested resolvers query by.

## Validation

- FrozenItem: name, frozenOn, weight, categoryId, freezerId required; weight ≥ 0
- Category, Freezer: name required

## GraphQL vs Mongo

The API still looks like last term (`category: Category!`, not `categoryId`). The database stores IDs. Nested resolvers are the join, same as `Pet.shelter`.
