export const typeDefs = `#graphql
  type Match {
    id: ID!
    homeTeam: String!
    awayTeam: String!
    homeScore: Int
    awayScore: Int
    status: String!
    league: String!
    date: String!
    venue: String
    events: [MatchEvent!]
  }

  type MatchEvent {
    id: ID!
    type: String!
    player: String
    minute: Int
    team: String!
  }

  type Player {
    id: ID!
    name: String!
    team: String!
    position: String
    goals: Int
    assists: Int
    appearances: Int
    image: String
  }

  type League {
    id: ID!
    name: String!
    country: String!
    logo: String
    season: String!
  }

  type Standing {
    id: ID!
    team: String!
    position: Int!
    played: Int!
    won: Int!
    drawn: Int!
    lost: Int!
    goalsFor: Int!
    goalsAgainst: Int!
    goalDifference: Int!
    points: Int!
    logo: String
  }

  type Query {
    matches(league: String, team: String, status: String): [Match!]!
    match(id: ID!): Match
    players(team: String, league: String): [Player!]!
    player(id: ID!): Player
    leagues: [League!]!
    league(id: ID!): League
    standings(leagueId: ID!): [Standing!]!
  }

  type Subscription {
    matchUpdated(league: String, team: String): Match!
    scoreUpdated(matchId: ID!): Match!
  }
`;

