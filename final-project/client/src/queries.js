import { gql } from '@apollo/client'

export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      frozenOn
      weight
      category {
        id
        name
      }
      freezer {
        id
        name
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`

export const GET_FREEZERS = gql`
  query GetFreezers {
    freezers {
      id
      name
    }
  }
`

export const ITEMS_BY_NAME = gql`
  query ItemsByName($search: String!) {
    itemsByName(search: $search) {
      id
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
`

export const EXPIRING_SOON = gql`
  query ExpiringSoon($months: Int!) {
    expiringSoon(months: $months) {
      id
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
`

export const ADD_ITEM = gql`
  mutation AddItem(
    $name: String!
    $frozenOn: String!
    $weight: Float!
    $categoryId: ID!
    $freezerId: ID!
  ) {
    addItem(
      name: $name
      frozenOn: $frozenOn
      weight: $weight
      categoryId: $categoryId
      freezerId: $freezerId
    ) {
      id
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
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
      name
    }
  }
`
