import { gql } from 'apollo-server-micro'

const schema = gql`

type Country {
  name: String
  results: [Result]
  mostRecent: Result
}

type State {
  name: String
  results: [Result]
  mostRecent: Result
}

type Result {
  country: Country
  state: State
"""format date with date-fns. Help - https://date-fns.org/v2.11.0/docs/format"""
  date (format: String): String
  confirmed: Int
  deaths: Int
  recovered: Int
  growthRate: Float
}

type Summary {

"""format date with date-fns. Help - https://date-fns.org/v2.11.0/docs/format"""
  date (format: String): String
  confirmed: Int
  deaths: Int
  recovered: Int
}

"""eq - equal to, gt - greater than, lt - less than"""
input DateInput {
  eq: String
  gt: String
  lt: String
}

type Query {
  results(countries: [String], date: DateInput): [Result]
  result (country: String!, date: String): Result

  summary(countries: [String], date: DateInput): Summary

  countries (names: [String]): [Country]
  country (name: String): Country

  states (country: String!, names: [String]): [State]
  state (country: String!, name: String): State
}
`

export default schema