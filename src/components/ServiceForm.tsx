import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Bike, Check, Plus, Minus, 
  ShoppingBag, Sparkles, Phone, User, Package, Clock, ShieldCheck 
} from 'lucide-react';
import { ServiceType, Order, UserProfile, Favorite } from '../types';
import { RESTAURANTS_MOCK, DEMO_DRIVERS } from '../data';
import MototaxiFlow from './MototaxiFlow';
import EncomiendaFlow from './EncomiendaFlow';
import CompraFlow from './CompraFlow';

interface ServiceFormProps {
  type: ServiceType;
  onClose: () => void;
  onSubmit: (order: Order) => void;
  userProfile: UserProfile;
  favorites: Favorite[];
}

export default function ServiceForm({ type, onClose, onSubmit, userProfile, favorites }: ServiceFormProps) {
  // If mototaxi, use the premium 7-step interactive flow component
  if ((type as string) === 'mototaxi') {
    return (
      <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12">
        <MototaxiFlow 
          onClose={onClose}
          onSubmit={onSubmit}
          userProfile={userProfile}
          favorites={favorites}
        />
      </div>
    );
  }

  // If encomienda, use the premium 6-step interactive flow component
  if ((type as string) === 'encomienda') {
    return (
      <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12">
        <EncomiendaFlow 
          onClose={onClose}
          onSubmit={onSubmit}
          userProfile={userProfile}
          favorites={favorites}
        />
      </div>
    );
  }

  // If compra, use the premium 8-step interactive product purchase component
  if ((type as string) === 'compra') {
    return (
      <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12">
        <CompraFlow 
          onClose={onClose}
          onSubmit={onSubmit}
          userProfile={userProfile}
          favorites={favorites}
        />
      </div>
    );
  }

  // Common states
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [assignedDriver, setAssignedDriver] = useState<typeof DEMO_DRIVERS[0] | null>(null);

  // Form input states
  const [pickup, setPickup] = useState(userProfile.addresses[0]?.address || '');
  const [delivery, setDelivery] = useState(userProfile.addresses[1]?.address || '');
  
  // Domicilio states
  const [selectedRestId, setSelectedRestId] = useState('r1');
  const [cart, setCart] = useState<{ [itemName: string]: number }>({});
  
  // Encomienda states
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [packageType, setPackageType] = useState('Caja / Paquete');
  
  // Compra / Mandados states
  const [productDesc, setProductDesc] = useState('');
  const [shopName, setShopName] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('20000');
  const [mandadoDesc, setMandadoDesc] = useState('');

  // Find selected restaurant info
  const selectedRestaurant = RESTAURANTS_MOCK.find(r => r.id === selectedRestId) || RESTAURANTS_MOCK[0];

  const updateCart = (name: string, delta: number) => {
    setCart(prev => {
      const newVal = (prev[name] || 0) + delta;
      if (newVal <= 0) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return { ...prev, [name]: newVal };
    });
  };

  const getCartTotal = () => {
    let subtotal = 0;
    Object.entries(cart).forEach(([name, qtyVal]) => {
      const qty = Number(qtyVal);
      const menuItem = selectedRestaurant.menu.find(m => m.name === name);
      if (menuItem) {
        subtotal += menuItem.price * qty;
      }
    });
    return subtotal;
  };

  const handleQuickSelect = (address: string, isPickup: boolean) => {
    if (isPickup) setPickup(address);
    else setDelivery(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    // Simulate finding a rider nearby
    setTimeout(() => {
      const driver = DEMO_DRIVERS[Math.floor(Math.random() * DEMO_DRIVERS.length)];
      setAssignedDriver(driver);
      setStep('success');

      // Create new order structure
      let title = '';
      let details = '';
      let price = 0;
      let orderItems: { name: string; qty: number; price: number }[] = [];

      if (type === 'mototaxi') {
        title = 'Viaje en Mototaxi';
        details = `De ${pickup.split(',')[0]} a ${delivery.split(',')[0]}`;
        price = 4800;
      } else if (type === 'domicilio') {
        title = `Pedido de ${selectedRestaurant.name}`;
        const itemsSummary = Object.entries(cart).map(([name, qty]) => `${qty}x ${name}`).join(', ');
        details = itemsSummary || 'Pedido a domicilio';
        price = getCartTotal() + 3500; // delivery fee
        orderItems = Object.entries(cart).map(([name, qtyVal]) => {
          const qty = Number(qtyVal);
          const m = selectedRestaurant.menu.find(x => x.name === name);
          return { name, qty, price: m ? m.price : 0 };
        });
      } else if (type === 'encomienda') {
        title = 'Envío de Encomienda';
        details = `${packageType} para ${recipientName || 'Destinatario'}`;
        price = 4500;
      } else if (type === 'compra') {
        title = 'Encargo de Compra';
        details = `Comprar: ${productDesc}`;
        price = 5500 + (parseInt(estimatedBudget) || 0);
      } else if (type === 'mandado') {
        title = 'Mandado Personal';
        details = mandadoDesc || 'Diligencia personalizada';
        price = 6000;
      }

      const newOrder: Order = {
        id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
        type,
        title,
        details,
        price,
        status: 'solicitado',
        date: 'Ahora mismo',
        driver,
        pickupAddress: type === 'domicilio' ? selectedRestaurant.name : pickup,
        deliveryAddress: delivery,
        items: orderItems,
        instructions: type === 'mandado' ? mandadoDesc : (type === 'compra' ? `Presupuesto: $${estimatedBudget}` : '')
      };

      // Trigger final submit after showing success briefly
      setTimeout(() => {
        onSubmit(newOrder);
      }, 2000);

    }, 2000);
  };

  const getFormTitle = () => {
    switch (type) {
      case 'mototaxi': return 'Pedir Mototaxi';
      case 'domicilio': return 'Pedir Domicilio';
      case 'encomienda': return 'Enviar Encomienda';
      case 'compra': return 'Comprar Producto';
      case 'mandado': return 'Mandado Personal';
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12">
      {/* Header */}
      <div className="px-6 pb-4 border-b border-divider flex items-center justify-between">
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-sora font-bold text-base text-ink">{getFormTitle()}</span>
        <div className="w-10"></div> {/* balancing spacer */}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 content-scrollbar pb-32">
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* MOTOTAXI FORM */}
            {type === 'mototaxi' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-primary-surface/40 p-4 rounded-2xl border border-primary-surface flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary-surface text-primary">
                    <Bike size={20} />
                  </div>
                  <div>
                    <h4 className="font-sora font-semibold text-xs text-primary-dark">Tarifa Estimada</h4>
                    <p className="font-sora font-extrabold text-lg text-ink">$4.800 <span className="text-xs font-normal text-ink-soft">COP</span></p>
                    <p className="text-[11px] text-ink-soft mt-0.5">El valor final puede variar según el recorrido real.</p>
                  </div>
                </div>

                {/* Pickup address */}
                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin size={12} className="text-primary" /> Dirección de Origen
                  </label>
                  <input 
                    type="text" 
                    required
                    value={pickup} 
                    onChange={e => setPickup(e.target.value)}
                    placeholder="¿Dónde te recogemos?"
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {favorites.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleQuickSelect(f.address, true)}
                        className="text-xs bg-surface-alt hover:bg-divider text-ink-soft font-medium px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery address */}
                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin size={12} className="text-accent" /> Dirección de Destino
                  </label>
                  <input 
                    type="text" 
                    required
                    value={delivery} 
                    onChange={e => setDelivery(e.target.value)}
                    placeholder="¿A dónde vas?"
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {favorites.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleQuickSelect(f.address, false)}
                        className="text-xs bg-surface-alt hover:bg-divider text-ink-soft font-medium px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DOMICILIO FORM */}
            {type === 'domicilio' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Select Restaurant */}
                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">
                    1. Elige un Negocio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {RESTAURANTS_MOCK.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRestId(r.id);
                          setCart({}); // clear cart on switch
                        }}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                          selectedRestId === r.id 
                            ? 'border-primary bg-primary-surface text-ink font-semibold' 
                            : 'border-divider bg-white text-ink-soft'
                        }`}
                      >
                        <span className="text-2xl mb-1">{r.image}</span>
                        <span className="text-[11px] leading-tight block truncate w-full">{r.name}</span>
                        <span className="text-[9px] text-ink-faint mt-0.5">{r.rating} ★</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Restaurant Menu */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider">
                      2. Agrega Productos de {selectedRestaurant.name}
                    </label>
                    <span className="text-[10px] bg-surface-alt text-ink-soft font-semibold px-2 py-0.5 rounded-full">
                      Envío: $3.500
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 content-scrollbar">
                    {selectedRestaurant.menu.map(item => {
                      const qty = cart[item.name] || 0;
                      return (
                        <div key={item.name} className="p-3 bg-surface-alt/70 rounded-xl border border-divider/50 flex items-center justify-between gap-2 text-left">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[13px] font-semibold text-ink leading-snug">{item.name}</h5>
                            <p className="text-[10px] text-ink-soft mt-0.5 truncate">{item.desc}</p>
                            <span className="text-xs font-bold text-primary block mt-1">${item.price.toLocaleString('es-CO')}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0 bg-white shadow-sm border border-divider/80 rounded-lg p-1">
                            {qty > 0 ? (
                              <>
                                <button 
                                  type="button" 
                                  onClick={() => updateCart(item.name, -1)}
                                  className="w-5 h-5 rounded bg-surface-alt text-ink flex items-center justify-center hover:bg-divider"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{qty}</span>
                                <button 
                                  type="button" 
                                  onClick={() => updateCart(item.name, 1)}
                                  className="w-5 h-5 rounded bg-primary-surface text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                >
                                  <Plus size={11} />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => updateCart(item.name, 1)}
                                className="text-[10px] font-bold text-primary px-2.5 py-1 rounded hover:bg-primary-surface transition-all"
                              >
                                Agregar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtotal Display */}
                {getCartTotal() > 0 && (
                  <div className="bg-primary-surface/30 p-3.5 rounded-xl border border-primary-surface flex justify-between items-center">
                    <div>
                      <span className="text-xs text-ink-soft block font-medium">Subtotal pedido</span>
                      <span className="text-xs text-ink-soft block font-medium">Costo de envío</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-ink block">${getCartTotal().toLocaleString('es-CO')}</span>
                      <span className="text-xs font-semibold text-ink block">$3.500</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ENCOMIENDA FORM */}
            {type === 'encomienda' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-primary-surface/40 p-4 rounded-2xl border border-primary-surface flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary-surface text-primary">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-sora font-semibold text-xs text-primary-dark">Tarifa fija de envío</h4>
                    <p className="font-sora font-extrabold text-lg text-ink">$4.500 <span className="text-xs font-normal text-ink-soft">COP</span></p>
                    <p className="text-[11px] text-ink-soft mt-0.5">Envía paquetes, llaves, documentos o encargos pequeños de inmediato.</p>
                  </div>
                </div>

                {/* Form Elements */}
                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Dirección de Recogida
                  </label>
                  <input 
                    type="text" 
                    required
                    value={pickup} 
                    onChange={e => setPickup(e.target.value)}
                    placeholder="¿Dónde recogemos el paquete?"
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Dirección de Entrega
                  </label>
                  <input 
                    type="text" 
                    required
                    value={delivery} 
                    onChange={e => setDelivery(e.target.value)}
                    placeholder="¿A dónde enviamos el paquete?"
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                      Destinatario
                    </label>
                    <input 
                      type="text" 
                      required
                      value={recipientName} 
                      onChange={e => setRecipientName(e.target.value)}
                      placeholder="Nombre de quien recibe"
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                      Teléfono
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={recipientPhone} 
                      onChange={e => setRecipientPhone(e.target.value)}
                      placeholder="Ej: 315..."
                      className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">
                    Tipo de Paquete
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Caja / Paquete', 'Documentos', 'Frágil / Delicado'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPackageType(t)}
                        className={`py-2 px-1.5 text-[11px] rounded-xl border font-medium text-center transition-all ${
                          packageType === t 
                            ? 'border-primary bg-primary-surface text-primary-dark font-semibold' 
                            : 'border-divider bg-white text-ink-soft'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPRA FORM */}
            {type === 'compra' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-primary-surface/40 p-4 rounded-2xl border border-primary-surface flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary-surface text-primary">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-sora font-semibold text-xs text-primary-dark">Comprar un producto</h4>
                    <p className="text-[11px] text-ink-soft mt-0.5">El repartidor compra el producto y tú le reembolsas el valor + $5.500 COP del servicio de envío.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    ¿Qué producto necesitas comprar?
                  </label>
                  <textarea 
                    required
                    value={productDesc}
                    onChange={e => setProductDesc(e.target.value)}
                    placeholder="Escribe el producto, marca, tamaño y especificaciones de compra de forma clara..."
                    rows={2}
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    ¿Dónde lo compramos? (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={shopName} 
                    onChange={e => setShopName(e.target.value)}
                    placeholder="Ej: Farmacia Cruz Verde, Olímpica..."
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                      Presupuesto Máx (COP)
                    </label>
                    <input 
                      type="number" 
                      required
                      value={estimatedBudget} 
                      onChange={e => setEstimatedBudget(e.target.value)}
                      placeholder="Ej: 30000"
                      className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                      Entregar en:
                    </label>
                    <input 
                      type="text" 
                      required
                      value={delivery} 
                      onChange={e => setDelivery(e.target.value)}
                      placeholder="Dirección de entrega"
                      className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MANDADO FORM */}
            {type === 'mandado' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-primary-surface/40 p-4 rounded-2xl border border-primary-surface flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary-surface text-primary">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-sora font-semibold text-xs text-primary-dark">Mandado Personal / Diligencia</h4>
                    <p className="text-[11px] text-ink-soft mt-0.5">Perfecto para hacer filas, pagar recibos, recoger llaves u organizar encargos personalizados. Costo base: $6.000 COP.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    ¿Qué diligencia o mandado debemos realizar?
                  </label>
                  <textarea 
                    required
                    value={mandadoDesc}
                    onChange={e => setMandadoDesc(e.target.value)}
                    placeholder="Describe el mandado detalladamente. Ej: 'Llevar estas llaves al celador del Edificio Mirador y pedir que las guarde...'"
                    rows={3}
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Dirección de Origen / Inicio
                  </label>
                  <input 
                    type="text" 
                    required
                    value={pickup} 
                    onChange={e => setPickup(e.target.value)}
                    placeholder="¿Dónde inicia el mandado?"
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Dirección de Fin (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={delivery} 
                    onChange={e => setDelivery(e.target.value)}
                    placeholder="¿Dónde termina o reportamos?"
                    className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT ACTION BUTTON */}
            <div className="absolute bottom-6 left-6 right-6 z-10 bg-white pt-2">
              <button
                type="submit"
                disabled={type === 'domicilio' && getCartTotal() === 0}
                className={`w-full font-sora py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  type === 'domicilio' && getCartTotal() === 0
                    ? 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                    : 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                }`}
              >
                {type === 'domicilio' ? 'Confirmar Pedido' : 'Solicitar de Inmediato'}
              </button>
            </div>
          </form>
        )}

        {/* LOADING ANIMATION STATE */}
        {step === 'loading' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-primary-surface border-t-primary animate-spin"></div>
              <span className="absolute text-2xl">🛵</span>
            </div>
            <div className="space-y-2 animate-pulse">
              <h3 className="font-sora font-extrabold text-lg text-ink">Buscando Movilero...</h3>
              <p className="text-sm text-ink-soft max-w-[240px]">Estamos localizando el conductor calificado más cercano a tu ubicación.</p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {step === 'success' && assignedDriver && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-6 animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-primary-surface text-primary flex items-center justify-center text-3xl shadow-inner">
              <ShieldCheck size={36} />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-sora font-extrabold text-xl text-ink">¡Servicio Confirmado!</h3>
              <p className="text-sm text-primary-dark font-medium">Conductor asignado y en camino</p>
            </div>

            {/* Driver card preview */}
            <div className="w-full bg-surface-alt p-4 rounded-2xl border border-divider flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-surface text-2xl flex items-center justify-center">
                {assignedDriver.avatar}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-sm text-ink truncate">{assignedDriver.name}</h4>
                <p className="text-xs text-ink-soft font-mono">{assignedDriver.vehicle} • {assignedDriver.plate}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-primary-surface text-primary-dark font-bold px-2 py-0.5 rounded-full">
                  ★ {assignedDriver.rating}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-soft">Redirigiendo a tu historial para seguimiento en vivo...</p>
          </div>
        )}
      </div>
    </div>
  );
}
