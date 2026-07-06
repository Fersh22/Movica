import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Star, Gift, Shield, Check, Flame, TrendingUp, Plus, Edit2, 
  Trash2, ToggleLeft, ToggleRight, Search, Medal, User, Bike, ChevronRight, Sparkles, Clock, MapPin, Coffee
} from 'lucide-react';

// Achievement Type Definition
export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'cliente' | 'aliado' | 'general';
  icon: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  isActive: boolean;
  rewardType: 'bono' | 'cupon' | 'descuento' | 'reconocimiento';
  rewardValue: string;
}

// Initial achievements list
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Primer servicio realizado',
    description: 'Completa tu primer trayecto solicitado en la aplicación.',
    points: 100,
    category: 'cliente',
    icon: '🥇',
    targetCount: 1,
    currentCount: 1,
    completed: true,
    isActive: true,
    rewardType: 'cupon',
    rewardValue: 'Cupón $2.000 COP'
  },
  {
    id: 'ach-2',
    title: '50 servicios completados',
    description: 'Completa un total de 50 servicios en la plataforma.',
    points: 500,
    category: 'general',
    icon: '🚀',
    targetCount: 50,
    currentCount: 35,
    completed: false,
    isActive: true,
    rewardType: 'descuento',
    rewardValue: '15% de Descuento Especial'
  },
  {
    id: 'ach-3',
    title: '100 servicios completados',
    description: 'Alcanza el hito supremo de 100 servicios finalizados con éxito.',
    points: 1200,
    category: 'general',
    icon: '💯',
    targetCount: 100,
    currentCount: 35,
    completed: false,
    isActive: true,
    rewardType: 'bono',
    rewardValue: 'Bono $20.000 COP'
  },
  {
    id: 'ach-4',
    title: 'Mantener 5 estrellas',
    description: 'Logra mantener tu promedio perfecto de 5 estrellas en tus últimos 10 viajes.',
    points: 300,
    category: 'aliado',
    icon: '⭐',
    targetCount: 10,
    currentCount: 10,
    completed: true,
    isActive: true,
    rewardType: 'reconocimiento',
    rewardValue: 'Insignia "Aliado Élite"'
  },
  {
    id: 'ach-5',
    title: 'Completar 30 servicios en una semana',
    description: 'Supera la meta semanal completando 30 traslados en 7 días.',
    points: 400,
    category: 'aliado',
    icon: '🎯',
    targetCount: 30,
    currentCount: 24,
    completed: false,
    isActive: true,
    rewardType: 'bono',
    rewardValue: 'Bono semanal +$15.000 COP'
  },
  {
    id: 'ach-6',
    title: 'Ganar una meta semanal',
    description: 'Completa la meta propuesta para el fin de semana en Aguachica.',
    points: 250,
    category: 'aliado',
    icon: '💰',
    targetCount: 1,
    currentCount: 1,
    completed: true,
    isActive: true,
    rewardType: 'bono',
    rewardValue: 'Insignia "Top del Mes"'
  },
  {
    id: 'ach-7',
    title: 'Viajero Frecuente de Aguachica',
    description: 'Solicita 5 mototaxis durante el mismo mes calendario.',
    points: 200,
    category: 'cliente',
    icon: '🛵',
    targetCount: 5,
    currentCount: 5,
    completed: true,
    isActive: true,
    rewardType: 'cupon',
    rewardValue: 'Cupón $3.000 COP'
  },
  {
    id: 'ach-8',
    title: 'Soporte Impecable',
    description: 'Califica el servicio de soporte y ayuda de Movica con 5 estrellas.',
    points: 50,
    category: 'cliente',
    icon: '❤️',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    isActive: true,
    rewardType: 'descuento',
    rewardValue: '10% de descuento envío'
  }
];

// Badges list for Driver/Allies
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  textColor: string;
  unlockedAt: string;
}

const ALLY_BADGES: Badge[] = [
  { id: 'b-1', name: 'Aliado Confiable', description: 'Por mantener una tasa de aceptación de viajes superior al 95%', icon: '🛵', color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-700', unlockedAt: '12 Jun, 2026' },
  { id: 'b-2', name: 'Entrega Rápida', description: 'Por completar servicios de mensajería y domicilios en tiempo récord', icon: '⚡', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700', unlockedAt: '24 Jun, 2026' },
  { id: 'b-3', name: 'Favorito de los Clientes', description: 'Por recibir más de 20 calificaciones perfectas de 5 estrellas', icon: '❤️', color: 'bg-rose-50 border-rose-200', textColor: 'text-rose-700', unlockedAt: '01 Jul, 2026' },
  { id: 'b-4', name: 'Aliado Élite', description: 'Reservado para los conductores del top 5% mensual en Aguachica', icon: '🏆', color: 'bg-indigo-50 border-indigo-200', textColor: 'text-indigo-700', unlockedAt: '03 Jul, 2026' },
  { id: 'b-5', name: 'Top del Mes', description: 'Socio conductor número #1 en ingresos y kilómetros recorridos', icon: '👑', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700', unlockedAt: 'Aún bloqueado' },
];

// Redeemable rewards list for Clients
export interface Reward {
  id: string;
  title: string;
  cost: number;
  description: string;
  type: 'bono' | 'cupon' | 'descuento' | 'reconocimiento';
  icon: string;
  redeemed: boolean;
}

const CLIENT_REWARDS: Reward[] = [
  { id: 'r-1', title: 'Cupón de Descuento $2.500 COP', cost: 150, description: 'Válido para cualquier trayecto de mototaxi en Aguachica.', type: 'cupon', icon: '🎟️', redeemed: false },
  { id: 'r-2', title: 'Cupón de Descuento $5.000 COP', cost: 280, description: 'Válido para pedidos superiores a $12.000 en Comercios.', type: 'cupon', icon: '🎫', redeemed: false },
  { id: 'r-3', title: 'Envío Gratis de Domicilio', cost: 180, description: 'Excluye recargos por lluvia y tarifa de horario nocturno.', type: 'descuento', icon: '🍔', redeemed: false },
  { id: 'r-4', title: '15% de Descuento en Domicilios', cost: 200, description: 'Válido en restaurantes y farmacias de Comercios Aliados.', type: 'descuento', icon: '🍕', redeemed: false },
  { id: 'r-5', title: 'Diploma Virtual de Cliente Estrella', cost: 50, description: 'Reconocimiento digital oficial emitido por la gerencia.', type: 'reconocimiento', icon: '📜', redeemed: true },
];

interface AchievementsSystemProps {
  mode: 'cliente' | 'aliado' | 'admin';
  userProfile?: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function AchievementsSystem({ mode, userProfile }: AchievementsSystemProps) {
  // Load and save achievements via localStorage
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('movica_achievements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_ACHIEVEMENTS; }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('movica_rewards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return CLIENT_REWARDS; }
    }
    return CLIENT_REWARDS;
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('movica_client_points');
    return saved ? parseInt(saved) || 450 : 450;
  });

  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('movica_client_level');
    return saved ? parseInt(saved) || 3 : 3; // 1 to 5 levels
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('movica_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('movica_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('movica_client_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('movica_client_level', level.toString());
  }, [level]);

  // Admin Section States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminTab, setAdminTab] = useState<'logros' | 'ranking_aliados' | 'ranking_clientes'>('logros');

  // Form Fields for Creating/Editing Achievements
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPoints, setFormPoints] = useState(100);
  const [formCategory, setFormCategory] = useState<'cliente' | 'aliado' | 'general'>('cliente');
  const [formIcon, setFormIcon] = useState('🏆');
  const [formTargetCount, setFormTargetCount] = useState(5);
  const [formRewardType, setFormRewardType] = useState<'bono' | 'cupon' | 'descuento' | 'reconocimiento'>('cupon');
  const [formRewardValue, setFormRewardValue] = useState('');

  // Rankings Mock Data
  const ALLY_RANKING = [
    { rank: 1, name: 'Alvaro Restrepo', rating: 4.95, completed: 342, streak: 12, points: 2850, level: 'Aliado Leyenda 👑', avatar: '👨‍✈️' },
    { rank: 2, name: 'Juan Carlos Silva', rating: 4.90, completed: 189, streak: 8, points: 1940, level: 'Aliado Élite 🏆', avatar: '🏍️' },
    { rank: 3, name: 'Andrés Mendoza', rating: 4.80, completed: 94, streak: 4, points: 1100, level: 'Aliado Experto ⭐', avatar: '🛵' },
    { rank: 4, name: 'Sonia Restrepo', rating: 4.75, completed: 52, streak: 2, points: 650, level: 'Aliado Avanzado', avatar: '👩‍✈️' },
    { rank: 5, name: 'Wilson Cardona', rating: 4.60, completed: 21, streak: 0, points: 300, level: 'Aliado Principiante', avatar: '👨‍✈️' },
  ];

  const CLIENT_RANKING = [
    { rank: 1, name: 'Carlos Ortega', servicesCount: 42, points: 2100, level: 'Viajero Diamante 💎' },
    { rank: 2, name: 'Ferney Gómez', servicesCount: 24, points: 1450, level: 'Viajero Platino ✨' },
    { rank: 3, name: 'Camila Rojas', servicesCount: 18, points: 950, level: 'Viajero Oro 🌟' },
    { rank: 4, name: 'Diana Gómez', servicesCount: 15, points: 720, level: 'Viajero Plata' },
    { rank: 5, name: 'Andrés Pardo', servicesCount: 9, points: 410, level: 'Viajero Bronce' },
  ];

  // Handlers for client rewards redemption
  const handleRedeemReward = (rewardId: string, cost: number) => {
    if (points < cost) {
      alert('¡Puntos insuficientes! Sigue pidiendo servicios en Movica para acumular más estrellas.');
      return;
    }
    
    setPoints(prev => prev - cost);
    setRewards(prev => prev.map(r => {
      if (r.id === rewardId) {
        return { ...r, redeemed: true };
      }
      return r;
    }));

    // Add code or reward directly as a simulated benefit
    alert('¡Felicidades! Recompensa canjeada con éxito. Un código de cupón se agregará a tu sección de "Cupones y Promociones" automáticamente.');
  };

  // Handlers for Admin Dashboard
  const handleCreateOrUpdateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) return;

    if (editingId) {
      // Edit
      setAchievements(prev => prev.map(ach => {
        if (ach.id === editingId) {
          return {
            ...ach,
            title: formTitle.trim(),
            description: formDesc.trim(),
            points: formPoints,
            category: formCategory,
            icon: formIcon,
            targetCount: formTargetCount,
            rewardType: formRewardType,
            rewardValue: formRewardValue.trim() || 'Sin premio específico'
          };
        }
        return ach;
      }));
      setEditingId(null);
      alert('Logro actualizado con éxito.');
    } else {
      // Create new
      const newAch: Achievement = {
        id: `ach-${Date.now()}`,
        title: formTitle.trim(),
        description: formDesc.trim(),
        points: formPoints,
        category: formCategory,
        icon: formIcon,
        targetCount: formTargetCount,
        currentCount: 0,
        completed: false,
        isActive: true,
        rewardType: formRewardType,
        rewardValue: formRewardValue.trim() || 'Descuento o Bono'
      };
      setAchievements(prev => [newAch, ...prev]);
      alert('Nuevo logro creado y activado en la plataforma.');
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormPoints(100);
    setFormCategory('cliente');
    setFormIcon('🏆');
    setFormTargetCount(5);
    setFormRewardType('cupon');
    setFormRewardValue('');
    setEditingId(null);
  };

  const handleEditTrigger = (ach: Achievement) => {
    setEditingId(ach.id);
    setFormTitle(ach.title);
    setFormDesc(ach.description);
    setFormPoints(ach.points);
    setFormCategory(ach.category);
    setFormIcon(ach.icon);
    setFormTargetCount(ach.targetCount);
    setFormRewardType(ach.rewardType);
    setFormRewardValue(ach.rewardValue);
  };

  const handleToggleActive = (id: string) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === id) {
        return { ...ach, isActive: !ach.isActive };
      }
      return ach;
    }));
  };

  const handleDeleteAchievement = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este logro de forma permanente?')) {
      setAchievements(prev => prev.filter(ach => ach.id !== id));
    }
  };

  // Helper functions for user display
  const getClientLevelName = (lvl: number) => {
    switch (lvl) {
      case 1: return 'Viajero Bronce 🥉';
      case 2: return 'Viajero Plata 🥈';
      case 3: return 'Viajero Oro 🌟';
      case 4: return 'Viajero Platino ✨';
      case 5: return 'Viajero Diamante 💎';
      default: return 'Viajero Principiante';
    }
  };

  const getAllyLevelName = (completed: number) => {
    if (completed >= 300) return 'Aliado Leyenda 👑';
    if (completed >= 150) return 'Aliado Élite 🏆';
    if (completed >= 80) return 'Aliado Experto ⭐';
    if (completed >= 30) return 'Aliado Avanzado 🏍️';
    return 'Aliado Bronce 🛵';
  };

  // Render Client gamification UI
  if (mode === 'cliente') {
    const clientCompletedAchievements = achievements.filter(ach => ach.category === 'cliente' && ach.completed && ach.isActive);
    const clientPendingAchievements = achievements.filter(ach => ach.category === 'cliente' && !ach.completed && ach.isActive);

    return (
      <div className="space-y-6">
        
        {/* LEVEL AND POINTS BANNER CARD */}
        <div className="bg-gradient-to-br from-[#0d1a16] to-[#122e23] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden text-left border border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Medal size={120} className="text-white" />
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] bg-primary/20 text-primary font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-primary/30">
                SISTEMA DE LOGROS MOVICA
              </span>
              <h3 className="font-sora font-black text-lg tracking-tight mt-1.5">{getClientLevelName(level)}</h3>
              <p className="text-xs text-white/70">Sigue usando Movica en Aguachica para subir al nivel Diamante.</p>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wide">Puntos Acumulados</span>
              <span className="text-3xl font-sora font-black text-amber-400 flex items-center justify-end gap-1">
                ⭐ {points}
              </span>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-white/60">Progreso de Nivel</span>
              <span className="text-primary">{(points % 500)} / 500 XP para Nivel {level < 5 ? level + 1 : 5}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((points % 500) / 500) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* REWARDS SECTION */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-left">
            <div>
              <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1">
                <Gift size={16} className="text-rose-500" /> Recompensas Disponibles
              </h4>
              <p className="text-[10px] text-ink-soft">Canjea tus puntos acumulados por beneficios inmediatos.</p>
            </div>
            <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-xl">
              ⭐ {points} para canjes
            </span>
          </div>

          <div className="space-y-2.5 text-left">
            {rewards.map(reward => (
              <div 
                key={reward.id} 
                className={`p-4 rounded-2xl border bg-white flex items-center justify-between gap-3 shadow-xs transition-all ${
                  reward.redeemed 
                    ? 'border-divider/50 opacity-75' 
                    : 'border-divider/60 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl p-2 bg-surface-alt/50 rounded-xl block flex-shrink-0">
                    {reward.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="font-sora font-extrabold text-xs text-ink block truncate">{reward.title}</span>
                    <span className="text-[9.5px] text-ink-soft block leading-normal mt-0.5 font-semibold">{reward.description}</span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {reward.redeemed ? (
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl block">
                      Canjeado ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRedeemReward(reward.id, reward.cost)}
                      className={`px-3 py-1.5 rounded-xl font-sora font-bold text-[10px] transition-all cursor-pointer ${
                        points >= reward.cost
                          ? 'bg-primary text-white hover:bg-primary-dark shadow-xs'
                          : 'bg-ink-faint text-white cursor-not-allowed'
                      }`}
                    >
                      Canjear (⭐ {reward.cost})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS HISTORY */}
        <div className="space-y-3.5 pt-2">
          <div className="text-left">
            <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1">
              <Award size={16} className="text-primary" /> Historial de Logros
            </h4>
            <p className="text-[10px] text-ink-soft">Retos que completas al solicitar viajes y mensajerías.</p>
          </div>

          {/* Staggered list of completed & pending */}
          <div className="space-y-2.5 text-left">
            {achievements
              .filter(ach => ach.category === 'cliente' || ach.category === 'general')
              .filter(ach => ach.isActive)
              .map(ach => {
                const progressPct = Math.min(100, (ach.currentCount / ach.targetCount) * 100);
                return (
                  <div 
                    key={ach.id} 
                    className={`p-4 bg-white border rounded-2xl flex flex-col gap-3 shadow-xs transition-shadow relative overflow-hidden ${
                      ach.completed 
                        ? 'border-primary/20 bg-primary-surface/5' 
                        : 'border-divider/60'
                    }`}
                  >
                    {/* Badge Stamp if completed */}
                    {ach.completed && (
                      <div className="absolute top-2 right-2 rotate-12 text-[9px] bg-[#E6F7EC] text-[#0EA65C] border border-[#0EA65C]/20 font-black uppercase px-2 py-0.5 rounded tracking-wider">
                        COMPLETADO ⭐
                      </div>
                    )}

                    <div className="flex gap-3 items-start pr-16">
                      <span className="text-2xl p-2.5 bg-surface-alt/75 rounded-2xl block flex-shrink-0">
                        {ach.icon}
                      </span>
                      <div>
                        <span className="font-sora font-extrabold text-xs text-ink block leading-snug">{ach.title}</span>
                        <p className="text-[9.5px] text-ink-soft leading-normal mt-0.5 font-semibold">{ach.description}</p>
                        <span className="text-[9px] text-primary font-black mt-1.5 block">Recompensa: {ach.rewardValue} (+⭐ {ach.points} Pts)</span>
                      </div>
                    </div>

                    {/* Progress Bar for Locked Achievements */}
                    {!ach.completed && (
                      <div className="space-y-1 bg-surface-alt/30 p-2.5 rounded-xl border border-divider/20">
                        <div className="flex justify-between text-[8.5px] font-bold text-ink-soft">
                          <span>Progreso del hito</span>
                          <span>{ach.currentCount} de {ach.targetCount}</span>
                        </div>
                        <div className="w-full bg-divider/40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    );
  }

  // Render Driver/Ally gamification UI
  if (mode === 'aliado') {
    // Simulated Driver general details
    const completedCount = 189; // perfect score matching Juan Carlos
    const averageRating = 4.93;
    const workingStreak = 8; // Racha de 8 días
    const weeklyGoalTotal = 30;
    const weeklyGoalCompleted = 24;

    const allyCompletedAchievements = achievements.filter(ach => ach.category === 'aliado' && ach.completed && ach.isActive);
    const allyPendingAchievements = achievements.filter(ach => ach.category === 'aliado' && !ach.completed && ach.isActive);

    return (
      <div className="space-y-6">
        
        {/* DRIVER STATS CARD */}
        <div className="bg-gradient-to-br from-[#0d1a16] to-[#122e23] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden text-left border border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Bike size={120} className="text-white" />
          </div>
          
          <div className="space-y-1">
            <span className="text-[9px] bg-primary/20 text-primary font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-primary/30">
              PANEL DE LOGROS - ALIADO MOVICA
            </span>
            <h3 className="font-sora font-black text-lg mt-2 tracking-tight">
              {getAllyLevelName(completedCount)}
            </h3>
            <p className="text-xs text-white/70">Mantienes tu desempeño de alta velocidad en Aguachica.</p>
          </div>

          {/* Row of detailed statistics */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/5">
            <div className="space-y-0.5 text-center bg-white/5 p-2 rounded-2xl">
              <span className="text-[8.5px] uppercase tracking-wider text-white/40 block font-bold">Calificación</span>
              <span className="text-amber-400 font-black text-sm flex items-center justify-center gap-0.5">
                ★ {averageRating}
              </span>
            </div>

            <div className="space-y-0.5 text-center bg-white/5 p-2 rounded-2xl">
              <span className="text-[8.5px] uppercase tracking-wider text-white/40 block font-bold">Racha</span>
              <span className="text-orange-400 font-black text-sm flex items-center justify-center gap-1">
                🔥 {workingStreak} Días
              </span>
            </div>

            <div className="space-y-0.5 text-center bg-white/5 p-2 rounded-2xl">
              <span className="text-[8.5px] uppercase tracking-wider text-white/40 block font-bold">Nivel Socio</span>
              <span className="text-primary font-black text-[11px] block truncate">
                ÉLITE 🏆
              </span>
            </div>
          </div>
        </div>

        {/* WEEKLY GOAL PROGRESS */}
        <div className="bg-white border border-divider/60 rounded-3xl p-5 text-left shadow-xs space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[8.5px] font-black text-primary uppercase tracking-wider block">Bono Semanal</span>
              <h4 className="font-sora font-extrabold text-xs text-ink">Completar Meta de 30 Servicios</h4>
              <p className="text-[9px] text-ink-soft font-semibold leading-normal mt-1">Completa 6 viajes más antes del Domingo para recibir un bono extra de +$15.000 COP.</p>
            </div>
            <span className="bg-[#E6F7EC] text-[#0EA65C] font-black text-xs px-2.5 py-1 rounded-xl">
              80% listo
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-ink-soft">
              <span>Progreso de meta semanal</span>
              <span>{weeklyGoalCompleted} de {weeklyGoalTotal} Viajes</span>
            </div>
            <div className="w-full bg-surface-alt h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#0EA65C] h-full rounded-full transition-all duration-500"
                style={{ width: `${(weeklyGoalCompleted / weeklyGoalTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* INSIGNIAS OBTENIDAS */}
        <div className="space-y-3.5">
          <div className="text-left">
            <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1">
              <Award size={16} className="text-amber-500" /> Insignias Obtenidas
            </h4>
            <p className="text-[10px] text-ink-soft">Medallas otorgadas por tus méritos de conducción y velocidad.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {ALLY_BADGES.map(badge => (
              <div 
                key={badge.id} 
                className={`p-4 border rounded-2xl bg-white flex items-start gap-3 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden ${badge.color}`}
              >
                <span className="text-3xl p-1 bg-white/50 rounded-xl block flex-shrink-0">
                  {badge.icon}
                </span>
                <div className="min-w-0">
                  <span className={`font-sora font-extrabold text-xs block leading-snug ${badge.textColor}`}>{badge.name}</span>
                  <p className="text-[9px] text-ink-soft font-semibold leading-normal mt-1">{badge.description}</p>
                  <span className="text-[8px] text-ink-faint font-mono font-bold block mt-2">Logrado: {badge.unlockedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGROS DEL ALIADO */}
        <div className="space-y-3.5 pt-2">
          <div className="text-left">
            <h4 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1">
              <Medal size={16} className="text-primary" /> Logros de Conducción
            </h4>
            <p className="text-[10px] text-ink-soft">Misiones activas e historial de recompensas del aliado.</p>
          </div>

          <div className="space-y-2.5 text-left">
            {achievements
              .filter(ach => ach.category === 'aliado' || ach.category === 'general')
              .filter(ach => ach.isActive)
              .map(ach => {
                const progressPct = Math.min(100, (ach.currentCount / ach.targetCount) * 100);
                return (
                  <div 
                    key={ach.id} 
                    className={`p-4 bg-white border rounded-2xl flex flex-col gap-3 shadow-xs transition-shadow relative overflow-hidden ${
                      ach.completed 
                        ? 'border-[#0EA65C]/20 bg-[#E6F7EC]/5' 
                        : 'border-divider/60'
                    }`}
                  >
                    {ach.completed && (
                      <div className="absolute top-2 right-2 rotate-12 text-[8px] bg-[#E6F7EC] text-[#0EA65C] border border-[#0EA65C]/20 font-black uppercase px-2 py-0.5 rounded tracking-wider">
                        COMPLETADO ⭐
                      </div>
                    )}

                    <div className="flex gap-3 items-start pr-12">
                      <span className="text-2xl p-2.5 bg-surface-alt/75 rounded-2xl block flex-shrink-0">
                        {ach.icon}
                      </span>
                      <div>
                        <span className="font-sora font-extrabold text-xs text-ink block leading-snug">{ach.title}</span>
                        <p className="text-[9.5px] text-ink-soft leading-normal mt-0.5 font-semibold">{ach.description}</p>
                        <span className="text-[9px] text-[#0EA65C] font-black mt-1.5 block">Premio: {ach.rewardValue} (+⭐ {ach.points} Pts)</span>
                      </div>
                    </div>

                    {!ach.completed && (
                      <div className="space-y-1 bg-surface-alt/30 p-2.5 rounded-xl border border-divider/20">
                        <div className="flex justify-between text-[8.5px] font-bold text-ink-soft">
                          <span>Progreso de misión</span>
                          <span>{ach.currentCount} de {ach.targetCount}</span>
                        </div>
                        <div className="w-full bg-divider/40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#0EA65C] h-full rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    );
  }

  // Render Admin controls UI
  const filteredAchievements = achievements.filter(ach => 
    ach.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ach.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ADMIN TABS HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-divider/30 pb-4">
        <div>
          <h3 className="font-sora font-extrabold text-base text-ink">Consola de Logros, Niveles e Rankings</h3>
          <p className="text-xs text-ink-soft mt-0.5">Controla las misiones e incentivos para clientes y aliados en la plataforma Movica.</p>
        </div>

        {/* Toggle options */}
        <div className="flex gap-1.5 bg-surface-alt/50 p-1 rounded-xl border border-divider/40">
          {[
            { id: 'logros', label: 'Misiones' },
            { id: 'ranking_aliados', label: 'Ranking Aliados 🏆' },
            { id: 'ranking_clientes', label: 'Ranking Clientes 👤' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                adminTab === tab.id 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {adminTab === 'logros' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDE: CREATOR / EDITOR FORM (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm space-y-4 h-fit">
            <div>
              <h4 className="font-sora font-extrabold text-sm text-ink">
                {editingId ? '📝 Editar Logro/Misión' : '✨ Crear Nuevo Logro'}
              </h4>
              <p className="text-[10px] text-ink-soft mt-0.5">Ingresa los parámetros y define la recompensa en COP o insignia.</p>
            </div>

            <form onSubmit={handleCreateOrUpdateAchievement} className="space-y-4 text-left">
              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Título de la Misión</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Completar 30 servicios en una semana"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Descripción del Desafío</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explica qué debe lograr el conductor o pasajero de manera clara..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">XP / Puntos Estrellas</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formPoints}
                    onChange={e => setFormPoints(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Meta numérica (Hito)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formTargetCount}
                    onChange={e => setFormTargetCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Icono representativo</label>
                  <select
                    value={formIcon}
                    onChange={e => setFormIcon(e.target.value)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="🏆">🏆 Copa Dorada</option>
                    <option value="🥇">🥇 Medalla Primer lugar</option>
                    <option value="🚀">🚀 Cohete Veloz</option>
                    <option value="💯">💯 Cien Perfecto</option>
                    <option value="⭐">⭐ Estrella Dorada</option>
                    <option value="🛵">🛵 Mototaxi Veloz</option>
                    <option value="🎯">🎯 Diana Blanca</option>
                    <option value="💰">💰 Saco de COP</option>
                    <option value="❤️">❤️ Corazón Rojo</option>
                    <option value="🔥">🔥 Fuego de Racha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Dirigido a</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="cliente">Pasajero (Cliente)</option>
                    <option value="aliado">Socio Conductor (Aliado)</option>
                    <option value="general">Ambos (General)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Tipo de Recompensa</label>
                  <select
                    value={formRewardType}
                    onChange={e => setFormRewardType(e.target.value as any)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="cupon">Cupón de Descuento</option>
                    <option value="bono">Bono de Saldo</option>
                    <option value="descuento">Descuento de Envíos</option>
                    <option value="reconocimiento">Insignia / Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-1">Descripción de Premio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Cupón $2.500 COP"
                    value={formRewardValue}
                    onChange={e => setFormRewardValue(e.target.value)}
                    className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-surface-alt hover:bg-divider text-ink-soft py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 flex items-center justify-center gap-1"
                >
                  <Check size={13} /> {editingId ? 'Guardar Cambios' : 'Crear Logro'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE: MISSION LISTS & AUDIT (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-divider/50 rounded-3xl p-5 shadow-sm space-y-4 h-[570px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Lista de Misiones Registradas ({filteredAchievements.length})</h4>
                <p className="text-[10px] text-ink-soft">Configuración actual de logros activos para la red de Aguachica.</p>
              </div>

              <div className="relative w-48">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Buscar logro..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-alt border-0 rounded-xl pl-7 pr-3 py-1.5 text-[10.5px] outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 content-scrollbar text-left">
              {filteredAchievements.map(ach => (
                <div 
                  key={ach.id} 
                  className={`p-4 border rounded-2xl flex items-center justify-between gap-3 shadow-xs transition-colors ${
                    ach.isActive 
                      ? 'border-divider bg-white' 
                      : 'border-dashed border-divider bg-surface-alt/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl p-2 bg-surface-alt rounded-xl block flex-shrink-0">
                      {ach.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sora font-extrabold text-xs text-ink truncate block">{ach.title}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.25 rounded ${
                          ach.category === 'cliente' ? 'bg-indigo-50 text-indigo-600' :
                          ach.category === 'aliado' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {ach.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-ink-soft leading-snug truncate mt-0.5">{ach.description}</p>
                      <span className="text-[9px] text-primary font-black mt-1.5 block">Recompensa: {ach.rewardValue} (+⭐ {ach.points} XP)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Toggle Active Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(ach.id)}
                      className="p-1 rounded-lg hover:bg-surface-alt text-ink"
                      title={ach.isActive ? 'Desactivar Misión' : 'Activar Misión'}
                    >
                      {ach.isActive ? (
                        <ToggleRight size={22} className="text-primary" />
                      ) : (
                        <ToggleLeft size={22} className="text-ink-soft" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditTrigger(ach)}
                      className="p-1.5 rounded-lg bg-surface-alt text-ink hover:bg-divider transition-all"
                      title="Editar Logro"
                    >
                      <Edit2 size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                      title="Eliminar Logro"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminTab === 'ranking_aliados' && (
        <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-sora font-extrabold text-sm text-ink">Ranking de Aliados (Socios de Conducción)</h4>
            <p className="text-xs text-ink-soft mt-0.5">Clasificación en tiempo real de los motorizados basada en viajes, estrellas e insignias ganadas en Aguachica.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                  <th className="py-3 px-2 text-center w-12">Posición</th>
                  <th className="py-3 px-2">Socio Conductor</th>
                  <th className="py-3 px-2">Calificación</th>
                  <th className="py-3 px-2 text-center">Viajes Completados</th>
                  <th className="py-3 px-2 text-center">Racha de Trabajo</th>
                  <th className="py-3 px-2 text-right">Puntos Totales</th>
                  <th className="py-3 px-2 text-right">Nivel / Rango</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                {ALLY_RANKING.map((ally) => (
                  <tr key={ally.rank} className="hover:bg-surface-alt/30 transition-colors">
                    <td className="py-4 px-2 text-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mx-auto ${
                        ally.rank === 1 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' :
                        ally.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        ally.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-surface-alt text-ink-soft'
                      }`}>
                        {ally.rank}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ally.avatar}</span>
                        <div>
                          <span className="font-bold text-ink block">{ally.name}</span>
                          <span className="text-[10px] text-ink-soft block font-semibold">Cédula: 1.096.***.***</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-amber-500 font-extrabold flex items-center gap-0.5">
                        ★ {ally.rating.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center text-ink">{ally.completed}</td>
                    <td className="py-4 px-2 text-center text-orange-600">
                      <span className="inline-flex items-center gap-0.5">
                        🔥 {ally.streak} días
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right text-primary font-black">⭐ {ally.points}</td>
                    <td className="py-4 px-2 text-right">
                      <span className="bg-primary-surface text-primary-dark font-black text-[9.5px] px-2.5 py-1 rounded-xl">
                        {ally.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === 'ranking_clientes' && (
        <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-sora font-extrabold text-sm text-ink">Ranking de Clientes (Viajeros Estrella)</h4>
            <p className="text-xs text-ink-soft mt-0.5">Listado y auditoría de los clientes más activos que apoyan la economía local de Aguachica.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                  <th className="py-3 px-2 text-center w-12">Posición</th>
                  <th className="py-3 px-2">Pasajero / Cliente</th>
                  <th className="py-3 px-2 text-center">Trayectos Solicitados</th>
                  <th className="py-3 px-2 text-right">Puntos Acumulados</th>
                  <th className="py-3 px-2 text-right">Rango de Viajero</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                {CLIENT_RANKING.map((cli) => (
                  <tr key={cli.rank} className="hover:bg-surface-alt/30 transition-colors">
                    <td className="py-4 px-2 text-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mx-auto ${
                        cli.rank === 1 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400' :
                        cli.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        cli.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-surface-alt text-ink-soft'
                      }`}>
                        {cli.rank}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <span className="font-bold text-ink block">{cli.name}</span>
                        <span className="text-[10px] text-ink-soft block font-semibold">Celular: +57 312 *** ****</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center text-ink">{cli.servicesCount}</td>
                    <td className="py-4 px-2 text-right text-primary font-black">⭐ {cli.points}</td>
                    <td className="py-4 px-2 text-right">
                      <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[9.5px] px-2.5 py-1 rounded-xl">
                        {cli.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
