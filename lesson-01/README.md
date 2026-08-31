# Lesson 1 — GraphQL Queries

Write the query that solves each question. Use the Rick and Morty GraphQL API at https://rickandmortyapi.com/graphql.

## 1. Get Rick Sanchez's name and status.

```graphql
query {
  
  character(id: 1) {
    name
    status
  }
}
```

## 2. Get Morty Smith's name, species, and gender.

```graphql
query {
  
  
  character(id: 2) {
    name
    species
    gender
  }
}
```

## 3. Get Summer Smith's name and the name of her current location.

```graphql
{
  character(id: 3) {
    name
    location {
      name
    }
  }
}
```

## 4. Get the total count of all characters.

```graphql
{
  characters {
    info {
      count
    }
  }
}
```

## 5. Get the name and air date of episode 1.

```graphql
{
  episode(id: 1) {
    name
    air_date
  }
}
```

## 6. Get Rick's name and the name of his origin location.

```graphql
{
  character(id: 1) {
    name
    origin {
      name
    }
  }
}
```

## 7. Get the dimension of Rick's origin location.

```graphql
{
  character(id: 1) {
    origin {
      dimension
    }
  }
}
```

## 8. Get both Rick and Morty's names and species using a single query. Use aliases!

```graphql
{
  rick: character(id: 1) {
    name
    species
  }
  morty: character(id: 2) {
    name
    species
  }
}
```

## 9. Get both Rick's origin location name and Morty's origin location name using a single query. Use aliases!

```graphql
{
  rick: character(id: 1) {
    origin {
      name
    }
  }
  morty: character(id: 2) {
    origin {
      name
    }
  }
}
```

## 10. Get the names of the first 3 residents of the Citadel of Ricks.

```graphql
{
  location(id: 3) {
    residents {
      name
    }
  }
}
```
