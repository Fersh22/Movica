import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, ChevronRight, X, Clock, MapPin, CheckCircle, Gift } from 'lucide-react';
import { UserProfile, ServiceType } from '../types';
import NotificationCenter from './NotificationCenter';
import { ClientAdsView } from './AdCampaignManager';

interface HomeViewProps {
  userProfile: UserProfile;
  onSelectService: (type: ServiceType) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function HomeView({ userProfile, onSelectService, onNavigateToTab }: HomeViewProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);

  const notifications = [
    {
      id: 'n1',
      title: '¡Bienvenido a Movica!',
      desc: 'Disfruta de viajes en mototaxi rápidos, envíos seguros y tus comidas favoritas al instante.',
      time: 'Hace 5 min',
      icon: '🎉',
      color: 'bg-primary-surface text-primary'
    },
    {
      id: 'n2',
      title: 'Bono de primer envío 🎁',
      desc: 'Usa el cupón MOVICA50 y obtén 50% de descuento en tu primer mandado o encomienda.',
      time: 'Hace 1 hora',
      icon: '🎁',
      color: 'bg-accent/15 text-amber-600'
    }
  ];

  const handlePulse = (type: ServiceType) => {
    onSelectService(type);
  };

  return (
    <div className="w-full h-full relative">
      <div className="space-y-6">
        {/* Home Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigateToTab('perfil')}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-sora font-extrabold text-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            {userProfile.avatarLetter}
          </button>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-sora font-extrabold text-xl text-ink leading-tight tracking-tight">
              Hola, {userProfile.name.split(' ')[0]} 👋
            </h2>
            <p className="text-xs text-ink-soft mt-0.5 font-medium">¿Qué necesitas hoy?</p>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-11 h-11 rounded-xl bg-surface-alt hover:bg-divider flex items-center justify-center text-ink cursor-pointer active:scale-95 transition-all relative"
            >
              <Bell size={18} className="text-ink-soft" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent border-2 border-white"></div>
            </button>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-4.5 rounded-3xl text-white shadow-lg space-y-2 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Promo Activa</span>
          </div>
          <h3 className="font-sora font-extrabold text-[15px] leading-tight">Envío Gratis en Domicilios</h3>
          <p className="text-[11px] text-white/85 leading-relaxed">Pide comida hoy en Burgers & Co o La Pizzería y el envío te sale gratis.</p>
        </div>

        {/* Publicidad y Destacados (Módulo 31) */}
        <ClientAdsView onSelectAction={(cta) => {
          if (cta.includes('Pizza') || cta.includes('🍔') || cta.includes('Hamburguesas') || cta.includes('Comida')) {
            onSelectService('domicilio');
          } else if (cta.includes('Medicinas') || cta.includes('💊')) {
            onSelectService('compra');
          } else if (cta.includes('Mercar') || cta.includes('🛒')) {
            onSelectService('compra');
          } else if (cta.includes('Mototaxi') || cta.includes('🛵')) {
            onSelectService('mototaxi');
          } else if (cta.includes('Paquete') || cta.includes('📦')) {
            onSelectService('encomienda');
          }
        }} />

        {/* Services List */}
        <div className="space-y-3">
          <h4 className="font-sora font-bold text-sm text-ink-soft uppercase tracking-wider mb-2">Nuestros Servicios</h4>

          {/* 1. Mototaxi */}
          <div 
            onClick={() => handlePulse('mototaxi')}
            className="group flex items-center gap-4 bg-white hover:bg-surface-alt/40 border border-divider/40 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              🛵
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-sora font-bold text-[15px] text-ink">Mototaxi</h3>
              <p className="text-xs text-ink-soft mt-0.5">Viaja rápido y seguro por la ciudad.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft text-sm flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 2. Pedir domicilio */}
          <div 
            onClick={() => handlePulse('domicilio')}
            className="group flex items-center gap-4 bg-white hover:bg-surface-alt/40 border border-divider/40 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              🍔
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-sora font-bold text-[15px] text-ink">Pedir domicilio</h3>
              <p className="text-xs text-ink-soft mt-0.5">Comida o productos de cualquier negocio local.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft text-sm flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 3. Enviar encomienda */}
          <div 
            onClick={() => handlePulse('encomienda')}
            className="group flex items-center gap-4 bg-white hover:bg-surface-alt/40 border border-divider/40 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              📦
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-sora font-bold text-[15px] text-ink">Enviar encomienda</h3>
              <p className="text-xs text-ink-soft mt-0.5">Envía tus paquetes de forma ágil y segura.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft text-sm flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 4. Comprar un producto */}
          <div 
            onClick={() => handlePulse('compra')}
            className="group flex items-center gap-4 bg-white hover:bg-surface-alt/40 border border-divider/40 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-primary-surface text-primary flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              🛒
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-sora font-bold text-[15px] text-ink">Comprar un producto</h3>
              <p className="text-xs text-ink-soft mt-0.5">Compramos lo que necesites y te lo llevamos.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft text-sm flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 5. Mandados personales */}
          <div 
            onClick={() => handlePulse('mandado')}
            className="group flex items-center gap-4 bg-white hover:bg-surface-alt/40 border border-primary/20 bg-amber-500/5 rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-14 h-14 rounded-xl bg-accent text-ink flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              📋
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-sora font-bold text-[15px] text-ink flex items-center gap-1.5">
                Mandados personales 
                <span className="bg-accent/30 text-ink text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">Realiza diligencias, pagos o encargos a medida.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft text-sm flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ChevronRight size={14} />
            </div>
          </div>

          {/* BANNER REGISTRO ALIADOS (Módulo 21) */}
          <div 
            onClick={() => onNavigateToTab('perfil')}
            className="bg-[#0D1A16] border border-primary/10 p-4.5 rounded-3xl text-white shadow-md flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] transition-all duration-200 mt-4 text-left"
          >
            <div className="space-y-1">
              <span className="bg-primary/20 text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-primary/20">
                Socios Conducción
              </span>
              <h4 className="font-sora font-extrabold text-[13px] text-white">¿Tienes moto en Aguachica?</h4>
              <p className="text-[10.5px] text-white/70 font-semibold leading-relaxed">Únete como aliado y genera ingresos adicionales manejando tu propio tiempo.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
              🛵
            </div>
          </div>

          {/* BANNER REGISTRO COMERCIOS (Módulo 22) */}
          <div 
            onClick={() => onNavigateToTab('perfil')}
            className="bg-[#3b2d12] border border-amber-500/10 p-4.5 rounded-3xl text-white shadow-md flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] transition-all duration-200 mt-3 text-left"
          >
            <div className="space-y-1">
              <span className="bg-amber-500/20 text-[#FFC629] text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-amber-500/20">
                Socios Comercio
              </span>
              <h4 className="font-sora font-extrabold text-[13px] text-white">¿Tienes un negocio o restaurante?</h4>
              <p className="text-[10.5px] text-white/70 font-semibold leading-relaxed">Vende por Movica, gestiona tu propio menú y expande tus ventas en Aguachica.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
              🏪
            </div>
          </div>

          {/* MOVICA 1.0 OFFICIAL LAUNCH STAMP (Módulo 35) */}
          <div className="border border-divider/30 bg-surface-alt/40 p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-1 mt-5">
            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              🚀 Movica 1.0 Oficial
            </span>
            <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Lanzamiento Aguachica • Producción Activa</p>
            <p className="text-[9px] text-ink-faint font-semibold">Código optimizado para alto rendimiento y escalabilidad modular.</p>
          </div>

        </div>
      </div>

      {/* NOTIFICATIONS DRAWER OVERLAY */}
      {showNotifications && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col p-6 pt-12 animate-slideUp">
          <NotificationCenter 
            mode="cliente" 
            onClose={() => setShowNotifications(false)} 
          />
        </div>
      )}
    </div>
  );
}
