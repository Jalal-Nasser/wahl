import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Shipments from '@/pages/Shipments'
import CreateShipment from '@/pages/CreateShipment'
import ShipmentDetails from '@/pages/ShipmentDetails'
import Tracking from '@/pages/Tracking'
import Analytics from '@/pages/Analytics'
import Homepage from '@/pages/Homepage'
import About from '@/pages/About'
import Services from '@/pages/Services'
import Clients from '@/pages/Clients'
import Contact from '@/pages/Contact'
// Blog removed per requirements
import AdminContent from '@/pages/AdminContent'
import Profile from '@/pages/Profile'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

function App() {
  const { user, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        {/* Registration removed: admin invites only */}
        
        {/* Protected routes */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="shipments/create" element={<CreateShipment />} />
          <Route path="shipments/:id" element={<ShipmentDetails />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="admin/content" element={<AdminContent />} />
        </Route>
      </Routes>
      <PublicAnalytics />
    </Router>
  )
}

function PublicAnalytics() {
  const location = useLocation()
  const path = location.pathname
  const publicPaths = new Set([
    '/',
    '/about',
    '/services',
    '/clients',
    '/contact',
  ])
  const isPublic = publicPaths.has(path)
  return isPublic ? <VercelAnalytics /> : null
}

export default App
