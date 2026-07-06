import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Package, Check, Phone, User, Clock, 
  ShieldCheck, Star, Send, X, ChevronRight, MessageSquare, 
  Share2, Info, AlertCircle, Sparkles, Navigation
} from 'lucide-react';
import { Order, UserProfile, Favorite } from '../types';
import { DEMO_DRIVERS } from '../data';

interface EncomiendaFlowProps {
  onClose: () => void;
  onSubmit: (order: Order) => void;
  userProfile: UserProfile;
  favorites: Favorite[];
}

const AGUACHICA_DIRECTIONS = [
  'Calle 15 # 24-45, Barrio Centro',
  'Avenida Santander # 52-10, Edificio Colpatria',
  'Carrera 23 # 12-05, Barrio El Prado',
  'Calle 5 # 11-20, Frente al Parque Santander',
  'Carrera 14 # 3-80, Terminal de Transportes',
  'Carrera 20 # 5-11, Hospital Regional',
  'Avenida Sabanita # 10-50, Entrada UPC',
  'Calle 3 # 8-15, Supermercado Olímpica',
  'Carrera 11 # 4-50, Parque San Roque'
];

export default function EncomiendaFlow({ onClose, onSubmit, userProfile, favorites }: EncomiendaFlowProps) {
  // Current step: 1 (Form), 2 (Summary), 3 (Searching), 4 (Driver Assigned), 5 (Tracking), 6 (Completed)
  const [step, setStep] = useState<number>(1);

  // Form inputs
  const [pickup, setPickup] = useState(userProfile.addresses[0]?.address || '');
  const [delivery, setDelivery] = useState(userProfile.addresses[1]?.address || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [packageDesc, setPackageDesc] = useState('');
  const [observations, setObservations] = useState('');

  // Auto-calculated variables based on addresses
  const [distance, setDistance] = useState(3.1);
  const [estTime, setEstTime] = useState(9);
  const [price, setPrice] = useState(5500);

  // Driver Assignment and Search States
  const [driver, setDriver] = useState<any>(DEMO_DRIVERS[1] || DEMO_DRIVERS[0]);
  const [searchPhase, setSearchPhase] = useState(0); // 0: Searching, 1: Route calculating, 2: Assigning
  const [searchProgress, setSearchProgress] = useState(0);

  // Chat simulation state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: '¡Buen día! Ya tengo la información de la encomienda y voy saliendo por ella. 📦', time: 'Hace 1 min' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Call simulation
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Tracking details
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [trackingStatus, setTrackingStatus] = useState('Recogiendo el paquete...');
  const [shareToast, setShareToast] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Error validation flag
  const [formError, setFormError] = useState('');

  // Calculate simulated distances and price when step 1 is submitted
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !delivery.trim() || !recipientName.trim() || !recipientPhone.trim() || !packageDesc.trim()) {
      setFormError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setFormError('');

    // Generate random but realistic ride metrics
    const hash = (pickup.length + delivery.length + recipientName.length) % 5;
    const computedDistance = parseFloat((1.5 + hash * 0.8).toFixed(1));
    const computedTime = Math.ceil(computedDistance * 2.8);
    // Base price $3,500 + $1,000 per extra km
    const computedPrice = Math.max(4000, 3500 + Math.floor(computedDistance) * 1000);

    setDistance(computedDistance);
    setEstTime(computedTime);
    setPrice(computedPrice);
    setStep(2);
  };

  // Step 3 - Searching driver simulation logic
  useEffect(() => {
    if (step === 3) {
      setSearchProgress(0);
      setSearchPhase(0);

      const interval = setInterval(() => {
        setSearchProgress(prev => {
          const nextVal = prev + 4;
          if (nextVal >= 100) {
            clearInterval(interval);
            // Select random driver
            const chosenDriver = DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)] || DEMO_DRIVERS[0];
            setDriver(chosenDriver);
            setTimeout(() => {
              setStep(4);
            }, 500);
            return 100;
          }

          // Change text status at key milestones
          if (nextVal > 65) {
            setSearchPhase(2); // Assigning
          } else if (nextVal > 35) {
            setSearchPhase(1); // Route calculation
          }
          return nextVal;
        });
      }, 150); // around 3.75 seconds search

      return () => clearInterval(interval);
    }
  }, [step]);

  // Step 5 - Delivery track simulation logic
  useEffect(() => {
    if (step === 5) {
      setTrackingProgress(0);
      setTrackingStatus('Recogiendo la encomienda en el punto de partida...');
      
      const interval = setInterval(() => {
        setTrackingProgress(prev => {
          const nextVal = prev + 1;
          if (nextVal === 15) {
            setTrackingStatus('Paquete recolectado con éxito. En ruta de entrega...');
          } else if (nextVal === 45) {
            setTrackingStatus('Transitanto por la Carrera 14 de Aguachica...');
          } else if (nextVal === 75) {
            setTrackingStatus('El aliado está cerca al punto de entrega...');
          } else if (nextVal === 95) {
            setTrackingStatus('Aliado en el destino final. Entregando el paquete...');
          } else if (nextVal >= 100) {
            clearInterval(interval);
            setTrackingStatus('¡Encomienda entregada exitosamente!');
            setTimeout(() => {
              setStep(6);
            }, 1000);
            return 100;
          }
          return nextVal;
        });
      }, 150); // ~15 seconds track simulation

      return () => clearInterval(interval);
    }
  }, [step]);

  // Call simulation timer
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

  // Quick replies helper
  const sendQuickReply = (text: string) => {
    const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let driverReply = '¡Entendido! Lo tengo en cuenta. 👍';
      if (text.toLowerCase().includes('llamar')) {
        driverReply = 'Perfecto, te marco al celular apenas esté llegando al sitio.';
      } else if (text.toLowerCase().includes('timbrar')) {
        driverReply = 'Listo, timbraré fuerte o avisaré por este medio.';
      } else if (text.toLowerCase().includes('delicado')) {
        driverReply = 'No te preocupes, acomodaré la encomienda con total cuidado y seguridad.';
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

  const handleShareTracking = () => {
    setShareToast(true);
    // Write link to clipboard
    navigator.clipboard.writeText(`https://movica.co/tracking/envio-${Math.floor(100000 + Math.random() * 900000)}`);
    setTimeout(() => {
      setShareToast(false);
    }, 2500);
  };

  const handleFinalSubmit = () => {
    const finalOrder: Order = {
      id: `ENV-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'encomienda',
      title: 'Envío de Encomienda',
      details: `De ${pickup.split(',')[0]} para ${recipientName} (${delivery.split(',')[0]})`,
      price: price,
      status: 'completado',
      date: 'Hace un momento',
      driver: driver,
      pickupAddress: pickup,
      deliveryAddress: delivery,
      instructions: `Recibe: ${recipientName} (${recipientPhone}). Paquete: ${packageDesc}. Calificación: ${rating} ★. Comentario: ${comment || 'Perfecta entrega'}`
    };
    onSubmit(finalOrder);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* HEADER SECTION */}
      {step !== 3 && !isCalling && (
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0 z-10">
          <button 
            onClick={() => {
              if (step > 1) {
                if (step === 4) setStep(2); // Go back from driver assigned to summary
                else setStep(step - 1);
              }
              else onClose();
            }}
            className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer active:scale-90 transition-transform"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-center">
            <span className="font-sora font-extrabold text-sm text-ink block">Enviar Encomienda</span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">
              {step === 1 ? '1. Datos de Envío' : 
               step === 2 ? '2. Resumen' : 
               step === 4 ? '4. Aliado Asignado' : 
               step === 5 ? '5. Seguimiento' : 
               step === 6 ? '6. Entrega Completa' : 'Procesando'}
            </span>
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
      <div className="flex-1 overflow-y-auto content-scrollbar relative pb-16 flex flex-col">
        <AnimatePresence mode="wait">

          {/* STEP 1: SHIPPING INFORMATION FORM */}
          {step === 1 && (
            <motion.form 
              key="step1"
              onSubmit={handleStep1Submit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4 flex-1 flex flex-col"
            >
              <div className="text-center max-w-[320px] mx-auto mb-1">
                <span className="text-3xl">📦</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-2">Enviar una Encomienda</h3>
                <p className="text-xs text-ink-soft mt-1">
                  Mapea tu entrega segura en Aguachica. Un aliado de Movica recogerá y llevará el paquete al instante.
                </p>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-3.5">
                
                {/* Pickup Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">📍 Punto de Recogida *</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={pickup}
                      onChange={e => { setPickup(e.target.value); setFormError(''); }}
                      placeholder="Dirección donde se recoge el paquete..."
                      className="w-full bg-surface-alt border border-divider/60 rounded-xl pl-4 pr-10 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPickup('Calle 15 # 24-45, Barrio Centro')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-bold hover:underline"
                    >
                      Casa
                    </button>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">🏁 Punto de Entrega (Destino) *</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={delivery}
                      onChange={e => { setDelivery(e.target.value); setFormError(''); }}
                      placeholder="Dirección de entrega de la encomienda..."
                      className="w-full bg-surface-alt border border-divider/60 rounded-xl pl-4 pr-10 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setDelivery('Avenida Santander # 52-10, Edificio Colpatria')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-accent text-xs font-bold hover:underline"
                    >
                      Trabajo
                    </button>
                  </div>
                </div>

                {/* Recipient details group */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">👤 ¿Quién recibe? *</label>
                    <input 
                      type="text"
                      value={recipientName}
                      onChange={e => { setRecipientName(e.target.value); setFormError(''); }}
                      placeholder="Nombre del contacto..."
                      className="w-full bg-surface-alt border border-divider/60 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">📞 Celular de contacto *</label>
                    <input 
                      type="tel"
                      value={recipientPhone}
                      onChange={e => { setRecipientPhone(e.target.value); setFormError(''); }}
                      placeholder="Número de celular..."
                      className="w-full bg-surface-alt border border-divider/60 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Package description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">📦 Descripción del Paquete *</label>
                  <input 
                    type="text"
                    value={packageDesc}
                    onChange={e => { setPackageDesc(e.target.value); setFormError(''); }}
                    placeholder="Ej. Documentos importantes, Llaves, Regalo, Caja de zapatos..."
                    className="w-full bg-surface-alt border border-divider/60 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                {/* Additional notes / observations */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">📝 Observaciones (Opcional)</label>
                  <textarea 
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder="Indicaciones para el aliado, ej: 'Llamar al llegar', 'Entregar en portería'..."
                    rows={2}
                    className="w-full bg-surface-alt border border-divider/60 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-5"
              >
                Continuar al Resumen
              </button>
            </motion.form>
          )}

          {/* STEP 2: SUMMARY */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <h3 className="font-sora font-extrabold text-base text-ink">Resumen del Envío</h3>
                <p className="text-xs text-ink-soft mt-0.5">Revisa la ruta y el costo calculado de la encomienda.</p>
              </div>

              {/* Route widget mapping */}
              <div className="p-4 bg-surface-alt/50 rounded-2xl border border-divider/40 relative">
                <div className="absolute left-[29px] top-9 bottom-9 w-0.5 border-l border-dashed border-divider"></div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-surface text-primary flex items-center justify-center text-xs font-bold z-10">
                    🟢
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Recoger En</span>
                    <span className="text-xs font-extrabold text-ink leading-tight block mt-0.5">{pickup}</span>
                  </div>
                </div>

                <div className="h-4"></div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent-surface text-accent flex items-center justify-center text-xs font-bold z-10">
                    🏁
                  </div>
                  <div>
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Entregar En (Destinatario)</span>
                    <span className="text-xs font-extrabold text-ink leading-tight block mt-0.5">{delivery}</span>
                    <span className="text-[10px] text-primary-dark font-black block mt-1">
                      👤 {recipientName} • 📞 {recipientPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package detailed review */}
              <div className="bg-surface-alt/40 border border-divider/40 rounded-2xl p-3.5 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-primary" />
                  <span className="text-[10px] uppercase font-black text-ink-soft tracking-wider">Detalles de Encomienda</span>
                </div>
                <div className="bg-white border border-divider/30 p-2.5 rounded-xl">
                  <span className="text-ink font-bold block">{packageDesc}</span>
                  {observations && (
                    <p className="text-[10px] text-ink-soft italic mt-1">Nota: "{observations}"</p>
                  )}
                </div>
              </div>

              {/* Distance, estimate and price summary panel */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-alt/40 border border-divider/30 rounded-xl">
                  <span className="text-[9px] text-ink-soft uppercase font-bold block">Distancia aprox.</span>
                  <span className="text-sm font-black text-ink block mt-0.5">{distance} km</span>
                </div>
                <div className="p-3 bg-surface-alt/40 border border-divider/30 rounded-xl text-right">
                  <span className="text-[9px] text-ink-soft uppercase font-bold block">Tiempo estimado</span>
                  <span className="text-sm font-black text-ink block mt-0.5">{estTime} minutos</span>
                </div>
              </div>

              {/* Price calculated */}
              <div className="bg-primary-surface/40 border border-primary/20 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-surface text-primary rounded-xl">
                    <Package size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-primary-dark font-black uppercase tracking-wider">Servicio de Encomiendas</span>
                    <h4 className="font-sora font-extrabold text-xs text-ink leading-tight">Envío Exprés Seguro</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sora font-black text-base text-primary-dark block">${price.toLocaleString('es-CO')}</span>
                  <span className="text-[9px] text-ink-soft block font-medium">COP • Efectivo</span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 text-[10px] text-ink-soft bg-surface-alt p-3 rounded-xl border border-divider/30">
                <ShieldCheck size={14} className="text-[#0EA65C] flex-shrink-0" />
                <span>Tu encomienda cuenta con seguro de protección y soporte de Movica Aguachica.</span>
              </div>

              {/* Submit trigger */}
              <button
                onClick={() => setStep(3)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                🏍️ Confirmar Envío Movica
              </button>
            </motion.div>
          )}

          {/* STEP 3: SEARCHING FOR DRIVER ANIMATION */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0d1a16] text-white flex flex-col justify-between p-8"
            >
              <div></div> {/* Top spacer */}

              {/* Center animated visual */}
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  
                  {/* Concentric pulsing rings */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-primary/40 bg-primary/5"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-primary/30 bg-primary/5"
                  />

                  {/* Centered glowing box icon with package styling */}
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl shadow-lg shadow-primary/30 z-10 relative">
                    📦
                  </div>
                </div>

                <div className="space-y-2.5 max-w-[260px]">
                  <h3 className="font-sora font-extrabold text-base text-white transition-all duration-300">
                    {searchPhase === 0 ? '📦 Buscando un aliado disponible...' :
                     searchPhase === 1 ? '🛵 Calculando la mejor ruta...' :
                                        '📍 Asignando el servicio...'}
                  </h3>
                  <p className="text-xs text-white/60">
                    {searchPhase === 0 ? 'Buscando al mensajero más cercano a tu ubicación.' :
                     searchPhase === 1 ? 'Optimizando el trayecto para reducir tiempos.' :
                                        'Validando la aceptación del aliado en Aguachica.'}
                  </p>
                </div>
              </div>

              {/* Progress Bar indicator */}
              <div className="space-y-4">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  <span>Asignando Aliado</span>
                  <button 
                    onClick={() => setStep(4)}
                    className="hover:text-white underline cursor-pointer"
                  >
                    Saltar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DRIVER ASSIGNED */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <span className="text-2xl">⚡</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-1">Aliado Asignado Exitosamente</h3>
                <p className="text-xs text-ink-soft mt-0.5">Tu mensajero oficial está listo para procesar el envío.</p>
              </div>

              {/* Driver profile card */}
              <div className="bg-gradient-to-br from-[#0d1a16] to-[#122820] text-white p-4 rounded-3xl shadow-lg flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                      {driver?.avatar || '🏍️'}
                    </div>
                    <div>
                      <h4 className="font-sora font-extrabold text-xs text-white leading-tight">{driver?.name || 'Juan Carlos Silva'}</h4>
                      <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 mt-0.5">
                        ★ {driver?.rating || '4.9'} <span className="text-white/50 font-medium font-mono text-[9px]">(Aliado Recomendado)</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/25 border border-primary/20 rounded-xl px-2.5 py-1 text-center">
                    <span className="text-[8px] text-white/50 uppercase tracking-widest font-black block">Llegada</span>
                    <span className="text-xs text-primary font-black font-mono">3 min</span>
                  </div>
                </div>

                {/* Motorcycle details row */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3.5 text-[10px] font-semibold text-white/70">
                  <div>
                    <span className="block text-[8px] text-white/40 uppercase font-black">Vehículo</span>
                    <span className="text-white font-extrabold block truncate mt-0.5">{driver?.vehicle || 'Yamaha FZ150'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-white/40 uppercase font-black">Placa de la Moto</span>
                    <span className="bg-primary text-[#0d1a16] px-1.5 py-0.5 rounded font-black font-mono inline-block mt-0.5">
                      {driver?.plate || 'XYZ-12C'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Chat Window */}
              <div className="bg-surface-alt rounded-2xl border border-divider/50 p-3.5 space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-divider/50">
                  <span className="text-[10px] font-black uppercase text-ink-soft flex items-center gap-1">
                    <MessageSquare size={12} className="text-primary" /> Chat con tu Mensajero
                  </span>
                  <span className="text-[9px] text-[#0EA65C] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Activo
                  </span>
                </div>

                {/* Chat Message Scroll */}
                <div className="space-y-2.5 max-h-[140px] overflow-y-auto content-scrollbar pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] ${
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
                    '¿Debo llamar al llegar? 📞',
                    'Favor timbrar fuerte 🔔',
                    'Ojo: El paquete es delicado 📦',
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

              {/* Action buttons */}
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
                    if (confirm('¿Estás seguro de que deseas cancelar este servicio de encomienda?')) {
                      setStep(1);
                    }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-3 font-extrabold text-xs cursor-pointer text-center"
                >
                  Cancelar Servicio
                </button>
              </div>

              {/* Start Delivery Track Simulator */}
              <button
                onClick={() => setStep(5)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                🚀 Paquete Recogido • Ver Seguimiento en Vivo
              </button>
            </motion.div>
          )}

          {/* STEP 5: LIVE TRACKING */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4 flex flex-col justify-between flex-1"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-sora font-extrabold text-base text-ink">Seguimiento de Encomienda</h3>
                  <p className="text-xs text-ink-soft mt-0.5">{trackingStatus}</p>
                </div>

                {/* Simulated SVG Routing Map for Delivery tracking */}
                <div className="h-[180px] bg-slate-100 rounded-3xl border border-divider/50 overflow-hidden relative shadow-inner">
                  
                  {/* Grid background lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(13,13,13,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(13,13,13,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  
                  {/* Vector streets */}
                  <svg className="absolute inset-0 w-full h-full text-slate-300 stroke-current stroke-3 fill-none">
                    <path d="M 20 120 Q 120 120 180 80 T 280 140" />
                    <path d="M 100 20 Q 100 120 200 170" />
                  </svg>

                  {/* Highlighted path */}
                  <svg className="absolute inset-0 w-full h-full text-primary stroke-current stroke-2 stroke-dasharray-[4_4] fill-none opacity-45">
                    <path d="M 20 120 Q 120 120 180 80 T 280 140" />
                  </svg>

                  {/* Origin */}
                  <div className="absolute left-[18px] top-[108px] w-6 h-6 rounded-full bg-primary-surface border border-primary text-xs font-bold flex items-center justify-center shadow-md">
                    🟢
                  </div>

                  {/* Destination */}
                  <div className="absolute left-[268px] top-[128px] w-6 h-6 rounded-full bg-accent-surface border border-accent text-xs font-bold flex items-center justify-center shadow-md">
                    🏁
                  </div>

                  {/* Motorbike package carrier icon */}
                  <div 
                    className="absolute w-8 h-8 rounded-full bg-[#0d1a16] text-white flex items-center justify-center text-sm shadow-lg border border-primary/20 transition-all duration-300"
                    style={{
                      left: `${20 + (268 - 20) * (trackingProgress / 100)}px`,
                      top: `${120 + (138 - 120) * (trackingProgress / 100)}px`
                    }}
                  >
                    🛵
                  </div>

                  {/* Map tracking indicator tag */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-divider rounded-xl p-2.5 text-[9px] font-bold text-ink flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span className="truncate">{trackingStatus}</span>
                  </div>
                </div>

                {/* Transit specs summary */}
                <div className="grid grid-cols-2 gap-3 bg-surface-alt/50 p-3.5 rounded-2xl border border-divider/30 text-xs">
                  <div>
                    <span className="text-[8px] text-ink-soft uppercase font-black block">Aliado Mensajero</span>
                    <span className="font-bold text-ink block mt-0.5">{driver?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-ink-soft uppercase font-black block">Tiempo Restante</span>
                    <span className="font-bold text-primary-dark block mt-0.5">
                      {Math.ceil(estTime * (1 - trackingProgress / 100))} min aprox
                    </span>
                  </div>
                </div>

                {/* Share Tracking Link action */}
                <div className="relative">
                  <button
                    onClick={handleShareTracking}
                    className="w-full bg-surface-alt hover:bg-divider/50 border border-divider text-ink rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 size={14} className="text-primary" /> Compartir Link de Seguimiento
                  </button>

                  <AnimatePresence>
                    {shareToast && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-1/2 -translate-x-1/2 -top-12 bg-ink text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg shadow-md z-30"
                      >
                        ¡Copiado al portapapeles! 🔗
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Instant delivery action (test convenience) */}
              <button
                onClick={() => setStep(6)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Completar Entrega de Inmediato
              </button>
            </motion.div>
          )}

          {/* STEP 6: ENCOMIENDA DELIVERED */}
          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-6 space-y-5 flex flex-col justify-between flex-1"
            >
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-surface text-primary flex items-center justify-center text-3xl mx-auto shadow-inner border border-primary/20">
                  ✅
                </div>

                <div className="space-y-1">
                  <h3 className="font-sora font-extrabold text-base text-ink">¡Encomienda Entregada!</h3>
                  <p className="text-xs text-ink-soft">El destinatario {recipientName} ya tiene el paquete seguro.</p>
                </div>

                {/* Receipt Details summary */}
                <div className="bg-surface-alt/70 border border-divider/40 rounded-2xl p-4 space-y-2 text-xs font-semibold text-ink-soft">
                  <div className="flex justify-between items-center">
                    <span>Valor del Envío</span>
                    <span className="text-ink font-black">${price.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tiempo total de envío</span>
                    <span className="text-ink font-black">{estTime + 1} minutos</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-divider/60 pt-2 text-sm font-bold text-ink">
                    <span>Método de Pago</span>
                    <span className="text-primary-dark">💵 Efectivo en recogida</span>
                  </div>
                </div>

                {/* Star rating picker widget */}
                <div className="space-y-2 pt-1.5">
                  <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Califica el Servicio del Conductor</span>
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
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Dejar un comentario</label>
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
                Finalizar Envío
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
            <div></div>

            {/* Profile & Call metrics */}
            <div className="space-y-6">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl mx-auto shadow-lg border border-white/5 animate-pulse">
                {driver?.avatar || '🏍️'}
              </div>
              <div className="space-y-1">
                <h3 className="font-sora font-extrabold text-lg text-white">{driver?.name || 'Juan Carlos Silva'}</h3>
                <span className="text-xs text-primary font-bold block uppercase tracking-widest">Llamada en curso...</span>
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
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Colgar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
