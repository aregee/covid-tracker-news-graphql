import { QueryResolvers } from './types'
import { ApolloError } from 'apollo-server-micro'

const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

function titleCase(string) {
  var sentence = string.toLowerCase().split(" ");
  for(var i = 0; i< sentence.length; i++){
     sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
return sentence;
}

const getGrowthRate = (index: number, results: any) => {
  if (index === 0) {
    return 0
  }
  const prevResult = results[index - 1]
  const currentResult = results[index]
  if (!prevResult || prevResult.confirmed === 0) {
    return undefined
  }
  return (currentResult.confirmed - prevResult.confirmed) / prevResult.confirmed
}

const getGrowthRateNdtv = (result: any) => {
  return(result.confirmed - result.confirmedYday) / result.confirmedYday
}

let mapModel = (data) => {
  return {
    date: formatDate(new Date(data.updated_date)),
    confirmed: data.cases_confirmed,
    deaths:  data.cases_death,
    recovered: data.cases_recovered,
    countries: data.countries
  }
}

const mapState = (model) => {
  return {
    date: formatDate(new Date(model.updated)),
    confirmed: model.cases_confirmed,
    deaths: model.cases_death,
    recovered: model.cases_recovered,
    confirmedYday: model.cases_confirmed_yday,
    deathYday: model.cases_death_yday,
    recoveredYday: model.cases_recovered_yday,
    country: model.country,
    name: model.state
  }
};

const mapCountry = (model) => {
  return {
    date: formatDate(new Date(model.updated)),
    confirmed: model.cases_confirmed,
    deaths: model.cases_death,
    recovered: model.cases_recovered,
    confirmedYday: model.cases_confirmed_yday,
    deathYday: model.cases_death_yday,
    recoveredYday: model.cases_recovered_yday,
    name: model.country,
    states: model.states
  }
};

const mapNewsArticle = (model) => {
  return {
    short: model.description,
    headline: model.title,
    date: formatDate(new Date(model.publishedAt)),
    link: model.url,
    ...model
  }
}


const groupBy = function (arr, criteria) {
  return arr.reduce(function (obj, item) {

      // Check if the criteria is a function to run on the item or a property of it
      var key = typeof criteria === 'function' ? criteria(item) : item[criteria];

      // If the key doesn't exist yet, create it
      if (!obj.hasOwnProperty(key)) {
          obj[key] = [];
      }

      // Push the value to the object
      obj[key].push(item);

      // Return the object to the next item in the loop
      return obj;

  }, {});
};

const resolvers: QueryResolvers = {

  async summary(_parent, {}, {getNdtvResults}) {
    const results = await getNdtvResults();
    return mapModel(results);
  },


  async news(_parent, {country, format}, {getNewsIndia, getNewsWorld}) {
    let results; 
    if(country && titleCase(country)  !== "World") {
      results = await getNewsIndia(titleCase(country));
    } else {
      results = await getNewsWorld();
    }
    if(results.articles) {
      return results.articles.map(mapNewsArticle)
    } else {
      throw new ApolloError(`Couldn't find data news from country ${country}`)
    }

  },

  async referedlink(_parent, { country, state }, { getReferedLinks }) {
    const results = await getReferedLinks();
    if(state) {
      const aggs = groupBy(results, (s: any) => s.state === state);
      if (aggs.true) {
        return aggs.true;
      }
      return results;
    }
    return results;
  },

  async helpline(_parent, { country, state }, { getHelpLines }) {
    const results = await getHelpLines();
    if(state) {
      const aggs = groupBy(results, (s: any) => s.state === state);
      if (aggs.true) {
        return aggs.true;
      }
      return results;
    }
    return results;
  },

  async labs(_parent, { country, state }, { getLabs }) {
    const results = await getLabs();
    if(state) {
      const aggs = groupBy(results, (s: any) => s.state === state);
      if (aggs.true) {
        return aggs.true;
      }
      return results;
    }
    return results;
  },

  async results(_parent, { countries, date }, { getResults }) {
    const results = await getResults()
    const eq = date && date.eq ? formatDate(new Date(date.eq)) : null
    const lt = date && date.lt ? new Date(formatDate(new Date(date.lt))) : null
    const gt = date && date.gt ? new Date(formatDate(new Date(date.gt))) : null

    const countryNames = countries && countries.length > 0 ? countries : Object.keys(results)
    let formatted = countryNames
      .reduce((acc, countryName) => {
        const countryResults = results[countryName]
        if (!countryResults) {
          throw new ApolloError(`Couldn't find data from country ${countryName}`)
        }
        const withCountryName = countryResults.map((result, index) => ({ ...result, growthRate: getGrowthRate(index, countryResults), country: { name: countryName } }))
        return [...acc, ...withCountryName]
      }, [])
      .filter(result => {
        const d = new Date(result.date)
        return ((eq && formatDate(d) === eq) || (lt && d < lt) || (gt && d > gt)) || !date
      })
    return formatted
  },
  async result(_parent, { country, date }, { getResults }) {
    const results = await getResults()
    const countryResult = results[country]
    if (date) {
      const formattedDate = formatDate(new Date(date))
      const foundIndex = countryResult.findIndex(r => {
        const d = formatDate(new Date(r.date))
        return d === formattedDate
      })
      const found = countryResult[foundIndex]
      found.country = country
      found.growthRate = getGrowthRate(foundIndex, countryResult)
      return found
    }
    // if no date provided, return the most recent.
    const lastIndex = countryResult.length - 1
    const found = countryResult[lastIndex]
    found.growthRate = getGrowthRate(lastIndex, countryResult)
    found.country = { name: country }
    return found
  },

  async countries(_parent, { names }, { getResults }) {
    const results = await getResults()
    let formatted = (names && names.length > 0 ? names : Object.keys(results))
      .reduce((acc, countryName) => {
        const countryResults = results[countryName] as any[]
        if (!countryResults) {
          throw new ApolloError(`Couldn't find data from country ${countryName}`)
        }
        const updatedResults = countryResults.map((result, index) => ({ ...result, growthRate: getGrowthRate(index, countryResults) }))
        const mostRecentIndex = countryResults.length - 1
        const mostRecent = countryResults[mostRecentIndex]
        mostRecent.growthRate = getGrowthRate(mostRecentIndex, updatedResults)
        const country = { name: countryName, results: updatedResults, mostRecent}
        return [...acc, country]
      }, []);
    return formatted
  },
  
  async country(_parent, { name }, { getResults, getNdtvResults }) {
    let data: any;
    let results: any;
    if(name === "India") {
      data = await getNdtvResults()
      results = [data.countries.find((c:any) => c.country == name)].map(mapCountry)
    } else {
      data = await getResults()
      results = data[name]
    }

    if (!results) {
      throw new ApolloError(`Couldn't find data from country ${name}`)
    }
    results = results.map((result, index) => ({
      ...result,
      growthRate: name === "India" ? getGrowthRateNdtv(result) : getGrowthRate(index, results)
    }))
    const country = { name, results, mostRecent: results[results.length - 1] }
    return country
  },

  async states(_parent, {country, names}, {getNdtvResults}) {
    const data = await getNdtvResults();
    let selectedCountry = data.countries.find(arr => arr.country === country);
    // console.log(names, selectedCountry.states.map(c => c.state));
    let formatted = (names && names.length > 0 ? names : selectedCountry.states.map(c => c.state))
      .reduce((acc, stateName) => {
        const stateResults = selectedCountry.states.find(arr => arr.state === stateName);
        // console.log(stateResults);
        if (!stateResults) {
          throw new ApolloError(`Couldn't find data from state ${stateResults}`)
        }
        const mostRecent = mapState(stateResults);
        const state = { name: stateName, mostRecent: {...mostRecent, growthRate: getGrowthRateNdtv(mostRecent)}}
        return [...acc, state]
      }, []);
    return formatted;
  },

  async state(_parent, {country, name}, {getNdtvResults}) {
    const data = await getNdtvResults();
    let selectedCountry = data.countries.find(arr => arr.country === country);
    const stateResults = selectedCountry.states.find(arr => arr.state === name);
    if (!stateResults) {
      throw new ApolloError(`Couldn't find data from state ${stateResults}`)
    }
    const mostRecent = mapState(stateResults);
    const state = { name: name, mostRecent: {...mostRecent, growthRate: getGrowthRateNdtv(mostRecent)}}
    return state;
  }

}

export default resolvers 