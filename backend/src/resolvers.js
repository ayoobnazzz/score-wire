import { fetchMatches, fetchMatchDetails, fetchPlayers, fetchLeagues, fetchStandings, fetchSports } from './dataSources/sportsAPI.js';

export const resolvers = {
  Query: {
    matches: async (_, { league, team, status, sport }) => {
      return await fetchMatches({ league, team, status, sport });
    },
    match: async (_, { id }) => {
      const matches = await fetchMatches({});
      return matches.find(m => m.id === id);
    },
    players: async (_, { team, league, sport }) => {
      return await fetchPlayers({ team, league, sport });
    },
    player: async (_, { id }) => {
      const players = await fetchPlayers({});
      return players.find(p => p.id === id);
    },
    leagues: async (_, { sport }) => {
      return await fetchLeagues(sport);
    },
    league: async (_, { id }) => {
      const leagues = await fetchLeagues();
      return leagues.find(l => l.id === id);
    },
    standings: async (_, { leagueId }) => {
      return await fetchStandings(leagueId);
    },
    sports: async () => {
      return await fetchSports();
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

