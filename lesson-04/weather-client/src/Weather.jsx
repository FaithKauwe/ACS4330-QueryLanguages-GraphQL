import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './apolloClient'
import WeatherDisplay from './WeatherDisplay'
import './Weather.css'

function Weather() {
  const [zip, setZip] = useState('')
  const [units, setUnits] = useState('imperial')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  async function getWeather() {
    setError(null)
    try {
      const json = await client.query({
        query: gql`
          query GetWeather($zip: Int!, $units: Units) {
            getWeather(zip: $zip, units: $units) {
              temperature
              description
              feels_like
              humidity
              pressure
              lat
              lon
              # query cod and message fields so we can recognize and handle errors
              cod
              message
            }
          }
        `,
        variables: { zip: parseInt(zip, 10), units },
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
      {!error && weather ? (
        <WeatherDisplay weather={weather} units={units} />
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          getWeather()
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          placeholder="ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <fieldset className="units">
          <legend>Units</legend>
          <label>
            <input
              type="radio" // radio buttons force only one option to be allowed of the given options, in this case C or F
              name="units"
              value="imperial"
              checked={units === 'imperial'}
              onChange={() => setUnits('imperial')}
            />
            °F
          </label>
          <label>
            <input
              type="radio"
              name="units"
              value="metric"
              checked={units === 'metric'}
              onChange={() => setUnits('metric')}
            />
            °C
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Weather
