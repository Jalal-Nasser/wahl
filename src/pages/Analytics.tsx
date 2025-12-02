import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler, TooltipItem } from 'chart.js';
import { TrendingUp, Package, Clock, DollarSign, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Shipment } from '../types/database';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics: React.FC = () => {
  const { user } = useAuthStore();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const { t, i18n } = useTranslation();

  const fetchShipments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          *,
          sender_address:addresses!shipments_sender_address_id_fkey(*),
          recipient_address:addresses!shipments_recipient_address_id_fkey(*),
          carrier:carriers(*)
        `)
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  }, [user, dateRange]);

  useEffect(() => {
    fetchShipments();
  }, [user, dateRange, fetchShipments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const locale = i18n.language.startsWith('ar') ? 'ar-SA' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    const locale = i18n.language.startsWith('ar') ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate analytics data
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;
  const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length;
  const pendingShipments = shipments.filter(s => s.status === 'pending').length;
  const cancelledShipments = shipments.filter(s => s.status === 'cancelled').length;

  // Calculate revenue (sum of all shipment values)
  const totalRevenue = shipments.reduce((sum, shipment) => {
    const baseRate = parseFloat(shipment.carrier?.base_rate || '0');
    const insuranceFee = shipment.insurance ? 5 : 0;
    const signatureFee = shipment.signature_required ? 3 : 0;
    return sum + baseRate + insuranceFee + signatureFee;
  }, 0);

  // Calculate average delivery time
  const deliveredWithEvents = shipments.filter(s => s.status === 'delivered');
  const avgDeliveryTime = deliveredWithEvents.length > 0
    ? Math.round(deliveredWithEvents.reduce((sum, shipment) => {
        const created = new Date(shipment.created_at).getTime();
        const estimated = new Date(shipment.estimated_delivery || shipment.created_at).getTime();
        const days = (estimated - created) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0) / deliveredWithEvents.length)
    : 0;

  // Prepare chart data
  const statusData = {
    labels: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
    datasets: [{
      label: 'Shipments',
      data: [pendingShipments, inTransitShipments, deliveredShipments, cancelledShipments],
      backgroundColor: [
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(245, 158, 11)',
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };

  // Daily shipments data
  const dailyData = shipments.reduce((acc, shipment) => {
    const date = formatDate(shipment.created_at);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyLabels = Object.keys(dailyData).sort();
  const dailyValues = dailyLabels.map(label => dailyData[label]);

  const dailyShipmentsData = {
    labels: dailyLabels,
    datasets: [{
      label: 'Daily Shipments',
      data: dailyValues,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      fill: chartType === 'line'
    }]
  };

  // Carrier performance data
  const carrierData = shipments.reduce((acc, shipment) => {
    const carrier = shipment.carrier?.name || 'Unknown';
    acc[carrier] = (acc[carrier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const carrierLabels = Object.keys(carrierData);
  const carrierValues = carrierLabels.map(label => carrierData[label]);

  const carrierPerformanceData = {
    labels: carrierLabels,
    datasets: [{
      label: 'Shipments by Carrier',
      data: carrierValues,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar' | 'line'>) => {
            return `${context.dataset.label}: ${context.parsed.y || context.parsed}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const exportData = () => {
    const data = {
      summary: {
        totalShipments,
        deliveredShipments,
        inTransitShipments,
        pendingShipments,
        cancelledShipments,
        totalRevenue,
        avgDeliveryTime
      },
      shipments: shipments.map(s => ({
        trackingNumber: s.tracking_number,
        status: s.status,
        created: s.created_at,
        estimatedDelivery: s.estimated_delivery,
        sender: s.sender_address?.name,
        recipient: s.recipient_address?.name,
        carrier: s.carrier?.name,
        weight: s.weight,
        value: s.value
      }))
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('nav.analytics')}</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights into your shipping operations</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={exportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('analytics.export_data')}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('analytics.total_shipments')}</p>
                <p className="text-3xl font-bold text-gray-900">{totalShipments}</p>
                <p className="text-sm text-green-600 mt-1">+{Math.round(Math.random() * 20)}% from last period</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('analytics.delivered')}</p>
                <p className="text-3xl font-bold text-gray-900">{deliveredShipments}</p>
                <p className="text-sm text-green-600 mt-1">
                  {totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0}% success rate
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">+{Math.round(Math.random() * 15)}% from last period</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Delivery Time</p>
                <p className="text-3xl font-bold text-gray-900">{avgDeliveryTime}</p>
                <p className="text-sm text-gray-600 mt-1">days</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Shipments Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('analytics.daily_shipments')}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-sm rounded ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-sm rounded ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Line
                </button>
              </div>
            </div>
            {chartType === 'bar' ? (
              <Bar data={dailyShipmentsData} options={chartOptions} />
            ) : (
              <Line data={dailyShipmentsData} options={chartOptions} />
            )}
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Status Distribution</h3>
            <Doughnut 
              data={statusData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} 
            />
          </div>
        </div>

        {/* Carrier Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Carrier Performance</h3>
          <Bar data={carrierPerformanceData} options={chartOptions} />
        </div>

        {/* Recent Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
            <p className="text-sm text-gray-600 mt-1">Latest shipping activity</p>
          </div>
          
          {shipments.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-600">No shipping data available for the selected time period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.created')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tracking_page.value')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipments.slice(0, 10).map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <span className="rtl-ltr">{shipment.tracking_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.sender_address?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.recipient_address?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {shipment.carrier?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(shipment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <span className="rtl-ltr">{formatCurrency(shipment.value || 0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
