import { useState } from 'react'
import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react'
import WeatherDisplay from './WeatherDisplay'
import './Weather.css'

const GET_WEATHER = gql`
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
`

function Weather() {
  const [zip, setZip] = useState('')
  const [units, setUnits] = useState('imperial')
  const [getWeather, { loading, error, data }] = useLazyQuery(GET_WEATHER, {
    fetchPolicy: 'network-only'
  })

  const weather = data?.getWeather
  const displayError =
    error?.message ||
    (weather && Number(weather.cod) !== 200 ? weather.message || 'City not found' : null)

  return (
    <div className="Weather">
      {loading ? <p>Loading...</p> : null}
      {displayError ? <p className="error">{displayError}</p> : null}
      {!displayError && weather && Number(weather.cod) === 200 ? (
        <WeatherDisplay weather={weather} units={units} />
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          getWeather({
            variables: {
              zip: parseInt(zip, 10),
              units
            }
          })
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
