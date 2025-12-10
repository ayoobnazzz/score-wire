# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Step 1: Install Frontend Dependencies

```bash
cd score-wire
npm install
```

## Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 3: Start the Backend Server

In the `backend` directory:

```bash
npm run dev
```

The GraphQL server will start on `http://localhost:4000/graphql`

## Step 4: Start the Frontend (New Terminal)

In the `score-wire` directory:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Accessing the Application

Open your browser and navigate to: `http://localhost:3000`

## Features Available

1. **Live Scores** - View live match scores with filtering options
2. **Player Stats** - Browse player statistics by team
3. **League Standings** - View league tables with position indicators

## Troubleshooting

### Port Already in Use
If port 4000 or 3000 is already in use:
- Backend: Set `PORT` environment variable (e.g., `PORT=4001 npm run dev`)
- Frontend: Update `vite.config.ts` server port

### GraphQL Connection Issues
- Ensure backend is running before starting frontend
- Check that both servers are running on correct ports
- Verify CORS is enabled in backend (already configured)

### Module Not Found Errors
- Run `npm install` in both frontend and backend directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

To integrate real sports APIs:
1. Get API keys from TheSportsDB or SportMonks
2. Update `backend/src/dataSources/sportsAPI.js`
3. Replace mock data with actual API calls

