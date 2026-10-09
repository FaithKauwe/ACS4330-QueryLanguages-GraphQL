# Freezer tracker

A small GraphQL + React app for what’s in my kitchen freezer and garage freezer: name, date it went in, weight, category, and which freezer.

Proposal: [PROPOSAL.md](PROPOSAL.md)

Needs **Node 18+**. Use **two terminals**. Only one Apollo server should use port **4000**.

## 1. Start the API

```bash
cd final-project/server
npm install
npm start
```

You should see something like `Server ready at: http://localhost:4000/`

Apollo Sandbox is at [http://localhost:4000](http://localhost:4000) if you want to run queries by hand.

## 2. Start the React app

In a **second** terminal:

```bash
cd final-project/client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or whatever Local URL Vite prints).

## How to use it

1. Click the freezer **door** to open it.
2. The Pyrex tubs are **actions**, not the food:
   - **See what’s in there** — full list (search on that page)
   - **See protein / vegetable / …** — filter by category
   - **Use these soon** — items frozen about 6 months or longer
   - **Add an item** — form (includes kitchen vs garage)
   - **Use an item** — eat / toss (deletes from the in-memory list)
3. **Back to the freezer** returns to the door.

Data lives in memory on the server. Restarting `npm start` in `server/` resets the list to the seed food.

## If something doesn’t load

- Port 4000 already in use: stop the other lesson server (`Ctrl+C`), then start `final-project/server` again.
- The React page says it can’t reach the server: the API isn’t running, or it isn’t the freezer server (you’d see `getWeather` in Sandbox instead of `items`).
- `npm start` / `npm run dev` fails with no `package.json`: you need to be inside `final-project/server` or `final-project/client`, not `final-project/` itself.
