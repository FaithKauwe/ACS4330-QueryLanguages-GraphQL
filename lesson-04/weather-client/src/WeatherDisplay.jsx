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

// Assumes imperial °F (Lesson 3 default). Challenge 9 can refine this for metric.
function tempColor(temp) {
  if (temp == null) return undefined
  if (temp <= 32) return '#2563eb'
  if (temp <= 50) return '#7c3aed'
  if (temp <= 75) return '#ea580c'
  return '#dc2626'
}

function WeatherDisplay({ weather }) {
  return (
    <div className="WeatherDisplay">
      <div className="emoji" aria-hidden="true">
        {weatherEmoji(weather.description)}
      </div>
      <h1 style={{ color: tempColor(weather.temperature) }}>
        {weather.temperature}°
      </h1>
      <p className="description">{weather.description}</p>
      <ul>
        <li>Feels like: {weather.feels_like}°</li>
        <li>Humidity: {weather.humidity}%</li>
        <li>Pressure: {weather.pressure}</li>
      </ul>
    </div>
  )
}

export default WeatherDisplay
