export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'shipper' | 'carrier' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Carrier {
  id: string;
  name: string;
  api_key?: string;
  service_types: string[];
  is_active: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  state?: string;
  zip_code?: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  user_id: string;
  carrier_id?: string;
  sender_address: AddressData;
  recipient_address: AddressData;
  weight: number;
  dimensions?: string;
  service_type: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  cost?: number;
  created_at: string;
  updated_at: string;
  carrier?: Carrier;
}

export interface AddressData {
  street: string;
  city: string;
  state?: string;
  zip_code?: string;
  country: string;
  full_name?: string;
  phone?: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: string;
  location?: string;
  description?: string;
  event_time: string;
  created_at: string;
}

export interface ShipmentWithTracking extends Shipment {
  tracking_events: TrackingEvent[];
}

export interface AnalyticsData {
  total_shipments: number;
  delivered_shipments: number;
  in_transit_shipments: number;
  pending_shipments: number;
  total_revenue: number;
  average_delivery_time: number;
  success_rate: number;
}

export interface ShipmentStats {
  status: string;
  count: number;
  percentage: number;
}

export interface CostAnalysis {
  service_type: string;
  total_cost: number;
  shipment_count: number;
  average_cost: number;
}

export interface DeliveryMetrics {
  date: string;
  shipments: number;
  delivered: number;
  avg_delivery_time: number;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  phone: string;
  email: string;
  location: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}
