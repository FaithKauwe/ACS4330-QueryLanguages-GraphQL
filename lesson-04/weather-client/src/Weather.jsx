import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './apolloClient'
import WeatherDisplay from './WeatherDisplay'

function Weather() {
  const [zip, setZip] = useState('')
  const [weather, setWeather] = useState(null)

  async function getWeather() {
    try {
      const json = await client.query({
        query: gql`
          query GetWeather($zip: Int!) {
            getWeather(zip: $zip) {
              temperature
              description
              feels_like
              humidity
              pressure
            }
          }
        `,
        variables: { zip: parseInt(zip, 10) },
        fetchPolicy: 'network-only'
      })
      setWeather(json.data.getWeather)
    } catch (err) {
      console.error('query failed:', err)
    }
  }

  return (
    <div className="Weather">
      {weather ? <WeatherDisplay weather={weather} /> : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          getWeather()
        }}
      >
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Weather
