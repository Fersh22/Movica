import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Smartphone, DollarSign, Wallet, FileText, Download, Filter, 
  Calendar, Check, AlertCircle, ShoppingBag, ArrowRight, TrendingUp, Users, PieChart as PieIcon, RefreshCw, BarChart2, Award, Zap, Clock, ShieldCheck
} from 'lucide-react';

export interface PaymentReceipt {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  allyName: string;
  serviceType: string;
  paymentMethod: 'efectivo' | 'nequi' | 'daviplata' | 'tarjeta' | 'transferencia';
  subtotal: number;
  surcharge: number;
  discount: number;
  couponName: string;
  total: number;
  status: 'completado' | 'pendiente' | 'fallido';
}

const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'pay-201',
    serviceId: 'srv-9082',
    date: '2026-07-04',
    time: '14:20',
    clientName: 'Ferney Gómez',
    allyName: 'Alvaro Restrepo',
    serviceType: 'Mototaxi 🛵',
    paymentMethod: 'nequi',
    subtotal: 2500,
    surcharge: 1000, // recargo nocturno
    discount: 500,
    couponName: 'BIENVENIDA',
    total: 3000,
    status: 'completado'
  },
  {
    id: 'pay-202',
    serviceId: 'srv-9083',
    date: '2026-07-04',
    time: '11:45',
    clientName: 'Ferney Gómez',
    allyName: 'Sonia Restrepo',
    serviceType: 'Domicilio 🍔',
    paymentMethod: 'efectivo',
    subtotal: 12000,
    surcharge: 1500, // recargo lluvia
    discount: 2000,
    couponName: 'FINDEAGUACHICA',
    total: 11500,
    status: 'completado'
  },
  {
    id: 'pay-203',
    serviceId: 'srv-9084',
    date: '2026-07-03',
    time: '20:10',
    clientName: 'Diana Gómez',
    allyName: 'Andrés Mendoza',
    serviceType: 'Encomienda 📦',
    paymentMethod: 'daviplata',
    subtotal: 5000,
    surcharge: 0,
    discount: 0,
    couponName: '',
    total: 5000,
    status: 'completado'
  },
  {
    id: 'pay-204',
    serviceId: 'srv-9085',
    date: '2026-07-02',
    time: '08:30',
    clientName: 'Carlos Ortega',
    allyName: 'Juan Carlos Silva',
    serviceType: 'Mandado 📋',
    paymentMethod: 'tarjeta',
    subtotal: 8000,
    surcharge: 2000,
    discount: 1000,
    couponName: 'CARDPROMO',
    total: 9000,
    status: 'completado'
  },
  {
    id: 'pay-205',
    serviceId: 'srv-9086',
    date: '2026-07-01',
    time: '16:15',
    clientName: 'Camila Rojas',
    allyName: 'Alvaro Restrepo',
    serviceType: 'Compra de Producto 🛒',
    paymentMethod: 'transferencia',
    subtotal: 45000,
    surcharge: 3000,
    discount: 5000,
    couponName: 'JULIOREGALO',
    total: 43000,
    status: 'pendiente'
  }
];

interface PaymentBillingSystemProps {
  mode: 'cliente' | 'admin';
  userProfile?: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function PaymentBillingSystem({ mode, userProfile }: PaymentBillingSystemProps) {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => {
    const saved = localStorage.getItem('movica_receipts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_RECEIPTS; }
    }
    return INITIAL_RECEIPTS;
  });

  // Client states
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'nequi' | 'daviplata' | 'tarjeta' | 'transferencia'>('efectivo');
  const [currentServicePrice, setCurrentServicePrice] = useState(4000);
  const [currentSurcharge, setCurrentSurcharge] = useState(1000);
  const [currentDiscount, setCurrentDiscount] = useState(1500);
  const [currentCoupon, setCurrentCoupon] = useState('DESCUENTOMOV');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);

  // Filter states for receipts list
  const [filterDate, setFilterDate] = useState('');
  const [filterMethod, setFilterMethod] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('movica_receipts', JSON.stringify(receipts));
  }, [receipts]);

  // Handle billing payment confirmation
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      const totalAmount = currentServicePrice + currentSurcharge - currentDiscount;
      const newReceipt: PaymentReceipt = {
        id: `pay-${Date.now().toString().slice(-4)}`,
        serviceId: `srv-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clientName: userProfile?.name || 'Ferney Gómez',
        allyName: 'Juan Carlos Silva',
        serviceType: 'Mototaxi 🛵',
        paymentMethod: paymentMethod,
        subtotal: currentServicePrice,
        surcharge: currentSurcharge,
        discount: currentDiscount,
        couponName: currentCoupon,
        total: totalAmount > 0 ? totalAmount : 0,
        status: 'completado'
      };

      setReceipts(prev => [newReceipt, ...prev]);
      setActiveReceipt(newReceipt);
      alert('¡Pago procesado con éxito! Se ha generado tu comprobante digital.');
    }, 1200);
  };

  const handleDownloadComprobante = (receipt: PaymentReceipt) => {
    alert(`Comprobante de Pago #${receipt.id} descargado en formato PDF de manera simulada en tu dispositivo.`);
  };

  // Filtered receipts
  const filteredReceipts = receipts.filter(rec => {
    const matchesDate = filterDate ? rec.date === filterDate : true;
    const matchesMethod = filterMethod !== 'todos' ? rec.paymentMethod === filterMethod : true;
    const matchesStatus = filterStatus !== 'todos' ? rec.status === filterStatus : true;
    return matchesDate && matchesMethod && matchesStatus;
  });

  // Administrative Calculations
  const dailyIncome = receipts
    .filter(r => r.date === '2026-07-04' && r.status === 'completado')
    .reduce((sum, r) => sum + r.total, 0);

  const monthlyIncome = receipts
    .filter(r => r.status === 'completado')
    .reduce((sum, r) => sum + r.total, 0);

  const commissionsGenerated = receipts
    .filter(r => r.status === 'completado')
    .reduce((sum, r) => sum + (r.total * 0.15), 0); // 15% platform commission

  const pendingPayments = receipts
    .filter(r => r.status === 'pendiente')
    .reduce((sum, r) => sum + r.total, 0);

  // Calculate payment methods counts
  const methodCounts = receipts.reduce((acc, curr) => {
    acc[curr.paymentMethod] = (acc[curr.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMethods = Object.entries(methodCounts).sort((a, b) => (b[1] as number) - (a[1] as number));

  return (
    <div className="space-y-6">
      
      {mode === 'cliente' ? (
        <div className="space-y-6">
          
          {/* TOP SECTION BAR */}
          <div className="bg-gradient-to-br from-[#0d1a16] to-[#122e23] rounded-3xl p-6 text-white shadow-xl text-left border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Wallet size={120} className="text-white" />
            </div>
            <span className="text-[10px] bg-primary/20 text-primary font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-primary/30">
              PAGOS Y FACTURACIÓN MOVICA
            </span>
            <h3 className="font-sora font-black text-lg mt-2 tracking-tight">Tu Billetera y Métodos Seguros</h3>
            <p className="text-xs text-white/70">Gestiona tus compras y descargas de facturas de manera instantánea.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT SIDE: PAYMENT SELECTION & CONFIRMATION (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-5 text-left">
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1.5">
                  <CreditCard size={16} className="text-primary" />
                  1. Elige tu Método de Pago
                </h4>
                <p className="text-[10.5px] text-ink-soft">Selecciona de qué manera deseas saldar este servicio de forma segura.</p>
              </div>

              {/* PAYMENT METHODS SELECTOR GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'efectivo', label: 'Efectivo', icon: '💵', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { id: 'nequi', label: 'Nequi', icon: '📱', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { id: 'daviplata', label: 'Daviplata', icon: '💙', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  { id: 'tarjeta', label: 'Tarjeta', icon: '💳', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                  { id: 'transferencia', label: 'Banco', icon: '🏦', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary-surface/20 ring-2 ring-primary/25' 
                        : 'border-divider bg-white hover:bg-surface-alt/40'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-[10px] font-black">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* PAYMENT SUMMARY BREAKDOWN */}
              <div className="bg-surface-alt/60 border border-divider/50 p-4 rounded-2xl space-y-3.5">
                <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">
                  Resumen de la Transacción
                </span>

                <div className="space-y-2 text-xs font-semibold text-ink">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Valor del servicio</span>
                    <span>${currentServicePrice.toLocaleString('es-CO')} COP</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink-soft">Recargos aplicados (Lluvia/Nocturno)</span>
                    <span className="text-amber-600">+${currentSurcharge.toLocaleString('es-CO')} COP</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink-soft">Descuentos</span>
                    <span className="text-emerald-600">-${currentDiscount.toLocaleString('es-CO')} COP</span>
                  </div>

                  {currentCoupon && (
                    <div className="flex justify-between text-[11px] bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl text-emerald-800">
                      <span>Cupón Utilizado:</span>
                      <span className="font-bold">{currentCoupon}</span>
                    </div>
                  )}

                  <div className="border-t border-divider/40 pt-2.5 flex justify-between text-sm font-black">
                    <span className="text-ink">Total a pagar</span>
                    <span className="text-primary">${Math.max(0, currentServicePrice + currentSurcharge - currentDiscount).toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-2xl transition-all cursor-pointer shadow-md shadow-primary/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>Procesando pago de forma segura...</>
                ) : (
                  <>✅ Confirmar Pago</>
                )}
              </button>

            </div>

            {/* RIGHT SIDE: CURRENT GENERATED INVOICE / TICKET (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <AnimatePresence mode="wait">
                {activeReceipt ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border-2 border-dashed border-divider rounded-3xl p-5 shadow-sm text-left relative overflow-hidden"
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-emerald-50 text-[#0EA65C] border border-[#0EA65C]/30 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
                      PAGADO ✓
                    </div>

                    <div className="space-y-4">
                      {/* Logo header */}
                      <div className="border-b border-divider pb-3 text-center">
                        <span className="text-xl">🛵</span>
                        <h4 className="font-sora font-black text-xs text-ink uppercase mt-1 tracking-tight">Comprobante de Pago Movica</h4>
                        <span className="text-[9px] text-ink-soft block font-mono font-bold mt-0.5">Recibo ID: #{activeReceipt.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-ink">
                        <div>
                          <span className="text-[9px] text-ink-soft block">NÚMERO DE SERVICIO</span>
                          <span>{activeReceipt.serviceId}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-ink-soft block">FECHA & HORA</span>
                          <span>{activeReceipt.date} - {activeReceipt.time}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-ink-soft block">CLIENTE SOLICITANTE</span>
                          <span>{activeReceipt.clientName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-ink-soft block">SOCIO CONDUCTOR</span>
                          <span>{activeReceipt.allyName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-ink-soft block">MÉTODO DE PAGO</span>
                          <span className="capitalize">{activeReceipt.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-ink-soft block">SERVICIO</span>
                          <span>{activeReceipt.serviceType}</span>
                        </div>
                      </div>

                      <div className="border-t border-divider pt-3 space-y-1.5 text-xs font-semibold">
                        <div className="flex justify-between text-ink-soft">
                          <span>Subtotal</span>
                          <span>${activeReceipt.subtotal.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between text-ink-soft">
                          <span>Recargos</span>
                          <span>+${activeReceipt.surcharge.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between text-ink-soft">
                          <span>Descuentos</span>
                          <span>-${activeReceipt.discount.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-ink border-t border-divider/40 pt-2">
                          <span>TOTAL PAGADO</span>
                          <span className="text-primary">${activeReceipt.total.toLocaleString('es-CO')} COP</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadComprobante(activeReceipt)}
                        className="w-full bg-surface-alt hover:bg-divider text-ink font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download size={13} /> Descargar Comprobante (PDF)
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white border border-divider/60 rounded-3xl p-8 text-center text-ink-soft text-xs font-medium h-full flex flex-col items-center justify-center gap-2">
                    <FileText size={32} className="text-divider" />
                    <span>Realiza un pago para generar y visualizar tu factura digital al instante.</span>
                  </div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* HISTORIAL DE PAGOS */}
          <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs text-left space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-divider/30 pb-3">
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1.5">
                  <Clock size={16} className="text-primary" />
                  Historial de Facturación y Comprobantes
                </h4>
                <p className="text-[10.5px] text-ink-soft">Visualiza, filtra y descarga los recibos de tus traslados históricos.</p>
              </div>

              {/* FILTERS CONTROLS */}
              <div className="flex flex-wrap gap-2 text-xs font-bold text-ink">
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="bg-surface-alt border border-divider/50 rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none"
                />

                <select
                  value={filterMethod}
                  onChange={e => setFilterMethod(e.target.value)}
                  className="bg-surface-alt border border-divider/50 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none"
                >
                  <option value="todos">Todos los métodos</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="nequi">Nequi</option>
                  <option value="daviplata">Daviplata</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Banco</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-surface-alt border border-divider/50 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="completado">Completados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="fallido">Fallidos</option>
                </select>
              </div>
            </div>

            {/* LIST OF HISTORIC RECEIPTS */}
            <div className="space-y-2.5 overflow-y-auto content-scrollbar max-h-[300px]">
              {filteredReceipts.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => setActiveReceipt(rec)}
                  className={`p-4 border rounded-2xl bg-white flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer ${
                    activeReceipt?.id === rec.id ? 'border-primary bg-primary-surface/5' : 'border-divider'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl p-2 bg-surface-alt rounded-xl block flex-shrink-0">
                      {rec.paymentMethod === 'efectivo' ? '💵' : rec.paymentMethod === 'nequi' ? '📱' : rec.paymentMethod === 'daviplata' ? '💙' : '💳'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sora font-extrabold text-xs text-ink block truncate">Factura #{rec.id}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.25 rounded ${
                          rec.status === 'completado' ? 'bg-emerald-50 text-emerald-600' :
                          rec.status === 'pendiente' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-soft block font-semibold mt-0.5">{rec.serviceType} • {rec.date} {rec.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-sora font-black text-xs text-ink">${rec.total.toLocaleString('es-CO')}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadComprobante(rec);
                      }}
                      className="p-1.5 rounded-lg bg-surface-alt hover:bg-divider text-ink-soft transition-colors cursor-pointer"
                      title="Descargar Comprobante PDF"
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-6">
          
          {/* HEADER ADMIN */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-divider/30 pb-4">
            <div>
              <h3 className="font-sora font-extrabold text-base text-ink">Consola de Pagos, Comisiones y Facturas</h3>
              <p className="text-xs text-ink-soft mt-0.5">Controla la facturación integral, recaudo de comisiones y consolida los pagos de la red Movica.</p>
            </div>
          </div>

          {/* ADMIN METRICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-divider/60 p-5 rounded-2xl shadow-xs text-left">
              <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block">💰 Ingresos Diarios (Hoy)</span>
              <span className="text-lg font-sora font-black text-[#0EA65C] block mt-1">${dailyIncome.toLocaleString('es-CO')} COP</span>
            </div>

            <div className="bg-white border border-divider/60 p-5 rounded-2xl shadow-xs text-left">
              <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block">📈 Ingresos Mensuales</span>
              <span className="text-lg font-sora font-black text-ink block mt-1">${monthlyIncome.toLocaleString('es-CO')} COP</span>
            </div>

            <div className="bg-white border border-divider/60 p-5 rounded-2xl shadow-xs text-left">
              <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block">⚡ Comisiones Generadas (15%)</span>
              <span className="text-lg font-sora font-black text-[#0066FF] block mt-1">${commissionsGenerated.toLocaleString('es-CO')} COP</span>
            </div>

            <div className="bg-white border border-divider/60 p-5 rounded-2xl shadow-xs text-left">
              <span className="text-[9.5px] text-ink-soft font-bold uppercase tracking-wider block">🚨 Pagos Pendientes por Desembolsar</span>
              <span className="text-lg font-sora font-black text-rose-600 block mt-1">${pendingPayments.toLocaleString('es-CO')} COP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* MOST USED PAYMENT METHODS (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm text-left space-y-4">
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase">Métodos de Pago más Utilizados</h4>
                <p className="text-[10px] text-ink-soft">Preferencia de pago de los clientes registrados.</p>
              </div>

              <div className="space-y-3 pt-2">
                {sortedMethods.map(([method, count], idx) => {
                  const pct = Math.min(100, ((count as number) / receipts.length) * 100);
                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-ink capitalize">
                        <span>{method === 'efectivo' ? '💵 Efectivo' : method === 'nequi' ? '📱 Nequi' : method === 'daviplata' ? '💙 Daviplata' : method === 'tarjeta' ? '💳 Tarjeta' : '🏦 Transferencia'}</span>
                        <span className="text-ink-soft">{count} transacciones ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-surface-alt h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTEGRATED LEDGER AUDIT (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm text-left flex flex-col overflow-hidden h-[340px]">
              <div className="flex justify-between items-center border-b border-divider/30 pb-3">
                <div>
                  <h4 className="font-sora font-extrabold text-xs text-ink uppercase">Auditoría Integral de Caja</h4>
                  <p className="text-[10px] text-ink-soft">Libro de ingresos y egresos de la red Movica.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto content-scrollbar space-y-2 pt-3">
                {receipts.map(rec => (
                  <div key={rec.id} className="p-3 bg-surface-alt/40 border border-divider/40 rounded-xl flex justify-between items-center text-xs font-semibold">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-ink">Recibo #{rec.id}</span>
                        <span className="text-[8px] font-bold text-ink-soft uppercase bg-white border border-divider/60 px-1 rounded">{rec.paymentMethod}</span>
                      </div>
                      <span className="text-[10px] text-ink-soft block font-bold mt-0.5">{rec.clientName} • {rec.date}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-[#0EA65C] block">+${rec.total.toLocaleString('es-CO')} COP</span>
                      <span className="text-[9px] text-ink-soft block">Comisión: ${(rec.total * 0.15).toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
