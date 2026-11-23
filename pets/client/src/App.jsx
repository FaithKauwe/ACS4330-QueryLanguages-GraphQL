import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_PETS, ADD_PET, DELETE_PET, UPDATE_PET } from './queries.js'

function RenamePet({ pet, updatePet }) {
  const [name, setName] = useState(pet.name)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        updatePet({ variables: { id: pet.id, name } })
      }}
    >
      <input value={name} onChange={(e) => setName(e.target.value)} aria-label={`Rename ${pet.name}`} />
      <button type="submit">Rename</button>
    </form>
  )
}

export default function App() {
  const { data, loading, error } = useQuery(GET_PETS)
  const [addPet, { error: addError }] = useMutation(ADD_PET, {
    update(cache, { data }) {
      if (!data?.addPet) return
      cache.modify({
        fields: {
          pets(existing = []) {
            const newRef = cache.writeFragment({
              data: data.addPet,
              fragment: gql`
                fragment NewPet on Pet {
                  id
                  name
                  species
                }
              `,
            })
            return [...existing, newRef]
          },
        },
      })
    },
  })
  const [deletePet] = useMutation(DELETE_PET, {
    update(cache, _result, { variables }) {
      cache.evict({ id: cache.identify({ __typename: 'Pet', id: variables.id }) })
      cache.gc()
    },
  })
  const [updatePet] = useMutation(UPDATE_PET)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('cat')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addPet({
        variables: { name, species },
        optimisticResponse: {
          addPet: {
            __typename: 'Pet',
            id: `temp-${Date.now()}`,
            name,
            species,
          },
        },
      })
      setName('')
    } catch {
      // addError is set; the optimistic pet has been removed
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <main>
      <h1>Pets</h1>
      {addError && <p role="alert">Could not add pet: {addError.message}</p>}
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <select value={species} onChange={e => setSpecies(e.target.value)}>
          <option>cat</option>
          <option>dog</option>
          <option>bird</option>
          <option>rabbit</option>
          <option>other</option>
        </select>
        <button>Add Pet</button>
      </form>
      <ul>
        {data.pets.map(pet => (
          <li key={pet.id} style={{ opacity: String(pet.id).startsWith('temp-') ? 0.5 : 1 }}>
            {pet.name} ({pet.species})
            <RenamePet pet={pet} updatePet={updatePet} />
            <button
              type="button"
              onClick={() =>
                deletePet({
                  variables: { id: pet.id },
                  optimisticResponse: { deletePet: true },
                })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
