import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import PeopleIcon from '@mui/icons-material/People'
import TableChartIcon from '@mui/icons-material/TableChart'

interface LayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Live Scores', icon: <SportsSoccerIcon />, path: '/' },
  { text: 'Player Stats', icon: <PeopleIcon />, path: '/players' },
  { text: 'Standings', icon: <TableChartIcon />, path: '/standings' },
]

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: '#ffffff',
          color: '#333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          {/* Logo */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              bgcolor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              mr: 3,
            }}
          >
            S
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/' && location.pathname === '/')
              return (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: isActive ? '#ff4444' : '#666',
                    fontWeight: isActive ? 600 : 400,
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(255, 68, 68, 0.1)' : '#f5f5f5',
                    },
                  }}
                >
                  {item.text}
                </Button>
              )
            })}
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={{ fontWeight: 600, ml: 'auto' }}>
            DASHBOARD
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  )
}
