# Lesson 8 — Nested resolvers

From this folder: `npm start` → [http://localhost:4000](http://localhost:4000)

## Challenge 4 — three levels of nesting

All characters → current location → residents at that location.

```graphql
{
  characters {
    name
    location {
      name
      residents {
        name
      }
    }
  }
}
```

## Challenge 5 — add a character

`residents` looks at `locationId`, not `originId`. After mutate, query the location you passed as `locationId`.

```graphql
mutation {
  addCharacter(
    name: "Birdperson"
    status: "Alive"
    originId: "1"
    locationId: "3"
  ) {
    id
    name
    location {
      name
    }
  }
}
```

```graphql
{
  location(id: "3") {
    name
    residents {
      name
    }
  }
}
```

## Challenge 6 — null safety

Jerry's `locationId` is `'999'` (no matching location). `location` on Character is nullable; the resolver returns `null` instead of throwing.

```graphql
{
  character(id: "5") {
    name
    location {
      name
    }
  }
}
```

Expect `location: null` and no GraphQL error.
