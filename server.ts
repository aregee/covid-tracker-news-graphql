import { makeExecutableSchema, ApolloServer } from 'apollo-server-micro'
import { default as typeDefs } from './schema'
import resolvers from './resolvers'
import fetch from 'node-fetch'
import microCors = require('micro-cors');


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

let results = null
let ndtvResults = null

const server = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  context() {
    const getResults = async () => {
      if (results) {
        return results
      }
      const res = await fetch('https://pomber.github.io/covid19/timeseries.json')
      results = await res.json()
      return results
    }

    const getNdtvResults = async () => {
      if (ndtvResults) {
        return ndtvResults
      }
      const res = await fetch('https://edata.ndtv.com/cricket/coronavirus/data.json')
      ndtvResults = await res.json()
      return ndtvResults;
    }
    
    return {
      getResults,
      getNdtvResults
    }
  },

})

const cors = microCors()

const handler = server.createHandler({ path: '/' })

export default cors((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))