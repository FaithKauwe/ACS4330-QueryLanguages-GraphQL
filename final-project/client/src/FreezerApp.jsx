import { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client/react'
import {
  GET_ITEMS,
  GET_CATEGORIES,
  GET_FREEZERS,
  ITEMS_BY_NAME,
  EXPIRING_SOON,
  ADD_ITEM,
  DELETE_ITEM
} from './queries'
import './FreezerApp.css'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const CAT_PACK = ['#f4d35e', '#7dce82', '#6ec6ff', '#ff9f7a', '#d4a5ff', '#ffd166']

function ItemTable({ items, onDelete, deleting }) {
  if (!items.length) {
    return <p>Nothing in here.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date in</th>
          <th>Lbs</th>
          <th>Category</th>
          <th>Freezer</th>
          {onDelete ? <th></th> : null}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.frozenOn}</td>
            <td>{item.weight}</td>
            <td>{item.category?.name}</td>
            <td>{item.freezer?.name}</td>
            {onDelete ? (
              <td>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => onDelete(item.id)}
                >
                  Eat / toss
                </button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function FreezerApp() {
  const [view, setView] = useState('home')
  const [doorOpen, setDoorOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [frozenOn, setFrozenOn] = useState(today())
  const [weight, setWeight] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [freezerId, setFreezerId] = useState('')
  const [formError, setFormError] = useState(null)
  const [useSearchResults, setUseSearchResults] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState(null)

  const itemsQuery = useQuery(GET_ITEMS)
  const categoriesQuery = useQuery(GET_CATEGORIES)
  const freezersQuery = useQuery(GET_FREEZERS)

  const [runSearch, searchQuery] = useLazyQuery(ITEMS_BY_NAME, {
    fetchPolicy: 'network-only'
  })
  const [runSoon, soonQuery] = useLazyQuery(EXPIRING_SOON, {
    fetchPolicy: 'network-only'
  })

  const [addItem, addState] = useMutation(ADD_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }]
  })
  const [deleteItem, deleteState] = useMutation(DELETE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }]
  })

  const categories = categoriesQuery.data?.categories ?? []
  const freezers = freezersQuery.data?.freezers ?? []

  const showingSearch = useSearchResults && searchQuery.data
  const allItems = itemsQuery.data?.items ?? []
  let list = allItems
  if (categoryFilter) {
    list = allItems.filter((i) => i.category?.id === categoryFilter.id)
  }
  if (showingSearch) {
    list = searchQuery.data.itemsByName
  }

  const loadError =
    itemsQuery.error?.message ||
    categoriesQuery.error?.message ||
    freezersQuery.error?.message
  const loading = itemsQuery.loading && !itemsQuery.data

  async function handleAdd(e) {
    e.preventDefault()
    setFormError(null)
    const lbs = parseFloat(weight)
    if (!name.trim() || !categoryId || !freezerId || Number.isNaN(lbs)) {
      setFormError('Fill in name, weight, category, and freezer.')
      return
    }
    try {
      await addItem({
        variables: {
          name: name.trim(),
          frozenOn,
          weight: lbs,
          categoryId,
          freezerId
        }
      })
      setName('')
      setWeight('')
      setFrozenOn(today())
      setCategoryFilter(null)
      setView('list')
    } catch (err) {
      setFormError(err.message || 'Could not add item.')
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    runSearch({ variables: { search: q } })
    setUseSearchResults(true)
  }

  async function handleDelete(id) {
    setFormError(null)
    try {
      await deleteItem({ variables: { id } })
    } catch (err) {
      setFormError(err.message || 'Could not delete.')
    }
  }

  function goHome() {
    setView('home')
    setFormError(null)
    setUseSearchResults(false)
    setSearch('')
    setCategoryFilter(null)
  }

  function openList(category = null) {
    setCategoryFilter(category)
    setUseSearchResults(false)
    setSearch('')
    setView('list')
  }

  return (
    <div className="FreezerApp">
      <h1>What’s in the freezer</h1>
      <p className="lede">Open the door, then pick a pack — that’s the menu, not the food.</p>

      {loading ? <p>Loading…</p> : null}
      {loadError ? (
        <p className="error">Can’t reach the server. Is it running on port 4000? {loadError}</p>
      ) : null}
      {formError ? <p className="error">{formError}</p> : null}
      {addState.error ? <p className="error">{addState.error.message}</p> : null}

      {view === 'home' ? (
        <>
          <p className="hint">Click the door to open it.</p>
          <div className="row">
            <div className="unit">
              <div className={doorOpen ? 'cabinet open' : 'cabinet'}>
                <div className="interior">
                  <div className="shelf">
                    <div className="shelf-label">Look</div>
                    <div className="shelf-packs">
                      <button
                        type="button"
                        className="pack action"
                        style={{ '--lid': '#f4d35e' }}
                        onClick={() => openList()}
                      >
                        See what’s in there
                        <small>Kitchen + garage</small>
                      </button>
                    </div>
                  </div>
                  <div className="shelf shelf-type">
                    <div className="shelf-label">By type</div>
                    <div className="shelf-packs">
                      {categories.map((c, i) => (
                        <button
                          key={c.id}
                          type="button"
                          className={
                            ['dessert', 'fruit'].includes(c.name.toLowerCase())
                              ? 'pack action pack-narrow'
                              : 'pack action'
                          }
                          style={{ '--lid': CAT_PACK[i % CAT_PACK.length] }}
                          onClick={() => openList(c)}
                        >
                          See {c.name.toLowerCase()}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="pack action"
                        style={{ '--lid': '#ff6b6b' }}
                        onClick={() => {
                          runSoon({ variables: { months: 6 } })
                          setView('soon')
                        }}
                      >
                        Use these soon
                        <small>About 6 months in</small>
                      </button>
                    </div>
                  </div>
                  <div className="shelf">
                    <div className="shelf-label">Change</div>
                    <div className="shelf-packs">
                      <button
                        type="button"
                        className="pack action"
                        style={{ '--lid': '#7dce82' }}
                        onClick={() => setView('add')}
                      >
                        Add an item
                        <small>Opens a form</small>
                      </button>
                      <button
                        type="button"
                        className="pack action"
                        style={{ '--lid': '#ff9f7a' }}
                        onClick={() => setView('use')}
                      >
                        Use an item
                        <small>Eat / toss</small>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="door"
                  aria-expanded={doorOpen}
                  aria-label={doorOpen ? 'Close freezer' : 'Open freezer'}
                  onClick={() => setDoorOpen((open) => !open)}
                >
                  <span className="door-label">{doorOpen ? '' : 'Open'}</span>
                  <span className="handle" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {view === 'list' ? (
        <section className="panel">
          <button type="button" className="ghost" onClick={goHome}>
            ← Back to the freezer
          </button>
          <h2>{categoryFilter ? `See ${categoryFilter.name.toLowerCase()}` : 'What’s in there'}</h2>
          {!categoryFilter ? (
            <>
              <form className="search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search (e.g. chicken)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Search</button>
                {showingSearch ? (
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => {
                      setSearch('')
                      setUseSearchResults(false)
                      itemsQuery.refetch()
                    }}
                  >
                    Show all
                  </button>
                ) : null}
              </form>
              {searchQuery.loading ? <p>Searching…</p> : null}
            </>
          ) : null}
          <ItemTable items={list} />
        </section>
      ) : null}

      {view === 'soon' ? (
        <section className="panel">
          <button type="button" className="ghost" onClick={goHome}>
            ← Back to the freezer
          </button>
          <h2>Use these soon</h2>
          <p className="lede">Frozen about 6 months or longer — eat these first.</p>
          {soonQuery.loading ? <p>Loading…</p> : null}
          {soonQuery.error ? <p className="error">{soonQuery.error.message}</p> : null}
          <ItemTable items={soonQuery.data?.expiringSoon ?? []} />
        </section>
      ) : null}

      {view === 'use' ? (
        <section className="panel">
          <button type="button" className="ghost" onClick={goHome}>
            ← Back to the freezer
          </button>
          <h2>Use an item</h2>
          <p className="lede">Eat / toss takes it out of the list.</p>
          <ItemTable
            items={allItems}
            onDelete={handleDelete}
            deleting={deleteState.loading}
          />
        </section>
      ) : null}

      {view === 'add' ? (
        <section className="panel">
          <button type="button" className="ghost" onClick={goHome}>
            ← Back to the freezer
          </button>
          <h2>Put something in</h2>
          <form className="add" onSubmit={handleAdd}>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Date in
              <input type="date" value={frozenOn} onChange={(e) => setFrozenOn(e.target.value)} />
            </label>
            <label>
              Weight (lbs)
              <input
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </label>
            <label>
              Category
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Choose…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Which freezer
              <select value={freezerId} onChange={(e) => setFreezerId(e.target.value)}>
                <option value="">Kitchen or garage…</option>
                {freezers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={addState.loading}>
              {addState.loading ? 'Saving…' : 'Add'}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  )
}

export default FreezerApp
