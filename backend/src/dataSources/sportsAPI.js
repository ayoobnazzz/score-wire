import fetch from 'node-fetch';

// TheSportsDB Free API - Key: 123
const THESPORTSDB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';
const API_KEY = '123'; // Free API key

// Popular league IDs from TheSportsDB
const LEAGUE_IDS = {
  'Premier League': '4328',
  'La Liga': '4335',
  'Serie A': '4332',
  'Bundesliga': '4331',
  'Ligue 1': '4334',
  'Champions League': '4480',
};

// Mock data generator for development (since free APIs have limitations)
const generateMockMatches = () => {
  const leagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'];
  const teams = [
    { name: 'Manchester United', league: 'Premier League' },
    { name: 'Liverpool', league: 'Premier League' },
    { name: 'Arsenal', league: 'Premier League' },
    { name: 'Real Madrid', league: 'La Liga' },
    { name: 'Barcelona', league: 'La Liga' },
    { name: 'AC Milan', league: 'Serie A' },
    { name: 'Juventus', league: 'Serie A' },
    { name: 'Bayern Munich', league: 'Bundesliga' },
    { name: 'PSG', league: 'Ligue 1' },
  ];

  const statuses = ['LIVE', 'FT', 'NS'];
  const matches = [];

  for (let i = 0; i < 20; i++) {
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam = teams[Math.floor(Math.random() * teams.length)];
    while (awayTeam.name === homeTeam.name) {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    }

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const homeScore = status === 'NS' ? null : Math.floor(Math.random() * 5);
    const awayScore = status === 'NS' ? null : Math.floor(Math.random() * 5);

    matches.push({
      id: `match_${i + 1}`,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      homeScore,
      awayScore,
      status,
      league: homeTeam.league,
      date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      venue: `Stadium ${i + 1}`,
      events: status === 'LIVE' ? [
        {
          id: `event_${i}_1`,
          type: 'GOAL',
          player: `Player ${i + 1}`,
          minute: Math.floor(Math.random() * 90),
          team: homeTeam.name,
        },
      ] : [],
    });
  }

  return matches;
};

const generateMockPlayers = () => {
  const teams = ['Manchester United', 'Liverpool', 'Arsenal', 'Real Madrid', 'Barcelona'];
  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  const players = [];

  teams.forEach((team, teamIdx) => {
    for (let i = 0; i < 5; i++) {
      players.push({
        id: `player_${teamIdx}_${i}`,
        name: `Player ${teamIdx + 1}-${i + 1}`,
        team,
        position: positions[Math.floor(Math.random() * positions.length)],
        goals: Math.floor(Math.random() * 20),
        assists: Math.floor(Math.random() * 15),
        appearances: Math.floor(Math.random() * 30) + 10,
        image: null,
      });
    }
  });

  return players;
};

const generateMockLeagues = () => {
  return [
    { id: '1', name: 'Premier League', country: 'England', logo: null, season: '2024/25' },
    { id: '2', name: 'La Liga', country: 'Spain', logo: null, season: '2024/25' },
    { id: '3', name: 'Serie A', country: 'Italy', logo: null, season: '2024/25' },
    { id: '4', name: 'Bundesliga', country: 'Germany', logo: null, season: '2024/25' },
    { id: '5', name: 'Ligue 1', country: 'France', logo: null, season: '2024/25' },
  ];
};

const generateMockStandings = (leagueId) => {
  const teams = [
    'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Tottenham',
    'Manchester United', 'Newcastle', 'Brighton', 'West Ham', 'Aston Villa',
  ];

  return teams.map((team, idx) => ({
    id: `standing_${leagueId}_${idx}`,
    team,
    position: idx + 1,
    played: 38,
    won: 20 + Math.floor(Math.random() * 10),
    drawn: 5 + Math.floor(Math.random() * 5),
    lost: 5 + Math.floor(Math.random() * 5),
    goalsFor: 50 + Math.floor(Math.random() * 40),
    goalsAgainst: 20 + Math.floor(Math.random() * 30),
    goalDifference: 0,
    logo: null,
  })).map(standing => ({
    ...standing,
    goalDifference: standing.goalsFor - standing.goalsAgainst,
    points: standing.won * 3 + standing.drawn,
  }));
};

// Helper function to transform TheSportsDB event to our Match format
const transformEventToMatch = (event) => {
  const status = event.strStatus || 'NS';
  let matchStatus = 'NS';
  if (status.includes('Live') || status.includes('Half Time')) {
    matchStatus = 'LIVE';
  } else if (status.includes('FT') || status.includes('Finished')) {
    matchStatus = 'FT';
  }

  return {
    id: event.idEvent || `event_${Date.now()}_${Math.random()}`,
    homeTeam: event.strHomeTeam || 'TBD',
    awayTeam: event.strAwayTeam || 'TBD',
    homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : null,
    awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : null,
    status: matchStatus,
    league: event.strLeague || 'Unknown League',
    date: event.dateEvent || new Date().toISOString(),
    venue: event.strVenue || 'TBD',
    events: [],
  };
};

export const fetchMatches = async ({ league, team, status }) => {
  try {
    let allMatches = [];

    // If league is specified, fetch matches for that league
    if (league && LEAGUE_IDS[league]) {
      const leagueId = LEAGUE_IDS[league];
      
      // Fetch upcoming matches
      try {
        const nextResponse = await fetch(
          `${THESPORTSDB_BASE_URL}/eventsnextleague.php?id=${leagueId}`
        );
        const nextData = await nextResponse.json();
        if (nextData.events) {
          allMatches = [...allMatches, ...nextData.events.map(transformEventToMatch)];
        }
      } catch (err) {
        console.error('Error fetching next events:', err);
      }

      // Fetch recent matches
      try {
        const lastResponse = await fetch(
          `${THESPORTSDB_BASE_URL}/eventspastleague.php?id=${leagueId}`
        );
        const lastData = await lastResponse.json();
        if (lastData.events) {
          allMatches = [...allMatches, ...lastData.events.slice(0, 10).map(transformEventToMatch)];
        }
      } catch (err) {
        console.error('Error fetching past events:', err);
      }
    } else {
      // Fetch matches for all popular leagues
      for (const [leagueName, leagueId] of Object.entries(LEAGUE_IDS)) {
        try {
          const nextResponse = await fetch(
            `${THESPORTSDB_BASE_URL}/eventsnextleague.php?id=${leagueId}`
          );
          const nextData = await nextResponse.json();
          if (nextData.events) {
            const leagueMatches = nextData.events.slice(0, 5).map(transformEventToMatch);
            allMatches = [...allMatches, ...leagueMatches];
          }
        } catch (err) {
          console.error(`Error fetching matches for ${leagueName}:`, err);
        }
      }
    }

    // Filter by team if specified
    if (team) {
      allMatches = allMatches.filter(m => 
        m.homeTeam.toLowerCase().includes(team.toLowerCase()) ||
        m.awayTeam.toLowerCase().includes(team.toLowerCase())
      );
    }

    // Filter by status if specified
    if (status) {
      allMatches = allMatches.filter(m => m.status === status);
    }

    // If no matches found, return mock data as fallback
    if (allMatches.length === 0) {
      console.log('No matches found from API, using mock data');
      return generateMockMatches();
    }

    return allMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return generateMockMatches();
  }
};

export const fetchMatchDetails = async (matchId) => {
  try {
    // Try to fetch from API if matchId is numeric (TheSportsDB ID)
    if (matchId && !matchId.startsWith('match_')) {
      const response = await fetch(
        `${THESPORTSDB_BASE_URL}/lookupevent.php?id=${matchId}`
      );
      const data = await response.json();
      if (data.events && data.events[0]) {
        return transformEventToMatch(data.events[0]);
      }
    }
    
    // Fallback to mock data
    const matches = generateMockMatches();
    return matches.find(m => m.id === matchId) || matches[0];
  } catch (error) {
    console.error('Error fetching match details:', error);
    const matches = generateMockMatches();
    return matches[0];
  }
};

export const fetchPlayers = async ({ team, league }) => {
  try {
    let players = [];

    // If team name is provided, search for the team first
    if (team) {
      try {
        const teamResponse = await fetch(
          `${THESPORTSDB_BASE_URL}/searchteams.php?t=${encodeURIComponent(team)}`
        );
        const teamData = await teamResponse.json();
        
        if (teamData.teams && teamData.teams.length > 0) {
          const teamId = teamData.teams[0].idTeam;
          
          // Fetch players for this team
          const playersResponse = await fetch(
            `${THESPORTSDB_BASE_URL}/lookup_all_players.php?id=${teamId}`
          );
          const playersData = await playersResponse.json();
          
          if (playersData.player) {
            players = playersData.player.map((p, idx) => ({
              id: p.idPlayer || `player_${teamId}_${idx}`,
              name: p.strPlayer || 'Unknown Player',
              team: teamData.teams[0].strTeam || team,
              position: p.strPosition || 'Unknown',
              goals: p.intGoals ? parseInt(p.intGoals) : 0,
              assists: p.intAssists ? parseInt(p.intAssists) : 0,
              appearances: p.intAppearances ? parseInt(p.intAppearances) : 0,
              image: p.strThumb || null,
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching players from API:', err);
      }
    }

    // If no players found, use mock data
    if (players.length === 0) {
      console.log('No players found from API, using mock data');
      players = generateMockPlayers();
      if (team) {
        players = players.filter(p => 
          p.team.toLowerCase().includes(team.toLowerCase())
        );
      }
    }

    return players;
  } catch (error) {
    console.error('Error fetching players:', error);
    return generateMockPlayers();
  }
};

export const fetchLeagues = async () => {
  try {
    const leagues = [];
    
    // First, try to fetch popular leagues by their IDs
    for (const [name, id] of Object.entries(LEAGUE_IDS)) {
      try {
        const response = await fetch(
          `${THESPORTSDB_BASE_URL}/lookupleague.php?id=${id}`
        );
        const data = await response.json();
        
        if (data.leagues && data.leagues[0]) {
          const league = data.leagues[0];
          leagues.push({
            id: id,
            name: league.strLeague || name,
            country: league.strCountry || 'Unknown',
            logo: league.strLogo || null,
            season: league.strCurrentSeason || league.strSeason || '2024/25',
          });
        }
      } catch (err) {
        console.error(`Error fetching league ${name}:`, err);
      }
    }

    // Also try to search for popular leagues by name to get more results
    const popularLeagueNames = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Champions League', 'MLS', 'Eredivisie'];
    
    for (const leagueName of popularLeagueNames) {
      try {
        const response = await fetch(
          `${THESPORTSDB_BASE_URL}/searchallleagues.php?s=${encodeURIComponent(leagueName)}`
        );
        const data = await response.json();
        
        if (data.countrys && Array.isArray(data.countrys)) {
          data.countrys.forEach((country) => {
            if (country.leagues && Array.isArray(country.leagues)) {
              country.leagues.forEach((league) => {
                // Avoid duplicates
                if (!leagues.find(l => l.id === league.idLeague)) {
                  leagues.push({
                    id: league.idLeague || `league_${Date.now()}_${Math.random()}`,
                    name: league.strLeague || 'Unknown League',
                    country: league.strCountry || country.strCountry || 'Unknown',
                    logo: league.strLogo || null,
                    season: league.strCurrentSeason || league.strSeason || '2024/25',
                  });
                }
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error searching for league ${leagueName}:`, err);
      }
    }

    // If we got leagues from API, return them
    if (leagues.length > 0) {
      // Sort by name for better UX
      leagues.sort((a, b) => a.name.localeCompare(b.name));
      return leagues;
    }

    // Fallback to hardcoded popular leagues
    console.log('Using fallback league data');
    return Object.entries(LEAGUE_IDS).map(([name, id]) => ({
      id: id,
      name: name,
      country: getCountryFromLeague(name),
      logo: null,
      season: '2024/25',
    }));
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return generateMockLeagues();
  }
};

// Helper to get country from league name
const getCountryFromLeague = (leagueName) => {
  const countryMap = {
    'Premier League': 'England',
    'La Liga': 'Spain',
    'Serie A': 'Italy',
    'Bundesliga': 'Germany',
    'Ligue 1': 'France',
    'Champions League': 'Europe',
  };
  return countryMap[leagueName] || 'Unknown';
};

export const fetchStandings = async (leagueId) => {
  try {
    // Try multiple approaches to get standings/table data
    
    // Approach 1: Try lookuptable endpoint with current season
    const currentYear = new Date().getFullYear();
    const seasons = [`${currentYear}-${currentYear + 1}`, `${currentYear - 1}-${currentYear}`, '2024-2025', '2023-2024'];
    
    for (const season of seasons) {
      try {
        const response = await fetch(
          `${THESPORTSDB_BASE_URL}/lookuptable.php?l=${leagueId}&s=${season}`
        );
        const data = await response.json();
        
        if (data.table && Array.isArray(data.table) && data.table.length > 0) {
          return data.table.map((team, idx) => ({
            id: `standing_${leagueId}_${team.teamid || idx}`,
            team: team.name || 'Unknown Team',
            position: parseInt(team.intRank || team.rank || idx + 1),
            played: parseInt(team.played || team.intPlayed || 0),
            won: parseInt(team.win || team.intWin || 0),
            drawn: parseInt(team.draw || team.intDraw || 0),
            lost: parseInt(team.loss || team.intLoss || 0),
            goalsFor: parseInt(team.goalsfor || team.intGoalsFor || 0),
            goalsAgainst: parseInt(team.goalsagainst || team.intGoalsAgainst || 0),
            goalDifference: parseInt(team.goalsdifference || team.intGoalDifference || 0),
            points: parseInt(team.total || team.intPoints || 0),
            logo: team.teamBadge || team.strTeamBadge || null,
          }));
        }
      } catch (err) {
        // Try next season
        continue;
      }
    }

    // Approach 2: Fetch teams from league and try to get their stats
    try {
      const teamsResponse = await fetch(
        `${THESPORTSDB_BASE_URL}/lookup_all_teams.php?id=${leagueId}`
      );
      const teamsData = await teamsResponse.json();
      
      if (teamsData.teams && Array.isArray(teamsData.teams) && teamsData.teams.length > 0) {
        // If we can't get full standings, at least return teams with basic info
        // This creates a basic standings structure from teams
        const standings = teamsData.teams.map((team, idx) => ({
          id: `standing_${leagueId}_${team.idTeam || idx}`,
          team: team.strTeam || team.strAlternate || 'Unknown Team',
          position: idx + 1,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          logo: team.strTeamBadge || team.strTeamLogo || null,
        }));

        // Try to get recent results to calculate stats
        try {
          const eventsResponse = await fetch(
            `${THESPORTSDB_BASE_URL}/eventspastleague.php?id=${leagueId}`
          );
          const eventsData = await eventsResponse.json();
          
          if (eventsData.events && Array.isArray(eventsData.events)) {
            // Calculate stats from recent matches
            eventsData.events.forEach((event) => {
              const homeTeam = event.strHomeTeam;
              const awayTeam = event.strAwayTeam;
              const homeScore = parseInt(event.intHomeScore) || 0;
              const awayScore = parseInt(event.intAwayScore) || 0;
              
              const homeStanding = standings.find(s => s.team === homeTeam);
              const awayStanding = standings.find(s => s.team === awayTeam);
              
              if (homeStanding) {
                homeStanding.played += 1;
                homeStanding.goalsFor += homeScore;
                homeStanding.goalsAgainst += awayScore;
                if (homeScore > awayScore) {
                  homeStanding.won += 1;
                  homeStanding.points += 3;
                } else if (homeScore === awayScore) {
                  homeStanding.drawn += 1;
                  homeStanding.points += 1;
                } else {
                  homeStanding.lost += 1;
                }
              }
              
              if (awayStanding) {
                awayStanding.played += 1;
                awayStanding.goalsFor += awayScore;
                awayStanding.goalsAgainst += homeScore;
                if (awayScore > homeScore) {
                  awayStanding.won += 1;
                  awayStanding.points += 3;
                } else if (awayScore === homeScore) {
                  awayStanding.drawn += 1;
                  awayStanding.points += 1;
                } else {
                  awayStanding.lost += 1;
                }
              }
            });
            
            // Calculate goal difference and sort by points
            standings.forEach(standing => {
              standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
            });
            
            standings.sort((a, b) => {
              if (b.points !== a.points) return b.points - a.points;
              return b.goalDifference - a.goalDifference;
            });
            
            // Update positions after sorting
            standings.forEach((standing, idx) => {
              standing.position = idx + 1;
            });
            
            if (standings.length > 0 && standings[0].played > 0) {
              return standings;
            }
          }
        } catch (err) {
          console.error('Error calculating standings from events:', err);
        }
        
        // Return teams even without stats
        return standings;
      }
    } catch (err) {
      console.error('Error fetching teams for standings:', err);
    }

    // Fallback to mock data
    console.log('Using mock standings data');
    return generateMockStandings(leagueId);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return generateMockStandings(leagueId);
  }
};

