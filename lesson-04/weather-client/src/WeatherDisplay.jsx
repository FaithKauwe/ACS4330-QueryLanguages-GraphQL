import './WeatherDisplay.css'

function weatherEmoji(description) {
  const d = (description || '').toLowerCase()
  if (d.includes('thunder')) return '⛈️'
  if (d.includes('snow') || d.includes('sleet')) return '❄️'
  if (d.includes('rain') || d.includes('drizzle')) return '🌧️'
  if (d.includes('mist') || d.includes('fog') || d.includes('haze') || d.includes('smoke')) {
    return '🌫️'
  }
  if (d.includes('overcast')) return '☁️'
  if (d.includes('cloud')) return '⛅'
  if (d.includes('clear') || d.includes('sun')) return '☀️'
  return '🌤️'
}

function tempColor(temp, units) {
  if (temp == null) return undefined
// account for Frhenheit or celsius
  const freezing = units === 'metric' ? 0 : 32
  const cool = units === 'metric' ? 10 : 50
  const warm = units === 'metric' ? 24 : 75
  if (temp <= freezing) return '#2563eb'
  if (temp <= cool) return '#7c3aed'
  if (temp <= warm) return '#ea580c'
  return '#dc2626'
}

function WeatherDisplay({ weather, units = 'imperial' }) {
  return (
    <div className="WeatherDisplay">
      <div className="emoji" aria-hidden="true">
        {weatherEmoji(weather.description)}
      </div>
      <h1 style={{ color: tempColor(weather.temperature, units) }}>
        {weather.temperature}°{units === 'metric' ? 'C' : 'F'}
      </h1>
      <p className="description">{weather.description}</p>
      <ul>
        <li>Feels like: {weather.feels_like}°</li>
        <li>Humidity: {weather.humidity}%</li>
        <li>Pressure: {weather.pressure}</li>
        <li>Lat: {weather.lat}</li>
        <li>Lon: {weather.lon}</li>
      </ul>
    </div>
  )
}

export default WeatherDisplay
