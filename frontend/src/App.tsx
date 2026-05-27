import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import EmployeesPage from './pages/EmployeesPage'
import InsightsPage from './pages/InsightsPage'

function Navbar() {
  const location = useLocation()
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 3, fontWeight: 'bold', color: 'white' }}>
          SalaryIQ
        </Typography>
        <Button
          component={Link}
          to="/"
          sx={{ color: 'white', fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
        >
          Employees
        </Button>
        <Button
          component={Link}
          to="/insights"
          sx={{ color: 'white', fontWeight: location.pathname === '/insights' ? 'bold' : 'normal' }}
        >
          Insights
        </Button>
      </Toolbar>
    </AppBar>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App