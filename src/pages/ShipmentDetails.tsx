import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, Clock, CheckCircle, XCircle, MapPin, User, Eye, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Shipment, TrackingEvent } from '../types/database';

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  

  const fetchShipmentDetails = useCallback(async () => {
    if (!user || !id) return;

    try {
      setLoading(true);
      
      // Fetch shipment with related data
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select(`
          *,
          sender_address:addresses!shipments_sender_address_id_fkey(*),
          recipient_address:addresses!shipments_recipient_address_id_fkey(*),
          carrier:carriers(*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (shipmentError) throw shipmentError;
      setShipment(shipmentData);

      // Fetch tracking events
      const { data: eventsData, error: eventsError } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;
      setTrackingEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching shipment details:', error);
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    if (id) {
      fetchShipmentDetails();
    }
  }, [id, fetchShipmentDetails]);

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
      case 'cancelled': return <XCircle className="w-5 h-5" />;
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

  const calculateCost = () => {
    if (!shipment) return 0;
    const baseRate = parseFloat(shipment.carrier?.base_rate || '0');
    const insuranceFee = shipment.insurance ? 5 : 0;
    const signatureFee = shipment.signature_required ? 3 : 0;
    return baseRate + insuranceFee + signatureFee;
  };

  const exportLabel = () => {
    if (!shipment) return;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - ${shipment.tracking_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
          .tracking-number { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
          .address { margin-bottom: 15px; }
          .address h3 { margin: 0 0 5px 0; font-size: 14px; font-weight: bold; }
          .address p { margin: 2px 0; font-size: 12px; }
          .barcode { text-align: center; margin: 20px 0; font-family: monospace; font-size: 18px; }
          .details { font-size: 12px; margin-top: 20px; }
          .details p { margin: 3px 0; }
        </style>
      </head>
      <body>
        <div className="label">
          <div className="tracking-number">${shipment.tracking_number}</div>
          <div class="barcode">${shipment.tracking_number.replace(/(.)/g, '$1 ')}</div>
          
          <div class="address">
            <h3>FROM:</h3>
            <p>${shipment.sender_address?.name}</p>
            <p>${shipment.sender_address?.company}</p>
            <p>${shipment.sender_address?.street}</p>
            <p>${shipment.sender_address?.city}, ${shipment.sender_address?.state} ${shipment.sender_address?.zip_code}</p>
          </div>
          
          <div class="address">
            <h3>TO:</h3>
            <p>${shipment.recipient_address?.name}</p>
            <p>${shipment.recipient_address?.company}</p>
            <p>${shipment.recipient_address?.street}</p>
            <p>${shipment.recipient_address?.city}, ${shipment.recipient_address?.state} ${shipment.recipient_address?.zip_code}</p>
          </div>
          
          <div class="details">
            <p><strong>Carrier:</strong> ${shipment.carrier?.name}</p>
            <p><strong>Service:</strong> ${shipment.service_type}</p>
            <p><strong>Weight:</strong> ${shipment.weight} lbs</p>
            <p><strong>Cost:</strong> $${calculateCost().toFixed(2)}</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shipment not found</h3>
          <Link to="/shipments" className="text-blue-600 hover:text-blue-800">
            Back to shipments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/shipments" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Shipments
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
              <p className="text-gray-600 mt-1">Tracking Number: {shipment.tracking_number}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/tracking/${shipment.tracking_number}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Track
              </Link>
              <button
                onClick={exportLabel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Print Label
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                {getStatusIcon(shipment.status)}
                {shipment.status.replace('_', ' ').toUpperCase()}
              </span>
              <div className="text-sm text-gray-600">
                <p>Created: {formatDate(shipment.created_at)}</p>
                {shipment.estimated_delivery && (
                  <p>Estimated Delivery: {formatDate(shipment.estimated_delivery)}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${calculateCost().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Sender Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{shipment.sender_address?.name}</p>
              </div>
              {shipment.sender_address?.company && (
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium">{shipment.sender_address.company}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{shipment.sender_address?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{shipment.sender_address?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{shipment.sender_address?.street}</p>
                <p className="font-medium">
                  {shipment.sender_address?.city}, {shipment.sender_address?.state} {shipment.sender_address?.zip_code}
                </p>
                <p className="font-medium">{shipment.sender_address?.country}</p>
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Recipient Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{shipment.recipient_address?.name}</p>
              </div>
              {shipment.recipient_address?.company && (
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium">{shipment.recipient_address.company}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{shipment.recipient_address?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{shipment.recipient_address?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{shipment.recipient_address?.street}</p>
                <p className="font-medium">
                  {shipment.recipient_address?.city}, {shipment.recipient_address?.state} {shipment.recipient_address?.zip_code}
                </p>
                <p className="font-medium">{shipment.recipient_address?.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Package Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-medium capitalize">{shipment.service_type.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium">{shipment.description}</p>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Carrier</p>
              <p className="font-medium">{shipment.carrier?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Insurance</p>
              <p className="font-medium">{shipment.insurance ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Signature Required</p>
              <p className="font-medium">{shipment.signature_required ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Tracking History
          </h2>
          
          {trackingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No tracking events yet</p>
              <p className="text-sm text-gray-500">Tracking information will appear once the shipment is processed</p>
            </div>
          ) : (
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
                        <h3 className="font-medium text-gray-900 capitalize">
                          {event.status.replace('_', ' ')}
                        </h3>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
