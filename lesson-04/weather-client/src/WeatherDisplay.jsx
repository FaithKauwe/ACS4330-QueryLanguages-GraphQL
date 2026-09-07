function WeatherDisplay({ weather }) {
  return (
    <div className="WeatherDisplay">
      <h1>{weather.temperature}°</h1>
      <p>{weather.description}</p>
      <ul>
        <li>Feels like: {weather.feels_like}°</li>
        <li>Humidity: {weather.humidity}%</li>
        <li>Pressure: {weather.pressure}</li>
      </ul>
    </div>
  )
}

export default WeatherDisplay
