import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './apolloClient'
import WeatherDisplay from './WeatherDisplay'
import './Weather.css'

function Weather() {
  const [zip, setZip] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  async function getWeather() {
    setError(null)
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
            # query cod and message fields so we can recognize and handle errors
              cod
              message
            }
          }
        `,
        variables: { zip: parseInt(zip, 10) },
        fetchPolicy: 'network-only'
      })
      const result = json.data.getWeather
      setWeather(result)
    // check for error fields in the Weather object
      if (Number(result.cod) !== 200) {
        setError(result.message || 'City not found')
      }
    } catch (err) {
      setWeather(null)
      setError(err.message || 'Request failed')
    }
  }

  return (
    <div className="Weather">
      {error ? <p className="error">{error}</p> : null}
      {!error && weather ? <WeatherDisplay weather={weather} /> : null}

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
