import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Truck, DollarSign, Plus, Trash2, User, Phone, Mail, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Carrier, Address } from '../types/database';

interface FormData {
  sender: {
    name: string;
    email: string;
    phone: string;
    company: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  recipient: {
    name: string;
    email: string;
    phone: string;
    company: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  package: {
    weight: string;
    length: string;
    width: string;
    height: string;
    value: string;
    description: string;
    service_type: string;
  };
  carrier_id: string;
  insurance: boolean;
  signature_required: boolean;
}

const CreateShipment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    sender: {
      name: '',
      email: '',
      phone: '',
      company: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'United States'
    },
    recipient: {
      name: '',
      email: '',
      phone: '',
      company: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'United States'
    },
    package: {
      weight: '',
      length: '',
      width: '',
      height: '',
      value: '',
      description: '',
      service_type: 'standard'
    },
    carrier_id: '',
    insurance: false,
    signature_required: false
  });

  useEffect(() => {
    fetchCarriers();
    fetchSavedAddresses();
  }, []);

  const fetchCarriers = async () => {
    try {
      const { data, error } = await supabase
        .from('carriers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCarriers(data || []);
    } catch (error) {
      console.error('Error fetching carriers:', error);
    }
  };

  const fetchSavedAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedAddresses(data || []);
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    }
  };

  const generateTrackingNumber = () => {
    const prefix = 'SHP';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create sender address
      const { data: senderAddress, error: senderError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          name: formData.sender.name,
          email: formData.sender.email,
          phone: formData.sender.phone,
          company: formData.sender.company,
          street: formData.sender.street,
          city: formData.sender.city,
          state: formData.sender.state,
          zip_code: formData.sender.zip_code,
          country: formData.sender.country
        })
        .select()
        .single();

      if (senderError) throw senderError;

      // Create recipient address
      const { data: recipientAddress, error: recipientError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          name: formData.recipient.name,
          email: formData.recipient.email,
          phone: formData.recipient.phone,
          company: formData.recipient.company,
          street: formData.recipient.street,
          city: formData.recipient.city,
          state: formData.recipient.state,
          zip_code: formData.recipient.zip_code,
          country: formData.recipient.country
        })
        .select()
        .single();

      if (recipientError) throw recipientError;

      // Create shipment
      const trackingNumber = generateTrackingNumber();
      const { data: shipment, error: shipmentError } = await supabase
        .from('shipments')
        .insert({
          user_id: user.id,
          tracking_number: trackingNumber,
          sender_address_id: senderAddress.id,
          recipient_address_id: recipientAddress.id,
          carrier_id: formData.carrier_id,
          weight: parseFloat(formData.package.weight),
          length: parseFloat(formData.package.length),
          width: parseFloat(formData.package.width),
          height: parseFloat(formData.package.height),
          value: parseFloat(formData.package.value),
          description: formData.package.description,
          service_type: formData.package.service_type,
          insurance: formData.insurance,
          signature_required: formData.signature_required,
          status: 'pending',
          estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (shipmentError) throw shipmentError;

      // Create initial tracking event
      await supabase.from('tracking_events').insert({
        shipment_id: shipment.id,
        status: 'pending',
        description: 'Shipment created and ready for pickup',
        location: `${formData.sender.city}, ${formData.sender.state}`
      });

      navigate(`/shipments/${shipment.id}`);
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Error creating shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Sender Information', icon: User },
    { number: 2, title: 'Recipient Information', icon: MapPin },
    { number: 3, title: 'Package Details', icon: Package },
    { number: 4, title: 'Shipping Options', icon: Truck },
    { number: 5, title: 'Review & Confirm', icon: DollarSign }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sender Information</h2>
              {savedAddresses.length > 0 && (
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const address = savedAddresses.find(a => a.id === e.target.value);
                    if (address) {
                      setFormData(prev => ({
                        ...prev,
                        sender: {
                          name: address.name,
                          email: address.email,
                          phone: address.phone,
                          company: address.company,
                          street: address.street,
                          city: address.city,
                          state: address.state,
                          zip_code: address.zip_code,
                          country: address.country
                        }
                      }));
                    }
                  }}
                >
                  <option value="">Use saved address</option>
                  {savedAddresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.name} - {address.street}, {address.city}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, name: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, email: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, phone: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, company: e.target.value } }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.sender.street}
                onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, street: e.target.value } }))}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, city: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, state: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, zip_code: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.sender.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, sender: { ...prev.sender, country: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recipient Information</h2>
              {savedAddresses.length > 0 && (
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const address = savedAddresses.find(a => a.id === e.target.value);
                    if (address) {
                      setFormData(prev => ({
                        ...prev,
                        recipient: {
                          name: address.name,
                          email: address.email,
                          phone: address.phone,
                          company: address.company,
                          street: address.street,
                          city: address.city,
                          state: address.state,
                          zip_code: address.zip_code,
                          country: address.country
                        }
                      }));
                    }
                  }}
                >
                  <option value="">Use saved address</option>
                  {savedAddresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.name} - {address.street}, {address.city}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, name: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, email: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, phone: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, company: e.target.value } }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.recipient.street}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, street: e.target.value } }))}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, city: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, state: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, zip_code: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.recipient.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipient: { ...prev.recipient, country: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.package.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, weight: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.package.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, value: e.target.value } }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (inches)</label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Length"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.package.length}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, length: e.target.value } }))}
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Width"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.package.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, width: e.target.value } }))}
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Height"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.package.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, height: e.target.value } }))}
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.package.service_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, service_type: e.target.value } }))}
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="overnight">Overnight</option>
                  <option value="ground">Ground</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Description *</label>
              <textarea
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.package.description}
                onChange={(e) => setFormData(prev => ({ ...prev, package: { ...prev.package, description: e.target.value } }))}
                placeholder="Describe the contents of your package..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Select Carrier *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carriers.map((carrier) => (
                  <div
                    key={carrier.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.carrier_id === carrier.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, carrier_id: carrier.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{carrier.name}</h3>
                        <p className="text-sm text-gray-600">{carrier.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${carrier.base_rate}</p>
                        <p className="text-xs text-gray-600">Base rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="insurance"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.insurance}
                  onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.checked }))}
                />
                <label htmlFor="insurance" className="ml-2 block text-sm text-gray-900">
                  Add insurance coverage (+$5.00)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="signature"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.signature_required}
                  onChange={(e) => setFormData(prev => ({ ...prev, signature_required: e.target.checked }))}
                />
                <label htmlFor="signature" className="ml-2 block text-sm text-gray-900">
                  Require signature on delivery (+$3.00)
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        const selectedCarrier = carriers.find(c => c.id === formData.carrier_id);
        const baseRate = parseFloat(selectedCarrier?.base_rate || '0');
        const insuranceFee = formData.insurance ? 5 : 0;
        const signatureFee = formData.signature_required ? 3 : 0;
        const totalCost = baseRate + insuranceFee + signatureFee;

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sender</h4>
                  <p className="text-sm text-gray-600">{formData.sender.name}</p>
                  <p className="text-sm text-gray-600">{formData.sender.email}</p>
                  <p className="text-sm text-gray-600">{formData.sender.street}</p>
                  <p className="text-sm text-gray-600">{formData.sender.city}, {formData.sender.state} {formData.sender.zip_code}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recipient</h4>
                  <p className="text-sm text-gray-600">{formData.recipient.name}</p>
                  <p className="text-sm text-gray-600">{formData.recipient.email}</p>
                  <p className="text-sm text-gray-600">{formData.recipient.street}</p>
                  <p className="text-sm text-gray-600">{formData.recipient.city}, {formData.recipient.state} {formData.recipient.zip_code}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Package Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>Weight: {formData.package.weight} lbs</p>
                    <p>Dimensions: {formData.package.length}" × {formData.package.width}" × {formData.package.height}"</p>
                    <p>Value: ${formData.package.value}</p>
                  </div>
                  <div>
                    <p>Service: {formData.package.service_type}</p>
                    <p>Carrier: {selectedCarrier?.name}</p>
                    <p>Description: {formData.package.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Rate:</span>
                    <span>${baseRate.toFixed(2)}</span>
                  </div>
                  {formData.insurance && (
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span>${insuranceFee.toFixed(2)}</span>
                    </div>
                  )}
                  {formData.signature_required && (
                    <div className="flex justify-between">
                      <span>Signature Required:</span>
                      <span>${signatureFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.sender.name && formData.sender.email && formData.sender.phone && 
               formData.sender.street && formData.sender.city && formData.sender.state && 
               formData.sender.zip_code && formData.sender.country;
      case 2:
        return formData.recipient.name && formData.recipient.email && formData.recipient.phone && 
               formData.recipient.street && formData.recipient.city && formData.recipient.state && 
               formData.recipient.zip_code && formData.recipient.country;
      case 3:
        return formData.package.weight && formData.package.value && formData.package.description &&
               formData.package.length && formData.package.width && formData.package.height;
      case 4:
        return formData.carrier_id;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shipments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shipments
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
          <p className="text-gray-600 mt-2">Follow the steps below to create your shipment</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-colors ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ml-4 sm:ml-8 w-12 h-0.5 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;