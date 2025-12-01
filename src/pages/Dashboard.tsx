import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Shipment, AnalyticsData } from '@/types/database'
import { Package, Truck, Clock, DollarSign, TrendingUp, Plus, Eye, LucideIcon } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch recent shipments
      const { data: shipmentsData } = await supabase
        .from('shipments')
        .select(`
          *,
          carrier:carriers(name)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (shipmentsData) {
        setShipments(shipmentsData as Shipment[])
      }

      // Calculate analytics
      const { data: allShipments } = await supabase
        .from('shipments')
        .select('status, cost, created_at')
        .eq('user_id', user!.id)

      if (allShipments) {
        const total = allShipments.length
        const delivered = allShipments.filter(s => s.status === 'delivered').length
        const inTransit = allShipments.filter(s => s.status === 'in_transit').length
        const pending = allShipments.filter(s => s.status === 'pending').length
        const totalRevenue = allShipments.reduce((sum, s) => sum + (s.cost || 0), 0)
        const successRate = total > 0 ? (delivered / total) * 100 : 0

        setAnalytics({
          total_shipments: total,
          delivered_shipments: delivered,
          in_transit_shipments: inTransit,
          pending_shipments: pending,
          total_revenue: totalRevenue,
          average_delivery_time: 2.5, // Mock data
          success_rate: successRate
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [user, loadDashboardData, navigate])

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: string | number; icon: LucideIcon; trend?: number }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}%</span>
            </div>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your shipments today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/shipments/create"
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Shipment</span>
        </Link>
        <Link
          to="/shipments"
          className="bg-white hover:bg-gray-50 text-gray-700 p-4 rounded-lg flex items-center justify-center space-x-2 border border-gray-200 transition-colors"
        >
          <Package className="h-5 w-5" />
          <span>View Shipments</span>
        </Link>
        <Link
          to="/tracking"
          className="bg-white hover:bg-gray-50 text-gray-700 p-4 rounded-lg flex items-center justify-center space-x-2 border border-gray-200 transition-colors"
        >
          <Truck className="h-5 w-5" />
          <span>Track Package</span>
        </Link>
        <Link
          to="/analytics"
          className="bg-white hover:bg-gray-50 text-gray-700 p-4 rounded-lg flex items-center justify-center space-x-2 border border-gray-200 transition-colors"
        >
          <TrendingUp className="h-5 w-5" />
          <span>View Reports</span>
        </Link>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Shipments"
            value={analytics.total_shipments}
            icon={Package}
          />
          <StatCard
            title="Delivered"
            value={analytics.delivered_shipments}
            icon={Truck}
            trend={analytics.success_rate}
          />
          <StatCard
            title="In Transit"
            value={analytics.in_transit_shipments}
            icon={Clock}
          />
          <StatCard
            title="Revenue"
            value={`$${analytics.total_revenue.toFixed(2)}`}
            icon={DollarSign}
          />
        </div>
      )}

      {/* Recent Shipments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
            <Link
              to="/shipments"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.tracking_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.service_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${shipment.cost?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/shipments/${shipment.id}`}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shipments.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No shipments found</p>
              <Link
                to="/shipments/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Shipment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
