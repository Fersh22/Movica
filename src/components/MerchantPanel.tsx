import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, ShoppingBag, Clock, Plus, Edit2, Trash2, CheckCircle, 
  TrendingUp, DollarSign, ClipboardList, Star, X, Save, 
  UploadCloud, Check, ChevronRight, User, Phone, Mail, MapPin, 
  Sparkles, Sliders, ToggleLeft, ToggleRight, MessageSquare, Award
} from 'lucide-react';

interface MerchantPanelProps {
  onBackToClient: () => void;
  userPhone?: string;
  userName?: string;
  userEmail?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
  available: boolean;
}

interface Order {
  id: string;
  customerName: string;
  items: string;
  price: number;
  status: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  time: string;
}

const PRESET_LOGOS = ['🍔', '🍕', '🍰', '🥩', '☕', '🍦', '🥦', '💊', '🐶', '🍹', '🛒', '🌮', '🍗', '🍜', '🥐', '🌶️'];
const PRESET_LOCAL_PICS = ['🏪', '🏬', '🏢', '🎪', '🏡', '🏗️'];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p-1', name: 'Super Salchipapa Especial', price: 18500, description: 'Papas fritas con salchicha manguera, queso fundido, ripio, pollo desmechado y salsa tártara de la casa.', emoji: '🍟', available: true },
  { id: 'p-2', name: 'Arepa de Choclo con Queso', price: 8000, description: 'Arepa de maíz tierno, asada a la plancha con mantequilla y doble porción de queso costeño.', emoji: '🫓', available: true },
  { id: 'p-3', name: 'Empanada Valluna Crujiente', price: 3000, description: 'Empanada de maíz frito, rellena de carne desmechada de res y papa criolla, acompañada de ají casero.', emoji: '🌮', available: true },
  { id: 'p-4', name: 'Limonada de Coco Imperial', price: 7500, description: 'Bebida helada de jugo de limón fresco licuado con crema de coco espesa y hielo frapeado.', emoji: '🍹', available: true }
];

const INITIAL_ORDERS: Order[] = [
  { id: 'PED-4021', customerName: 'Ferney Gómez', items: '1x Super Salchipapa Especial, 1x Limonada de Coco', price: 26000, status: 'pendiente', time: 'Hace 5 min' },
  { id: 'PED-4022', customerName: 'Camila Rojas', items: '2x Arepa de Choclo con Queso', price: 16000, status: 'preparando', time: 'Hace 12 min' },
  { id: 'PED-4023', customerName: 'Andrés Pardo', items: '3x Empanada Valluna Crujiente', price: 9000, status: 'listo', time: 'Hace 20 min' },
  { id: 'PED-4024', customerName: 'Diana Gómez', items: '1x Super Salchipapa Especial, 2x Limonada de Coco', price: 33500, status: 'entregado', time: 'Hace 1 hora' }
];

export default function MerchantPanel({ 
  onBackToClient, 
  userPhone = '312 456 7890', 
  userName = 'Ferney Gómez', 
  userEmail = 'ferney.gomez@movica.com' 
}: MerchantPanelProps) {
  // REGISTRATION & PANEL APPLICATION STATE
  const [appStatus, setAppStatus] = useState<string | null>(null);
  const [appData, setAppData] = useState<any | null>(null);
  const [regStep, setRegStep] = useState(1);

  // PANTALLA 1: REGISTRO FORM
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Restaurante');
  const [selectedLogo, setSelectedLogo] = useState('🍔');
  const [selectedLocalPic, setSelectedLocalPic] = useState('🏪');

  // PANTALLA 2: HORARIOS Y ESTADO
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']);
  const [prepTime, setPrepTime] = useState(25);
  const [isOpen, setIsOpen] = useState(true);

  // PANTALLA 3: PRODUCTOS STATES
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('movica_merchant_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodEmoji, setProdEmoji] = useState('🍔');
  const [prodAvailable, setProdAvailable] = useState(true);

  // PANTALLA 4: PEDIDOS STATE
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('movica_merchant_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [orderFilter, setOrderFilter] = useState<'todos' | 'pendiente' | 'preparando' | 'listo' | 'entregado'>('todos');

  // PANEL NAVIGATION
  const [panelTab, setPanelTab] = useState<'pedidos' | 'productos' | 'horario' | 'estadisticas'>('pedidos');

  // Load app state
  useEffect(() => {
    const savedApp = localStorage.getItem('movica_merchant_application');
    if (savedApp) {
      const parsed = JSON.parse(savedApp);
      setAppData(parsed);
      setAppStatus(parsed.status);
      
      // Load stored details
      setBusinessName(parsed.businessName || '');
      setOwnerName(parsed.ownerName || '');
      setPhone(parsed.phone || '');
      setEmail(parsed.email || '');
      setAddress(parsed.address || '');
      setCategory(parsed.category || 'Restaurante');
      setSelectedLogo(parsed.selectedLogo || '🍔');
      setSelectedLocalPic(parsed.selectedLocalPic || '🏪');
      setSelectedDays(parsed.selectedDays || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']);
      setPrepTime(parsed.prepTime || 25);
      setIsOpen(parsed.isOpen !== undefined ? parsed.isOpen : true);
    }
  }, []);

  // Sync products to local storage
  useEffect(() => {
    localStorage.setItem('movica_merchant_products', JSON.stringify(products));
  }, [products]);

  // Sync orders to local storage
  useEffect(() => {
    localStorage.setItem('movica_merchant_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle submit registration (Pantalla 1 & 2 wizard)
  const handleSubmitRegistration = () => {
    const newApp = {
      id: `MERCH-${Math.floor(1000 + Math.random() * 9000)}`,
      businessName,
      ownerName,
      phone,
      email,
      address,
      category,
      selectedLogo,
      selectedLocalPic,
      selectedDays,
      prepTime,
      isOpen,
      status: 'pendiente', // initially pending administrative approval
      submittedAt: new Date().toLocaleDateString('es-CO') + ' ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    localStorage.setItem('movica_merchant_application', JSON.stringify(newApp));
    setAppData(newApp);
    setAppStatus('pendiente');
  };

  const handleUpdateBusinessStatus = (newOpenState: boolean) => {
    setIsOpen(newOpenState);
    if (appData) {
      const updated = { ...appData, isOpen: newOpenState };
      localStorage.setItem('movica_merchant_application', JSON.stringify(updated));
      setAppData(updated);
    }
  };

  const handleSaveHorarioChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (appData) {
      const updated = { 
        ...appData, 
        selectedDays, 
        prepTime 
      };
      localStorage.setItem('movica_merchant_application', JSON.stringify(updated));
      setAppData(updated);
      alert('¡Configuración de horario y preparación guardada con éxito!');
    }
  };

  // PRODUCT ACTIONS
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) return;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: prodName.trim(),
      price: parseFloat(prodPrice),
      description: prodDesc.trim(),
      emoji: prodEmoji,
      available: prodAvailable
    };

    setProducts(prev => [newProd, ...prev]);
    setIsAddingProduct(false);
    resetProductForm();
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingProduct || !prodName.trim() || !prodPrice) return;

    setProducts(prev => prev.map(p => {
      if (p.id === isEditingProduct.id) {
        return {
          ...p,
          name: prodName.trim(),
          price: parseFloat(prodPrice),
          description: prodDesc.trim(),
          emoji: prodEmoji,
          available: prodAvailable
        };
      }
      return p;
    }));

    setIsEditingProduct(null);
    resetProductForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto de tu menú?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleProductAvailability = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, available: !p.available };
      }
      return p;
    }));
  };

  const resetProductForm = () => {
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdEmoji('🍔');
    setProdAvailable(true);
  };

  const openEditModal = (p: Product) => {
    setIsEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price.toString());
    setProdDesc(p.description);
    setProdEmoji(p.emoji);
    setProdAvailable(p.available);
  };

  // ORDER ACTIONS
  const advanceOrderStatus = (orderId: string, currentStatus: string) => {
    let nextStatus: 'pendiente' | 'preparando' | 'listo' | 'entregado' = 'pendiente';
    if (currentStatus === 'pendiente') nextStatus = 'preparando';
    else if (currentStatus === 'preparando') nextStatus = 'listo';
    else if (currentStatus === 'listo') nextStatus = 'entregado';

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const cancelOrder = (orderId: string) => {
    if (confirm('¿Deseas rechazar o cancelar este pedido?')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // COMPUTED STATS (PANTALLA 5)
  const totalSalesDay = orders
    .filter(o => o.status === 'entregado')
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalSalesMonth = totalSalesDay * 28 + 482000; // Simulated accumulation
  const totalOrdersCount = orders.length + 84; // Simulated baseline
  const averageRatingVal = 4.85;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F4] relative">
      
      {/* APP HEADER SPANNING INSIDE THE DEVICE PORT */}
      <div className="bg-[#0D1A16] px-5 py-4 flex items-center justify-between text-white flex-shrink-0 relative">
        <div className="flex items-center gap-2">
          <Store className="text-primary" size={18} />
          <div>
            <h3 className="font-sora font-extrabold text-xs tracking-tight">
              {appStatus === 'aprobado' ? businessName : 'Socios Comercio'}
            </h3>
            <span className="text-[8.5px] text-white/50 block font-bold uppercase tracking-wider">
              {appStatus === 'aprobado' ? category : 'Movica Aliados'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToClient}
          className="px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-full text-[9px] font-bold cursor-pointer transition-all"
        >
          Volver a Cliente
        </button>
      </div>

      <div className="flex-1 overflow-y-auto content-scrollbar pb-10">
        
        {/* IF NOT REGISTERED AT ALL OR IN WIZARD */}
        {!appStatus && (
          <div className="p-5 space-y-4">
            
            {/* STAGES INDICATOR */}
            <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-divider/50 shadow-sm text-left">
              <div>
                <span className="text-[8.5px] text-primary font-black uppercase tracking-wider">Paso {regStep} de 2</span>
                <h4 className="font-sora font-bold text-xs text-ink">
                  {regStep === 1 ? 'Datos de tu Comercio' : 'Horarios e inicialización'}
                </h4>
              </div>
              <div className="flex gap-1">
                <span className={`w-2.5 h-1.5 rounded-full ${regStep >= 1 ? 'bg-primary' : 'bg-divider'}`} />
                <span className={`w-2.5 h-1.5 rounded-full ${regStep >= 2 ? 'bg-primary' : 'bg-divider'}`} />
              </div>
            </div>

            {regStep === 1 ? (
              /* PANTALLA 1: REGISTRO DEL COMERCIO */
              <div className="bg-white rounded-3xl p-5 border border-divider/60 shadow-sm space-y-4 text-left">
                <div className="text-center space-y-1 pb-2 border-b border-divider/30">
                  <span className="text-3xl">🏪</span>
                  <h4 className="font-sora font-extrabold text-sm text-ink">Registra tu Comercio</h4>
                  <p className="text-[10px] text-ink-soft">Vende tus productos a miles de clientes en Aguachica.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Nombre del Negocio</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Hamburguesas El Corralito"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Propietario / Representante</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre del propietario"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Celular de Contacto</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Categoría</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                      >
                        <option value="Restaurante">🍔 Restaurante</option>
                        <option value="Supermercado">🛒 Supermercado</option>
                        <option value="Farmacia">💊 Farmacia</option>
                        <option value="Postres & Panadería">🍰 Postres & Café</option>
                        <option value="Mascotas">🐶 Mascotas</option>
                        <option value="Licores">🍹 Licores 24H</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Dirección del Local</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ej: Calle 3 # 12-45, Centro"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full bg-surface-alt border border-divider/40 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                      />
                      <MapPin size={13} className="absolute left-3.5 top-3.5 text-ink-soft" />
                    </div>
                  </div>

                  {/* LOGO SELECTION */}
                  <div>
                    <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1.5">Logo del Negocio (Simulado)</label>
                    <div className="grid grid-cols-8 gap-1.5 bg-surface-alt p-2.5 rounded-2xl max-h-[82px] overflow-y-auto content-scrollbar border border-divider/20">
                      {PRESET_LOGOS.map(logo => (
                        <button
                          key={logo}
                          type="button"
                          onClick={() => setSelectedLogo(logo)}
                          className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center text-sm border transition-all cursor-pointer ${
                            selectedLogo === logo ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-divider/30 hover:bg-surface-alt'
                          }`}
                        >
                          {logo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PHOTO OF STORE */}
                  <div>
                    <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1.5">Foto de la fachada/local (Simulada)</label>
                    <div className="grid grid-cols-6 gap-2 bg-surface-alt p-2.5 rounded-2xl border border-divider/20">
                      {PRESET_LOCAL_PICS.map(pic => (
                        <button
                          key={pic}
                          type="button"
                          onClick={() => setSelectedLocalPic(pic)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xl border transition-all cursor-pointer ${
                            selectedLocalPic === pic ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-divider/30 hover:bg-surface-alt'
                          }`}
                        >
                          {pic}
                        </button>
                      ))}
                    </div>
                    <span className="text-[8.5px] text-ink-soft italic block mt-1">Elige un estilo para simular la fachada física de tu comercio.</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!businessName.trim() || !address.trim() || !ownerName.trim()}
                  onClick={() => setRegStep(2)}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-sora font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all disabled:bg-ink-faint shadow-md shadow-primary/10 mt-2"
                >
                  Siguiente paso <ChevronRight size={13} />
                </button>
              </div>
            ) : (
              /* PANTALLA 2: HORARIOS DE ATENCIÓN Y ESTADO */
              <div className="bg-white rounded-3xl p-5 border border-divider/60 shadow-sm space-y-5 text-left">
                <div className="flex items-center gap-2 pb-3 border-b border-divider/30">
                  <span className="p-2 bg-primary-surface rounded-xl text-primary text-lg">🕒</span>
                  <div>
                    <h4 className="font-sora font-bold text-xs text-ink">Horario y Operación</h4>
                    <p className="text-[10px] text-ink-soft">Configura tus días de atención y tiempo de cocina.</p>
                  </div>
                </div>

                {/* DAYS */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider">Días de Servicio</label>
                  <div className="flex gap-1 flex-wrap">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => {
                      const isSel = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-primary border-primary text-white shadow-sm' 
                              : 'bg-white border-divider/40 text-ink-soft hover:bg-surface-alt'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PREPARATION TIME */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-ink">
                    <span className="text-ink-soft uppercase text-[9px] tracking-wider font-black">Tiempo de Preparación Promedio</span>
                    <span className="text-primary">{prepTime} minutos</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={prepTime}
                    onChange={e => setPrepTime(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[8px] text-ink-soft font-mono font-bold">
                    <span>5 MIN (RÁPIDO)</span>
                    <span>30 MIN</span>
                    <span>60 MIN (LENTO)</span>
                  </div>
                </div>

                {/* INITIAL STATUS */}
                <div className="p-3 bg-surface-alt/55 rounded-2xl border border-divider/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-ink block">Estado Inicial</span>
                    <p className="text-[9px] text-ink-soft mt-0.5">Define si inicias abierto a recibir pedidos inmediatamente.</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsOpen(true)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all cursor-pointer ${
                        isOpen 
                          ? 'bg-[#E6F7EC] text-[#0EA65C] border border-[#0EA65C]/20 font-black' 
                          : 'bg-white text-ink-soft hover:bg-surface-alt border border-divider/30'
                      }`}
                    >
                      🟢 Abierto
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all cursor-pointer ${
                        !isOpen 
                          ? 'bg-red-50 text-red-600 border border-red-200 font-black' 
                          : 'bg-white text-ink-soft hover:bg-surface-alt border border-divider/30'
                      }`}
                    >
                      🔴 Cerrado
                    </button>
                  </div>
                </div>

                {/* LEGAL CHECK */}
                <div className="flex items-start gap-2 text-[9.5px] font-medium leading-relaxed text-ink-soft bg-primary-surface/10 p-3 rounded-2xl border border-primary/10">
                  <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    Acepto los términos de afiliación de comercios Movica. Entiendo que la administración evaluará mis documentos simulados y me habilitará en breve.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="flex-1 bg-surface-alt hover:bg-divider/30 py-3 rounded-xl font-sora font-bold text-xs text-ink cursor-pointer transition-all border border-divider/30"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitRegistration}
                    className="flex-[2] bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-sora font-bold text-xs cursor-pointer transition-all shadow-md shadow-primary/10"
                  >
                    Enviar Solicitud ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* APPLICATION SENT: WAITING APPROVAL STATUS */}
        {appStatus === 'pendiente' && (
          <div className="p-5 text-center space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-divider/60 shadow-sm space-y-4 text-left">
              <div className="text-center pb-2 border-b border-divider/30">
                <span className="text-4xl block mb-2 animate-bounce">⏳</span>
                <span className="bg-amber-100 text-amber-800 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Revisión Administrativa
                </span>
                <h4 className="font-sora font-extrabold text-sm text-ink mt-2">¡Solicitud Recibida con éxito!</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">El administrador de Movica OS está evaluando los datos de tu comercio.</p>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between bg-surface-alt/45 p-2 rounded-xl text-[10px]">
                  <span className="text-ink-soft">Negocio:</span>
                  <span className="text-ink font-bold">{businessName}</span>
                </div>
                <div className="flex justify-between bg-surface-alt/45 p-2 rounded-xl text-[10px]">
                  <span className="text-ink-soft">Categoría:</span>
                  <span className="text-ink font-bold">{category}</span>
                </div>
                <div className="flex justify-between bg-surface-alt/45 p-2 rounded-xl text-[10px]">
                  <span className="text-ink-soft">Dirección:</span>
                  <span className="text-ink font-bold">{address}</span>
                </div>
                <div className="flex justify-between bg-surface-alt/45 p-2 rounded-xl text-[10px]">
                  <span className="text-ink-soft">Fecha Registro:</span>
                  <span className="text-primary font-bold">Hoy (Simulado)</span>
                </div>
              </div>

              <div className="p-3 bg-[#FFF9E6] border border-[#FFC629]/30 rounded-2xl text-[10px] text-amber-800 font-bold leading-normal flex gap-2">
                <span>💡</span>
                <p>
                  <strong>¿Cómo aprobarlo rápido?</strong> Abre el <strong>Panel Administrativo 💼</strong> (arriba) y ve a la pestaña <strong>Comercios Aliados 🏪</strong> para aprobar la solicitud de inmediato.
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToClient}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-sora font-bold text-xs cursor-pointer transition-all shadow-md shadow-primary/10 text-center"
              >
                Volver a la vista del cliente
              </button>
            </div>
          </div>
        )}

        {/* IF APPLICATION WAS SUSPENDED */}
        {appStatus === 'suspendido' && (
          <div className="p-5 text-center space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-divider/60 shadow-sm space-y-4 text-left">
              <div className="text-center pb-2">
                <span className="text-4xl block mb-2">🛑</span>
                <span className="bg-red-100 text-red-800 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Comercio Suspendido
                </span>
                <h4 className="font-sora font-extrabold text-sm text-ink mt-2">Acceso Restringido</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Tu negocio ha sido temporalmente suspendido por incumplimiento de términos o inactividad prolongada.</p>
              </div>

              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-[10px] font-bold leading-snug">
                Por favor, contáctate con soporte técnico de Movica o abre el Panel de Administración para habilitar nuevamente la operación de {businessName}.
              </div>

              <button
                type="button"
                onClick={onBackToClient}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-sora font-bold text-xs cursor-pointer text-center"
              >
                Volver al App Principal
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            APPROVED FULL BUSINESS OPERATIONS INTERACTIVE PANEL
            ========================================================================= */}
        {appStatus === 'aprobado' && (
          <div className="px-4 py-4 space-y-4">
            
            {/* COMPACT CONTROL SHEET (PANTALLA 2): OPEN/CLOSE STATE AND HEADER */}
            <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D1A16] flex items-center justify-center text-lg shadow-sm border border-divider/20">
                  {selectedLogo}
                </div>
                <div className="text-left">
                  <h4 className="font-sora font-extrabold text-xs text-ink">{businessName}</h4>
                  <span className="text-[9px] text-ink-soft block font-bold">
                    Preparación: {prepTime}m • {category}
                  </span>
                </div>
              </div>

              {/* LIVE OPERATION TOGGLE (🟢 Abierto / 🔴 Cerrado) */}
              <button
                type="button"
                onClick={() => handleUpdateBusinessStatus(!isOpen)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1 border shadow-xs ${
                  isOpen 
                    ? 'bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/35' 
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}
              >
                <span className="text-[8px]">{isOpen ? '🟢' : '🔴'}</span>
                <span>{isOpen ? 'Abierto' : 'Cerrado'}</span>
              </button>
            </div>

            {/* QUICK OPERATING TABS NAVIGATION */}
            <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-2xl border border-divider/40">
              {[
                { id: 'pedidos', label: 'Pedidos', icon: <ClipboardList size={14} /> },
                { id: 'productos', label: 'Menú', icon: <ShoppingBag size={14} /> },
                { id: 'horario', label: 'Horarios', icon: <Clock size={14} /> },
                { id: 'estadisticas', label: 'Stats', icon: <TrendingUp size={14} /> }
              ].map(tab => {
                const isAct = panelTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPanelTab(tab.id as any)}
                    className={`py-2 rounded-xl flex flex-col items-center justify-center text-[9px] font-bold transition-all cursor-pointer ${
                      isAct 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-ink-soft hover:bg-surface-alt/50 hover:text-ink'
                    }`}
                  >
                    {tab.icon}
                    <span className="mt-1">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* =========================================================================
                TAB 1: PEDIDOS RECIBIDOS (PANTALLA 4)
                ========================================================================= */}
            {panelTab === 'pedidos' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-left">
                  <h4 className="font-sora font-extrabold text-xs text-ink">Bandeja de Pedidos</h4>
                  
                  {/* States filters row */}
                  <select
                    value={orderFilter}
                    onChange={e => setOrderFilter(e.target.value as any)}
                    className="bg-white border border-divider/50 rounded-xl px-2.5 py-1 text-[9.5px] font-bold text-ink outline-none cursor-pointer"
                  >
                    <option value="todos">Todos ({orders.length})</option>
                    <option value="pendiente">Pendientes ({orders.filter(o => o.status === 'pendiente').length})</option>
                    <option value="preparando">En Cocina ({orders.filter(o => o.status === 'preparando').length})</option>
                    <option value="listo">Listos para Despacho ({orders.filter(o => o.status === 'listo').length})</option>
                    <option value="entregado">Entregados ({orders.filter(o => o.status === 'entregado').length})</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  {orders
                    .filter(o => {
                      if (orderFilter === 'todos') return true;
                      return o.status === orderFilter;
                    })
                    .length === 0 ? (
                      <div className="p-8 text-center bg-white border border-divider/40 rounded-3xl space-y-1">
                        <span className="text-3xl block">📋</span>
                        <p className="text-xs text-ink-soft italic font-semibold">No se encontraron pedidos con este filtro.</p>
                      </div>
                    ) : (
                      orders
                        .filter(o => {
                          if (orderFilter === 'todos') return true;
                          return o.status === orderFilter;
                        })
                        .map(order => {
                          let badgeBg = 'bg-amber-100 text-amber-800';
                          let badgeText = 'Pendiente';
                          let actionLabel = 'Iniciar Preparación';
                          if (order.status === 'preparando') {
                            badgeBg = 'bg-blue-100 text-blue-800';
                            badgeText = 'Preparando';
                            actionLabel = 'Listo para recoger';
                          } else if (order.status === 'listo') {
                            badgeBg = 'bg-[#E6F7EC] text-[#0EA65C]';
                            badgeText = 'Listo para recoger';
                            actionLabel = 'Entregado';
                          } else if (order.status === 'entregado') {
                            badgeBg = 'bg-slate-100 text-ink-soft';
                            badgeText = 'Entregado';
                          }

                          return (
                            <div key={order.id} className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm text-left space-y-3">
                              <div className="flex justify-between items-start pb-2 border-b border-divider/30">
                                <div>
                                  <span className="text-[9px] font-mono font-bold text-primary block">{order.id}</span>
                                  <h5 className="font-sora font-bold text-xs text-ink mt-0.5">{order.customerName}</h5>
                                </div>
                                <span className={`text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider ${badgeBg}`}>
                                  {badgeText}
                                </span>
                              </div>

                              <div className="text-[10.5px] font-medium text-ink-soft leading-normal bg-surface-alt/30 p-2.5 rounded-2xl">
                                {order.items}
                              </div>

                              <div className="flex justify-between items-center text-xs">
                                <span className="text-ink-soft font-bold">Total:</span>
                                <span className="font-sora font-extrabold text-ink text-sm">${order.price.toLocaleString('es-CO')} COP</span>
                              </div>

                              {order.status !== 'entregado' && (
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => cancelOrder(order.id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer"
                                  >
                                    Rechazar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => advanceOrderStatus(order.id, order.status)}
                                    className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                                  >
                                    {actionLabel}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                    )}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 2: ADMINISTRAR PRODUCTOS (PANTALLA 3)
                ========================================================================= */}
            {panelTab === 'productos' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-left">
                  <div>
                    <h4 className="font-sora font-extrabold text-xs text-ink">Catálogo de Productos</h4>
                    <p className="text-[9px] text-ink-soft">Agrega, edita o elimina los productos de tu menú.</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      resetProductForm();
                      setIsAddingProduct(true);
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus size={12} /> Agregar
                  </button>
                </div>

                {/* ADD/EDIT MODAL OVERLAYS */}
                <AnimatePresence>
                  {(isAddingProduct || isEditingProduct) && (
                    <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 text-left">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                          setIsAddingProduct(false);
                          setIsEditingProduct(null);
                        }}
                        className="absolute inset-0 bg-slate-950"
                      />
                      
                      <motion.div 
                        initial={{ scale: 0.94, y: 15, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.94, y: 15, opacity: 0 }}
                        className="bg-white border border-divider/60 rounded-3xl p-5 shadow-2xl relative w-full max-w-sm z-10 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-black text-primary uppercase tracking-wider">Menú del Comercio</span>
                            <h4 className="font-sora font-extrabold text-sm text-ink">
                              {isAddingProduct ? 'Nuevo Producto' : 'Editar Producto'}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingProduct(false);
                              setIsEditingProduct(null);
                            }}
                            className="p-1 rounded-lg hover:bg-surface-alt text-ink-soft cursor-pointer"
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <form onSubmit={isAddingProduct ? handleAddProduct : handleEditProduct} className="space-y-3.5">
                          <div>
                            <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Nombre del plato/producto</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej: Salchipapa Especial"
                              value={prodName}
                              onChange={e => setProdName(e.target.value)}
                              className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Precio ($ COP)</label>
                              <input
                                type="number"
                                required
                                placeholder="Ej: 15000"
                                value={prodPrice}
                                onChange={e => setProdPrice(e.target.value)}
                                className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Icono / Emoji</label>
                              <select
                                value={prodEmoji}
                                onChange={e => setProdEmoji(e.target.value)}
                                className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                              >
                                {PRESET_LOGOS.map(emoji => (
                                  <option key={emoji} value={emoji}>{emoji} Emoji</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider mb-1">Descripción</label>
                            <textarea
                              rows={2.5}
                              placeholder="Describe los ingredientes, tamaño o detalles..."
                              value={prodDesc}
                              onChange={e => setProdDesc(e.target.value)}
                              className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-between p-2.5 bg-surface-alt/55 rounded-xl border border-divider/20 text-xs">
                            <span className="font-bold text-ink-soft">Disponible para vender</span>
                            <button
                              type="button"
                              onClick={() => setProdAvailable(!prodAvailable)}
                              className="text-primary hover:scale-105 transition-all"
                            >
                              {prodAvailable ? <ToggleRight size={26} /> : <ToggleLeft className="text-ink-faint" size={26} />}
                            </button>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-sora font-bold text-xs cursor-pointer transition-all shadow-md shadow-primary/10 text-center"
                          >
                            {isAddingProduct ? 'Guardar Producto' : 'Actualizar Producto'}
                          </button>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* PRODUCTS LIST */}
                <div className="space-y-2.5">
                  {products.map(p => (
                    <div key={p.id} className="bg-white border border-divider/60 rounded-3xl p-3.5 shadow-sm text-left flex gap-3 relative">
                      <div className="w-11 h-11 bg-surface-alt rounded-2xl flex items-center justify-center text-2xl border border-divider/35 flex-shrink-0">
                        {p.emoji}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1 pr-6">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-sora font-extrabold text-xs text-ink truncate max-w-[130px]">{p.name}</h5>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.25 rounded-full tracking-wider ${
                            p.available ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-red-50 text-red-600'
                          }`}>
                            {p.available ? 'Disponible' : 'Agotado'}
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-soft leading-normal font-semibold line-clamp-2">{p.description}</p>
                        <span className="text-xs font-sora font-extrabold text-primary block mt-1">
                          ${p.price.toLocaleString('es-CO')}
                        </span>
                      </div>

                      {/* ACTIONS TOOLBAR */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1 rounded bg-surface-alt hover:bg-divider/30 text-ink-soft hover:text-ink cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-500 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 3: EDITAR HORARIOS Y ESTADO (PANTALLA 2)
                ========================================================================= */}
            {panelTab === 'horario' && (
              <form onSubmit={handleSaveHorarioChanges} className="bg-white rounded-3xl p-5 border border-divider/60 shadow-sm text-left space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-divider/30">
                  <span className="p-2 bg-primary-surface rounded-xl text-primary text-lg">🕒</span>
                  <div>
                    <h4 className="font-sora font-bold text-xs text-ink">Horarios de Atención</h4>
                    <p className="text-[10px] text-ink-soft">Configura tus días hábiles de servicio y tiempos.</p>
                  </div>
                </div>

                {/* DAYS OF SERVICE */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider">Días Habilitados</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => {
                      const isSel = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-[#0D1A16] border-[#0D1A16] text-white shadow-sm' 
                              : 'bg-white border-divider/40 text-ink-soft hover:bg-surface-alt'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[9px] text-ink-soft block italic">Solo los días marcados se mostrará tu local a los clientes.</span>
                </div>

                {/* AVERAGE COOK/PREP TIME */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-ink">
                    <span className="text-ink-soft uppercase text-[9px] tracking-wider font-black">Tiempo de cocina/preparación</span>
                    <span className="text-primary font-extrabold">{prepTime} minutos</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={prepTime}
                    onChange={e => setPrepTime(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-alt rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* LIVE STATE INFO SUMMARY */}
                <div className="bg-[#EBF3FF] border border-blue-200/50 p-4 rounded-2xl flex items-start gap-2.5">
                  <span className="text-lg">📢</span>
                  <div className="text-[10px] text-blue-900 leading-normal font-bold">
                    El estado de operación de tu negocio actualmente es <strong className="text-blue-950 uppercase">{isOpen ? 'Abierto 🟢' : 'Cerrado 🔴'}</strong>. Puedes modificar esto inmediatamente desde el interruptor principal en la cabecera.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-sora font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-primary/10 text-center"
                >
                  <Save size={13} /> Guardar Ajustes de Horario
                </button>
              </form>
            )}

            {/* =========================================================================
                TAB 4: ESTADÍSTICAS DEL NEGOCIO (PANTALLA 5)
                ========================================================================= */}
            {panelTab === 'estadisticas' && (
              <div className="space-y-4 text-left">
                
                {/* 2x2 GRID OF BENTO CARDS */}
                <div className="grid grid-cols-2 gap-2.5">
                  
                  {/* Daily sales */}
                  <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm space-y-1">
                    <span className="text-[8px] font-black text-ink-soft uppercase tracking-wider block">Ventas Hoy</span>
                    <h5 className="font-sora font-extrabold text-sm text-[#0EA65C]">
                      ${totalSalesDay.toLocaleString('es-CO')}
                    </h5>
                    <span className="text-[8.5px] text-ink-soft font-semibold block">Pedidos completados hoy</span>
                  </div>

                  {/* Monthly sales */}
                  <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm space-y-1">
                    <span className="text-[8px] font-black text-ink-soft uppercase tracking-wider block">Ventas Mes</span>
                    <h5 className="font-sora font-extrabold text-sm text-primary">
                      ${totalSalesMonth.toLocaleString('es-CO')}
                    </h5>
                    <span className="text-[8.5px] text-ink-soft font-semibold block">Suma acumulada</span>
                  </div>

                  {/* Total orders */}
                  <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm space-y-1">
                    <span className="text-[8px] font-black text-ink-soft uppercase tracking-wider block">Total Pedidos</span>
                    <h5 className="font-sora font-extrabold text-sm text-ink">
                      {totalOrdersCount}
                    </h5>
                    <span className="text-[8.5px] text-ink-soft font-semibold block">En plataforma Movica</span>
                  </div>

                  {/* Rating */}
                  <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm space-y-1">
                    <span className="text-[8px] font-black text-ink-soft uppercase tracking-wider block">Calificación</span>
                    <h5 className="font-sora font-extrabold text-sm text-amber-500 flex items-center gap-1">
                      ⭐ {averageRatingVal}
                    </h5>
                    <span className="text-[8.5px] text-ink-soft font-semibold block">Promedio de clientes</span>
                  </div>
                </div>

                {/* BEST-SELLING PRODUCTS (PANTALLA 5) */}
                <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm space-y-3">
                  <div>
                    <h4 className="font-sora font-extrabold text-xs text-ink">Productos Más Vendidos</h4>
                    <p className="text-[9px] text-ink-soft">Top histórico de volumen de despachos.</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Super Salchipapa Especial', qty: 45, emoji: '🍟', pct: 100 },
                      { name: 'Limonada de Coco Imperial', qty: 32, emoji: '🍹', pct: 71 },
                      { name: 'Arepa de Choclo con Queso', qty: 18, emoji: '🫓', pct: 40 },
                      { name: 'Empanada Valluna Crujiente', qty: 12, emoji: '🌮', pct: 26 }
                    ].map(topItem => (
                      <div key={topItem.name} className="space-y-1.5 text-xs font-semibold">
                        <div className="flex justify-between text-[10.5px]">
                          <span className="text-ink flex items-center gap-1 truncate">
                            <span>{topItem.emoji}</span>
                            <span className="truncate">{topItem.name}</span>
                          </span>
                          <span className="text-primary font-black">{topItem.qty} unds</span>
                        </div>
                        {/* Styled progress bar */}
                        <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                            style={{ width: `${topItem.pct}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUSINESS GROWTH BANNER */}
                <div className="bg-[#0D1A16] text-white p-4 rounded-3xl space-y-1 border border-primary/20">
                  <span className="bg-primary/20 text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-primary/20">
                    Socio Comercial Destacado
                  </span>
                  <h5 className="font-sora font-extrabold text-xs mt-1.5">¡Tu negocio sigue creciendo!</h5>
                  <p className="text-[10px] text-white/70 leading-normal">
                    Movica promociona tu local de forma gratuita entre las 7:00 PM y las 9:00 PM los fines de semana. ¡Mantente abierto!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
