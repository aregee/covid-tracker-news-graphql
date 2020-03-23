import { makeExecutableSchema, ApolloServer } from 'apollo-server-micro'
import { default as typeDefs } from './schema'
import resolvers from './resolvers'
import fetch from 'node-fetch'
import microCors = require('micro-cors');
import fs = require('fs');
import util = require('util');

const readFile = util.promisify(fs.readFile);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

let results = null
let ndtvResults = null
let referedLinks = null
let helplines = null;
let labs = null;

let fetchReferedLinks = () => {
  return readFile('./links.json',  "utf8")
}

let fetchHelpLines = () => {
  return readFile('./helplines.json',  "utf8")
}

let fetchLabs = () => {
  return readFile('./labs.json',  "utf8")
}

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
      return ndtvResults
    }

    const getReferedLinks = async () => {
      if(referedLinks) {
        return referedLinks
      }
      const res = await fetchReferedLinks()
      referedLinks = JSON.parse(res)
      return referedLinks
    }

    const getHelpLines = async () => {
      if(helplines) {
        return helplines
      }
      const res = await fetchHelpLines()

      helplines = JSON.parse(res)
      return helplines
    }

    const getLabs = async () => {
      if(labs) {
        return labs
      }
      const res = await fetchLabs()
      labs = JSON.parse(res)
      return labs
    }
    
    return {
      getResults,
      getNdtvResults,
      getReferedLinks,
      getHelpLines,
      getLabs,
    }
  },

})

const cors = microCors()

const handler = server.createHandler({ path: '/' })

export default cors((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))