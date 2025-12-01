import React, { useState } from 'react';
import { Search, Package, Truck, Clock, CheckCircle, MapPin, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Shipment, TrackingEvent } from '../types/database';

const Tracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Search for shipment by tracking number
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select(`
          *,
          sender_address:addresses!shipments_sender_address_id_fkey(*),
          recipient_address:addresses!shipments_recipient_address_id_fkey(*),
          carrier:carriers(*)
        `)
        .eq('tracking_number', trackingNumber.trim())
        .single();

      if (shipmentError || !shipmentData) {
        setError('Shipment not found. Please check your tracking number.');
        setShipment(null);
        setTrackingEvents([]);
        return;
      }

      setShipment(shipmentData);

      // Fetch tracking events
      const { data: eventsData, error: eventsError } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipmentData.id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;
      setTrackingEvents(eventsData || []);
    } catch (err) {
      console.error('Error tracking shipment:', err);
      setError('An error occurred while tracking your shipment.');
    } finally {
      setLoading(false);
    }
  };

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
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'in_transit': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <Clock className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    if (!shipment) return 0;
    switch (shipment.status) {
      case 'pending': return 25;
      case 'in_transit': return 60;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Shipment</h1>
          <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your tracking number (e.g., SHP12345678)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !trackingNumber.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  Track
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {shipment && (
          <div className="space-y-6">
            {/* Shipment Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipment Found</h2>
                  <p className="text-gray-600 mt-1">Tracking Number: {shipment.tracking_number}</p>
                </div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                  {getStatusIcon(shipment.status)}
                  {shipment.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Order Placed</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    From
                  </h3>
                  <p className="text-sm text-gray-900">{shipment.sender_address?.name}</p>
                  <p className="text-sm text-gray-600">{shipment.sender_address?.street}</p>
                  <p className="text-sm text-gray-600">
                    {shipment.sender_address?.city}, {shipment.sender_address?.state} {shipment.sender_address?.zip_code}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    To
                  </h3>
                  <p className="text-sm text-gray-900">{shipment.recipient_address?.name}</p>
                  <p className="text-sm text-gray-600">{shipment.recipient_address?.street}</p>
                  <p className="text-sm text-gray-600">
                    {shipment.recipient_address?.city}, {shipment.recipient_address?.state} {shipment.recipient_address?.zip_code}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">
                    {shipment.estimated_delivery 
                      ? formatDate(shipment.estimated_delivery)
                      : 'Not available'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{shipment.weight} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carrier</p>
                  <p className="font-medium">{shipment.carrier?.name}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            {trackingEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Tracking History
                </h3>
                
                <div className="space-y-4">
                  {trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                        {index < trackingEvents.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {event.status.replace('_', ' ')}
                            </h4>
                            <p className="text-gray-600 mt-1">{event.description}</p>
                            {event.location && (
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(event.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Package Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Package Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{shipment.weight} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dimensions</p>
                  <p className="font-medium">
                    {shipment.length}" × {shipment.width}" × {shipment.height}"
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Value</p>
                  <p className="font-medium">${shipment.value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-medium capitalize">{shipment.service_type.replace('_', ' ')}</p>
                </div>
              </div>
              {shipment.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{shipment.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
