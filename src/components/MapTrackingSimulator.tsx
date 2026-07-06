import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, MessageSquare, AlertTriangle, Share2, X, Navigation, 
  Star, Send, ShieldAlert, CheckCircle2, Play, Pause, RotateCcw, 
  User, Check, PhoneCall, Link, CheckCircle, Info, ExternalLink, Globe
} from 'lucide-react';
import { DEMO_DRIVERS } from '../data';
import ChatSystem from './ChatSystem';

// Definition of service tracking states
export type TrackingState = 
  | 'searching'      // 🔍 Buscando aliado
  | 'assigned'       // 🛵 Aliado asignado
  | 'en_route'       // 🚗 En camino al cliente
  | 'arrived'        // 📍 Llegó al punto de recogida
  | 'in_progress'    // 🟢 Servicio en curso
  | 'completed';     // 🏁 Servicio finalizado

interface MapTrackingSimulatorProps {
  onClose?: () => void;
  initialState?: TrackingState;
}

export default function MapTrackingSimulator({ onClose, initialState = 'searching' }: MapTrackingSimulatorProps) {
  // Tracking status states
  const [status, setStatus] = useState<TrackingState>(initialState);
  const [progress, setProgress] = useState(0); // 0 to 100% of current path
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // Speed modifier: 1x, 2x, 5x
  
  // Assigned Driver details (Simulated)
  const [driver, setDriver] = useState(DEMO_DRIVERS[0]);
  
  // Dynamic Distance & ETA indicators
  const [distanceRemaining, setDistanceRemaining] = useState(1.8); // in km
  const [etaRemaining, setEtaRemaining] = useState(5); // in minutes
  
  // Interface Modals & Overlays
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: '¡Hola! Recibí tu servicio. Ya voy en camino a recogerte.', time: 'Hace 1 min' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isDriverTyping, setIsDriverTyping] = useState(false);

  // Calling timer
  const [callTimer, setCallTimer] = useState(0);

  // Reference for chat end scrolling
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Coordinates on simulated SVG grid
  // Client is at (150, 160)
  // Origin for driver is (30, 40)
  // Destination is (280, 50)
  const clientPos = { x: 140, y: 150 };
  const destPos = { x: 280, y: 60 };
  const driverStartPos = { x: 40, y: 50 };

  // Track position of the driver icon dynamically on the screen
  const [driverPos, setDriverPos] = useState({ x: driverStartPos.x, y: driverStartPos.y });

  // Reset the simulation
  const handleReset = () => {
    setStatus('searching');
    setProgress(0);
    setDistanceRemaining(1.8);
    setEtaRemaining(5);
    setIsSimulating(true);
    setChatMessages([
      { sender: 'driver', text: '¡Hola! Recibí tu servicio. Ya voy en camino a recogerte.', time: 'Hace un momento' }
    ]);
  };

  // Chat scroll helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isDriverTyping]);

  // SOS Countdown handling
  useEffect(() => {
    let timer: any;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setTimeout(() => {
        setSosCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (sosCountdown === 0) {
      alert('🚨 ALERTA SOS ENVIADA: Central de Seguridad Movica y la Policía Nacional han recibido tus coordenadas en tiempo real.');
      setSosCountdown(null);
      setIsSOSOpen(false);
    }
    return () => clearTimeout(timer);
  }, [sosCountdown]);

  // Phone call timer
  useEffect(() => {
    let timer: any;
    if (isCalling) {
      timer = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Main Simulation State Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        // State 0: Searching for driver
        if (status === 'searching') {
          if (prev >= 100) {
            // Assign driver and move to assigned state
            const randomDriver = DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)] || DEMO_DRIVERS[0];
            setDriver(randomDriver);
            setStatus('assigned');
            return 0;
          }
          return prev + (10 * simSpeed);
        }

        // State 1: Assigned Driver
        if (status === 'assigned') {
          // Pause for short duration to announce assignment
          setTimeout(() => {
            setStatus('en_route');
          }, 2000);
          return 0;
        }

        // State 2: En Route to Client (Driver -> Client)
        if (status === 'en_route') {
          if (prev >= 100) {
            setStatus('arrived');
            // Insert driver arrival message
            setChatMessages(c => [...c, {
              sender: 'driver',
              text: 'He llegado a tu ubicación de recogida. Estoy afuera esperándote 🛵',
              time: 'Ahora'
            }]);
            return 0;
          }
          const nextVal = prev + (2.5 * simSpeed);
          // Calculate distance remaining (from 1.8km to 0km)
          const dist = 1.8 * (1 - nextVal / 100);
          setDistanceRemaining(parseFloat(Math.max(0.05, dist).toFixed(2)));
          // Calculate ETA remaining (from 5min to 0min)
          const eta = Math.ceil(5 * (1 - nextVal / 100));
          setEtaRemaining(Math.max(1, eta));

          // Interpolate driver position
          const x = driverStartPos.x + (clientPos.x - driverStartPos.x) * (nextVal / 100);
          const y = driverStartPos.y + (clientPos.y - driverStartPos.y) * (nextVal / 100);
          setDriverPos({ x, y });

          return nextVal;
        }

        // State 3: Arrived (Waiting at client)
        if (status === 'arrived') {
          setTimeout(() => {
            setStatus('in_progress');
          }, 3500);
          return 0;
        }

        // State 4: Service In Progress (Client -> Destination)
        if (status === 'in_progress') {
          if (prev >= 100) {
            setStatus('completed');
            setIsSimulating(false);
            return 100;
          }
          const nextVal = prev + (2 * simSpeed);
          // Calculate destination distance remaining (from 3.2km to 0km)
          const dist = 3.2 * (1 - nextVal / 100);
          setDistanceRemaining(parseFloat(Math.max(0, dist).toFixed(2)));
          // ETA (from 8min to 0min)
          const eta = Math.ceil(8 * (1 - nextVal / 100));
          setEtaRemaining(eta);

          // Interpolate position from client to destination
          const x = clientPos.x + (destPos.x - clientPos.x) * (nextVal / 100);
          const y = clientPos.y + (destPos.y - clientPos.y) * (nextVal / 100);
          setDriverPos({ x, y });

          return nextVal;
        }

        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [status, isSimulating, simSpeed]);

  // Handle Client Chat submissions with automated driver response
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    
    setChatMessages(prev => [...prev, { sender: 'user', text, time: 'Ahora' }]);
    
    // Auto-respond simulating driver typing
    setIsDriverTyping(true);
    setTimeout(() => {
      setIsDriverTyping(false);
      let reply = '¡Entendido! Voy manejando con cuidado, llego pronto.';
      if (text.toLowerCase().includes('lluvia') || text.toLowerCase().includes('lloviendo')) {
        reply = 'Sí, me puse impermeable pero voy con toda la precaución. No se preocupe.';
      } else if (text.toLowerCase().includes('sencillo') || text.toLowerCase().includes('cambio')) {
        reply = 'Listo, llevo cambio de billetes grandes para tu comodidad 💵';
      } else if (text.toLowerCase().includes('donde') || text.toLowerCase().includes('dónde')) {
        reply = 'Estoy a solo un par de cuadras de distancia, ya me puedes ver en el mapa.';
      }
      setChatMessages(prev => [...prev, { sender: 'driver', text: reply, time: 'Ahora' }]);
    }, 1500);
  };

  const handleCopyShareLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper formatting for seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-[580px] bg-white border border-divider/60 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-lg">
      
      {/* LEFT SECTION: MAP VIEWPORT (Occupies major area) */}
      <div className="relative flex-1 bg-[#E8E7DF] overflow-hidden flex flex-col justify-between">
        
        {/* MAP BACKGROUND HEADER STATUS BAR */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center gap-3">
          <div className="bg-[#0d1a16] text-white px-3.5 py-2 rounded-2xl shadow-lg border border-primary/20 flex items-center gap-2 max-w-[80%] md:max-w-md">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping flex-shrink-0" />
            <div className="text-left leading-none">
              <span className="text-[8px] font-black uppercase text-primary tracking-widest block">Rastreador Satelital</span>
              <span className="text-[11px] font-sora font-extrabold truncate block">
                {status === 'searching' && '🔍 Buscando el socio más cercano...'}
                {status === 'assigned' && `🛵 Asignando a ${driver.name}`}
                {status === 'en_route' && '🛵 Conductor en camino a recogerte'}
                {status === 'arrived' && '📍 Conductor en punto de recogida'}
                {status === 'in_progress' && '🟢 Viaje en curso a tu destino'}
                {status === 'completed' && '🏁 ¡Has llegado a tu destino!'}
              </span>
            </div>
          </div>

          <div className="flex gap-1.5">
            {/* Speed Multiplier controls for testing */}
            <button 
              type="button"
              onClick={() => setSimSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)}
              className="bg-white hover:bg-surface-alt border border-divider/80 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold text-ink shadow-md cursor-pointer transition-all"
              title="Acelerar Simulación"
            >
              ⚡ {simSpeed}x
            </button>
            
            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className="bg-white hover:bg-surface-alt border border-divider/80 w-8 h-8 rounded-xl flex items-center justify-center text-ink shadow-md cursor-pointer transition-all"
            >
              {isSimulating ? <Pause size={13} /> : <Play size={13} className="fill-current text-ink" />}
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="bg-white hover:bg-surface-alt border border-divider/80 w-8 h-8 rounded-xl flex items-center justify-center text-ink shadow-md cursor-pointer transition-all"
              title="Reiniciar Trayecto"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* SIMULATED MAP CANVAS (SVG streets map layout) */}
        <div className="absolute inset-0 w-full h-full">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#20382E_1px,transparent_1px)] [background-size:16px_16px]" />

          <svg className="w-full h-full stroke-white stroke-[4.5] fill-none opacity-50">
            {/* Aguachica Major simulated roads */}
            <path d="M 10 150 Q 80 150 140 150 T 290 150" /> {/* Calle 5 */}
            <path d="M 140 10 Q 140 100 140 280" /> {/* Carrera 14 */}
            <path d="M 40 50 L 140 150" strokeWidth="3" /> {/* Avenida Santander Route */}
            <path d="M 140 150 L 280 60" strokeWidth="3" /> {/* Carrera 11 diagonal to up-right */}
            
            {/* Additional cross streets for realistic texture */}
            <line x1="10" y1="50" x2="290" y2="50" strokeWidth="2.5" />
            <line x1="10" y1="240" x2="290" y2="240" strokeWidth="2.5" />
            <line x1="40" y1="10" x2="40" y2="280" strokeWidth="2.5" />
            <line x1="240" y1="10" x2="240" y2="280" strokeWidth="2.5" />
          </svg>

          {/* Labelings */}
          <span className="absolute top-[52%] left-[10%] text-[8px] text-black/30 font-black tracking-widest font-mono select-none">CALLE 5 (PRINCIPAL)</span>
          <span className="absolute top-[24%] left-[53%] text-[8px] text-black/30 font-black tracking-widest font-mono rotate-90 select-none">CARRERA 14</span>
          <span className="absolute bottom-16 left-6 text-[8px] text-[#0d1a16]/40 font-bold select-none font-mono">Simulación de Mapa • Aguachica</span>

          {/* ROUTE POLYLINE (Drawn dynamically) */}
          <svg className="absolute inset-0 w-full h-full fill-none">
            {/* Driver to Client Polyline */}
            {(status === 'assigned' || status === 'en_route' || status === 'arrived') && (
              <motion.path 
                d={`M ${driverStartPos.x} ${driverStartPos.y} L ${clientPos.x} ${clientPos.y}`} 
                stroke="#0EA65C" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                strokeDasharray="6 4"
                className="opacity-75"
              />
            )}
            
            {/* Client to Destination Polyline */}
            {(status === 'in_progress' || status === 'completed') && (
              <motion.path 
                d={`M ${clientPos.x} ${clientPos.y} L ${destPos.x} ${destPos.y}`} 
                stroke="#FFC629" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                strokeDasharray="6 4"
                className="opacity-80"
              />
            )}
          </svg>

          {/* MAP PINS & INTERACTIVE LOCATIONS */}
          
          {/* 1. Client / Pickup Point PIN (📍) */}
          <div 
            style={{ left: `${clientPos.x}px`, top: `${clientPos.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 text-center"
          >
            <div className="relative flex flex-col items-center">
              <span className="text-xl filter drop-shadow-md cursor-pointer animate-bounce">📍</span>
              <span className="bg-white/90 text-[8px] text-ink font-black px-1.5 py-0.5 rounded shadow border border-divider leading-none -mt-1 select-none">
                Recogida
              </span>
              <span className="absolute -inset-1.5 rounded-full bg-primary animate-ping opacity-15" />
            </div>
          </div>

          {/* 2. Destination PIN (🏁) */}
          <div 
            style={{ left: `${destPos.x}px`, top: `${destPos.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 text-center"
          >
            <div className="relative flex flex-col items-center">
              <span className="text-xl filter drop-shadow-md animate-pulse">🏁</span>
              <span className="bg-white/90 text-[8px] text-ink font-black px-1.5 py-0.5 rounded shadow border border-divider leading-none -mt-1 select-none">
                Destino
              </span>
            </div>
          </div>

          {/* 3. Moving Ally Motorbike Icon (🛵) */}
          {status !== 'searching' && (
            <motion.div 
              style={{ left: `${driverPos.x}px`, top: `${driverPos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              animate={{ scale: status === 'arrived' ? [1, 1.15, 1] : 1 }}
              transition={{ repeat: status === 'arrived' ? Infinity : 0, duration: 1.5 }}
            >
              <div className="relative w-9 h-9 rounded-full bg-[#0d1a16] text-white flex items-center justify-center text-sm shadow-xl border-2 border-primary">
                {driver.avatar}
                <span className="absolute -bottom-1 bg-primary text-[6.5px] font-black uppercase text-white px-1 rounded-full border border-[#0d1a16] scale-90">
                  {driver.plate.split('-')[0]}
                </span>
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-10" />
              </div>
            </motion.div>
          )}

          {/* Radar scan view when searching */}
          {status === 'searching' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 animate-ping" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/5 border border-primary/10 animate-ping delay-500" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-[#0d1a16] text-white font-black flex items-center justify-center shadow-lg border border-primary/20 text-sm">
                  🔍
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FUTURE DEVELOPMENT REFERENCE TAG */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-divider/75 p-2 rounded-2xl text-[9px] text-left text-ink-soft flex items-center gap-2 shadow-md leading-relaxed">
          <Info size={12} className="text-primary flex-shrink-0" />
          <span>
            <strong>Comentario de Integración:</strong> Aquí se montará el <code>&lt;Map&gt;</code> de <code>@vis.gl/react-google-maps</code> o <code>mapbox-gl</code> utilizando la API real y polilíneas de Routes API.
          </span>
        </div>

      </div>

      {/* RIGHT SECTION: DYNAMIC CONTROL PANEL & SERVICE INFO */}
      <div className="w-full md:w-[320px] bg-white border-t md:border-t-0 md:border-l border-divider/60 p-5 flex flex-col justify-between text-left space-y-4">
        
        {/* DRIVER AND SERVICE HEADER CARD */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-ink-soft uppercase tracking-wider block">Servicio en Curso</span>
            <span className="text-[9px] text-[#0EA65C] bg-[#E6F7EC] font-black uppercase px-2 py-0.5 rounded">
              {status === 'searching' ? 'Asignando' : 'Monitoreado ✓'}
            </span>
          </div>

          {/* Dynamic state card details */}
          <div className="bg-surface-alt/50 border border-divider/40 rounded-2xl p-4 space-y-3">
            
            {status === 'searching' ? (
              <div className="text-center py-2 space-y-2">
                <div className="flex justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                </div>
                <p className="text-[11px] text-ink font-semibold">Estamos buscando al mejor aliado disponible de la zona para tu servicio.</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0d1a16] to-[#122e23] flex items-center justify-center text-white font-sora font-black text-xl shadow-md flex-shrink-0">
                  {driver.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-extrabold text-xs text-ink truncate">{driver.name}</h4>
                  <p className="text-[9.5px] text-ink-soft mt-0.5 font-bold flex items-center gap-1">
                    <span className="bg-primary/15 text-primary-dark px-1.5 py-0.25 rounded font-black text-[8px]">
                      {driver.plate}
                    </span>
                    <span>• {driver.vehicle}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-0.5">
                    ★ {driver.rating}
                  </span>
                </div>
              </div>
            )}

            {/* Simulated Live status updates */}
            <div className="border-t border-divider/40 pt-3 flex justify-between gap-2 text-center">
              <div>
                <span className="text-[8px] text-ink-soft uppercase font-black block">Distancia</span>
                <span className="text-xs font-black text-ink">
                  {status === 'searching' ? '--' : `${distanceRemaining} km`}
                </span>
              </div>
              <div className="h-6 w-px bg-divider/40 align-middle" />
              <div>
                <span className="text-[8px] text-ink-soft uppercase font-black block">Llegada Est.</span>
                <span className="text-xs font-black text-primary">
                  {status === 'searching' ? '--' : `${etaRemaining} min`}
                </span>
              </div>
              <div className="h-6 w-px bg-divider/40 align-middle" />
              <div>
                <span className="text-[8px] text-ink-soft uppercase font-black block">Tarifa</span>
                <span className="text-xs font-black text-[#0EA65C]">$4.500</span>
              </div>
            </div>

          </div>

          {/* TIMELINE OF STEPS AND PROGRESS INDICATOR */}
          <div className="space-y-2">
            <span className="text-[9px] font-black text-ink-soft uppercase tracking-wider block">Estado del recorrido</span>
            
            <div className="space-y-1.5 relative pl-4.5 text-[11px] font-semibold text-ink">
              {/* Line divider for timeline */}
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-divider" />

              <div className="relative">
                <span className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  status === 'searching' ? 'bg-primary animate-pulse' : 'bg-primary'
                }`} />
                <span className={status === 'searching' ? 'text-primary font-black' : 'text-ink-soft'}>
                  🔍 Buscando aliado más cercano
                </span>
              </div>

              <div className="relative">
                <span className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  status === 'assigned' ? 'bg-primary animate-pulse' : status === 'searching' ? 'bg-divider' : 'bg-primary'
                }`} />
                <span className={status === 'assigned' ? 'text-primary font-black' : 'text-ink-soft'}>
                  🤝 Aliado asignado y listo
                </span>
              </div>

              <div className="relative">
                <span className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  status === 'en_route' ? 'bg-primary animate-pulse' : (status === 'searching' || status === 'assigned') ? 'bg-divider' : 'bg-primary'
                }`} />
                <span className={status === 'en_route' ? 'text-primary font-black' : 'text-ink-soft'}>
                  🛵 En camino al punto de recogida
                </span>
              </div>

              <div className="relative">
                <span className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  status === 'arrived' ? 'bg-primary animate-pulse' : (status === 'completed' || status === 'in_progress') ? 'bg-primary' : 'bg-divider'
                }`} />
                <span className={status === 'arrived' ? 'text-primary font-black' : 'text-ink-soft'}>
                  📍 Llegó al punto de recogida
                </span>
              </div>

              <div className="relative">
                <span className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  status === 'in_progress' ? 'bg-primary animate-pulse' : status === 'completed' ? 'bg-primary' : 'bg-divider'
                }`} />
                <span className={status === 'in_progress' ? 'text-primary font-black' : 'text-ink-soft'}>
                  🟢 Viaje en curso al destino
                </span>
              </div>

              <div className="relative">
                <span className={`absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  status === 'completed' ? 'bg-primary' : 'bg-divider'
                }`} />
                <span className={status === 'completed' ? 'text-[#0EA65C] font-black' : 'text-ink-soft'}>
                  🏁 Servicio finalizado con éxito
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM: INTERACTIVE ACTION BUTTONS */}
        <div className="space-y-2 pt-4 border-t border-divider/40">
          <span className="text-[9px] font-black text-ink-soft uppercase tracking-wider block">Acciones Rápidas del Servicio</span>
          
          <div className="grid grid-cols-2 gap-2">
            
            {/* Chat Trigger button */}
            <button
              type="button"
              disabled={status === 'searching'}
              onClick={() => setIsChatOpen(true)}
              className="py-2.5 rounded-xl border border-divider/70 text-ink bg-white hover:bg-surface-alt font-extrabold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <MessageSquare size={13} className="text-primary" />
              Chat Integrado
            </button>

            {/* Call Trigger button */}
            <button
              type="button"
              disabled={status === 'searching'}
              onClick={() => setIsCalling(true)}
              className="py-2.5 rounded-xl border border-divider/70 text-ink bg-white hover:bg-surface-alt font-extrabold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Phone size={13} className="text-[#0EA65C]" />
              Llamar Conductor
            </button>

            {/* Share Trigger button */}
            <button
              type="button"
              disabled={status === 'searching'}
              onClick={() => setIsShareOpen(true)}
              className="py-2.5 rounded-xl border border-divider/70 text-ink bg-white hover:bg-surface-alt font-extrabold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Share2 size={13} className="text-blue-500" />
              Compartir Viaje
            </button>

            {/* Cancel service button */}
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas cancelar este servicio? El aliado podría recibir una compensación.')) {
                  handleReset();
                }
              }}
              className="py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-extrabold text-[10.5px] text-center transition-colors cursor-pointer"
            >
              Cancelar Viaje
            </button>

          </div>

          {/* BIG RED SOS PANIC BUTTON */}
          <button
            type="button"
            onClick={() => {
              setIsSOSOpen(true);
              setSosCountdown(5);
            }}
            className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white py-3 rounded-2xl font-sora font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-200 transition-all cursor-pointer"
          >
            <ShieldAlert size={15} className="animate-pulse text-white" />
            🚨 BOTÓN DE PÁNICO SOS
          </button>
        </div>

      </div>

      {/* ================= MODALS & INTERACTIVE POPUPS ================= */}

      {/* 1. INTERACTIVE CHAT DRAWER */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 z-50 flex flex-col justify-end md:p-4"
          >
            <div className="bg-white rounded-t-[32px] md:rounded-[32px] w-full h-[90%] md:h-[580px] shadow-2xl flex flex-col overflow-hidden relative">
              {/* Close Floating Handle */}
              <div className="bg-white p-3 flex justify-between items-center border-b border-divider/40">
                <span className="text-[11px] font-sora font-extrabold text-ink-soft">Chat de Servicio Activo</span>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-black cursor-pointer flex items-center gap-1"
                >
                  <X size={13} /> Cerrar Chat
                </button>
              </div>

              {/* Embed our fully-featured multi-thread system */}
              <div className="flex-1 overflow-hidden">
                <ChatSystem />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SIMULATED PHONE CALL SCREEN */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0d1a16] z-50 flex flex-col justify-between p-8 text-white text-center"
          >
            {/* Header calling status */}
            <div className="space-y-1 mt-8">
              <span className="text-[10px] text-primary font-black uppercase tracking-widest block animate-pulse">Llamada en Curso Encriptada</span>
              <h3 className="font-sora font-extrabold text-lg">{driver.name}</h3>
              <span className="text-xs text-white/60 block">{driver.vehicle} • {driver.plate}</span>
            </div>

            {/* Profile circular visualizer */}
            <div className="my-auto flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-4xl shadow-2xl border border-white/20">
                  {driver.avatar}
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-25" />
              </div>
            </div>

            {/* Call timer & hangup button */}
            <div className="space-y-8 mb-8">
              <span className="text-xs font-mono font-bold tracking-widest text-white/75">{formatTime(callTimer)}</span>
              
              <div className="flex justify-center gap-6">
                {/* End call button */}
                <button
                  type="button"
                  onClick={() => setIsCalling(false)}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
                >
                  <X size={20} className="stroke-[3]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SOS PANIC SYSTEM OVERLAY */}
      <AnimatePresence>
        {isSOSOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-700 z-50 flex flex-col justify-between p-8 text-white text-center"
          >
            <div className="space-y-2 mt-8">
              <span className="text-sm font-black uppercase tracking-widest block bg-white/15 py-1.5 px-4 rounded-full border border-white/25 max-w-fit mx-auto">
                🚨 ALERTA CRÍTICA SOS
              </span>
              <h3 className="font-sora font-black text-xl">¿Estás en una situación de peligro?</h3>
              <p className="text-xs text-white/80 max-w-xs mx-auto">
                Estamos a punto de transmitir tu geolocalización satelital a las autoridades policiales de Aguachica y despachar auxilio de inmediato.
              </p>
            </div>

            {/* Countdown timer */}
            <div className="my-auto flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center border-4 border-white animate-pulse">
                <span className="font-sora font-black text-5xl">{sosCountdown}</span>
              </div>
              <span className="text-xs text-white/70 block mt-4 font-bold">Despachando auxilio en segundos...</span>
            </div>

            {/* Cancellation controls */}
            <div className="space-y-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  setSosCountdown(null);
                  setIsSOSOpen(false);
                }}
                className="w-full max-w-xs bg-white text-red-700 font-sora font-black text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg inline-block"
              >
                CANCELAR ALERTA SOS (Falsa Alarma)
              </button>
              
              <button
                type="button"
                onClick={() => setSosCountdown(0)}
                className="block text-[11px] font-bold text-white/60 hover:text-white underline mx-auto"
              >
                Transmitir alerta de inmediato
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SHARE SERVICE PROGRESS POPUP */}
      <AnimatePresence>
        {isShareOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary-surface text-primary flex items-center justify-center mx-auto text-xl">
                🔗
              </div>
              
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-sm text-ink">Compartir Estado del Viaje</h4>
                <p className="text-xs text-ink-soft">Envía este enlace cifrado a tus familiares o amigos para que te sigan en vivo.</p>
              </div>

              {/* Fake link block */}
              <div className="bg-surface-alt/70 border border-divider/60 rounded-xl p-3 flex justify-between items-center text-[11px] font-mono font-bold text-ink-soft">
                <span className="truncate">https://movica.com/track/srv-8291</span>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="bg-white hover:bg-surface-alt border border-divider p-1.5 rounded-lg text-primary transition-colors cursor-pointer"
                >
                  {copied ? <Check size={11} /> : <Link size={11} />}
                </button>
              </div>

              {copied && (
                <span className="text-[10px] text-[#0EA65C] font-black block">✓ ¡Enlace copiado en el portapapeles!</span>
              )}

              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Listo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
