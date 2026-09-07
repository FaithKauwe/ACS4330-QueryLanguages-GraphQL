import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import 'dotenv/config'

const apikey = process.env.OPENWEATHERMAP_API_KEY
const typeDefs = `#graphql
# no ! on these (Float!) bc if the zip code is bad, all fields will return null and we dont want to break the API  
type Weather {
  temperature: Float
  description: String
  feels_like: Float
  temp_min: Float
  temp_max: Float
  pressure: Int
  humidity: Int
  lat: Float
  lon: Float
  cod: Int
  message: String
}

type Query {
# zip is just the argument name for the zip code, has to match the resolver
getWeather(zip: Int!, units: Units): Weather!
}

#enum is not a scalar. enum is defining a new type but the shape is diff when using keyword enum vs using keyword type
enum Units {
  standard
  metric
  imperial
}
`
const resolvers = {
    Query: {
      getWeather: async (_, { zip, units = 'imperial' }) => {
        const apikey = process.env.OPENWEATHERMAP_API_KEY
        const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
        const res = await fetch(url)
        const json = await res.json()
        return {
            temperature: json.main?.temp ?? null,
            description: json.weather?.[0]?.description ?? null,
            feels_like: json.main?.feels_like ?? null,
            temp_min: json.main?.temp_min ?? null,
            temp_max: json.main?.temp_max ?? null,
            pressure: json.main?.pressure ?? null,
            humidity: json.main?.humidity ?? null,
            lat: json.coord?.lat ?? null,
            lon: json.coord?.lon ?? null,
            cod: Number(json.cod),
            message: json.message ?? null
          }      }
    }
  }

  const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)
