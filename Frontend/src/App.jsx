import { useState, useEffect } from 'react'
import './App.css'
import Landing from './Pages/Landing'
import Login from './Pages/Login'
import AssosiationRegistration from './components/AssosiationRegistration'
import VolunteerRegistration from './components/VolunteerRegistration'
import ReportingPage from './Pages/ReportingPage'
import NGO_Dashboard from './components/NGO_Dashboard'
import DistrictAuthorityDashboard from './components/DistrictAuthorityDashboard'
import AdminDashboard from './components/AdminDashboard'
import VolunteerDashboard from './components/VolunteerDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash === '#login') {
        setCurrentPage('login')
      } else if (hash === '#association-register') {
        setCurrentPage('association-register')
      } else if (
        hash === '#ngo-dashboard' ||
        hash === '#ngo' ||
        hash === '#ngo-portal' ||
        hash === '#association-dashboard' ||
        hash === '#association'
      ) {
        setCurrentPage('ngo-dashboard')
      } else if (
        hash === '#district-authority' ||
        hash === '#district' ||
        hash === '#authority'
      ) {
        setCurrentPage('district-authority')
      } else if (
        hash === '#volunteer-register' ||
        hash === '#volunteer-registration' ||
        hash === '#volunteer' ||
        hash === '#register'
      ) {
        setCurrentPage('volunteer-register')
      } else if (
        hash === '#report' ||
        hash === '#reporting' ||
        hash === '#report-disaster' ||
        hash === '#sos'
      ) {
        setCurrentPage('reporting')
      } else if (
        hash === '#admin' || 
        hash === '#admin-dashboard'
      ) {
        setCurrentPage('admin')
      } else if (
        hash === '#volunteer-dashboard' ||
        hash === '#volunteer-portal'
      ) {
        setCurrentPage('volunteer-dashboard')
      } else {
        setCurrentPage('landing')
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  if (currentPage === 'login') return <Login />
  if (currentPage === 'association-register') return <AssosiationRegistration />
  if (currentPage === 'volunteer-register') return <VolunteerRegistration />
  if (currentPage === 'reporting') return <ReportingPage />
  if (currentPage === 'ngo-dashboard') return <NGO_Dashboard />
  if (currentPage === 'district-authority') return <DistrictAuthorityDashboard />
  if (currentPage === 'admin') return <AdminDashboard />
  if (currentPage === 'volunteer-dashboard') return <VolunteerDashboard />
  return <Landing />
}

export default App


