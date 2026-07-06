import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Bike, ClipboardList, TrendingUp, DollarSign, Star,
  Settings, Percent, Bell, Shield, ChevronRight, Edit2, 
  Trash2, UserCheck, UserX, Plus, FileText, CheckCircle, 
  XCircle, Filter, Search, Award, RefreshCw, BarChart2,
  Calendar, CloudRain, Moon, MapPin, Tag, Sliders, Menu, X, ArrowLeft, Sparkles, Store, Send, Globe, Megaphone, Database
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { ServiceType } from '../types';
import DispatchSimulator from './DispatchSimulator';
import RatingsSystem from './RatingsSystem';
import PromoAndCoupons from './PromoAndCoupons';
import AdvancedStats from './AdvancedStats';
import GeneralConfig from './GeneralConfig';
import AchievementsSystem from './AchievementsSystem';
import MultiCityManager from './MultiCityManager';
import PaymentBillingSystem from './PaymentBillingSystem';
import MapTrackingSimulator from './MapTrackingSimulator';
import { AdminAdsDashboard } from './AdCampaignManager';
import ModerationManager from './ModerationManager';
import BackendIntegrationHub from './BackendIntegrationHub';
import movicaLogo from '../assets/images/movica_logo_1783309351402.jpg';

interface AdminPanelProps {
  onBackToClient: () => void;
  clientOrders: any[];
}

// Simulated initial customers
const INITIAL_CUSTOMERS: any[] = [];

// Simulated initial partners (aliados)
const INITIAL_PARTNERS: any[] = [];

// Simulated initial services (orders)
const INITIAL_SERVICES: any[] = [];

// Simulated initial promotions
const INITIAL_PROMOTIONS: any[] = [];

// Helpers for badges
const getServiceBadge = (type: ServiceType) => {
  switch (type) {
    case 'mototaxi': return { name: 'Mototaxi', bg: 'bg-[#E6F7EC] text-[#0EA65C]', icon: '🛵' };
    case 'domicilio': return { name: 'Domicilio', bg: 'bg-[#FFF9E6] text-[#D9A300]', icon: '🍔' };
    case 'encomienda': return { name: 'Encomienda', bg: 'bg-[#EBF3FF] text-[#0066FF]', icon: '📦' };
    case 'compra': return { name: 'Compra', bg: 'bg-[#F2EBF9] text-[#8000FF]', icon: '🛒' };
    case 'mandado': return { name: 'Mandado', bg: 'bg-[#FFF2E6] text-[#FF8000]', icon: '📋' };
  }
};

export default function AdminPanel({ onBackToClient, clientOrders }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'despacho' | 'mapa' | 'clientes' | 'aliados' | 'servicios' | 'estadisticas' | 'tarifas' | 'promociones' | 'reportes' | 'configuracion' | 'comercios' | 'soporte' | 'logros' | 'multiciudad' | 'pagos' | 'publicidad' | 'moderacion' | 'backend' | 'personal'>('dashboard');
  
  // Helper to render realistic mock documents for Colombian allies verification (Módulo 21)
  const renderMockDocument = (label: string, req: any) => {
    if (!req) return null;
    switch (label) {
      case 'Cédula de Ciudadanía':
        return (
          <div className="w-full aspect-[1.58/1] bg-[#FDF9EE] rounded-2xl border border-amber-200 p-4 font-mono text-ink text-[10px] uppercase flex flex-col justify-between relative shadow-md overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFC629]"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[7px] text-ink-soft block leading-none font-bold">REPÚBLICA DE COLOMBIA</span>
                <span className="text-[11px] font-sora font-extrabold text-amber-950 block mt-1 tracking-tight">CÉDULA DE CIUDADANÍA</span>
              </div>
              <span className="text-sm">🇨🇴</span>
            </div>
            
            <div className="flex gap-4 items-center my-2">
              <div className="w-14 h-18 bg-white border border-divider/60 rounded flex items-center justify-center text-3xl">
                👨‍✈️
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div>
                  <span className="text-[6.5px] text-ink-faint block leading-none font-sans font-bold">Apellidos</span>
                  <span className="font-bold truncate block">{req.name.split(' ').slice(1).join(' ') || 'Gómez'}</span>
                </div>
                <div>
                  <span className="text-[6.5px] text-ink-faint block leading-none font-sans font-bold">Nombres</span>
                  <span className="font-bold truncate block">{req.name.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-[6.5px] text-ink-faint block leading-none font-sans font-bold">Número de Identificación</span>
                  <span className="font-extrabold text-primary text-xs block">1.096.{Math.floor(100 + Math.random() * 900)}.{Math.floor(100 + Math.random() * 900)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-divider/40 pt-1.5 text-[7px] text-ink-soft">
              <span>Nacimiento: {req.birthDate}</span>
              <span>Expedición: Aguachica, Cesar</span>
            </div>
          </div>
        );
      case 'Licencia de Conducción':
        return (
          <div className="w-full aspect-[1.58/1] bg-slate-900 text-white rounded-2xl p-4 font-mono text-[9px] uppercase flex flex-col justify-between relative overflow-hidden shadow-lg text-left">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
            <div className="flex justify-between">
              <div>
                <span className="text-[7px] text-white/60 block leading-none font-bold">MINISTERIO DE TRANSPORTE</span>
                <span className="text-[11px] font-sora font-extrabold text-white block mt-1">LICENCIA DE CONDUCCIÓN</span>
              </div>
              <span className="text-xs">🇨🇴</span>
            </div>

            <div className="flex gap-4 items-center my-2">
              <div className="w-14 h-16 bg-white/10 rounded flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="space-y-1 text-white/90">
                <div>
                  <span className="text-[6.5px] text-white/50 block leading-none font-sans font-bold">Conductor</span>
                  <span className="font-bold truncate block text-xs">{req.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[6.5px] text-white/50 block leading-none font-sans font-bold">Categoría</span>
                    <span className="font-black text-primary block">A2 (Moto)</span>
                  </div>
                  <div>
                    <span className="text-[6.5px] text-white/50 block leading-none font-sans font-bold">Vence</span>
                    <span className="font-bold text-red-400 block">12/04/2031</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-1 flex justify-between text-[6.5px] text-white/50">
              <span>RUNT Aguachica</span>
              <span>Seguridad Nivel 3</span>
            </div>
          </div>
        );
      case 'SOAT de la Moto':
        return (
          <div className="w-full border border-divider/50 rounded-2xl p-4 bg-white shadow-md space-y-3 font-mono text-ink text-[10px] text-left">
            <div className="flex justify-between items-start pb-2 border-b border-divider/30">
              <div>
                <h6 className="font-bold text-[11px] text-[#0EA65C] font-sora">SEGURO OBLIGATORIO DE ACCIDENTES DE TRÁNSITO</h6>
                <span className="text-[7.5px] text-ink-soft block font-semibold">PÓLIZA NACIONAL DE COLOMBIA</span>
              </div>
              <span className="text-xl">🛡️</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 bg-surface-alt/40 p-2.5 rounded-xl text-[9px]">
              <div>
                <span className="text-ink-soft block uppercase text-[7px] font-sans font-bold">Placa de la Moto</span>
                <span className="font-black text-xs text-ink">{req.vehicle.plate}</span>
              </div>
              <div>
                <span className="text-ink-soft block uppercase text-[7px] font-sans font-bold">Fecha Vencimiento</span>
                <span className="font-extrabold text-[#0EA65C] block">Vigente (Jul 2027)</span>
              </div>
              <div>
                <span className="text-ink-soft block uppercase text-[7px] font-sans font-bold">Aseguradora</span>
                <span className="font-bold block">Seguros Bolívar S.A.</span>
              </div>
              <div>
                <span className="text-ink-soft block uppercase text-[7px] font-sans font-bold">Código QR SOAT</span>
                <span className="font-bold text-primary block">● VERIFICADO DISCO</span>
              </div>
            </div>

            <div className="text-[8px] text-ink-soft leading-tight font-semibold font-sans">
              Este SOAT digital cumple con el Decreto de Movilidad Vial Colombiana para vehículos motorizados de dos ruedas.
            </div>
          </div>
        );
      case 'Tarjeta de Propiedad':
        return (
          <div className="w-full bg-[#EBF3FF] border border-blue-200 rounded-2xl p-4 text-ink font-mono text-[9px] uppercase flex flex-col justify-between relative shadow-md text-left">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"></div>
            <div className="flex justify-between items-center border-b border-blue-200/50 pb-2 mb-2">
              <div>
                <span className="text-[7.5px] text-blue-700 block leading-none font-bold">MINISTERIO DE TRANSPORTE</span>
                <h6 className="font-sora font-extrabold text-[10px] text-blue-900 block mt-0.5">TARJETA DE REGISTRO NACIONAL DE VEHÍCULOS</h6>
              </div>
              <span className="text-sm">📄</span>
            </div>

            <div className="space-y-1.5 text-ink-soft">
              <div className="grid grid-cols-2 gap-2 text-[8px]">
                <div>
                  <span className="text-blue-700/70 block text-[6.5px] font-sans font-bold">Nro de Matrícula</span>
                  <span className="font-bold text-ink block">739105739A</span>
                </div>
                <div>
                  <span className="text-blue-700/70 block text-[6.5px] font-sans font-bold">Propietario</span>
                  <span className="font-bold text-ink truncate block">{req.name}</span>
                </div>
                <div>
                  <span className="text-blue-700/70 block text-[6.5px] font-sans font-bold">Vehículo / Modelo</span>
                  <span className="font-bold text-ink truncate block">{req.vehicle.brand} {req.vehicle.model}</span>
                </div>
                <div>
                  <span className="text-blue-700/70 block text-[6.5px] font-sans font-bold">Placa</span>
                  <span className="font-black text-xs text-blue-900 block">{req.vehicle.plate}</span>
                </div>
                <div>
                  <span className="text-blue-700/70 block text-[6.5px] font-sans font-bold">Cilindraje / Color</span>
                  <span className="font-bold text-ink block">{req.vehicle.displacement} • {req.vehicle.color}</span>
                </div>
                <div>
                  <span className="text-blue-700/70 block text-[6.5px] font-sans font-bold">Servicio Autorizado</span>
                  <span className="font-extrabold text-blue-950 block">Particular / Intermediación</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        // Photographic uploads preview
        return (
          <div className="w-full aspect-[4/3] bg-surface-alt border border-divider/60 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner text-center">
            {label.includes('Moto') ? (
              <>
                <span className="text-4xl mb-2">🏍️</span>
                <span className="font-sora font-extrabold text-xs text-ink block">Foto de la Motocicleta</span>
                <span className="text-[10px] text-ink-soft mt-1 font-mono font-bold uppercase tracking-wider text-primary">{req.vehicle.brand} • PLACA {req.vehicle.plate}</span>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-surface text-primary border border-primary/20 flex items-center justify-center text-3xl shadow-sm mb-2 font-bold">
                  👨‍✈️
                </div>
                <span className="font-sora font-extrabold text-xs text-ink block">{req.name}</span>
                <span className="text-[10px] text-ink-soft mt-0.5 font-sans">Selfie de validación facial de aliado</span>
              </>
            )}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-bold">
              Simulado por Movica OS
            </div>
          </div>
        );
    }
  };

  // Responsive sidebar toggles for mobile viewports
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enterprise details states
  const [companyName, setCompanyName] = useState('Movica SAS');
  const [companyLogoText, setCompanyLogoText] = useState('Movica');
  const [companyEmail, setCompanyEmail] = useState('soporte@movica.co');
  const [companyInstagram, setCompanyInstagram] = useState('@movicamovilidad');
  const [companyFacebook, setCompanyFacebook] = useState('facebook.com/movica');
  const [companyWhatsApp, setCompanyWhatsApp] = useState('+57 312 000 0000');
  const [companyPolicyTerms, setCompanyPolicyTerms] = useState(
    'Términos y Condiciones de Uso de la Plataforma Movica:\n\n1. El usuario acepta las tarifas calculadas por el algoritmo.\n2. Los aliados motorizados garantizan poseer SOAT vigente y licencia de conducción activa.\n3. Movica actúa como plataforma de intermediación tecnológica.'
  );
  const [companyPolicyPrivacy, setCompanyPolicyPrivacy] = useState(
    'Política de Privacidad y Tratamiento de Datos de Movica:\n\n1. Los datos de geolocalización se utilizan únicamente durante la prestación del servicio.\n2. No compartimos información personal con terceros con fines comerciales.\n3. Cumplimos con la Ley 1581 de 2012 (Protección de Datos Personales).'
  );

  // Edit Promotion States
  const [isEditPromoOpen, setIsEditPromoOpen] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [editPromoCode, setEditPromoCode] = useState('');
  const [editPromoDiscount, setEditPromoDiscount] = useState('');
  const [editPromoLimit, setEditPromoLimit] = useState('');

  // States for interactive entities
  const [customers, setCustomers] = useState<any[]>(() => {
    const saved = localStorage.getItem('movica_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [partners, setPartners] = useState<any[]>(() => {
    const saved = localStorage.getItem('movica_partners');
    return saved ? JSON.parse(saved) : [];
  });

  const [allyRequests, setAllyRequests] = useState<any[]>(() => {
    const savedList = localStorage.getItem('movica_ally_requests');
    const list = savedList ? JSON.parse(savedList) : [];
    
    const savedApp = localStorage.getItem('movica_ally_application');
    if (savedApp) {
      const parsedApp = JSON.parse(savedApp);
      const exists = list.some(item => item.id === parsedApp.id);
      if (!exists) {
        list.unshift(parsedApp);
      } else {
        const idx = list.findIndex(item => item.id === parsedApp.id);
        list[idx] = parsedApp;
      }
    }
    
    return list;
  });

  const [services, setServices] = useState<any[]>(() => {
    const saved = localStorage.getItem('movica_orders');
    const list = saved ? JSON.parse(saved) : [];
    return list.map((order: any, idx: number) => ({
      id: order.id || `MOV-${8900 + idx}`,
      type: order.type || 'mototaxi',
      client: order.client || 'Tú (Cliente)',
      partner: order.partner || order.driver?.name || 'Por asignar',
      status: order.status === 'completado' ? 'completado' : order.status === 'cancelado' ? 'cancelado' : 'activo',
      value: order.price || order.value || 4500,
      date: order.date || '2026-07-03',
      time: order.time || '20:45'
    }));
  });
  
  const [promotions, setPromotions] = useState<any[]>(() => {
    const saved = localStorage.getItem('movica_promotions');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('movica_users', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('movica_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('movica_ally_requests', JSON.stringify(allyRequests));
  }, [allyRequests]);

  useEffect(() => {
    const mappedOrders = services.map(s => ({
      id: s.id,
      type: s.type,
      title: s.type === 'mototaxi' ? 'Viaje en Mototaxi' : s.type === 'domicilio' ? 'Servicio de Domicilio' : s.type === 'encomienda' ? 'Envío de Encomienda' : s.type === 'compra' ? 'Mandado / Compra' : 'Servicio Especial',
      price: s.value,
      status: s.status,
      driver: s.partner !== 'Por asignar' ? { name: s.partner, vehicle: 'Moto', plate: 'KSM-92G' } : undefined,
      date: s.date,
      time: s.time
    }));
    localStorage.setItem('movica_orders', JSON.stringify(mappedOrders));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('movica_promotions', JSON.stringify(promotions));
  }, [promotions]);

  // Personnel Management (Gestión de Personal) states
  const [staffList, setStaffList] = useState([
    { id: 'PERS-001', name: 'Sonia Álvarez', email: 'sonia.alvarez@movica.co', phone: '315 222 9901', role: 'admin', status: 'activo' },
    { id: 'PERS-002', name: 'Andrés Restrepo', email: 'andres.restrepo@movica.co', phone: '314 888 2211', role: 'supervisor', status: 'activo' },
    { id: 'PERS-003', name: 'Camila Gómez', email: 'camila.gomez@movica.co', phone: '312 456 7891', role: 'operador', status: 'activo' },
    { id: 'PERS-004', name: 'Diego Mendoza', email: 'diego.mendoza@movica.co', phone: '311 777 6611', role: 'operador', status: 'activo' },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'supervisor' | 'operador'>('supervisor');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  
  // Ally registration requests (Módulo 21)
  const [aliadosSubTab, setAliadosSubTab] = useState<'lista' | 'solicitudes'>('lista');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [correctionComment, setCorrectionComment] = useState('');
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);
  const [selectedDocLabel, setSelectedDocLabel] = useState<string | null>(null);

  // Simulated live map coordinates for Available, Busy and Active Allies in Aguachica
  const [simulatedAllies, setSimulatedAllies] = useState<any[]>([]);

  useEffect(() => {
    const list: any[] = [];
    partners.forEach((p, idx) => {
      list.push({
        id: p.id,
        name: p.name,
        status: p.status,
        lat: 30 + (idx * 15) % 50,
        lng: 40 + (idx * 20) % 50,
        plate: p.plate || 'KSM-92G',
        vehicle: p.vehicle || 'Moto'
      });
    });
    services.forEach((s, idx) => {
      if (s.status === 'activo') {
        list.push({
          id: s.id,
          name: `Servicio Activo #${s.id}`,
          status: 'activo',
          lat: 45 + (idx * 10) % 30,
          lng: 55 + (idx * 15) % 30,
          plate: 'XYZ-12C',
          client: s.client
        });
      }
    });
    setSimulatedAllies(list);
  }, [partners, services]);

  const [selectedMapItem, setSelectedMapItem] = useState<any>(null);
  const [isMapAnimating, setIsMapAnimating] = useState(false);
  const [mapFilter, setMapFilter] = useState<'todos' | 'disponible' | 'no_disponible' | 'activo'>('todos');

  const handleSimulateMovement = () => {
    setIsMapAnimating(true);
    const interval = setInterval(() => {
      setSimulatedAllies(prev => prev.map(item => {
        const deltaLat = (Math.random() - 0.5) * 6;
        const deltaLng = (Math.random() - 0.5) * 6;
        return {
          ...item,
          lat: Math.max(15, Math.min(85, item.lat + deltaLat)),
          lng: Math.max(15, Math.min(85, item.lng + deltaLng))
        };
      }));
    }, 1200);

    setTimeout(() => {
      clearInterval(interval);
      setIsMapAnimating(false);
    }, 6000);
  };

  // Rates State (Editable form)
  const [rates, setRates] = useState({
    baseMototaxi: 2500,
    quadrasIncluded: 10,
    additionalBlockValue: 1000,
    movicaCommission: 15,
    nightSurcharge: 1200,
    rainSurcharge: 1500,
    isRainSurchargeActive: true
  });

  // Client Search & Filter states
  const [searchClientQuery, setSearchClientQuery] = useState('');
  const [filterClientStatus, setFilterClientStatus] = useState<'todos' | 'activo' | 'suspendido'>('todos');

  // Partner Search & Filter states
  const [searchPartnerQuery, setSearchPartnerQuery] = useState('');
  const [filterPartnerStatus, setFilterPartnerStatus] = useState<'todos' | 'disponible' | 'no_disponible' | 'pendiente' | 'suspendido'>('todos');

  // Service Search & Filter states
  const [searchServiceQuery, setSearchServiceQuery] = useState('');
  const [filterServiceType, setFilterServiceType] = useState<'todos' | ServiceType>('todos');
  const [filterServiceStatus, setFilterServiceStatus] = useState<'todos' | 'activo' | 'completado' | 'cancelado'>('todos');

  // Modal dialog states
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');
  const [newPromoLimit, setNewPromoLimit] = useState('');

  // Config fields
  const [sysNotifySMS, setSysNotifySMS] = useState(true);
  const [sysAutoAssign, setSysAutoAssign] = useState(true);
  const [sysBackupInterval, setSysBackupInterval] = useState('diario');
  const [sysContactPhone, setSysContactPhone] = useState('+57 312 000 0000');

  // Computed Dashboard values
  const totalClients = customers.length;
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'disponible').length;
  const activeServices = services.filter(s => s.status === 'activo').length;
  const completedServices = services.filter(s => s.status === 'completado').length;
  const dayEarnings = services
    .filter(s => s.status === 'completado')
    .reduce((acc, curr) => acc + curr.value, 0);
  const monthEarnings = dayEarnings; // Real accrued total
  const ratedPartners = partners.filter(p => p.rating > 0);
  const averageRating = ratedPartners.length > 0
    ? (partners.reduce((acc, curr) => acc + curr.rating, 0) / ratedPartners.length).toFixed(2)
    : "5.00";

  // Chart data definitions - Group services dynamically by date
  const serviceHistoryData = (() => {
    const dates = Array.from(new Set(services.map(s => s.date || 'Hoy')));
    dates.sort();
    if (dates.length === 0 || services.length === 0) {
      return [
        { date: 'Sin Datos', servicios: 0, ingresos: 0 }
      ];
    }
    return dates.map(d => {
      const dayServices = services.filter(s => s.date === d);
      return {
        date: d,
        servicios: dayServices.length,
        ingresos: dayServices.filter(s => s.status === 'completado').reduce((acc, curr) => acc + curr.value, 0)
      };
    });
  })();

  const categoryShareData = [
    { name: 'Mototaxi', value: services.filter(s => s.type === 'mototaxi').length, color: '#0EA65C' },
    { name: 'Domicilio', value: services.filter(s => s.type === 'domicilio').length, color: '#FFC629' },
    { name: 'Encomienda', value: services.filter(s => s.type === 'encomienda').length, color: '#0066FF' },
    { name: 'Compra', value: services.filter(s => s.type === 'compra').length, color: '#8000FF' },
    { name: 'Mandado', value: services.filter(s => s.type === 'mandado').length, color: '#FF8000' },
  ];

  const topPartnersData = partners
    .filter(p => p.completedCount > 0)
    .sort((a, b) => b.completedCount - a.completedCount)
    .slice(0, 4)
    .map(p => ({
      name: p.name,
      viajes: p.completedCount,
      rating: p.rating
    }));

  const topCustomersData = customers
    .sort((a, b) => (b.servicesCount || 0) - (a.servicesCount || 0))
    .slice(0, 4)
    .map(c => ({
      name: c.name,
      servicios: c.servicesCount,
      telefono: c.phone
    }));

  // Handlers for customer administration
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;
    const newCli = {
      id: `CLI-${100 + customers.length + 1}`,
      name: newCustomerName,
      phone: newCustomerPhone || '300 000 0000',
      email: newCustomerEmail || `${newCustomerName.toLowerCase().replace(/\s+/g, '')}@correo.com`,
      servicesCount: 0,
      status: 'activo'
    };
    setCustomers([newCli, ...customers]);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
    setIsAddCustomerOpen(false);
  };

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'activo' ? 'suspendido' : 'activo' };
      }
      return c;
    }));
  };

  // Handlers for Partner administration
  const handlePartnerAction = (id: string, newStatus: 'disponible' | 'no_disponible' | 'pendiente' | 'suspendido' | 'desactivado') => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  // Handlers for Ally Registration Requests (Módulo 21)
  const handleAllyRequestAction = (reqId: string, action: 'aprobar' | 'rechazar' | 'correccion', feedback = '') => {
    let updatedRequest: any = null;

    setAllyRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        const newStatus = action === 'aprobar' ? 'aprobado' : action === 'rechazar' ? 'rechazado' : 'correccion';
        updatedRequest = { 
          ...req, 
          status: newStatus,
          correctionsNeeded: action === 'correccion' ? feedback : ''
        };
        
        // Sync back to user's localStorage application if it's the user's
        const saved = localStorage.getItem('movica_ally_application');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.id === req.id) {
            localStorage.setItem('movica_ally_application', JSON.stringify(updatedRequest));
          }
        }
        
        return updatedRequest;
      }
      return req;
    }));

    if (action === 'aprobar' && updatedRequest) {
      // Add as a verified partner to partners list so they can do delivery simulation
      const newPartner = {
        id: `ALI-${Math.floor(210 + Math.random() * 90)}`,
        name: updatedRequest.name,
        avatar: '👨‍✈️',
        vehicle: `${updatedRequest.vehicle.brand} ${updatedRequest.vehicle.model}`,
        plate: updatedRequest.vehicle.plate,
        status: 'disponible' as const,
        rating: 5.0,
        completedCount: 0,
        todayEarnings: 0
      };
      
      setPartners(prev => [newPartner, ...prev]);
      
      // Update simulated map too!
      setSimulatedAllies(prev => [
        {
          id: newPartner.id,
          name: newPartner.name,
          status: 'disponible',
          lat: 40 + Math.random() * 20,
          lng: 35 + Math.random() * 20,
          plate: newPartner.plate,
          vehicle: newPartner.vehicle
        },
        ...prev
      ]);
    }

    setSelectedRequest(null);
  };

  // Handler for Rate adjustment submission
  const handleUpdateRates = (e: React.FormEvent) => {
    e.preventDefault();
    // Rates are automatically updated in state due to binding
    alert("¡Tarifas actualizadas en tiempo real en la plataforma Movica!");
  };

  // Handler for Add Promo Code
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    const discountVal = parseInt(newPromoDiscount) || 1000;
    const limitVal = parseInt(newPromoLimit) || 100;
    const newPromo = {
      id: `PROM-${promotions.length + 1}`,
      code: newPromoCode.toUpperCase().replace(/\s+/g, ''),
      discount: discountVal,
      limit: limitVal,
      used: 0,
      status: 'activo'
    };
    setPromotions([...promotions, newPromo]);
    setNewPromoCode('');
    setNewPromoDiscount('');
    setNewPromoLimit('');
    setIsAddPromoOpen(false);
  };

  const handleTogglePromoStatus = (id: string) => {
    setPromotions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'activo' ? 'vencido' : 'activo' };
      }
      return p;
    }));
  };

  const handleEditPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromoId || !editPromoCode) return;
    const discountVal = parseInt(editPromoDiscount) || 1000;
    const limitVal = parseInt(editPromoLimit) || 100;
    setPromotions(prev => prev.map(p => {
      if (p.id === editingPromoId) {
        return {
          ...p,
          code: editPromoCode.toUpperCase().replace(/\s+/g, ''),
          discount: discountVal,
          limit: limitVal
        };
      }
      return p;
    }));
    setEditingPromoId(null);
    setEditPromoCode('');
    setEditPromoDiscount('');
    setEditPromoLimit('');
    setIsEditPromoOpen(false);
  };

  // Sidebar list helper
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={16} /> },
    { id: 'despacho', label: 'Despacho IA 🌟', icon: <Sparkles size={16} className="text-accent" /> },
    { id: 'mapa', label: 'Mapa en Vivo', icon: <MapPin size={16} /> },
    { id: 'calificaciones', label: 'Reseñas y Calidad ⭐', icon: <Star size={16} className="text-amber-500 fill-amber-500/10" /> },
    { id: 'clientes', label: 'Clientes', icon: <Users size={16} /> },
    { id: 'aliados', label: 'Aliados', icon: <Bike size={16} /> },
    { id: 'comercios', label: 'Comercios Aliados 🏪', icon: <Store size={16} className="text-amber-500" /> },
    { id: 'publicidad', label: 'Publicidad y Destacados 📢', icon: <Megaphone size={16} className="text-primary" /> },
    { id: 'moderacion', label: 'Moderación y Sanciones 🛡️', icon: <Shield size={16} className="text-red-500" /> },
    { id: 'servicios', label: 'Servicios', icon: <ClipboardList size={16} /> },
    { id: 'estadisticas', label: 'Estadísticas', icon: <BarChart2 size={16} /> },
    { id: 'tarifas', label: 'Tarifas', icon: <Percent size={16} /> },
    { id: 'pagos', label: 'Pagos y Facturación 💳', icon: <DollarSign size={16} className="text-emerald-500" /> },
    { id: 'multiciudad', label: 'Multi-Ciudad y Zonas 🌐', icon: <Globe size={16} className="text-primary" /> },
    { id: 'promociones', label: 'Promociones', icon: <Tag size={16} /> },
    { id: 'logros', label: 'Logros y Rankings 🏅', icon: <Award size={16} className="text-amber-500" /> },
    { id: 'reportes', label: 'Reportes', icon: <FileText size={16} /> },
    { id: 'soporte', label: 'Casos de Soporte 🚨', icon: <Bell size={16} className="text-red-500 animate-pulse" /> },
    { id: 'backend', label: 'Estructura API & DB 🔌', icon: <Database size={16} className="text-emerald-500" /> },
    { id: 'personal', label: 'Gestión de Personal 👥', icon: <Users size={16} className="text-blue-500" /> },
    { id: 'configuracion', label: 'Configuración', icon: <Settings size={16} /> },
  ];

  return (
    <div className="w-full h-full min-h-[640px] flex bg-[#F4F6F4] text-ink absolute inset-0 font-sans z-[60] overflow-hidden">
      
      {/* DESKTOP SIDEBAR - Hidden on smaller breakpoints */}
      <aside className="w-[240px] bg-[#0d1a16] text-white flex-col hidden lg:flex border-r border-divider/10 z-20">
        <div className="p-6 border-b border-white/5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <img src={movicaLogo} alt="Movica Logo" className="w-8 h-8 object-contain rounded-lg shadow-sm" referrerPolicy="no-referrer" />
            <span className="font-sora font-extrabold text-xl tracking-tight">Movica</span>
            <span className="text-[9px] bg-primary text-white font-extrabold uppercase px-1.5 py-0.5 rounded-md">Admin</span>
          </div>
          <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Aguachica Centro</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onBackToClient}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white/90 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> Volver al App
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* TOP STATUS AND CONTROLLER BAR */}
        <header className="h-[64px] bg-white border-b border-divider/50 px-6 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile only */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-surface-alt text-ink"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="font-sora font-extrabold text-base text-ink tracking-tight flex items-center gap-2">
              <span>{sidebarItems.find(item => item.id === activeTab)?.label}</span>
              <span className="text-[10px] text-ink-soft font-normal hidden sm:inline">• Plataforma Administrativa</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-[#E6F7EC] text-[#0EA65C] px-3 py-1.5 rounded-full border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Servicio en Línea (Aguachica)</span>
            </div>

            <button 
              onClick={onBackToClient}
              className="text-xs font-extrabold bg-surface-alt hover:bg-divider border border-divider/50 text-ink-soft px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={13} /> App
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 p-6 overflow-y-auto content-scrollbar space-y-6">
          
          {/* TAB: LOGROS, NIVELES E INSIGNIAS (MODULO 25) */}
          {activeTab === 'logros' && (
            <AchievementsSystem mode="admin" />
          )}

          {/* TAB: MULTI-CIUDAD Y ZONAS (MODULO 27) */}
          {activeTab === 'multiciudad' && (
            <MultiCityManager />
          )}

          {/* TAB: PAGOS Y FACTURACIÓN (MODULO 28) */}
          {activeTab === 'pagos' && (
            <PaymentBillingSystem mode="admin" />
          )}

          {/* TAB: DESPACHO INTELIGENTE (MODULO 13) */}
          {activeTab === 'despacho' && (
            <DispatchSimulator />
          )}

          {/* TAB: CALIFICACIONES Y CALIDAD (MODULO 15) */}
          {activeTab === 'calificaciones' && (
            <RatingsSystem initialViewMode="admin" />
          )}

          {/* TAB: PUBLICIDAD Y COMERCIOS DESTACADOS (MODULO 31) */}
          {activeTab === 'publicidad' && (
            <AdminAdsDashboard />
          )}

          {/* TAB: MODERACIÓN Y SANCIONES (MODULO 33) */}
          {activeTab === 'moderacion' && (
            <ModerationManager />
          )}

          {/* TAB: PREPARACIÓN BACKEND (MODULO 34) */}
          {activeTab === 'backend' && (
            <BackendIntegrationHub />
          )}

          {/* TAB: GESTIÓN DE PERSONAL (NUEVO) */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="bg-white border border-divider/60 rounded-3xl p-6 shadow-sm text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-sora font-extrabold text-base text-ink">Gestión de Personal Administrativo</h3>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                      Administra las cuentas de personal autorizado de la plataforma Movica. Puedes asignar roles de Supervisor, Operador de Tráfico o Administrador con sus respectivos niveles de acceso.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddStaffOpen(true)}
                    className="bg-primary hover:bg-primary-dark text-white font-sora font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <Plus size={14} /> Registrar Personal
                  </button>
                </div>
              </div>

              {/* STATS BENTO GRID FOR STAFF */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft font-bold block uppercase tracking-wider">Total Personal</span>
                    <span className="text-lg font-sora font-extrabold text-ink leading-tight">{staffList.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Shield size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft font-bold block uppercase tracking-wider">Supervisores</span>
                    <span className="text-lg font-sora font-extrabold text-ink leading-tight">
                      {staffList.filter(s => s.role === 'supervisor').length}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft font-bold block uppercase tracking-wider">Operadores de Tráfico</span>
                    <span className="text-lg font-sora font-extrabold text-ink leading-tight">
                      {staffList.filter(s => s.role === 'operador').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* STAFF LIST TABLE */}
              <div className="bg-white border border-divider/60 rounded-3xl shadow-sm overflow-hidden text-left">
                <div className="p-5 border-b border-divider/40">
                  <h4 className="font-sora font-bold text-sm text-ink">Personal de Operaciones de Movica</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-alt/40 border-b border-divider/40 font-bold text-ink-soft uppercase tracking-wider text-[10px]">
                        <th className="p-4">ID</th>
                        <th className="p-4">Nombre / Contacto</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider/30 font-semibold text-ink">
                      {staffList.map(member => {
                        const isSuspendido = member.status === 'suspendido';
                        return (
                          <tr key={member.id} className="hover:bg-surface-alt/10">
                            <td className="p-4 font-mono font-bold text-ink-faint">{member.id}</td>
                            <td className="p-4">
                              <div className="font-bold text-ink">{member.name}</div>
                              <div className="text-[10px] text-ink-soft">{member.email} • {member.phone}</div>
                            </td>
                            <td className="p-4">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                member.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-200' :
                                member.role === 'supervisor' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {member.role === 'admin' ? 'Administrador' :
                                 member.role === 'supervisor' ? 'Supervisor' : 'Operador'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                                isSuspendido ? 'text-red-500' : 'text-[#0EA65C]'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isSuspendido ? 'bg-red-500' : 'bg-[#0EA65C]'}`} />
                                {isSuspendido ? 'Suspendido' : 'Activo'}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  setStaffList(prev => prev.map(s => s.id === member.id ? {
                                    ...s,
                                    status: s.status === 'activo' ? 'suspendido' : 'activo'
                                  } : s));
                                }}
                                className={`px-2 py-1 rounded text-[9.5px] font-bold transition-all border cursor-pointer ${
                                  isSuspendido 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                    : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                                }`}
                              >
                                {isSuspendido ? 'Reactivar' : 'Suspender'}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de que deseas eliminar a ${member.name}?`)) {
                                    setStaffList(prev => prev.filter(s => s.id !== member.id));
                                  }
                                }}
                                className="px-2 py-1 rounded text-[9.5px] font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL: REGISTRAR NUEVO MIEMBRO */}
              {isAddStaffOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
                  <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-divider/60 shadow-2xl relative text-left">
                    <button
                      onClick={() => setIsAddStaffOpen(false)}
                      className="absolute right-4 top-4 text-ink-soft hover:text-ink cursor-pointer"
                    >
                      <XCircle size={22} />
                    </button>
                    <h3 className="font-sora font-extrabold text-base text-ink mb-1">Registrar Nuevo Miembro de Personal</h3>
                    <p className="text-[10px] text-ink-soft mb-4">Ingresa los datos para registrar un nuevo integrante del equipo de operaciones de Movica.</p>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newStaffName || !newStaffEmail) return;
                        const newMember = {
                          id: `PERS-00${staffList.length + 1}`,
                          name: newStaffName,
                          email: newStaffEmail,
                          phone: newStaffPhone || '300 000 0000',
                          role: newStaffRole,
                          status: 'activo'
                        };
                        setStaffList(prev => [...prev, newMember]);
                        setNewStaffName('');
                        setNewStaffEmail('');
                        setNewStaffPhone('');
                        setNewStaffRole('supervisor');
                        setIsAddStaffOpen(false);
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-ink-soft">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={newStaffName}
                          onChange={e => setNewStaffName(e.target.value)}
                          placeholder="Ej: Sonia Álvarez"
                          className="w-full bg-surface-alt border border-divider/50 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-ink"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-ink-soft">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          value={newStaffEmail}
                          onChange={e => setNewStaffEmail(e.target.value)}
                          placeholder="Ej: sonia.alvarez@movica.co"
                          className="w-full bg-surface-alt border border-divider/50 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-ink"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-ink-soft">Celular / Teléfono</label>
                        <input
                          type="text"
                          value={newStaffPhone}
                          onChange={e => setNewStaffPhone(e.target.value)}
                          placeholder="Ej: 315 222 9901"
                          className="w-full bg-surface-alt border border-divider/50 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-ink"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-ink-soft">Rol de Personal</label>
                        <select
                          value={newStaffRole}
                          onChange={e => setNewStaffRole(e.target.value as any)}
                          className="w-full bg-surface-alt border border-divider/50 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all font-bold text-ink"
                        >
                          <option value="supervisor">Supervisor de Operaciones</option>
                          <option value="operador">Operador de Tránsito / Despacho</option>
                          <option value="admin">Administrador Principal</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        Registrar Personal de Operaciones
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* WELCOME BAR */}
              <div className="bg-gradient-to-r from-[#0d1a16] to-[#162f26] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-36 h-36 bg-primary/10 rounded-full blur-3xl" />
                <h3 className="font-sora font-extrabold text-lg">Bienvenido al Centro de Control de Movica</h3>
                <p className="text-xs text-white/70 max-w-[580px] mt-1.5 leading-relaxed">
                  Monitorea los servicios activos, ajusta tarifas vigentes, suspende o aprueba socios conductores e impulsa promociones con códigos de descuento directo para los usuarios de Aguachica.
                </p>
              </div>

              {/* STATS BENTO GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Clientes registrados */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-surface text-primary flex items-center justify-center flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">👥 Clientes</span>
                    <span className="text-xl font-sora font-extrabold text-ink leading-tight">{totalClients}</span>
                  </div>
                </div>

                {/* 2. Aliados registrados */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-accent flex items-center justify-center flex-shrink-0">
                    <Bike size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">🛵 Aliados Reg.</span>
                    <span className="text-xl font-sora font-extrabold text-ink leading-tight">{totalPartners}</span>
                  </div>
                </div>

                {/* 3. Aliados disponibles */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0EA65C] flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">🟢 Disponibles</span>
                    <span className="text-xl font-sora font-extrabold text-[#0EA65C] leading-tight">{activePartners}</span>
                  </div>
                </div>

                {/* 4. Servicios activos */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">🚕 Serv. Activos</span>
                    <span className="text-xl font-sora font-extrabold text-ink leading-tight">{activeServices}</span>
                  </div>
                </div>

                {/* 5. Servicios finalizados */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">✅ Finalizados</span>
                    <span className="text-xl font-sora font-extrabold text-ink leading-tight">{completedServices}</span>
                  </div>
                </div>

                {/* 6. Ingresos del día */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">💰 Ingresos Hoy</span>
                    <span className="text-xl font-sora font-extrabold text-emerald-600 leading-tight">
                      ${dayEarnings.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* 7. Ingresos del mes */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">📈 Ingresos Mes</span>
                    <span className="text-xl font-sora font-extrabold text-blue-600 leading-tight">
                      ${monthEarnings.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* 8. Calificación promedio */}
                <div className="bg-white p-4.5 rounded-2xl border border-divider/60 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <Star size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">⭐ Calificación</span>
                    <span className="text-xl font-sora font-extrabold text-amber-500 leading-tight">{averageRating}</span>
                  </div>
                </div>

              </div>

              {/* QUICK REVENUE CHART AND SERVICES BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main chart */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-sora font-bold text-sm text-ink">Desempeño de Servicios</h4>
                      <p className="text-[10px] text-ink-soft mt-0.5">Evolución de servicios completados e ingresos esta semana.</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary-surface px-2.5 py-1 rounded-full uppercase">
                      7 Días
                    </span>
                  </div>

                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={serviceHistoryData}>
                        <defs>
                          <linearGradient id="colorServicios" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA65C" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0EA65C" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAE4" />
                        <XAxis dataKey="date" stroke="#8E8E93" fontSize={10} tickLine={false} />
                        <YAxis stroke="#8E8E93" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="servicios" stroke="#0EA65C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorServicios)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Categories pie chart */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-sora font-bold text-sm text-ink">Servicios por Categoría</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">Demanda de cada opción dentro del portafolio.</p>
                  </div>

                  {/* SVG Pie Chart mockup with detailed data */}
                  <div className="flex-1 flex flex-col justify-center items-center py-4">
                    <div className="w-32 h-32 relative">
                      {/* Simple high contrast circle indicators */}
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EAEAE4" strokeWidth="3" />
                        {/* Mototaxi section 50% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0EA65C" strokeWidth="3.5" strokeDasharray="50 100" strokeDashoffset="0" />
                        {/* Domicilios section 25% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FFC629" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-50" />
                        {/* Encomiendas section 15% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0066FF" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-75" />
                        {/* Others 10% */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8000FF" strokeWidth="3.5" strokeDasharray="10 100" strokeDashoffset="-90" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black font-sora text-ink leading-none">240</span>
                        <span className="text-[8px] text-ink-soft font-bold uppercase tracking-wider">Servicios</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    {categoryShareData.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-ink-soft truncate">{c.name} ({c.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY TABLES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Top drivers list */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sora font-bold text-sm text-ink flex items-center gap-1.5">
                      <Award size={16} className="text-accent" /> Aliados Más Activos
                    </h4>
                    <button onClick={() => setActiveTab('aliados')} className="text-[10px] font-black uppercase text-primary tracking-wider hover:underline">
                      Ver Todos
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topPartnersData.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt/40 border border-divider/20 text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-primary-surface text-primary flex items-center justify-center font-bold text-[10px]">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="text-ink font-bold block">{p.name}</span>
                            <span className="text-[9px] text-ink-soft">Socio Conductor calificado</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-primary block">{p.viajes} viajes</span>
                          <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5 justify-end">
                            ★ {p.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top customers list */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sora font-bold text-sm text-ink flex items-center gap-1.5">
                      <Users size={16} className="text-primary" /> Clientes Más Frecuentes
                    </h4>
                    <button onClick={() => setActiveTab('clientes')} className="text-[10px] font-black uppercase text-primary tracking-wider hover:underline">
                      Ver Todos
                    </button>
                  </div>

                  <div className="space-y-3">
                    {topCustomersData.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt/40 border border-divider/20 text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-surface-alt text-ink-soft flex items-center justify-center font-bold text-[10px]">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="text-ink font-bold block">{c.name}</span>
                            <span className="text-[9px] text-ink-soft">{c.telefono}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-ink block">{c.servicios} servicios</span>
                          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black">PREMIUM</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MAPA EN VIVO VIEW */}
          {activeTab === 'mapa' && (
            <div className="space-y-4">
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm text-left">
                <h3 className="font-sora font-extrabold text-base text-ink">Centro de Monitoreo y Rastreo en Tiempo Real</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Esta consola replica el flujo de tracking interactivo del usuario y sus aliados motorizados de Movica. Como administrador, puedes probar las respuestas de chat automático, simular llamadas satelitales, activar el protocolo SOS de emergencia y acelerar la velocidad del trayecto en Aguachica.
                </p>
              </div>
              <MapTrackingSimulator />
            </div>
          )}

          {/* TAB 2: CLIENTES VIEW */}
          {activeTab === 'clientes' && (
            <div className="space-y-4 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sora font-extrabold text-base text-ink">Gestión de Clientes</h3>
                  <p className="text-xs text-ink-soft mt-0.5">Control de cuentas de pasajeros, historiales y activación de estados.</p>
                </div>
                
                <button 
                  onClick={() => setIsAddCustomerOpen(true)}
                  className="bg-primary hover:bg-primary-dark text-white font-sora font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Plus size={14} /> Registrar Cliente
                </button>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <input 
                    type="text"
                    value={searchClientQuery}
                    onChange={e => setSearchClientQuery(e.target.value)}
                    placeholder="Buscar por nombre, correo o celular..."
                    className="w-full bg-surface-alt border-0 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFilterClientStatus('todos')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterClientStatus === 'todos' ? 'bg-primary text-white' : 'bg-surface-alt text-ink-soft hover:bg-divider/50'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilterClientStatus('activo')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterClientStatus === 'activo' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-surface-alt text-ink-soft hover:bg-divider/50'}`}
                  >
                    Activos
                  </button>
                  <button 
                    onClick={() => setFilterClientStatus('suspendido')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterClientStatus === 'suspendido' ? 'bg-red-50 text-red-600' : 'bg-surface-alt text-ink-soft hover:bg-divider/50'}`}
                  >
                    Suspendidos
                  </button>
                </div>
              </div>

              {/* Clients Table */}
              <div className="overflow-x-auto pt-2 border-t border-divider/50">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Nombre</th>
                      <th className="py-3 px-2">Teléfono</th>
                      <th className="py-3 px-2">Correo</th>
                      <th className="py-3 px-2 text-center">Viajes</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                    {customers
                      .filter(c => {
                        const matchesSearch = c.name.toLowerCase().includes(searchClientQuery.toLowerCase()) || 
                                              c.phone.includes(searchClientQuery) || 
                                              c.email.toLowerCase().includes(searchClientQuery.toLowerCase());
                        const matchesFilter = filterClientStatus === 'todos' ? true : c.status === filterClientStatus;
                        return matchesSearch && matchesFilter;
                      })
                      .map((c, idx) => (
                        <tr key={idx} className="hover:bg-surface-alt/30 transition-colors">
                          <td className="py-3 px-2 text-ink-soft font-mono font-bold">{c.id}</td>
                          <td className="py-3 px-2 font-bold text-ink">{c.name}</td>
                          <td className="py-3 px-2 text-ink-soft">{c.phone}</td>
                          <td className="py-3 px-2 text-ink-soft font-medium truncate max-w-[150px]">{c.email}</td>
                          <td className="py-3 px-2 text-center font-black">{c.servicesCount}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              c.status === 'activo' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-red-50 text-red-500'
                            }`}>
                              {c.status === 'activo' ? 'Activo' : 'Suspendido'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleToggleCustomerStatus(c.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all ${
                                c.status === 'activo' 
                                  ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                                  : 'bg-primary-surface hover:bg-primary/20 text-primary'
                              }`}
                            >
                              {c.status === 'activo' ? 'Suspender' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ALIADOS VIEW */}
          {activeTab === 'aliados' && (
            <div className="space-y-4">
              {/* SUB-TABS SELECTOR FOR ALLIES SECTION */}
              <div className="flex gap-2 border-b border-divider/30 pb-3 mb-4">
                <button
                  type="button"
                  onClick={() => setAliadosSubTab('lista')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    aliadosSubTab === 'lista'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
                  }`}
                >
                  🛵 Aliados Activos ({partners.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAliadosSubTab('solicitudes')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    aliadosSubTab === 'solicitudes'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
                  }`}
                >
                  📩 Solicitudes de Registro ({allyRequests.filter(r => r.status === 'enviado' || r.status === 'en_revision' || r.status === 'correccion').length})
                  {allyRequests.filter(r => r.status === 'enviado').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse block"></span>
                  )}
                </button>
              </div>

              {aliadosSubTab === 'lista' ? (
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-sora font-extrabold text-base text-ink">Gestión de Aliados (Socios Conducción)</h3>
                      <p className="text-xs text-ink-soft mt-0.5">Autoriza postulaciones, suspende por bajo desempeño o reactiva motorizados.</p>
                    </div>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input 
                        type="text"
                        value={searchPartnerQuery}
                        onChange={e => setSearchPartnerQuery(e.target.value)}
                        placeholder="Buscar por nombre, moto, placa..."
                        className="w-full bg-surface-alt border-0 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {[
                        { id: 'todos', label: 'Todos', bg: 'bg-surface-alt text-ink-soft' },
                        { id: 'disponible', label: 'Disponibles', bg: 'bg-[#E6F7EC] text-[#0EA65C]' },
                        { id: 'no_disponible', label: 'No disponibles', bg: 'bg-surface-alt text-ink-faint' },
                        { id: 'pendiente', label: 'Pendientes', bg: 'bg-[#FFF9E6] text-[#D9A300]' },
                        { id: 'suspendido', label: 'Suspendidos', bg: 'bg-red-50 text-red-500' },
                      ].map((item, idx) => (
                        <button 
                          key={idx}
                          type="button"
                          onClick={() => setFilterPartnerStatus(item.id as any)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            filterPartnerStatus === item.id 
                              ? 'bg-primary text-white' 
                              : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid of Partners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-divider/50">
                    {partners
                      .filter(p => {
                        const matchesSearch = p.name.toLowerCase().includes(searchPartnerQuery.toLowerCase()) || 
                                              p.vehicle.toLowerCase().includes(searchPartnerQuery.toLowerCase()) || 
                                              p.plate.toLowerCase().includes(searchPartnerQuery.toLowerCase());
                        const matchesFilter = filterPartnerStatus === 'todos' ? true : p.status === filterPartnerStatus;
                        return matchesSearch && matchesFilter;
                      })
                      .map((p, idx) => (
                        <div key={idx} className="bg-white border border-divider/60 rounded-3xl p-4 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-[#0d1a16] flex items-center justify-center text-white text-2xl font-bold">
                                {p.avatar}
                              </div>
                              <div>
                                <h4 className="font-sora font-extrabold text-xs text-ink">{p.name}</h4>
                                <p className="text-[10px] text-ink-soft font-mono mt-0.5">{p.vehicle} • <span className="text-primary font-bold">{p.plate}</span></p>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
                              p.status === 'disponible' ? 'bg-[#E6F7EC] text-[#0EA65C]' :
                              p.status === 'no_disponible' ? 'bg-amber-50 text-accent border border-divider/20' :
                              p.status === 'pendiente' ? 'bg-blue-50 text-blue-600' : 
                              p.status === 'suspendido' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {p.status === 'disponible' ? 'Disponible' :
                               p.status === 'no_disponible' ? 'Ocupado' :
                               p.status === 'pendiente' ? 'Postulado' : 
                               p.status === 'suspendido' ? 'Suspendido' : 'Desactivado'}
                            </span>
                          </div>
   
                          {/* Mid detailed metrics */}
                          <div className="grid grid-cols-3 gap-2 bg-surface-alt/50 p-3 rounded-2xl text-[10px] font-bold text-ink-soft border border-divider/20">
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Calificación</span>
                              <span className="text-amber-500 font-extrabold flex items-center gap-0.5 text-xs">
                                ★ {p.rating > 0 ? p.rating.toFixed(2) : 'Sin calificar'}
                              </span>
                            </div>
                            <div className="text-center border-x border-divider/30 px-1">
                              <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Ganancias Hoy</span>
                              <span className="text-xs text-[#0EA65C] font-black">${(p.todayEarnings || 0).toLocaleString('es-CO')}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Total Viajes</span>
                              <span className="text-xs text-ink font-black">{p.completedCount}</span>
                            </div>
                          </div>
   
                          {/* Custom Interactive action Buttons */}
                          <div className="flex gap-2">
                            {p.status === 'pendiente' && (
                              <button
                                type="button"
                                onClick={() => handlePartnerAction(p.id, 'disponible')}
                                className="flex-1 bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                              >
                                Aprobar Aliado
                              </button>
                            )}
                            {p.status !== 'pendiente' && p.status !== 'suspendido' && p.status !== 'desactivado' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handlePartnerAction(p.id, 'suspendido')}
                                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-extrabold uppercase py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Suspender
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePartnerAction(p.id, 'desactivado')}
                                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-extrabold uppercase py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Desactivar
                                </button>
                              </>
                            )}
                            {(p.status === 'suspendido' || p.status === 'desactivado') && (
                              <button
                                type="button"
                                onClick={() => handlePartnerAction(p.id, 'disponible')}
                                className="flex-1 bg-[#E6F7EC] hover:bg-[#D4F0DF] text-[#0EA65C] text-[10px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer"
                              >
                                Activar / Reactivar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                /* SOLICITUDES DE REGISTRO VIEW (Módulo 21) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                  
                  {/* LEFT COLUMN: REQUESTS SCROLLABLE LIST (5 cols) */}
                  <div className="lg:col-span-5 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4 h-[650px] flex flex-col overflow-hidden">
                    <div>
                      <h4 className="font-sora font-extrabold text-sm text-ink">Solicitudes Recibidas</h4>
                      <p className="text-[10px] text-ink-soft mt-0.5">Listado de personas postuladas a conductores en Aguachica.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 content-scrollbar">
                      {allyRequests.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center text-ink-soft">
                          <span className="text-3xl">📩</span>
                          <span className="font-bold text-xs mt-2">No hay solicitudes pendientes</span>
                        </div>
                      ) : (
                        allyRequests.map((req, idx) => {
                          const isSelected = selectedRequest?.id === req.id;
                          return (
                            <div
                              key={req.id || idx}
                              onClick={() => {
                                setSelectedRequest(req);
                                setCorrectionComment('');
                              }}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                                isSelected 
                                  ? 'border-primary bg-primary-surface/10 shadow-xs' 
                                  : 'border-divider/50 bg-white hover:bg-surface-alt/40'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                  <h5 className="font-sora font-extrabold text-xs text-ink truncate">{req.name}</h5>
                                  <p className="text-[10px] text-ink-soft mt-0.5 font-mono">{req.phone} • {req.vehicle.plate}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
                                  req.status === 'enviado' ? 'bg-blue-50 text-blue-600' :
                                  req.status === 'en_revision' ? 'bg-amber-50 text-amber-600' :
                                  req.status === 'correccion' ? 'bg-amber-100 text-[#8F6B00]' :
                                  req.status === 'aprobado' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                  {req.status === 'enviado' ? 'Enviado' :
                                   req.status === 'en_revision' ? 'Revisando' :
                                   req.status === 'correccion' ? 'Corrección' :
                                   req.status === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {req.services.map((srv: string) => (
                                  <span key={srv} className="bg-surface-alt text-ink-soft text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                    {srv}
                                  </span>
                                ))}
                              </div>

                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-divider/30 text-[9px] text-ink-faint">
                                <span>ID: {req.id}</span>
                                <span>{req.submittedAt}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: DETAIL VIEW (7 cols) */}
                  <div className="lg:col-span-7 bg-white border border-divider/60 rounded-3xl p-6 shadow-sm space-y-5 h-[650px] flex flex-col overflow-hidden">
                    {selectedRequest ? (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        
                        {/* Detail Header */}
                        <div className="flex justify-between items-start pb-4 border-b border-divider/50 flex-shrink-0">
                          <div>
                            <span className="text-[9px] font-black uppercase text-primary tracking-wider font-mono">Código Radicado: {selectedRequest.id}</span>
                            <h4 className="font-sora font-extrabold text-base text-ink leading-tight mt-0.5">{selectedRequest.name}</h4>
                            <p className="text-[10px] text-ink-soft mt-0.5">Postulado el {selectedRequest.submittedAt}</p>
                          </div>
                          
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            selectedRequest.status === 'enviado' ? 'bg-blue-50 text-blue-600' :
                            selectedRequest.status === 'en_revision' ? 'bg-amber-50 text-amber-600' :
                            selectedRequest.status === 'correccion' ? 'bg-[#FFF9E6] text-[#D9A300]' :
                            selectedRequest.status === 'aprobado' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-red-50 text-red-600'
                          }`}>
                            {selectedRequest.status === 'enviado' ? '📩 Recibido' :
                             selectedRequest.status === 'en_revision' ? '🔍 En Auditoría' :
                             selectedRequest.status === 'correccion' ? '⚠️ Por Corregir' :
                             selectedRequest.status === 'aprobado' ? '🎉 Aprobado' : '❌ Rechazado'}
                          </span>
                        </div>

                        {/* Scrollable Detail Body */}
                        <div className="flex-1 overflow-y-auto space-y-5 pr-1 content-scrollbar py-3">
                          
                          {/* 1. Personal data */}
                          <div className="space-y-2">
                            <h5 className="font-sora font-bold text-xs text-ink flex items-center gap-1">
                              <Users size={13} className="text-primary" /> Datos Personales
                            </h5>
                            <div className="grid grid-cols-2 gap-3.5 bg-surface-alt/40 p-3.5 rounded-2xl text-[10.5px] font-bold text-ink-soft border border-divider/20">
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Celular</span>
                                <span className="text-ink">{selectedRequest.phone}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Correo</span>
                                <span className="text-ink truncate block">{selectedRequest.email}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Fecha Nacimiento</span>
                                <span className="text-ink">{selectedRequest.birthDate}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Categoría Solicitada</span>
                                <span className="text-primary-dark font-extrabold">Multiservicios</span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Services intended */}
                          <div className="space-y-2">
                            <h5 className="font-sora font-bold text-xs text-ink flex items-center gap-1">
                              <ClipboardList size={13} className="text-primary" /> Categorías a Prestar
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedRequest.services.map((srv: string) => {
                                const badg = getServiceBadge(srv as any);
                                return (
                                  <span key={srv} className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${badg?.bg}`}>
                                    <span>{badg?.icon}</span>
                                    <span>{badg?.name}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. Motorcycle Data */}
                          <div className="space-y-2">
                            <h5 className="font-sora font-bold text-xs text-ink flex items-center gap-1">
                              <Bike size={13} className="text-primary" /> Vehículo Registrado
                            </h5>
                            <div className="grid grid-cols-2 gap-3 bg-surface-alt/40 p-3.5 rounded-2xl text-[10.5px] font-bold text-ink-soft border border-divider/20 font-mono">
                              <div>
                                <span className="block text-[8px] font-sans font-bold uppercase tracking-wider text-ink-faint">Marca / Modelo</span>
                                <span className="text-ink font-bold font-sans">{selectedRequest.vehicle.brand} {selectedRequest.vehicle.model}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] font-sans font-bold uppercase tracking-wider text-ink-faint">Color de la Moto</span>
                                <span className="text-ink font-sans">{selectedRequest.vehicle.color}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] font-sans font-bold uppercase tracking-wider text-ink-faint">Placa</span>
                                <span className="text-primary font-black text-xs">{selectedRequest.vehicle.plate}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] font-sans font-bold uppercase tracking-wider text-ink-faint">Cilindraje</span>
                                <span className="text-ink">{selectedRequest.vehicle.displacement}</span>
                              </div>
                            </div>
                          </div>

                          {/* 4. Bank Account */}
                          <div className="space-y-2">
                            <h5 className="font-sora font-bold text-xs text-ink flex items-center gap-1">
                              <DollarSign size={13} className="text-primary" /> Información de Dispersión
                            </h5>
                            <div className="bg-surface-alt/40 p-3.5 rounded-2xl text-[10.5px] font-bold text-ink-soft border border-divider/20 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary-surface flex items-center justify-center text-lg">
                                🏦
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Billetera / Banco</span>
                                <span className="text-ink font-bold uppercase">{selectedRequest.payment.bankName}</span>
                              </div>
                              <div className="ml-auto text-right">
                                <span className="block text-[8px] uppercase tracking-wider text-ink-faint">Número de Cuenta</span>
                                <span className="font-mono text-ink text-xs font-black">{selectedRequest.payment.accountNumber}</span>
                              </div>
                            </div>
                          </div>

                          {/* 5. Documents Grid Validation (Módulo 21 - Pantalla 3 Docs) */}
                          <div className="space-y-2">
                            <h5 className="font-sora font-bold text-xs text-ink flex items-center gap-1">
                              <Shield size={13} className="text-primary" /> Documentación Digital Enviada
                            </h5>
                            <p className="text-[9.5px] text-ink-soft leading-normal font-semibold">
                              Haz clic en cualquier documento para abrir el visor interactivo de validación de antecedentes y SOAT en Aguachica:
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2.5 pt-1">
                              {[
                                { key: 'cedula', label: 'Cédula de Ciudadanía', file: selectedRequest.documents.cedula },
                                { key: 'licencia', label: 'Licencia de Conducción', file: selectedRequest.documents.licencia },
                                { key: 'soat', label: 'SOAT de la Moto', file: selectedRequest.documents.soat },
                                { key: 'tarjeta', label: 'Tarjeta de Propiedad', file: selectedRequest.documents.tarjeta },
                                { key: 'fotoMoto', label: 'Foto de la Moto', file: selectedRequest.documents.fotoMoto },
                                { key: 'fotoPerfil', label: 'Foto de Perfil', file: selectedRequest.documents.fotoPerfil }
                              ].map(doc => (
                                <button
                                  key={doc.key}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDocLabel(doc.label);
                                    setSelectedDocUrl(doc.key);
                                  }}
                                  className="p-3 bg-white hover:bg-surface-alt/40 border border-divider/60 rounded-xl flex items-center gap-2 text-left cursor-pointer transition-all hover:scale-[1.01]"
                                >
                                  <FileText size={14} className="text-primary flex-shrink-0" />
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-extrabold text-ink block leading-none truncate">{doc.label}</span>
                                    <span className="text-[8px] font-mono text-ink-soft block mt-0.5 truncate">{doc.file?.toString()}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 6. Corrections message if any */}
                          {selectedRequest.status === 'correccion' && selectedRequest.correctionsNeeded && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                              <span className="block text-[8px] font-black uppercase text-amber-800 tracking-wider">Observaciones Enviadas</span>
                              <p className="text-[10px] text-amber-700/90 leading-relaxed font-semibold mt-1">
                                "{selectedRequest.correctionsNeeded}"
                              </p>
                            </div>
                          )}

                        </div>

                        {/* Backoffice Action Bar */}
                        {selectedRequest.status !== 'aprobado' && selectedRequest.status !== 'rechazado' && (
                          <div className="pt-4 border-t border-divider/50 flex-shrink-0 space-y-4 bg-white">
                            
                            {/* Corrections Comment Area */}
                            <div className="space-y-1.5">
                              <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider">Observaciones para Solicitar Corrección</label>
                              <div className="flex gap-2">
                                <textarea
                                  value={correctionComment}
                                  onChange={e => setCorrectionComment(e.target.value)}
                                  placeholder="Ej: La foto del SOAT está borrosa o vencida. Sube el documento vigente."
                                  className="flex-1 bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary h-[48px] resize-none font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!correctionComment.trim()) {
                                      alert("Por favor escribe una observación antes de solicitar correcciones.");
                                      return;
                                    }
                                    handleAllyRequestAction(selectedRequest.id, 'correccion', correctionComment);
                                  }}
                                  className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] uppercase px-4 rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-xs"
                                >
                                  Solicitar<br/>Corrección
                                </button>
                              </div>
                            </div>

                            {/* Main Decision Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <button
                                type="button"
                                onClick={() => handleAllyRequestAction(selectedRequest.id, 'rechazar')}
                                className="bg-red-50 hover:bg-red-100 text-red-600 font-sora font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer text-center uppercase tracking-wide"
                              >
                                Rechazar Solicitud
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAllyRequestAction(selectedRequest.id, 'aprobar')}
                                className="bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-xs py-3 rounded-xl shadow-md shadow-primary/15 transition-all cursor-pointer text-center uppercase tracking-wide"
                              >
                                Aprobar y Dar de Alta
                              </button>
                            </div>

                          </div>
                        )}

                        {selectedRequest.status === 'aprobado' && (
                          <div className="p-3 bg-[#E6F7EC] text-[#0EA65C] rounded-2xl text-[10px] font-bold uppercase tracking-wider text-center mt-3 flex items-center justify-center gap-1">
                            <CheckCircle size={14} /> Solicitud Procesada y Aprobada Correctamente
                          </div>
                        )}

                        {selectedRequest.status === 'rechazado' && (
                          <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-center mt-3 flex items-center justify-center gap-1">
                            <X size={14} /> Solicitud Rechazada Definitivamente
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-ink-soft text-center p-6 space-y-2">
                        <span className="text-4xl">👤</span>
                        <h4 className="font-sora font-extrabold text-sm text-ink mt-2">No has seleccionado una solicitud</h4>
                        <p className="text-[10px] text-ink-soft leading-normal max-w-xs font-semibold">
                          Selecciona una de las postulaciones de la lista de la izquierda para auditar sus antecedentes judiciales, fotos y vigencia del SOAT.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 4: SERVICIOS VIEW */}
          {activeTab === 'servicios' && (
            <div className="space-y-4 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm">
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Historial General de Servicios</h3>
                <p className="text-xs text-ink-soft mt-0.5">Listado y auditoría en tiempo real de todos los traslados y mandados registrados.</p>
              </div>

              {/* Filter Box bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <input 
                    type="text"
                    value={searchServiceQuery}
                    onChange={e => setSearchServiceQuery(e.target.value)}
                    placeholder="Buscar por ID de viaje, cliente, aliado..."
                    className="w-full bg-surface-alt border-0 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <select 
                    value={filterServiceType} 
                    onChange={e => setFilterServiceType(e.target.value as any)}
                    className="bg-surface-alt border-0 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="todos">Todas las categorías</option>
                    <option value="mototaxi">🛵 Mototaxi</option>
                    <option value="domicilio">🍔 Domicilio</option>
                    <option value="encomienda">📦 Encomienda</option>
                    <option value="compra">🛒 Compra</option>
                    <option value="mandado">📋 Mandado</option>
                  </select>

                  <select 
                    value={filterServiceStatus} 
                    onChange={e => setFilterServiceStatus(e.target.value as any)}
                    className="bg-surface-alt border-0 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="completado">Completados</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>
              </div>

              {/* Services Table */}
              <div className="overflow-x-auto pt-2 border-t border-divider/50">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">ID Servicio</th>
                      <th className="py-3 px-2">Categoría</th>
                      <th className="py-3 px-2">Cliente</th>
                      <th className="py-3 px-2">Socio Conductor</th>
                      <th className="py-3 px-2">Fecha / Hora</th>
                      <th className="py-3 px-2">Precio Cobrado</th>
                      <th className="py-3 px-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                    {services
                      .filter(s => {
                        const matchesSearch = s.id.toLowerCase().includes(searchServiceQuery.toLowerCase()) || 
                                              s.client.toLowerCase().includes(searchServiceQuery.toLowerCase()) || 
                                              s.partner.toLowerCase().includes(searchServiceQuery.toLowerCase());
                        const matchesType = filterServiceType === 'todos' ? true : s.type === filterServiceType;
                        const matchesStatus = filterServiceStatus === 'todos' ? true : s.status === filterServiceStatus;
                        return matchesSearch && matchesType && matchesStatus;
                      })
                      .map((s, idx) => {
                        const badge = getServiceBadge(s.type);
                        return (
                          <tr key={idx} className="hover:bg-surface-alt/30 transition-colors">
                            <td className="py-3 px-2 text-ink-soft font-mono font-bold">{s.id}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${badge?.bg}`}>
                                <span>{badge?.icon}</span>
                                <span>{badge?.name}</span>
                              </span>
                            </td>
                            <td className="py-3 px-2 font-bold text-ink">{s.client}</td>
                            <td className="py-3 px-2 text-ink-soft font-medium">{s.partner}</td>
                            <td className="py-3 px-2 text-ink-soft font-mono text-[10px]">{s.date} {s.time}</td>
                            <td className="py-3 px-2 text-primary font-black">${s.value.toLocaleString('es-CO')}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                s.status === 'activo' ? 'bg-[#FFF9E6] text-[#D9A300]' :
                                s.status === 'completado' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-red-50 text-red-500'
                              }`}>
                                {s.status === 'activo' ? 'Activo' : s.status === 'completado' ? 'Completado' : 'Cancelado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COMERCIOS ALIADOS (MODULO 22) */}
          {activeTab === 'comercios' && (() => {
            const savedAppString = localStorage.getItem('movica_merchant_application');
            const dynamicApp = savedAppString ? JSON.parse(savedAppString) : null;
            
            const presetMerchants = [
              { id: 'MERCH-1001', businessName: 'Pizza Nostra Aguachica', ownerName: 'Andrés Pastrana', phone: '315 777 8899', email: 'contacto@pizzanostra.co', address: 'Calle 5 # 10-32, Centro', category: 'Restaurante', selectedLogo: '🍕', selectedLocalPic: '🏬', status: 'aprobado', selectedDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], prepTime: 20, isOpen: true },
              { id: 'MERCH-1002', businessName: 'Droguería La Economía', ownerName: 'Marta Cecilia Díaz', phone: '320 444 5566', email: 'farmacia.economia@gmail.com', address: 'Carrera 14 # 4-82, Sabanita', category: 'Farmacia', selectedLogo: '💊', selectedLocalPic: '🏪', status: 'aprobado', selectedDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], prepTime: 10, isOpen: true },
              { id: 'MERCH-1003', businessName: 'Súper Sabor Costeño', ownerName: 'Julio Cesar Buelvas', phone: '311 999 2211', email: 'julio@saborcosteno.com', address: 'Calle 1 # 18-12, Barahoja', category: 'Restaurante', selectedLogo: '🍗', selectedLocalPic: '🎪', status: 'aprobado', selectedDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], prepTime: 30, isOpen: false },
            ];

            const allMerchants = [...presetMerchants];
            if (dynamicApp && (dynamicApp.status === 'aprobado' || dynamicApp.status === 'suspendido')) {
              if (!allMerchants.some(m => m.id === dynamicApp.id)) {
                allMerchants.unshift(dynamicApp);
              }
            }

            const pendingApps = [];
            if (dynamicApp && dynamicApp.status === 'pendiente') {
              pendingApps.push(dynamicApp);
            }

            const handleApproveStore = () => {
              if (dynamicApp) {
                const approved = { ...dynamicApp, status: 'aprobado' };
                localStorage.setItem('movica_merchant_application', JSON.stringify(approved));
                setActiveTab('comercios');
                alert(`¡El comercio ${dynamicApp.businessName} ha sido aprobado con éxito! Ahora puede iniciar sesión en su Panel de Comercio.`);
              }
            };

            const handleSuspendStore = (id: string) => {
              if (dynamicApp && dynamicApp.id === id) {
                const suspended = { ...dynamicApp, status: 'suspendido' };
                localStorage.setItem('movica_merchant_application', JSON.stringify(suspended));
                setActiveTab('comercios');
                alert(`¡El comercio ${dynamicApp.businessName} ha sido suspendido.`);
              } else {
                alert(`El comercio con ID ${id} se ha suspendido (simulado en el prototipo).`);
              }
            };

            const handleReactivateStore = (id: string) => {
              if (dynamicApp && dynamicApp.id === id) {
                const activeStore = { ...dynamicApp, status: 'aprobado' };
                localStorage.setItem('movica_merchant_application', JSON.stringify(activeStore));
                setActiveTab('comercios');
                alert(`¡El comercio ${dynamicApp.businessName} ha sido reactivado con éxito.`);
              } else {
                alert(`El comercio con ID ${id} se ha reactivado (simulado en el prototipo).`);
              }
            };

            return (
              <div className="space-y-6 text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-sora font-extrabold text-lg text-ink">Administración de Comercios Aliados</h3>
                    <p className="text-xs text-ink-soft mt-0.5">Controla las tiendas, restaurantes, farmacias y bodegas afiliadas a Movica en Aguachica.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Section: Active Stores Catalog */}
                  <div className="lg:col-span-7 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-sora font-bold text-sm text-ink">Catálogo de Comercios Habilitados</h4>
                      <p className="text-[10px] text-ink-soft mt-0.5">Locales con servicio activo en la plataforma.</p>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto content-scrollbar pr-1">
                      {allMerchants.map(merch => (
                        <div key={merch.id} className="p-4 rounded-2xl border border-divider/40 bg-white shadow-xs flex items-start gap-3 justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-surface-alt border border-divider/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                              {merch.selectedLogo}
                            </div>
                            <div className="space-y-0.5 text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-sora font-extrabold text-xs text-ink">{merch.businessName}</h5>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.25 rounded-full tracking-wider ${
                                  merch.status === 'suspendido' ? 'bg-red-100 text-red-800' :
                                  merch.isOpen ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-red-50 text-red-600'
                                }`}>
                                  {merch.status === 'suspendido' ? 'Suspendido' : merch.isOpen ? 'Abierto' : 'Cerrado'}
                                </span>
                              </div>
                              <p className="text-[10px] text-ink-soft font-semibold font-mono">ID: {merch.id} • {merch.category}</p>
                              <p className="text-[10px] text-ink-soft font-semibold leading-relaxed">
                                <strong>Dirección:</strong> {merch.address}<br />
                                <strong>Propietario:</strong> {merch.ownerName} ({merch.phone})<br />
                                <strong>Horario:</strong> {merch.selectedDays.join(', ')} • ⏳ {merch.prepTime} min
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 justify-end">
                            {merch.status === 'suspendido' ? (
                              <button
                                type="button"
                                onClick={() => handleReactivateStore(merch.id)}
                                className="bg-[#E6F7EC] hover:bg-[#D4F0DF] text-[#0EA65C] text-[9.5px] font-black uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-[#0EA65C]/15"
                              >
                                Reactivar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSuspendStore(merch.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 text-[9.5px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-red-200"
                              >
                                Suspender
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Section: Pending Applications */}
                  <div className="lg:col-span-5 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-sora font-bold text-sm text-ink">Solicitudes de Afiliación Nuevas</h4>
                      <p className="text-[10px] text-ink-soft mt-0.5">Comercios postulados que esperan validación comercial.</p>
                    </div>

                    <div className="space-y-3">
                      {pendingApps.length === 0 ? (
                        <div className="p-8 text-center bg-surface-alt/30 border border-divider/30 rounded-2xl space-y-2">
                          <span className="text-3xl block">🏪</span>
                          <p className="text-xs text-ink-soft italic font-semibold font-bold">No hay solicitudes de comercios pendientes en este momento.</p>
                          <p className="text-[10px] text-ink-soft leading-normal font-semibold">
                            Para simular una, ve a <strong>📱 Modo Cliente</strong>, ingresa a tu <strong>Perfil 👤</strong> y haz clic en <strong>Panel del Comercio Aliado</strong> para registrar una tienda.
                          </p>
                        </div>
                      ) : (
                        pendingApps.map(pending => (
                          <div key={pending.id} className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/15 space-y-4">
                            <div className="flex gap-3 items-start">
                              <div className="w-12 h-12 bg-white border border-amber-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                                {pending.selectedLogo}
                              </div>
                              <div className="text-left space-y-0.5">
                                <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-2 py-0.25 rounded-full tracking-wider border border-amber-200/50">
                                  Espera Aprobación
                                </span>
                                <h5 className="font-sora font-extrabold text-xs text-ink mt-1">{pending.businessName}</h5>
                                <p className="text-[10px] text-ink-soft font-semibold">{pending.category} • {pending.address}</p>
                              </div>
                            </div>

                            <div className="bg-white border border-divider/30 p-3 rounded-xl text-[10px] space-y-1.5 font-semibold text-ink-soft text-left">
                              <div className="flex justify-between">
                                <span>Propietario:</span>
                                <span className="text-ink font-bold">{pending.ownerName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Celular:</span>
                                <span className="text-ink font-bold">{pending.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="text-ink font-bold">{pending.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Preparación:</span>
                                <span className="text-primary font-black">⏳ {pending.prepTime} min</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Días de servicio:</span>
                                <span className="text-ink font-bold">{pending.selectedDays.join(', ')}</span>
                              </div>
                            </div>

                            {/* Local Pic simulation */}
                            <div className="w-full aspect-[2/1] bg-white rounded-xl border border-divider/40 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                              <span className="text-4xl">{pending.selectedLocalPic}</span>
                              <span className="text-[9px] text-ink-soft mt-1.5 uppercase font-black tracking-wider">Fachada de local simulada</span>
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-[7px] font-mono px-1.5 py-0.25 rounded font-bold uppercase tracking-wide">
                                JPG Uploaded
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  localStorage.removeItem('movica_merchant_application');
                                  setActiveTab('comercios');
                                  alert('La solicitud ha sido rechazada y eliminada del sistema.');
                                }}
                                className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-xl border border-red-100 cursor-pointer text-center"
                              >
                                Rechazar
                              </button>
                              <button
                                type="button"
                                onClick={handleApproveStore}
                                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-xl shadow-xs cursor-pointer text-center"
                              >
                                Aprobar Negocio ✓
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}


          {/* TAB 5: ESTADISTICAS VIEW */}
          {activeTab === 'estadisticas' && (
            <div className="space-y-6">
              
              {/* Top summary row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-1 text-left">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Comisión Estimada (15%)</span>
                  <p className="text-xl font-sora font-extrabold text-[#0EA65C]">${Math.round(dayEarnings * 0.15).toLocaleString('es-CO')} COP</p>
                  <p className="text-[9px] text-ink-faint">Sobre el volumen total facturado hoy</p>
                </div>
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-1 text-left">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Promedio de Viaje</span>
                  <p className="text-xl font-sora font-extrabold text-ink">${Math.round(dayEarnings / services.filter(s => s.status === 'completado').length).toLocaleString('es-CO')} COP</p>
                  <p className="text-[9px] text-ink-faint">Costo medio por trayecto solicitado</p>
                </div>
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-1 text-left">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Satisfacción General</span>
                  <p className="text-xl font-sora font-extrabold text-amber-500 flex items-center gap-1">★ {averageRating} <span className="text-xs text-ink-soft font-normal">/ 5.0</span></p>
                  <p className="text-[9px] text-ink-faint">Calificación ponderada de los socios</p>
                </div>
              </div>

              {/* Advanced Analytics Charts with Bar and Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Bar chart: Daily Revenue progression */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-sora font-bold text-sm text-ink">Historial de Ventas Diarias</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">Volumen bruto cobrado en pesos colombianos (COP).</p>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE4" vertical={false} />
                        <XAxis dataKey="date" stroke="#8E8E93" fontSize={10} tickLine={false} />
                        <YAxis stroke="#8E8E93" fontSize={10} tickLine={false} />
                        <Tooltip formatter={(value: any) => [`$${value.toLocaleString('es-CO')}`, 'Ingresos']} />
                        <Bar dataKey="ingresos" fill="#0EA65C" radius={[4, 4, 0, 0]}>
                          {serviceHistoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === serviceHistoryData.length - 1 ? '#FFC629' : '#0EA65C'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Area Chart: Volume of trips completed */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-sora font-bold text-sm text-ink">Volumen de Trayectos Completados</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">Cantidad neta de viajes gestionados con éxito por día.</p>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={serviceHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE4" vertical={false} />
                        <XAxis dataKey="date" stroke="#8E8E93" fontSize={10} tickLine={false} />
                        <YAxis stroke="#8E8E93" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="servicios" stroke="#0066FF" fill="#EBF3FF" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TARIFAS VIEW */}
          {activeTab === 'tarifas' && (
            <div className="max-w-2xl mx-auto bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-6">
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Configuración de Tarifas de la Plataforma</h3>
                <p className="text-xs text-ink-soft mt-0.5">Modifica los cobros base del algoritmo de cálculo automático para Aguachica.</p>
              </div>

              <form onSubmit={handleUpdateRates} className="space-y-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Tarifa base */}
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Bike size={12} className="text-primary" /> Tarifa base del Mototaxi ($ COP)
                    </label>
                    <input 
                      type="number"
                      required
                      value={rates.baseMototaxi}
                      onChange={e => setRates({ ...rates, baseMototaxi: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Cuadras incluidas */}
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MapPin size={12} className="text-primary" /> Número de cuadras incluidas
                    </label>
                    <input 
                      type="number"
                      required
                      value={rates.quadrasIncluded}
                      onChange={e => setRates({ ...rates, quadrasIncluded: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Valor adicional */}
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Plus size={12} className="text-primary" /> Adicional por bloque de cuadras ($ COP)
                    </label>
                    <input 
                      type="number"
                      required
                      value={rates.additionalBlockValue}
                      onChange={e => setRates({ ...rates, additionalBlockValue: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Comisión Movica */}
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Percent size={12} className="text-primary" /> Comisión fija de Movica (%)
                    </label>
                    <input 
                      type="number"
                      required
                      max={100}
                      min={0}
                      value={rates.movicaCommission}
                      onChange={e => setRates({ ...rates, movicaCommission: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Recargo nocturno */}
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Moon size={12} className="text-primary" /> Recargo Nocturno ($ COP)
                    </label>
                    <input 
                      type="number"
                      required
                      value={rates.nightSurcharge}
                      onChange={e => setRates({ ...rates, nightSurcharge: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Recargo lluvia */}
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <CloudRain size={12} className="text-primary" /> Recargo por lluvia ($ COP)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        required
                        disabled={!rates.isRainSurchargeActive}
                        value={rates.rainSurcharge}
                        onChange={e => setRates({ ...rates, rainSurcharge: parseInt(e.target.value) || 0 })}
                        className="flex-1 bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-bold disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setRates({ ...rates, isRainSurchargeActive: !rates.isRainSurchargeActive })}
                        className={`px-3 py-3 rounded-xl font-bold text-[10px] uppercase cursor-pointer transition-all whitespace-nowrap ${
                          rates.isRainSurchargeActive 
                            ? 'bg-primary text-white' 
                            : 'bg-surface-alt text-ink-soft border border-divider'
                        }`}
                      >
                        {rates.isRainSurchargeActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-divider/50 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    Guardar Cambios de Tarifa
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: PROMOCIONES VIEW */}
          {activeTab === 'promociones' && (
            <PromoAndCoupons initialViewMode="admin" />
          )}

          {/* TAB 8: REPORTES VIEW */}
          {activeTab === 'reportes' && (
            <AdvancedStats />
          )}

          {/* TAB: SOPORTE Y CASOS VIEW */}
          {activeTab === 'soporte' && (
            <AdminSupportCases />
          )}

          {/* TAB 9: CONFIGURACION VIEW */}
          {activeTab === 'configuracion' && (
            <GeneralConfig />
          )}

        </div>
      </main>

      {/* MOBILE NAV DRAWER - Overlays on left side on small screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-[240px] bg-[#0d1a16] text-white flex flex-col z-50 lg:hidden p-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <img src={movicaLogo} alt="Movica Logo" className="w-6 h-6 object-contain rounded-md" referrerPolicy="no-referrer" />
                  <span className="font-sora font-extrabold text-base tracking-tight">Movica Admin</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {sidebarItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive 
                          ? 'bg-primary text-white shadow-md' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    onBackToClient();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white/90 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Volver al App
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MODAL: REGISTRAR CLIENTE */}
      <AnimatePresence>
        {isAddCustomerOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddCustomerOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-sm z-10 space-y-4 text-left"
            >
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Registrar Nuevo Cliente</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Ingresa los datos del pasajero en el sistema central.</p>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Nombre Completo</label>
                  <input 
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={e => setNewCustomerName(e.target.value)}
                    placeholder="Ej: Marcelo Rojas"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Número Celular</label>
                  <input 
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={e => setNewCustomerPhone(e.target.value)}
                    placeholder="315 777 8899"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Correo Electrónico (Opcional)</label>
                  <input 
                    type="email"
                    value={newCustomerEmail}
                    onChange={e => setNewCustomerEmail(e.target.value)}
                    placeholder="marcelo@correo.com"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2 text-xs font-bold">
                  <button 
                    type="button" 
                    onClick={() => setIsAddCustomerOpen(false)}
                    className="flex-1 bg-surface-alt text-ink-soft py-2.5 rounded-xl cursor-pointer hover:bg-divider transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl cursor-pointer hover:bg-primary-dark transition-all shadow-md shadow-primary/10"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: NUEVO CUPÓN */}
      <AnimatePresence>
        {isAddPromoOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddPromoOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-sm z-10 space-y-4 text-left"
            >
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Crear Código Promocional</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Define un código canjeable y el descuento fijo por trayecto.</p>
              </div>

              <form onSubmit={handleAddPromo} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Código de Descuento</label>
                  <input 
                    type="text"
                    required
                    value={newPromoCode}
                    onChange={e => setNewPromoCode(e.target.value)}
                    placeholder="Ej: AGUACHICA30"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Monto de Descuento ($ COP)</label>
                  <input 
                    type="number"
                    required
                    value={newPromoDiscount}
                    onChange={e => setNewPromoDiscount(e.target.value)}
                    placeholder="2000"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Límite de Canjes Permitidos</label>
                  <input 
                    type="number"
                    required
                    value={newPromoLimit}
                    onChange={e => setNewPromoLimit(e.target.value)}
                    placeholder="100"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2 text-xs font-bold">
                  <button 
                    type="button" 
                    onClick={() => setIsAddPromoOpen(false)}
                    className="flex-1 bg-surface-alt text-ink-soft py-2.5 rounded-xl cursor-pointer hover:bg-divider transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl cursor-pointer hover:bg-primary-dark transition-all shadow-md shadow-primary/10"
                  >
                    Crear Cupón
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDITAR CUPÓN */}
      <AnimatePresence>
        {isEditPromoOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditPromoOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-sm z-10 space-y-4 text-left"
            >
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Editar Código Promocional</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Modifica los parámetros de este cupón de descuento activo.</p>
              </div>

              <form onSubmit={handleEditPromo} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Código de Descuento</label>
                  <input 
                    type="text"
                    required
                    value={editPromoCode}
                    onChange={e => setEditPromoCode(e.target.value)}
                    placeholder="Ej: MOVICA50"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Monto de Descuento ($ COP)</label>
                  <input 
                    type="number"
                    required
                    value={editPromoDiscount}
                    onChange={e => setEditPromoDiscount(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Límite de Canjes Permitidos</label>
                  <input 
                    type="number"
                    required
                    value={editPromoLimit}
                    onChange={e => setEditPromoLimit(e.target.value)}
                    placeholder="150"
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2 text-xs font-bold">
                  <button 
                    type="button" 
                    onClick={() => setIsEditPromoOpen(false)}
                    className="flex-1 bg-surface-alt text-ink-soft py-2.5 rounded-xl cursor-pointer hover:bg-divider transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl cursor-pointer hover:bg-primary-dark transition-all shadow-md shadow-primary/10"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VISOR DE DOCUMENTOS DE AFILIACIÓN (Módulo 21) */}
      <AnimatePresence>
        {selectedDocUrl && selectedDocLabel && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedDocUrl(null);
                setSelectedDocLabel(null);
              }}
              className="absolute inset-0 bg-slate-950"
            />
            
            <motion.div 
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-md z-10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-wider">Auditoría de Postulantes</span>
                  <h4 className="font-sora font-extrabold text-sm text-ink">{selectedDocLabel}</h4>
                  <p className="text-[10px] text-ink-soft mt-0.5">Verificación de autenticidad en RUNT y bases judiciales nacionales.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocUrl(null);
                    setSelectedDocLabel(null);
                  }}
                  className="p-1 rounded-xl hover:bg-surface-alt text-ink-soft hover:text-ink cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Real mock document display depending on clicked document label */}
              <div className="border border-divider/40 p-4 rounded-2xl bg-surface-alt/40 flex justify-center items-center min-h-[180px]">
                {renderMockDocument(selectedDocLabel, selectedRequest)}
              </div>

              <div className="flex gap-2 text-xs font-bold bg-[#E6F7EC] text-[#0EA65C] p-3 rounded-2xl">
                <span className="text-sm">✓</span>
                <p className="text-[10px] leading-snug font-bold">
                  Sello de Verificación Digital de Movica OS: El documento coincide con los datos del postulante y se encuentra vigente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDocUrl(null);
                  setSelectedDocLabel(null);
                }}
                className="w-full bg-primary text-white py-3 rounded-xl font-sora font-bold text-xs cursor-pointer hover:bg-primary-dark transition-all shadow-md shadow-primary/10 text-center"
              >
                Cerrar Visor de Documento
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function AdminSupportCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  const loadCases = () => {
    const saved = localStorage.getItem('movica_support_cases');
    if (saved) {
      setCases(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadCases();
    // Periodically sync in case of local storage updates (e.g. simulation responses)
    const interval = setInterval(loadCases, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId) return;

    const target = cases.find(c => c.id === selectedId);
    if (!target) return;

    const newMsg = {
      id: `msg-admin-${Date.now()}`,
      sender: 'support',
      text: replyText.trim(),
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    const updatedCase = {
      ...target,
      messages: [...target.messages, newMsg]
    };

    const updatedCases = cases.map(c => c.id === selectedId ? updatedCase : c);
    setCases(updatedCases);
    localStorage.setItem('movica_support_cases', JSON.stringify(updatedCases));
    setReplyText('');
  };

  const handleUpdateStatus = (caseId: string, newStatus: 'revision' | 'resuelto' | 'cerrado') => {
    const updatedCases = cases.map(c => {
      if (c.id === caseId) {
        return { ...c, statusKey: newStatus };
      }
      return c;
    });
    setCases(updatedCases);
    localStorage.setItem('movica_support_cases', JSON.stringify(updatedCases));
  };

  const handleCloseCase = (caseId: string) => {
    handleUpdateStatus(caseId, 'cerrado');
  };

  const selectedCase = cases.find(c => c.id === selectedId);

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'todos' ? true : c.type === filterType;
    const matchesStatus = filterStatus === 'todos' ? true : c.statusKey === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4 text-left">
      <div>
        <h3 className="font-sora font-extrabold text-base text-ink">Consola de Soporte y Casos 🚨</h3>
        <p className="text-xs text-ink-soft mt-0.5">Atiende reclamos, reembolsa tarifas y cierra tickets de soporte en tiempo real.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 pt-2 bg-white border border-divider/40 p-4 rounded-3xl shadow-xs">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por ID de ticket, título, descripción..."
            className="w-full bg-surface-alt border-0 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="bg-surface-alt border border-divider/40 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="todos">Todas las categorías</option>
            <option value="aliado">🛵 Conductor/Aliado</option>
            <option value="cliente">👤 Cliente</option>
            <option value="comercio">🏪 Comercio</option>
            <option value="cobro">💵 Cobro Incorrecto</option>
            <option value="objeto_perdido">💼 Objeto Perdido</option>
            <option value="error_app">📱 Error de App</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-surface-alt border border-divider/40 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="todos">Todos los estados</option>
            <option value="revision">🟡 En Revisión</option>
            <option value="resuelto">🟢 Resueltos</option>
            <option value="cerrado">🔴 Cerrados</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
        
        {/* Left Column: Tickets list */}
        <div className="lg:col-span-1 bg-white border border-divider/50 rounded-3xl p-4 shadow-sm flex flex-col gap-3 max-h-[600px] overflow-y-auto">
          <h4 className="font-sora font-extrabold text-xs text-ink px-1 uppercase tracking-wider mb-1">Tickets ({filteredCases.length})</h4>
          
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center text-ink-soft text-xs italic">
              No hay tickets de soporte con los filtros aplicados.
            </div>
          ) : (
            filteredCases.map(item => {
              const isActive = item.id === selectedId;
              const badgeStyle = {
                revision: { bg: "bg-amber-50 text-amber-800", label: "Revisión 🟡" },
                resuelto: { bg: "bg-[#E6F7EC] text-[#0EA65C]", label: "Resuelto 🟢" },
                cerrado: { bg: "bg-red-50 text-red-700", label: "Cerrado 🔴" }
              }[item.statusKey] || { bg: "bg-surface-alt text-ink-soft", label: "Desconocido" };

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer hover:border-primary/20 ${
                    isActive 
                      ? 'border-primary bg-primary-surface/10' 
                      : 'border-divider/40 bg-surface-alt/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1 w-full">
                    <span className="text-[10px] font-mono font-bold text-ink-faint">{item.id}</span>
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md ${badgeStyle.bg}`}>
                      {badgeStyle.label}
                    </span>
                  </div>
                  
                  <div>
                    <h5 className="font-sora font-bold text-[11.5px] text-ink line-clamp-1">{item.typeName}</h5>
                    <p className="text-[10px] text-ink-soft line-clamp-2 mt-0.5 font-semibold leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-ink-faint border-t border-divider/20 pt-1.5 mt-1 font-bold">
                    <span>📅 {item.date}</span>
                    <span>💬 {item.messages.length} msg</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Ticket auditing */}
        <div className="lg:col-span-2 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm flex flex-col gap-4 max-h-[600px]">
          {selectedCase ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Top Auditing Panel */}
              <div className="border-b border-divider/50 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] font-mono font-black text-ink-faint">ID TICKET: {selectedCase.id}</span>
                  <h4 className="font-sora font-extrabold text-[13px] text-ink">{selectedCase.typeName}</h4>
                  <p className="text-[9.5px] font-bold text-[#0EA65C]">Iniciado el {selectedCase.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-ink-soft">Estado:</span>
                  <select
                    value={selectedCase.statusKey}
                    onChange={e => handleUpdateStatus(selectedCase.id, e.target.value as any)}
                    className={`text-[10.5px] font-extrabold rounded-xl px-2.5 py-1.5 border border-divider/30 focus:ring-1 focus:ring-primary outline-none ${
                      selectedCase.statusKey === 'revision' ? 'bg-amber-50 text-amber-800' :
                      selectedCase.statusKey === 'resuelto' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <option value="revision">En Revisión 🟡</option>
                    <option value="resuelto">Resuelto 🟢</option>
                    <option value="cerrado">Cerrado 🔴</option>
                  </select>

                  <button
                    onClick={() => handleCloseCase(selectedCase.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold uppercase transition-all cursor-pointer"
                  >
                    Cerrar Caso
                  </button>
                </div>
              </div>

              {/* Middle Audit Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-surface-alt/10 rounded-2xl border border-divider/20 my-3 content-scrollbar">
                
                {/* Description and Image metadata */}
                <div className="bg-white p-3.5 rounded-xl border border-divider/40 text-[11px] text-ink space-y-1.5 font-semibold text-left">
                  <div className="text-[9px] uppercase tracking-wider font-bold text-ink-faint">Descripción del Reclamante:</div>
                  <p className="text-ink leading-relaxed">{selectedCase.description}</p>
                  
                  {selectedCase.attachedImage && (
                    <div className="pt-2 border-t border-divider/20 flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-ink-faint uppercase">Evidencia Adjunta (Simulada):</span>
                      <div className="p-3 bg-primary-surface/20 border border-primary/20 rounded-lg flex items-center justify-between text-[10px] font-mono text-primary font-bold">
                        <span>📷 {selectedCase.attachedImage}</span>
                        <span className="text-[8px] bg-primary text-white uppercase px-1.5 py-0.5 rounded-md">Verificado ✓</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages stream */}
                <div className="space-y-3">
                  {selectedCase.messages.map((msg: any, index: number) => {
                    const isSupport = msg.sender === 'support';
                    return (
                      <div key={index} className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                          isSupport 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-[#EBF3FF] text-[#0044B3] rounded-tl-none font-semibold'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span className={`text-[8px] block text-right mt-1.5 font-bold ${isSupport ? 'text-white/70' : 'text-[#0044B3]/60'}`}>
                            {isSupport ? 'Soporte Movica' : 'Cliente/Aliado'} • {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Bottom input */}
              {selectedCase.statusKey === 'cerrado' ? (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-[10.5px] font-bold">
                  ⚠️ Este ticket está cerrado. Cambia su estado en el menú superior para poder responder.
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="flex gap-2 bg-white pt-1">
                  <input 
                    type="text"
                    required
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Escribe la respuesta administrativa para enviar al chat del usuario..."
                    className="flex-1 bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary transition-all font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-xs px-5 rounded-xl cursor-pointer shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Enviar</span>
                    <Send size={11} />
                  </button>
                </form>
              )}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-ink-soft text-center p-6 space-y-2">
              <span className="text-5xl">🚨</span>
              <h4 className="font-sora font-extrabold text-sm text-ink mt-2">No has seleccionado ningún ticket</h4>
              <p className="text-[10px] text-ink-soft leading-normal max-w-xs font-bold">
                Selecciona una solicitud o reclamo de la columna izquierda para abrir el chat interactivo, auditar evidencias y responder oficialmente.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
