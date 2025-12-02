import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Package, Truck, Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '../stores/authStore';
import { Shipment } from '../types/database';
import { useTranslation } from 'react-i18next';

const Shipments: React.FC = () => {
  const { user } = useAuthStore();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { t, i18n } = useTranslation();

  

  const fetchShipments = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.shipments.list();
      setShipments(data || []);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchShipments();
  }, [user, fetchShipments]);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.sender_address?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient_address?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const shipmentDate = new Date(shipment.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today': {
          matchesDate = shipmentDate.toDateString() === now.toDateString();
          break;
        }
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = shipmentDate >= weekAgo;
          break;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = shipmentDate >= monthAgo;
          break;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
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

  const exportToCSV = () => {
    const headers = ['Tracking Number', 'Status', 'Sender', 'Recipient', 'Carrier', 'Created Date', 'Estimated Delivery'];
    const rows = filteredShipments.map(shipment => [
      shipment.tracking_number,
      shipment.status,
      shipment.sender_address?.name || '',
      shipment.recipient_address?.name || '',
      shipment.carrier?.name || '',
      formatDate(shipment.created_at),
      shipment.estimated_delivery ? formatDate(shipment.estimated_delivery) : ''
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('nav.shipments')}</h1>
              <p className="text-gray-600 mt-1">{t('nav.tracking')}</p>
            </div>
            <Link
              to="/shipments/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('actions.new_shipment')}
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('track.placeholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                {t('actions.filters')}
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t('actions.export')}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('shipments.status')}</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('shipments.all_statuses')}</option>
                      <option value="pending">{t('shipments.pending')}</option>
                      <option value="in_transit">{t('shipments.in_transit')}</option>
                      <option value="delivered">{t('shipments.delivered')}</option>
                      <option value="cancelled">{t('shipments.cancelled')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('shipments.date_range')}</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('shipments.date_all')}</option>
                      <option value="today">{t('shipments.date_today')}</option>
                      <option value="week">{t('shipments.date_week')}</option>
                      <option value="month">{t('shipments.date_month')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('analytics.total_shipments')}</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredShipments.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('analytics.in_transit')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredShipments.filter(s => s.status === 'in_transit').length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('analytics.delivered')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredShipments.filter(s => s.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('shipments.pending')}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredShipments.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading shipments...</p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('shipments.no_shipments')}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? t('shipments.adjust_filters')
                  : t('shipments.create_first')}
              </p>
              {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                <Link
                  to="/shipments/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('actions.new_shipment')}
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.tracking_number')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.sender')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.recipient')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.carrier')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.created')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.estimated_delivery')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('shipments.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.tracking_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          {t(`shipments.${shipment.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {shipment.sender_address?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {shipment.sender_address?.city}, {shipment.sender_address?.state}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {shipment.recipient_address?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {shipment.recipient_address?.city}, {shipment.recipient_address?.state}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.estimated_delivery ? formatDate(shipment.estimated_delivery) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/shipments/${shipment.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/tracking/${shipment.tracking_number}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            {t('nav.tracking')}
                          </Link>
                        </div>
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

export default Shipments;
