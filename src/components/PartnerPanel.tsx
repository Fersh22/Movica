import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bike, TrendingUp, CheckCircle, Clock, MapPin, 
  Phone, MessageSquare, Shield, DollarSign, ArrowRight,
  ChevronRight, Sparkles, LogOut, ArrowLeft, Star, Send, Play, AlertCircle, Bell
} from 'lucide-react';
import { PartnerProfile, PartnerEarning, ServiceType, ChatMessage } from '../types';
import NotificationCenter from './NotificationCenter';
import RatingsSystem from './RatingsSystem';
import PartnerWallet from './PartnerWallet';
import SecurityCenter from './SecurityCenter';
import AchievementsSystem from './AchievementsSystem';

interface PartnerPanelProps {
  onBackToClient: () => void;
  clientOrders: any[]; // To sync if client placed real-time orders
}

// Initial mock stats & profile
const INITIAL_PARTNER: PartnerProfile = {
  name: "Alvaro Restrepo",
  email: "alvaro.socio@movica.com",
  phone: "+57 314 888 9911",
  avatar: "👨‍✈️",
  vehicle: "Yamaha NMAX 155",
  plate: "KSM-92G",
  rating: 4.92,
  servicesCompleted: 342,
  status: 'disponible'
};

const INITIAL_EARNINGS: PartnerEarning[] = [
  {
    id: 'EARN-101',
    orderId: 'MOV-8812',
    type: 'mototaxi',
    clientName: 'Camila Rojas',
    amount: 5100, // 85% of 6000
    date: 'Hoy, 10:24 AM',
    pickup: 'Calle 5 # 10-20, El Prado',
    delivery: 'C.C. San Roque'
  },
  {
    id: 'EARN-102',
    type: 'domicilio',
    orderId: 'MOV-8809',
    clientName: 'Andrés Pardo',
    amount: 8500, // 85% of 10000
    date: 'Hoy, 08:15 AM',
    pickup: 'El Corral - Centro',
    delivery: 'Carrera 14 # 8-40'
  },
  {
    id: 'EARN-103',
    type: 'encomienda',
    orderId: 'MOV-8791',
    clientName: 'Diana Gómez',
    amount: 5950, // 85% of 7000
    date: 'Ayer, 05:40 PM',
    pickup: 'Terminal de Transportes',
    delivery: 'Calle 12 # 22-10'
  }
];

// Helper to get service badges & names
const getServiceInfo = (type: ServiceType) => {
  switch (type) {
    case 'mototaxi': return { name: 'Mototaxi', icon: '🛵', bg: 'bg-[#E6F7EC] text-[#0EA65C]' };
    case 'domicilio': return { name: 'Domicilio', icon: '🍔', bg: 'bg-[#FFF9E6] text-[#D9A300]' };
    case 'encomienda': return { name: 'Encomienda', icon: '📦', bg: 'bg-[#EBF3FF] text-[#0066FF]' };
    case 'compra': return { name: 'Compra de producto', icon: '🛒', bg: 'bg-[#F2EBF9] text-[#8000FF]' };
    case 'mandado': return { name: 'Mandado', icon: '📋', bg: 'bg-[#FFF2E6] text-[#FF8000]' };
  }
};

export default function PartnerPanel({ onBackToClient, clientOrders }: PartnerPanelProps) {
  const [partner, setPartner] = useState<PartnerProfile>(INITIAL_PARTNER);
  const [earnings, setEarnings] = useState<PartnerEarning[]>(INITIAL_EARNINGS);
  const [activeTab, setActiveTab] = useState<'inicio' | 'historial' | 'ganancias' | 'mensajes' | 'perfil'>('inicio');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Interactive request list simulator
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
  const [requestTimeLeft, setRequestTimeLeft] = useState<number>(0);
  const [activeTrip, setActiveTrip] = useState<any | null>(null);
  const [tripStage, setTripStage] = useState<'navegando' | 'esperando' | 'viajando'>('navegando');
  const [waitTimer, setWaitTimer] = useState<number>(0);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Cashout simulator state
  const [cashoutOpen, setCashoutOpen] = useState(false);
  const [cashoutPhone, setCashoutPhone] = useState(partner.phone.replace('+57 ', ''));
  const [cashoutBank, setCashoutBank] = useState('nequi');
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [cashoutSuccess, setCashoutSuccess] = useState(false);

  // Profile Edit fields
  const [editMode, setEditMode] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [formName, setFormName] = useState(partner.name);
  const [formPhone, setFormPhone] = useState(partner.phone);
  const [formVehicle, setFormVehicle] = useState(partner.vehicle);
  const [formPlate, setFormPlate] = useState(partner.plate);

  // Simulated auto-offers trigger
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (partner.status === 'disponible' && !incomingRequest && !activeTrip) {
      // Trigger a new request simulation every 18 seconds
      interval = setInterval(() => {
        const potentialClients = ['Marcela Ortíz', 'Juan Carlos Vega', 'Luis Miguel Soto', 'Clara Inés Restrepo'];
        const randomClient = potentialClients[Math.floor(Math.random() * potentialClients.length)];
        const serviceTypes: ServiceType[] = ['mototaxi', 'domicilio', 'encomienda', 'compra', 'mandado'];
        const randomType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        
        const detailsMap = {
          mototaxi: 'Viaje rápido por circunvalar',
          domicilio: 'Recoger pedido en Burgers & Co',
          encomienda: 'Enviar llaves de oficina',
          compra: 'Comprar 1 Canasta de Huevos en Super Mercadito',
          mandado: 'Firmar recibo de luz en oficina central'
        };

        const priceMap = {
          mototaxi: 6000,
          domicilio: 4000,
          encomienda: 5000,
          compra: 8000,
          mandado: 7000
        };

        const distance = (1.2 + Math.random() * 3).toFixed(1);
        const price = priceMap[randomType];
        const partnerEarnings = Math.round(price * 0.85);
        const etaMin = Math.floor(4 + Math.random() * 8);

        setIncomingRequest({
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          type: randomType,
          clientName: randomClient,
          details: detailsMap[randomType],
          pickup: 'Carrera 15 # 12-40, Parque Principal',
          delivery: 'Calle 8 # 25-12, Barrio Barahoja',
          distance: `${distance} km`,
          price: price,
          earnings: partnerEarnings,
          eta: `${etaMin} min`
        });
        setRequestTimeLeft(15);
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [partner.status, incomingRequest, activeTrip]);

  // Handle incoming request countdown
  useEffect(() => {
    if (incomingRequest && requestTimeLeft > 0) {
      const timer = setTimeout(() => setRequestTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (incomingRequest && requestTimeLeft === 0) {
      setIncomingRequest(null);
    }
  }, [incomingRequest, requestTimeLeft]);

  // Handle active waiting timer simulation
  useEffect(() => {
    let waitInterval: NodeJS.Timeout;
    if (activeTrip && tripStage === 'esperando') {
      waitInterval = setInterval(() => {
        setWaitTimer(prev => prev + 1);
      }, 1000);
    } else {
      setWaitTimer(0);
    }
    return () => clearInterval(waitInterval);
  }, [activeTrip, tripStage]);

  // Computed Stats
  const dailyTotal = earnings.reduce((acc, curr) => acc + curr.amount, 0);

  // Toggle Driver Status
  const handleToggleStatus = () => {
    setPartner(prev => ({
      ...prev,
      status: prev.status === 'disponible' ? 'no_disponible' : 'disponible'
    }));
    // Clear request if going offline
    if (partner.status === 'disponible') {
      setIncomingRequest(null);
    }
  };

  // Accept Service Offer
  const handleAcceptRequest = (req: any) => {
    setActiveTrip(req);
    setIncomingRequest(null);
    setTripStage('navegando');
    setActiveTab('inicio');
    // Pre-populate simulated customer chat messages
    setChatMessages([
      { id: 'm1', sender: 'client', text: `Hola Alvaro, ya pedí el servicio. ¿Vienes en camino?`, timestamp: 'Hace 1 min' }
    ]);
  };

  // Reject Service Offer
  const handleRejectRequest = () => {
    setIncomingRequest(null);
  };

  // Go to next stage of active trip
  const handleNextStage = () => {
    if (tripStage === 'navegando') {
      setTripStage('esperando');
      // Simulate chat message when driver arrives
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { id: `m-${Date.now()}`, sender: 'driver', text: '¡Ya me encuentro en el punto de encuentro!', timestamp: 'Ahora' },
          { id: `m-rep-${Date.now()}`, sender: 'client', text: '¡Listo! Salgo en un momento.', timestamp: 'Ahora' }
        ]);
      }, 800);
    } else if (tripStage === 'esperando') {
      setTripStage('viajando');
    } else if (tripStage === 'viajando') {
      // Trip completed successfully!
      const newEarning: PartnerEarning = {
        id: `EARN-${Date.now()}`,
        orderId: activeTrip.id,
        type: activeTrip.type,
        clientName: activeTrip.clientName,
        amount: activeTrip.earnings,
        date: 'Hoy, ' + new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }),
        pickup: activeTrip.pickup,
        delivery: activeTrip.delivery
      };

      setEarnings(prev => [newEarning, ...prev]);
      setPartner(prev => ({
        ...prev,
        servicesCompleted: prev.servicesCompleted + 1
      }));
      setActiveTrip(null);
      // Play a quick success animation or state
    }
  };

  // Send message in active chat simulator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      sender: 'driver',
      text: chatInput.trim(),
      timestamp: 'Ahora'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate auto client reply after 1.5s
    setTimeout(() => {
      const responses = [
        "Vale, entiendo. Te espero acá.",
        "Listo, gracias por avisar.",
        "Perfecto Alvaro, con cuidado.",
        "¡Excelente, dale!"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [
        ...prev,
        { id: `m-auto-${Date.now()}`, sender: 'client', text: randomReply, timestamp: 'Ahora' }
      ]);
    }, 1500);
  };

  // Trigger Cashout action
  const handleCashoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(cashoutAmount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > dailyTotal) {
      alert("Monto inválido o excede el saldo disponible.");
      return;
    }

    setCashoutSuccess(true);
    setTimeout(() => {
      // Deduct from current earnings by creating a negative earning item to simulate cashout
      const deductItem: PartnerEarning = {
        id: `DEDUCT-${Date.now()}`,
        orderId: 'RETIRO',
        type: 'mototaxi',
        clientName: `Retiro a ${cashoutBank.toUpperCase()}`,
        amount: -amountNum,
        date: 'Hoy, ' + new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }),
        pickup: `Cuenta: ${cashoutPhone}`,
        delivery: 'Completado con éxito'
      };

      setEarnings(prev => [deductItem, ...prev]);
      setCashoutOpen(false);
      setCashoutSuccess(false);
      setCashoutAmount('');
    }, 180000); // 3 seconds timeout for clean UX
  };

  // Save profile edit changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPartner(prev => ({
      ...prev,
      name: formName,
      phone: formPhone,
      vehicle: formVehicle,
      plate: formPlate
    }));
    setEditMode(false);
  };

  // Quick message presets helper
  const sendPresetMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `m-preset-${Date.now()}`,
      sender: 'driver',
      text: text,
      timestamp: 'Ahora'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: `m-auto-pres-${Date.now()}`, sender: 'client', text: 'Excelente, dale, te espero.', timestamp: 'Ahora' }
      ]);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col relative text-ink">
      
      {/* HEADER SECTION FOR ALL VIEWS EXCEPT ACTIVE TRIP DETAIL MAP */}
      {(!activeTrip || activeTab !== 'inicio') && (
        <div className="flex items-center justify-between pb-4 border-b border-divider/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-sora font-extrabold text-lg shadow-md">
              {partner.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-sora font-extrabold text-sm text-ink leading-none">{partner.name}</h2>
                <div className="flex items-center text-xs text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                  <Star size={10} className="fill-current text-accent" />
                  <span className="text-[10px] ml-0.5">{partner.rating}</span>
                </div>
              </div>
              <p className="text-[10px] text-ink-soft font-bold tracking-tight uppercase mt-0.5">Socio Conductor Movica</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className="w-8.5 h-8.5 rounded-full bg-surface-alt hover:bg-divider flex items-center justify-center text-ink cursor-pointer active:scale-95 transition-all relative"
              title="Notificaciones"
            >
              <Bell size={15} className="text-ink-soft" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent border-2 border-white"></div>
            </button>

            {/* Quick Available/Offline Toggle */}
            <button 
              onClick={handleToggleStatus}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                partner.status === 'disponible' 
                  ? 'bg-primary-surface text-primary border border-primary/20 shadow-sm' 
                  : 'bg-surface-alt text-ink-soft border border-divider'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${partner.status === 'disponible' ? 'bg-primary animate-pulse' : 'bg-ink-faint'}`} />
              {partner.status === 'disponible' ? 'Disponible' : 'Desconectado'}
            </button>
          </div>
        </div>
      )}

      {/* VIEW AREA */}
      <div className="flex-1 pb-24 overflow-y-auto content-scrollbar">
        {activeTab === 'inicio' && (
          <div className="space-y-5">
            {/* ACTIVE TRIP FULL VIEW OR LANDING STATS */}
            {activeTrip ? (
              <div className="space-y-4">
                {/* Simulated navigation header */}
                <div className="bg-gradient-to-r from-[#0d1a16] to-[#152e25] p-4.5 rounded-3xl text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-wider">
                    Viaje en Curso
                  </div>
                  <p className="text-[10.5px] text-primary font-extrabold uppercase tracking-wider">
                    Estado: {tripStage === 'navegando' ? '🛵 En camino.' : tripStage === 'esperando' ? '📍 Llegó al origen' : '🏁 En servicio'}
                  </p>
                  <h3 className="font-sora font-extrabold text-[15px] mt-1 flex items-center gap-1.5">
                    {tripStage === 'navegando' ? 'Recoger a Cliente' : tripStage === 'esperando' ? 'Esperando abordaje' : 'Llevar a Destino'}
                  </h3>

                  {/* Active navigation map box representation */}
                  <div className="mt-3.5 bg-white/10 p-3 rounded-2xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">
                        {tripStage === 'viajando' ? '🏁' : '📍'}
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Dirección Actual</p>
                        <p className="text-xs font-semibold truncate max-w-[180px]">
                          {tripStage === 'viajando' ? activeTrip.delivery : activeTrip.pickup}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-primary">{activeTrip.distance}</p>
                      <p className="text-[9px] text-white/60">Restante</p>
                    </div>
                  </div>
                </div>

                {/* Simulated mini Map box layout */}
                <div className="h-[140px] rounded-3xl bg-[#E6ECE8] relative overflow-hidden border border-divider/50 flex flex-col justify-end p-3.5">
                  {/* Map representation vectors */}
                  <div className="absolute inset-0 bg-cover opacity-80" style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-73.62%2C8.31%5D%7D%7D)/-73.62,8.31,14,0/375x140?access_token=mock')` }}>
                    {/* SVG map visual lines mock */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M-10,40 L100,60 L200,30 L390,90" fill="none" stroke="#D3DDD7" strokeWidth="8" />
                      <path d="M50,-10 L100,60 L140,160" fill="none" stroke="#D3DDD7" strokeWidth="8" />
                      {/* Active path highlighted */}
                      <path d="M100,60 L200,30 L300,70" fill="none" stroke="#0EA65C" strokeWidth="5" strokeDasharray="5,5" className="animate-pulse" />
                      {/* Driver Motorcycle indicator icon marker */}
                      <g transform="translate(140, 42)">
                        <circle cx="0" cy="0" r="14" fill="#0EA65C" className="animate-ping opacity-35" />
                        <circle cx="0" cy="0" r="10" fill="#0EA65C" />
                        <text x="-5" y="4" fontSize="10" fill="white">🛵</text>
                      </g>
                      {/* Destination target */}
                      <g transform="translate(220, 25)">
                        <circle cx="0" cy="0" r="6" fill="#FFC629" />
                        <circle cx="0" cy="0" r="3" fill="#0D0D0D" />
                      </g>
                    </svg>
                  </div>

                  {/* Float HUD banner */}
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-xl py-1.5 px-3 flex items-center justify-between text-[11px] border border-divider font-semibold max-w-fit shadow-sm self-center">
                    <span className="flex items-center gap-1.5 text-primary">
                      <Clock size={12} />
                      {tripStage === 'navegando' ? '6 min al origen' : tripStage === 'esperando' ? 'Esperando al cliente' : '10 min al destino'}
                    </span>
                    {tripStage === 'esperando' && (
                      <span className="ml-2 text-ink-soft bg-surface-alt px-1.5 py-0.5 rounded-md font-mono">
                        {Math.floor(waitTimer / 60)}:{(waitTimer % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trip Client Panel card */}
                <div className="bg-white border border-divider/60 rounded-3xl p-4.5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-xl">
                        👩
                      </div>
                      <div>
                        <h4 className="font-sora font-bold text-sm">{activeTrip.clientName}</h4>
                        <p className="text-[10px] text-ink-soft">Cliente Premium • En Movica desde 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <a href={`tel:${partner.phone}`} className="w-9 h-9 rounded-xl bg-surface-alt hover:bg-divider flex items-center justify-center text-ink-soft transition-colors">
                        <Phone size={14} />
                      </a>
                      <button 
                        onClick={() => setActiveTab('mensajes')}
                        className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center transition-colors relative"
                      >
                        <MessageSquare size={14} />
                        {chatMessages.length > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-[9px] font-extrabold text-ink flex items-center justify-center">
                            {chatMessages.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment details */}
                  <div className="bg-surface-alt/50 p-3 rounded-2xl flex items-center justify-between border border-divider/20 text-xs">
                    <div>
                      <span className="text-ink-soft block text-[10px]">Método de Pago</span>
                      <span className="font-bold">Efectivo / Transferencia</span>
                    </div>
                    <div className="text-right">
                      <span className="text-ink-soft block text-[10px]">Tu Ganancia (85%)</span>
                      <span className="font-bold text-primary text-sm">${activeTrip.earnings.toLocaleString('es-CO')} COP</span>
                    </div>
                  </div>

                  {/* Preset Quick Actions for driver safety */}
                  {tripStage === 'navegando' && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      <button 
                        onClick={() => sendPresetMessage("¡Hola! Voy en camino, estimado socio.")}
                        className="text-[10px] bg-surface-alt hover:bg-divider font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap text-ink-soft transition-colors"
                      >
                        👍 Voy en camino
                      </button>
                      <button 
                        onClick={() => sendPresetMessage("Tengo un leve tráfico, llego en 5m.")}
                        className="text-[10px] bg-surface-alt hover:bg-divider font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap text-ink-soft transition-colors"
                      >
                        🚦 Tráfico leve
                      </button>
                    </div>
                  )}

                  {/* Dynamic Action Buttons for current trip state */}
                  <div>
                    {tripStage === 'navegando' && (
                      <button
                        onClick={handleNextStage}
                        className="w-full bg-[#0EA65C] hover:bg-[#087A43] text-white font-sora py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-[#0EA65C]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        Llegué al punto de recogida <CheckCircle size={14} />
                      </button>
                    )}
                    {tripStage === 'esperando' && (
                      <button
                        onClick={handleNextStage}
                        className="w-full bg-[#FFC629] hover:bg-[#E5B120] text-[#0D0D0D] font-sora py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-[#FFC629]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        Iniciar servicio <Play size={14} className="fill-current" />
                      </button>
                    )}
                    {tripStage === 'viajando' && (
                      <button
                        onClick={handleNextStage}
                        className="w-full bg-[#0EA65C] hover:bg-[#087A43] text-white font-sora py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-[#0EA65C]/10 transition-all flex items-center justify-center gap-1.5 animate-pulse cursor-pointer active:scale-95"
                      >
                        Finalizar servicio <CheckCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // STANDING BY: SHIFT SUMMARY CARDS
              <div className="space-y-4">
                
                {/* Active Service Status Indicator bar con Interruptor Grande */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider">Estado de Conexión</span>
                    <span className="text-[9px] font-bold text-primary bg-primary-surface px-2 py-0.5 rounded-full uppercase tracking-wider">Radar Activo</span>
                  </div>
                  
                  <button 
                    onClick={handleToggleStatus}
                    className={`w-full py-4 px-5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none active:scale-95 shadow-xs ${
                      partner.status === 'disponible' 
                        ? 'bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/35' 
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    <span className="font-sora font-extrabold text-xs flex items-center gap-1.5">
                      {partner.status === 'disponible' ? '🟢 Disponible para recibir servicios' : '🔴 Fuera de servicio'}
                    </span>
                    {/* Big Switch indicator */}
                    <div className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                      partner.status === 'disponible' ? 'bg-[#0EA65C]' : 'bg-red-400'
                    } flex items-center relative`}>
                      <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        partner.status === 'disponible' ? 'translate-x-4.5' : 'translate-x-0'
                      }`} />
                    </div>
                  </button>
                  
                  {partner.status === 'disponible' ? (
                    <div className="bg-primary-surface/10 border border-primary/20 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                        Esperando nuevas solicitudes...
                      </span>
                      <span className="text-[9px] text-ink-soft font-bold font-mono uppercase">En Línea</span>
                    </div>
                  ) : (
                    <div className="bg-surface-alt border border-divider/40 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-soft flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-ink-faint" />
                        No recibirás solicitudes mientras estés fuera de servicio.
                      </span>
                    </div>
                  )}
                </div>

                {/* EARNINGS SUMMARY STATS CARD */}
                <div className="bg-gradient-to-br from-primary to-primary-dark p-5 rounded-3xl text-white shadow-xl space-y-4 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-white/80 font-bold tracking-wider uppercase">Mis ganancias de hoy</p>
                      <h3 className="font-sora font-extrabold text-2xl mt-1">${dailyTotal.toLocaleString('es-CO')} COP</h3>
                    </div>
                    <span className="bg-white/25 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={11} /> 100% Retirable
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/15">
                    <div>
                      <p className="text-[9px] text-white/70 font-semibold uppercase tracking-wider">Servicios Completados</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-black">{earnings.filter(e => e.amount > 0).length} viajes</span>
                        <span className="text-[9px] bg-primary-surface/25 text-white font-bold px-1.5 py-0.5 rounded-md">Hoy</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/70 font-semibold uppercase tracking-wider">Tiempo Conectado</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-black">4h 12m</span>
                        <span className="text-[9px] bg-primary-surface/25 text-white font-bold px-1.5 py-0.5 rounded-md">Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REJECT/ACCEPT BANNER NOTIFICATION (FLOATING POPUP ENGINE) */}
                <AnimatePresence>
                  {incomingRequest && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      className="bg-white border-2 border-[#0EA65C] rounded-3xl shadow-2xl p-5 space-y-4 relative z-50 overflow-hidden"
                    >
                      {/* Top status & Countdown timer */}
                      <div className="flex justify-between items-center">
                        <span className="bg-[#0EA65C]/10 text-[#0EA65C] border border-[#0EA65C]/20 font-sora font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          🚨 Nuevo servicio disponible
                        </span>
                        
                        {/* Countdown circle or label */}
                        <div className="flex items-center gap-1 text-[11px] font-black text-[#0EA65C] bg-[#E6F7EC] px-2.5 py-1 rounded-lg">
                          <Clock size={12} className="animate-spin" />
                          <span>Rechaza en {requestTimeLeft}s</span>
                        </div>
                      </div>

                      {/* Request Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface-alt border border-divider/40 text-2xl flex items-center justify-center flex-shrink-0">
                          {getServiceInfo(incomingRequest.type)?.icon}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">Tipo de Servicio</span>
                          <h4 className="font-sora font-extrabold text-sm text-ink">{getServiceInfo(incomingRequest.type)?.name}</h4>
                          <p className="text-[10px] text-ink-soft truncate font-semibold mt-0.5">Cliente: {incomingRequest.clientName}</p>
                        </div>
                      </div>

                      {/* Path Addresses Details */}
                      <div className="space-y-2 text-xs bg-surface-alt/75 p-3 rounded-2xl border border-divider/40 text-left">
                        <div className="flex gap-2">
                          <span className="text-primary font-bold">📍 Dirección de recogida:</span>
                          <p className="truncate text-ink-soft font-semibold">{incomingRequest.pickup}</p>
                        </div>
                        <div className="flex gap-2 border-t border-divider/40 pt-1.5">
                          <span className="text-amber-500 font-bold">📍 Dirección de entrega:</span>
                           <p className="truncate text-ink-soft font-semibold">{incomingRequest.delivery}</p>
                        </div>
                      </div>

                      {/* Price, distance and Driver earnings */}
                      <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs font-semibold">
                        <div className="bg-surface-alt/40 p-2 rounded-xl text-center border border-divider/10">
                          <span className="text-[9px] text-ink-soft block font-bold leading-none mb-1">📍 Distancia</span>
                          <span className="font-extrabold text-ink">{incomingRequest.distance}</span>
                        </div>
                        <div className="bg-[#E6F7EC] p-2 rounded-xl text-center border border-[#0EA65C]/15">
                          <span className="text-[9px] text-[#0EA65C] block font-black leading-none mb-1">💰 Ganancia</span>
                          <span className="font-black text-[#0EA65C]">${incomingRequest.earnings.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="bg-surface-alt/40 p-2 rounded-xl text-center border border-divider/10">
                          <span className="text-[9px] text-ink-soft block font-bold leading-none mb-1">🕒 Tiempo</span>
                          <span className="font-extrabold text-ink">{incomingRequest.eta || '8 min'}</span>
                        </div>
                      </div>

                      {/* Accept/Reject Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={handleRejectRequest}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-sora font-extrabold text-xs py-3 rounded-xl transition-all select-none cursor-pointer active:scale-95 text-center"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(incomingRequest)}
                          className="bg-[#0EA65C] hover:bg-[#087A43] text-white font-sora font-extrabold text-xs py-3 rounded-xl shadow-md shadow-[#0EA65C]/15 transition-all select-none cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                        >
                          Aceptar <ArrowRight size={13} />
                        </button>
                      </div>

                      {/* Countdown progress bar */}
                      <div className="absolute bottom-0 left-0 h-1.5 bg-[#0EA65C] transition-all duration-1000" style={{ width: `${(requestTimeLeft / 15) * 100}%` }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* HOW TO SECURE CUSTOMERS TIPS BAR */}
                <div className="bg-[#FAF2DF] border border-[#ECD9AF] p-4 rounded-2xl flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <h5 className="font-sora font-extrabold text-[11px] text-[#A67E28]">Consejo del Día: ¡Mejora tus calificaciones!</h5>
                    <p className="text-[10px] text-[#6E551B] mt-0.5 leading-relaxed">
                      Llevar un casco de repuesto siempre limpio y una buena actitud incrementa la probabilidad de propinas hasta en un 40% en Aguachica.
                    </p>
                  </div>
                </div>

                {/* SAFETY ADVICE */}
                <div className="bg-surface-alt p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield size={16} className="text-primary" />
                    <span className="text-xs font-semibold">Póliza de Seguro de Accidentes activa</span>
                  </div>
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Verificado</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORIAL VIEW */}
        {activeTab === 'historial' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-sora font-extrabold text-base text-ink">Historial de Servicios</h3>
              <p className="text-xs text-ink-soft mt-0.5">Consulta tus viajes completados y los ingresos de cada uno.</p>
            </div>

            {/* STATS OVERVIEW GRID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-divider/60 rounded-2xl p-3.5 shadow-sm">
                <span className="text-[10px] text-ink-soft block font-bold uppercase tracking-wider mb-1">Ganancias del Día</span>
                <span className="font-sora font-extrabold text-lg text-primary">${dailyTotal.toLocaleString('es-CO')}</span>
                <span className="text-[9px] text-[#0EA65C] font-semibold block mt-0.5">🟢 100% Retirable</span>
              </div>
              <div className="bg-white border border-divider/60 rounded-2xl p-3.5 shadow-sm">
                <span className="text-[10px] text-ink-soft block font-bold uppercase tracking-wider mb-1">Cantidad de Servicios</span>
                <span className="font-sora font-extrabold text-lg text-ink">
                  {earnings.filter(e => e.amount > 0).length} servicios
                </span>
                <span className="text-[9px] text-ink-soft font-semibold block mt-0.5">Completados hoy</span>
              </div>
              <div className="bg-white border border-divider/60 rounded-2xl p-3.5 shadow-sm col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-soft block font-bold uppercase tracking-wider">Calificación Promedio</span>
                  <span className="text-[9px] text-ink-soft font-semibold block">Basado en tus servicios de esta semana</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-sora font-black text-base text-amber-500 flex items-center gap-1">
                    ⭐ {partner.rating}
                  </span>
                  <span className="text-[8px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md font-bold uppercase mt-0.5">Excelente</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 pt-1">
              {earnings.map((e, idx) => {
                const info = getServiceInfo(e.type);
                const isRetiro = e.orderId === 'RETIRO';
                return (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all ${isRetiro ? 'bg-amber-500/5 border-amber-500/10' : 'bg-white border-divider/60 shadow-sm'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{isRetiro ? '🏦' : info?.icon}</span>
                        <div>
                          <h4 className="font-sora font-bold text-xs">{isRetiro ? 'Retiro Exitoso Nequi' : info?.name}</h4>
                          <p className="text-[10px] text-ink-soft mt-0.5">
                            {isRetiro ? `A la cuenta: ${e.pickup}` : `${e.clientName} • ID: ${e.orderId}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-extrabold ${e.amount < 0 ? 'text-red-500' : 'text-primary'}`}>
                        {e.amount < 0 ? '-' : '+'}${Math.abs(e.amount).toLocaleString('es-CO')}
                      </span>
                    </div>

                    {!isRetiro && (
                      <div className="mt-3 pt-2.5 border-t border-divider/50 grid grid-cols-2 gap-2 text-[10px] text-ink-soft">
                        <div className="truncate">
                          <span className="font-bold text-primary mr-0.5">A:</span> {e.pickup}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-accent mr-0.5">B:</span> {e.delivery}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[9px] text-ink-faint mt-2.5">
                      <span>{e.date}</span>
                      <span className="font-bold uppercase tracking-wider text-primary">Completado</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GANANCIAS & ANALYTICS VIEW */}
        {activeTab === 'ganancias' && (
          <PartnerWallet />
        )}

        {/* MESSAGES WITH CLIENT / SUPPORT VIEW */}
        {activeTab === 'mensajes' && (
          <div className="h-full flex flex-col space-y-4">
            <h3 className="font-sora font-extrabold text-base text-ink">Mensajes Activos</h3>
            <p className="text-xs text-ink-soft mt-0.5">Chatea de forma directa con tu cliente del servicio activo.</p>

            {activeTrip ? (
              <div className="flex-1 bg-surface-alt/40 border border-divider/50 rounded-3xl p-4 flex flex-col h-[280px]">
                {/* Scrollable messages container */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-3 pr-1 content-scrollbar">
                  {chatMessages.map(msg => {
                    const isDriver = msg.sender === 'driver';
                    return (
                      <div key={msg.id} className={`flex ${isDriver ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isDriver ? 'bg-primary text-white font-medium rounded-tr-none' : 'bg-white text-ink border border-divider/40 rounded-tl-none'
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`text-[8px] block mt-1.5 text-right ${isDriver ? 'text-white/70' : 'text-ink-faint'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Keyboard Quick action replies inside chat */}
                <div className="flex gap-1.5 pb-2.5 overflow-x-auto">
                  <button 
                    onClick={() => sendPresetMessage("¡Hola! Ya llegué al sitio de encuentro.")}
                    className="text-[9px] bg-white hover:bg-surface-alt font-bold px-2.5 py-1 rounded-lg border border-divider/40 text-ink-soft whitespace-nowrap"
                  >
                    📍 Ya llegué
                  </button>
                  <button 
                    onClick={() => sendPresetMessage("¿Podrías indicarme mejor el punto?")}
                    className="text-[9px] bg-white hover:bg-surface-alt font-bold px-2.5 py-1 rounded-lg border border-divider/40 text-ink-soft whitespace-nowrap"
                  >
                    ❓ Detalle ubicación
                  </button>
                </div>

                {/* Input Text box form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-white border border-divider/60 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-all"
                  >
                    <Send size={14} className="fill-current text-white" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-divider/60 rounded-3xl p-6 text-center space-y-3 shadow-sm">
                <div className="w-14 h-14 bg-surface-alt text-ink-faint flex items-center justify-center text-2xl rounded-2xl mx-auto">
                  💬
                </div>
                <div>
                  <h4 className="font-sora font-bold text-sm text-ink">No tienes chats activos</h4>
                  <p className="text-xs text-ink-soft mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Al aceptar una solicitud de servicio se habilitará el canal de chat seguro con tu cliente.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'perfil' && (
          <div className="space-y-5">
            <h3 className="font-sora font-extrabold text-base text-ink">Mi Perfil de Aliado</h3>

            {editMode ? (
              <form onSubmit={handleSaveProfile} className="bg-white border border-divider/60 rounded-3xl p-4.5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1">Celular de Contacto</label>
                  <input 
                    type="text" 
                    required
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1">Motocicleta y Modelo</label>
                  <input 
                    type="text" 
                    required
                    value={formVehicle}
                    onChange={e => setFormVehicle(e.target.value)}
                    className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1">Placa Vehicular</label>
                  <input 
                    type="text" 
                    required
                    value={formPlate}
                    onChange={e => setFormPlate(e.target.value)}
                    className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 bg-surface-alt hover:bg-divider text-ink-soft font-sora font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-sora font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Static Profile Display */}
                <div className="bg-white border border-divider/60 rounded-3xl p-5 space-y-4 shadow-sm text-center relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl mx-auto shadow-md">
                    {partner.avatar}
                  </div>

                  <div>
                    <h4 className="font-sora font-extrabold text-base">{partner.name}</h4>
                    <p className="text-xs text-ink-soft mt-0.5">{partner.email}</p>
                    <p className="text-xs text-primary font-bold mt-1">{partner.phone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-divider/50 text-left">
                    <div className="text-xs">
                      <span className="text-ink-soft text-[10px] block">Vehículo</span>
                      <span className="font-bold">{partner.vehicle}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-ink-soft text-[10px] block">Placa</span>
                      <span className="font-bold bg-accent/20 text-ink px-2 py-0.5 rounded-md text-[11px] inline-block font-mono">
                        {partner.plate}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setEditMode(true)}
                    className="w-full bg-surface-alt hover:bg-divider text-ink font-sora font-bold text-xs py-3 rounded-2xl transition-all mt-2 cursor-pointer"
                  >
                    Editar Información Vehículo
                  </button>
                </div>

                {/* LOGROS, RACHAS Y METAS (Módulo 25) */}
                <div className="space-y-4">
                  <AchievementsSystem mode="aliado" />
                </div>

                {/* VERIFICATION BADGES */}
                <div className="bg-white border border-divider/60 rounded-3xl p-4 space-y-3.5 shadow-sm">
                  <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-ink-soft">Documentos Verificados</h4>
                  
                  <div className="space-y-2.5 text-xs font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-soft">Licencia de Conducir (A2)</span>
                      <span className="text-primary flex items-center gap-1 text-[10px] font-bold">
                        <CheckCircle size={12} /> Activa
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-divider/40 pt-2">
                      <span className="text-ink-soft">SOAT Vehicular</span>
                      <span className="text-primary flex items-center gap-1 text-[10px] font-bold">
                        <CheckCircle size={12} /> Vigente
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-divider/40 pt-2">
                      <span className="text-ink-soft">Antecedentes Penales</span>
                      <span className="text-primary flex items-center gap-1 text-[10px] font-bold">
                        <CheckCircle size={12} /> Limpio
                      </span>
                    </div>
                  </div>
                </div>

                {/* RATINGS & FEEDBACK MODULE (MODULO 15) */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-4 space-y-3.5 text-left shadow-sm">
                  <div className="flex justify-between items-center border-b border-divider/40 pb-2">
                    <h4 className="font-sora font-extrabold text-xs uppercase tracking-wider text-amber-700 flex items-center gap-1">
                      ⭐ Calificaciones y Opiniones (Socio)
                    </h4>
                    <span className="text-[10px] bg-amber-500/10 text-amber-700 font-extrabold px-2 py-0.5 rounded-full">
                      ★ {partner.rating} Promedio
                    </span>
                  </div>

                  <p className="text-[10.5px] text-ink-soft leading-relaxed">
                    Visualiza tus estadísticas de puntualidad, amabilidad, estado de la moto y facilidad para encontrar la ubicación, junto con las opiniones de tus clientes de Aguachica.
                  </p>

                  <div className="bg-white rounded-2xl border border-divider/30 p-2">
                    <RatingsSystem initialViewMode="partner" />
                  </div>
                </div>

                {/* LOG OUT FROM PARTNER MODE BUTTON */}
                <button
                  onClick={onBackToClient}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-sora font-extrabold text-xs py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-red-100/50"
                >
                  <LogOut size={14} /> Volver al Modo Cliente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION FOR PARTNER MODE */}
      <div className="absolute bottom-5 left-4 right-4 h-[68px] bg-white rounded-3xl shadow-[0_12px_28px_rgba(13,13,13,0.12)] border border-divider/40 flex items-center justify-around px-2 z-40">
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'historial', label: 'Historial', icon: '📜' },
          { id: 'ganancias', label: 'Ganancias', icon: '💰' },
          { id: 'mensajes', label: 'Mensajes', icon: '💬' },
          { id: 'perfil', label: 'Perfil', icon: '👤' }
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
              }}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl relative transition-all duration-150 cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="partnerNavGlow"
                  className="absolute inset-0 bg-[#E6F7EC] rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`text-[19px] transition-transform ${isActive ? 'scale-110 -translate-y-0.5 text-primary' : 'text-ink-faint'}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-primary' : 'text-ink-faint'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* CASHOUT MODAL POPUP */}
      <AnimatePresence>
        {cashoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0d0d0d]/40 backdrop-blur-sm z-50 flex items-end justify-center p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full rounded-t-3xl p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-divider/60 pb-3">
                <h4 className="font-sora font-extrabold text-sm text-ink">Retiro instantáneo a Nequi / Daviplata</h4>
                <button 
                  onClick={() => setCashoutOpen(false)}
                  className="text-ink-soft text-xs font-bold"
                >
                  Cerrar
                </button>
              </div>

              {cashoutSuccess ? (
                <div className="text-center py-6 space-y-3.5">
                  <div className="w-14 h-14 bg-primary-surface text-primary flex items-center justify-center text-2xl rounded-full mx-auto animate-bounce">
                    🎉
                  </div>
                  <div>
                    <h5 className="font-sora font-extrabold text-sm text-ink">¡Retiro en Procesamiento!</h5>
                    <p className="text-xs text-ink-soft mt-1 max-w-[240px] mx-auto leading-relaxed">
                      Hemos recibido tu solicitud por un monto de <span className="font-bold text-primary">${parseFloat(cashoutAmount).toLocaleString('es-CO')} COP</span>. Se abonará a tu cuenta en los próximos minutos.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCashoutSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1">Seleccionar Banco / Depósito</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => setCashoutBank('nequi')}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                          cashoutBank === 'nequi' 
                            ? 'bg-purple-500/5 border-purple-500 text-purple-700' 
                            : 'bg-white border-divider text-ink-soft'
                        }`}
                      >
                        💜 Nequi
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashoutBank('daviplata')}
                        className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                          cashoutBank === 'daviplata' 
                            ? 'bg-red-500/5 border-red-500 text-red-700' 
                            : 'bg-white border-divider text-ink-soft'
                        }`}
                      >
                        ❤️ Daviplata
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider mb-1">Número de Celular</label>
                    <input 
                      type="tel" 
                      required
                      value={cashoutPhone}
                      onChange={e => setCashoutPhone(e.target.value)}
                      placeholder="312 456 7890"
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-ink-soft uppercase tracking-wider">Monto a Retirar</label>
                      <span className="text-[10px] text-primary font-bold">Máx: ${dailyTotal.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-surface-alt border-0 text-xs font-semibold rounded-xl px-3 flex items-center justify-center text-ink-soft">
                        $
                      </span>
                      <input 
                        type="number" 
                        required
                        max={dailyTotal}
                        value={cashoutAmount}
                        onChange={e => setCashoutAmount(e.target.value)}
                        placeholder="Ej: 5000"
                        className="w-full flex-1 bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-3.5 rounded-xl font-bold text-xs shadow-md shadow-primary/10 transition-all cursor-pointer flex items-center justify-center gap-1 mt-2"
                  >
                    Confirmar Retiro
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS OVERLAY */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-0 bg-white z-50 flex flex-col p-6 pt-12"
          >
            <NotificationCenter 
              mode="aliado" 
              onClose={() => setShowNotifications(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING SECURITY BUTTON FOR DRIVER */}
      <div className="absolute bottom-24 right-4 z-40">
        <button
          onClick={() => setIsSecurityOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/35 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-bounce"
          title="Centro de Seguridad y SOS"
        >
          <Shield size={22} className="animate-pulse" />
        </button>
      </div>

      {/* SECURITY CENTER OVERLAY */}
      <AnimatePresence>
        {isSecurityOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            <SecurityCenter 
              userProfile={{
                name: partner.name,
                phone: partner.phone,
                email: partner.email
              }}
              onClose={() => setIsSecurityOpen(false)}
              mode="aliado"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
