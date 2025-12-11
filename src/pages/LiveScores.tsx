import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

const GET_MATCHES = gql`
  query GetMatches($league: String, $team: String, $status: String, $sport: String) {
    matches(league: $league, team: $team, status: $status, sport: $sport) {
      id
      homeTeam
      awayTeam
      homeScore
      awayScore
      status
      league
      date
      venue
    }
  }
`

const GET_LEAGUES = gql`
  query GetLeagues($sport: String) {
    leagues(sport: $sport) {
      id
      name
      country
      sport
    }
  }
`

const GET_SPORTS = gql`
  query GetSports {
    sports {
      name
      displayName
    }
  }
`

export default function LiveScores() {
  const [selectedSport, setSelectedSport] = useState<string>('Soccer')
  const [selectedLeague, setSelectedLeague] = useState<string>('')
  const [teamFilter, setTeamFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCHES, {
    variables: {
      league: selectedLeague || undefined,
      team: teamFilter || undefined,
      status: statusFilter || undefined,
      sport: selectedSport,
    },
    pollInterval: 30000,
  })

  const { data: leaguesData } = useQuery(GET_LEAGUES, {
    variables: { sport: selectedSport },
  })

  const { data: sportsData } = useQuery(GET_SPORTS)

  const matches = matchesData?.matches || []

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'LIVE':
        return (
          <Chip
            label="LIVE"
            color="error"
            size="small"
            sx={{ fontWeight: 'bold', animation: 'pulse 2s infinite' }}
          />
        )
      case 'FT':
        return <Chip label="FT" color="success" size="small" sx={{ fontWeight: 'bold' }} />
      case 'NS':
        return <Chip label="Upcoming" color="primary" size="small" sx={{ fontWeight: 'bold' }} />
      default:
        return <Chip label={status} size="small" />
    }
  }

  // Calculate statistics
  const liveMatches = matches.filter((m: any) => m.status === 'LIVE').length
  const finishedMatches = matches.filter((m: any) => m.status === 'FT').length
  const upcomingMatches = matches.filter((m: any) => m.status === 'NS').length

  return (
    <Box>
      {/* API Metrics Banner */}
      <Box
        sx={{
          bgcolor: 'rgb(191, 219, 254)',
          color: 'rgb(37, 99, 235)',
          p: 2,
          borderRadius: '8px',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TrendingUpIcon />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          LIVE SCORES METRICS
        </Typography>
        <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.9 }}>
          Real-time match updates and statistics
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Live Matches
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {liveMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Finished Today
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {finishedMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Upcoming
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {upcomingMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            FILTERS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sport</InputLabel>
                <Select
                  value={selectedSport}
                  label="Sport"
                  onChange={(e) => {
                    setSelectedSport(e.target.value)
                    setSelectedLeague('') // Reset league when sport changes
                  }}
                >
                  {sportsData?.sports.map((sport: any) => (
                    <MenuItem key={sport.name} value={sport.name}>
                      {sport.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>League</InputLabel>
                <Select
                  value={selectedLeague}
                  label="League"
                  onChange={(e) => setSelectedLeague(e.target.value)}
                >
                  <MenuItem value="">All Leagues</MenuItem>
                  {leaguesData?.leagues.map((league: any) => (
                    <MenuItem key={league.id} value={league.name}>
                      {league.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="LIVE">Live</MenuItem>
                  <MenuItem value="FT">Finished</MenuItem>
                  <MenuItem value="NS">Upcoming</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Team"
                placeholder="Type at least 3 characters"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Matches Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          MATCHES
        </Typography>

        {matchesLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {matchesError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {matchesError.message}
          </Alert>
        )}

        {matches.length === 0 && !matchesLoading && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#f5f5f5',
            }}
          >
            <SportsSoccerIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              NO MATCHES FOUND
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your filters or check back later for new matches.
            </Typography>
          </Paper>
        )}

        <Grid container spacing={2}>
          {matches.map((match: any) => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      pb: 1,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {match.league}
                    </Typography>
                    {getStatusChip(match.status)}
                  </Box>

                  <Box sx={{ my: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {match.homeTeam}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {match.homeScore !== null ? match.homeScore : '-'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {match.awayTeam}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {match.awayScore !== null ? match.awayScore : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pt: 1,
                      borderTop: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {match.venue}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(match.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
