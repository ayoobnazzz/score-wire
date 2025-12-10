import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LiveScores from './pages/LiveScores'
import PlayerStats from './pages/PlayerStats'
import LeagueStandings from './pages/LeagueStandings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LiveScores />} />
        <Route path="/players" element={<PlayerStats />} />
        <Route path="/standings" element={<LeagueStandings />} />
      </Routes>
    </Layout>
  )
}

export default App

