import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, ArrowUpRight, ArrowDownLeft, Clock, Calendar, 
  TrendingUp, Award, Zap, HelpCircle, CheckCircle2, AlertCircle, 
  Send, Sparkles, Building, ChevronRight, Activity, Percent, ArrowLeftRight
} from 'lucide-react';

interface Movement {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  serviceIcon: string;
  grossAmount: number;
  commission: number; // 15%
  netAmount: number;
}

interface Cashout {
  id: string;
  date: string;
  time: string;
  method: string;
  account: string;
  amount: number;
  status: 'completado' | 'pendiente' | 'rechazado';
}

const INITIAL_MOVEMENTS: Movement[] = [
  {
    id: 'MOV-101',
    date: 'Hoy, 04 Jul',
    time: '09:12 AM',
    serviceType: 'Mototaxi 🛵',
    serviceIcon: '🛵',
    grossAmount: 12000,
    commission: 1800,
    netAmount: 10200
  },
  {
    id: 'MOV-102',
    date: 'Hoy, 04 Jul',
    time: '08:05 AM',
    serviceType: 'Domicilio 🍔',
    serviceIcon: '🍔',
    grossAmount: 15000,
    commission: 2250,
    netAmount: 12750
  },
  {
    id: 'MOV-103',
    date: 'Ayer, 03 Jul',
    time: '06:45 PM',
    serviceType: 'Encomienda 📦',
    serviceIcon: '📦',
    grossAmount: 22000,
    commission: 3300,
    netAmount: 18700
  },
  {
    id: 'MOV-104',
    date: 'Ayer, 03 Jul',
    time: '02:15 PM',
    serviceType: 'Compra de producto 🛒',
    serviceIcon: '🛒',
    grossAmount: 35000,
    commission: 5250,
    netAmount: 29750
  },
  {
    id: 'MOV-105',
    date: '02 Jul 2026',
    time: '11:30 AM',
    serviceType: 'Mandado 📋',
    serviceIcon: '📋',
    grossAmount: 10000,
    commission: 1500,
    netAmount: 8500
  },
  {
    id: 'MOV-106',
    date: '01 Jul 2026',
    time: '04:10 PM',
    serviceType: 'Mototaxi 🛵',
    serviceIcon: '🛵',
    grossAmount: 8500,
    commission: 1275,
    netAmount: 7225
  },
];

const INITIAL_CASHOUTS: Cashout[] = [
  {
    id: 'WD-301',
    date: 'Ayer, 03 Jul',
    time: '09:00 PM',
    method: 'Nequi 📲',
    account: '312 *** 4567',
    amount: 45000,
    status: 'completado'
  },
  {
    id: 'WD-302',
    date: '28 Jun 2026',
    time: '10:15 AM',
    method: 'Daviplata 🏦',
    account: '315 *** 9876',
    amount: 80000,
    status: 'completado'
  },
  {
    id: 'WD-303',
    date: '20 Jun 2026',
    time: '04:30 PM',
    method: 'Bancolombia 🏛️',
    account: 'Ahorros **** 2241',
    amount: 150000,
    status: 'completado'
  }
];

export default function PartnerWallet() {
  const [balance, setBalance] = useState<number>(47450); // Available balance in COP
  const [movements, setMovements] = useState<Movement[]>(INITIAL_MOVEMENTS);
  const [cashouts, setCashouts] = useState<Cashout[]>(INITIAL_CASHOUTS);

  // Stats Period Selection
  const [statsPeriod, setStatsPeriod] = useState<'hoy' | 'semana' | 'mes'>('semana');

  // Request Withdrawal Modal & Form State
  const [cashoutOpen, setCashoutOpen] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState<'nequi' | 'daviplata' | 'bancolombia'>('nequi');
  const [withdrawalAccount, setWithdrawalAccount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(withdrawalAmount);
    if (!amountNum || amountNum <= 0) {
      triggerToast('⚠️ Por favor ingresa un monto válido.');
      return;
    }
    if (amountNum > balance) {
      triggerToast('⚠️ Saldo insuficiente para realizar este retiro.');
      return;
    }
    if (amountNum < 10000) {
      triggerToast('⚠️ El monto mínimo de retiro es de $10.000 COP.');
      return;
    }
    if (!withdrawalAccount.trim()) {
      triggerToast('⚠️ Ingresa el número de cuenta o celular.');
      return;
    }

    // Process withdrawal
    const newCashout: Cashout = {
      id: `WD-${Math.floor(Math.random() * 900) + 100}`,
      date: 'Hoy, Hace un momento',
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      method: withdrawalMethod === 'nequi' ? 'Nequi 📲' : withdrawalMethod === 'daviplata' ? 'Daviplata 🏦' : 'Bancolombia 🏛️',
      account: withdrawalAccount,
      amount: amountNum,
      status: 'pendiente'
    };

    setBalance(prev => prev - amountNum);
    setCashouts([newCashout, ...cashouts]);
    
    // Add transaction to movements history to reflect the balance deduction
    const newMovement: Movement = {
      id: `MOV-WD-${Math.floor(Math.random() * 900) + 100}`,
      date: 'Hoy, Hace un momento',
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      serviceType: `Retiro (${newCashout.method})`,
      serviceIcon: '🏦',
      grossAmount: -amountNum,
      commission: 0,
      netAmount: -amountNum
    };
    setMovements([newMovement, ...movements]);

    setCashoutOpen(false);
    setWithdrawalAmount('');
    setWithdrawalAccount('');
    triggerToast('✅ ¡Retiro solicitado exitosamente! Procesando transferencia simulada.');
  };

  // Calculations for display cards
  const earningsToday = movements
    .filter(m => m.date.includes('Hoy') && m.grossAmount > 0)
    .reduce((sum, m) => sum + m.netAmount, 0);

  const earningsWeek = movements
    .filter(m => m.grossAmount > 0)
    .reduce((sum, m) => sum + m.netAmount, 0) + 185000; // adding some historical week data

  const earningsMonth = earningsWeek + 650000; // Month cumulative
  const totalHistorical = earningsMonth + 2450000; // Historical all-time

  // Stats graphs simulation variables
  const statsDays = [
    { name: 'Lun', amount: 54000, count: 6 },
    { name: 'Mar', amount: 62000, count: 7 },
    { name: 'Mie', amount: 48000, count: 5 },
    { name: 'Jue', amount: 75000, count: 9 },
    { name: 'Vie', amount: 92000, count: 11 },
    { name: 'Sab', amount: 110000, count: 13 },
    { name: 'Dom', amount: 85000, count: 10 },
  ];

  const avgDailyEarnings = 75142; // Simulated daily average

  const peakHours = [
    { hour: '11:00 AM - 01:30 PM', label: 'Almuerzo 🍔', intensity: 'Muy Alta', color: 'bg-[#0EA65C]' },
    { hour: '05:30 PM - 07:30 PM', label: 'Salida de Oficinas / Colegios 🏫', intensity: 'Alta', color: 'bg-[#FFC629]' },
    { hour: '07:00 AM - 08:30 AM', label: 'Hora Pico Mañana 🌅', intensity: 'Media-Alta', color: 'bg-primary' },
  ];

  return (
    <div className="space-y-6">

      {/* TOAST FEEDBACK NOTIFICATION */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 font-bold text-xs flex items-center gap-2 max-w-sm"
          >
            <CheckCircle2 size={16} className="text-[#0EA65C] shrink-0" />
            <span className="leading-tight">{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER WITH TITLE & ACTION */}
      <div className="flex justify-between items-center bg-surface-alt p-4 rounded-2xl border border-divider/60">
        <div>
          <h3 className="font-sora font-extrabold text-base text-ink flex items-center gap-2">
            💳 Mi Billetera Movica <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Módulo 16</span>
          </h3>
          <p className="text-[10px] text-ink-soft mt-0.5">Controla tu saldo disponible, tus comisiones y solicita retiros instantáneos.</p>
        </div>
        <button
          onClick={() => setCashoutOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white text-[10.5px] font-black px-4 py-2.5 rounded-xl shadow-md transition-all select-none cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <ArrowDownLeft size={13} /> Retirar Fondos
        </button>
      </div>

      {/* LARGE BALANCE & PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        
        {/* Main Card: Saldo Disponible */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#0EA65C] to-[#0A7340] p-5 rounded-3xl text-white shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Saldo Disponible</p>
              <h2 className="font-sora font-extrabold text-2xl mt-0.5">${balance.toLocaleString('es-CO')} COP</h2>
            </div>
            <span className="bg-white/20 text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-0.5">
              <Zap size={9} className="animate-pulse" /> Listo
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/90 border-t border-white/10 pt-3">
            <span>Comisión Fijo Movica:</span>
            <span className="font-black bg-white/15 px-2 py-0.5 rounded-md text-white flex items-center gap-1">
              <Percent size={10} /> 15%
            </span>
          </div>
        </div>

        {/* Mini stats columns */}
        <div className="bg-white border border-divider p-4.5 rounded-3xl flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Hoy</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded">Ganado</span>
          </div>
          <div className="mt-2">
            <h4 className="font-sora font-black text-lg text-ink">${earningsToday.toLocaleString('es-CO')}</h4>
            <span className="text-[9px] text-ink-soft block mt-0.5">Neta del día</span>
          </div>
        </div>

        <div className="bg-white border border-divider p-4.5 rounded-3xl flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Esta Semana</span>
            <span className="text-[9px] bg-primary-surface text-primary font-bold px-1.5 py-0.5 rounded">Semanal</span>
          </div>
          <div className="mt-2">
            <h4 className="font-sora font-black text-lg text-ink">${earningsWeek.toLocaleString('es-CO')}</h4>
            <span className="text-[9px] text-ink-soft block mt-0.5">Meta: $250k COP</span>
          </div>
        </div>

        <div className="bg-white border border-divider p-4.5 rounded-3xl flex flex-col justify-between shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Este Mes</span>
            <span className="text-[9px] bg-[#EBF3FF] text-[#0066FF] font-bold px-1.5 py-0.5 rounded">Mensual</span>
          </div>
          <div className="mt-2">
            <h4 className="font-sora font-black text-lg text-ink">${earningsMonth.toLocaleString('es-CO')}</h4>
            <span className="text-[9px] text-ink-soft block mt-0.5">Historial: ${totalHistorical.toLocaleString('es-CO')}</span>
          </div>
        </div>

      </div>

      {/* TWO SECTIONS: TRANSACTION LOG & STATS + GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN (8/12): TRANSACTION LOGS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center border-b border-divider/40 pb-2">
            <div>
              <h4 className="font-sora font-extrabold text-sm text-ink">Historial de Movimientos Detallado</h4>
              <p className="text-[10px] text-ink-soft mt-0.5">Desglose de cada viaje con valor bruto, tasa Movica y ganancia neta.</p>
            </div>
            <span className="text-[9px] bg-surface-alt border border-divider/60 font-bold px-2.5 py-1 rounded-lg text-ink-soft">
              {movements.length} Movimientos
            </span>
          </div>

          <div className="space-y-3">
            {movements.map((mov) => {
              const isWithdrawal = mov.grossAmount < 0;

              return (
                <div 
                  key={mov.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isWithdrawal 
                      ? 'bg-rose-500/5 border-rose-500/15' 
                      : 'bg-white border-divider/60 shadow-2xs hover:border-primary/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                        isWithdrawal ? 'bg-rose-100 text-rose-600' : 'bg-surface-alt'
                      }`}>
                        {mov.serviceIcon}
                      </div>
                      <div>
                        <h5 className="font-sora font-bold text-xs text-ink">{mov.serviceType}</h5>
                        <p className="text-[9.5px] text-ink-soft flex items-center gap-1.5 mt-0.5">
                          <span>ID: {mov.id}</span>
                          <span className="text-divider">•</span>
                          <span className="flex items-center gap-0.5"><Clock size={10} /> {mov.time}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-sora font-extrabold text-xs block ${
                        isWithdrawal ? 'text-rose-600' : 'text-primary'
                      }`}>
                        {isWithdrawal ? '-' : '+'}${Math.abs(mov.netAmount).toLocaleString('es-CO')}
                      </span>
                      <span className="text-[8.5px] text-ink-faint block mt-0.5">{mov.date}</span>
                    </div>
                  </div>

                  {/* Detail Panel for Standard Services showing gross, commission and net */}
                  {!isWithdrawal && (
                    <div className="mt-3.5 pt-2.5 border-t border-divider/40 grid grid-cols-3 gap-2 bg-surface-alt/45 p-2 rounded-xl text-center text-[10px]">
                      <div>
                        <span className="text-ink-soft block font-semibold text-[8px] uppercase">Valor Bruto</span>
                        <span className="font-bold text-ink">${mov.grossAmount.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="border-x border-divider">
                        <span className="text-rose-500 block font-semibold text-[8px] uppercase">Comisión Movica (15%)</span>
                        <span className="font-bold text-rose-500">-${mov.commission.toLocaleString('es-CO')}</span>
                      </div>
                      <div>
                        <span className="text-primary block font-semibold text-[8px] uppercase">Ganancia Neta (85%)</span>
                        <span className="font-extrabold text-primary">${mov.netAmount.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN (5/12): STATS, WITHDRAWALS LIST & BONUSES */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* STATS BREAKDOWN GRAPHS */}
          <div className="bg-white border border-divider rounded-3xl p-4.5 space-y-4 shadow-2xs">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink">Estadísticas de Trabajo</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Monitorea tus ingresos diarios de esta semana.</p>
              </div>
              <span className="text-[9.5px] bg-[#E6F7EC] text-[#0EA65C] font-black px-2 py-0.5 rounded-full">
                Prom: ${avgDailyEarnings.toLocaleString('es-CO')}
              </span>
            </div>

            {/* Custom Interactive Pure SVG Bar Chart (Extremely robust for all devices/iframes) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-end justify-between h-24 gap-1 pt-4 border-b border-divider">
                {statsDays.map((day, idx) => {
                  const maxAmount = Math.max(...statsDays.map(d => d.amount));
                  const percentHeight = (day.amount / maxAmount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[8px] py-1 px-1.5 rounded font-black whitespace-nowrap z-10 pointer-events-none">
                        ${day.amount.toLocaleString('es-CO')}
                      </div>

                      {/* Bar */}
                      <div 
                        className="w-full bg-[#0EA65C]/80 hover:bg-[#0EA65C] rounded-t-sm transition-all duration-300 relative"
                        style={{ height: `${percentHeight}%` }}
                      >
                        {/* Internal indicator */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[7px] text-white font-black">
                          {day.count}
                        </div>
                      </div>

                      {/* Label */}
                      <span className="text-[9px] text-ink-soft font-bold mt-1.5">{day.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Sub-analytics breakdown info */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="bg-surface-alt p-3 rounded-2xl border border-divider/40 text-center">
                  <span className="text-[8.5px] text-ink-soft block font-bold uppercase mb-0.5">Servicios totales</span>
                  <span className="font-sora font-black text-sm text-ink">61 viajes</span>
                </div>
                <div className="bg-surface-alt p-3 rounded-2xl border border-divider/40 text-center">
                  <span className="text-[8.5px] text-ink-soft block font-bold uppercase mb-0.5">Día Más Productivo</span>
                  <span className="font-sora font-black text-xs text-[#0EA65C] block mt-0.5">Sábado ($110.000)</span>
                </div>
              </div>
            </div>

            {/* PEAK WORK HOURS INDICATOR */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider block">
                🔥 Horas con Mayor Demanda en Aguachica
              </span>
              <div className="space-y-2">
                {peakHours.map((ph, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-surface-alt/75 p-2.5 rounded-xl text-xs border border-divider/30">
                    <div>
                      <span className="font-bold text-ink block leading-tight">{ph.hour}</span>
                      <span className="text-[9px] text-ink-soft">{ph.label}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-[#0EA65C]/10 text-[#0EA65C] px-2 py-0.5 rounded-md">
                      {ph.intensity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BONUSES & MOTIVATIONAL TARGETS */}
          <div className="bg-white border border-divider rounded-3xl p-4.5 space-y-4 shadow-2xs">
            <span className="text-[10px] text-primary font-black uppercase tracking-wider block flex items-center gap-1">
              <Award size={12} className="text-primary" /> Bonificaciones y Metas del Día
            </span>

            {/* METAS DEL DIA PROGRESS */}
            <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-ink">Meta de Hoy: Completa 5 viajes</h5>
                  <p className="text-[9px] text-ink-soft">Recibe un bono de +$10.000 COP extra.</p>
                </div>
                <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded">
                  2 / 5 viajes
                </span>
              </div>
              
              <div className="space-y-1.5">
                <div className="w-full bg-divider/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '40%' }} />
                </div>
                <span className="text-[8.5px] text-primary font-bold block text-right">Te faltan 3 viajes para el bono</span>
              </div>
            </div>

            {/* PREMIOS & METAS LIST */}
            <div className="space-y-2">
              {[
                { title: 'Bono Climático 🌧️', desc: 'Recargo del +20% activo por lluvia en Aguachica.', earned: '¡Activo!', type: 'incentivo' },
                { title: 'Aliado Estrella del Mes 🏆', desc: 'Premio por mantener tu calificación en 4.9.', earned: '+$35.000 COP', type: 'premio' },
                { title: 'Fin de Semana Imparable ⚡', desc: 'Bono por realizar 15 viajes entre sábado y domingo.', earned: 'Pendiente', type: 'meta' },
              ].map((b, idx) => (
                <div key={idx} className="p-3 bg-surface-alt/65 rounded-xl flex justify-between items-center text-xs border border-divider/30">
                  <div>
                    <h6 className="font-bold text-ink">{b.title}</h6>
                    <p className="text-[9.5px] text-ink-soft">{b.desc}</p>
                  </div>
                  <span className={`text-[9.5px] font-black px-2 py-0.5 rounded shrink-0 ${
                    b.earned === 'Pendiente' ? 'bg-divider/50 text-ink-soft' : 'bg-emerald-50 text-[#0EA65C]'
                  }`}>
                    {b.earned}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORIAL DE RETIROS */}
          <div className="bg-white border border-divider rounded-3xl p-4.5 space-y-4 shadow-2xs">
            <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block flex items-center gap-1">
              <ArrowLeftRight size={12} /> Historial de Retiros Solicitados
            </span>

            <div className="space-y-2.5">
              {cashouts.map((c) => (
                <div key={c.id} className="p-3 bg-surface-alt/50 border border-divider/30 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-ink">
                      <span>{c.method}</span>
                      <span className="text-divider">•</span>
                      <span className="text-[9px] text-ink-soft">{c.account}</span>
                    </div>
                    <span className="text-[8.5px] text-ink-faint block mt-0.5">{c.date} • {c.time}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-sora font-extrabold text-ink block">${c.amount.toLocaleString('es-CO')}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide ${
                      c.status === 'completado' ? 'bg-emerald-50 text-emerald-600' :
                      c.status === 'pendiente' ? 'bg-amber-50 text-amber-600 animate-pulse' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* REQUEST WITHDRAWAL SHEET / MODAL */}
      <AnimatePresence>
        {cashoutOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl border border-divider text-left relative"
            >
              <div className="flex justify-between items-center border-b border-divider/60 pb-3">
                <div>
                  <h4 className="font-sora font-extrabold text-sm text-ink">Solicitar Retiro de Saldo</h4>
                  <p className="text-[10px] text-ink-soft mt-0.5">Elige tu método de transferencia preferido.</p>
                </div>
                <button 
                  onClick={() => setCashoutOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-alt hover:bg-divider flex items-center justify-center text-ink cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Current balance context */}
              <div className="bg-[#E6F7EC] border border-[#0EA65C]/15 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-ink font-bold">Saldo Disponible Retirable:</span>
                <span className="font-sora font-black text-base text-primary">${balance.toLocaleString('es-CO')} COP</span>
              </div>

              <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                
                {/* Method selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
                    Método de Retiro
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'nequi', label: 'Nequi', icon: '📲' },
                      { id: 'daviplata', label: 'Daviplata', icon: '🏦' },
                      { id: 'bancolombia', label: 'Bancolombia', icon: '🏛️' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setWithdrawalMethod(m.id as any);
                          // Autofill default demo accounts
                          setWithdrawalAccount(m.id === 'nequi' ? '312 885 4567' : m.id === 'daviplata' ? '315 224 9876' : 'Ahorros 405-22122-01');
                        }}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          withdrawalMethod === m.id 
                            ? 'border-primary bg-primary-surface text-primary' 
                            : 'border-divider bg-white text-ink-soft hover:bg-surface-alt'
                        }`}
                      >
                        <span className="text-lg">{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account details */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
                    Número de Cuenta / Celular
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawalAccount}
                    onChange={e => setWithdrawalAccount(e.target.value)}
                    placeholder="Ej: 312 456 7890"
                    className="w-full bg-surface-alt border border-divider rounded-2xl p-3 text-xs text-ink focus:outline-primary placeholder:text-ink-faint"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
                    Monto a Retirar (COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft font-bold text-xs">$</span>
                    <input
                      type="number"
                      required
                      value={withdrawalAmount}
                      onChange={e => setWithdrawalAmount(e.target.value)}
                      placeholder="Mínimo $10.000"
                      className="w-full bg-surface-alt border border-divider rounded-2xl pl-7 pr-3 py-3 text-xs text-ink font-bold focus:outline-primary placeholder:text-ink-faint"
                    />
                  </div>
                </div>

                <div className="bg-surface-alt p-3.5 rounded-2xl text-[10px] text-ink-soft leading-relaxed border border-divider/40">
                  ⚠️ <strong>Información importante:</strong> Los retiros simulados se aprueban automáticamente y se listan abajo de inmediato. Monto mínimo de retiro: $10.000 COP.
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0EA65C] hover:bg-[#087A43] text-white py-3 rounded-2xl font-sora font-black text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Confirmar Retiro Instantáneo 🚀
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
