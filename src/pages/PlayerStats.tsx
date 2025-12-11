import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
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
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'

const GET_PLAYERS = gql`
  query GetPlayers($team: String, $league: String, $sport: String) {
    players(team: $team, league: $league, sport: $sport) {
      id
      name
      team
      position
      goals
      assists
      appearances
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

export default function PlayerStats() {
  const [selectedSport, setSelectedSport] = useState<string>('Soccer')
  const [teamFilter, setTeamFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('goals')

  const { data, loading, error } = useQuery(GET_PLAYERS, {
    variables: {
      team: teamFilter || undefined,
      sport: selectedSport,
    },
  })

  const { data: sportsData } = useQuery(GET_SPORTS)

  const players = data?.players || []

  const sortedPlayers = [...players].sort((a: any, b: any) => {
    return (b[sortBy] || 0) - (a[sortBy] || 0)
  })

  const totalGoals = players.reduce((sum: number, p: any) => sum + (p.goals || 0), 0)
  const totalAssists = players.reduce((sum: number, p: any) => sum + (p.assists || 0), 0)

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
          PLAYER STATISTICS METRICS
        </Typography>
        <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.9 }}>
          Comprehensive player performance data
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Players
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {players.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Goals
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {totalGoals}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(33.333% - 16px)' } }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Assists
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {totalAssists}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            FILTERS
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sport</InputLabel>
                <Select
                  value={selectedSport}
                  label="Sport"
                  onChange={(e) => {
                    setSelectedSport(e.target.value)
                    setTeamFilter('') // Reset team filter when sport changes
                  }}
                >
                  {sportsData?.sports.map((sport: any) => (
                    <MenuItem key={sport.name} value={sport.name}>
                      {sport.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
              <TextField
                fullWidth
                size="small"
                label="Search Team"
                placeholder="Type at least 3 characters"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="goals">Goals</MenuItem>
                  <MenuItem value="assists">Assists</MenuItem>
                  <MenuItem value="appearances">Appearances</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          PLAYERS
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

        {sortedPlayers.length === 0 && !loading && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#f5f5f5',
            }}
          >
            <PeopleIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              NO PLAYERS FOUND
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your filters or search for a different team.
            </Typography>
          </Paper>
        )}

        {sortedPlayers.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgb(191, 219, 254)' }}>
                  <TableCell sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>Player</TableCell>
                  <TableCell sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>Team</TableCell>
                  <TableCell sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>Position</TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    Goals
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    Assists
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                    Appearances
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPlayers.map((player: any) => (
                  <TableRow
                    key={player.id}
                    sx={{
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {player.name}
                    </TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {player.goals || 0}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {player.assists || 0}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {player.appearances || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  )
}
