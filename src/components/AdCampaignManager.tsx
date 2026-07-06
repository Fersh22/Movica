import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Plus, Trash2, Edit, Play, Pause, TrendingUp, Percent, Eye, 
  MousePointerClick, DollarSign, Award, Store, ChevronRight, ChevronLeft, 
  Calendar, Check, X, Megaphone, BarChart3, Settings, HelpCircle, 
  ArrowUpRight, Heart, Star, ShoppingBag, MapPin, Search
} from 'lucide-react';

// Data Interfaces
export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'carousel' | 'banner';
  imageUrl: string; // Emoji or gradient CSS class description
  ctaText: string;
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
  isActive: boolean;
  budget: number;
  costPerClick: number;
}

export interface FeaturedMerchant {
  id: string;
  name: string;
  logo: string; // Emoji
  category: string;
  rating: number;
  activePromo: string;
  isFeatured: boolean;
  views: number;
  clicks: number;
}

// Initial default campaigns if not set in localStorage
const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'CAMP-001',
    title: '🍕 Restaurante de la Semana: La Pizzería Gourmet',
    description: 'Disfruta de las mejores pizzas artesanales a la leña en Aguachica con 20% de descuento usando el cupón GOURMET20.',
    type: 'carousel',
    imageUrl: 'from-orange-500 to-red-600',
    ctaText: 'Pedir Pizza 🍕',
    startDate: '2026-07-01',
    endDate: '2026-07-08',
    views: 1240,
    clicks: 184,
    isActive: true,
    budget: 150000,
    costPerClick: 350
  },
  {
    id: 'CAMP-002',
    title: '💊 Farmacia San Jorge: Tu Salud 24 Horas',
    description: 'Medicamentos, cuidado personal y fórmulas infantiles al instante. Domicilio gratis en toda la red de farmacias de la ciudad.',
    type: 'carousel',
    imageUrl: 'from-teal-400 to-emerald-600',
    ctaText: 'Ver Medicinas 💊',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    views: 940,
    clicks: 112,
    isActive: true,
    budget: 200000,
    costPerClick: 300
  },
  {
    id: 'CAMP-003',
    title: '🛒 Supermercado El Éxito con Envío Gratis',
    description: 'Haz tu mercado mensual sin moverte de casa. Entregas express gratuitas para todas las compras superiores a $30.000 COP.',
    type: 'carousel',
    imageUrl: 'from-yellow-400 to-amber-600',
    ctaText: 'Mercar Ahora 🛒',
    startDate: '2026-07-03',
    endDate: '2026-07-10',
    views: 1850,
    clicks: 310,
    isActive: true,
    budget: 350000,
    costPerClick: 280
  },
  {
    id: 'CAMP-004',
    title: '🎁 Promoción Exclusiva de Fin de Semana',
    description: '¡Lleva 2 Combos de Hamburguesas Especiales de Burgers & Co con papas rústicas y gaseosa por solo $28.000 COP!',
    type: 'carousel',
    imageUrl: 'from-purple-500 to-pink-600',
    ctaText: 'Aprovechar Promo 🎁',
    startDate: '2026-07-03',
    endDate: '2026-07-06',
    views: 820,
    clicks: 145,
    isActive: true,
    budget: 120000,
    costPerClick: 400
  },
  {
    id: 'CAMP-005',
    title: '⚡ ¡Viajes Express en Mototaxi!',
    description: '¿Llegas tarde? Muévete con rapidez y total seguridad en Aguachica. Conductores verificados con seguro de accidentes activo.',
    type: 'banner',
    imageUrl: 'from-slate-800 to-slate-950',
    ctaText: 'Pedir Mototaxi 🛵',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    views: 2400,
    clicks: 420,
    isActive: true,
    budget: 400000,
    costPerClick: 150
  },
  {
    id: 'CAMP-006',
    title: '📦 Envíos Seguros al Instante',
    description: 'Mandados express, pagos de facturas o entrega de documentos en minutos. Tu aliado Movica de confianza lo hace todo.',
    type: 'banner',
    imageUrl: 'from-blue-600 to-indigo-800',
    ctaText: 'Enviar Paquete 📦',
    startDate: '2026-07-02',
    endDate: '2026-07-20',
    views: 1560,
    clicks: 290,
    isActive: true,
    budget: 180000,
    costPerClick: 200
  }
];

const DEFAULT_MERCHANTS: FeaturedMerchant[] = [
  {
    id: 'MERCH-001',
    name: 'El Gran Sabor',
    logo: '🍕',
    category: 'Restaurante',
    rating: 4.8,
    activePromo: '15% de descuento en Almuerzos Ejecutivos',
    isFeatured: true,
    views: 890,
    clicks: 164
  },
  {
    id: 'MERCH-002',
    name: 'Drogas Aguachica',
    logo: '💊',
    category: 'Farmacia',
    rating: 4.9,
    activePromo: 'Domicilio gratis en medicamentos pediátricos',
    isFeatured: true,
    views: 740,
    clicks: 98
  },
  {
    id: 'MERCH-003',
    name: 'Supermercado Merkamas',
    logo: '🛒',
    category: 'Supermercado',
    rating: 4.7,
    activePromo: 'Paga con tarjeta y recibe 10% de devolución',
    isFeatured: true,
    views: 1100,
    clicks: 210
  },
  {
    id: 'MERCH-004',
    name: 'Heladería Cremas',
    logo: '🍦',
    category: 'Postres',
    rating: 4.6,
    activePromo: '2x1 en Conos Dobles todos los Jueves',
    isFeatured: true,
    views: 520,
    clicks: 82
  },
  {
    id: 'MERCH-005',
    name: 'Asados El Corral',
    logo: '🥩',
    category: 'Restaurante',
    rating: 4.5,
    activePromo: 'Porción de papas gratis por compras > $25.000',
    isFeatured: false,
    views: 310,
    clicks: 22
  },
  {
    id: 'MERCH-006',
    name: 'PetShop Huellitas',
    logo: '🐶',
    category: 'Mascotas',
    rating: 4.8,
    activePromo: 'Obtén cepillo de dientes canino gratis en tu compra',
    isFeatured: false,
    views: 240,
    clicks: 19
  }
];

// Helper to initialize database
export function initializeMarketingDB() {
  if (!localStorage.getItem('movica_campaigns')) {
    localStorage.setItem('movica_campaigns', JSON.stringify(DEFAULT_CAMPAIGNS));
  }
  if (!localStorage.getItem('movica_featured_merchants')) {
    localStorage.setItem('movica_featured_merchants', JSON.stringify(DEFAULT_MERCHANTS));
  }
}

// Global hooks/helpers to read/write state easily
export function getStoredCampaigns(): Campaign[] {
  initializeMarketingDB();
  const raw = localStorage.getItem('movica_campaigns');
  return raw ? JSON.parse(raw) : DEFAULT_CAMPAIGNS;
}

export function saveStoredCampaigns(campaigns: Campaign[]) {
  localStorage.setItem('movica_campaigns', JSON.stringify(campaigns));
}

export function getStoredMerchants(): FeaturedMerchant[] {
  initializeMarketingDB();
  const raw = localStorage.getItem('movica_featured_merchants');
  return raw ? JSON.parse(raw) : DEFAULT_MERCHANTS;
}

export function saveStoredMerchants(merchants: FeaturedMerchant[]) {
  localStorage.setItem('movica_featured_merchants', JSON.stringify(merchants));
}

// CLIENT-SIDE ADVERTISING VIEW
interface ClientAdsViewProps {
  onSelectAction?: (cta: string) => void;
}

export function ClientAdsView({ onSelectAction }: ClientAdsViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [merchants, setMerchants] = useState<FeaturedMerchant[]>([]);
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState(0);

  useEffect(() => {
    // Load initial or stored values
    const load = () => {
      setCampaigns(getStoredCampaigns().filter(c => c.isActive));
      setMerchants(getStoredMerchants());
    };
    load();
    // Periodically sync with admin changes
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const carouselCampaigns = campaigns.filter(c => c.type === 'carousel');
  const bannerCampaigns = campaigns.filter(c => c.type === 'banner');
  const featuredMerchants = merchants.filter(m => m.isFeatured);

  const handleCarouselNext = () => {
    if (carouselCampaigns.length === 0) return;
    setCurrentCarouselIdx(prev => (prev + 1) % carouselCampaigns.length);
  };

  const handleCarouselPrev = () => {
    if (carouselCampaigns.length === 0) return;
    setCurrentCarouselIdx(prev => (prev - 1 + carouselCampaigns.length) % carouselCampaigns.length);
  };

  // Simulates a view increment on mount for displayed campaigns/merchants
  useEffect(() => {
    if (campaigns.length === 0 && merchants.length === 0) return;
    
    const incrementViews = () => {
      const allCampaigns = getStoredCampaigns();
      const allMerchants = getStoredMerchants();

      // Increment currently visible carousel item
      const visibleCarousel = carouselCampaigns[currentCarouselIdx];
      let updated = false;

      if (visibleCarousel) {
        allCampaigns.forEach(c => {
          if (c.id === visibleCarousel.id) {
            c.views += 1;
            updated = true;
          }
        });
      }

      // Increment displayed banners
      bannerCampaigns.forEach(b => {
        allCampaigns.forEach(c => {
          if (c.id === b.id) {
            c.views += 1;
            updated = true;
          }
        });
      });

      // Increment visible featured merchants
      featuredMerchants.forEach(fm => {
        allMerchants.forEach(m => {
          if (m.id === fm.id) {
            m.views += 1;
            updated = true;
          }
        });
      });

      if (updated) {
        saveStoredCampaigns(allCampaigns);
        saveStoredMerchants(allMerchants);
      }
    };

    // Delay a bit to avoid double renders
    const timeout = setTimeout(incrementViews, 1000);
    return () => clearTimeout(timeout);
  }, [currentCarouselIdx, campaigns.length]);

  const handleCampaignClick = (camp: Campaign) => {
    // Record click
    const allCampaigns = getStoredCampaigns();
    allCampaigns.forEach(c => {
      if (c.id === camp.id) {
        c.clicks += 1;
      }
    });
    saveStoredCampaigns(allCampaigns);

    if (onSelectAction) {
      onSelectAction(camp.ctaText);
    } else {
      alert(`Simulación de Redirección: Navegando hacia la campaña "${camp.title}"`);
    }
  };

  const handleMerchantClick = (merch: FeaturedMerchant) => {
    // Record click
    const allMerchants = getStoredMerchants();
    allMerchants.forEach(m => {
      if (m.id === merch.id) {
        m.clicks += 1;
      }
    });
    saveStoredMerchants(allMerchants);

    alert(`Simulación de Comercio: Abriendo tienda de "${merch.name}" (${merch.category}) - Promoción activa: ${merch.activePromo}`);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CAROUSEL OF FEATURED PROMOTIONS */}
      {carouselCampaigns.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-sora font-extrabold text-[13px] text-ink flex items-center gap-1.5">
              <Sparkles size={14} className="text-accent animate-spin" style={{ animationDuration: '4s' }} />
              Promociones Destacadas Movica
            </h4>
            <div className="flex gap-1">
              <button 
                onClick={handleCarouselPrev}
                className="w-6 h-6 rounded-full bg-surface-alt hover:bg-divider flex items-center justify-center text-ink cursor-pointer transition-colors"
              >
                <ChevronLeft size={12} />
              </button>
              <button 
                onClick={handleCarouselNext}
                className="w-6 h-6 rounded-full bg-surface-alt hover:bg-divider flex items-center justify-center text-ink cursor-pointer transition-colors"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-md min-h-[140px]">
            <AnimatePresence mode="wait">
              {carouselCampaigns.map((camp, idx) => {
                if (idx !== currentCarouselIdx) return null;
                return (
                  <motion.div
                    key={camp.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`bg-gradient-to-r ${camp.imageUrl} text-white p-5 flex flex-col justify-between min-h-[140px] text-left relative overflow-hidden`}
                  >
                    {/* Background decorations */}
                    <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-6 -top-6 w-20 h-20 bg-black/10 rounded-full blur-xl"></div>

                    <div className="space-y-1.5 z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/20 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-white/10">
                          Aliado Destacado
                        </span>
                        <span className="bg-accent text-ink text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md">
                          Promo %
                        </span>
                      </div>
                      <h3 className="font-sora font-extrabold text-[14px] leading-tight text-white">{camp.title}</h3>
                      <p className="text-[10.5px] text-white/90 leading-relaxed font-semibold max-w-[90%]">{camp.description}</p>
                    </div>

                    <div className="pt-3 flex justify-between items-center z-10 border-t border-white/10 mt-2">
                      <span className="text-[8px] text-white/70 font-bold">Patrocinado • Movica Ads</span>
                      <button 
                        onClick={() => handleCampaignClick(camp)}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-sora font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        {camp.ctaText} <ArrowUpRight size={10} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Dots */}
            <div className="absolute bottom-2 left-5 flex gap-1 z-20">
              {carouselCampaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentCarouselIdx(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentCarouselIdx ? 'bg-white w-3' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. COMERCIOS DESTACADOS */}
      {featuredMerchants.length > 0 && (
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <h4 className="font-sora font-extrabold text-[13px] text-ink flex items-center gap-1.5">
              <Store size={14} className="text-primary" />
              Comercios Destacados en Aguachica
            </h4>
            <span className="text-[9px] bg-primary-surface text-primary font-black px-2 py-0.5 rounded-full uppercase">
              Premium
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredMerchants.map(merch => (
              <div 
                key={merch.id}
                className="bg-white border border-divider/40 rounded-2xl p-3.5 flex gap-3.5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left"
              >
                {/* Logo Area */}
                <div className="w-11 h-11 rounded-xl bg-surface-alt flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-divider/10">
                  {merch.logo}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] text-ink-soft uppercase tracking-wider font-extrabold">{merch.category}</span>
                      <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-0.5">
                        ★ {merch.rating}
                      </span>
                    </div>
                    <h5 className="font-sora font-extrabold text-xs text-ink truncate mt-0.5">{merch.name}</h5>
                    
                    {/* Active Promo Tag */}
                    <div className="mt-1.5 flex items-start gap-1">
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 font-black px-1.5 py-0.5 rounded-md leading-none text-center">
                        %
                      </span>
                      <p className="text-[9.5px] font-semibold text-ink-soft leading-tight line-clamp-1">
                        {merch.activePromo}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-divider/30 mt-2.5 flex justify-end">
                    <button 
                      onClick={() => handleMerchantClick(merch)}
                      className="text-[10.5px] text-primary hover:text-primary-dark font-black tracking-tight cursor-pointer flex items-center gap-0.5 hover:underline"
                    >
                      Ver comercio <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AD BANNERS */}
      {bannerCampaigns.length > 0 && (
        <div className="space-y-3 text-left">
          <h4 className="font-sora font-extrabold text-[13px] text-ink flex items-center gap-1.5">
            <Megaphone size={13} className="text-ink-soft" />
            Oportunidades y Servicios Recomendados
          </h4>

          <div className="space-y-3">
            {bannerCampaigns.map(camp => (
              <div 
                key={camp.id}
                onClick={() => handleCampaignClick(camp)}
                className={`bg-gradient-to-br ${camp.imageUrl} text-white p-4.5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-all shadow-sm text-left`}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="bg-white/15 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-white/10">
                    Recomendado Movica
                  </span>
                  <h4 className="font-sora font-extrabold text-[12.5px] leading-tight text-white mt-1">{camp.title}</h4>
                  <p className="text-[10px] text-white/80 font-semibold leading-relaxed line-clamp-2">{camp.description}</p>
                </div>
                
                <button 
                  className="bg-white text-slate-900 font-sora font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-md flex-shrink-0"
                >
                  {camp.ctaText.split(' ')[0] || 'Ver'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ADMIN-SIDE CAMPAIGN & ADVERTISING DASHBOARD
export function AdminAdsDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [merchants, setMerchants] = useState<FeaturedMerchant[]>([]);
  
  // Tab within Ads Panel
  const [activeSubTab, setActiveSubTab] = useState<'campanas' | 'comercios' | 'estadisticas'>('campanas');
  
  // Forms & Modals
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<'carousel' | 'banner'>('carousel');
  const [formImageUrl, setFormImageUrl] = useState('from-indigo-500 to-purple-600');
  const [formCtaText, setFormCtaText] = useState('Ver Detalles ⚡');
  const [formBudget, setFormBudget] = useState('150000');
  const [formCpc, setFormCpc] = useState('300');
  const [formStartDate, setFormStartDate] = useState('2026-07-04');
  const [formEndDate, setFormEndDate] = useState('2026-07-11');

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
    setMerchants(getStoredMerchants());
  }, []);

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...campaigns];
    
    if (editingCampaign) {
      // Edit
      const idx = updated.findIndex(c => c.id === editingCampaign.id);
      if (idx !== -1) {
        updated[idx] = {
          ...editingCampaign,
          title: formTitle,
          description: formDesc,
          type: formType,
          imageUrl: formImageUrl,
          ctaText: formCtaText,
          budget: parseInt(formBudget) || 100000,
          costPerClick: parseInt(formCpc) || 300,
          startDate: formStartDate,
          endDate: formEndDate
        };
      }
      setEditingCampaign(null);
    } else {
      // Add
      const newCamp: Campaign = {
        id: `CAMP-0${campaigns.length + 10}`,
        title: formTitle,
        description: formDesc,
        type: formType,
        imageUrl: formImageUrl,
        ctaText: formCtaText,
        startDate: formStartDate,
        endDate: formEndDate,
        views: 0,
        clicks: 0,
        isActive: true,
        budget: parseInt(formBudget) || 100000,
        costPerClick: parseInt(formCpc) || 300
      };
      updated.unshift(newCamp);
    }

    setCampaigns(updated);
    saveStoredCampaigns(updated);
    setIsAddCampaignOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormType('carousel');
    setFormImageUrl('from-indigo-500 to-purple-600');
    setFormCtaText('Ver Detalles ⚡');
    setFormBudget('150000');
    setFormCpc('300');
    setFormStartDate('2026-07-04');
    setFormEndDate('2026-07-11');
  };

  const handleEditClick = (camp: Campaign) => {
    setEditingCampaign(camp);
    setFormTitle(camp.title);
    setFormDesc(camp.description);
    setFormType(camp.type);
    setFormImageUrl(camp.imageUrl);
    setFormCtaText(camp.ctaText);
    setFormBudget(camp.budget.toString());
    setFormCpc(camp.costPerClick.toString());
    setFormStartDate(camp.startDate);
    setFormEndDate(camp.endDate);
    setIsAddCampaignOpen(true);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta campaña publicitaria?')) {
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
      saveStoredCampaigns(updated);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        return { ...c, isActive: !c.isActive };
      }
      return c;
    });
    setCampaigns(updated);
    saveStoredCampaigns(updated);
  };

  const handleToggleMerchantFeatured = (id: string) => {
    const updated = merchants.map(m => {
      if (m.id === id) {
        return { ...m, isFeatured: !m.isFeatured };
      }
      return m;
    });
    setMerchants(updated);
    saveStoredMerchants(updated);
  };

  // Stats calculation
  const totalViews = campaigns.reduce((acc, c) => acc + c.views, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  
  // Earnings formula: simulated CPC revenue + featured merchant listings fees
  const cpcRevenue = campaigns.reduce((acc, c) => acc + (c.clicks * c.costPerClick), 0);
  const listingRevenue = merchants.filter(m => m.isFeatured).length * 45000; // Fixed flat subscription per week
  const totalAdvertisingRevenue = cpcRevenue + listingRevenue;

  const activePromotionsCount = campaigns.filter(c => c.isActive).length + merchants.filter(m => m.isFeatured).length;

  const mostViewedMerchant = [...merchants].sort((a, b) => b.views - a.views)[0] || merchants[0];
  const mostClickedCampaign = [...campaigns].sort((a, b) => b.clicks - a.clicks)[0] || campaigns[0];

  return (
    <div className="space-y-5 text-left">
      
      {/* Header Info */}
      <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-sora font-extrabold text-base text-ink">Consola de Publicidad & Comercios Destacados</h3>
            <p className="text-xs text-ink-soft mt-0.5">Controla las promociones en carrusel, administra banners comerciales y audita ingresos de patrocinio.</p>
          </div>
          <button 
            onClick={() => {
              resetForm();
              setEditingCampaign(null);
              setIsAddCampaignOpen(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white font-sora font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Plus size={14} /> Crear Campaña
          </button>
        </div>

        {/* SUB-TABS SELECTOR */}
        <div className="flex gap-2 border-t border-divider/30 pt-4 mt-4">
          <button
            onClick={() => setActiveSubTab('campanas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'campanas'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Megaphone size={14} /> Campañas Activas ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveSubTab('comercios')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'comercios'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Store size={14} /> Destacar Comercios ({merchants.filter(m => m.isFeatured).length})
          </button>
          <button
            onClick={() => setActiveSubTab('estadisticas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'estadisticas'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <BarChart3 size={14} /> Estadísticas & Monetización
          </button>
        </div>
      </div>

      {/* STATS SUMMARY BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6F7EC] text-[#0EA65C] flex items-center justify-center text-lg shadow-sm">
            💵
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Ingresos Ads</span>
            <span className="font-sora font-extrabold text-[15px] text-[#0EA65C]">
              ${totalAdvertisingRevenue.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center text-lg shadow-sm">
            👁️
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Visualizaciones</span>
            <span className="font-sora font-extrabold text-[15px] text-ink">
              {totalViews.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF9E6] text-amber-600 flex items-center justify-center text-lg shadow-sm">
            ⚡
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Clics Simula</span>
            <span className="font-sora font-extrabold text-[15px] text-ink">
              {totalClicks.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg shadow-sm">
            🔥
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Promos Activas</span>
            <span className="font-sora font-extrabold text-[15px] text-purple-600">
              {activePromotionsCount}
            </span>
          </div>
        </div>

      </div>

      {/* SUB-TAB CONTENTS */}
      <AnimatePresence mode="wait">
        
        {/* SUB-TAB 1: CAMPAIGN LIST & OPERATIONS */}
        {activeSubTab === 'campanas' && (
          <motion.div 
            key="campanas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-divider/40">
              <h4 className="font-sora font-extrabold text-sm text-ink">Historial de Campañas</h4>
              <span className="text-[10px] text-ink-soft font-semibold">Toca el switch para pausar la pauta en tiempo real.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                    <th className="py-3 px-2">Campaña / Formato</th>
                    <th className="py-3 px-2">Fechas (Inicio/Fin)</th>
                    <th className="py-3 px-2">Métricas</th>
                    <th className="py-3 px-2">Presupuesto / CPC</th>
                    <th className="py-3 px-2 text-center">Estado</th>
                    <th className="py-3 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                  {campaigns.map(camp => (
                    <tr key={camp.id} className="hover:bg-surface-alt/20 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-7 rounded bg-gradient-to-r ${camp.imageUrl} flex items-center justify-center text-[10px] text-white font-bold`}>
                            {camp.type === 'carousel' ? '🎠' : '📱'}
                          </div>
                          <div>
                            <span className="font-bold text-ink block max-w-[200px] truncate">{camp.title}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase font-black tracking-wider mt-0.5 inline-block">
                              {camp.type === 'carousel' ? 'Carrusel Inicio' : 'Banner Estático'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-ink-soft font-mono">
                        <div className="text-[10.5px]">
                          <div>Inicia: {camp.startDate}</div>
                          <div className="text-red-500 font-bold">Vence: {camp.endDate}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-ink-soft font-bold">Vistas:</span>
                            <span className="text-ink font-black">{camp.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-ink-soft font-bold">Clics:</span>
                            <span className="text-primary font-black">{camp.clicks}</span>
                          </div>
                          <div className="text-[10px] font-bold text-amber-600">
                            CTR: {camp.views > 0 ? ((camp.clicks / camp.views) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-ink">
                        <div className="text-[10.5px]">
                          <div className="font-bold">Presupuesto: <span className="font-black text-slate-900">${camp.budget.toLocaleString('es-CO')}</span></div>
                          <div className="text-ink-soft">Costo x Clic: <span className="font-bold text-emerald-600">${camp.costPerClick} COP</span></div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => handleToggleActive(camp.id)}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                            camp.isActive 
                              ? 'bg-[#E6F7EC] text-[#0EA65C] hover:bg-emerald-100' 
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          }`}
                        >
                          {camp.isActive ? '🟢 Activo' : '🔴 Pausado'}
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(camp)}
                            className="p-1.5 rounded-lg bg-surface-alt hover:bg-divider text-ink-soft hover:text-ink cursor-pointer transition-colors"
                            title="Editar Campaña"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(camp.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                            title="Eliminar Campaña"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 2: FEATURED MERCHANTS LIST */}
        {activeSubTab === 'comercios' && (
          <motion.div 
            key="comercios"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-divider/40">
              <h4 className="font-sora font-extrabold text-sm text-ink">Administrar Comercios Destacados</h4>
              <span className="text-[10px] text-[#0EA65C] font-extrabold">Tarifa Plana de Destacado: $45.000 COP / Semanal</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {merchants.map(merch => (
                <div 
                  key={merch.id}
                  className={`border rounded-2xl p-4 flex justify-between items-start gap-3 transition-all ${
                    merch.isFeatured 
                      ? 'border-amber-400 bg-amber-50/10 shadow-xs' 
                      : 'border-divider/50 bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-alt flex items-center justify-center text-2xl shadow-xs">
                      {merch.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-sora font-extrabold text-xs text-ink">{merch.name}</h5>
                        <span className="text-[9px] text-amber-500 font-bold">★ {merch.rating}</span>
                      </div>
                      <p className="text-[10px] text-ink-soft uppercase font-bold mt-0.5">{merch.category}</p>
                      
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[9.5px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded leading-none">Promo</span>
                        <span className="text-[9.5px] text-ink-soft font-semibold line-clamp-1">{merch.activePromo}</span>
                      </div>

                      <div className="flex gap-3 text-[9px] text-ink-faint mt-2 border-t border-divider/20 pt-1.5 font-bold">
                        <span>👁️ Visitas: {merch.views}</span>
                        <span>🖱️ Clics: {merch.clicks}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleMerchantFeatured(merch.id)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                      merch.isFeatured 
                        ? 'bg-amber-400 text-white hover:bg-amber-500 shadow-sm' 
                        : 'bg-surface-alt text-ink-soft hover:bg-divider/60'
                    }`}
                  >
                    {merch.isFeatured ? '⭐ Destacado' : '☆ Destacar'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 3: COMPREHENSIVE REVENUE & ANALYTICS STATS */}
        {activeSubTab === 'estadisticas' && (
          <motion.div 
            key="estadisticas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Top Stat Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Monedas y Facturacion */}
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#0EA65C]" />
                  Auditoría de Monetización de Publicidad
                </h4>

                <div className="space-y-3 font-semibold text-xs text-ink-soft">
                  <div className="flex justify-between items-center">
                    <span>Ingresos por CPC (Pago por Clic en Carrusel/Banners):</span>
                    <span className="text-ink font-extrabold">${cpcRevenue.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Suscripciones Mensuales de Comercios Destacados:</span>
                    <span className="text-ink font-extrabold">${listingRevenue.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="border-t border-divider/40 pt-2.5 flex justify-between items-center text-sm font-bold text-ink">
                    <span className="text-primary font-black">Total Ingresos de Publicidad:</span>
                    <span className="text-[#0EA65C] font-black text-base">${totalAdvertisingRevenue.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>

                <div className="bg-[#E6F7EC] text-[#0EA65C] text-[10px] p-3 rounded-2xl flex gap-2 font-semibold">
                  <span>✓</span>
                  <p className="leading-snug">
                    Los ingresos por publicidad se debitan del monedero corporativo de cada comercio o aliado al finalizar cada ciclo semanal.
                  </p>
                </div>
              </div>

              {/* Box 2: Desempeño Destacados */}
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2 flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  Rendimiento Máximo del Portafolio
                </h4>

                <div className="space-y-3 text-xs">
                  {mostClickedCampaign && (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-ink-soft block font-bold">CAMPAÑA MÁS EFECTIVA (CLICS)</span>
                        <span className="font-extrabold text-ink">{mostClickedCampaign.title}</span>
                      </div>
                      <span className="bg-primary-surface text-primary px-2.5 py-1 rounded-lg font-black text-[10px] whitespace-nowrap">
                        {mostClickedCampaign.clicks} Clics
                      </span>
                    </div>
                  )}

                  {mostViewedMerchant && (
                    <div className="flex justify-between items-center pt-2.5 border-t border-divider/20">
                      <div>
                        <span className="text-[10px] text-ink-soft block font-bold">COMERCIO MÁS DESTACADO (VISTAS)</span>
                        <span className="font-extrabold text-ink">{mostViewedMerchant.logo} {mostViewedMerchant.name}</span>
                      </div>
                      <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-black text-[10px] whitespace-nowrap">
                        {mostViewedMerchant.views} Impresiones
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Simulación del CTR y Conversiones */}
            <div className="bg-[#0d1a16] text-white rounded-3xl p-5 shadow-sm space-y-3.5 text-left relative overflow-hidden">
              <div className="absolute right-4 top-4 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Simulador Movica Ads
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-primary uppercase tracking-wider">Embudo de Conversión de Aguachica</h4>
                <p className="text-[10px] text-white/70 leading-normal mt-0.5 font-semibold">Tasa de conversión real y retorno de inversión de los aliados.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-white/60 text-[9px] block uppercase font-bold">Impresiones</span>
                  <span className="font-sora font-extrabold text-sm block text-white mt-0.5">{totalViews}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-white/60 text-[9px] block uppercase font-bold">Clics Totales</span>
                  <span className="font-sora font-extrabold text-sm block text-primary mt-0.5">{totalClicks}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-white/60 text-[9px] block uppercase font-bold">CTR Global</span>
                  <span className="font-sora font-extrabold text-sm block text-[#FFC629] mt-0.5">
                    {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '12.5'}%
                  </span>
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* CREATE / EDIT CAMPAIGN DIALOG MODAL */}
      <AnimatePresence>
        {isAddCampaignOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddCampaignOpen(false)}
              className="absolute inset-0 bg-slate-950"
            />
            
            <motion.div 
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-lg z-10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-wider">Patrocinios de Movica</span>
                  <h4 className="font-sora font-extrabold text-base text-ink">
                    {editingCampaign ? 'Editar Campaña Publicitaria' : 'Nueva Campaña Publicitaria'}
                  </h4>
                  <p className="text-[10px] text-ink-soft mt-0.5">Define los títulos, formato, presupuesto y botón de acción para la plataforma cliente.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCampaignOpen(false)}
                  className="p-1 rounded-xl hover:bg-surface-alt text-ink-soft hover:text-ink cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCampaign} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Title */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Título de la Campaña / Promoción</label>
                    <input 
                      type="text" 
                      required
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="Ej. 🍕 La Pizzería Gourmet - Restaurante de la Semana"
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Descripción o Detalles de la Oferta</label>
                    <textarea 
                      required
                      rows={2}
                      value={formDesc}
                      onChange={e => setFormDesc(e.target.value)}
                      placeholder="Detalla las condiciones o el beneficio exclusivo de la pauta publicitaria..."
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold leading-relaxed"
                    />
                  </div>

                  {/* Format */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Formato Publicitario</label>
                    <select
                      value={formType}
                      onChange={e => setFormType(e.target.value as any)}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    >
                      <option value="carousel">Carrusel de Promociones (Inicio)</option>
                      <option value="banner">Banner Estático Recomendado</option>
                    </select>
                  </div>

                  {/* Gradient Style */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Fondo Gradiente (CSS)</label>
                    <select
                      value={formImageUrl}
                      onChange={e => setFormImageUrl(e.target.value)}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    >
                      <option value="from-orange-500 to-red-600">Naranja Flama 🍕</option>
                      <option value="from-teal-400 to-emerald-600">Verde Farmacia 💊</option>
                      <option value="from-yellow-400 to-amber-600">Amarillo Super 🛒</option>
                      <option value="from-purple-500 to-pink-600">Rosa Fucsia 🎁</option>
                      <option value="from-indigo-500 to-purple-600">Violeta Eléctrico ⚡</option>
                      <option value="from-blue-600 to-indigo-800">Azul Encomiendas 📦</option>
                      <option value="from-slate-800 to-slate-950">Gris Conductor 🛵</option>
                    </select>
                  </div>

                  {/* CTA Text */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Texto del Botón (CTA)</label>
                    <input 
                      type="text" 
                      required
                      value={formCtaText}
                      onChange={e => setFormCtaText(e.target.value)}
                      placeholder="Ej. Pedir Pizza 🍕"
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Presupuesto Semanal ($ COP)</label>
                    <input 
                      type="number" 
                      required
                      value={formBudget}
                      onChange={e => setFormBudget(e.target.value)}
                      placeholder="150000"
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* CPC */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Cobro por Clic (CPC)</label>
                    <input 
                      type="number" 
                      required
                      value={formCpc}
                      onChange={e => setFormCpc(e.target.value)}
                      placeholder="300"
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  {/* Fechas */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      required
                      value={formStartDate}
                      onChange={e => setFormStartDate(e.target.value)}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Fecha de Finalización</label>
                    <input 
                      type="date" 
                      required
                      value={formEndDate}
                      onChange={e => setFormEndDate(e.target.value)}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                </div>

                <div className="flex gap-2 pt-3 text-xs font-bold">
                  <button 
                    type="button" 
                    onClick={() => setIsAddCampaignOpen(false)}
                    className="flex-1 bg-surface-alt text-ink-soft py-3 rounded-xl cursor-pointer hover:bg-divider transition-all text-center"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl cursor-pointer hover:bg-primary-dark transition-all shadow-md shadow-primary/10 text-center"
                  >
                    {editingCampaign ? 'Guardar Cambios' : 'Lanzar Campaña'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
