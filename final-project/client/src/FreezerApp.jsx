import { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client/react'
import {
  GET_ITEMS,
  GET_CATEGORIES,
  GET_FREEZERS,
  ITEMS_BY_NAME,
  ADD_ITEM,
  DELETE_ITEM
} from './queries'
import './FreezerApp.css'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function ItemTable({ items, onDelete, deleting }) {
  if (!items.length) {
    return <p>No items.</p>
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
          <th></th>
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
            <td>
              <button
                type="button"
                disabled={deleting}
                onClick={() => onDelete(item.id)}
              >
                Eat / toss
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function FreezerApp() {
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [frozenOn, setFrozenOn] = useState(today())
  const [weight, setWeight] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [freezerId, setFreezerId] = useState('')
  const [formError, setFormError] = useState(null)
  const [useSearchResults, setUseSearchResults] = useState(false)

  const itemsQuery = useQuery(GET_ITEMS)
  const categoriesQuery = useQuery(GET_CATEGORIES)
  const freezersQuery = useQuery(GET_FREEZERS)

  const [runSearch, searchQuery] = useLazyQuery(ITEMS_BY_NAME, {
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
  const list = showingSearch ? searchQuery.data.itemsByName : (itemsQuery.data?.items ?? [])

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
    } catch (err) {
      setFormError(err.message || 'Could not add item.')
    }
  }

  async function handleDelete(id) {
    setFormError(null)
    try {
      await deleteItem({ variables: { id } })
      if (showingSearch) {
        runSearch({ variables: { search } })
      }
    } catch (err) {
      setFormError(err.message || 'Could not delete.')
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    runSearch({ variables: { search: q } })
    setUseSearchResults(true)
  }

  return (
    <div className="FreezerApp">
      <h1>Freezer tracker</h1>
      <p className="lede">Kitchen and garage. Add it when it goes in; remove it when it’s gone.</p>

      {loading ? <p>Loading…</p> : null}
      {loadError ? <p className="error">Can’t reach the server. Is it running on port 4000? {loadError}</p> : null}
      {formError ? <p className="error">{formError}</p> : null}
      {addState.error ? <p className="error">{addState.error.message}</p> : null}

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

      <h2>{showingSearch ? 'Search results' : 'What’s in there'}</h2>
      <ItemTable
        items={list}
        onDelete={handleDelete}
        deleting={deleteState.loading}
      />

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
          Freezer
          <select value={freezerId} onChange={(e) => setFreezerId(e.target.value)}>
            <option value="">Choose…</option>
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
    </div>
  )
}

export default FreezerApp
