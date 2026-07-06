import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, MapPin, Settings, LogOut, ChevronRight, X, Save, Shield, 
  Bell, Key, Plus, CreditCard, Ticket, HelpCircle, FileText, 
  Lock, Camera, Check, MessageSquare, Send, Smartphone, Mail, Info
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';
import { FAQS } from '../data';
import RatingsSystem from './RatingsSystem';
import PromoAndCoupons from './PromoAndCoupons';
import AchievementsSystem from './AchievementsSystem';
import PaymentBillingSystem from './PaymentBillingSystem';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenSecurity?: () => void;
  onSwitchToPartner: () => void;
  onSwitchToMerchant?: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToSupervisor?: () => void;
}

type SheetType = 
  | 'none' 
  | 'edit-profile' 
  | 'change-password'
  | 'addresses' 
  | 'payment-methods'
  | 'coupons'
  | 'settings'
  | 'help-center'
  | 'terms'
  | 'privacy'
  | 'ratings'
  | 'achievements'
  | 'historial'
  | 'favoritos'
  | 'security-center';

interface PaymentMethod {
  id: string;
  type: 'efectivo' | 'nequi' | 'tarjeta';
  name: string;
  detail: string;
  isDefault: boolean;
}

interface Coupon {
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  status: 'disponible' | 'usado' | 'vencido';
}

export default function ProfileView({ 
  userProfile, 
  onUpdateProfile, 
  onLogout, 
  onNavigateToTab,
  onOpenSecurity,
  onSwitchToPartner,
  onSwitchToMerchant,
  onSwitchToAdmin,
  onSwitchToSupervisor
}: ProfileViewProps) {
  const [activeSheet, setActiveSheet] = useState<SheetType>('none');

  // Edit Profile States
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  
  // Custom Avatar Picker States
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarChar, setCustomAvatarChar] = useState('');
  const PRESET_AVATARS = ['F', '🧔', '👩', '🧑', '👨‍✈️', '🏍️', '🛵', '⚡', '⭐', '🔥', '🏆', '🌟', '🍀'];

  // Change Password States
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Addresses States
  const [addresses, setAddresses] = useState(userProfile.addresses || []);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Payment Methods States
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pay-1', type: 'efectivo', name: 'Efectivo (Pesos COP)', detail: 'Paga directo en el destino', isDefault: true },
    { id: 'pay-2', type: 'nequi', name: 'Nequi Simulado', detail: '+57 312 *** 7890', isDefault: false },
    { id: 'pay-3', type: 'tarjeta', name: 'Visa **** 4321', detail: 'Vence 11/29', isDefault: false }
  ]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayType, setNewPayType] = useState<'nequi' | 'tarjeta'>('nequi');
  const [newPayNumber, setNewPayNumber] = useState('');
  const [newPayDetail, setNewPayDetail] = useState('');

  // Coupons States
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'MOVICA50', discount: '$5.000 COP', description: 'Descuento especial de bienvenida en Aguachica', validUntil: '31 Dic, 2026', status: 'disponible' },
    { code: 'FINDE30', discount: '$3.000 COP', description: 'Viajes de fin de semana con tarifa reducida', validUntil: '28 Jul, 2026', status: 'disponible' },
    { code: 'DOMISGRATIS', discount: 'Envío Gratis', description: 'Válido para pedidos superiores a $15.000 COP', validUntil: '15 Ago, 2026', status: 'disponible' },
    { code: 'CUPONVECINO', discount: '$2.000 COP', description: 'Promoción especial para barrios centrales', validUntil: '01 Ene, 2026', status: 'vencido' }
  ]);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Notification Settings States
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [emailPromo, setEmailPromo] = useState(false);
  const [locationShare, setLocationShare] = useState(true);

  // Help Center FAQ States
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'support',
      text: '¡Hola! Soy Sofía de Soporte Movica. 🙋‍♀️ ¿En qué puedo ayudarte con tu perfil, cupones o servicios en Aguachica?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Handle updates to profile info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;

    onUpdateProfile({
      ...userProfile,
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    });
    
    alert("Información de perfil actualizada correctamente.");
    setActiveSheet('none');
  };

  // Profile picture preset select
  const selectAvatarChar = (char: string) => {
    onUpdateProfile({
      ...userProfile,
      avatarLetter: char
    });
    setShowAvatarPicker(false);
  };

  // Profile picture custom submission
  const handleCustomAvatarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAvatarChar.trim()) return;
    onUpdateProfile({
      ...userProfile,
      avatarLetter: customAvatarChar.trim().substring(0, 2)
    });
    setCustomAvatarChar('');
    setShowAvatarPicker(false);
  };

  // Simulated PIN / Password change
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinMessage({ text: 'El nuevo PIN debe tener exactamente 4 dígitos.', type: 'error' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: 'La confirmación del PIN no coincide.', type: 'error' });
      return;
    }

    setPinMessage({ text: '¡Contraseña / PIN de acceso actualizado con éxito!', type: 'success' });
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');

    setTimeout(() => {
      setPinMessage(null);
      setActiveSheet('none');
    }, 1800);
  };

  // Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newAddress.trim()) return;

    const updatedAddresses = [...addresses, { label: newLabel.trim(), address: newAddress.trim() }];
    setAddresses(updatedAddresses);
    onUpdateProfile({
      ...userProfile,
      addresses: updatedAddresses
    });

    setNewLabel('');
    setNewAddress('');
  };

  // Remove Address
  const handleRemoveAddress = (index: number) => {
    const updated = addresses.filter((_, idx) => idx !== index);
    setAddresses(updated);
    onUpdateProfile({
      ...userProfile,
      addresses: updated
    });
  };

  // Select Default Payment Method
  const handleSelectDefaultPayment = (id: string) => {
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === id
    })));
  };

  // Add New Payment Method
  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayNumber.trim()) return;

    const method: PaymentMethod = {
      id: `pay-${Date.now()}`,
      type: newPayType,
      name: newPayType === 'nequi' ? 'Nequi Simulado' : `Tarjeta **** ${newPayNumber.slice(-4) || '9999'}`,
      detail: newPayType === 'nequi' ? `+57 ${newPayNumber}` : `Vence ${newPayDetail || '12/30'}`,
      isDefault: false
    };

    setPaymentMethods(prev => [...prev, method]);
    setIsAddingPayment(false);
    setNewPayNumber('');
    setNewPayDetail('');
    alert(`Se agregó con éxito el nuevo método de pago (${newPayType.toUpperCase()}).`);
  };

  // Delete Payment Method
  const handleDeletePayment = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault) {
      alert("No puedes eliminar el método de pago predeterminado.");
      return;
    }
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  // Claim Coupon Code
  const handleClaimCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    // Check if coupon exists
    const alreadyExists = coupons.find(c => c.code === code);
    if (alreadyExists) {
      if (alreadyExists.status === 'disponible') {
        setPromoFeedback({ text: `El código ${code} ya está disponible en tu cartera.`, type: 'error' });
      } else {
        setPromoFeedback({ text: `Este código promocional ya fue utilizado o venció.`, type: 'error' });
      }
      return;
    }

    // Accept certain codes or simulate success
    if (code.startsWith('MOVICA') || code.startsWith('PROMO') || code.startsWith('AHORRA')) {
      const newCoupon: Coupon = {
        code,
        discount: '$4.000 COP',
        description: 'Descuento especial reclamado por código promocional',
        validUntil: '30 Sep, 2026',
        status: 'disponible'
      };
      setCoupons(prev => [newCoupon, ...prev]);
      setPromoFeedback({ text: `¡Cupón ${code} reclamado con éxito! Se aplicará en tu próximo viaje.`, type: 'success' });
      setPromoCodeInput('');
    } else {
      setPromoFeedback({ text: 'Código promocional no válido. Intenta con "MOVICA77" o "PROMOVIAJE".', type: 'error' });
    }

    setTimeout(() => {
      setPromoFeedback(null);
    }, 3000);
  };

  // Chat Support Sending
  const handleSendHelpMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: 'Ahora'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulated responses
    setTimeout(() => {
      let replyText = 'Estamos analizando tu caso. Permíteme escalar con el equipo de operaciones en Aguachica para darte prioridad de atención.';
      const textLower = userMsg.text.toLowerCase();

      if (textLower.includes('cupon') || textLower.includes('promo') || textLower.includes('descuento')) {
        replyText = 'Puedes ver todos tus cupones activos ingresando a la sección "Cupones y Promociones" en tu perfil. Al solicitar un mototaxi, el descuento elegible se restará automáticamente de la tarifa base.';
      } else if (textLower.includes('perfil') || textLower.includes('cambiar') || textLower.includes('celular') || textLower.includes('foto')) {
        replyText = 'Para cambiar tu foto o información de contacto, ve a "Editar Información Personal" desde tu panel. Si cambias de número celular, te enviaremos las confirmaciones de viaje al nuevo número inmediatamente.';
      } else if (textLower.includes('tarifa') || textLower.includes('pago') || textLower.includes('nequi')) {
        replyText = '¡Claro! En Aguachica puedes abonar en efectivo, Nequi o Daviplata. Recuerda definir tu método de pago preferido para que el aliado lo sepa de antemano.';
      }

      setChatMessages(prev => [...prev, {
        id: `m-support-${Date.now()}`,
        sender: 'support',
        text: replyText,
        timestamp: 'Ahora'
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Profile Options List
  const profileOptions = [
    { id: 'edit-profile' as SheetType, label: 'Editar perfil', desc: 'Nombre, celular, correo y avatar', icon: '👤', bg: 'bg-indigo-50 text-indigo-600' },
    { id: 'addresses' as SheetType, label: 'Mis direcciones', desc: 'Gestiona tus lugares más frecuentes', icon: '📍', bg: 'bg-sky-50 text-sky-600' },
    { id: 'payment-methods' as SheetType, label: 'Métodos de pago', desc: 'Efectivo, Nequi y tarjetas registradas', icon: '💳', bg: 'bg-emerald-50 text-emerald-600' },
    { id: 'historial' as SheetType, label: 'Historial', desc: 'Tus viajes y pedidos anteriores', icon: '📜', bg: 'bg-indigo-50 text-indigo-600' },
    { id: 'favoritos' as SheetType, label: 'Favoritos', desc: 'Tus lugares y comercios favoritos', icon: '❤️', bg: 'bg-rose-50 text-rose-600' },
    { id: 'settings' as SheetType, label: 'Notificaciones', desc: 'Configura tus alertas push y SMS', icon: '🔔', bg: 'bg-purple-50 text-purple-600' },
    { id: 'change-password' as SheetType, label: 'Configuración', desc: 'PIN de seguridad y ajustes de cuenta', icon: '⚙️', bg: 'bg-amber-50 text-amber-600' },
    { id: 'help-center' as SheetType, label: 'Ayuda', desc: 'Preguntas frecuentes y soporte en vivo', icon: '💬', bg: 'bg-cyan-50 text-cyan-600' },
    { id: 'security-center' as SheetType, label: 'Centro de seguridad', desc: 'Alertas SOS y contactos de confianza', icon: '🛡️', bg: 'bg-red-50 text-red-600' }
  ];

  return (
    <div className="w-full h-full relative">
      
      {/* PROFILE HEADER CARD */}
      <div className="flex flex-col items-center text-center space-y-3 mb-6 mt-2 relative">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-sora font-extrabold text-3xl shadow-lg relative border-4 border-white">
            {userProfile.avatarLetter}
          </div>
          
          {/* Change Avatar Button Trigger */}
          <button
            type="button"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute bottom-0 right-0 w-7 h-7 bg-white hover:bg-surface-alt border border-divider rounded-full flex items-center justify-center shadow-md text-primary cursor-pointer active:scale-90 transition-transform"
            title="Cambiar Foto de Perfil"
          >
            <Camera size={13} />
          </button>
        </div>

        <div>
          <h3 className="font-sora font-extrabold text-lg text-ink leading-tight">{userProfile.name}</h3>
          <p className="text-xs text-ink-soft font-semibold mt-0.5">{userProfile.email}</p>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1 font-mono">{userProfile.phone}</p>
        </div>

        {/* AVATAR PICKER DROPDOWN POPOVER */}
        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-24 bg-white border border-divider/70 rounded-3xl p-4 shadow-2xl z-30 w-72 text-left space-y-3"
            >
              <div className="flex justify-between items-center pb-2 border-b border-divider/40">
                <span className="font-sora font-bold text-xs text-ink">Elegir Avatar / Foto</span>
                <button 
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-ink-soft hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Grid of Emojis and Preset Letters */}
              <div>
                <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider mb-2">Iconos Predeterminados</label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map(char => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => selectAvatarChar(char)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all hover:bg-primary-surface cursor-pointer ${
                        userProfile.avatarLetter === char ? 'bg-primary text-white hover:bg-primary' : 'bg-surface-alt text-ink'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <form onSubmit={handleCustomAvatarSubmit} className="space-y-1.5 pt-1.5 border-t border-divider/40">
                <label className="block text-[9px] font-bold text-ink-soft uppercase tracking-wider">O escribe tus iniciales / emoji</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    maxLength={2}
                    value={customAvatarChar}
                    onChange={e => setCustomAvatarChar(e.target.value)}
                    placeholder="Ej: FG"
                    className="flex-1 bg-surface-alt border-0 rounded-lg px-2.5 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold text-center"
                  />
                  <button
                    type="submit"
                    disabled={!customAvatarChar.trim()}
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:bg-ink-faint"
                  >
                    Usar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROFILE SECTIONS LIST */}
      <div className="space-y-2 pb-6">
        {profileOptions.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              if (option.id === 'edit-profile') {
                setEditName(userProfile.name);
                setEditEmail(userProfile.email);
                setEditPhone(userProfile.phone);
              }
              if (option.id === 'historial') {
                onNavigateToTab?.('historial');
                return;
              }
              if (option.id === 'favoritos') {
                onNavigateToTab?.('favoritos');
                return;
              }
              if (option.id === 'security-center') {
                onOpenSecurity?.();
                return;
              }
              setActiveSheet(option.id);
            }}
            className="w-full bg-white border border-divider/50 rounded-2xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-alt/25 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <span className={`text-base p-2.5 rounded-xl block font-bold ${option.bg}`}>
                {option.icon}
              </span>
              <div className="min-w-0">
                <span className="font-sora font-bold text-xs text-ink block leading-snug">{option.label}</span>
                <span className="text-[9px] text-ink-soft font-semibold truncate block mt-0.5">{option.desc}</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-soft/70 flex-shrink-0 ml-2" />
          </button>
        ))}

        {/* LOG OUT BUTTON */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full bg-white border border-red-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-red-50/25 transition-all text-left mt-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-base bg-red-50 text-red-500 p-2.5 rounded-xl block">🚪</span>
            <div>
              <span className="font-sora font-bold text-xs text-red-600 block">Cerrar Sesión</span>
              <span className="text-[9px] text-red-400 font-semibold mt-0.5">Salir de tu cuenta en este dispositivo</span>
            </div>
          </div>
          <ChevronRight size={14} className="text-red-300" />
        </button>
      </div>

      {/* =========================================================================
          SHEETS OVERLAYS (Animate SlideUp)
          ========================================================================= */}
      <AnimatePresence>
        {activeSheet !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 flex flex-col pt-12 text-left"
          >
            
            {/* Sheet Header */}
            <div className="px-6 pb-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <span className="font-sora font-black text-sm text-ink block">
                  {profileOptions.find(o => o.id === activeSheet)?.label || 'Opciones'}
                </span>
                <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block mt-0.5">
                  Movica • Aguachica, Cesar
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSheet('none');
                  setIsAddingPayment(false);
                }}
                className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sheet Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 content-scrollbar pb-24 bg-white">
              
              {/* SHEET 1: EDIT PROFILE */}
              {activeSheet === 'edit-profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="bg-primary-surface/20 p-4 rounded-2xl border border-primary/10 flex items-center gap-3">
                      <span className="text-2xl">💡</span>
                      <p className="text-[11px] text-primary-dark font-medium leading-relaxed">
                        Para cambiar tu avatar o foto, presiona la cámara pequeña debajo de tu inicial en la pantalla principal del perfil.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Número Celular</label>
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 mt-6"
                  >
                    <Save size={14} /> Guardar Datos
                  </button>
                </form>
              )}

              {/* SHEET 2: CHANGE PASSWORD */}
              {activeSheet === 'change-password' && (
                <form onSubmit={handleChangePin} className="space-y-4">
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-xl">🔑</span>
                    <div className="text-left">
                      <h5 className="font-sora font-bold text-xs text-amber-800">PIN de Seguridad</h5>
                      <p className="text-[10px] text-amber-700/80 leading-relaxed mt-0.5">
                        Movica utiliza un PIN numérico rápido de 4 dígitos para autorizar pagos y acceder de forma segura a tu cuenta.
                      </p>
                    </div>
                  </div>

                  {pinMessage && (
                    <div className={`p-3 rounded-xl text-xs font-semibold ${
                      pinMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {pinMessage.text}
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">PIN Actual (Opcional)</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={currentPin}
                        onChange={e => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-center tracking-widest text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Nuevo PIN de Acceso (4 dígitos)</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="••••"
                        value={newPin}
                        onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-center tracking-widest text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Confirmar Nuevo PIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="••••"
                        value={confirmPin}
                        onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-center tracking-widest text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 mt-4"
                  >
                    <Lock size={13} /> Actualizar PIN de Acceso
                  </button>
                </form>
              )}

              {/* SHEET 3: ADDRESSES */}
              {activeSheet === 'addresses' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-ink-soft uppercase tracking-wider">Direcciones Registradas</h4>
                    
                    {addresses.length === 0 ? (
                      <div className="p-6 text-center bg-surface-alt/30 border border-divider/30 rounded-2xl">
                        <span className="text-2xl block mb-2">📍</span>
                        <p className="text-xs text-ink-soft italic font-semibold">No tienes direcciones guardadas.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {addresses.map((addr, idx) => (
                          <div key={idx} className="p-3 bg-surface-alt/60 rounded-2xl border border-divider/30 flex items-center justify-between gap-3 shadow-xs">
                            <div className="text-left min-w-0">
                              <span className="text-[9px] font-black bg-primary-surface text-primary-dark px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {addr.label}
                              </span>
                              <p className="text-xs text-ink font-bold mt-1 truncate">{addr.address}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAddress(idx)}
                              className="text-[10px] text-red-500 font-extrabold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Address Form inside Drawer */}
                  <form onSubmit={handleAddAddress} className="bg-surface-alt/40 p-4 rounded-2xl border border-divider/60 space-y-3.5">
                    <h5 className="font-sora font-extrabold text-xs text-ink">Agregar Nueva Dirección</h5>
                    
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Casa', 'Trabajo', 'Estudio', 'Favorito'].map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setNewLabel(l)}
                          className={`py-2 px-1 rounded-xl text-[10px] font-bold border text-center transition-all cursor-pointer ${
                            newLabel === l 
                              ? 'border-primary bg-primary-surface text-primary-dark shadow-xs' 
                              : 'border-divider/50 bg-white text-ink-soft hover:bg-surface-alt/50'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      required
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      placeholder="Dirección completa (Ej: Calle 5 # 10-25, Barrio Centro)..."
                      className="w-full bg-white border border-divider rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />

                    <button
                      type="submit"
                      disabled={!newLabel || !newAddress.trim()}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                        newLabel && newAddress.trim()
                          ? 'bg-primary hover:bg-primary-dark text-white cursor-pointer shadow-md shadow-primary/10'
                          : 'bg-ink-faint text-white cursor-not-allowed'
                      }`}
                    >
                      <Plus size={13} /> Guardar Dirección
                    </button>
                  </form>
                </div>
              )}

              {/* SHEET 4: PAYMENT METHODS */}
              {activeSheet === 'payment-methods' && (
                <div className="space-y-4">
                  <PaymentBillingSystem mode="cliente" userProfile={userProfile} />
                </div>
              )}

              {/* SHEET 5: COUPONS & PROMOTIONS */}
              {activeSheet === 'coupons' && (
                <PromoAndCoupons initialViewMode="user" />
              )}

              {/* SHEET: ACHIEVEMENTS */}
              {activeSheet === 'achievements' && (
                <AchievementsSystem mode="cliente" />
              )}

              {/* SHEET 6: SETTINGS & NOTIFICATIONS */}
              {activeSheet === 'settings' && (
                <div className="space-y-5">
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-black text-ink-soft uppercase tracking-wider">Preferencias de Alertas</h4>
                    
                    {/* Push notifications */}
                    <div className="flex items-center justify-between p-4 bg-surface-alt/40 rounded-2xl border border-divider/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📱</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-ink block">Notificaciones Push</span>
                          <span className="text-[9.5px] text-ink-soft block leading-normal">Aviso inmediato en pantalla de llegada del conductor</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={pushNotif} 
                        onChange={e => setPushNotif(e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface-alt border-divider rounded focus:ring-primary accent-primary cursor-pointer"
                      />
                    </div>

                    {/* SMS Alerts */}
                    <div className="flex items-center justify-between p-4 bg-surface-alt/40 rounded-2xl border border-divider/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💬</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-ink block">Mensajería SMS</span>
                          <span className="text-[9.5px] text-ink-soft block leading-normal">Mensajes de texto con número de placa y contacto de aliado</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={smsNotif} 
                        onChange={e => setSmsNotif(e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface-alt border-divider rounded focus:ring-primary accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Email Newsletters */}
                    <div className="flex items-center justify-between p-4 bg-surface-alt/40 rounded-2xl border border-divider/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📧</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-ink block">Boletín de Promociones</span>
                          <span className="text-[9.5px] text-ink-soft block leading-normal">Códigos de descuento mensuales y ofertas por correo</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={emailPromo} 
                        onChange={e => setEmailPromo(e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface-alt border-divider rounded focus:ring-primary accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Location Sharing */}
                    <div className="flex items-center justify-between p-4 bg-surface-alt/40 rounded-2xl border border-divider/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📍</span>
                        <div className="text-left">
                          <span className="text-xs font-bold text-ink block">Compartir GPS en Segundo Plano</span>
                          <span className="text-[9.5px] text-ink-soft block leading-normal">Ubicación exacta para una rápida asignación en radar</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={locationShare} 
                        onChange={e => setLocationShare(e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface-alt border-divider rounded focus:ring-primary accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-primary-surface/20 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
                    <Shield size={16} className="text-primary-dark mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <h5 className="font-sora font-bold text-xs text-primary-dark">Privacidad Asegurada</h5>
                      <p className="text-[10px] text-ink-soft leading-relaxed mt-0.5">
                        Tus configuraciones se guardan localmente para garantizar el menor consumo de datos posible en Aguachica. Movica nunca vende tu información.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Preferencias de notificaciones y ubicación guardadas correctamente.");
                      setActiveSheet('none');
                    }}
                    className="w-full bg-[#0d1a16] hover:bg-black text-white font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer mt-4"
                  >
                    Guardar Preferencias
                  </button>
                </div>
              )}

              {/* SHEET 7: HELP CENTER */}
              {activeSheet === 'help-center' && (
                <div className="space-y-6">
                  
                  {/* FAQs accordion */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-black text-ink-soft uppercase tracking-wider">Preguntas Comunes</h4>
                    
                    {FAQS.slice(0, 5).map((faq, idx) => {
                      const isExpanded = expandedFaq === idx;
                      return (
                        <div 
                          key={idx} 
                          className="bg-white border border-divider/50 rounded-2xl overflow-hidden transition-all shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                            className="w-full p-3.5 flex items-center justify-between text-left font-bold text-xs text-ink cursor-pointer hover:bg-surface-alt/20 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <HelpCircle size={14} className="text-primary flex-shrink-0" />
                              <span>{faq.q}</span>
                            </div>
                            <ChevronRight 
                              size={12} 
                              className={`text-ink-soft transition-transform duration-200 ${isExpanded ? 'rotate-90 text-primary' : ''}`} 
                            />
                          </button>
                          
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 text-xs text-ink-soft leading-relaxed border-t border-divider/30 bg-surface-alt/5 animate-fadeIn">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Sofia Support Live Chat card */}
                  <div className="bg-gradient-to-br from-primary-surface/60 to-primary-surface p-5 rounded-3xl border border-primary-surface flex flex-col gap-3 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center text-lg shadow-sm">
                        💬
                      </div>
                      <div className="text-left">
                        <h4 className="font-sora font-bold text-xs text-ink">¿Soporte inmediato?</h4>
                        <p className="text-[10px] text-ink-soft mt-0.5 leading-relaxed">Chatea directamente con Sofía o llámanos para resolver dudas en vivo.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowChat(true)}
                        className="bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        <MessageSquare size={12} /> Chatear en Vivo
                      </button>
                      
                      <a
                        href="tel:+573001234567"
                        className="bg-white hover:bg-surface-alt text-ink border border-divider/60 py-3 px-4 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 text-center"
                      >
                        📞 Llamar Línea
                      </a>
                    </div>
                  </div>

                  {/* SOPORTE LIVE CHAT OVERLAY INSIDE HELP SHEET */}
                  <AnimatePresence>
                    {showChat && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute inset-0 bg-white z-50 flex flex-col pt-12"
                      >
                        {/* Chat Header */}
                        <div className="px-6 pb-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-primary-surface text-lg flex items-center justify-center relative">
                              👩‍💼
                              <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary border-2 border-white rounded-full"></span>
                            </div>
                            <div className="text-left">
                              <h4 className="font-sora font-extrabold text-xs text-ink leading-tight">Sofía de Movica</h4>
                              <p className="text-[9px] text-[#0EA65C] font-black uppercase tracking-wider">Soporte Aguachica</p>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setShowChat(false)}
                            className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface-alt/10 content-scrollbar pb-24 text-left">
                          {chatMessages.map(msg => {
                            const isSupport = msg.sender === 'support';
                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isSupport ? 'justify-start' : 'justify-end'} animate-scaleIn`}
                              >
                                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                                  isSupport 
                                    ? 'bg-white text-ink border border-divider/50 rounded-tl-none' 
                                    : 'bg-primary text-white rounded-tr-none font-medium'
                                }`}>
                                  <p>{msg.text}</p>
                                  <span className={`text-[8.5px] block text-right mt-1.5 ${isSupport ? 'text-ink-faint' : 'text-white/60'}`}>
                                    {msg.timestamp}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white text-ink border border-divider/50 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                              </div>
                            </div>
                          )}
                          
                          <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input Bar */}
                        <form 
                          onSubmit={handleSendHelpMessage}
                          className="absolute bottom-4 left-4 right-4 bg-white border border-divider rounded-2xl p-1.5 flex items-center gap-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all"
                        >
                          <input
                            type="text"
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            placeholder="Escribe tu consulta sobre Movica..."
                            className="flex-1 bg-transparent border-0 px-3 py-2 text-xs outline-none text-ink font-semibold"
                          />
                          <button
                            type="submit"
                            disabled={!inputMessage.trim()}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                              inputMessage.trim() 
                                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95' 
                                : 'bg-surface-alt text-ink-faint'
                            }`}
                          >
                            <Send size={13} />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )}

              {/* SHEET 8: TERMS AND CONDITIONS */}
              {activeSheet === 'terms' && (
                <div className="space-y-4 text-left leading-relaxed text-xs text-ink-soft">
                  <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-divider rounded-2xl mb-2">
                    <FileText className="text-primary flex-shrink-0" size={18} />
                    <div>
                      <span className="font-sora font-extrabold text-xs text-ink block">Contrato de Uso</span>
                      <span className="text-[9px] text-ink-soft font-bold">Vigente desde el 01 de Enero de 2026</span>
                    </div>
                  </div>

                  <p className="font-bold text-ink">1. Aceptación del Acuerdo</p>
                  <p>
                    Al descargar, instalar o utilizar la plataforma Movica, el usuario acepta de manera expresa y sin reserva los presentes Términos y Condiciones. El servicio opera en Aguachica, Cesar y municipios aledaños.
                  </p>

                  <p className="font-bold text-ink">2. Objeto del Servicio</p>
                  <p>
                    Movica funciona exclusivamente como una plataforma tecnológica que conecta a usuarios pasajeros con mototaxistas o mensajeros independientes (denominados "Aliados"). Movica no es una empresa de transporte ni de encomiendas de forma directa.
                  </p>

                  <p className="font-bold text-ink">3. Tarifas y Tarifas Base</p>
                  <p>
                    Las tarifas estimadas por el radar son de carácter sugerido. El precio del servicio se acuerda directamente con el aliado al finalizar de acuerdo con las condiciones del tráfico u obstáculos geográficos en el Cesar. El usuario se compromete a abonar el valor pactado.
                  </p>

                  <p className="font-bold text-ink">4. Responsabilidades del Pasajero</p>
                  <p>
                    El usuario pasajero se compromete a utilizar el casco provisto por el conductor de acuerdo a las reglamentaciones de tránsito vigentes, comportarse de manera decorosa y no transportar mercancías de procedencia ilícita o peligrosa.
                  </p>

                  <p className="font-bold text-ink">5. Exclusiones de Responsabilidad</p>
                  <p>
                    Dado que el vínculo se efectúa entre particulares e independientes, Movica no se responsabiliza por retrasos causados por condiciones climáticas, accidentes en la vía pública o altercados entre las partes.
                  </p>
                </div>
              )}

              {/* SHEET 9: PRIVACY POLICY */}
              {activeSheet === 'privacy' && (
                <div className="space-y-4 text-left leading-relaxed text-xs text-ink-soft">
                  <div className="flex items-center gap-2.5 p-3.5 bg-teal-50/50 border border-teal-200/50 rounded-2xl mb-2">
                    <Shield className="text-teal-600 flex-shrink-0" size={18} />
                    <div>
                      <span className="font-sora font-extrabold text-xs text-teal-800 block">Tratamiento de Datos</span>
                      <span className="text-[9px] text-teal-700 font-bold">Habeas Data • Ley 1581 de 2012</span>
                    </div>
                  </div>

                  <p className="font-bold text-ink">1. Recolección de Datos de Geolocalización</p>
                  <p>
                    Para posibilitar la asignación inteligente del mototaxi o domiciliario más cercano en la región de Aguachica, Movica recopila datos de ubicación GPS exacta en tiempo real, incluso cuando la aplicación se encuentra en segundo plano, siempre que se esté ejecutando un servicio activo.
                  </p>

                  <p className="font-bold text-ink">2. Información de Perfil</p>
                  <p>
                    Almacenamos de manera segura tu nombre completo, número de teléfono, correo electrónico y direcciones guardadas para optimizar la experiencia de reserva. Estos datos no serán revelados a terceros con fines publicitarios.
                  </p>

                  <p className="font-bold text-ink">3. Uso de Mensajería SMS y Datos de Contacto</p>
                  <p>
                    Tu número celular será compartido con el Aliado asignado únicamente durante el desarrollo del viaje para facilitar la recogida. Movica también te enviará notificaciones por SMS con el resumen y valor de tu servicio.
                  </p>

                  <p className="font-bold text-ink">4. Ejercicio de Derechos de Acceso y Rectificación</p>
                  <p>
                    De acuerdo con las leyes colombianas de protección de datos, puedes ejercer tus derechos para consultar, actualizar o solicitar la supresión de tus datos de la base de datos de Movica enviando un correo a soporte@movica.co.
                  </p>
                </div>
              )}

              {/* SHEET 10: RATINGS & REVIEWS (MODULO 15) */}
              {activeSheet === 'ratings' && (
                <div className="space-y-4">
                  <RatingsSystem initialViewMode="client" />
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
