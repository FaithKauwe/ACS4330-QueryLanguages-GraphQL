import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './apolloClient'

function Weather() {
    const [ zip, setZip ] = useState('')
    const [ weather, setWeather ] = useState(null)
    async function getWeather() {
        console.log('submit zip:', zip)
        try {
          const json = await client.query({
            query: gql`
              query GetWeather($zip: Int!) {
                getWeather(zip: $zip) {
                  temperature
                  description
                }
              }
            `,
            variables: { zip: parseInt(zip, 10) },
            fetchPolicy: 'network-only'
          })
          console.log('query result:', json)
          setWeather(json)
        } catch(err) {
          console.error('query failed:', err)
        }
      }
  
      return (
        <div className="Weather">
          {weather?.data?.getWeather ? (
            <h1>{weather.data.getWeather.temperature} — {weather.data.getWeather.description}</h1>
          ) : null}
          
          <form onSubmit={(e) => {
            e.preventDefault()
            getWeather()
          }}>
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
  }

export default Weather