import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, Globe, Navigation, Layers, Plus, Edit3, Trash2, Check, X, 
  DollarSign, Power, Grid, TrendingUp, Users, Bike, DollarSign as RevenueIcon, 
  MapPin, CloudRain, Moon, ShieldAlert, Zap, Coffee, Settings2, Sparkles, CheckCircle2
} from 'lucide-react';

export interface CoverageZone {
  id: string;
  name: string;
  type: 'barrio' | 'sector' | 'vereda' | 'comuna';
  status: 'activo' | 'inactivo';
  coordinates: { x: number; y: number; radius: number }; // Simulated map layout
}

export interface CityRates {
  baseFare: number;
  perBlockPrice: number;
  nightSurcharge: number;
  rainSurcharge: number;
  specialSurcharge: number;
}

export interface City {
  id: string;
  name: string;
  department: string;
  status: 'activo' | 'inactivo';
  services: {
    mototaxi: boolean;
    domicilios: boolean;
    encomiendas: boolean;
    compras: boolean;
    mandados: boolean;
  };
  rates: CityRates;
  zones: CoverageZone[];
  stats: {
    alliesCount: number;
    clientsCount: number;
    completedServices: number;
    revenue: number;
  };
}

const INITIAL_CITIES: City[] = [
  {
    id: 'city-1',
    name: 'Aguachica',
    department: 'Cesar',
    status: 'activo',
    services: {
      mototaxi: true,
      domicilios: true,
      encomiendas: true,
      compras: true,
      mandados: true,
    },
    rates: {
      baseFare: 2500,
      perBlockPrice: 300,
      nightSurcharge: 1000,
      rainSurcharge: 1500,
      specialSurcharge: 2000,
    },
    zones: [
      { id: 'z1-1', name: 'Zona Centro', type: 'sector', status: 'activo', coordinates: { x: 50, y: 50, radius: 25 } },
      { id: 'z1-2', name: 'Barrio El Parador', type: 'barrio', status: 'activo', coordinates: { x: 30, y: 35, radius: 15 } },
      { id: 'z1-3', name: 'Barrio Sabanitas', type: 'barrio', status: 'activo', coordinates: { x: 70, y: 65, radius: 18 } },
      { id: 'z1-4', name: 'Vereda Buturama', type: 'vereda', status: 'activo', coordinates: { x: 20, y: 75, radius: 12 } },
      { id: 'z1-5', name: 'Comuna 2 Norte', type: 'comuna', status: 'activo', coordinates: { x: 75, y: 25, radius: 20 } },
    ],
    stats: {
      alliesCount: 145,
      clientsCount: 3820,
      completedServices: 12450,
      revenue: 38950000,
    }
  },
  {
    id: 'city-2',
    name: 'Bucaramanga',
    department: 'Santander',
    status: 'activo',
    services: {
      mototaxi: false, // Prohibido mototaxi formal en algunas zonas, habilitado solo mensajería
      domicilios: true,
      encomiendas: true,
      compras: true,
      mandados: true,
    },
    rates: {
      baseFare: 4000,
      perBlockPrice: 400,
      nightSurcharge: 1500,
      rainSurcharge: 2000,
      specialSurcharge: 3000,
    },
    zones: [
      { id: 'z2-1', name: 'Cabecera del Llano', type: 'sector', status: 'activo', coordinates: { x: 60, y: 45, radius: 22 } },
      { id: 'z2-2', name: 'Barrio Real de Minas', type: 'barrio', status: 'activo', coordinates: { x: 35, y: 55, radius: 17 } },
      { id: 'z2-3', name: 'Comuna 13 Chicamocha', type: 'comuna', status: 'activo', coordinates: { x: 45, y: 25, radius: 19 } },
      { id: 'z2-4', name: 'Sector Provenza', type: 'sector', status: 'activo', coordinates: { x: 80, y: 70, radius: 24 } },
    ],
    stats: {
      alliesCount: 89,
      clientsCount: 2150,
      completedServices: 6320,
      revenue: 28440000,
    }
  },
  {
    id: 'city-3',
    name: 'Valledupar',
    department: 'Cesar',
    status: 'inactivo', // Inicialmente inactivo para demostración de activación
    services: {
      mototaxi: true,
      domicilios: true,
      encomiendas: true,
      compras: false,
      mandados: true,
    },
    rates: {
      baseFare: 3000,
      perBlockPrice: 350,
      nightSurcharge: 1200,
      rainSurcharge: 1800,
      specialSurcharge: 2500,
    },
    zones: [
      { id: 'z3-1', name: 'Barrio Novalito', type: 'barrio', status: 'activo', coordinates: { x: 50, y: 40, radius: 20 } },
      { id: 'z3-2', name: 'Sector Primero de Mayo', type: 'sector', status: 'activo', coordinates: { x: 40, y: 65, radius: 18 } },
      { id: 'z3-3', name: 'Comuna 4 Sur', type: 'comuna', status: 'activo', coordinates: { x: 70, y: 55, radius: 22 } },
    ],
    stats: {
      alliesCount: 42,
      clientsCount: 780,
      completedServices: 1920,
      revenue: 6720000,
    }
  }
];

export default function MultiCityManager() {
  const [cities, setCities] = useState<City[]>(() => {
    const saved = localStorage.getItem('movica_multicities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_CITIES; }
    }
    return INITIAL_CITIES;
  });

  const [selectedCityId, setSelectedCityId] = useState<string>('city-1');
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);

  // Form states for City creation & edit
  const [cityName, setCityName] = useState('');
  const [cityDept, setCityDept] = useState('');
  const [cityBaseFare, setCityBaseFare] = useState(2500);
  const [cityBlockPrice, setCityBlockPrice] = useState(300);
  const [cityNightSurcharge, setCityNightSurcharge] = useState(1000);
  const [cityRainSurcharge, setCityRainSurcharge] = useState(1500);
  const [citySpecialSurcharge, setCitySpecialSurcharge] = useState(2000);
  
  // Services checkboxes form
  const [servMototaxi, setServMototaxi] = useState(true);
  const [servDomicilios, setServDomicilios] = useState(true);
  const [servEncomiendas, setServEncomiendas] = useState(true);
  const [servCompras, setServCompras] = useState(true);
  const [servMandados, setServMandados] = useState(true);

  // Zone creation form states
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState<'barrio' | 'sector' | 'vereda' | 'comuna'>('barrio');
  const [isAddingZone, setIsAddingZone] = useState(false);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('movica_multicities', JSON.stringify(cities));
  }, [cities]);

  const selectedCity = cities.find(c => c.id === selectedCityId) || cities[0] || null;

  // City handlers
  const handleSaveCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim() || !cityDept.trim()) return;

    if (editingCityId) {
      // Edit city
      setCities(prev => prev.map(c => {
        if (c.id === editingCityId) {
          return {
            ...c,
            name: cityName.trim(),
            department: cityDept.trim(),
            services: {
              mototaxi: servMototaxi,
              domicilios: servDomicilios,
              encomiendas: servEncomiendas,
              compras: servCompras,
              mandados: servMandados,
            },
            rates: {
              baseFare: cityBaseFare,
              perBlockPrice: cityBlockPrice,
              nightSurcharge: cityNightSurcharge,
              rainSurcharge: cityRainSurcharge,
              specialSurcharge: citySpecialSurcharge,
            }
          };
        }
        return c;
      }));
      setEditingCityId(null);
      alert('Ciudad actualizada exitosamente.');
    } else {
      // Create city
      const newCity: City = {
        id: `city-${Date.now()}`,
        name: cityName.trim(),
        department: cityDept.trim(),
        status: 'activo',
        services: {
          mototaxi: servMototaxi,
          domicilios: servDomicilios,
          encomiendas: servEncomiendas,
          compras: servCompras,
          mandados: servMandados,
        },
        rates: {
          baseFare: cityBaseFare,
          perBlockPrice: cityBlockPrice,
          nightSurcharge: cityNightSurcharge,
          rainSurcharge: cityRainSurcharge,
          specialSurcharge: citySpecialSurcharge,
        },
        zones: [
          { id: `z-${Date.now()}-1`, name: 'Zona Centro', type: 'sector', status: 'activo', coordinates: { x: 50, y: 50, radius: 25 } }
        ],
        stats: {
          alliesCount: 0,
          clientsCount: 0,
          completedServices: 0,
          revenue: 0,
        }
      };
      setCities(prev => [...prev, newCity]);
      setSelectedCityId(newCity.id);
      setIsAddingCity(false);
      alert('Nueva ciudad de operación agregada exitosamente.');
    }
    resetCityForm();
  };

  const handleEditCityTrigger = (city: City) => {
    setEditingCityId(city.id);
    setCityName(city.name);
    setCityDept(city.department);
    setCityBaseFare(city.rates.baseFare);
    setCityBlockPrice(city.rates.perBlockPrice);
    setCityNightSurcharge(city.rates.nightSurcharge);
    setCityRainSurcharge(city.rates.rainSurcharge);
    setCitySpecialSurcharge(city.rates.specialSurcharge);
    setServMototaxi(city.services.mototaxi);
    setServDomicilios(city.services.domicilios);
    setServEncomiendas(city.services.encomiendas);
    setServCompras(city.services.compras);
    setServMandados(city.services.mandados);
    setIsAddingCity(true);
  };

  const handleDeleteCity = (id: string) => {
    if (cities.length <= 1) {
      alert('Debe haber al menos una ciudad de operación registrada en la plataforma.');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar esta ciudad y todas sus zonas de cobertura de forma permanente?')) {
      const filtered = cities.filter(c => c.id !== id);
      setCities(filtered);
      if (selectedCityId === id) {
        setSelectedCityId(filtered[0].id);
      }
    }
  };

  const handleToggleCityStatus = (id: string) => {
    setCities(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'activo' ? 'inactivo' : 'activo';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const resetCityForm = () => {
    setCityName('');
    setCityDept('');
    setCityBaseFare(2500);
    setCityBlockPrice(300);
    setCityNightSurcharge(1000);
    setCityRainSurcharge(1500);
    setCitySpecialSurcharge(2000);
    setServMototaxi(true);
    setServDomicilios(true);
    setServEncomiendas(true);
    setServCompras(true);
    setServMandados(true);
    setIsAddingCity(false);
    setEditingCityId(null);
  };

  // Zone handlers
  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim() || !selectedCity) return;

    const newZone: CoverageZone = {
      id: `zone-${Date.now()}`,
      name: zoneName.trim(),
      type: zoneType,
      status: 'activo',
      coordinates: {
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20,
        radius: Math.floor(Math.random() * 12) + 10
      }
    };

    setCities(prev => prev.map(c => {
      if (c.id === selectedCity.id) {
        return {
          ...c,
          zones: [...c.zones, newZone]
        };
      }
      return c;
    }));

    setZoneName('');
    setIsAddingZone(false);
    alert('Zona de cobertura agregada exitosamente.');
  };

  const handleToggleZoneStatus = (zoneId: string) => {
    if (!selectedCity) return;
    setCities(prev => prev.map(c => {
      if (c.id === selectedCity.id) {
        return {
          ...c,
          zones: c.zones.map(z => {
            if (z.id === zoneId) {
              return { ...z, status: z.status === 'activo' ? 'inactivo' : 'activo' };
            }
            return z;
          })
        };
      }
      return c;
    }));
  };

  const handleDeleteZone = (zoneId: string) => {
    if (!selectedCity) return;
    if (confirm('¿Deseas eliminar esta zona de cobertura permanentemente?')) {
      setCities(prev => prev.map(c => {
        if (c.id === selectedCity.id) {
          return {
            ...c,
            zones: c.zones.filter(z => z.id !== zoneId)
          };
        }
        return c;
      }));
    }
  };

  // Overall calculations for statistics section
  const totalCitiesCount = cities.length;
  const totalActiveCitiesCount = cities.filter(c => c.status === 'activo').length;
  const totalAlliesAcrossCities = cities.reduce((acc, curr) => acc + curr.stats.alliesCount, 0);
  const totalClientsAcrossCities = cities.reduce((acc, curr) => acc + curr.stats.clientsCount, 0);
  const totalServicesAcrossCities = cities.reduce((acc, curr) => acc + curr.stats.completedServices, 0);
  const totalRevenueAcrossCities = cities.reduce((acc, curr) => acc + curr.stats.revenue, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-divider/30 pb-4">
        <div>
          <h3 className="font-sora font-extrabold text-base text-ink flex items-center gap-2">
            <Globe className="text-primary animate-pulse" size={20} />
            Multiciudad y Zonas de Operación
          </h3>
          <p className="text-xs text-ink-soft mt-0.5">Define las ciudades habilitadas, zonas de cobertura con micro-tarifas y servicios activos de Movica.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetCityForm();
            setIsAddingCity(true);
          }}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} /> Registrar Nueva Ciudad
        </button>
      </div>

      {/* OVERALL PERFORMANCE STATISTICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-divider/60 p-4 rounded-2xl shadow-xs text-left">
          <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">🏢 Ciudades</span>
          <span className="text-lg font-sora font-black text-ink block mt-1">{totalCitiesCount} <span className="text-[10px] text-[#0EA65C] font-semibold">({totalActiveCitiesCount} Activas)</span></span>
        </div>

        <div className="bg-white border border-divider/60 p-4 rounded-2xl shadow-xs text-left">
          <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">🏍️ Aliados Totales</span>
          <span className="text-lg font-sora font-black text-ink block mt-1">{totalAlliesAcrossCities}</span>
        </div>

        <div className="bg-white border border-divider/60 p-4 rounded-2xl shadow-xs text-left">
          <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">👥 Clientes Totales</span>
          <span className="text-lg font-sora font-black text-ink block mt-1">{totalClientsAcrossCities.toLocaleString('es-CO')}</span>
        </div>

        <div className="bg-white border border-divider/60 p-4 rounded-2xl shadow-xs text-left">
          <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">📊 Servicios Completados</span>
          <span className="text-lg font-sora font-black text-[#0066FF] block mt-1">{totalServicesAcrossCities.toLocaleString('es-CO')}</span>
        </div>

        <div className="bg-white border border-divider/60 p-4 rounded-2xl shadow-xs text-left col-span-2 lg:col-span-1">
          <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">💰 Ingresos Brutos</span>
          <span className="text-lg font-sora font-black text-[#0EA65C] block mt-1">${totalRevenueAcrossCities.toLocaleString('es-CO')} COP</span>
        </div>
      </div>

      {/* ADD/EDIT CITY MODAL OVERLAY */}
      {isAddingCity && (
        <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-md max-w-2xl mx-auto text-left space-y-4">
          <div className="flex justify-between items-center border-b border-divider/40 pb-3">
            <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1.5">
              <Settings2 size={16} className="text-primary" />
              {editingCityId ? '📝 Editar Configuración de Ciudad' : '✨ Registrar Nueva Ciudad en Movica'}
            </h4>
            <button 
              onClick={resetCityForm}
              className="p-1 rounded-full bg-surface-alt hover:bg-divider text-ink-soft transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSaveCity} className="space-y-4">
            
            {/* GENERAL DETAILS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Nombre de la Ciudad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Aguachica, Bucaramanga..."
                  value={cityName}
                  onChange={e => setCityName(e.target.value)}
                  className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Departamento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cesar, Santander, Atlántico..."
                  value={cityDept}
                  onChange={e => setCityDept(e.target.value)}
                  className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* SERVICE MANAGEMENT CONFIG */}
            <div className="bg-surface-alt/50 border border-divider/40 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block">
                Servicios Habilitados en la Ciudad
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-bold text-ink">
                <label className="flex items-center gap-1.5 p-2 bg-white border border-divider/50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={servMototaxi} onChange={e => setServMototaxi(e.target.checked)} className="rounded text-primary" />
                  <span>🛵 Moto</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-white border border-divider/50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={servDomicilios} onChange={e => setServDomicilios(e.target.checked)} className="rounded text-primary" />
                  <span>🍔 Domicilios</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-white border border-divider/50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={servEncomiendas} onChange={e => setServEncomiendas(e.target.checked)} className="rounded text-primary" />
                  <span>📦 Pack</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-white border border-divider/50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={servCompras} onChange={e => setServCompras(e.target.checked)} className="rounded text-primary" />
                  <span>🛒 Compras</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 bg-white border border-divider/50 rounded-xl cursor-pointer col-span-2 sm:col-span-1">
                  <input type="checkbox" checked={servMandados} onChange={e => setServMandados(e.target.checked)} className="rounded text-primary" />
                  <span>📋 Mandados</span>
                </label>
              </div>
            </div>

            {/* MICRO-RATES CONFIGURATION */}
            <div className="bg-white border border-divider/50 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase text-ink-soft tracking-wider block flex items-center gap-1">
                <DollarSign size={13} className="text-primary" /> Configuración de Tarifas
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-ink-soft mb-1">Tarifa Base ($ COP)</label>
                  <input
                    type="number"
                    required
                    value={cityBaseFare}
                    onChange={e => setCityBaseFare(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft mb-1">Adicional x Cuadra ($)</label>
                  <input
                    type="number"
                    required
                    value={cityBlockPrice}
                    onChange={e => setCityBlockPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft mb-1">Recargo Nocturno ($)</label>
                  <input
                    type="number"
                    required
                    value={cityNightSurcharge}
                    onChange={e => setCityNightSurcharge(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-ink-soft mb-1">Recargo Lluvia ($)</label>
                  <input
                    type="number"
                    required
                    value={cityRainSurcharge}
                    onChange={e => setCityRainSurcharge(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[9px] font-bold text-ink-soft mb-1">Tarifa Especial (Domingos/Festivos) ($)</label>
                  <input
                    type="number"
                    required
                    value={citySpecialSurcharge}
                    onChange={e => setCitySpecialSurcharge(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={resetCityForm}
                className="bg-surface-alt hover:bg-divider text-ink-soft px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm shadow-primary/15"
              >
                <Check size={13} /> {editingCityId ? 'Actualizar Ciudad' : 'Crear Ciudad'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CORE SPLIT SCREEN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE CITIES DIRECTORY & MICRO STATS (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
          <div className="text-left border-b border-divider/30 pb-2.5">
            <h4 className="font-sora font-extrabold text-xs uppercase tracking-wider text-ink-soft">Directorio de Ciudades</h4>
            <p className="text-[10px] text-ink-soft">Selecciona una ciudad para administrar sus zonas de cobertura y ver métricas.</p>
          </div>

          <div className="space-y-2.5 overflow-y-auto content-scrollbar max-h-[500px]">
            {cities.map(city => {
              const isSelected = city.id === selectedCityId;
              const isActive = city.status === 'activo';
              
              return (
                <div
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`p-4 border rounded-2xl text-left cursor-pointer transition-all flex flex-col gap-2.5 ${
                    isSelected 
                      ? 'border-primary bg-primary-surface/10 ring-1 ring-primary/25' 
                      : 'border-divider bg-white hover:bg-surface-alt/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-sora font-extrabold text-xs text-ink block">{city.name}</span>
                      <span className="text-[9px] text-ink-soft font-bold block">{city.department}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Active Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCityStatus(city.id);
                        }}
                        className={`px-2 py-0.75 text-[8.5px] font-black uppercase rounded-lg border cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}
                      >
                        {isActive ? 'Activo' : 'Inactivo'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCityTrigger(city);
                        }}
                        className="p-1 rounded bg-surface-alt hover:bg-divider text-ink-soft transition-colors cursor-pointer"
                        title="Editar Ciudad"
                      >
                        <Edit3 size={11} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCity(city.id);
                        }}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Eliminar Ciudad"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Micro stats & available services preview */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-divider/40 text-[9px] font-bold text-ink-soft">
                    <span>👥 {city.stats.clientsCount.toLocaleString('es-CO')} Clientes</span>
                    <span>🏍️ {city.stats.alliesCount} Aliados</span>
                    <span className="col-span-2 border-t border-divider/10 pt-1 text-[8px] flex flex-wrap gap-1">
                      {city.services.mototaxi && <span className="bg-primary/10 text-primary px-1 rounded">Moto</span>}
                      {city.services.domicilios && <span className="bg-primary/10 text-primary px-1 rounded">Domi</span>}
                      {city.services.encomiendas && <span className="bg-primary/10 text-primary px-1 rounded">Env</span>}
                      {city.services.compras && <span className="bg-primary/10 text-primary px-1 rounded">Shop</span>}
                      {city.services.mandados && <span className="bg-primary/10 text-primary px-1 rounded">Task</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED MAP SIMULATION & ZONE COVERAGE MANAGEMENT (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {selectedCity ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* ZONES LIST PANEL (5 cols) */}
              <div className="md:col-span-5 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm flex flex-col gap-4 text-left">
                <div className="flex justify-between items-center border-b border-divider/30 pb-2">
                  <div>
                    <h4 className="font-sora font-extrabold text-xs text-ink uppercase">Zonas de Cobertura</h4>
                    <p className="text-[10px] text-ink-soft">Zonas de operación en {selectedCity.name}.</p>
                  </div>

                  <button
                    onClick={() => setIsAddingZone(true)}
                    className="p-1 rounded bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
                    title="Agregar Zona de Cobertura"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* ZONE CREATION FORM INLINE */}
                {isAddingZone && (
                  <form onSubmit={handleAddZone} className="bg-surface-alt p-3 rounded-2xl border border-divider/50 space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[9.5px] font-black uppercase text-ink-soft">Nueva Zona</span>
                      <button type="button" onClick={() => setIsAddingZone(false)} className="text-ink-soft hover:text-ink">
                        <X size={12} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Nombre de la zona / barrio..."
                        value={zoneName}
                        onChange={e => setZoneName(e.target.value)}
                        className="w-full bg-white border border-divider/40 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary font-semibold"
                      />

                      <select
                        value={zoneType}
                        onChange={e => setZoneType(e.target.value as any)}
                        className="w-full bg-white border border-divider/40 rounded-xl px-2 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="barrio">Barrio</option>
                        <option value="sector">Sector</option>
                        <option value="vereda">Vereda</option>
                        <option value="comuna">Comuna</option>
                      </select>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Guardar Zona ✓
                      </button>
                    </div>
                  </form>
                )}

                {/* ZONES LIST */}
                <div className="space-y-2 overflow-y-auto content-scrollbar max-h-[360px] flex-1">
                  {selectedCity.zones.map(zone => {
                    const isActive = zone.status === 'activo';
                    return (
                      <div 
                        key={zone.id}
                        className={`p-3 border rounded-xl flex items-center justify-between gap-3 shadow-2xs transition-colors ${
                          isActive 
                            ? 'border-divider bg-white' 
                            : 'border-dashed border-divider bg-surface-alt/30 opacity-60'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-sora font-extrabold text-xs text-ink block leading-tight">{zone.name}</span>
                          <span className="text-[9px] text-primary font-black uppercase tracking-wider block mt-0.5">{zone.type}</span>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Toggle status */}
                          <button
                            type="button"
                            onClick={() => handleToggleZoneStatus(zone.id)}
                            className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                              isActive 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                            title={isActive ? 'Desactivar Zona' : 'Activar Zona'}
                          >
                            <Power size={11} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteZone(zone.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 cursor-pointer"
                            title="Eliminar Zona permanentemente"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SIMULATED MAP PANEL (7 cols) */}
              <div className="md:col-span-7 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm flex flex-col gap-3 text-left">
                <div>
                  <h4 className="font-sora font-extrabold text-xs text-ink uppercase flex items-center gap-1.5">
                    <Map size={14} className="text-primary animate-pulse" />
                    Zonas en el Mapa - {selectedCity.name}
                  </h4>
                  <p className="text-[10px] text-ink-soft">Simulación de la geocerca y cobertura de Movica en la ciudad seleccionada.</p>
                </div>

                {/* MAP AREA VISUAL */}
                <div className="relative w-full aspect-square bg-[#E8F1EB]/55 rounded-2xl border border-divider/40 overflow-hidden shadow-inner flex items-center justify-center">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border-r border-b border-primary/20"></div>
                    ))}
                  </div>

                  {/* Rivers / Streets Mock vectors */}
                  <div className="absolute w-[180%] h-6 bg-blue-100/60 rotate-12 -translate-x-12 pointer-events-none"></div>
                  <div className="absolute h-[180%] w-4 bg-[#f8f5eb] -rotate-45 translate-x-16 pointer-events-none"></div>
                  <div className="absolute h-[180%] w-3 bg-[#f8f5eb] -rotate-45 translate-x-32 pointer-events-none"></div>

                  {/* Render simulated coverage zones */}
                  {selectedCity.zones.map((zone, idx) => {
                    const isActive = zone.status === 'activo';
                    if (!isActive) return null;

                    return (
                      <div
                        key={zone.id}
                        className="absolute rounded-full border flex items-center justify-center transition-all animate-fade-in cursor-default"
                        style={{
                          left: `${zone.coordinates.x}%`,
                          top: `${zone.coordinates.y}%`,
                          width: `${zone.coordinates.radius * 2.5}%`,
                          height: `${zone.coordinates.radius * 2.5}%`,
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: idx % 3 === 0 ? 'rgba(14, 166, 92, 0.12)' : idx % 3 === 1 ? 'rgba(0, 102, 255, 0.08)' : 'rgba(255, 198, 41, 0.12)',
                          borderColor: idx % 3 === 0 ? 'rgba(14, 166, 92, 0.4)' : idx % 3 === 1 ? 'rgba(0, 102, 255, 0.4)' : 'rgba(255, 198, 41, 0.4)',
                        }}
                      >
                        {/* Zone center pin and label */}
                        <div className="flex flex-col items-center pointer-events-none">
                          <MapPin size={10} className={idx % 3 === 0 ? 'text-[#0EA65C]' : idx % 3 === 1 ? 'text-[#0066FF]' : 'text-[#FFC629]'} />
                          <span className="text-[7.5px] font-black uppercase tracking-tight text-ink bg-white/95 border border-divider/60 px-1 py-0.25 rounded shadow-xs whitespace-nowrap mt-0.5">
                            {zone.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="absolute bottom-3 left-3 bg-white/95 border border-divider/50 px-2.5 py-1.5 rounded-xl text-[8.5px] font-bold text-ink shadow-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-[#0EA65C]/20 border border-[#0EA65C]/50 rounded-full inline-block"></span>
                      Geocerca Activa
                    </span>
                  </div>
                </div>

                {/* DETAILED CITY RATES SHEET SUMMARY CARD */}
                <div className="bg-surface-alt/70 border border-divider/50 p-4 rounded-2xl space-y-2 text-left">
                  <span className="text-[9.5px] font-black uppercase text-ink-soft tracking-wider block">
                    Tarifas Configuradas para {selectedCity.name}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-ink">
                    <div className="p-2 bg-white rounded-xl border border-divider/30 text-left">
                      <span className="text-[8.5px] text-ink-soft block font-bold">Base</span>
                      <span className="text-sm font-black text-primary">${selectedCity.rates.baseFare.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-divider/30 text-left">
                      <span className="text-[8.5px] text-ink-soft block font-bold">x Cuadra</span>
                      <span className="text-sm font-black text-[#0066FF]">${selectedCity.rates.perBlockPrice.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-divider/30 text-left">
                      <span className="text-[8.5px] text-ink-soft block font-bold">Nocturno</span>
                      <span className="text-sm font-black text-amber-500">${selectedCity.rates.nightSurcharge.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-divider/30 text-left">
                      <span className="text-[8.5px] text-ink-soft block font-bold">Lluvia</span>
                      <span className="text-sm font-black text-[#0EA65C]">${selectedCity.rates.rainSurcharge.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white border border-divider/60 rounded-3xl p-10 text-center text-ink-soft">
              No hay ciudades registradas. Haz clic en "Registrar Nueva Ciudad" para comenzar.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
