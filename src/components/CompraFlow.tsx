import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Search, Plus, Minus, Check, Phone, User, 
  Clock, ShieldCheck, Star, Send, X, ChevronRight, MessageSquare, 
  Share2, Info, ShoppingBag, Sparkles, Navigation, AlertCircle
} from 'lucide-react';
import { Order, UserProfile, Favorite } from '../types';
import { DEMO_DRIVERS } from '../data';

interface CompraFlowProps {
  onClose: () => void;
  onSubmit: (order: Order) => void;
  userProfile: UserProfile;
  favorites: Favorite[];
}

const POPULAR_PRODUCTS = [
  { name: '🥤 Coca-Cola 1.5L', category: 'Bebidas', avgPrice: 4800 },
  { name: '💊 Acetaminofén 500mg', category: 'Farmacia', avgPrice: 2500 },
  { name: '🥛 Leche Alpina Entera 1L', category: 'Lácteos', avgPrice: 4200 },
  { name: '🍞 Pan tajado Bimbo', category: 'Panadería', avgPrice: 6500 },
  { name: '📚 Cuaderno de 100 hojas', category: 'Papelería', avgPrice: 3800 },
];

const RECENT_PRODUCTS = [
  { name: '🔋 Pilas AA Duracell x4', category: 'Tecnología', avgPrice: 12000 },
  { name: '🥚 Cubeta de Huevos x30', category: 'Lácteos', avgPrice: 16000 },
];

const SEARCHED_PRODUCTS = [
  { name: '🧊 Bolsa de Hielo', category: 'Bebidas', avgPrice: 3000 },
  { name: '🧼 Jabón Rey', category: 'Aseo', avgPrice: 2200 },
  { name: '🍫 Chocolatina Jet', category: 'Dulces', avgPrice: 1000 },
];

const CATEGORIES = [
  { icon: '🥛', name: 'Lácteos' },
  { icon: '🥤', name: 'Bebidas' },
  { icon: '💊', name: 'Farmacia' },
  { icon: '🍞', name: 'Panadería' },
  { icon: '🍏', name: 'Frutas/Verduras' },
  { icon: '🧼', name: 'Aseo' },
];

export default function CompraFlow({ onClose, onSubmit, userProfile, favorites }: CompraFlowProps) {
  // Steps: 1 to 8
  const [step, setStep] = useState<number>(1);

  // Step 1: Search product states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productPrice, setProductPrice] = useState(0);

  // Step 2: Confirm details states
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('Si no hay esta marca, aceptar una similar.');

  // Step 3: Address states
  const [address, setAddress] = useState(userProfile.addresses[0]?.address || '');
  const [newAddressInput, setNewAddressInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customFavorites, setCustomFavorites] = useState<Favorite[]>(favorites);

  // Step 4: Summary calculations
  const shippingFee = 3500; // Fixed delivery fee for Movica compras in Aguachica
  const estTime = 12; // Estimated purchase + delivery time in minutes
  const totalEstimated = (productPrice * quantity) + shippingFee;

  // Step 5: Searching driver simulation
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchPhase, setSearchPhase] = useState(0); // 0: Buscando comprador, 1: Calculando ruta, 2: Asignando servicio
  const [driver, setDriver] = useState<any>(DEMO_DRIVERS[2] || DEMO_DRIVERS[0]);

  // Step 6: Chat simulation
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: '¡Hola! Ya recibí tu encargo. Voy directo al supermercado más cercano a comprarlo. 🛒', time: 'Hace 1 min' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Call simulation
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Step 7: Tracking status messages
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [trackingStatus, setTrackingStatus] = useState('🛒 Comprando tu producto...');

  // Step 8: Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Auto-suggestions filter
  const allSuggested = [...POPULAR_PRODUCTS, ...RECENT_PRODUCTS, ...SEARCHED_PRODUCTS];
  const filteredProducts = searchQuery
    ? allSuggested.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectProduct = (name: string, price: number) => {
    setSelectedProduct(name);
    setProductPrice(price);
    setStep(2);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    const newFav: Favorite = {
      id: `fav-${Date.now()}`,
      icon: '📍',
      label: 'Dirección Nueva',
      address: newAddressInput.trim()
    };
    setCustomFavorites(prev => [...prev, newFav]);
    setAddress(newAddressInput.trim());
    setNewAddressInput('');
    setShowAddForm(false);
  };

  // Step 5 Search Runner
  useEffect(() => {
    if (step === 5) {
      setSearchProgress(0);
      setSearchPhase(0);

      const interval = setInterval(() => {
        setSearchProgress(prev => {
          const nextVal = prev + 5;
          if (nextVal >= 100) {
            clearInterval(interval);
            const chosenDriver = DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)] || DEMO_DRIVERS[0];
            setDriver(chosenDriver);
            setTimeout(() => {
              setStep(6);
            }, 600);
            return 100;
          }

          if (nextVal > 65) {
            setSearchPhase(2); // Asignando servicio
          } else if (nextVal > 35) {
            setSearchPhase(1); // Calculando ruta
          }
          return nextVal;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Step 7 Tracking progress simulator
  useEffect(() => {
    if (step === 7) {
      setTrackingProgress(0);
      setTrackingStatus('🛒 Comprando tu producto en el establecimiento...');

      const interval = setInterval(() => {
        setTrackingProgress(prev => {
          const nextVal = prev + 1;
          if (nextVal === 20) {
            setTrackingStatus('🧾 Facturando el producto. ¡Todo listo!');
          } else if (nextVal === 45) {
            setTrackingStatus('🛵 En camino. Saliendo hacia tu dirección...');
          } else if (nextVal === 75) {
            setTrackingStatus('Avanzando por las calles de Aguachica...');
          } else if (nextVal === 95) {
            setTrackingStatus('¡El aliado de Movica llegó a tu puerta!');
          } else if (nextVal >= 100) {
            clearInterval(interval);
            setTrackingStatus('¡Pedido entregado con éxito!');
            setTimeout(() => {
              setStep(8);
            }, 1000);
            return 100;
          }
          return nextVal;
        });
      }, 150); // ~15 seconds duration

      return () => clearInterval(interval);
    }
  }, [step]);

  // Call timer simulation
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

  // Quick replies
  const sendQuickReply = (text: string) => {
    const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let driverReply = '¡Entendido! Ya lo busco en la góndola.';
      if (text.includes('vencimiento')) {
        driverReply = 'Claro que sí, reviso muy bien la fecha de vencimiento antes de pagar. 🥛';
      } else if (text.includes('recibo')) {
        driverReply = 'Por supuesto, te adjunto el recibo de compra oficial en la entrega. 🧾';
      } else if (text.includes('cambio')) {
        driverReply = 'Listo, te llevo las vueltas exactas.';
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

  const handleFinalSubmit = () => {
    const finalOrder: Order = {
      id: `COM-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'compra',
      title: 'Compra de Producto',
      details: `${quantity}x ${selectedProduct}`,
      price: totalEstimated,
      status: 'completado',
      date: 'Hace un momento',
      driver: driver,
      pickupAddress: 'Establecimiento Comercial local',
      deliveryAddress: address,
      instructions: `Nota: ${observations}. Calificación: ${rating} ★. Comentario: ${comment || 'Excelente compra'}`
    };
    onSubmit(finalOrder);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* HEADER BAR */}
      {step !== 5 && !isCalling && (
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between bg-white flex-shrink-0 z-10">
          <button 
            onClick={() => {
              if (step > 1) {
                if (step === 6) setStep(4); // Go back to summary
                else setStep(step - 1);
              }
              else onClose();
            }}
            className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer active:scale-90 transition-transform"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-center">
            <span className="font-sora font-extrabold text-sm text-ink block">Lo Compramos por Ti</span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">Paso {step} de 8</span>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* CONTENT SCROLL */}
      <div className="flex-1 overflow-y-auto content-scrollbar relative pb-16 flex flex-col">
        <AnimatePresence mode="wait">

          {/* STEP 1: SEARCH PRODUCT */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5"
            >
              <div className="text-center max-w-[280px] mx-auto">
                <span className="text-3xl">🛒</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-2">¿Qué producto necesitas?</h3>
                <p className="text-xs text-ink-soft mt-1">Escribe lo que buscas y un comprador de Movica irá al almacén por ti.</p>
              </div>

              {/* Autocomplete Input */}
              <div className="space-y-1.5 relative">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" size={16} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Escribe el producto (ej. Coca-Cola 1.5L)..."
                    className="w-full bg-surface-alt border border-divider/60 rounded-xl pl-10 pr-10 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown suggestions list */}
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-divider rounded-xl shadow-lg z-20 max-h-[160px] overflow-y-auto content-scrollbar">
                    {filteredProducts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectProduct(p.name, p.avgPrice)}
                        className="w-full text-left px-4 py-2.5 hover:bg-primary-surface text-xs font-semibold text-ink border-b border-divider/40 last:border-b-0 flex justify-between items-center cursor-pointer"
                      >
                        <span>{p.name}</span>
                        <span className="text-[10px] text-primary-dark font-black">${p.avgPrice.toLocaleString('es-CO')}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast Categories pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Categorías Rápidas</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(cat.name)}
                      className="py-2.5 px-2 bg-surface-alt/50 hover:bg-primary-surface rounded-xl border border-divider/30 text-center transition-colors cursor-pointer"
                    >
                      <span className="block text-sm">{cat.icon}</span>
                      <span className="text-[9px] font-bold text-ink-soft block mt-0.5">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular list */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Más Buscados en Aguachica</span>
                <div className="space-y-1.5">
                  {POPULAR_PRODUCTS.map((prod, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectProduct(prod.name, prod.avgPrice)}
                      className="w-full flex justify-between items-center p-3 rounded-xl bg-surface-alt/40 hover:bg-primary-surface border border-divider/20 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">{prod.name}</span>
                        <span className="text-[8px] bg-white px-1.5 py-0.5 rounded-full border border-divider/40 text-ink-soft font-black uppercase">{prod.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-primary-dark">${prod.avgPrice.toLocaleString('es-CO')}</span>
                        <ChevronRight size={12} className="text-ink-faint" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom manual product submission button if not in list */}
              <button
                disabled={!searchQuery.trim()}
                onClick={() => handleSelectProduct(searchQuery, 5000)}
                className={`w-full py-3.5 rounded-xl font-sora font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 ${
                  searchQuery.trim() 
                    ? 'bg-primary hover:bg-primary-dark text-white active:scale-95' 
                    : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                }`}
              >
                Comprar "{searchQuery || 'mi producto'}" <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: CONFIRM PRODUCT DETAILS */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <h3 className="font-sora font-extrabold text-base text-ink">Confirmar Producto</h3>
                <p className="text-xs text-ink-soft mt-0.5">Define las cantidades e indicaciones para la compra.</p>
              </div>

              {/* Product Visual Card */}
              <div className="bg-primary-surface/45 border border-primary/20 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">
                    🛒
                  </div>
                  <div>
                    <span className="text-[9px] text-primary-dark font-black uppercase tracking-wider">Producto Solicitado</span>
                    <h4 className="font-sora font-extrabold text-sm text-ink leading-tight">{selectedProduct}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-ink-soft block uppercase font-black">Costo Ref.</span>
                  <span className="font-sora font-black text-xs text-primary-dark">${productPrice.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-surface-alt/50 border border-divider/40 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs font-black text-ink block">Cantidad</span>
                  <span className="text-[10px] text-ink-soft block">¿Cuántos productos de este tipo deseas?</span>
                </div>

                <div className="flex items-center gap-3.5 bg-white border border-divider rounded-xl p-1.5">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider/30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-black text-ink w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider/30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Observations / Specific instructions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Observaciones y Sustitutos</label>
                <textarea 
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                  placeholder="Ej: 'Si no hay esta marca, aceptar una similar', 'Traer el sabor de fresa'..."
                  rows={3}
                  className="w-full bg-surface-alt border border-divider/60 rounded-xl px-4 py-3 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              {/* Next Step Action */}
              <button
                onClick={() => setStep(3)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Ingresar Dirección de Entrega
              </button>
            </motion.div>
          )}

          {/* STEP 3: DELIVERY ADDRESS */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              <div className="text-center max-w-[280px] mx-auto">
                <span className="text-3xl">📍</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-2">¿Dónde te lo entregamos?</h3>
                <p className="text-xs text-ink-soft mt-1">Selecciona el lugar de entrega para tu pedido.</p>
              </div>

              {/* Address suggestions */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Direcciones Disponibles</span>
                <div className="space-y-2">
                  {customFavorites.map((fav, idx) => {
                    const isSelected = address === fav.address;
                    return (
                      <button
                        key={idx}
                        onClick={() => setAddress(fav.address)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                          isSelected 
                            ? 'bg-primary-surface/40 border-primary shadow-sm' 
                            : 'bg-surface-alt/40 border-divider/30 hover:bg-surface-alt'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{fav.icon}</span>
                          <div>
                            <span className="text-xs font-bold text-ink block">{fav.label}</span>
                            <span className="text-[9.5px] text-ink-soft block truncate max-w-[190px]">{fav.address}</span>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-primary-dark font-black" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Address expander */}
              <div className="pt-2">
                {!showAddForm ? (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-xs font-black text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    ➕ Agregar una Nueva Dirección
                  </button>
                ) : (
                  <form onSubmit={handleAddNewAddress} className="bg-surface-alt/75 border border-divider rounded-2xl p-4 space-y-3">
                    <span className="text-[9px] font-black uppercase text-ink-soft tracking-wider block">Registrar Dirección</span>
                    <input 
                      type="text"
                      value={newAddressInput}
                      onChange={e => setNewAddressInput(e.target.value)}
                      placeholder="Ej. Calle 5 # 10-24, Barrio Centro..."
                      className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                      required
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button 
                        type="button" 
                        onClick={() => setShowAddForm(false)} 
                        className="px-3 py-1.5 text-ink-soft hover:text-ink"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="bg-primary text-white font-black px-4.5 py-1.5 rounded-lg active:scale-95"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Next Button */}
              <button
                disabled={!address.trim()}
                onClick={() => setStep(4)}
                className={`w-full py-3.5 rounded-xl font-sora font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 ${
                  address.trim() 
                    ? 'bg-primary hover:bg-primary-dark text-white active:scale-95' 
                    : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                }`}
              >
                Continuar al Resumen <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {/* STEP 4: SUMMARY */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <h3 className="font-sora font-extrabold text-base text-ink">Resumen del Pedido</h3>
                <p className="text-xs text-ink-soft mt-0.5">Verifica los costos estimados antes de confirmar.</p>
              </div>

              {/* Product list preview card */}
              <div className="bg-surface-alt/50 border border-divider/40 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Establecimiento Estimado</span>
                    <span className="text-xs font-extrabold text-ink leading-tight block mt-0.5">Tienda / Almacén de Conveniencia</span>
                  </div>
                  <span className="bg-primary-surface text-primary-dark font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                    Compra Directa
                  </span>
                </div>

                <div className="border-t border-divider/60 pt-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-white border rounded flex items-center justify-center text-[10px] font-black">{quantity}x</span>
                    <span className="text-ink font-bold">{selectedProduct}</span>
                  </div>
                  <span className="font-bold text-ink">${(productPrice * quantity).toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Cost specifications row */}
              <div className="bg-surface-alt/40 border border-divider/30 rounded-2xl p-4 space-y-2.5 text-xs font-semibold text-ink-soft">
                <div className="flex justify-between items-center">
                  <span>Costo aprox. de productos</span>
                  <span className="text-ink font-bold">${(productPrice * quantity).toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Costo del domicilio Movica</span>
                  <span className="text-ink font-bold">${shippingFee.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between items-center border-t border-divider/60 pt-2.5 text-sm font-black text-ink">
                  <span>Total estimado</span>
                  <span className="text-primary-dark text-base font-black">${totalEstimated.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Delivery point */}
              <div className="flex items-start gap-2.5 p-3.5 bg-surface-alt/20 border border-divider/40 rounded-xl text-xs font-semibold text-ink-soft">
                <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] uppercase font-black text-ink-soft tracking-wider block">Entregar en:</span>
                  <span className="text-ink font-bold block mt-0.5">{address}</span>
                  {observations && (
                    <span className="text-[10px] italic text-ink-soft block mt-1">Nota: "{observations}"</span>
                  )}
                </div>
              </div>

              {/* Submit triggers step 5 */}
              <button
                onClick={() => setStep(5)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                🛒 Confirmar Solicitud de Compra
              </button>
            </motion.div>
          )}

          {/* STEP 5: SEARCHING ANIMATION */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0d1a16] text-white flex flex-col justify-between p-8"
            >
              <div></div> {/* Top spacer */}

              {/* Radar pulse graphics */}
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  
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

                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl shadow-lg shadow-primary/30 z-10 relative">
                    🛒
                  </div>
                </div>

                <div className="space-y-2.5 max-w-[260px]">
                  <h3 className="font-sora font-extrabold text-base text-white transition-all duration-300">
                    {searchPhase === 0 ? '🛒 Buscando un comprador...' :
                     searchPhase === 1 ? '📍 Calculando ruta óptima...' :
                                        '🛵 Asignando servicio Movica...'}
                  </h3>
                  <p className="text-xs text-white/60">
                    {searchPhase === 0 ? 'Conectando con el aliado de compras disponible en tu sector.' :
                     searchPhase === 1 ? 'Trazando el recorrido más rápido para tu entrega.' :
                                        'Transfiriendo las especificaciones de tu encargo.'}
                  </p>
                </div>
              </div>

              {/* Progress and skip */}
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
                    onClick={() => setStep(6)}
                    className="hover:text-white underline cursor-pointer"
                  >
                    Saltar espera
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: ALLY ASSIGNED */}
          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-5"
            >
              <div className="text-center">
                <span className="text-2xl">⚡</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-1">Aliado de Compras Asignado</h3>
                <p className="text-xs text-ink-soft mt-0.5">Tu comprador ya aceptó y se dirige al establecimiento.</p>
              </div>

              {/* Ally profile card */}
              <div className="bg-gradient-to-br from-[#0d1a16] to-[#122820] text-white p-4 rounded-3xl shadow-lg flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                      {driver?.avatar || '👨‍✈️'}
                    </div>
                    <div>
                      <h4 className="font-sora font-extrabold text-xs text-white leading-tight">{driver?.name || 'Carlos Mario'}</h4>
                      <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 mt-0.5">
                        ★ {driver?.rating || '4.95'} <span className="text-white/50 font-medium font-mono text-[9px]">(Comprador Estrella)</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/25 border border-primary/20 rounded-xl px-2.5 py-1 text-center">
                    <span className="text-[8px] text-white/50 uppercase tracking-widest font-black block">Llegada aprox</span>
                    <span className="text-xs text-primary font-black font-mono">4 min</span>
                  </div>
                </div>

                {/* Motorcycle details */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3.5 text-[10px] font-semibold text-white/70">
                  <div>
                    <span className="block text-[8px] text-white/40 uppercase font-black">Motocicleta</span>
                    <span className="text-white font-extrabold block truncate mt-0.5">{driver?.vehicle || 'Bajaj Boxer CT100'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-white/40 uppercase font-black">Placa Vehículo</span>
                    <span className="bg-primary text-[#0d1a16] px-1.5 py-0.5 rounded font-black font-mono inline-block mt-0.5">
                      {driver?.plate || 'UJK-15A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat simulator */}
              <div className="bg-surface-alt rounded-2xl border border-divider/50 p-3.5 space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-divider/50">
                  <span className="text-[10px] font-black uppercase text-ink-soft flex items-center gap-1">
                    <MessageSquare size={12} className="text-primary" /> Chat de Compra
                  </span>
                  <span className="text-[9px] text-[#0EA65C] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Activo
                  </span>
                </div>

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

                {/* Quick replies */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 content-scrollbar whitespace-nowrap">
                  {[
                    'Revisa fecha de vencimiento 🥛',
                    'Tráeme el recibo por favor 🧾',
                    'Tengo billete grande para cambio 💵',
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

                {/* Send form */}
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
                    if (confirm('¿Deseas cancelar tu solicitud de compra?')) {
                      setStep(1);
                    }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-3 font-extrabold text-xs cursor-pointer text-center"
                >
                  Cancelar Solicitud
                </button>
              </div>

              {/* Proceed to live tracking simulation */}
              <button
                onClick={() => setStep(7)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                🚀 Compras iniciadas • Ver Seguimiento en Vivo
              </button>
            </motion.div>
          )}

          {/* STEP 7: LIVE TRACKING */}
          {step === 7 && (
            <motion.div 
              key="step7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4 flex flex-col justify-between flex-1"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-sora font-extrabold text-base text-ink">Seguimiento en Progreso</h3>
                  <p className="text-xs text-ink-soft mt-0.5">{trackingStatus}</p>
                </div>

                {/* SVG Route Map */}
                <div className="h-[180px] bg-slate-100 rounded-3xl border border-divider/50 overflow-hidden relative shadow-inner">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(13,13,13,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(13,13,13,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  
                  {/* Streets */}
                  <svg className="absolute inset-0 w-full h-full text-slate-300 stroke-current stroke-3 fill-none">
                    <path d="M 30 50 Q 150 50 150 150 T 270 150" />
                    <path d="M 150 10 Q 150 100 280 50" />
                  </svg>

                  {/* Highlighted routing path */}
                  <svg className="absolute inset-0 w-full h-full text-primary stroke-current stroke-2 stroke-dasharray-[4_4] fill-none opacity-45">
                    <path d="M 30 50 Q 150 50 150 150 T 270 150" />
                  </svg>

                  {/* Supermarket point */}
                  <div className="absolute left-[26px] top-[38px] w-6 h-6 rounded-full bg-primary-surface border border-primary text-xs font-bold flex items-center justify-center shadow-md">
                    🏪
                  </div>

                  {/* Destination point */}
                  <div className="absolute left-[258px] top-[138px] w-6 h-6 rounded-full bg-accent-surface border border-accent text-xs font-bold flex items-center justify-center shadow-md">
                    🏁
                  </div>

                  {/* Moving motorbike representation */}
                  <div 
                    className="absolute w-8 h-8 rounded-full bg-[#0d1a16] text-white flex items-center justify-center text-sm shadow-lg border border-primary/20 transition-all duration-300"
                    style={{
                      left: `${30 + (258 - 30) * (trackingProgress / 100)}px`,
                      top: `${50 + (138 - 50) * (trackingProgress / 100)}px`
                    }}
                  >
                    🛵
                  </div>

                  {/* Status Box */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-divider rounded-xl p-2.5 text-[9px] font-bold text-ink flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span className="truncate">{trackingStatus}</span>
                  </div>
                </div>

                {/* Summary information widget */}
                <div className="grid grid-cols-2 gap-3 bg-surface-alt/50 p-3.5 rounded-2xl border border-divider/30 text-xs">
                  <div>
                    <span className="text-[8px] text-ink-soft uppercase font-black block">Aliado Comprando</span>
                    <span className="font-bold text-ink block mt-0.5">{driver?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-ink-soft uppercase font-black block">Est. de Entrega</span>
                    <span className="font-bold text-primary-dark block mt-0.5">
                      {Math.ceil(estTime * (1 - trackingProgress / 100))} min aprox
                    </span>
                  </div>
                </div>

                {/* Subtext info */}
                <div className="p-3 bg-surface-alt/20 rounded-xl border border-divider/40 text-[10px] text-ink-soft flex gap-2">
                  <Info size={14} className="text-primary flex-shrink-0" />
                  <span>Tu repartidor te informará por chat cualquier novedad o cambio de precio al pagar en la caja registradora.</span>
                </div>
              </div>

              {/* Force Complete delivery button */}
              <button
                onClick={() => setStep(8)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Completar Pedido de Inmediato
              </button>
            </motion.div>
          )}

          {/* STEP 8: PEDIDO ENTREGADO */}
          {step === 8 && (
            <motion.div 
              key="step8"
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
                  <h3 className="font-sora font-extrabold text-base text-ink">¡Pedido Entregado!</h3>
                  <p className="text-xs text-ink-soft">El repartidor de Movica ha completado tu compra de manera segura.</p>
                </div>

                {/* Receipt specifications */}
                <div className="bg-surface-alt/70 border border-divider/40 rounded-2xl p-4 space-y-2 text-xs font-semibold text-ink-soft">
                  <div className="flex justify-between items-center">
                    <span>Costo de Producto ({quantity}x)</span>
                    <span className="text-ink font-black">${(productPrice * quantity).toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Valor del Domicilio</span>
                    <span className="text-ink font-black">${shippingFee.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-divider/60 pt-2 text-sm font-bold text-ink">
                    <span>Total Pagado</span>
                    <span className="text-primary-dark font-black">${totalEstimated.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                {/* Rating widgets */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Califica a tu Repartidor</span>
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

                {/* Review observations */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">Escribe tu reseña (Opcional)</label>
                  <textarea 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Escribe tu opinión sobre el aliado..."
                    rows={2}
                    className="w-full bg-surface-alt border border-divider/60 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Complete and submit */}
              <button
                onClick={handleFinalSubmit}
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                Finalizar y Volver
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FULLSCREEN CALL SIMULATOR */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 bg-[#0d1a16] text-white z-[80] flex flex-col justify-between p-10 text-center"
          >
            <div></div>

            <div className="space-y-6">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl mx-auto shadow-lg border border-white/5 animate-pulse">
                {driver?.avatar || '👨‍✈️'}
              </div>
              <div className="space-y-1">
                <h3 className="font-sora font-extrabold text-lg text-white">{driver?.name || 'Carlos Mario'}</h3>
                <span className="text-xs text-primary font-bold block uppercase tracking-widest">Llamando al Aliado...</span>
              </div>
              <span className="text-sm font-mono text-white/60 font-medium">
                {Math.floor(callTimer / 60)}:{(callTimer % 60).toString().padStart(2, '0')}
              </span>
            </div>

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
