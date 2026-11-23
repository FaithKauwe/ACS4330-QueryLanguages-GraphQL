import { gql } from '@apollo/client'

export const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      species
    }
  }
`

export const ADD_PET = gql`
  mutation AddPet($name: String!, $species: String!) {
    addPet(name: $name, species: $species) {
      id
      name
      species
    }
  }
`

export const DELETE_PET = gql`
  mutation DeletePet($id: ID!) {
    deletePet(id: $id)
  }
`

export const UPDATE_PET = gql`
  mutation UpdatePet($id: ID!, $name: String) {
    updatePet(id: $id, name: $name) {
      id
      name
    }
  }
`
