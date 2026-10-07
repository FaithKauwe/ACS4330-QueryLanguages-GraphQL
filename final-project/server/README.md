# Freezer tracker server

```bash
cd final-project/server
npm install
npm start
```

Then open http://localhost:4000 (stop any other lesson using port 4000 first).

```graphql
{
  items {
    name
    frozenOn
    weight
    category {
      name
    }
    freezer {
      name
    }
  }
}
```
