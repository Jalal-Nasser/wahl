import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
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
import Blog from '@/pages/Blog'
import AdminContent from '@/pages/AdminContent'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

function App() {
  const { user, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected routes */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<Dashboard />} />
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
    '/blog',
    '/login',
    '/register',
  ])
  const isPublic = publicPaths.has(path) || path.startsWith('/blog/')
  return isPublic ? <VercelAnalytics /> : null
}

export default App
