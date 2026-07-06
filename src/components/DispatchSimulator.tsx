import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Bike, Users, Play, RotateCcw, AlertTriangle, CheckCircle, 
  XCircle, Clock, ShieldCheck, MapPin, ChevronRight, Info, Plus, Trash2, Sliders, ToggleLeft, ToggleRight
} from 'lucide-react';

interface Ally {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  plate: string;
  status: 'disponible' | 'no_disponible';
  rating: number;
  distance: number; // in km
}

export default function DispatchSimulator() {
  // 1. Initial allies state
  const [allies, setAllies] = useState<Ally[]>([
    { id: 'ALI-301', name: 'Alvaro Restrepo', avatar: '👨‍✈️', vehicle: 'Yamaha NMAX 155', plate: 'KSM-92G', status: 'disponible', rating: 4.9, distance: 0.8 },
    { id: 'ALI-302', name: 'Juan Carlos Silva', avatar: '🏍️', vehicle: 'Yamaha FZ150', plate: 'XYZ-12C', status: 'disponible', rating: 4.8, distance: 1.5 },
    { id: 'ALI-303', name: 'Sonia Restrepo', avatar: '👩‍✈️', vehicle: 'Suzuki Gixxer 150', plate: 'MNK-45E', status: 'disponible', rating: 4.9, distance: 2.3 },
    { id: 'ALI-304', name: 'Andrés Mendoza', avatar: '🛵', vehicle: 'Honda Active 125', plate: 'ABC-89G', status: 'no_disponible', rating: 4.7, distance: 3.1 },
    { id: 'ALI-305', name: 'Wilson Cardona', avatar: '👨‍✈️', vehicle: 'KTM Duke 200', plate: 'PQW-11D', status: 'no_disponible', rating: 4.3, distance: 4.0 },
  ]);

  // 2. Client Service input state
  const [clientName, setClientName] = useState('Carolina Torres');
  const [serviceType, setServiceType] = useState<'mototaxi' | 'domicilio' | 'encomienda' | 'compra' | 'mandado'>('mototaxi');
  const [pickupAddress, setPickupAddress] = useState('Parque Principal Santander (Calle 5 # 11-20)');
  const [deliveryAddress, setDeliveryAddress] = useState('Hospital Regional José David Padilla (Carrera 20 # 5-11)');

  // 3. Dispatch system status
  // 'idle' | 'searching' | 'assigning' | 'assigned' | 'no_allies'
  const [dispatchState, setDispatchState] = useState<'idle' | 'searching' | 'assigning' | 'assigned' | 'no_allies'>('idle');
  const [searchStep, setSearchStep] = useState<number>(0); // 0: searching, 1: calculating, 2: selecting
  
  // 4. Queued available allies sorted by distance
  const [sortedAllies, setSortedAllies] = useState<Ally[]>([]);
  const [currentAllyIndex, setCurrentAllyIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);

  // 5. System stats
  const [stats, setStats] = useState({
    avgAssignTime: 4.5,
    totalProcessed: 28,
  });

  // 6. Ally management state
  const [newAllyName, setNewAllyName] = useState('');
  const [newAllyVehicle, setNewAllyVehicle] = useState('Yamaha FZ150');
  const [newAllyDistance, setNewAllyDistance] = useState('1.2');

  // Trigger dispatch simulation
  const startDispatch = () => {
    // Filter available allies
    const available = allies.filter(a => a.status === 'disponible');
    
    // Sort by distance ascending
    const sorted = [...available].sort((a, b) => a.distance - b.distance);
    setSortedAllies(sorted);
    setCurrentAllyIndex(0);
    setTimeLeft(15);

    setDispatchState('searching');
    setSearchStep(0);
  };

  // Handle searching animation intervals
  useEffect(() => {
    if (dispatchState === 'searching') {
      const step1 = setTimeout(() => {
        setSearchStep(1); // Calculating distances
      }, 1500);

      const step2 = setTimeout(() => {
        setSearchStep(2); // Selecting best ally
      }, 3000);

      const step3 = setTimeout(() => {
        if (sortedAllies.length > 0) {
          setDispatchState('assigning');
        } else {
          setDispatchState('no_allies');
        }
      }, 4500);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
      };
    }
  }, [dispatchState, sortedAllies]);

  // Handle assignment timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (dispatchState === 'assigning') {
      if (timeLeft <= 0) {
        // Auto-reject on timeout
        handleReject();
      } else {
        timer = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [dispatchState, timeLeft]);

  // Actions
  const handleAccept = () => {
    setDispatchState('assigned');
    // Simulate statistics update
    setStats(prev => ({
      avgAssignTime: parseFloat(((prev.avgAssignTime * prev.totalProcessed + (15 - timeLeft + 3)) / (prev.totalProcessed + 1)).toFixed(1)),
      totalProcessed: prev.totalProcessed + 1
    }));
  };

  const handleReject = () => {
    if (currentAllyIndex < sortedAllies.length - 1) {
      // Move to next closest available ally
      const nextIndex = currentAllyIndex + 1;
      setCurrentAllyIndex(nextIndex);
      setTimeLeft(15);
      
      // Momentarily show searching overlay
      const tempState = dispatchState;
      setDispatchState('searching');
      setSearchStep(2); // Selection step
      
      setTimeout(() => {
        setDispatchState('assigning');
      }, 1200);
    } else {
      // Nobody accepted
      setDispatchState('no_allies');
    }
  };

  const resetSimulator = () => {
    setDispatchState('idle');
    setSearchStep(0);
    setCurrentAllyIndex(0);
    setTimeLeft(15);
  };

  const handleToggleStatus = (id: string) => {
    setAllies(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'disponible' ? 'no_disponible' : 'disponible' } : a));
  };

  const handleAddAlly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllyName.trim()) return;

    const newAlly: Ally = {
      id: `ALI-${300 + allies.length + 1}`,
      name: newAllyName.trim(),
      avatar: Math.random() > 0.5 ? '👨‍✈️' : '🛵',
      vehicle: newAllyVehicle,
      plate: `MOV-${Math.floor(10 + Math.random() * 89)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      status: 'disponible',
      rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
      distance: parseFloat(newAllyDistance) || 1.0
    };

    setAllies([...allies, newAlly]);
    setNewAllyName('');
    setNewAllyDistance('1.2');
  };

  const handleDeleteAlly = (id: string) => {
    setAllies(prev => prev.filter(a => a.id !== id));
  };

  // Helpers for display
  const currentAlly = sortedAllies[currentAllyIndex];
  const availableAlliesCount = allies.filter(a => a.status === 'disponible').length;

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'mototaxi': return 'Mototaxi 🛵';
      case 'domicilio': return 'Domicilio 🍔';
      case 'encomienda': return 'Encomienda 📦';
      case 'compra': return 'Compra 🛒';
      case 'mandado': return 'Mandado 📋';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER EXPLAINER */}
      <div className="bg-gradient-to-r from-[#0d1a16] to-[#162f26] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-primary/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-primary/20 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-primary flex items-center gap-1">
            <Sparkles size={11} className="animate-pulse text-primary" /> Módulo 13 Oficial
          </span>
          <span className="bg-white/10 text-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Despacho Inteligente
          </span>
        </div>
        <h3 className="font-sora font-extrabold text-lg leading-snug">Simulador de Asignación Automática IA</h3>
        <p className="text-xs text-white/70 max-w-[620px] mt-1.5 leading-relaxed">
          Este sistema simula en tiempo real la asignación inteligente de servicios en Aguachica. 
          Filtra únicamente aliados en estado <strong>Disponible</strong>, los ordena por cercanía métrica (GPS), 
          y gestiona la negociación del viaje en cascada si un conductor rechaza o expira el tiempo.
        </p>
      </div>

      {/* THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* COL 1: ALLY CONFIGURATOR (4 cols) */}
        <div className="xl:col-span-4 bg-white border border-divider/60 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-divider/40 pb-3">
            <div>
              <h4 className="font-sora font-extrabold text-xs text-ink">Configuración de Aliados</h4>
              <p className="text-[10px] text-ink-soft">Controla el estado y distancias GPS en Aguachica</p>
            </div>
            <span className="text-[10px] bg-primary-surface text-primary font-black px-2 py-1 rounded-lg">
              {allies.length} Registrados
            </span>
          </div>

          {/* Quick Stats banner */}
          <div className="bg-surface-alt rounded-2xl p-3 flex justify-between text-center">
            <div>
              <span className="text-[9px] text-ink-soft block uppercase font-bold">Disponibles</span>
              <span className="font-sora font-black text-sm text-primary">🟢 {availableAlliesCount}</span>
            </div>
            <div className="border-r border-divider/60 my-1" />
            <div>
              <span className="text-[9px] text-ink-soft block uppercase font-bold">No Disponibles</span>
              <span className="font-sora font-black text-sm text-ink-soft">🔴 {allies.length - availableAlliesCount}</span>
            </div>
            <div className="border-r border-divider/60 my-1" />
            <div>
              <span className="text-[9px] text-ink-soft block uppercase font-bold">Promedio Distancia</span>
              <span className="font-sora font-black text-sm text-ink">
                {(allies.reduce((acc, curr) => acc + curr.distance, 0) / allies.length).toFixed(1)} km
              </span>
            </div>
          </div>

          {/* Allies interactive list */}
          <div className="space-y-2 max-h-[290px] overflow-y-auto content-scrollbar pr-1">
            {allies.map((ally) => (
              <div 
                key={ally.id}
                className={`p-3 rounded-2xl border transition-all ${
                  ally.status === 'disponible' 
                    ? 'bg-white border-divider/60 hover:border-primary/30' 
                    : 'bg-surface-alt/60 border-divider/30 opacity-70'
                } flex items-center justify-between gap-2`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-surface-alt border border-divider/30 flex items-center justify-center text-lg flex-shrink-0">
                    {ally.avatar}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-ink truncate leading-tight">{ally.name}</h5>
                    <p className="text-[9px] text-ink-soft truncate leading-tight mt-0.5">{ally.vehicle} • {ally.plate}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-amber-500 font-extrabold flex items-center">★ {ally.rating}</span>
                      <span className="text-[9px] text-primary font-black font-mono">📍 {ally.distance} km</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Status Toggle Switch */}
                  <button
                    onClick={() => handleToggleStatus(ally.id)}
                    className="p-1 rounded-lg text-ink-soft hover:bg-surface-alt transition-colors"
                    title={ally.status === 'disponible' ? "Poner Fuera de servicio" : "Poner Disponible"}
                  >
                    {ally.status === 'disponible' ? (
                      <ToggleRight className="text-primary w-7 h-7" />
                    ) : (
                      <ToggleLeft className="text-ink-faint w-7 h-7" />
                    )}
                  </button>

                  {/* Delete button (only if not a default ally ID to avoid emptying all) */}
                  <button
                    onClick={() => handleDeleteAlly(ally.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Ally Form */}
          <form onSubmit={handleAddAlly} className="bg-surface-alt/50 border border-divider/40 rounded-2xl p-3.5 space-y-2.5">
            <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Registrar Nuevo Aliado</span>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Nombre" 
                value={newAllyName}
                onChange={e => setNewAllyName(e.target.value)}
                className="bg-white border border-divider text-xs px-3 py-2 rounded-xl focus:outline-primary placeholder:text-ink-faint text-ink w-full"
              />
              <select
                value={newAllyVehicle}
                onChange={e => setNewAllyVehicle(e.target.value)}
                className="bg-white border border-divider text-xs px-2 py-2 rounded-xl focus:outline-primary text-ink w-full"
              >
                <option value="Yamaha FZ150">Yamaha FZ</option>
                <option value="Yamaha NMAX 155">Yamaha NMAX</option>
                <option value="Suzuki Gixxer">Suzuki Gixxer</option>
                <option value="Honda Active">Honda Active</option>
                <option value="KTM Duke">KTM Duke</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-ink-soft font-bold">📍 Dist:</span>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  placeholder="1.2" 
                  value={newAllyDistance}
                  onChange={e => setNewAllyDistance(e.target.value)}
                  className="bg-white border border-divider text-xs pl-12 pr-6 py-2 rounded-xl focus:outline-primary placeholder:text-ink-faint text-ink w-full"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-ink-soft font-black">km</span>
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-[10px] py-2 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={11} /> Agregar Aliado
              </button>
            </div>
          </form>
        </div>

        {/* COL 2: MAIN SIMULATOR SCREEN (5 cols) */}
        <div className="xl:col-span-5 bg-white border border-divider/60 rounded-3xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-divider/40 pb-3">
            <div>
              <h4 className="font-sora font-extrabold text-xs text-ink">Consola de Despacho</h4>
              <p className="text-[10px] text-ink-soft">Monitoreo de asignaciones en tiempo real</p>
            </div>
            <span className="text-[10px] font-black text-[#0EA65C] bg-[#E6F7EC] px-2.5 py-1 rounded-lg uppercase tracking-wider animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0EA65C]" /> Inteligente
            </span>
          </div>

          {/* SIMULATION CONTAINER */}
          <div className="relative bg-surface-alt/70 border border-divider/40 rounded-3xl p-5 min-h-[360px] flex flex-col justify-between overflow-hidden">
            
            {/* 1. IDLE STATE CONTAINER */}
            {dispatchState === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-primary-surface text-primary text-3xl flex items-center justify-center shadow-inner animate-bounce">
                  ⚙️
                </div>
                <div className="max-w-[280px]">
                  <h5 className="font-sora font-extrabold text-xs text-ink">Iniciar Pruebas de Despacho</h5>
                  <p className="text-[10px] text-ink-soft mt-1 leading-relaxed">
                    Presiona el botón de abajo para lanzar el proceso de búsqueda inteligente. 
                    El sistema filtrará los aliados disponibles en Aguachica y ofrecerá el viaje al más cercano.
                  </p>
                </div>

                <div className="bg-white border border-divider rounded-2xl p-3 w-full text-left space-y-1.5 shadow-2xs">
                  <span className="text-[9px] text-primary font-black uppercase tracking-wider block">Servicio a Simular</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] text-ink-soft block">Cliente</span>
                      <input 
                        type="text" 
                        value={clientName} 
                        onChange={e => setClientName(e.target.value)}
                        className="font-bold text-ink bg-transparent border-b border-divider focus:outline-none focus:border-primary text-xs w-full py-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-soft block">Servicio</span>
                      <select 
                        value={serviceType} 
                        onChange={e => setServiceType(e.target.value as any)}
                        className="font-bold text-ink bg-transparent border-b border-divider focus:outline-none focus:border-primary text-xs w-full py-0.5 cursor-pointer"
                      >
                        <option value="mototaxi">Mototaxi</option>
                        <option value="domicilio">Domicilio</option>
                        <option value="encomienda">Encomienda</option>
                        <option value="compra">Compra</option>
                        <option value="mandado">Mandado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startDispatch}
                  className="bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs px-5 py-3 rounded-2xl shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Play size={13} fill="currentColor" /> Simular Despacho
                </button>
              </div>
            )}

            {/* 2. SEARCHING STATE ANIMATION */}
            {dispatchState === 'searching' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-6">
                
                {/* Visual loading orbits */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-ping" />
                  <div className="absolute w-16 h-16 rounded-full border-4 border-dashed border-primary/40 animate-spin" />
                  <div className="absolute w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    🔍
                  </div>
                </div>

                {/* Simulated Steps with pulse */}
                <div className="space-y-3.5 w-full max-w-[280px]">
                  <div className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-300 ${
                    searchStep === 0 
                      ? 'bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/30 scale-105 shadow-2xs' 
                      : 'bg-white/60 text-ink-soft border-divider/40 opacity-60'
                  }`}>
                    <span className="text-sm">🔍</span>
                    <span className="font-sora font-bold text-[10.5px]">Buscando aliados cercanos...</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-300 ${
                    searchStep === 1 
                      ? 'bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/30 scale-105 shadow-2xs' 
                      : 'bg-white/60 text-ink-soft border-divider/40 opacity-60'
                  }`}>
                    <span className="text-sm">📍</span>
                    <span className="font-sora font-bold text-[10.5px]">Calculando distancias GPS...</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-300 ${
                    searchStep === 2 
                      ? 'bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/30 scale-105 shadow-2xs' 
                      : 'bg-white/60 text-ink-soft border-divider/40 opacity-60'
                  }`}>
                    <span className="text-sm">🛵</span>
                    <span className="font-sora font-bold text-[10.5px]">Seleccionando el mejor aliado...</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ASSIGNING NEGOTIATION STATE */}
            {dispatchState === 'assigning' && currentAlly && (
              <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
                
                {/* Header info */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Asignando Solicitud en Cascada</span>
                  <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#0EA65C] bg-[#E6F7EC] px-3 py-1 rounded-full border border-primary/10">
                    <Clock size={12} className="animate-spin text-primary" />
                    <span>Aliado tiene {timeLeft} segundos</span>
                  </div>
                </div>

                {/* The visual flow diagram requested in prompt: Client -> System -> Ally */}
                <div className="bg-white border border-divider/60 rounded-2xl p-3.5 space-y-3 shadow-2xs text-center relative">
                  <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">Ruta de Señal del Despacho</span>
                  
                  {/* Flow chart visualization */}
                  <div className="flex items-center justify-between px-3 py-1 relative">
                    
                    {/* SVG Connector lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-divider -translate-y-1/2 z-0">
                      <div className="absolute inset-y-0 left-0 bg-primary animate-pulse" style={{ width: '100%' }} />
                    </div>

                    {/* Client Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-alt border-2 border-divider flex items-center justify-center text-lg shadow-sm">
                        👤
                      </div>
                      <span className="text-[9px] font-bold text-ink mt-1 truncate max-w-[65px]">{clientName.split(' ')[0]}</span>
                      <span className="text-[7px] text-ink-soft uppercase leading-none font-black mt-0.5">Cliente</span>
                    </div>

                    {/* Movica System Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-[#0d1a16] text-white border-2 border-primary flex items-center justify-center text-base shadow-md relative">
                        <span className="animate-ping absolute inset-0 rounded-full bg-primary/20" />
                        🛵
                      </div>
                      <span className="text-[9px] font-extrabold text-primary mt-1">Movica IA</span>
                      <span className="text-[7px] text-[#0EA65C] uppercase leading-none font-black mt-0.5">Algoritmo</span>
                    </div>

                    {/* Selected Ally Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-[#0EA65C] flex items-center justify-center text-lg shadow-md animate-pulse">
                        {currentAlly.avatar}
                      </div>
                      <span className="text-[9px] font-bold text-ink mt-1 truncate max-w-[65px]">{currentAlly.name.split(' ')[0]}</span>
                      <span className="text-[7px] text-amber-500 uppercase leading-none font-black mt-0.5">📍 {currentAlly.distance} km</span>
                    </div>

                  </div>
                </div>

                {/* Candidate Driver Info Card */}
                <div className="bg-white border-2 border-[#0EA65C] rounded-2xl p-4.5 space-y-3 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 bg-primary" style={{ width: `${(timeLeft / 15) * 100}%`, transition: 'width 1s linear' }} />
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#E6F7EC] text-2xl flex items-center justify-center flex-shrink-0">
                        {currentAlly.avatar}
                      </div>
                      <div>
                        <span className="text-[9px] text-[#0EA65C] bg-[#E6F7EC] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider block w-max mb-1">
                          Candidato {currentAllyIndex + 1} (El más cercano)
                        </span>
                        <h4 className="font-sora font-extrabold text-xs text-ink">{currentAlly.name}</h4>
                        <p className="text-[9.5px] text-ink-soft font-semibold">{currentAlly.vehicle} • <span className="font-mono text-[9px]">{currentAlly.plate}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-ink-soft block font-bold leading-none mb-0.5">Distancia</span>
                      <span className="font-sora font-black text-xs text-[#0EA65C]">📍 {currentAlly.distance} km</span>
                    </div>
                  </div>

                  {/* Micro route info */}
                  <div className="bg-surface-alt p-2 rounded-xl text-left text-[9.5px] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary font-black">A:</span>
                      <span className="text-ink-soft truncate font-semibold">{pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-divider/40 pt-1">
                      <span className="text-amber-500 font-black">B:</span>
                      <span className="text-ink-soft truncate font-semibold">{deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Interactive Controls to Simulate the Ally Behavior */}
                  <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                    <button
                      onClick={handleReject}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-xl font-sora font-extrabold text-[10px] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                    >
                      ❌ Simular Rechazo
                    </button>
                    <button
                      onClick={handleAccept}
                      className="bg-[#0EA65C] hover:bg-[#087A43] text-white py-2 rounded-xl font-sora font-extrabold text-[10px] shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                    >
                      ✅ Simular Aceptación
                    </button>
                  </div>
                </div>

                <p className="text-[9px] text-ink-soft text-center italic">
                  *Si el aliado rechaza o expira el cronómetro, la solicitud saltará automáticamente al siguiente conductor.
                </p>
              </div>
            )}

            {/* 4. SUCCESS STATE: ASSIGNED! */}
            {dispatchState === 'assigned' && currentAlly && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-6">
                <div className="w-16 h-16 rounded-full bg-[#E6F7EC] border border-[#0EA65C]/20 text-[#0EA65C] text-3xl flex items-center justify-center shadow-lg animate-pulse">
                  ✅
                </div>
                
                <div className="max-w-[280px] space-y-1">
                  <span className="text-[10px] text-[#0EA65C] font-black uppercase tracking-wider block">¡SERVICIO ASIGNADO CON ÉXITO!</span>
                  <h4 className="font-sora font-extrabold text-sm text-ink">¡Aliado encontrado!</h4>
                  <p className="text-[10.5px] text-ink-soft leading-relaxed">
                    El servicio de <strong>{getServiceLabel(serviceType)}</strong> para el cliente <strong>{clientName}</strong> ha sido confirmado por <strong>{currentAlly.name}</strong> a solo <strong>{currentAlly.distance} km</strong> de distancia.
                  </p>
                </div>

                {/* Micro driver badge */}
                <div className="bg-white border border-divider/60 rounded-2xl p-3 w-full flex items-center justify-between text-left shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{currentAlly.avatar}</span>
                    <div>
                      <h5 className="font-extrabold text-xs text-ink">{currentAlly.name}</h5>
                      <span className="text-[9px] text-ink-soft font-bold uppercase">{currentAlly.vehicle} • {currentAlly.plate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-amber-500 font-extrabold block">⭐ {currentAlly.rating}</span>
                    <span className="text-[9px] text-primary font-black font-mono">Llegada en ~{(currentAlly.distance * 3 + 2).toFixed(0)} min</span>
                  </div>
                </div>

                <button
                  onClick={resetSimulator}
                  className="bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <RotateCcw size={12} /> Otra Simulación
                </button>
              </div>
            )}

            {/* 5. FAIL STATE: NO ALLIES */}
            {dispatchState === 'no_allies' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-500 text-3xl flex items-center justify-center shadow-md animate-bounce">
                  ⚠️
                </div>
                
                <div className="max-w-[290px] space-y-1">
                  <span className="text-[10px] text-red-600 font-black uppercase tracking-wider block">FALLO EN EL DESPACHO</span>
                  <h4 className="font-sora font-extrabold text-sm text-ink">No encontramos aliados disponibles</h4>
                  <p className="text-[10px] text-ink-soft leading-relaxed">
                    Todos los conductores en Aguachica rechazaron la oferta, se encuentran fuera de servicio, o no hay aliados conectados actualmente con estado disponible.
                  </p>
                </div>

                <div className="flex gap-2.5 w-full">
                  <button
                    onClick={() => {
                      // Set all allies to disponible for a quick recovery
                      setAllies(prev => prev.map(a => ({ ...a, status: 'disponible' })));
                      resetSimulator();
                    }}
                    className="flex-1 bg-surface-alt hover:bg-divider text-ink-soft border border-divider py-2.5 rounded-xl font-sora font-extrabold text-[10px] transition-colors cursor-pointer"
                  >
                    Activar todos los Aliados
                  </button>
                  <button
                    onClick={startDispatch}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-sora font-extrabold text-[10px] shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1"
                  >
                    <RotateCcw size={11} /> Intentar nuevamente
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* COL 3: STATS & SUMMARY (3 cols) */}
        <div className="xl:col-span-3 bg-white border border-divider/60 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="border-b border-divider/40 pb-3">
            <h4 className="font-sora font-extrabold text-xs text-ink">Estadísticas de Eficiencia</h4>
            <p className="text-[10px] text-ink-soft">Métricas acumuladas del despacho inteligente</p>
          </div>

          <div className="space-y-3">
            {/* Stat 1 */}
            <div className="bg-surface-alt/70 border border-divider/40 p-4 rounded-2xl relative overflow-hidden">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Tiempo Promedio Asignación</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-sora font-black text-2xl text-primary">{stats.avgAssignTime}s</span>
                <span className="text-[10px] text-[#0EA65C] font-extrabold">⚡ En tiempo real</span>
              </div>
              <p className="text-[9px] text-ink-soft mt-1 leading-snug">Metas del algoritmo: &lt; 5.0 segundos para mantener la satisfacción del cliente.</p>
              <div className="absolute right-3 bottom-3 text-3xl opacity-10">⏱️</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-surface-alt/70 border border-divider/40 p-4 rounded-2xl relative overflow-hidden">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Aliados Conectados</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-sora font-black text-2xl text-ink">{availableAlliesCount}</span>
                <span className="text-[10px] text-ink-soft font-semibold">/ {allies.length} en línea</span>
              </div>
              <p className="text-[9px] text-ink-soft mt-1 leading-snug">Mide la densidad de cobertura en los cuadrantes de Aguachica.</p>
              <div className="absolute right-3 bottom-3 text-3xl opacity-10">🛵</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-surface-alt/70 border border-divider/40 p-4 rounded-2xl relative overflow-hidden">
              <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Solicitudes Atendidas</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-sora font-black text-2xl text-ink">{stats.totalProcessed}</span>
                <span className="text-[10px] text-ink-soft font-semibold">exitosas hoy</span>
              </div>
              <p className="text-[9px] text-ink-soft mt-1 leading-snug">Suma acumulativa de servicios cerrados con aliado encontrado hoy.</p>
              <div className="absolute right-3 bottom-3 text-3xl opacity-10">📈</div>
            </div>
          </div>

          <div className="bg-primary-surface/40 border border-primary/10 p-3 rounded-2xl text-[10px] text-primary space-y-1.5">
            <span className="font-black flex items-center gap-1">
              <Info size={11} /> ¿Cómo funciona el algoritmo?
            </span>
            <p className="leading-relaxed text-ink-soft">
              Movica IA calcula la distancia del punto de recogida a las coordenadas GPS de cada aliado. 
              El despacho ofrece el servicio en cascada al más cercano primero, protegiendo las ganancias y el combustible de nuestros aliados.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
