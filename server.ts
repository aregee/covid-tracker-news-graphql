import { makeExecutableSchema, ApolloServer } from 'apollo-server-micro'
import { default as typeDefs } from './schema'
import resolvers from './resolvers'
import fetch from 'node-fetch'
import microCors = require('micro-cors');
import {linksList} from './links'
import {labsList} from './labs'
import {helplinesList} from './helplines'
// import fs = require('fs');
// import util = require('util');
// APIKey 31923f57da3c436a823d033cc3e250ac

// const readFile = util.promisify(fs.readFile);

const newsApiToken = '31923f57da3c436a823d033cc3e250ac';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

let results = null
let ndtvResults = null
let referedLinks = null
let helplines = null;
let labs = null;
let worldNews = null;
let indiaNews = null;

let fetchReferedLinks = () => {
  return Promise.resolve(linksList)
}

let fetchHelpLines = () => {
  return Promise.resolve(helplinesList)

}

let fetchLabs = () => {
  return Promise.resolve(labsList)
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

    const getNewsWorld = async () => {
      if (worldNews) {
        return worldNews
      }
      const res = await fetch(`http://newsapi.org/v2/top-headlines?source=google-news&q=coronavirus&language=en&apiKey=${newsApiToken}`)
      worldNews = await res.json()
      return worldNews
    }

    const getNewsIndia = async (isoCode) => {
      if (indiaNews) {
        return indiaNews
      }
      const res = await fetch(`http://newsapi.org/v2/top-headlines?country=${isoCode}&q=coronavirus&apiKey=${newsApiToken}`)
      indiaNews = await res.json()
      return indiaNews
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
      referedLinks = (res)
      return referedLinks
    }

    const getHelpLines = async () => {
      if(helplines) {
        return helplines
      }
      const res = await fetchHelpLines()

      helplines = (res)
      return helplines
    }

    const getLabs = async () => {
      if(labs) {
        return labs
      }
      const res = await fetchLabs()
      labs = (res)
      return labs
    }
    
    return {
      getResults,
      getNdtvResults,
      getReferedLinks,
      getHelpLines,
      getLabs,
      getNewsWorld,
      getNewsIndia,
    }
  },

})

const cors = microCors()

const handler = server.createHandler({ path: '/' })

export default cors((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))