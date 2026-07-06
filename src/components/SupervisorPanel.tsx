import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Bell, Users, Bike, Store, Clock, CheckCircle, XCircle, 
  MapPin, RefreshCw, Sliders, Search, Power, Send, AlertTriangle, 
  Play, Pause, ChevronRight, Activity, TrendingUp, DollarSign, Award,
  Volume2, Compass, AlertCircle, Phone, Sparkles, LogOut, MessageSquare, CornerUpLeft, UserCheck, Shield, Database
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, Legend, PieChart, Pie
} from 'recharts';
import ModerationManager from './ModerationManager';
import BackendIntegrationHub from './BackendIntegrationHub';

// Define structures for supervisor tracking
interface SupervisorOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceType: 'domicilio' | 'mototaxi' | 'compra' | 'encomienda';
  status: 'pendiente' | 'activo' | 'finalizado' | 'cancelado';
  origin: string;
  destination: string;
  price: number;
  assignedAllyId?: string;
  assignedAllyName?: string;
  elapsedMinutes: number;
  isDelayed: boolean;
}

interface SupervisorAlly {
  id: string;
  name: string;
  phone: string;
  vehicle: 'moto' | 'carro' | 'bici';
  plate: string;
  status: 'conectado' | 'pausado' | 'en_servicio' | 'inactivo';
  rating: number;
  completedToday: number;
  latitude: number;
  longitude: number;
}

interface SupervisorAlert {
  id: string;
  type: 'sos' | 'reporte' | 'demora' | 'inactivo';
  title: string;
  description: string;
  time: string;
  isAddressed: boolean;
  severity: 'alta' | 'media' | 'baja';
}

interface Announcement {
  id: string;
  text: string;
  target: 'all' | 'allies' | 'clients' | 'merchants';
  timestamp: string;
  type: 'emergency' | 'info' | 'promo';
}

// Initial Mock Datasets
const INITIAL_SUPERVISOR_ORDERS: SupervisorOrder[] = [
  {
    id: 'SVC-8901',
    clientName: 'Daniel Contreras',
    clientPhone: '315 289 1102',
    serviceType: 'domicilio',
    status: 'activo',
    origin: 'La Pizzería Gourmet (Calle 5)',
    destination: 'Carrera 12 # 14-45, Barrio San Roque',
    price: 18000,
    assignedAllyId: 'ALY-01',
    assignedAllyName: 'Camilo Torres',
    elapsedMinutes: 28,
    isDelayed: true // Over 25 mins is considered delayed
  },
  {
    id: 'SVC-8902',
    clientName: 'María Fernanda Restrepo',
    clientPhone: '320 445 9921',
    serviceType: 'mototaxi',
    status: 'activo',
    origin: 'Terminal de Transportes',
    destination: 'Hotel El Dorado, Calle 3 # 8-12',
    price: 8000,
    assignedAllyId: 'ALY-03',
    assignedAllyName: 'Héctor Cardona',
    elapsedMinutes: 12,
    isDelayed: false
  },
  {
    id: 'SVC-8903',
    clientName: 'Andrés Felipe Villa',
    clientPhone: '312 889 0012',
    serviceType: 'compra',
    status: 'pendiente',
    origin: 'Supermercado Merkamas',
    destination: 'Carrera 20 # 6-30, Aguachica',
    price: 32000,
    elapsedMinutes: 8,
    isDelayed: false
  },
  {
    id: 'SVC-8904',
    clientName: 'Lucía Méndez',
    clientPhone: '310 556 7711',
    serviceType: 'encomienda',
    status: 'activo',
    origin: 'Calle 10 # 15-20 (Remitente)',
    destination: 'Carrera 5 # 3-15 (Destinatario)',
    price: 6500,
    assignedAllyId: 'ALY-04',
    assignedAllyName: 'Diana Rueda',
    elapsedMinutes: 18,
    isDelayed: false
  },
  {
    id: 'SVC-8905',
    clientName: 'Carlos Mario Tobón',
    clientPhone: '311 909 8812',
    serviceType: 'domicilio',
    status: 'finalizado',
    origin: 'Restaurante El Gran Sabor',
    destination: 'Calle 9 # 12-40',
    price: 24000,
    assignedAllyId: 'ALY-01',
    assignedAllyName: 'Camilo Torres',
    elapsedMinutes: 22,
    isDelayed: false
  },
  {
    id: 'SVC-8906',
    clientName: 'Diana Marcela López',
    clientPhone: '315 221 4455',
    serviceType: 'mototaxi',
    status: 'cancelado',
    origin: 'Parque Principal',
    destination: 'Sena Sede Aguachica',
    price: 9000,
    elapsedMinutes: 4,
    isDelayed: false
  }
];

const INITIAL_SUPERVISOR_ALLIES: SupervisorAlly[] = [
  {
    id: 'ALY-01',
    name: 'Camilo Torres',
    phone: '318 456 9912',
    vehicle: 'moto',
    plate: 'KJW-89D',
    status: 'en_servicio',
    rating: 4.8,
    completedToday: 14,
    latitude: 8.305,
    longitude: -73.618
  },
  {
    id: 'ALY-02',
    name: 'Juan Carlos Restrepo',
    phone: '321 454 8823',
    vehicle: 'moto',
    plate: 'MJK-12A',
    status: 'conectado',
    rating: 4.9,
    completedToday: 18,
    latitude: 8.312,
    longitude: -73.612
  },
  {
    id: 'ALY-03',
    name: 'Héctor Cardona',
    phone: '312 900 8822',
    vehicle: 'moto',
    plate: 'UYT-44F',
    status: 'en_servicio',
    rating: 4.7,
    completedToday: 9,
    latitude: 8.298,
    longitude: -73.622
  },
  {
    id: 'ALY-04',
    name: 'Diana Rueda',
    phone: '315 220 3344',
    vehicle: 'moto',
    plate: 'ZXC-77C',
    status: 'pausado',
    rating: 4.9,
    completedToday: 11,
    latitude: 8.308,
    longitude: -73.629
  },
  {
    id: 'ALY-05',
    name: 'Brayan Sneider Rojas',
    phone: '310 445 2211',
    vehicle: 'bici',
    plate: 'BICI-M',
    status: 'inactivo',
    rating: 4.6,
    completedToday: 4,
    latitude: 8.301,
    longitude: -73.615
  }
];

const INITIAL_ALERTS: SupervisorAlert[] = [
  {
    id: 'ALT-101',
    type: 'sos',
    title: '🚨 Alerta SOS Activada',
    description: 'El aliado Camilo Torres (KJW-89D) reportó emergencia SOS en Calle 11 con Carrera 9. Se requiere contacto policial de inmediato.',
    time: 'Hace 3 min',
    isAddressed: false,
    severity: 'alta'
  },
  {
    id: 'ALT-102',
    type: 'demora',
    title: '⏳ Servicio Demorado SVC-8901',
    description: 'El pedido de Daniel Contreras ha superado los 25 minutos de espera. El aliado asignado sigue detenido en el tráfico.',
    time: 'Hace 8 min',
    isAddressed: false,
    severity: 'media'
  },
  {
    id: 'ALT-103',
    type: 'reporte',
    title: '⚠️ Reporte de Usuario',
    description: 'El cliente Andrés Villa reporta que el comercio "Drogas Aguachica" no responde las llamadas de aclaración de fórmula.',
    time: 'Hace 15 min',
    isAddressed: false,
    severity: 'media'
  },
  {
    id: 'ALT-104',
    type: 'inactivo',
    title: '💤 Aliado Inactivo por Período Prolongado',
    description: 'Brayan Sneider Rojas ha estado sin reportar ubicación por más de 120 minutos pero figura en estado de conexión móvil activa.',
    time: 'Hace 45 min',
    isAddressed: true,
    severity: 'baja'
  }
];

const MOCK_SERVICES_BY_HOUR = [
  { name: '08:00', servicios: 12, ingresos: 84000 },
  { name: '10:00', servicios: 24, ingresos: 168000 },
  { name: '12:00', servicios: 48, ingresos: 390000 },
  { name: '14:00', servicios: 32, ingresos: 220000 },
  { name: '16:00', servicios: 28, ingresos: 198000 },
  { name: '18:00', servicios: 56, ingresos: 480000 },
  { name: '20:00', servicios: 42, ingresos: 310000 },
  { name: '22:00', servicios: 18, ingresos: 120000 }
];

const MOCK_SERVICES_BY_DAY = [
  { name: 'Lunes', servicios: 120, ingresos: 920000 },
  { name: 'Martes', servicios: 140, ingresos: 1100000 },
  { name: 'Miércoles', servicios: 135, ingresos: 1050000 },
  { name: 'Jueves', servicios: 165, ingresos: 1320000 },
  { name: 'Viernes', servicios: 210, ingresos: 1850000 },
  { name: 'Sábado', servicios: 245, ingresos: 2100000 },
  { name: 'Domingo', servicios: 190, ingresos: 1600000 }
];

const MOCK_TOP_ALLIES = [
  { name: 'Juan Carlos Restrepo', pedidos: 32, calificacion: 4.9 },
  { name: 'Diana Rueda', pedidos: 28, calificacion: 4.9 },
  { name: 'Camilo Torres', pedidos: 25, calificacion: 4.8 },
  { name: 'Héctor Cardona', pedidos: 21, calificacion: 4.7 },
  { name: 'Carlos Mario Díaz', pedidos: 18, calificacion: 4.8 }
];

const MOCK_TOP_MERCHANTS = [
  { name: 'El Gran Sabor', pedidos: 42, categoria: 'Comida' },
  { name: 'La Pizzería Gourmet', pedidos: 38, categoria: 'Comida' },
  { name: 'Drogas Aguachica', pedidos: 29, categoria: 'Farmacia' },
  { name: 'Supermercado Merkamas', pedidos: 25, categoria: 'Mercado' },
  { name: 'Heladería Cremas', pedidos: 16, categoria: 'Postres' }
];

export default function SupervisorPanel({ onBackToAdmin }: { onBackToAdmin?: () => void }) {
  // Primary Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monitoreo' | 'gestion' | 'alertas' | 'estadisticas' | 'moderacion' | 'backend'>('dashboard');

  // Real-time Simulation State
  const [orders, setOrders] = useState<SupervisorOrder[]>(INITIAL_SUPERVISOR_ORDERS);
  const [allies, setAllies] = useState<SupervisorAlly[]>(INITIAL_SUPERVISOR_ALLIES);
  const [alerts, setAlerts] = useState<SupervisorAlert[]>(INITIAL_ALERTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ANN-001',
      text: '⚠️ ATENCIÓN: Alta congestión vial reportada en la Avenida Principal. Favor tomar vías alternas.',
      target: 'allies',
      timestamp: '14:15',
      type: 'info'
    }
  ]);

  // UI Interactive States
  const [selectedOrder, setSelectedOrder] = useState<SupervisorOrder | null>(null);
  const [reassigningOrder, setReassigningOrder] = useState<SupervisorOrder | null>(null);
  const [selectedAlly, setSelectedAlly] = useState<SupervisorAlly | null>(null);

  // Announcement Input
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState<'all' | 'allies' | 'clients' | 'merchants'>('all');
  const [announcementType, setAnnouncementType] = useState<'emergency' | 'info' | 'promo'>('info');

  // Search/Filter states
  const [orderFilter, setOrderFilter] = useState<'all' | 'pendiente' | 'activo' | 'finalizado' | 'cancelado'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulation loop: simulate ticking minutes, traffic movements, and occasional randomized changes
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate incrementing order elapsed times
      setOrders(prev => prev.map(o => {
        if (o.status === 'activo' || o.status === 'pendiente') {
          const newMins = o.elapsedMinutes + 1;
          const delayCheck = newMins > 25;
          return {
            ...o,
            elapsedMinutes: newMins,
            isDelayed: delayCheck
          };
        }
        return o;
      }));

      // Simulate subtle ally location shifts
      setAllies(prev => prev.map(a => {
        if (a.status === 'en_servicio' || a.status === 'conectado') {
          return {
            ...a,
            latitude: a.latitude + (Math.random() - 0.5) * 0.001,
            longitude: a.longitude + (Math.random() - 0.5) * 0.001,
          };
        }
        return a;
      }));

      // Occasionally add a mock delayed warning alert
      if (Math.random() > 0.85) {
        setAlerts(prev => {
          const delayAlertExists = prev.some(al => al.id === 'ALT-DELAY-RAND');
          if (delayAlertExists) return prev;
          return [
            {
              id: 'ALT-DELAY-RAND',
              type: 'demora',
              title: '⏳ Demora en Servicio de Domicilio',
              description: 'El servicio SVC-8903 ha estado pendiente de asignación por más de 10 minutos en Aguachica.',
              time: 'Hace 1 min',
              isAddressed: false,
              severity: 'media'
            },
            ...prev
          ];
        });
      }
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Handler: Reassign Service
  const handleReassign = (orderId: string, newAllyId: string) => {
    const targetAlly = allies.find(a => a.id === newAllyId);
    if (!targetAlly) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          assignedAllyId: targetAlly.id,
          assignedAllyName: targetAlly.name,
          status: 'activo'
        };
      }
      return o;
    }));

    // Update ally status
    setAllies(prev => prev.map(a => {
      if (a.id === newAllyId) {
        return { ...a, status: 'en_servicio' };
      }
      return a;
    }));

    // Post system log announcement
    const systemAnnounce: Announcement = {
      id: `SYS-${Date.now()}`,
      text: `🔄 SERVICIO REASIGNADO: Supervisor reasignó el servicio ${orderId} al aliado ${targetAlly.name}.`,
      target: 'allies',
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      type: 'info'
    };
    setAnnouncements(prev => [systemAnnounce, ...prev]);

    // Clear reassign popup
    setReassigningOrder(null);
    alert(`Éxito: El servicio ${orderId} ha sido asignado al aliado ${targetAlly.name}.`);
  };

  // Handler: Cancel Service
  const handleCancelService = (orderId: string) => {
    if (confirm(`¿Estás seguro de que deseas cancelar el servicio ${orderId}? Esta acción es irreversible.`)) {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status: 'cancelado' };
        }
        return o;
      }));

      // Post system announcement
      const systemAnnounce: Announcement = {
        id: `SYS-${Date.now()}`,
        text: `❌ SERVICIO CANCELADO: Operador canceló formalmente el servicio ${orderId} por solicitud administrativa o imprevisto vial.`,
        target: 'all',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        type: 'emergency'
      };
      setAnnouncements(prev => [systemAnnounce, ...prev]);

      alert(`Servicio ${orderId} cancelado con éxito.`);
    }
  };

  // Handler: Pause/Activate Ally
  const handleToggleAllyStatus = (allyId: string) => {
    setAllies(prev => prev.map(a => {
      if (a.id === allyId) {
        const nextStatus = a.status === 'pausado' ? 'conectado' : 'pausado';
        alert(`Estado de aliado cambiado: ${a.name} ahora está ${nextStatus === 'conectado' ? '🟢 Disponible' : '🟡 Pausado por supervisor'}`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Handler: Send announcement
  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const newAnnounce: Announcement = {
      id: `ANN-${Date.now()}`,
      text: announcementText,
      target: announcementTarget,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      type: announcementType
    };

    setAnnouncements(prev => [newAnnounce, ...prev]);
    setAnnouncementText('');
    alert('Anuncio general emitido correctamente a toda la plataforma.');
  };

  // Handler: Address Alert
  const handleAddressAlert = (alertId: string) => {
    setAlerts(prev => prev.map(al => {
      if (al.id === alertId) {
        return { ...al, isAddressed: true };
      }
      return al;
    }));
    alert('Alerta marcada como ATENDIDA y archivada del monitoreo crítico.');
  };

  // Calculate high level stats
  const activeServices = orders.filter(o => o.status === 'activo').length;
  const pendingServices = orders.filter(o => o.status === 'pendiente').length;
  const finishedServices = orders.filter(o => o.status === 'finalizado').length;
  const cancelledServices = orders.filter(o => o.status === 'cancelado').length;

  const connectedAlliesCount = allies.filter(a => a.status !== 'inactivo').length;
  const activeMerchantsCount = 14; // Simulated active merchants list
  const activeClientsCount = 42; // Simulated connected clients

  const unaddressedAlertsCount = alerts.filter(al => !al.isAddressed).length;

  // Filtered orders list for management
  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.origin.toLowerCase().includes(q) ||
        o.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-ink font-sans flex flex-col">
      
      {/* 1. TOP PREMIUM HEADER */}
      <header className="bg-[#0d1a16] text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl shadow-md shadow-primary/20">
            🛡️
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="font-sora font-extrabold text-base tracking-tight text-white leading-none">Mesa de Control y Supervisores</h2>
              <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                Live
              </span>
            </div>
            <p className="text-[10px] text-white/70 mt-0.5 font-semibold">Aguachica, Cesar • Operador de Guardia</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10.5px] font-bold text-white/90">Operadores Conectados: 3</span>
          </div>

          {onBackToAdmin && (
            <button 
              onClick={onBackToAdmin}
              className="bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-all cursor-pointer border border-white/10"
            >
              <CornerUpLeft size={13} /> Volver al Admin
            </button>
          )}
        </div>
      </header>

      {/* 2. SUB NAVIGATION BAR (5 Tabs) */}
      <nav className="bg-white border-b border-divider/50 sticky top-[72px] z-40 px-6 py-2.5 flex justify-between items-center overflow-x-auto whitespace-nowrap content-scrollbar">
        <div className="flex gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Activity size={14} /> },
            { id: 'monitoreo', label: 'Monitoreo Live', icon: <Compass size={14} /> },
            { id: 'gestion', label: 'Gestión Servicios', icon: <Sliders size={14} /> },
            { id: 'alertas', label: 'Alertas SOS & Reportes', icon: <ShieldAlert size={14} />, badge: unaddressedAlertsCount },
            { id: 'moderacion', label: 'Moderación & Sanciones 🛡️', icon: <Shield size={14} /> },
            { id: 'backend', label: 'Estructura API & DB 🔌', icon: <Database size={14} className="text-emerald-500" /> },
            { id: 'estadisticas', label: 'Estadísticas', icon: <TrendingUp size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-surface-alt text-ink-soft hover:bg-divider/50 hover:text-ink'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-bold text-ink-soft flex items-center gap-1.5">
          <Clock size={12} className="text-primary" />
          <span>Hora Local: 21:58:10</span>
        </div>
      </nav>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* INTERACTIVE ALERTS BANNER FOR HIGH SEVERITY ALERTS */}
        {alerts.some(a => a.type === 'sos' && !a.isAddressed) && (
          <div className="bg-red-50 border-2 border-red-500 text-red-900 rounded-2xl p-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse shadow-sm text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🚨</span>
              <div>
                <h4 className="font-sora font-black text-xs uppercase tracking-wider text-red-600">INCIDENTE SOS CRÍTICO DETECTADO</h4>
                <p className="text-xs font-semibold text-red-800 leading-normal mt-1 max-w-2xl">
                  {alerts.find(a => a.type === 'sos' && !a.isAddressed)?.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a 
                href="tel:123" 
                className="bg-red-600 hover:bg-red-700 text-white font-sora font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Phone size={13} /> Llamar Policía (123)
              </a>
              <button
                onClick={() => handleAddressAlert(alerts.find(a => a.type === 'sos' && !a.isAddressed)!.id)}
                className="bg-white hover:bg-red-100 text-red-600 border border-red-200 font-sora font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Marcar Atendido
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* TAB 1: OPERATIONAL DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* TOP OPERATIONAL CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs text-left flex justify-between items-start relative overflow-hidden">
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Servicios Activos</span>
                    <span className="font-sora font-extrabold text-2xl text-ink block mt-1">{activeServices}</span>
                    <span className="text-[9.5px] text-emerald-600 font-bold mt-1.5 inline-block">● 100% Monitoreados</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    🛵
                  </div>
                </div>

                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs text-left flex justify-between items-start relative overflow-hidden">
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Servicios Pendientes</span>
                    <span className="font-sora font-extrabold text-2xl text-amber-500 block mt-1">{pendingServices}</span>
                    <span className="text-[9.5px] text-amber-600 font-bold mt-1.5 inline-block">⚡ Requieren Asignación</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                    ⏳
                  </div>
                </div>

                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs text-left flex justify-between items-start relative overflow-hidden">
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Aliados Conectados</span>
                    <span className="font-sora font-extrabold text-2xl text-ink block mt-1">{connectedAlliesCount}</span>
                    <span className="text-[9.5px] text-ink-soft font-bold mt-1.5 inline-block">{allies.filter(a => a.status === 'en_servicio').length} En viaje activo</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center text-lg">
                    🏍️
                  </div>
                </div>

                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs text-left flex justify-between items-start relative overflow-hidden">
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Servicios Hoy</span>
                    <span className="font-sora font-extrabold text-2xl text-[#0EA65C] block mt-1">
                      {finishedServices + cancelledServices + activeServices + pendingServices}
                    </span>
                    <span className="text-[9.5px] text-rose-500 font-bold mt-1.5 inline-block">✕ {cancelledServices} Cancelados</span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                    📊
                  </div>
                </div>

              </div>

              {/* SECONDARY ECOSYSTEM STATUS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">👥</div>
                  <div>
                    <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block">Clientes Activos</span>
                    <span className="text-sm font-extrabold text-ink">{activeClientsCount} conectados en app</span>
                  </div>
                </div>

                <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">🏪</div>
                  <div>
                    <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block">Comercios en Servicio</span>
                    <span className="text-sm font-extrabold text-ink">{activeMerchantsCount} listos con despachador</span>
                  </div>
                </div>

                <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg">🔔</div>
                  <div>
                    <span className="text-[9.5px] text-red-600 font-bold uppercase tracking-wider block">Alertas Sin Atender</span>
                    <span className="text-sm font-extrabold text-red-600">{unaddressedAlertsCount} críticas en bandeja</span>
                  </div>
                </div>
              </div>

              {/* SPLIT COLUMN WORKSPACE: LIVE SOLICITUDES & BROADCAST COMS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Solicitudes Activas Card */}
                <div className="lg:col-span-2 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm text-left space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-divider/40">
                    <div>
                      <h4 className="font-sora font-extrabold text-sm text-ink">Estado de Servicios en Curso</h4>
                      <p className="text-[10.5px] text-ink-soft mt-0.5">Operación del municipio de Aguachica y zonas circunvecinas.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('gestion')} 
                      className="text-primary hover:text-primary-dark font-black text-xs flex items-center gap-0.5 cursor-pointer"
                    >
                      Ir a Gestión <ChevronRight size={13} />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto content-scrollbar pr-1">
                    {orders.map(order => (
                      <div 
                        key={order.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          order.isDelayed 
                            ? 'border-red-300 bg-red-50/10' 
                            : 'border-divider/50 bg-white hover:border-divider'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-sora font-black text-xs text-ink">{order.id}</span>
                            <span className={`text-[8.5px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider ${
                              order.serviceType === 'domicilio' ? 'bg-orange-50 text-orange-600' :
                              order.serviceType === 'mototaxi' ? 'bg-teal-50 text-teal-600' :
                              order.serviceType === 'compra' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {order.serviceType}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {order.isDelayed && (
                              <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">
                                DEMORADO
                              </span>
                            )}
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              order.status === 'activo' ? 'bg-[#E6F7EC] text-[#0EA65C]' :
                              order.status === 'pendiente' ? 'bg-amber-50 text-amber-600' :
                              order.status === 'finalizado' ? 'bg-slate-100 text-slate-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-semibold">
                          <div>
                            <span className="text-[10px] text-ink-soft block font-bold">CLIENTE</span>
                            <span className="text-ink truncate block">{order.clientName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-ink-soft block font-bold">ALIADO ASIGNADO</span>
                            <span className="text-ink truncate block">{order.assignedAllyName || '⚠️ Sin Asignar'}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs font-semibold text-ink-soft bg-surface-alt/40 p-2 rounded-xl flex items-center justify-between">
                          <div className="truncate max-w-[70%]">
                            <span>📍 {order.origin} → {order.destination}</span>
                          </div>
                          <span className="text-ink font-black flex-shrink-0">
                            ⏱ {order.elapsedMinutes} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enviar Anuncios y Registro de Comunicaciones */}
                <div className="bg-[#0d1a16] text-white rounded-3xl p-5 shadow-sm text-left flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-sora font-extrabold text-sm text-primary">Anuncio Rápido de Emergencia</h4>
                    <p className="text-[10.5px] text-white/70 mt-0.5 font-semibold">Emite indicaciones de tránsito, clima o alertas de seguridad generales.</p>
                  </div>

                  <form onSubmit={handleSendAnnouncement} className="space-y-3">
                    <textarea
                      required
                      rows={3}
                      value={announcementText}
                      onChange={e => setAnnouncementText(e.target.value)}
                      placeholder="Escribe el mensaje general de control..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-none text-white font-semibold leading-relaxed placeholder:text-white/30"
                    />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[8px] text-white/50 block font-black uppercase tracking-wider mb-0.5">Destinatarios</label>
                        <select
                          value={announcementTarget}
                          onChange={e => setAnnouncementTarget(e.target.value as any)}
                          className="w-full bg-white/10 border-0 rounded-xl px-2 py-2 text-white font-bold outline-none"
                        >
                          <option value="all" className="text-ink">Todos 👥</option>
                          <option value="allies" className="text-ink">Aliados 🛵</option>
                          <option value="merchants" className="text-ink">Comercios 🏪</option>
                          <option value="clients" className="text-ink">Clientes 📱</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[8px] text-white/50 block font-black uppercase tracking-wider mb-0.5">Severidad</label>
                        <select
                          value={announcementType}
                          onChange={e => setAnnouncementType(e.target.value as any)}
                          className="w-full bg-white/10 border-0 rounded-xl px-2 py-2 text-white font-bold outline-none"
                        >
                          <option value="info" className="text-ink">Info ℹ️</option>
                          <option value="emergency" className="text-ink">Urgente 🚨</option>
                          <option value="promo" className="text-ink">Promo 🎁</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={12} /> Emitir Anuncio
                    </button>
                  </form>

                  <div className="border-t border-white/10 pt-3.5 space-y-2">
                    <span className="text-[9px] text-white/40 uppercase tracking-wider font-black block">Últimas Comunicaciones</span>
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto content-scrollbar">
                      {announcements.map(ann => (
                        <div key={ann.id} className="text-[10px] font-medium bg-white/5 p-2 rounded-xl border border-white/5">
                          <div className="flex justify-between text-white/50 text-[8px] font-bold">
                            <span>A: {ann.target.toUpperCase()}</span>
                            <span>{ann.timestamp}</span>
                          </div>
                          <p className="text-white/90 mt-0.5 font-semibold leading-relaxed line-clamp-2">{ann.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: REAL-TIME SIMULATED MONITORING */}
          {activeTab === 'monitoreo' && (
            <motion.div
              key="monitoreo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm text-left">
                <div className="flex justify-between items-center border-b border-divider/30 pb-3 mb-4">
                  <div>
                    <h3 className="font-sora font-extrabold text-sm text-ink">Ubicación y Rastreo de Aliados (Aguachica)</h3>
                    <p className="text-xs text-ink-soft">Simulación satelital en tiempo real de cuadrículas del municipio.</p>
                  </div>
                  <span className="text-[10px] bg-[#EBF3FF] text-[#0066FF] font-black px-2.5 py-1 rounded-full uppercase">
                    Modo GPS Activo
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* SIMULATED MAP CANVAS DESIGN */}
                  <div className="lg:col-span-2 bg-[#EAEAE4] rounded-3xl h-[400px] border border-divider/70 relative overflow-hidden flex items-center justify-center p-4 shadow-inner">
                    
                    {/* Fake Grid Map lines */}
                    <div className="absolute inset-0 opacity-15" style={{
                      backgroundImage: 'radial-gradient(circle, #0d1a16 1.5px, transparent 1.5px)',
                      backgroundSize: '24px 24px'
                    }}></div>
                    
                    {/* Simulated Major Roads */}
                    <div className="absolute top-1/2 left-0 right-0 h-10 bg-white/50 -translate-y-1/2 flex items-center justify-center border-y border-divider/30">
                      <span className="text-[8px] uppercase tracking-widest text-ink-faint font-black">Calle Principal (Calle 5)</span>
                    </div>
                    <div className="absolute left-1/3 top-0 bottom-0 w-10 bg-white/50 flex items-center justify-center border-x border-divider/30">
                      <span className="text-[8px] uppercase tracking-widest text-ink-faint font-black [writing-mode:vertical-lr]">Carrera 12</span>
                    </div>

                    {/* Central landmark */}
                    <div className="absolute top-[35%] left-[65%] p-2 rounded-2xl bg-[#0d1a16] text-white text-[8px] font-black uppercase shadow-md flex items-center gap-1">
                      ⛲ Parque Principal
                    </div>

                    {/* Dynamic Ally Map Pins */}
                    {allies.map(ally => {
                      if (ally.status === 'inactiva' || ally.status === 'inactivo') return null;
                      // Translate latitude/longitude changes to percentages inside the h-400 container
                      const latPct = Math.min(Math.max((ally.latitude - 8.295) / 0.02 * 100, 10), 90);
                      const lngPct = Math.min(Math.max((ally.longitude + 73.63) / 0.02 * 100, 10), 90);

                      return (
                        <motion.div
                          key={ally.id}
                          className="absolute cursor-pointer flex flex-col items-center z-20 group"
                          style={{ top: `${latPct}%`, left: `${lngPct}%` }}
                          onClick={() => setSelectedAlly(ally)}
                          whileHover={{ scale: 1.15 }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg border-2 ${
                            ally.status === 'en_servicio' 
                              ? 'bg-amber-400 border-white text-ink' 
                              : 'bg-emerald-500 border-white text-white'
                          }`}>
                            🛵
                          </div>
                          
                          {/* Label tooltips */}
                          <div className="bg-[#0d1a16] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap block">
                            {ally.name.split(' ')[0]}
                          </div>

                          {/* Hover Details Card */}
                          <div className="absolute bottom-11 bg-white border border-divider rounded-xl p-2 shadow-xl z-30 hidden group-hover:block text-left text-[9.5px] font-bold text-ink w-36">
                            <div className="font-extrabold border-b border-divider/30 pb-1 mb-1 text-primary">{ally.name}</div>
                            <div>Placa: {ally.plate}</div>
                            <div>Estado: <span className="uppercase text-emerald-600">{ally.status}</span></div>
                            <div>Hoy: {ally.completedToday} viajes</div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Map Instructions Footer */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-divider/60 rounded-2xl p-2.5 text-[9px] font-bold text-left text-ink max-w-[200px] shadow-sm">
                      <span className="block font-black text-ink-soft uppercase text-[8px] tracking-wider mb-1">Convención Mapa:</span>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block border border-white"></span>
                        <span>Aliado Disponible (Conectado)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block border border-white"></span>
                        <span>Aliado En Servicio Activo</span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/95 border border-divider rounded-full px-3 py-1 text-[10px] font-black text-ink flex items-center gap-1.5 shadow-sm">
                      <RefreshCw size={10} className="animate-spin text-primary" style={{ animationDuration: '4s' }} />
                      Rastreador GPS Activo
                    </div>
                  </div>

                  {/* SIDEBAR: ACTIVE VEHICLE LIST & DETAILED PREVIEW */}
                  <div className="space-y-4">
                    
                    {selectedAlly ? (
                      <div className="bg-surface-alt border border-divider rounded-3xl p-4 text-left space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-start border-b border-divider/30 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">👤</span>
                            <div>
                              <h4 className="font-sora font-extrabold text-xs text-ink">{selectedAlly.name}</h4>
                              <p className="text-[9.5px] text-ink-soft uppercase font-bold">{selectedAlly.id} • {selectedAlly.plate}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedAlly(null)}
                            className="text-[9.5px] bg-white border border-divider rounded-lg px-2 py-0.5 cursor-pointer font-bold text-ink-soft hover:bg-white"
                          >
                            Cerrar
                          </button>
                        </div>

                        <div className="space-y-2 text-xs font-semibold">
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Vehículo:</span>
                            <span className="text-ink capitalize font-bold">{selectedAlly.vehicle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Celular:</span>
                            <span className="text-ink font-mono">{selectedAlly.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Viajes hoy:</span>
                            <span className="text-emerald-600 font-extrabold">{selectedAlly.completedToday} completados</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Calificación:</span>
                            <span className="text-amber-500 font-extrabold">★ {selectedAlly.rating}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-divider/30">
                            <span className="text-ink-soft">Estado Central:</span>
                            <span className={`px-2 py-0.5 rounded uppercase font-black text-[9px] ${
                              selectedAlly.status === 'en_servicio' ? 'bg-amber-100 text-amber-700' :
                              selectedAlly.status === 'conectado' ? 'bg-[#E6F7EC] text-[#0EA65C]' :
                              selectedAlly.status === 'pausado' ? 'bg-orange-50 text-orange-600' :
                              'bg-rose-50 text-rose-600'
                            }`}>
                              {selectedAlly.status}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex gap-1.5">
                          <button
                            onClick={() => handleToggleAllyStatus(selectedAlly.id)}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                              selectedAlly.status === 'pausado' 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                          >
                            {selectedAlly.status === 'pausado' ? 'Activar Aliado' : 'Pausar Aliado'}
                          </button>
                          <a 
                            href={`tel:${selectedAlly.phone}`}
                            className="px-3 rounded-xl bg-white border border-divider text-ink-soft flex items-center justify-center hover:bg-slate-100"
                          >
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-surface-alt/50 border border-divider/40 rounded-3xl p-4 text-center min-h-[140px] flex flex-col justify-center items-center">
                        <span className="text-xl">🧭</span>
                        <p className="text-[10.5px] text-ink-soft mt-1 font-semibold max-w-[180px]">
                          Toca el pin de cualquier aliado en el mapa para ver su ficha y pausarlo o activarlo.
                        </p>
                      </div>
                    )}

                    {/* Quick Active Allies List */}
                    <div className="bg-white border border-divider/60 rounded-3xl p-4 text-left space-y-3">
                      <h4 className="font-sora font-extrabold text-[11px] text-ink uppercase tracking-wider border-b border-divider/20 pb-1.5">
                        Aliados Conectados ({allies.length})
                      </h4>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto content-scrollbar pr-1">
                        {allies.map(al => (
                          <div 
                            key={al.id}
                            onClick={() => setSelectedAlly(al)}
                            className="flex items-center justify-between p-2 rounded-xl border border-divider/30 hover:bg-surface-alt cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm">🛵</span>
                              <div className="min-w-0">
                                <span className="font-extrabold text-xs text-ink block truncate">{al.name}</span>
                                <span className="text-[9px] text-ink-faint block">{al.plate} • ★ {al.rating}</span>
                              </div>
                            </div>
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              al.status === 'en_servicio' ? 'bg-amber-400' :
                              al.status === 'conectado' ? 'bg-emerald-500' :
                              al.status === 'pausado' ? 'bg-orange-500' :
                              'bg-rose-500'
                            }`} />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SERVICES ACTIONS & REASSIGNMENT */}
          {activeTab === 'gestion' && (
            <motion.div
              key="gestion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-divider/30 pb-3">
                  <div>
                    <h3 className="font-sora font-extrabold text-sm text-ink">Consola de Operadores & Reasignación</h3>
                    <p className="text-xs text-ink-soft">Busca servicios activos o pendientes, cambia el aliado responsable o cancélalos administrativamente.</p>
                  </div>

                  {/* Filters bar */}
                  <div className="flex gap-1.5 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                      <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar cliente, id..."
                        className="w-full bg-surface-alt rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                      />
                    </div>

                    <select
                      value={orderFilter}
                      onChange={e => setOrderFilter(e.target.value as any)}
                      className="bg-surface-alt border-0 rounded-xl px-2.5 py-2 text-xs font-bold text-ink outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="activo">Activos</option>
                      <option value="finalizado">Finalizados</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                  </div>
                </div>

                {/* Grid layout of filtered orders with management buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOrders.map(order => (
                    <div 
                      key={order.id}
                      className={`border rounded-3xl p-4 flex flex-col justify-between gap-3 bg-white transition-all ${
                        order.isDelayed ? 'border-red-300 shadow-sm' : 'border-divider/50'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-sora font-extrabold text-xs text-ink">{order.id}</span>
                          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            order.status === 'activo' ? 'bg-[#E6F7EC] text-[#0EA65C]' :
                            order.status === 'pendiente' ? 'bg-amber-50 text-amber-600' :
                            order.status === 'finalizado' ? 'bg-slate-100 text-slate-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-3.5 space-y-1.5 text-xs font-semibold">
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Cliente:</span>
                            <span className="text-ink font-extrabold">{order.clientName} ({order.clientPhone})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Ruta:</span>
                            <span className="text-ink truncate max-w-[200px]">{order.origin} → {order.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Monto:</span>
                            <span className="text-primary font-black">${order.price.toLocaleString('es-CO')} COP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-soft">Aliado Responsable:</span>
                            <span className="text-slate-900 font-extrabold">{order.assignedAllyName || '⚠️ Sin Asignar'}</span>
                          </div>
                          <div className="flex justify-between text-ink-faint text-[10.5px]">
                            <span>Tiempo transcurrido:</span>
                            <span className={order.isDelayed ? 'text-red-500 font-bold' : ''}>
                              ⏱ {order.elapsedMinutes} minutos
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Control buttons inside card */}
                      {(order.status === 'activo' || order.status === 'pendiente') && (
                        <div className="pt-3 border-t border-divider/30 flex gap-2">
                          <button
                            onClick={() => setReassigningOrder(order)}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-sora font-bold text-[10px] py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            🔄 Reasignar Aliado
                          </button>
                          
                          <button
                            onClick={() => handleCancelService(order.id)}
                            className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-[10px] font-black cursor-pointer"
                          >
                            ✕ Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>

              {/* REASSIGNMENT MODAL POPUP */}
              {reassigningOrder && (
                <div className="fixed inset-0 flex items-center justify-center z-[250] p-4 text-left">
                  <div 
                    onClick={() => setReassigningOrder(null)} 
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                  />
                  
                  <div className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-md z-10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-wider">Mesa de Despacho Movica</span>
                        <h4 className="font-sora font-extrabold text-base text-ink">Reasignar Servicio {reassigningOrder.id}</h4>
                        <p className="text-[10px] text-ink-soft mt-0.5">Elige un aliado disponible para transferirle la responsabilidad del viaje.</p>
                      </div>
                      <button onClick={() => setReassigningOrder(null)} className="p-1 rounded-lg hover:bg-surface-alt">✕</button>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Aliados Disponibles en Aguachica:</span>
                      
                      <div className="space-y-2 max-h-[220px] overflow-y-auto content-scrollbar pr-1">
                        {allies.filter(a => a.status === 'conectado').map(ally => (
                          <div 
                            key={ally.id}
                            className="flex items-center justify-between p-3 rounded-2xl border border-divider/50 hover:bg-primary-surface cursor-pointer group transition-all"
                            onClick={() => handleReassign(reassigningOrder.id, ally.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center text-lg">
                                🏍️
                              </div>
                              <div>
                                <span className="font-extrabold text-xs text-ink block">{ally.name}</span>
                                <span className="text-[9px] text-ink-soft block">{ally.plate} • ★ {ally.rating} • Hoy: {ally.completedToday}</span>
                              </div>
                            </div>
                            
                            <button className="text-[10.5px] text-primary group-hover:text-primary-dark font-black tracking-tight flex items-center gap-0.5">
                              Asignar <ChevronRight size={12} />
                            </button>
                          </div>
                        ))}

                        {allies.filter(a => a.status === 'conectado').length === 0 && (
                          <div className="text-center py-6 text-ink-soft text-xs font-semibold">
                            ⚠️ No hay aliados disponibles/conectados en este momento. Intenta liberar o pausar algún aliado.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 4: SOS EMERGENCIES & USER REPORTS */}
          {activeTab === 'alertas' && (
            <motion.div
              key="alertas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-divider/30 pb-3">
                  <div>
                    <h3 className="font-sora font-extrabold text-sm text-ink">Bandeja de Alertas, SOS e Incidencias</h3>
                    <p className="text-xs text-ink-soft">Atiende de inmediato emergencias satelitales, demoras críticas y reportes de mal comportamiento.</p>
                  </div>
                  <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    Emergencias Activas
                  </span>
                </div>

                <div className="space-y-4">
                  {alerts.map(al => (
                    <div 
                      key={al.id}
                      className={`p-4 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                        al.isAddressed 
                          ? 'border-divider/40 bg-surface-alt/40 opacity-70' 
                          : al.type === 'sos'
                            ? 'border-red-400 bg-red-50/15 ring-2 ring-red-500/10'
                            : 'border-amber-300 bg-amber-50/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">
                          {al.type === 'sos' ? '🚨' : al.type === 'demora' ? '⏳' : al.type === 'reporte' ? '⚠️' : '💤'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-sora font-extrabold text-xs text-ink">{al.title}</h4>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                              al.severity === 'alta' ? 'bg-red-500 text-white animate-pulse' :
                              al.severity === 'media' ? 'bg-amber-500 text-white' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {al.severity}
                            </span>
                            <span className="text-[10px] text-ink-faint font-bold">{al.time}</span>
                          </div>
                          
                          <p className="text-xs font-semibold text-ink-soft leading-normal mt-1 max-w-2xl">
                            {al.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                        {al.isAddressed ? (
                          <span className="text-xs font-extrabold text-[#0EA65C] flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-xl">
                            ✓ Atendido por Operador
                          </span>
                        ) : (
                          <>
                            {al.type === 'sos' && (
                              <a 
                                href="tel:123" 
                                className="bg-red-600 hover:bg-red-700 text-white font-sora font-bold text-[10.5px] px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1"
                              >
                                <Phone size={11} /> 123
                              </a>
                            )}
                            <button
                              onClick={() => handleAddressAlert(al.id)}
                              className="bg-primary hover:bg-primary-dark text-white font-sora font-bold text-[10.5px] px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              Marcar Atendido
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: COMPREHENSIVE SIMULATED CHARTS & ANALYSIS */}
          {activeTab === 'estadisticas' && (
            <motion.div
              key="estadisticas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left animate-fadeIn"
            >
              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Hourly services (Recharts AreaChart) */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2 flex items-center gap-1.5">
                    <Activity size={14} className="text-primary animate-pulse" />
                    Servicios Recibidos por Hora (Aguachica)
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_SERVICES_BY_HOUR} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA65C" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#0EA65C" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBF0EB" />
                        <XAxis dataKey="name" stroke="#8E9E8E" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#8E9E8E" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Area type="monotone" dataKey="servicios" name="Servicios" stroke="#0EA65C" strokeWidth={2.5} fillOpacity={1} fill="url(#hourGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Weekly revenue and services (Recharts BarChart) */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-[#0EA65C]" />
                    Volumen Semanal de Transacciones e Ingresos
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_SERVICES_BY_DAY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBF0EB" />
                        <XAxis dataKey="name" stroke="#8E9E8E" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#8E9E8E" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Bar dataKey="servicios" name="Servicios Totales" fill="#0d1a16" radius={[4, 4, 0, 0]}>
                          {MOCK_SERVICES_BY_DAY.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 5 ? '#0EA65C' : '#0d1a16'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Grid row 2: Top Active Allies and Merchants Tables */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3">
                  <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/20 pb-1.5 flex items-center gap-1.5">
                    <Bike size={14} className="text-primary" />
                    Aliados Más Activos (Hoy)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-divider/30 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                          <th className="py-2">Nombre Completo</th>
                          <th className="py-2 text-center">Pedidos Hoy</th>
                          <th className="py-2 text-right">Rendimiento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-divider/20">
                        {MOCK_TOP_ALLIES.map((ally, idx) => (
                          <tr key={idx} className="hover:bg-surface-alt/30">
                            <td className="py-2 text-ink">{ally.name}</td>
                            <td className="py-2 text-center text-primary font-black">{ally.pedidos}</td>
                            <td className="py-2 text-right text-amber-500 font-extrabold">★ {ally.calificacion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3">
                  <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/20 pb-1.5 flex items-center gap-1.5">
                    <Store size={14} className="text-amber-500" />
                    Comercios con Más Solicitudes (Hoy)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-divider/30 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                          <th className="py-2">Nombre del Comercio</th>
                          <th className="py-2 text-center">Pedidos Hoy</th>
                          <th className="py-2 text-right">Categoría</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-divider/20">
                        {MOCK_TOP_MERCHANTS.map((merch, idx) => (
                          <tr key={idx} className="hover:bg-surface-alt/30">
                            <td className="py-2 text-ink">{merch.name}</td>
                            <td className="py-2 text-center text-emerald-600 font-black">{merch.pedidos}</td>
                            <td className="py-2 text-right text-ink-soft font-bold">{merch.categoria}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB: MODERACIÓN Y SANCIONES (MODULO 33) */}
          {activeTab === 'moderacion' && (
            <motion.div
              key="moderacion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ModerationManager />
            </motion.div>
          )}

          {/* TAB: PREPARACIÓN BACKEND (MODULO 34) */}
          {activeTab === 'backend' && (
            <motion.div
              key="backend"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BackendIntegrationHub />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

    </div>
  );
}
