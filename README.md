# ⚽ Score Wire - Sports Live Scores Application

A modern, real-time sports scores application built with React, TypeScript, Vite, and GraphQL.

## Features

- 🏆 **Live Match Scores** - Real-time updates of ongoing matches
- 👥 **Player Statistics** - Detailed player stats including goals, assists, and appearances
- 📊 **League Standings** - Complete league tables with position indicators
- 🔍 **Advanced Filtering** - Filter by league, team, and match status
- ⚡ **Real-time Updates** - GraphQL subscriptions for live score updates
- 📱 **Responsive Design** - Beautiful UI that works on all devices

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Apollo Client** - GraphQL client with subscriptions support
- **React Router** - Navigation
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Apollo Server** - GraphQL server
- **Express** - HTTP server
- **GraphQL Subscriptions** - Real-time updates via WebSockets
- **graphql-ws** - WebSocket server for subscriptions

### Data Sources
- **TheSportsDB** - Free sports API (integrated with free API key: 123)
  - Rate Limit: 30 requests per minute (free tier)
  - Documentation: https://www.thesportsdb.com/documentation
  - Falls back to mock data if API is unavailable or rate limited

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install frontend dependencies:**
```bash
cd score-wire
npm install
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
The GraphQL server will be available at `http://localhost:4000/graphql`

2. **Start the frontend (in a new terminal):**
```bash
cd score-wire
npm run dev
```
The frontend will be available at `http://localhost:3000`

## Project Structure

```
score-wire/
├── backend/
│   ├── src/
│   │   ├── schema.js          # GraphQL schema definitions
│   │   ├── resolvers.js       # GraphQL resolvers
│   │   └── dataSources/
│   │       └── sportsAPI.js   # API integration layer
│   └── server.js              # Apollo Server setup
├── src/
│   ├── components/
│   │   └── Layout.tsx         # Main layout component
│   ├── pages/
│   │   ├── LiveScores.tsx     # Live scores page
│   │   ├── PlayerStats.tsx    # Player statistics page
│   │   └── LeagueStandings.tsx # League standings page
│   ├── lib/
│   │   └── apolloClient.ts    # Apollo Client configuration
│   └── App.tsx                # Main app component
└── package.json
```

## GraphQL Schema

The application uses the following main types:

- **Match** - Match information with scores and status
- **Player** - Player statistics
- **League** - League information
- **Standing** - League table standings

## API Integration

The application is **integrated with TheSportsDB Free API** using the free API key (`123`).

### Current Implementation

- ✅ **Live Matches** - Fetches upcoming and recent matches from popular leagues
- ✅ **Player Stats** - Retrieves player data by team name
- ✅ **League Information** - Fetches league details for Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and Champions League
- ✅ **Standings** - Attempts to fetch league tables (falls back to mock if unavailable)

### API Endpoints Used

- `eventsnextleague.php` - Upcoming matches for a league
- `eventspastleague.php` - Recent matches for a league
- `searchteams.php` - Search teams by name
- `lookup_all_players.php` - Get all players for a team
- `lookupleague.php` - Get league details
- `lookuptable.php` - Get league standings (may not be available for all leagues)

### Rate Limits

- **Free Tier**: 30 requests per minute
- The application includes error handling and falls back to mock data if:
  - API is unavailable
  - Rate limit is exceeded
  - API returns no data

### Upgrading to Premium

For higher rate limits and additional features:
1. Sign up at [TheSportsDB](https://www.thesportsdb.com/)
2. Get your premium API key
3. Replace `123` with your API key in `backend/src/dataSources/sportsAPI.js`

## Features in Detail

### Live Scores
- Filter by league, team, or status (Live/Finished/Upcoming)
- Real-time score updates (polling every 30 seconds)
- Visual status indicators with animations
- Match details including venue and date

### Player Stats
- Search players by team
- Sort by goals, assists, or appearances
- Comprehensive statistics table

### League Standings
- Select different leagues
- Color-coded positions (Champions League, Europa League, Relegation)
- Complete statistics (played, won, drawn, lost, goals, points)

## Future Enhancements

- [x] Integration with TheSportsDB API
- [ ] Real-time WebSocket subscriptions for live score updates (infrastructure ready)
- [ ] Match details page with events timeline
- [ ] Player profile pages with detailed stats
- [ ] Favorite teams functionality
- [ ] Push notifications for match updates
- [ ] Dark/light theme toggle
- [ ] Caching layer for API responses
- [ ] Support for more leagues and sports

## License

MIT
