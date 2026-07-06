import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Bike, Check, Plus, Minus, 
  ShoppingBag, Sparkles, Phone, User, Package, Clock, ShieldCheck,
  Navigation, Star, Send, PhoneCall, X, RefreshCw, AlertCircle, ChevronRight, MessageSquare
} from 'lucide-react';
import { ServiceType, Order, UserProfile, Favorite } from '../types';
import { DEMO_DRIVERS } from '../data';
import MapTrackingSimulator from './MapTrackingSimulator';

interface MototaxiFlowProps {
  onClose: () => void;
  onSubmit: (order: Order) => void;
  userProfile: UserProfile;
  favorites: Favorite[];
}

const AGUACHICA_SUGGESTIONS = [
  'Parque Principal Santander (Calle 5 # 11-20)',
  'Terminal de Transportes de Aguachica (Carrera 14 # 3-80)',
  'Hospital Regional José David Padilla Villafañe (Carrera 20 # 5-11)',
  'Universidad Popular del Cesar - UPC (Avenida Sabanita)',
  'Supermercado Olímpica (Calle 3 # 8-15)',
  'Parque San Roque (Carrera 11 # 4-50)',
  'Alcaldía Municipal de Aguachica (Calle 4 # 10-30)',
  'Plaza de Banderas (Calle 5 # 15-40)',
  'Estadio Francisco Ramos (Carrera 8 # 10-00)',
];

export default function MototaxiFlow({ onClose, onSubmit, userProfile, favorites }: MototaxiFlowProps) {
  // Current step 1 to 7
  const [step, setStep] = useState<number>(1);

  // Addresses
  const [pickup, setPickup] = useState(userProfile.addresses[0]?.address || '');
  const [destination, setDestination] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(AGUACHICA_SUGGESTIONS);

  // Simulated ride stats
  const [distance, setDistance] = useState(2.4);
  const [blocks, setBlocks] = useState(24);
  const [estTime, setEstTime] = useState(6);
  const [price, setPrice] = useState(4500);

  // Driver Assignment
  const [driver, setDriver] = useState<any>(DEMO_DRIVERS[0]);
  const [searchProgress, setSearchProgress] = useState(0);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: '¡Hola! Voy en camino a recogerte. ¿Alguna indicación especial?', time: 'Hace 1 min' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Call simulator state
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Map Animation simulation state
  const [mapProgress, setMapProgress] = useState(0);
  const [mapStatus, setMapStatus] = useState('Iniciando trayecto...');

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Suggestion filtering
  useEffect(() => {
    if (!destQuery) {
      setFilteredSuggestions(AGUACHICA_SUGGESTIONS);
    } else {
      setFilteredSuggestions(
        AGUACHICA_SUGGESTIONS.filter(item => 
          item.toLowerCase().includes(destQuery.toLowerCase())
        )
      );
    }
  }, [destQuery]);

  // Step 4 Auto-assign driver search simulation
  useEffect(() => {
    if (step === 4) {
      setSearchProgress(0);
      const interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Assign random driver
            const randomDriver = DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)] || DEMO_DRIVERS[0];
            setDriver(randomDriver);
            setTimeout(() => {
              setStep(5);
            }, 600);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Step 6 Map routing progress simulation
  useEffect(() => {
    if (step === 6) {
      setMapProgress(0);
      setMapStatus('Tu aliado Andrés ha llegado. ¡Comienza el recorrido!');
      
      const interval = setInterval(() => {
        setMapProgress(prev => {
          const nextVal = prev + 1;
          if (nextVal <= 30) {
            setMapStatus('Recorriendo la Calle 5 con Carrera 12...');
          } else if (nextVal <= 65) {
            setMapStatus('Avanzando fluidamente por la Carrera 14...');
          } else if (nextVal <= 90) {
            setMapStatus('Casi en el destino, disminuyendo velocidad...');
          } else if (nextVal >= 100) {
            clearInterval(interval);
            setMapStatus('¡Has llegado a tu destino!');
            setTimeout(() => {
              setStep(7);
            }, 1000);
            return 100;
          }
          return nextVal;
        });
      }, 100); // 10 seconds total journey
      return () => clearInterval(interval);
    }
  }, [step]);

  // Calling screen timer
  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  // Quick reply helper
  const sendQuickReply = (text: string) => {
    const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    setChatMessages(prev => [...prev, userMsg]);

    // Driver auto-replies based on content
    setTimeout(() => {
      let driverReply = '¡Entendido! Ya casi llego 🛵';
      if (text.includes('billete')) {
        driverReply = 'Excelente, yo llevo cambio para facilitarte el pago 💵';
      } else if (text.includes('puerta')) {
        driverReply = 'Perfecto, te busco justo enfrente de la puerta.';
      } else if (text.includes('espérame')) {
        driverReply = 'Tranquilo, no te preocupes. Te espero allí.';
      }
      setChatMessages(prev => [...prev, { sender: 'driver', text: driverReply, time: 'Ahora' }]);
    }, 1500);
  };

  const handleCustomSend = () => {
    if (!messageInput.trim()) return;
    const text = messageInput;
    setMessageInput('');
    sendQuickReply(text);
  };

  const calculateRideStats = (selectedDest: string) => {
    // Generate simulated coordinates/distance based on index
    const index = AGUACHICA_SUGGESTIONS.indexOf(selectedDest);
    const simulatedDist = index !== -1 ? (1.2 + index * 0.4) : 2.5;
    const simulatedBlocks = Math.round(simulatedDist * 10);
    const simulatedTime = Math.ceil(simulatedDist * 2.5);
    
    // Formula matching the custom admin config: Base $2500 + additional blocks
    const baseVal = 2500;
    const additionalBlocks = Math.max(0, simulatedBlocks - 10);
    const extraPrice = additionalBlocks * 100; // 100 pesos per extra block
    const calculatedPrice = baseVal + extraPrice;

    setDistance(parseFloat(simulatedDist.toFixed(1)));
    setBlocks(simulatedBlocks);
    setEstTime(simulatedTime);
    setPrice(calculatedPrice);
    setDestination(selectedDest);
    setStep(3);
  };

  // Submit flow finalizer
  const handleFinalSubmit = () => {
    const finalOrder: Order = {
      id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'mototaxi',
      title: 'Viaje en Mototaxi',
      details: `De ${pickup.split(',')[0]} a ${destination.split(',')[0]}`,
      price: price,
      status: 'completado',
      date: 'Hace un momento',
      driver: driver,
      pickupAddress: pickup,
      deliveryAddress: destination,
      instructions: `Calificación: ${rating} estrellas. Comentario: ${comment || 'Excelente viaje'}`
    };
    onSubmit(finalOrder);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* HEADER SECTION - Shared across non-fullscreen states */}
      {step !== 4 && !isCalling && (
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0 z-10">
          <button 
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onClose();
            }}
            className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer active:scale-90 transition-transform"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-center">
            <span className="font-sora font-extrabold text-sm text-ink block">Solicitar Mototaxi</span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">Paso {step} de 7</span>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto content-scrollbar relative pb-20 flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PICKUP SELECTION */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="text-center max-w-[280px] mx-auto">
                  <span className="text-3xl">📍</span>
                  <h3 className="font-sora font-extrabold text-base text-ink mt-2">¿Dónde te recogemos?</h3>
                  <p className="text-xs text-ink-soft mt-1">Ingresa tu dirección exacta en Aguachica para enviar el mototaxi.</p>
                </div>

                {/* Pickup Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Punto de Recogida</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={16} />
                    <input 
                      type="text"
                      value={pickup}
                      onChange={e => setPickup(e.target.value)}
                      placeholder="Dirección o punto de referencia..."
                      className="w-full bg-surface-alt border border-divider/60 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Quick Location Button */}
                <button
                  onClick={() => setPickup('📍 Calle 5 # 10-24, Parque Santander (Aguachica)')}
                  className="w-full bg-primary-surface/60 hover:bg-primary-surface border border-primary/20 text-primary-dark rounded-xl py-3 px-4 text-xs font-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation size={14} className="fill-current" /> Usar Ubicación Actual
                </button>

                {/* Favorite Locations */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Direcciones Guardadas</span>
                  <div className="space-y-2">
                    {favorites.map((fav, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPickup(fav.address)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-alt/50 hover:bg-surface-alt border border-divider/30 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{fav.icon}</span>
                          <div>
                            <span className="text-xs font-bold text-ink block">{fav.label}</span>
                            <span className="text-[10px] text-ink-soft block truncate max-w-[190px]">{fav.address}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-ink-faint" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Action Button */}
              <button
                disabled={!pickup.trim()}
                onClick={() => setStep(2)}
                className={`w-full py-3.5 rounded-xl font-sora font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 ${
                  pickup.trim() 
                    ? 'bg-primary hover:bg-primary-dark text-white active:scale-95' 
                    : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                }`}
              >
                Ingresar Destino <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: DESTINATION SELECTION */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              <div className="text-center max-w-[280px] mx-auto">
                <span className="text-3xl">🏁</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-2">¿A dónde vas?</h3>
                <p className="text-xs text-ink-soft mt-1">Busca o selecciona de la lista para calcular el costo de tu mototaxi.</p>
              </div>

              {/* Destination Search Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Destino Final</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <input 
                    type="text"
                    value={destQuery}
                    onChange={e => setDestQuery(e.target.value)}
                    placeholder="Escribe el destino en Aguachica..."
                    className="w-full bg-surface-alt border border-divider/60 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Suggestion list of places in Aguachica */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Sugerencias recomendadas</span>
                <div className="space-y-2 max-h-[280px] overflow-y-auto content-scrollbar pr-1">
                  {filteredSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => calculateRideStats(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-alt/40 hover:bg-primary-surface border border-divider/20 text-left transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm">
                        📍
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-ink block truncate">{item.split('(')[0]}</span>
                        <span className="text-[10px] text-ink-soft block truncate">{item}</span>
                      </div>
                      <ChevronRight size={14} className="text-ink-faint flex-shrink-0" />
                    </button>
                  ))}
                  {filteredSuggestions.length === 0 && (
                    <p className="text-center text-xs text-ink-soft py-4">No se encontraron sugerencias para tu búsqueda.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: JOURNEY SUMMARY */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <h3 className="font-sora font-extrabold text-base text-ink">Resumen del Viaje</h3>
                <p className="text-xs text-ink-soft mt-0.5">Confirma los detalles de tu mototaxi antes de solicitarla.</p>
              </div>

              {/* Route Path visual widget */}
              <div className="p-4 bg-surface-alt/50 rounded-2xl border border-divider/40 relative">
                
                {/* Visual line */}
                <div className="absolute left-[29px] top-9 bottom-9 w-0.5 border-l border-dashed border-divider"></div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-surface text-primary flex items-center justify-center text-xs font-bold z-10">
                    🟢
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Punto de Recogida</span>
                    <span className="text-xs font-extrabold text-ink leading-tight block mt-0.5">{pickup}</span>
                  </div>
                </div>

                <div className="h-4"></div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold z-10">
                    🏁
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Destino Final</span>
                    <span className="text-xs font-extrabold text-ink leading-tight block mt-0.5">{destination}</span>
                  </div>
                </div>
              </div>

              {/* Journey Specifications panel */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-surface-alt/40 border border-divider/30 rounded-xl text-center">
                  <span className="block text-lg">🛣️</span>
                  <span className="block text-xs font-black text-ink mt-1">{distance} km</span>
                  <span className="block text-[8px] text-ink-soft uppercase font-bold">Distancia</span>
                </div>
                <div className="p-3 bg-surface-alt/40 border border-divider/30 rounded-xl text-center">
                  <span className="block text-lg">🧱</span>
                  <span className="block text-xs font-black text-ink mt-1">{blocks} cuadras</span>
                  <span className="block text-[8px] text-ink-soft uppercase font-bold">Recorrido</span>
                </div>
                <div className="p-3 bg-surface-alt/40 border border-divider/30 rounded-xl text-center">
                  <span className="block text-lg">⏱️</span>
                  <span className="block text-xs font-black text-ink mt-1">{estTime} min</span>
                  <span className="block text-[8px] text-ink-soft uppercase font-bold">Tiempo</span>
                </div>
              </div>

              {/* Fare detail Card */}
              <div className="bg-primary-surface/40 border border-primary/20 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-surface text-primary rounded-xl">
                    <Bike size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-primary-dark font-black uppercase tracking-wider">Tarifa Oficial</span>
                    <h4 className="font-sora font-extrabold text-base text-ink leading-tight">Mototaxi Estándar</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sora font-black text-lg text-primary-dark block">${price.toLocaleString('es-CO')}</span>
                  <span className="text-[9px] text-ink-soft block font-medium">COP • Efectivo</span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 text-[10px] text-ink-soft bg-surface-alt px-3 py-2 rounded-xl border border-divider/30">
                <ShieldCheck size={14} className="text-primary flex-shrink-0" />
                <span>Viaje protegido. Todos los aliados están calificados y validados.</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setStep(4)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                🛵 Solicitar Mototaxi Movica
              </button>
            </motion.div>
          )}

          {/* STEP 4: SEARCHING SCREEN */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0d1a16] text-white flex flex-col justify-between p-8"
            >
              <div></div> {/* Top spacer */}

              {/* Pulsing Radar center */}
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  
                  {/* Concentric pulsing rings */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-primary/40 bg-primary/5"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-primary/30 bg-primary/5"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, delay: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5"
                  />

                  {/* Centered glowing icon */}
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl shadow-lg shadow-primary/30 z-10 relative">
                    🛵
                  </div>
                </div>

                <div className="space-y-2 max-w-[240px]">
                  <h3 className="font-sora font-extrabold text-base text-white">Buscando el aliado más cercano...</h3>
                  <p className="text-xs text-white/60">Asignando un mototaxista verificado con alta calificación en Aguachica.</p>
                </div>
              </div>

              {/* Search progress and manual skip for testing */}
              <div className="space-y-4">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                  <span>Búsqueda Activa</span>
                  <button 
                    onClick={() => setStep(5)}
                    className="hover:text-white underline cursor-pointer"
                  >
                    Saltar espera
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: DRIVER FOUND */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <span className="text-2xl">🎉</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-1">¡Aliado Encontrado!</h3>
                <p className="text-xs text-ink-soft mt-0.5">El conductor ya aceptó y se dirige a tu ubicación.</p>
              </div>

              {/* Detailed driver profile card */}
              <div className="bg-gradient-to-br from-[#0d1a16] to-[#122820] text-white p-4 rounded-3xl shadow-lg flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                      {driver?.avatar || '👨‍✈️'}
                    </div>
                    <div>
                      <h4 className="font-sora font-extrabold text-xs text-white leading-tight">{driver?.name || 'Andrés Mendoza'}</h4>
                      <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 mt-0.5">
                        ★ {driver?.rating || '4.92'} <span className="text-white/50 font-medium font-mono text-[9px]">(1.240 viajes)</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/25 border border-primary/20 rounded-xl px-2.5 py-1 text-center">
                    <span className="text-[8px] text-white/50 uppercase tracking-widest font-black block">Llegada</span>
                    <span className="text-xs text-primary font-black font-mono">2 min</span>
                  </div>
                </div>

                {/* Motorcycle details row */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3.5 text-[10px] font-semibold text-white/70">
                  <div>
                    <span className="block text-[8px] text-white/40 uppercase font-black">Vehículo</span>
                    <span className="text-white font-extrabold block truncate mt-0.5">{driver?.vehicle || 'Yamaha NMAX 155'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/40 uppercase font-black">Color</span>
                    <span className="text-white font-extrabold block mt-0.5">Verde Oficial</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-white/40 uppercase font-black">Placa Moto</span>
                    <span className="bg-primary text-[#0d1a16] px-1.5 py-0.5 rounded font-black font-mono inline-block mt-0.5">
                      {driver?.plate || 'ABC-123'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Mini-Chat simulator */}
              <div className="bg-surface-alt rounded-2xl border border-divider/50 p-3.5 space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-divider/50">
                  <span className="text-[10px] font-black uppercase text-ink-soft flex items-center gap-1">
                    <MessageSquare size={12} className="text-primary" /> Chat con tu Aliado
                  </span>
                  <span className="text-[9px] text-[#0EA65C] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Conectado
                  </span>
                </div>

                {/* Chat Message Scroll */}
                <div className="space-y-2.5 max-h-[140px] overflow-y-auto content-scrollbar pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`p-2.5 rounded-2xl text-xs font-semibold ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white text-ink border border-divider/30 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-ink-faint mt-0.5 font-bold">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Replies pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 content-scrollbar whitespace-nowrap">
                  {[
                    'Estoy en la puerta 🚪',
                    'Llevo billete de $20mil 💵',
                    'Espérame 2 min por favor 🏃‍♂️',
                  ].map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuickReply(pill)}
                      className="text-[10px] font-bold bg-white hover:bg-primary hover:text-white text-ink-soft px-3 py-1.5 rounded-full border border-divider/40 transition-all cursor-pointer inline-block"
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                {/* Send chat form */}
                <div className="flex gap-2 bg-white rounded-xl border border-divider/60 p-1">
                  <input 
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    onKeyDown={e => { if (e.key === 'Enter') handleCustomSend(); }}
                    className="flex-1 bg-transparent text-xs px-2.5 py-1.5 outline-none font-semibold"
                  />
                  <button 
                    onClick={handleCustomSend}
                    className="p-2 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-90 transition-transform"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>

              {/* Action Buttons row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsCalling(true);
                    setCallTimer(0);
                  }}
                  className="w-full bg-white hover:bg-surface-alt text-ink border border-divider rounded-xl py-3 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone size={14} className="text-[#0EA65C]" /> Llamar Conductor
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de que deseas cancelar este servicio?')) {
                      setStep(1);
                    }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-3 font-extrabold text-xs cursor-pointer text-center"
                >
                  Cancelar Servicio
                </button>
              </div>

              {/* Start Journey Simulator */}
              <button
                onClick={() => setStep(6)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                🚀 El aliado llegó • Iniciar Trayecto
              </button>
            </motion.div>
          )}

          {/* STEP 6: JOURNEY TRACKING */}
          {step === 6 && (
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="text-center mb-2">
                <h3 className="font-sora font-extrabold text-base text-ink">Seguimiento en Vivo de tu Viaje</h3>
                <p className="text-[11px] text-ink-soft mt-0.5">Monitorea la ubicación de tu socio conductor de Movica en tiempo real.</p>
              </div>

              <div className="flex-1 min-h-[360px] max-h-[460px] overflow-hidden flex flex-col justify-center">
                <MapTrackingSimulator initialState="in_progress" />
              </div>

              <button
                onClick={() => setStep(7)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                🏁 Completar Viaje y ver Recibo
              </button>
            </div>
          )}

          {/* STEP 7: JOURNEY COMPLETED */}
          {step === 7 && (
            <motion.div 
              key="step7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-6 space-y-5 flex flex-col justify-between flex-1"
            >
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-surface text-primary flex items-center justify-center text-3xl mx-auto shadow-inner border border-primary/20">
                  🏁
                </div>

                <div className="space-y-1">
                  <h3 className="font-sora font-extrabold text-base text-ink">¡Viaje Finalizado Seguro!</h3>
                  <p className="text-xs text-ink-soft">Gracias por viajar con Movica. Tu servicio se ha completado.</p>
                </div>

                {/* Receipt Details Box */}
                <div className="bg-surface-alt/70 border border-divider/40 rounded-2xl p-4 space-y-2 text-xs font-semibold text-ink-soft">
                  <div className="flex justify-between items-center">
                    <span>Valor del Servicio</span>
                    <span className="text-ink font-black">${price.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tiempo total del trayecto</span>
                    <span className="text-ink font-black">5 min 42 seg</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-divider/60 pt-2 text-sm font-bold text-ink">
                    <span>Método de Pago</span>
                    <span className="text-primary-dark">💵 Efectivo</span>
                  </div>
                </div>

                {/* Star rating picker widget */}
                <div className="space-y-2 pt-1.5">
                  <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Califica a tu Conductor</span>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(starNum => (
                      <button
                        key={starNum}
                        onClick={() => setRating(starNum)}
                        className="p-1 cursor-pointer transition-transform active:scale-90"
                      >
                        <Star 
                          size={24} 
                          className={`stroke-2 transition-all ${
                            starNum <= rating 
                              ? 'fill-amber-400 stroke-amber-400' 
                              : 'fill-transparent stroke-ink-faint'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase">
                    {rating === 5 ? '¡Excelente servicio!' :
                     rating === 4 ? 'Muy buen servicio' :
                     rating === 3 ? 'Servicio aceptable' : 'Hubo problemas'}
                  </span>
                </div>

                {/* Feedback comment field */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Agregar un comentario</label>
                  <textarea 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Escribe tu opinión de forma anónima..."
                    rows={2}
                    className="w-full bg-surface-alt border border-divider/60 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Complete and Return */}
              <button
                onClick={handleFinalSubmit}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                Finalizar y Volver al Inicio
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FULLSCREEN CALL SIMULATION DIALOG */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 bg-[#0d1a16] text-white z-[80] flex flex-col justify-between p-10 text-center"
          >
            <div></div> {/* spacer */}

            {/* Profile Avatar & Call metrics */}
            <div className="space-y-6">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl mx-auto shadow-lg border border-white/5 animate-pulse">
                {driver?.avatar || '👨‍✈️'}
              </div>
              <div className="space-y-1">
                <h3 className="font-sora font-extrabold text-lg text-white">{driver?.name || 'Andrés Mendoza'}</h3>
                <span className="text-xs text-primary font-bold block uppercase tracking-widest">En Llamada...</span>
              </div>
              <span className="text-sm font-mono text-white/60 font-medium">
                {Math.floor(callTimer / 60)}:{(callTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* End Call button */}
            <div className="space-y-4">
              <button
                onClick={() => setIsCalling(false)}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-lg active:scale-90 transition-transform cursor-pointer"
              >
                <X size={24} />
              </button>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Colgar Llamada</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
