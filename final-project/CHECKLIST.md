# Freezer project checklist

Check things off as you go. Tonight’s work is already marked done.

**Only one thing on port 4000 at a time.** If Sandbox looks like weather or Rick and Morty, you started the wrong folder.

---

## Tonight (Oct 4) — done

- [x] Lesson 9 Challenge 1 — `context.requestTime` on `lesson-03/server.js`
- [x] Lesson 9 Challenge 2 — `x-client-name` header on the same weather server
- [x] Project idea: freezer tracker (Kitchen + Garage)
- [x] `final-project/PROPOSAL.md` written and pushed
- [x] In-memory Apollo server in `final-project/server/` (schema, seed data, queries, mutations, nested category/freezer)
- [x] Categories Fruit + Random; seed items peaches and white rice
- [x] `npm install` in `final-project/server/`

---

## Manual testing (do this — recipe, not vibes)

Do these in order. Each one: start server → browser → paste query → look at the result → stop the server (`Ctrl+C`) before the next.

### A. Weather context (Lesson 9 — confirm the logs)

1. Terminal:

```bash
cd lesson-03
npm start
```

2. Browser: http://localhost:4000
3. Query editor, paste:

```graphql
query {
  getWeather(zip: 94122, units: imperial) {
    temperature
    description
  }
}
```

4. Headers: name `x-client-name`, value `my-test-client`
5. Run.
6. **Look at the terminal**, not only the JSON. You want lines like `Request at:` (a timestamp) and `Client: my-test-client`.
7. `Ctrl+C` to stop.

### B. Freezer list (Class 10 MVP — the one that matters)

1. Terminal:

```bash
cd final-project/server
npm start
```

2. Browser: http://localhost:4000  
   You should see queries named `items`, `item`, `freezers` — not `getWeather`.
3. Paste:

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

4. Check: chicken thighs → Protein + Garage; peaches → Fruit + Kitchen; white rice → Random + Garage.
5. Leave this server running for C–F below (same session).

### C. Search

```graphql
{
  itemsByName(search: "chicken") {
    name
    freezer {
      name
    }
  }
}
```

Expect chicken thighs in Garage.

### D. Getting old (~6 months)

```graphql
{
  expiringSoon(months: 6) {
    name
    frozenOn
  }
}
```

Expect older stuff (lasagna, maybe chicken thighs / white rice depending on today’s date). Ice cream and peas should usually not show.

### E. Add something

```graphql
mutation {
  addItem(
    name: "broccoli"
    frozenOn: "2026-10-01"
    weight: 1
    categoryId: "2"
    freezerId: "1"
  ) {
    id
    name
    category {
      name
    }
    freezer {
      name
    }
  }
}
```

Expect Vegetable + Kitchen.

### F. Delete something

Use the `id` from add (often `"7"` if you haven’t restarted). If you restarted, skip or add again first.

```graphql
mutation {
  deleteItem(id: "7") {
    name
  }
}
```

Then run `{ items { name } }` and broccoli should be gone.

Restarting `npm start` resets the list to the seed data. That is normal.

---

## Still to do (course project)

### Class 10 — in-memory MVP

- [x] Manual tests B–F above
- [x] Push `final-project/server/`
- [x] Mark tracker if they want an L10 check

MongoDB is on the **course schedule** and listed as **stretch** on the project spec. Skip until/unless you have time or the instructor requires it.

### Class 11 — React client

- [x] Vite app in `final-project/client/`
- [x] `ApolloProvider` pointing at http://localhost:4000/
- [x] List items (category + freezer names)
- [x] At least one query with **variables** (`useLazyQuery` or `useQuery`)
- [x] Form or button that runs **addItem** or **deleteItem**
- [x] Loading and error UI (no blank crash)
- [ ] You: run the app and click through list / search / add / delete

Two terminals again: `final-project/server` → 4000, `final-project/client` → 5173. Test in the **app**, not only Sandbox.

### Class 12 — polish

- [ ] Loading / error states feel okay
- [ ] Search and/or expiring list on the page if time
- [ ] Stretch only if required: Mongo, login, deploy, QR stickers

### Class 13 — presentation (5 min, no slides)

- [ ] Demo the app
- [ ] Show the three types and one relationship (item → freezer)
- [ ] Walk through one resolver (e.g. `FrozenItem.freezer`)
- [ ] One thing that was annoying

### Class 14 — submit

- [ ] Everything in `final-project/`
- [ ] Tracker: repo link (deploy URL only if you actually deployed)

---

## Optional / later (not required for the spec)

- [ ] QR waterproof stickers + scan in/out (your real-life goal; not needed to pass)
- [ ] MongoDB
- [ ] Auth via context
- [ ] Deploy
- [ ] Subscriptions

---

## If Sandbox is “wrong”

| You see | You started |
|---|---|
| `getWeather` | `lesson-03` |
| `character` / Rick | `lesson-08` |
| `items` / `freezers` | `final-project/server` — this is the one |
