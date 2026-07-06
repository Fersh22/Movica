import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, AlertTriangle, Share2, Users, Phone, Info, X, 
  ChevronRight, Copy, Check, Plus, Trash2, Edit2, Send, 
  ArrowLeft, MapPin, Clock, Eye, ShieldAlert, Heart, ExternalLink
} from 'lucide-react';

interface SecurityCenterProps {
  onClose: () => void;
  userProfile: {
    name: string;
    phone: string;
    email: string;
  };
  mode?: 'cliente' | 'aliado';
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyAlert {
  id: string;
  user: string;
  phone: string;
  role: string;
  location: string;
  date: string;
  status: 'pendiente' | 'despachado' | 'resuelto' | 'cancelado';
  comments: string;
  timestamp: number;
}

export default function SecurityCenter({ onClose, userProfile, mode = 'cliente' }: SecurityCenterProps) {
  const [activeView, setActiveView] = useState<'main' | 'sos' | 'share' | 'contacts' | 'tips' | 'call'>('main');
  
  // SOS States
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [isSosAlertActive, setIsSosAlertActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosAlertId, setSosAlertId] = useState('');
  const [sosStatusText, setSosStatusText] = useState('Enviando coordenadas GPS...');
  const [gpsCoordinates, setGpsCoordinates] = useState('8.3059° N, 73.6181° W');

  // Contact States
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRelationship, setFormRelationship] = useState('Familiar');

  // Share Ride States
  const [isCopied, setIsCopied] = useState(false);
  const [simulatedTrackingCode, setSimulatedTrackingCode] = useState('');
  const [shareTargetContact, setShareTargetContact] = useState<string>('');
  const [shareSuccessMsg, setShareSuccessMsg] = useState('');
  const [mapAnimating, setMapAnimating] = useState(true);
  const [mapMarkerPos, setMapMarkerPos] = useState({ x: 30, y: 70 });

  // Load Initial Data
  useEffect(() => {
    // Generate simulated tracking code
    setSimulatedTrackingCode(`MOV-TR-${Math.floor(100000 + Math.random() * 900000)}`);
    
    // Load contacts
    const savedContacts = localStorage.getItem('movica_trusted_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      const defaultContacts = [
        { id: '1', name: 'María Gómez', phone: '315 789 4512', relationship: 'Madre' },
        { id: '2', name: 'Carlos Gómez', phone: '321 456 9874', relationship: 'Hermano' }
      ];
      setContacts(defaultContacts);
      localStorage.setItem('movica_trusted_contacts', JSON.stringify(defaultContacts));
    }

    // Check if there is an active SOS from this user
    const savedEmergencies = localStorage.getItem('movica_emergencies');
    if (savedEmergencies) {
      const parsed: EmergencyAlert[] = JSON.parse(savedEmergencies);
      const active = parsed.find(e => e.phone === userProfile.phone && e.status === 'pendiente');
      if (active) {
        setIsSosAlertActive(true);
        setSosAlertId(active.id);
        setActiveView('sos');
      }
    }
  }, [userProfile.phone]);

  // Handle Map Animation Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeView === 'share' && mapAnimating) {
      interval = setInterval(() => {
        setMapMarkerPos(prev => {
          const nextX = prev.x + 2;
          const nextY = prev.y - 1.5;
          if (nextX > 80) {
            return { x: 30, y: 70 }; // Loop back
          }
          return { x: nextX, y: nextY };
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [activeView, mapAnimating]);

  // Handle SOS Countdown simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSosAlertActive && sosCountdown > 0) {
      timer = setTimeout(() => {
        setSosCountdown(prev => prev - 1);
        const steps = [
          'Enviando coordenadas GPS...',
          'Transmitiendo perfil a la central...',
          'Notificando a cuadrante de Policía Aguachica...',
          'Sincronizando con contactos de confianza...',
          'Central de seguridad conectada en vivo.'
        ];
        setSosStatusText(steps[5 - sosCountdown] || 'Monitoreo satelital activo.');
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isSosAlertActive, sosCountdown]);

  // SOS Activation Action
  const triggerSOS = () => {
    const alertId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    setSosAlertId(alertId);
    setIsSosAlertActive(true);
    setSosCountdown(5);
    setShowSosConfirm(false);
    setActiveView('sos');

    // Create emergency object
    const newEmergency: EmergencyAlert = {
      id: alertId,
      user: userProfile.name,
      phone: userProfile.phone,
      role: mode === 'cliente' ? 'Cliente' : 'Aliado Conductor',
      location: mode === 'cliente' ? 'Calle Principal # 12-34, Aguachica' : 'Carrera 15 # 10-42, Aguachica',
      date: new Date().toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: 'pendiente',
      comments: `Alerta SOS activada inmediatamente por el ${mode === 'cliente' ? 'cliente' : 'aliado'} desde la app. Monitoreo satelital activado.`,
      timestamp: Date.now()
    };

    // Save to local storage emergencies
    const saved = localStorage.getItem('movica_emergencies');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(newEmergency);
    localStorage.setItem('movica_emergencies', JSON.stringify(list));
  };

  // SOS Cancel Action
  const cancelSOS = () => {
    setIsSosAlertActive(false);
    setSosCountdown(5);
    
    // Update storage status to 'cancelado' or remove it
    const saved = localStorage.getItem('movica_emergencies');
    if (saved) {
      const list: EmergencyAlert[] = JSON.parse(saved);
      const updated = list.map(e => {
        if (e.id === sosAlertId) {
          return { ...e, status: 'cancelado' as const, comments: 'El usuario desactivó la alerta de emergencia voluntariamente.' };
        }
        return e;
      });
      localStorage.setItem('movica_emergencies', JSON.stringify(updated));
    }
    setActiveView('main');
  };

  // Copy Tracking Link
  const copyTrackingLink = () => {
    const link = `https://movica.app/track/${simulatedTrackingCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Share with trusted contacts simulation
  const handleShareWithContact = (contactName: string, phone: string) => {
    setShareSuccessMsg(`¡Enlace enviado con éxito a ${contactName} (+57 ${phone}) via SMS/WhatsApp!`);
    setTimeout(() => setShareSuccessMsg(''), 4000);
  };

  // Contacts Management
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    let updatedContacts = [...contacts];

    if (editingContactId) {
      // Edit
      updatedContacts = updatedContacts.map(c => 
        c.id === editingContactId 
          ? { ...c, name: formName, phone: formPhone, relationship: formRelationship }
          : c
      );
    } else {
      // Add
      const newContact: TrustedContact = {
        id: `contact-${Date.now()}`,
        name: formName,
        phone: formPhone,
        relationship: formRelationship
      };
      updatedContacts.push(newContact);
    }

    setContacts(updatedContacts);
    localStorage.setItem('movica_trusted_contacts', JSON.stringify(updatedContacts));
    
    // Reset Form
    setFormName('');
    setFormPhone('');
    setFormRelationship('Familiar');
    setEditingContactId(null);
    setContactFormOpen(false);
  };

  const startEditContact = (contact: TrustedContact) => {
    setEditingContactId(contact.id);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormRelationship(contact.relationship);
    setContactFormOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem('movica_trusted_contacts', JSON.stringify(updated));
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative text-ink">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between pb-3.5 border-b border-divider/60 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          {activeView !== 'main' ? (
            <button 
              onClick={() => {
                if (isSosAlertActive && activeView === 'sos') {
                  // Cannot back out of active SOS without canceling first
                  cancelSOS();
                } else {
                  setActiveView('main');
                }
              }}
              className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <Shield size={16} />
            </div>
          )}
          <div>
            <h3 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1">
              {activeView === 'main' && '🛡️ Centro de Seguridad'}
              {activeView === 'sos' && '🚨 Botón de Emergencia'}
              {activeView === 'share' && '📍 Compartir Viaje'}
              {activeView === 'contacts' && '👨‍👩‍👧 Contactos de Confianza'}
              {activeView === 'tips' && '📋 Consejos de Seguridad'}
              {activeView === 'call' && '📞 Soporte de Emergencias'}
            </h3>
            {activeView === 'main' && (
              <p className="text-[10px] text-ink-soft font-bold tracking-tight uppercase">Movica SafeGuard</p>
            )}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* SCREEN CONTENT VIEWPORT */}
      <div className="flex-1 overflow-y-auto content-scrollbar pb-6 space-y-4 pr-1">

        {/* 1. MAIN MENU VIEW */}
        {activeView === 'main' && (
          <div className="space-y-4">
            
            {/* Banner SafeGuard */}
            <div className="bg-gradient-to-br from-[#0d1a16] to-[#152e25] p-5 rounded-3xl text-white shadow-md space-y-2 relative overflow-hidden text-left">
              <div className="absolute right-3 top-3 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h4 className="font-sora font-extrabold text-[14px] leading-tight">Tu seguridad es prioridad</h4>
              <p className="text-[10.5px] text-white/70 leading-relaxed font-medium">
                Nuestras herramientas te respaldan antes, durante y después de cada servicio en Aguachica.
              </p>
            </div>

            {/* 🚨 SOS BUTTON CARD */}
            <div 
              onClick={() => setShowSosConfirm(true)}
              className="bg-red-500/5 hover:bg-red-500/10 border-2 border-red-500/20 hover:border-red-500/30 p-5 rounded-3xl flex items-center gap-4 cursor-pointer transition-all active:scale-[0.99] group text-left"
            >
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform shrink-0 animate-pulse">
                🚨
              </div>
              <div className="flex-1 min-w-0">
                <span className="bg-red-600 text-white font-sora font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full">SOS Activo</span>
                <h4 className="font-sora font-extrabold text-sm text-red-900 mt-1">Botón de Emergencia</h4>
                <p className="text-xs text-red-700/85 mt-0.5 leading-snug font-medium">Transmite coordenadas en vivo a la central y patrullas locales.</p>
              </div>
              <ChevronRight size={16} className="text-red-400 shrink-0" />
            </div>

            {/* MAIN BUTTON OPTIONS */}
            <div className="grid grid-cols-1 gap-3">
              
              {/* Option 2: Compartir viaje */}
              <div 
                onClick={() => setActiveView('share')}
                className="bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/20 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all active:scale-[0.99] text-left"
              >
                <div className="w-11 h-11 bg-primary-surface text-primary rounded-xl flex items-center justify-center text-xl shrink-0">
                  📍
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-bold text-xs text-ink">Compartir viaje</h4>
                  <p className="text-[10.5px] text-ink-soft mt-0.5 font-semibold">Envía un enlace de rastreo en tiempo real a tus seres queridos.</p>
                </div>
                <ChevronRight size={14} className="text-ink-faint shrink-0" />
              </div>

              {/* Option 3: Contactos de confianza */}
              <div 
                onClick={() => setActiveView('contacts')}
                className="bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/20 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all active:scale-[0.99] text-left"
              >
                <div className="w-11 h-11 bg-primary-surface text-primary rounded-xl flex items-center justify-center text-xl shrink-0">
                  👨‍👩‍👧
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-bold text-xs text-ink">Contactos de confianza</h4>
                  <p className="text-[10.5px] text-ink-soft mt-0.5 font-semibold">Configura las personas a notificar en casos de emergencia.</p>
                </div>
                <ChevronRight size={14} className="text-ink-faint shrink-0" />
              </div>

              {/* Option 4: Consejos de seguridad */}
              <div 
                onClick={() => setActiveView('tips')}
                className="bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/20 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all active:scale-[0.99] text-left"
              >
                <div className="w-11 h-11 bg-primary-surface text-primary rounded-xl flex items-center justify-center text-xl shrink-0">
                  📋
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-bold text-xs text-ink">Consejos de seguridad</h4>
                  <p className="text-[10.5px] text-ink-soft mt-0.5 font-semibold">Recomendaciones antes y durante el servicio para tu viaje.</p>
                </div>
                <ChevronRight size={14} className="text-ink-faint shrink-0" />
              </div>

              {/* Option 5: Llamar soporte */}
              <div 
                onClick={() => setActiveView('call')}
                className="bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/20 p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all active:scale-[0.99] text-left"
              >
                <div className="w-11 h-11 bg-primary-surface text-primary rounded-xl flex items-center justify-center text-xl shrink-0">
                  📞
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-bold text-xs text-ink">Llamar al soporte de seguridad</h4>
                  <p className="text-[10.5px] text-ink-soft mt-0.5 font-semibold">Atención telefónica prioritaria de la central Movica 24/7.</p>
                </div>
                <ChevronRight size={14} className="text-ink-faint shrink-0" />
              </div>

            </div>

            {/* Quick Policy Footer */}
            <div className="p-3 bg-surface-alt rounded-2xl border border-divider/40 text-[9.5px] text-ink-soft text-left flex gap-2">
              <span className="text-primary mt-0.5 font-bold">✓</span>
              <p className="leading-relaxed font-semibold">
                Todos nuestros aliados se encuentran identificados en tiempo real con GPS. Los servicios de Movica cuentan con póliza de accidentes contra todo riesgo para conductor y pasajero.
              </p>
            </div>

          </div>
        )}

        {/* 2. EMERGENCY SOS DIALOG CONFIRM */}
        {/* Rendered inline if confirm is triggered */}
        <AnimatePresence>
          {showSosConfirm && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-red-50 border border-red-200 rounded-3xl p-5 space-y-4 text-left shadow-md"
            >
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle size={20} className="animate-bounce" />
                </div>
                <div>
                  <h4 className="font-sora font-extrabold text-sm text-red-900">¿Estás seguro de activar la emergencia?</h4>
                  <p className="text-[10.5px] text-red-700 font-semibold leading-relaxed mt-1">
                    Esto enviará una señal de auxilio silenciosa e inmediata a la central de despacho de Movica, alertando a las patrullas policiales de Aguachica y notificando a tus contactos de confianza por SMS en tiempo real.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1.5 text-xs font-bold font-sora">
                <button
                  onClick={() => setShowSosConfirm(false)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 py-3 rounded-xl transition-all cursor-pointer text-center"
                >
                  ❌ Cancelar
                </button>
                <button
                  onClick={triggerSOS}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-all shadow-md shadow-red-600/10 cursor-pointer text-center"
                >
                  ✅ Sí, Activar SOS
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. ACTIVE SOS VIEW SCREEN */}
        {activeView === 'sos' && isSosAlertActive && (
          <div className="space-y-5 text-center py-4">
            
            {/* Visual Pulsing Emergency Ring */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0 bg-red-600/15 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                className="absolute inset-4 bg-red-600/25 rounded-full"
              />
              <div className="w-24 h-24 bg-gradient-to-b from-red-500 to-red-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-600/30 relative z-10">
                <ShieldAlert size={48} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-full animate-pulse inline-block">
                Siren / Alerta Emitida: {sosAlertId}
              </span>
              <h3 className="font-sora font-extrabold text-lg text-red-900 mt-2">ALERTA EN PROCESO</h3>
              <p className="text-xs text-ink-soft max-w-[280px] mx-auto leading-relaxed">
                No cierres esta ventana. Tu ubicación GPS está siendo compartida de forma ininterrumpida.
              </p>
            </div>

            {/* GPS HUD */}
            <div className="bg-surface-alt border border-divider/40 p-4 rounded-2xl text-left space-y-2 max-w-[320px] mx-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                <MapPin size={13} className="text-red-500" />
                <span className="text-ink-soft">Coordenadas:</span>
                <span className="font-mono text-[11px] font-bold text-red-600">{gpsCoordinates}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink border-t border-divider/40 pt-2">
                <Clock size={13} className="text-ink-soft" />
                <span className="text-ink-soft">Canal SOS:</span>
                <span className="font-bold text-primary">{sosStatusText}</span>
              </div>
              <div className="text-[9px] text-ink-faint text-center pt-1 border-t border-divider/35 font-bold">
                Conexión segura 256-bit AES • Ping satélite: 1.2s
              </div>
            </div>

            {/* Simulated Contacts Notified Badge */}
            {contacts.length > 0 && (
              <div className="bg-[#E6F7EC] border border-[#0EA65C]/20 p-3 rounded-xl text-left max-w-[320px] mx-auto flex items-start gap-2.5">
                <span className="text-lg">📱</span>
                <div>
                  <h5 className="font-sora font-bold text-[10px] text-[#0A733E]">Contactos Notificados por SMS:</h5>
                  <p className="text-[9.5px] text-[#0C8B4C] mt-0.5 leading-tight font-semibold">
                    {contacts.map(c => `${c.name} (${c.relationship})`).join(', ')} han recibido un enlace con tu geolocalización.
                  </p>
                </div>
              </div>
            )}

            {/* Cancel Emergency button */}
            <div className="pt-3">
              <button
                onClick={cancelSOS}
                className="bg-ink hover:bg-slate-800 text-white font-sora font-extrabold text-xs py-3.5 px-8 rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>Desactivar SOS de Emergencia</span>
              </button>
              <p className="text-[9.5px] text-ink-faint mt-2 font-bold uppercase tracking-wider">Únicamente presionar si te encuentras fuera de peligro</p>
            </div>

          </div>
        )}

        {/* 4. SHARE RIDE VIEW */}
        {activeView === 'share' && (
          <div className="space-y-4 text-left">
            
            {/* Simulation of Live ride track map */}
            <div className="h-[180px] rounded-3xl bg-[#E6ECE8] relative overflow-hidden border border-divider/50 flex flex-col justify-end p-3.5">
              
              {/* Map representation vectors */}
              <div className="absolute inset-0 bg-cover opacity-85" style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-73.62%2C8.31%5D%7D%7D)/-73.62,8.31,14,0/375x180?access_token=mock')` }}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Streets mock */}
                  <path d="M-10,60 L120,80 L230,50 L390,110" fill="none" stroke="#D3DDD7" strokeWidth="8" />
                  <path d="M70,-10 L120,80 L160,190" fill="none" stroke="#D3DDD7" strokeWidth="8" />
                  {/* Active route route path */}
                  <path d="M120,80 L230,50 L310,100" fill="none" stroke="#0EA65C" strokeWidth="5" strokeDasharray="5,5" className="animate-pulse" />
                  
                  {/* Moving rider coordinate marker */}
                  <g transform={`translate(${mapMarkerPos.x}%, ${mapMarkerPos.y}%)`}>
                    <circle cx="0" cy="0" r="14" fill="#0EA65C" className="animate-ping opacity-35" />
                    <circle cx="0" cy="0" r="9" fill="#0EA65C" />
                    <text x="-4" y="3" fontSize="8" fill="white">🛵</text>
                  </g>
                  {/* Destination pin */}
                  <g transform="translate(80%, 25%)">
                    <circle cx="0" cy="0" r="5" fill="#FFC629" />
                    <circle cx="0" cy="0" r="2.5" fill="#0D0D0D" />
                  </g>
                </svg>
              </div>

              {/* Float map control overlay */}
              <div className="bg-white/95 backdrop-blur-sm p-2 rounded-xl flex items-center justify-between border border-divider/40 relative z-10">
                <div className="flex items-center gap-1.5 text-[10px] text-ink font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Rastreo activo: {simulatedTrackingCode}</span>
                </div>
                <button
                  onClick={() => setMapAnimating(!mapAnimating)}
                  className="bg-primary/10 text-primary hover:bg-primary text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md hover:text-white transition-colors"
                >
                  {mapAnimating ? 'Pausar sim' : 'Reanudar sim'}
                </button>
              </div>
            </div>

            {/* Option 1: Copy Link */}
            <div className="bg-white border border-divider/50 rounded-2xl p-4 space-y-2 text-left">
              <h5 className="font-sora font-extrabold text-xs text-ink">Enlace de Seguimiento Web</h5>
              <p className="text-[10.5px] text-ink-soft leading-tight font-semibold">
                Cualquier persona con este enlace podrá ver tu ubicación en vivo en el mapa desde cualquier navegador, sin tener instalada la app.
              </p>

              <div className="flex gap-2 pt-1">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://movica.app/track/${simulatedTrackingCode}`}
                  className="flex-1 bg-surface-alt text-ink font-mono text-[10px] px-3 py-2.5 rounded-xl border border-divider/40 outline-none select-all"
                />
                <button
                  onClick={copyTrackingLink}
                  className={`w-11 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                    isCopied 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                  title="Copiar Enlace"
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {isCopied && (
                <p className="text-[9.5px] text-emerald-600 font-extrabold tracking-wide uppercase">✓ ¡Copiado al portapapeles!</p>
              )}
            </div>

            {/* Option 2: Share with contacts list */}
            <div className="bg-white border border-divider/50 rounded-2xl p-4 space-y-3.5 text-left">
              <h5 className="font-sora font-extrabold text-xs text-ink">Compartir con Contactos de Confianza</h5>
              <p className="text-[10.5px] text-ink-soft leading-tight font-semibold">
                Selecciona uno de tus contactos configurados para enviarle el SMS con el enlace instantáneamente.
              </p>

              {contacts.length === 0 ? (
                <div className="p-4 text-center bg-surface-alt/40 border border-divider/30 rounded-xl">
                  <p className="text-xs text-ink-soft italic font-bold">No tienes contactos de confianza.</p>
                  <button
                    onClick={() => setActiveView('contacts')}
                    className="text-primary text-[10px] font-black uppercase mt-1.5 hover:underline"
                  >
                    + Agregar Contacto
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.map(c => (
                    <div 
                      key={c.id}
                      className="p-3 bg-surface-alt/50 border border-divider/40 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <h6 className="font-bold text-xs text-ink">{c.name}</h6>
                        <span className="text-[10px] text-ink-soft font-semibold">{c.relationship} • {c.phone}</span>
                      </div>
                      <button
                        onClick={() => handleShareWithContact(c.name, c.phone)}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white text-[9.5px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        Enviar Enlace
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {shareSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold border border-emerald-100 animate-slideUp">
                  {shareSuccessMsg}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 5. TRUSTED CONTACTS VIEW */}
        {activeView === 'contacts' && (
          <div className="space-y-4 text-left">
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-ink-soft font-semibold leading-normal">
                  Familiares o amigos que recibirán tus alertas SOS y seguimientos.
                </p>
              </div>
              
              {!contactFormOpen && (
                <button
                  onClick={() => {
                    setEditingContactId(null);
                    setFormName('');
                    setFormPhone('');
                    setFormRelationship('Familiar');
                    setContactFormOpen(true);
                  }}
                  className="bg-primary hover:bg-primary-dark text-white font-sora font-bold text-[10px] px-3 py-2 rounded-xl shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Agregar
                </button>
              )}
            </div>

            {/* CONTACT FORM */}
            <AnimatePresence>
              {contactFormOpen && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveContact}
                  className="bg-surface-alt border border-divider/60 rounded-2xl p-4 space-y-3.5 text-left overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-divider/40 pb-2">
                    <h5 className="font-sora font-extrabold text-xs text-ink">
                      {editingContactId ? '📝 Editar Contacto' : '➕ Agregar Contacto'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setContactFormOpen(false)}
                      className="text-ink-soft text-[10.5px] font-bold hover:text-ink"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Nombre Completo</label>
                    <input 
                      type="text"
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="Ej: Carolina Restrepo"
                      className="w-full bg-white border border-divider/50 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Celular de Contacto</label>
                      <input 
                        type="tel"
                        required
                        value={formPhone}
                        onChange={e => setFormPhone(e.target.value)}
                        placeholder="Ej: 312 456 7890"
                        className="w-full bg-white border border-divider/50 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-1">Parentesco</label>
                      <select
                        value={formRelationship}
                        onChange={e => setFormRelationship(e.target.value)}
                        className="w-full bg-white border border-divider/50 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option value="Familiar">Familiar</option>
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Hermano">Hermano(a)</option>
                        <option value="Amigo">Amigo(a)</option>
                        <option value="Pareja">Pareja</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1 font-sora text-[10.5px] font-bold">
                    <button
                      type="button"
                      onClick={() => setContactFormOpen(false)}
                      className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-divider py-2 rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white hover:bg-primary-dark py-2 rounded-xl transition-all shadow-sm"
                    >
                      Guardar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* LIST OF TRUSTED CONTACTS */}
            <div className="space-y-2.5">
              {contacts.length === 0 ? (
                <div className="p-8 text-center bg-surface-alt/40 border border-divider/30 rounded-2xl text-ink-soft italic text-xs">
                  Aún no tienes contactos configurados. Agrega uno arriba.
                </div>
              ) : (
                contacts.map(c => (
                  <div 
                    key={c.id}
                    className="p-4 bg-white border border-divider/50 rounded-2xl shadow-xs flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-sora font-extrabold text-xs text-ink">{c.name}</h5>
                        <span className="text-[9px] bg-primary-surface text-primary-dark font-extrabold uppercase px-2 py-0.25 rounded-md">
                          {c.relationship}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-ink-soft font-mono font-bold mt-1">Celular: +57 {c.phone}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditContact(c)}
                        className="w-7.5 h-7.5 rounded-lg bg-surface-alt hover:bg-divider text-ink-soft hover:text-ink flex items-center justify-center"
                        title="Editar Contacto"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="w-7.5 h-7.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center"
                        title="Eliminar Contacto"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* 6. SECURITY TIPS VIEW */}
        {activeView === 'tips' && (
          <div className="space-y-4 text-left">
            
            <div className="border-b border-divider/40 pb-2 mb-1">
              <span className="bg-primary/10 text-primary font-sora font-extrabold text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                Recomendaciones oficiales Movica
              </span>
            </div>

            {/* Antes de iniciar el servicio */}
            <div className="bg-white border border-divider/50 rounded-2xl p-4.5 space-y-3 shadow-xs">
              <h5 className="font-sora font-extrabold text-xs text-primary flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Antes de subirte o iniciar el servicio:
              </h5>

              <ul className="space-y-2 text-xs text-ink-soft leading-relaxed font-semibold">
                <li className="flex gap-2.5 items-start">
                  <span className="text-primary font-bold">1.</span>
                  <p><strong>Verifica la placa:</strong> Asegúrate de que coincida con la registrada en tu aplicación.</p>
                </li>
                <li className="flex gap-2.5 items-start border-t border-divider/25 pt-2">
                  <span className="text-primary font-bold">2.</span>
                  <p><strong>Pregunta el nombre:</strong> Confirma que el aliado conductor sea la persona asignada.</p>
                </li>
                <li className="flex gap-2.5 items-start border-t border-divider/25 pt-2">
                  <span className="text-primary font-bold">3.</span>
                  <p><strong>Comprueba la foto:</strong> Corrobora los rasgos físicos del motorizado en su perfil de Movica.</p>
                </li>
                <li className="flex gap-2.5 items-start border-t border-divider/25 pt-2">
                  <span className="text-primary font-bold">4.</span>
                  <p><strong>Inspecciona el vehículo:</strong> El estado general de la moto debe ser óptimo para tu traslado.</p>
                </li>
              </ul>
            </div>

            {/* Durante el servicio */}
            <div className="bg-white border border-divider/50 rounded-2xl p-4.5 space-y-3 shadow-xs">
              <h5 className="font-sora font-extrabold text-xs text-[#A67E28] flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Durante el recorrido:
              </h5>

              <ul className="space-y-2 text-xs text-ink-soft leading-relaxed font-semibold">
                <li className="flex gap-2.5 items-start">
                  <span className="text-amber-600 font-bold">1.</span>
                  <p><strong>Usa el casco correctamente:</strong> Siempre abróchalo y ajústalo debidamente a tu barbilla.</p>
                </li>
                <li className="flex gap-2.5 items-start border-t border-divider/25 pt-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <p><strong>Evita distracciones:</strong> No utilices el celular de forma descuidada que afecte el balance de la moto.</p>
                </li>
                <li className="flex gap-2.5 items-start border-t border-divider/25 pt-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <p><strong>Sujétate bien:</strong> Utiliza los agarradores traseros de la motocicleta o los hombros del aliado si es necesario.</p>
                </li>
                <li className="flex gap-2.5 items-start border-t border-divider/25 pt-2">
                  <span className="text-amber-600 font-bold">4.</span>
                  <p><strong>Ruta compartida:</strong> Si viajas de noche, comparte tu viaje con tus contactos antes de arrancar.</p>
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* 7. SUPPORT / PHONE EMERGENCY VIEW */}
        {activeView === 'call' && (
          <div className="space-y-4 text-center py-5">
            
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-2 animate-bounce">
              <Phone size={32} />
            </div>

            <div className="space-y-1">
              <h4 className="font-sora font-extrabold text-base text-red-950">Atención Telefónica 24/7</h4>
              <p className="text-xs text-ink-soft max-w-[280px] mx-auto leading-relaxed">
                Nuestra central de monitoreo en Aguachica atenderá de forma inmediata cualquier eventualidad durante tu servicio.
              </p>
            </div>

            {/* Main call box */}
            <div className="bg-surface-alt border border-divider/40 p-5 rounded-3xl max-w-[320px] mx-auto space-y-4 text-left">
              
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft block">Línea Prioritaria Movica</span>
                <span className="font-sora font-extrabold text-lg text-primary block mt-0.5">+57 312 888 0091</span>
              </div>

              <div className="border-t border-divider/30 pt-3 text-xs leading-normal font-semibold text-ink-soft space-y-2">
                <div className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Llamada libre de costo desde cualquier operador celular.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Enlace directo con el Comando de Policía de Aguachica.</span>
                </div>
              </div>

              <a 
                href="tel:+573128880091"
                className="w-full bg-[#0EA65C] hover:bg-[#087A43] text-white py-3.5 rounded-xl font-sora font-extrabold text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 transition-all text-center block"
              >
                <span>Llamar al Soporte Ahora</span>
              </a>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
