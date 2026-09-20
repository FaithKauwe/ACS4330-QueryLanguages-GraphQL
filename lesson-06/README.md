# Lesson 6 — Pet mutations

From this folder: `npm start` → [http://localhost:4000](http://localhost:4000)

## CRUD operations (Challenge 4)

Paste these into Apollo Sandbox.

### Create

```graphql
mutation {
  addPet(name: "Ginger", species: Cat, age: 2) {
    name
    species
    age
  }
}
```

`species` is the `Species` enum (`Dog` or `Cat`), so it is not quoted.

### Read
```graphql
query {
  getPet(index: 0) {
    name
    species
    age
  }
}
```

### Update
```graphql
mutation {
  updatePet(id: 1, name: "Ponito") {
    name
    species
    age
  }
}
```
### Delete
```graphql
mutation {
  deletePet(id: 0) {
    name
    species
    age
  }
}
```