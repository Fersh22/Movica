import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, Sparkles, Share2, Users, Award, TrendingUp, Copy, Check, 
  CheckCircle2, Trash2, Plus, Calendar, Clock, ArrowRight, Tag, 
  ToggleLeft, ToggleRight, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  status: 'disponible' | 'usado' | 'vencido';
  startDate?: string;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'mototaxi' | 'domicilio' | 'efectivo' | 'comercio';
  badge: string;
  discount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  icon?: string;
}

export interface ReferralData {
  referralCode: string;
  friendsCount: number;
  totalEarned: number;
  balance: number;
  history: {
    id: string;
    friendName: string;
    date: string;
    status: 'completado' | 'pendiente';
    reward: number;
  }[];
}

export interface PromoHistoryItem {
  id: string;
  type: 'coupon' | 'promotion' | 'referral';
  name: string;
  value: string;
  date: string;
  time: string;
}

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'MOVICA10',
    discount: '10% de Descuento',
    description: 'Descuento especial en tu próximo viaje de Mototaxi',
    validUntil: '2026-12-31',
    status: 'disponible',
    isActive: true
  },
  {
    id: 'c-2',
    code: 'PRIMERVIAJE',
    discount: '$5.000 COP',
    description: 'Bono de bienvenida para nuevos usuarios en Aguachica',
    validUntil: '2026-08-15',
    status: 'disponible',
    isActive: true
  },
  {
    id: 'c-3',
    code: 'DOMICILIOGRATIS',
    discount: 'Envío Gratis',
    description: 'Envío sin costo para pedidos superiores a $15.000 COP',
    validUntil: '2026-09-30',
    status: 'disponible',
    isActive: true
  },
  {
    id: 'c-4',
    code: 'PROMOANIVERSARIO',
    discount: '$2.000 COP',
    description: 'Celebración de nuestro primer aniversario local',
    validUntil: '2026-01-01',
    status: 'vencido',
    isActive: false
  }
];

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'p-1',
    title: '20% de descuento en Mototaxi',
    description: 'Aplica de lunes a viernes en horas de la tarde por las calles de Aguachica.',
    type: 'mototaxi',
    badge: 'Mototaxi 🛵',
    discount: '20% OFF',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    isActive: true,
    icon: '🛵'
  },
  {
    id: 'p-2',
    title: 'Envío gratis en domicilios de fin de semana',
    description: 'Pide tus antojos los sábados y domingos en restaurantes aliados.',
    type: 'domicilio',
    badge: 'Domicilios 🍔',
    discount: 'Envío Gratis',
    startDate: '2026-07-01',
    endDate: '2026-08-30',
    isActive: true,
    icon: '🍔'
  },
  {
    id: 'p-3',
    title: 'Descuento por pago en efectivo',
    description: 'Ahorra $500 COP adicionales pagando en efectivo al finalizar tu viaje.',
    type: 'efectivo',
    badge: 'Pago Efectivo 💵',
    discount: '-$500 COP',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    isActive: true,
    icon: '💵'
  },
  {
    id: 'p-4',
    title: 'Super Descuento: Panadería El Trigal 🥐',
    description: '15% de descuento en pedidos seleccionados de repostería.',
    type: 'comercio',
    badge: 'Comercio Aliado 🥐',
    discount: '15% OFF',
    startDate: '2026-06-15',
    endDate: '2026-07-20',
    isActive: true,
    icon: '🥐'
  }
];

const DEFAULT_REFERRAL: ReferralData = {
  referralCode: 'MOVICA-ALVAREZ72',
  friendsCount: 4,
  totalEarned: 24000,
  balance: 12000,
  history: [
    { id: 'ref-1', friendName: 'Carlos Mario Peña', date: 'Hoy, 09:30 AM', status: 'completado', reward: 6000 },
    { id: 'ref-2', friendName: 'Andres Felipe Ortiz', date: '02 Jul 2026', status: 'completado', reward: 6000 },
    { id: 'ref-3', friendName: 'Maria Camila Vega', date: '29 Jun 2026', status: 'completado', reward: 6000 },
    { id: 'ref-4', friendName: 'Yeison Ramirez', date: '25 Jun 2026', status: 'completado', reward: 6000 },
    { id: 'ref-5', friendName: 'Diana Patricia Gomez', date: 'Ayer, 04:15 PM', status: 'pendiente', reward: 6000 }
  ]
};

const DEFAULT_HISTORY: PromoHistoryItem[] = [
  {
    id: 'h-1',
    type: 'coupon',
    name: 'Cupón PRIMERVIAJE Canjeado',
    value: '-$5.000 COP',
    date: '28 Jun 2026',
    time: '03:14 PM'
  },
  {
    id: 'h-2',
    type: 'promotion',
    name: 'Descuento Pago en Efectivo Aplicado',
    value: '-$500 COP',
    date: '02 Jul 2026',
    time: '11:45 AM'
  },
  {
    id: 'h-3',
    type: 'referral',
    name: 'Recompensa por Invitar a Carlos Mario',
    value: '+$6.000 COP',
    date: 'Hoy, 09:30 AM',
    time: '09:30 AM'
  }
];

interface RatingsSystemProps {
  initialViewMode?: 'user' | 'admin';
}

export default function PromoAndCoupons({ initialViewMode = 'user' }: { initialViewMode?: 'user' | 'admin' }) {
  // Main lists loaded from localStorage or defaults
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [referral, setReferral] = useState<ReferralData>(DEFAULT_REFERRAL);
  const [history, setHistory] = useState<PromoHistoryItem[]>([]);

  // Subsections in User View
  const [userTab, setUserTab] = useState<'cupones' | 'promos' | 'referidos' | 'historial'>('cupones');

  // Input states for claiming coupon in User view
  const [couponInput, setCouponInput] = useState('');
  const [claimFeedback, setClaimFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states for creating NEW items in Admin view
  const [adminSection, setAdminSection] = useState<'create_coupon' | 'create_promo'>('create_coupon');
  
  // Create Coupon Fields
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponValid, setNewCouponValid] = useState('');

  // Create Promo Fields
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoType, setNewPromoType] = useState<'mototaxi' | 'domicilio' | 'efectivo' | 'comercio'>('mototaxi');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');
  const [newPromoStart, setNewPromoStart] = useState('');
  const [newPromoEnd, setNewPromoEnd] = useState('');

  // Floating Toast Alert State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load
  useEffect(() => {
    const storedCoupons = localStorage.getItem('movica_coupons');
    const storedPromotions = localStorage.getItem('movica_promotions');
    const storedReferral = localStorage.getItem('movica_referrals');
    const storedHistory = localStorage.getItem('movica_promo_history');

    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons));
    } else {
      setCoupons(DEFAULT_COUPONS);
      localStorage.setItem('movica_coupons', JSON.stringify(DEFAULT_COUPONS));
    }

    if (storedPromotions) {
      setPromotions(JSON.parse(storedPromotions));
    } else {
      setPromotions(DEFAULT_PROMOTIONS);
      localStorage.setItem('movica_promotions', JSON.stringify(DEFAULT_PROMOTIONS));
    }

    if (storedReferral) {
      setReferral(JSON.parse(storedReferral));
    } else {
      setReferral(DEFAULT_REFERRAL);
      localStorage.setItem('movica_referrals', JSON.stringify(DEFAULT_REFERRAL));
    }

    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      setHistory(DEFAULT_HISTORY);
      localStorage.setItem('movica_promo_history', JSON.stringify(DEFAULT_HISTORY));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Claim a coupon in user view
  const handleClaimCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const codeClean = couponInput.trim().toUpperCase();
    if (!codeClean) return;

    // Search coupon in loaded coupons list
    const foundIdx = coupons.findIndex(c => c.code === codeClean);
    if (foundIdx === -1) {
      setClaimFeedback({
        text: `❌ El cupón "${codeClean}" no existe o no es válido en Aguachica.`,
        type: 'error'
      });
      return;
    }

    const coupon = coupons[foundIdx];
    if (!coupon.isActive) {
      setClaimFeedback({
        text: `❌ El cupón "${codeClean}" ha sido desactivado por administración.`,
        type: 'error'
      });
      return;
    }

    if (coupon.status === 'vencido') {
      setClaimFeedback({
        text: `❌ El cupón "${codeClean}" venció el día ${coupon.validUntil}.`,
        type: 'error'
      });
      return;
    }

    if (coupon.status === 'usado') {
      setClaimFeedback({
        text: `❌ Ya has utilizado el cupón "${codeClean}" anteriormente.`,
        type: 'error'
      });
      return;
    }

    // Claim success!
    const updatedCoupons = [...coupons];
    updatedCoupons[foundIdx] = {
      ...coupon,
      status: 'usado'
    };
    setCoupons(updatedCoupons);
    localStorage.setItem('movica_coupons', JSON.stringify(updatedCoupons));

    // Append to history
    const newHistoryItem: PromoHistoryItem = {
      id: `h-claimed-${Math.floor(Math.random() * 900) + 100}`,
      type: 'coupon',
      name: `Cupón ${codeClean} Canjeado`,
      value: `-${coupon.discount}`,
      date: 'Hoy',
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('movica_promo_history', JSON.stringify(updatedHistory));

    setClaimFeedback({
      text: `🎉 ¡Cupón "${codeClean}" canjeado con éxito! Se aplicará ${coupon.discount} de descuento en tu próximo viaje.`,
      type: 'success'
    });
    setCouponInput('');
    triggerToast(`🎉 Cupón ${codeClean} activado.`);
  };

  // Use (apply) a coupon
  const handleUseCoupon = (id: string, code: string, discount: string) => {
    const updatedCoupons = coupons.map(c => {
      if (c.id === id) {
        return { ...c, status: 'usado' as const };
      }
      return c;
    });
    setCoupons(updatedCoupons);
    localStorage.setItem('movica_coupons', JSON.stringify(updatedCoupons));

    const newHistoryItem: PromoHistoryItem = {
      id: `h-use-${Math.floor(Math.random() * 900) + 100}`,
      type: 'coupon',
      name: `Cupón ${code} utilizado`,
      value: `-${discount}`,
      date: 'Hoy',
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('movica_promo_history', JSON.stringify(updatedHistory));

    triggerToast(`✅ Cupón ${code} aplicado correctamente.`);
  };

  // Copy referral code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referral.referralCode);
    triggerToast('📋 ¡Código de referido copiado al portapapeles!');
  };

  // Invite friends (Simulated trigger WhatsApp share)
  const handleShareInvite = () => {
    triggerToast('💬 Abriendo invitación para enviar a tus amigos en Aguachica...');
  };

  // ADMIN: Toggle coupon status
  const handleToggleCoupon = (id: string) => {
    const updated = coupons.map(c => {
      if (c.id === id) {
        return { ...c, isActive: !c.isActive };
      }
      return c;
    });
    setCoupons(updated);
    localStorage.setItem('movica_coupons', JSON.stringify(updated));
    triggerToast('⚙️ Estado del cupón actualizado.');
  };

  // ADMIN: Toggle promotion status
  const handleTogglePromo = (id: string) => {
    const updated = promotions.map(p => {
      if (p.id === id) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    setPromotions(updated);
    localStorage.setItem('movica_promotions', JSON.stringify(updated));
    triggerToast('⚙️ Estado de la promoción actualizado.');
  };

  // ADMIN: Create Coupon Submit
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDiscount.trim() || !newCouponDesc.trim() || !newCouponValid) {
      triggerToast('⚠️ Por favor completa todos los campos del cupón.');
      return;
    }

    const newCoupon: Coupon = {
      id: `c-new-${Math.floor(Math.random() * 9000) + 1000}`,
      code: newCouponCode.trim().toUpperCase(),
      discount: newCouponDiscount.trim(),
      description: newCouponDesc.trim(),
      validUntil: newCouponValid,
      status: 'disponible',
      isActive: true
    };

    const updated = [...coupons, newCoupon];
    setCoupons(updated);
    localStorage.setItem('movica_coupons', JSON.stringify(updated));

    // reset fields
    setNewCouponCode('');
    setNewCouponDiscount('');
    setNewCouponDesc('');
    setNewCouponValid('');
    triggerToast('🎉 ¡Cupón administrativo creado exitosamente!');
  };

  // ADMIN: Create Promotion Submit
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle.trim() || !newPromoDesc.trim() || !newPromoDiscount.trim() || !newPromoStart || !newPromoEnd) {
      triggerToast('⚠️ Por favor completa todos los campos de la promoción.');
      return;
    }

    const icons = {
      mototaxi: '🛵',
      domicilio: '🍔',
      efectivo: '💵',
      comercio: '🏪'
    };

    const badges = {
      mototaxi: 'Mototaxi 🛵',
      domicilio: 'Domicilios 🍔',
      efectivo: 'Pago Efectivo 💵',
      comercio: 'Comercio Aliado 🏪'
    };

    const newPromo: Promotion = {
      id: `p-new-${Math.floor(Math.random() * 9000) + 1000}`,
      title: newPromoTitle.trim(),
      description: newPromoDesc.trim(),
      type: newPromoType,
      badge: badges[newPromoType],
      discount: newPromoDiscount.trim(),
      startDate: newPromoStart,
      endDate: newPromoEnd,
      isActive: true,
      icon: icons[newPromoType]
    };

    const updated = [...promotions, newPromo];
    setPromotions(updated);
    localStorage.setItem('movica_promotions', JSON.stringify(updated));

    // reset fields
    setNewPromoTitle('');
    setNewPromoDesc('');
    setNewPromoDiscount('');
    setNewPromoStart('');
    setNewPromoEnd('');
    triggerToast('🎉 ¡Campaña promocional creada exitosamente!');
  };

  // Render User Mode
  const renderUserMode = () => {
    return (
      <div className="space-y-5">
        
        {/* Navigation Tabs for user promos */}
        <div className="flex border-b border-divider/60 bg-surface-alt/40 p-1.5 rounded-2xl gap-1">
          {[
            { id: 'cupones', label: 'Cupones 🎁' },
            { id: 'promos', label: 'Promos 🔥' },
            { id: 'referidos', label: 'Referidos 👥' },
            { id: 'historial', label: 'Historial 📜' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setUserTab(tab.id as any)}
              className={`flex-1 text-[11px] font-black py-2.5 px-1.5 rounded-xl transition-all cursor-pointer select-none text-center ${
                userTab === tab.id 
                  ? 'bg-white text-primary shadow-xs border border-divider/40' 
                  : 'text-ink-soft hover:bg-white/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CUPONES DISPONIBLES */}
        {userTab === 'cupones' && (
          <div className="space-y-4 text-left">
            
            {/* Promo code input/claim form */}
            <form onSubmit={handleClaimCoupon} className="bg-surface-alt/60 p-4.5 rounded-3xl border border-divider/60 space-y-3.5">
              <div className="space-y-1">
                <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1.5">
                  <Tag size={13} className="text-primary" /> ¿Tienes un código promocional?
                </h5>
                <p className="text-[10px] text-ink-soft">Digítalo para canjear tu bono de descuento o saldo de regalo en Aguachica.</p>
              </div>

              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => {
                    setCouponInput(e.target.value.toUpperCase());
                    setClaimFeedback(null);
                  }}
                  placeholder="Ej: MOVICA10, PRIMERVIAJE"
                  className="flex-1 bg-white border border-divider rounded-2xl px-3.5 py-3 text-xs font-mono font-bold uppercase tracking-widest focus:outline-primary placeholder:text-ink-faint"
                />
                <button
                  type="submit"
                  disabled={!couponInput.trim()}
                  className={`px-5 py-3 rounded-2xl font-black text-xs transition-all ${
                    couponInput.trim()
                      ? 'bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-95'
                      : 'bg-divider text-ink-faint cursor-not-allowed'
                  }`}
                >
                  Canjear
                </button>
              </div>

              {claimFeedback && (
                <div className={`p-3 rounded-2xl text-[10.5px] font-bold leading-relaxed border flex items-start gap-2 ${
                  claimFeedback.type === 'success' 
                    ? 'bg-emerald-500/5 text-[#0EA65C] border-[#0EA65C]/15' 
                    : 'bg-rose-500/5 text-rose-600 border-rose-500/15'
                }`}>
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{claimFeedback.text}</span>
                </div>
              )}
            </form>

            {/* List of active available coupons */}
            <div className="space-y-3">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider">
                🎁 Cupones Disponibles para Ti
              </span>

              {coupons.filter(c => c.isActive && c.status === 'disponible').length === 0 ? (
                <div className="bg-surface-alt/40 border border-divider/60 rounded-2xl p-6 text-center text-xs text-ink-soft">
                  No tienes cupones disponibles en este momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {coupons
                    .filter(c => c.isActive && c.status === 'disponible')
                    .map((coupon) => (
                      <div 
                        key={coupon.id} 
                        className="bg-white border border-divider/60 rounded-3xl p-4.5 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono font-black text-[11px] px-3 py-1 rounded-xl bg-primary-surface text-primary-dark border border-primary/10 inline-block">
                              {coupon.code}
                            </span>
                            <h5 className="font-sora font-extrabold text-sm text-ink mt-2">{coupon.discount}</h5>
                            <p className="text-[10px] text-ink-soft leading-normal mt-0.5">
                              {coupon.description}
                            </p>
                          </div>

                          <span className="bg-emerald-50 text-[#0EA65C] text-[8.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/10">
                            Disponible
                          </span>
                        </div>

                        <div className="border-t border-divider/40 pt-2.5 flex justify-between items-center text-[9.5px] font-bold text-ink-soft">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> Vence: {coupon.validUntil}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleUseCoupon(coupon.id, coupon.code, coupon.discount)}
                            className="bg-primary hover:bg-primary-dark text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all"
                          >
                            Usar cupón
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROMOCIONES ACTIVAS */}
        {userTab === 'promos' && (
          <div className="space-y-4 text-left">
            <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
              🔥 Campañas y Promociones Activas en Aguachica
            </span>

            <div className="grid grid-cols-1 gap-3">
              {promotions.filter(p => p.isActive).map((p) => (
                <div 
                  key={p.id} 
                  className="bg-gradient-to-br from-white to-surface-alt/40 border border-divider/60 p-4.5 rounded-3xl relative overflow-hidden shadow-2xs hover:border-primary/30 transition-all flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-2xl bg-surface-alt/80 border border-divider/40 flex items-center justify-center text-2xl shrink-0">
                    {p.icon || '🔥'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                        {p.badge}
                      </span>
                      <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                        {p.discount}
                      </span>
                    </div>

                    <h5 className="font-sora font-extrabold text-xs text-ink pt-1">{p.title}</h5>
                    <p className="text-[10px] text-ink-soft leading-normal">
                      {p.description}
                    </p>

                    <div className="text-[9px] text-ink-faint flex items-center gap-1 pt-1 font-bold">
                      <Clock size={10} />
                      <span>Válido: {p.startDate} al {p.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SISTEMA DE REFERIDOS */}
        {userTab === 'referidos' && (
          <div className="space-y-4 text-left">
            
            {/* Banner referral instruction */}
            <div className="bg-gradient-to-br from-primary-dark to-[#094F2C] p-5 rounded-3xl text-white shadow-md relative overflow-hidden space-y-3.5">
              <div className="absolute -right-6 -bottom-6 text-6xl opacity-15">👥</div>
              
              <div className="space-y-1">
                <span className="bg-white/15 text-[8.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                  👥 Programa de Recompensas
                </span>
                <h4 className="font-sora font-black text-sm pt-1">Invita a tus amigos y gana recompensas</h4>
                <p className="text-[10px] text-white/80 leading-normal">
                  Comparte tu código con amigos de Aguachica. Cuando realicen su primer viaje en Movica, ambos recibirán un bono de <strong>$6.000 COP</strong> en su billetera.
                </p>
              </div>

              {/* Share box */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-white/70 font-black uppercase tracking-wider">Tu Código Único</span>
                  <p className="font-mono font-black text-sm text-white tracking-widest">{referral.referralCode}</p>
                </div>

                <div className="flex gap-1.5">
                  <button 
                    type="button"
                    onClick={handleCopyCode}
                    className="w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                  <button 
                    type="button"
                    onClick={handleShareInvite}
                    className="w-9 h-9 rounded-xl bg-[#0EA65C] text-white flex items-center justify-center cursor-pointer hover:bg-[#087F46] transition-colors"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Referrals Statistics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white border border-divider/60 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[8px] text-ink-soft font-black uppercase tracking-wider block">Amigos</span>
                <span className="font-sora font-black text-sm text-ink block">{referral.friendsCount}</span>
                <span className="text-[8px] text-emerald-600 font-bold block">Registrados</span>
              </div>
              <div className="bg-white border border-divider/60 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[8px] text-ink-soft font-black uppercase tracking-wider block">Ganado</span>
                <span className="font-sora font-black text-sm text-[#0EA65C] block">${referral.totalEarned.toLocaleString('es-CO')}</span>
                <span className="text-[8px] text-ink-faint block">Historico</span>
              </div>
              <div className="bg-white border border-divider/60 p-3.5 rounded-2xl text-center space-y-1">
                <span className="text-[8px] text-ink-soft font-black uppercase tracking-wider block">Saldo</span>
                <span className="font-sora font-black text-sm text-primary block">${referral.balance.toLocaleString('es-CO')}</span>
                <span className="text-[8px] text-primary/80 font-bold block">Disponible</span>
              </div>
            </div>

            {/* Invited friends log */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider">
                Amigos que has Invitado
              </span>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {referral.history.map((h) => (
                  <div key={h.id} className="bg-surface-alt/50 border border-divider/30 p-3 rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👤</span>
                      <div>
                        <span className="font-bold text-ink block leading-tight">{h.friendName}</span>
                        <span className="text-[8.5px] text-ink-faint">{h.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-sora font-black text-ink block">+${h.reward.toLocaleString('es-CO')}</span>
                      <span className={`text-[8px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded ${
                        h.status === 'completado' ? 'bg-emerald-50 text-[#0EA65C]' : 'bg-amber-50 text-amber-600 animate-pulse'
                      }`}>
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: HISTORIAL DE USO */}
        {userTab === 'historial' && (
          <div className="space-y-4 text-left">
            <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
              📜 Historial de Cupones y Promociones Utilizadas
            </span>

            {history.length === 0 ? (
              <div className="bg-surface-alt/40 border border-divider/60 rounded-2xl p-6 text-center text-xs text-ink-soft">
                No has utilizado cupones o promociones todavía.
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.map((item) => (
                  <div key={item.id} className="bg-white border border-divider/50 p-3.5 rounded-2xl flex justify-between items-center text-xs shadow-3xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                        item.type === 'coupon' ? 'bg-primary-surface text-primary-dark' :
                        item.type === 'promotion' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-[#0066FF]'
                      }`}>
                        {item.type === 'coupon' ? '🎁' : item.type === 'promotion' ? '🔥' : '👥'}
                      </div>

                      <div>
                        <span className="font-bold text-ink block leading-tight">{item.name}</span>
                        <p className="text-[9px] text-ink-faint mt-0.5">{item.date} • {item.time}</p>
                      </div>
                    </div>

                    <span className={`font-sora font-black text-xs ${
                      item.type === 'referral' ? 'text-[#0EA65C]' : 'text-primary'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    );
  };

  // Render Admin Mode
  const renderAdminMode = () => {
    return (
      <div className="space-y-5 text-left">
        
        {/* Toggle sections */}
        <div className="flex border-b border-divider/60 bg-surface-alt/40 p-1.5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setAdminSection('create_coupon')}
            className={`flex-1 text-[11px] font-black py-2.5 rounded-xl transition-all text-center cursor-pointer ${
              adminSection === 'create_coupon' 
                ? 'bg-white text-primary shadow-xs border border-divider/40' 
                : 'text-ink-soft hover:bg-white/40'
            }`}
          >
            Crear Cupón 🎟️
          </button>
          <button
            type="button"
            onClick={() => setAdminSection('create_promo')}
            className={`flex-1 text-[11px] font-black py-2.5 rounded-xl transition-all text-center cursor-pointer ${
              adminSection === 'create_promo' 
                ? 'bg-white text-primary shadow-xs border border-divider/40' 
                : 'text-ink-soft hover:bg-white/40'
            }`}
          >
            Crear Promoción 🔥
          </button>
        </div>

        {/* SECTION 1: CREATE COUPON FORM */}
        {adminSection === 'create_coupon' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Form */}
            <form onSubmit={handleCreateCoupon} className="md:col-span-5 bg-white border border-divider rounded-3xl p-4.5 space-y-4">
              <h4 className="font-sora font-extrabold text-xs text-ink border-b border-divider/40 pb-2">
                Nuevo Cupón de Descuento
              </h4>

              <div className="space-y-1.5">
                <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Código del Cupón</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="Ej: MOVICA20"
                  className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-mono font-bold uppercase tracking-wider focus:outline-primary placeholder:text-ink-faint"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Valor de Descuento</label>
                <input
                  type="text"
                  required
                  value={newCouponDiscount}
                  onChange={e => setNewCouponDiscount(e.target.value)}
                  placeholder="Ej: 20% OFF, $3.000 COP, Envío Gratis"
                  className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary placeholder:text-ink-faint"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Descripción de Campaña</label>
                <textarea
                  required
                  value={newCouponDesc}
                  onChange={e => setNewCouponDesc(e.target.value)}
                  placeholder="Ej: Descuento especial para viajes en fin de semana en Aguachica."
                  rows={2}
                  className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs focus:outline-primary placeholder:text-ink-faint resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Fecha de Vencimiento</label>
                <input
                  type="date"
                  required
                  value={newCouponValid}
                  onChange={e => setNewCouponValid(e.target.value)}
                  className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary text-ink"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-sora font-black text-[11px] uppercase tracking-wider shadow transition-all cursor-pointer text-center"
              >
                Crear y Activar Cupón 🚀
              </button>
            </form>

            {/* List of Coupons to activate/deactivate */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
                Control de Cupones Existentes
              </span>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white border border-divider p-3 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-primary-surface text-primary-dark border border-primary/10">
                          {coupon.code}
                        </span>
                        <span className="text-[11px] font-black text-ink">{coupon.discount}</span>
                      </div>
                      <p className="text-[9.5px] text-ink-soft leading-tight mt-1">{coupon.description}</p>
                      <span className="text-[8.5px] text-ink-faint block mt-1">Expira: {coupon.validUntil}</span>
                    </div>

                    <div className="flex items-center gap-3 pl-3 shrink-0">
                      <div className="text-right">
                        <span className={`text-[8.5px] font-black uppercase tracking-wider block ${
                          coupon.isActive ? 'text-[#0EA65C]' : 'text-rose-500'
                        }`}>
                          {coupon.isActive ? 'Activo' : 'Pausado'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleCoupon(coupon.id)}
                        className="text-ink-soft hover:text-primary transition-colors cursor-pointer"
                      >
                        {coupon.isActive ? (
                          <ToggleRight size={28} className="text-primary" />
                        ) : (
                          <ToggleLeft size={28} className="text-divider" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CREATE PROMOTION FORM */}
        {adminSection === 'create_promo' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Form */}
            <form onSubmit={handleCreatePromo} className="md:col-span-5 bg-white border border-divider rounded-3xl p-4.5 space-y-4">
              <h4 className="font-sora font-extrabold text-xs text-ink border-b border-divider/40 pb-2">
                Nueva Campaña Promocional
              </h4>

              <div className="space-y-1.5">
                <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Título de la Promoción</label>
                <input
                  type="text"
                  required
                  value={newPromoTitle}
                  onChange={e => setNewPromoTitle(e.target.value)}
                  placeholder="Ej: Descuento en Supermercado Olímpica"
                  className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary placeholder:text-ink-faint"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Servicio / Tipo</label>
                  <select
                    value={newPromoType}
                    onChange={e => setNewPromoType(e.target.value as any)}
                    className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary text-ink"
                  >
                    <option value="mototaxi">Mototaxi 🛵</option>
                    <option value="domicilio">Domicilios 🍔</option>
                    <option value="efectivo">Efectivo 💵</option>
                    <option value="comercio">Comercio 🏪</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Descuento Badge</label>
                  <input
                    type="text"
                    required
                    value={newPromoDiscount}
                    onChange={e => setNewPromoDiscount(e.target.value)}
                    placeholder="Ej: 15% OFF, Envío Gratis"
                    className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary placeholder:text-ink-faint"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Términos / Descripción</label>
                <textarea
                  required
                  value={newPromoDesc}
                  onChange={e => setNewPromoDesc(e.target.value)}
                  placeholder="Ej: Válido los fines de semana en compras mayores a $30.000 COP en Aguachica."
                  rows={2}
                  className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs focus:outline-primary placeholder:text-ink-faint resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={newPromoStart}
                    onChange={e => setNewPromoStart(e.target.value)}
                    className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary text-ink"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">Fecha Final</label>
                  <input
                    type="date"
                    required
                    value={newPromoEnd}
                    onChange={e => setNewPromoEnd(e.target.value)}
                    className="w-full bg-surface-alt border border-divider rounded-xl p-2.5 text-xs font-bold focus:outline-primary text-ink"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-sora font-black text-[11px] uppercase tracking-wider shadow transition-all cursor-pointer text-center"
              >
                Crear Campaña Activa 🔥
              </button>
            </form>

            {/* List of Promotions */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
                Campañas Activas de Publicidad
              </span>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {promotions.map((p) => (
                  <div key={p.id} className="bg-white border border-divider p-3 rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl p-1 bg-surface-alt rounded-lg shrink-0">{p.icon || '🔥'}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                            {p.badge}
                          </span>
                          <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                            {p.discount}
                          </span>
                        </div>
                        <h5 className="font-sora font-extrabold text-[11px] text-ink mt-1.5">{p.title}</h5>
                        <p className="text-[9px] text-ink-soft leading-tight mt-0.5">{p.description}</p>
                        <span className="text-[8.5px] text-ink-faint block mt-1">Campaña: {p.startDate} al {p.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3 shrink-0">
                      <div className="text-right">
                        <span className={`text-[8.5px] font-black uppercase tracking-wider block ${
                          p.isActive ? 'text-[#0EA65C]' : 'text-rose-500'
                        }`}>
                          {p.isActive ? 'Activo' : 'Pausado'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTogglePromo(p.id)}
                        className="text-ink-soft hover:text-primary transition-colors cursor-pointer"
                      >
                        {p.isActive ? (
                          <ToggleRight size={28} className="text-primary" />
                        ) : (
                          <ToggleLeft size={28} className="text-divider" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="relative">
      
      {/* Dynamic floating toast message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 font-bold text-xs flex items-center gap-2 max-w-sm"
          >
            <CheckCircle2 size={16} className="text-[#0EA65C] shrink-0" />
            <span className="leading-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      {initialViewMode === 'user' ? renderUserMode() : renderAdminMode()}

    </div>
  );
}
