import { fetchMatches, fetchMatchDetails, fetchPlayers, fetchLeagues, fetchStandings } from './dataSources/sportsAPI.js';

export const resolvers = {
  Query: {
    matches: async (_, { league, team, status }) => {
      return await fetchMatches({ league, team, status });
    },
    match: async (_, { id }) => {
      const matches = await fetchMatches({});
      return matches.find(m => m.id === id);
    },
    players: async (_, { team, league }) => {
      return await fetchPlayers({ team, league });
    },
    player: async (_, { id }) => {
      const players = await fetchPlayers({});
      return players.find(p => p.id === id);
    },
    leagues: async () => {
      return await fetchLeagues();
    },
    league: async (_, { id }) => {
      const leagues = await fetchLeagues();
      return leagues.find(l => l.id === id);
    },
    standings: async (_, { leagueId }) => {
      return await fetchStandings(leagueId);
    },
  },
  Subscription: {
    matchUpdated: {
      subscribe: (_, { league, team }, { pubsub }) => {
        return pubsub.asyncIterator(['MATCH_UPDATED']);
      },
    },
    scoreUpdated: {
      subscribe: (_, { matchId }, { pubsub }) => {
        return pubsub.asyncIterator([`SCORE_UPDATED_${matchId}`]);
      },
    },
  },
};

