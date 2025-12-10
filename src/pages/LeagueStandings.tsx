import { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TableChartIcon from '@mui/icons-material/TableChart'

const GET_LEAGUES = gql`
  query GetLeagues {
    leagues {
      id
      name
      country
    }
  }
`

const GET_STANDINGS = gql`
  query GetStandings($leagueId: ID!) {
    standings(leagueId: $leagueId) {
      id
      team
      position
      played
      won
      drawn
      lost
      goalsFor
      goalsAgainst
      goalDifference
      points
    }
  }
`

export default function LeagueStandings() {
  const { data: leaguesData } = useQuery(GET_LEAGUES)
  const [selectedLeague, setSelectedLeague] = useState<string>('')

  // Set default league when leagues data loads
  useEffect(() => {
    if (leaguesData?.leagues?.[0]?.id && !selectedLeague) {
      setSelectedLeague(leaguesData.leagues[0].id)
    }
  }, [leaguesData, selectedLeague])

  const { data: standingsData, loading, error } = useQuery(GET_STANDINGS, {
    variables: { leagueId: selectedLeague },
    skip: !selectedLeague,
  })

  const standings = standingsData?.standings || []

  const getPositionColor = (position: number, total: number) => {
    if (position <= 3) return '#dbeafe' // Champions League
    if (position <= 6) return '#fef3c7' // Europa League
    if (position >= total - 2) return '#fee2e2' // Relegation
    return 'transparent'
  }

  const topTeam = standings[0]
  const totalTeams = standings.length

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
          LEAGUE STANDINGS METRICS
        </Typography>
        <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.9 }}>
          Current league table and team positions
        </Typography>
      </Box>

      {/* Statistics Cards */}
      {topTeam && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  League Leader
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {topTeam.team}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Points
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {topTeam.points}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total Teams
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {totalTeams}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            FILTERS
          </Typography>
          <FormControl fullWidth size="small" sx={{ maxWidth: 400 }}>
            <InputLabel>Select League</InputLabel>
            <Select
              value={selectedLeague}
              label="Select League"
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              {leaguesData?.leagues.map((league: any) => (
                <MenuItem key={league.id} value={league.id}>
                  {league.name} ({league.country})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Standings Table */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          STANDINGS
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error.message}
          </Alert>
        )}

        {standings.length === 0 && !loading && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#f5f5f5',
            }}
          >
            <TableChartIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              NO STANDINGS DATA AVAILABLE
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Select a league to view standings or check back later.
            </Typography>
          </Paper>
        )}

        {standings.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgb(191, 219, 254)' }}>
                  <TableCell sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>Pos</TableCell>
                  <TableCell sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>Team</TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    P
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    W
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    D
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    L
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    GF
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    GA
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    GD
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    Pts
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standings.map((standing: any) => (
                  <TableRow
                    key={standing.id}
                    sx={{
                      bgcolor: getPositionColor(standing.position, totalTeams),
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {standing.position}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{standing.team}</TableCell>
                    <TableCell align="center">{standing.played}</TableCell>
                    <TableCell align="center">{standing.won}</TableCell>
                    <TableCell align="center">{standing.drawn}</TableCell>
                    <TableCell align="center">{standing.lost}</TableCell>
                    <TableCell align="center">{standing.goalsFor}</TableCell>
                    <TableCell align="center">{standing.goalsAgainst}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: standing.goalDifference >= 0 ? '#10b981' : '#ef4444',
                      }}
                    >
                      {standing.goalDifference > 0 ? '+' : ''}
                      {standing.goalDifference}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {standing.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Legend */}
        {standings.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  bgcolor: '#dbeafe',
                }}
              />
              <Typography variant="body2">Champions League Qualification</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  bgcolor: '#fef3c7',
                }}
              />
              <Typography variant="body2">Europa League Qualification</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  bgcolor: '#fee2e2',
                }}
              />
              <Typography variant="body2">Relegation Zone</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
