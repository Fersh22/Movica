export type ServiceType = 'mototaxi' | 'domicilio' | 'encomienda' | 'compra' | 'mandado';

export interface Order {
  id: string;
  type: ServiceType;
  title: string;
  details: string;
  price: number;
  status: 'solicitado' | 'asignado' | 'en_camino' | 'completado' | 'cancelado';
  date: string;
  driver?: {
    name: string;
    avatar: string;
    vehicle: string;
    plate: string;
    phone: string;
    rating: number;
  };
  pickupAddress?: string;
  deliveryAddress?: string;
  items?: { name: string; qty: number; price: number }[];
  instructions?: string;
}

export interface Favorite {
  id: string;
  label: string; // e.g. "Casa", "Trabajo"
  address: string;
  icon: string; // emoji or identifier
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarLetter: string;
  addresses: { label: string; address: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'driver' | 'client';
  text: string;
  timestamp: string;
}

export interface PartnerProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string; // emoji or url
  vehicle: string;
  plate: string;
  rating: number;
  servicesCompleted: number;
  status: 'disponible' | 'no_disponible';
}

export interface PartnerEarning {
  id: string;
  orderId: string;
  type: ServiceType;
  clientName: string;
  amount: number;
  date: string;
  pickup: string;
  delivery: string;
}

