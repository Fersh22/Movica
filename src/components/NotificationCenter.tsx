import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Check, CheckSquare, Trash2, X, Filter, Sparkles, 
  Bike, Compass, Gift, DollarSign, Award, BellOff, Info, RefreshCw, Star
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  category: 'servicios' | 'promociones' | 'sistema';
  icon: string;
}

interface NotificationCenterProps {
  mode: 'cliente' | 'aliado';
  onClose: () => void;
}

export default function NotificationCenter({ mode, onClose }: NotificationCenterProps) {
  // --- INITIAL DATA PREPOPULATED PER MODE ---
  const initialClientNotifications: NotificationItem[] = [
    {
      id: 'nc-1',
      title: 'Tu aliado ha aceptado el servicio 🛵',
      description: 'El aliado Alvaro Restrepo (Yamaha NMAX - KSM-92G) ya va en camino a recogerte.',
      time: 'Hace 2 min',
      isRead: false,
      category: 'servicios',
      icon: '🛵'
    },
    {
      id: 'nc-2',
      title: 'El aliado está llegando 📍',
      description: 'Tu conductor se encuentra a menos de 100 metros de tu punto de inicio.',
      time: 'Hace 5 min',
      isRead: false,
      category: 'servicios',
      icon: '📍'
    },
    {
      id: 'nc-3',
      title: 'Bono de descuento disponible 🎁',
      description: '¡Felicidades! Tienes un cupón de 25% de descuento en tu próximo viaje usando el código MOVICAYAP.',
      time: 'Hace 1 hora',
      isRead: false,
      category: 'promociones',
      icon: '🎁'
    },
    {
      id: 'nc-4',
      title: 'Nueva promoción disponible 💰',
      description: 'Envíos de encomiendas hoy a mitad de precio en todo Aguachica de 2:00 PM a 5:00 PM.',
      time: 'Hace 3 horas',
      isRead: true,
      category: 'promociones',
      icon: '💰'
    },
    {
      id: 'nc-5',
      title: 'Califica tu experiencia ⭐',
      description: 'Cuéntanos cómo te fue en tu último viaje con Alvaro. Tu opinión nos ayuda a mejorar.',
      time: 'Ayer',
      isRead: true,
      category: 'sistema',
      icon: '⭐'
    },
    {
      id: 'nc-6',
      title: 'El servicio comenzó ✅',
      description: 'Tu trayecto ha iniciado de manera segura. Puedes compartir tu ubicación en tiempo real.',
      time: 'Hace 1 día',
      isRead: true,
      category: 'servicios',
      icon: '✅'
    },
    {
      id: 'nc-7',
      title: 'El servicio terminó 🏁',
      description: 'Has llegado a tu destino. El total fue de $6.000 COP cobrados en efectivo.',
      time: 'Hace 1 día',
      isRead: true,
      category: 'servicios',
      icon: '🏁'
    }
  ];

  const initialAllyNotifications: NotificationItem[] = [
    {
      id: 'na-1',
      title: '¡Nuevo servicio disponible! 🚨',
      description: 'Recogida en Calle 5 (Parque Principal Santander) con destino a Barrio Barahoja. Valor: $6.000 COP.',
      time: 'Hace 1 min',
      isRead: false,
      category: 'servicios',
      icon: '🚨'
    },
    {
      id: 'na-2',
      title: 'Pago recibido con éxito 💰',
      description: 'Has recibido $5.100 COP (85% tarifa neta) por el servicio prestado a Camila Rojas.',
      time: 'Hace 15 min',
      isRead: false,
      category: 'sistema',
      icon: '💰'
    },
    {
      id: 'na-3',
      title: 'Has recibido una nueva calificación ⭐',
      description: '¡Felicitaciones! Carolina Torres te ha calificado con 5 estrellas: "Excelente servicio, muy educado".',
      time: 'Hace 2 horas',
      isRead: false,
      category: 'sistema',
      icon: '⭐'
    },
    {
      id: 'na-4',
      title: '¡Alcanzaste un nuevo nivel! 🏆',
      description: 'Nivel Bronce completado. Ahora calificas para la tasa de comisión preferencial del 13% en Aguachica.',
      time: 'Hace 4 horas',
      isRead: true,
      category: 'sistema',
      icon: '🏆'
    },
    {
      id: 'na-5',
      title: 'Nuevo anuncio de Movica 📢',
      description: 'Atención aliado: Mañana habrá mantenimiento vial preventivo en la Avenida Sabanita. Usa rutas alternas.',
      time: 'Hace 1 día',
      isRead: true,
      category: 'sistema',
      icon: '📢'
    }
  ];

  const storageKey = mode === 'cliente' ? 'movica_client_notifications' : 'movica_ally_notifications';

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  const [activeFilter, setActiveFilter] = useState<'todas' | 'servicios' | 'promociones' | 'sistema'>('todas');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- ACTIONS ---
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    showFeedback('Notificación marcada como leída');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showFeedback('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showFeedback('Notificación eliminada');
  };

  const clearHistory = () => {
    setNotifications([]);
    showFeedback('Historial vaciado');
  };

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  // --- REAL-TIME SIMULATION INJECTORS ---
  // Users can click these buttons to trigger custom realistic events and see the notification system respond
  const simulateNewNotification = (type: string) => {
    let newNotif: NotificationItem;
    const nowStr = 'Ahora mismo';
    const idRand = `nc-sim-${Date.now()}`;

    if (mode === 'cliente') {
      switch (type) {
        case 'aliado_acepto':
          newNotif = {
            id: idRand,
            title: '🛵 Tu aliado ha aceptado el servicio',
            description: 'El aliado Sonia Restrepo (Suzuki Gixxer - MNK-45E) aceptó tu solicitud y va en camino.',
            time: nowStr,
            isRead: false,
            category: 'servicios',
            icon: '🛵'
          };
          break;
        case 'aliado_llegando':
          newNotif = {
            id: idRand,
            title: '📍 El aliado está llegando',
            description: 'Sonia Restrepo ha llegado al punto de encuentro. Te espera afuera.',
            time: nowStr,
            isRead: false,
            category: 'servicios',
            icon: '📍'
          };
          break;
        case 'servicio_inicio':
          newNotif = {
            id: idRand,
            title: '✅ El servicio comenzó',
            description: 'Tu servicio en mototaxi está en curso con destino al Hospital Regional.',
            time: nowStr,
            isRead: false,
            category: 'servicios',
            icon: '✅'
          };
          break;
        case 'servicio_fin':
          newNotif = {
            id: idRand,
            title: '🏁 El servicio terminó',
            description: 'Gracias por viajar con Movica. Esperamos que hayas tenido un excelente viaje.',
            time: nowStr,
            isRead: false,
            category: 'servicios',
            icon: '🏁'
          };
          break;
        case 'promo_nueva':
          newNotif = {
            id: idRand,
            title: '🎁 Nueva promoción disponible',
            description: 'Fin de semana Movica: Viaja a cualquier barrio de Aguachica por solo $4.000 COP.',
            time: nowStr,
            isRead: false,
            category: 'promociones',
            icon: '🎁'
          };
          break;
        case 'cupon_descuento':
          newNotif = {
            id: idRand,
            title: '💰 Cupón de descuento disponible',
            description: 'Recibe un 15% de descuento en tu próximo envío. Código promocional: MOVICAPP15.',
            time: nowStr,
            isRead: false,
            category: 'promociones',
            icon: '💰'
          };
          break;
        default:
          return;
      }
    } else {
      // Driver notifications simulation
      switch (type) {
        case 'servicio_dispo':
          newNotif = {
            id: idRand,
            title: '🚨 Nuevo servicio disponible',
            description: 'Cliente solicita Mandado urgente de Parque Principal a C.C. San Roque. Tarifa: $7.000 COP.',
            time: nowStr,
            isRead: false,
            category: 'servicios',
            icon: '🚨'
          };
          break;
        case 'pago_recibido':
          newNotif = {
            id: idRand,
            title: '💰 Pago recibido',
            description: 'Tu billetera Movica ha sido acreditada con $5.950 COP del servicio completado.',
            time: nowStr,
            isRead: false,
            category: 'sistema',
            icon: '💰'
          };
          break;
        case 'califica_recibida':
          newNotif = {
            id: idRand,
            title: '⭐ Nueva calificación de cliente',
            description: 'Has recibido un puntaje perfecto de 5.0 de Juan Carlos Silva: "Rápido y muy seguro".',
            time: nowStr,
            isRead: false,
            category: 'sistema',
            icon: '⭐'
          };
          break;
        case 'nivel_alcanzado':
          newNotif = {
            id: idRand,
            title: '🏆 Alcanzaste un nuevo nivel',
            description: '¡Felicidades! Has ascendido a nivel Plata por completar 20 viajes esta semana sin cancelaciones.',
            time: nowStr,
            isRead: false,
            category: 'sistema',
            icon: '🏆'
          };
          break;
        case 'anuncio_movica':
          newNotif = {
            id: idRand,
            title: '📢 Nuevo anuncio de Movica',
            description: 'Reunión de socios presencial en las oficinas centrales de Aguachica este sábado a las 4:00 PM.',
            time: nowStr,
            isRead: false,
            category: 'sistema',
            icon: '📢'
          };
          break;
        default:
          return;
      }
    }

    setNotifications(prev => [newNotif, ...prev]);
    showFeedback('¡Nueva notificación simulada con éxito!');
  };

  // --- FILTERED DATA ---
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'todas') return true;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between py-3 border-b border-divider/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-ink text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-sora font-extrabold text-sm text-ink">Centro de Notificaciones</h3>
            <p className="text-[9.5px] text-ink-soft leading-none mt-0.5">
              Panel interactivo para {mode === 'cliente' ? 'Pasajeros' : 'Aliados de Aguachica'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-8.5 h-8.5 rounded-full bg-surface-alt hover:bg-divider flex items-center justify-center text-ink cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* FEEDBACK STATUS BAR */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 left-0 right-0 z-50 mx-4 bg-[#E6F7EC] text-[#0EA65C] text-[10px] font-bold py-2 px-3 rounded-xl border border-[#0EA65C]/20 shadow-xs flex items-center justify-between"
          >
            <span className="flex items-center gap-1">
              <Check size={11} className="stroke-[3]" /> {successMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK SIMULATOR CONTROLS */}
      <div className="bg-surface-alt/70 border border-divider/40 p-3 rounded-2xl my-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9.5px] text-primary font-black uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={11} className="animate-pulse" /> Simulador de Alertas en Vivo
          </span>
          <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase">
            Test de Requisitos
          </span>
        </div>
        
        {/* Sim buttons for Client */}
        {mode === 'cliente' ? (
          <div className="grid grid-cols-3 gap-1.5">
            <button 
              onClick={() => simulateNewNotification('aliado_acepto')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              🛵 Aceptó viaje
            </button>
            <button 
              onClick={() => simulateNewNotification('aliado_llegando')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              📍 Aliado llegó
            </button>
            <button 
              onClick={() => simulateNewNotification('servicio_inicio')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              ✅ Inició viaje
            </button>
            <button 
              onClick={() => simulateNewNotification('servicio_fin')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              🏁 Fin de servicio
            </button>
            <button 
              onClick={() => simulateNewNotification('promo_nueva')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              🎁 Promo nueva
            </button>
            <button 
              onClick={() => simulateNewNotification('cupon_descuento')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              💰 Cupón descuento
            </button>
          </div>
        ) : (
          /* Sim buttons for Ally */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button 
              onClick={() => simulateNewNotification('servicio_dispo')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              🚨 Nuevo servicio
            </button>
            <button 
              onClick={() => simulateNewNotification('pago_recibido')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              💰 Pago acreditado
            </button>
            <button 
              onClick={() => simulateNewNotification('califica_recibida')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              ⭐ Calificación 5★
            </button>
            <button 
              onClick={() => simulateNewNotification('nivel_alcanzado')}
              className="bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              🏆 Nivel alcanzado
            </button>
            <button 
              onClick={() => simulateNewNotification('anuncio_movica')}
              className="col-span-2 sm:col-span-1 bg-white hover:bg-primary-surface border border-divider/50 hover:border-primary/20 p-1.5 rounded-lg text-[8.5px] font-bold text-ink leading-tight text-center cursor-pointer transition-all active:scale-95"
            >
              📢 Anuncio oficial
            </button>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS ROW */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between pb-2 border-b border-divider/30 mb-2 flex-shrink-0">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-[9.5px] text-primary disabled:text-ink-faint font-extrabold flex items-center gap-1 hover:underline cursor-pointer disabled:cursor-not-allowed"
          >
            <CheckSquare size={12} /> Marcar todo como leído
          </button>
          <button 
            onClick={clearHistory}
            className="text-[9.5px] text-red-500 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Trash2 size={12} /> Vaciar historial
          </button>
        </div>
      )}

      {/* CATEGORY FILTERS (Todas, Servicios, Promociones, Sistema) */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none flex-shrink-0">
        {[
          { id: 'todas', label: 'Todas', icon: '🔔' },
          { id: 'servicios', label: 'Servicios', icon: '🛵' },
          { id: 'promociones', label: 'Promociones', icon: '🎁' },
          { id: 'sistema', label: 'Sistema', icon: '⚙️' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer select-none ${
              activeFilter === filter.id 
                ? 'bg-primary text-white border-primary shadow-xs scale-[1.02]' 
                : 'bg-surface-alt text-ink-soft border-divider/50 hover:bg-divider/30'
            }`}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS CONTAINER */}
      <div className="flex-1 overflow-y-auto content-scrollbar pr-0.5 space-y-2.5 pb-24">
        <AnimatePresence initial={false}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -30 }}
                transition={{ duration: 0.18 }}
                className={`group border rounded-2xl p-3.5 transition-all relative overflow-hidden ${
                  item.isRead 
                    ? 'bg-white border-divider/50 opacity-75' 
                    : 'bg-primary-surface/10 border-primary/20 shadow-xs ring-1 ring-primary/5'
                }`}
              >
                {/* Unread Indicator Bar */}
                {!item.isRead && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
                )}

                <div className="flex gap-3">
                  {/* Category icon */}
                  <div className="w-10 h-10 rounded-xl bg-surface-alt border border-divider/40 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className={`text-xs font-extrabold text-ink leading-tight ${!item.isRead ? 'font-black text-primary-dark' : 'font-bold'}`}>
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="bg-accent text-ink text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                          Nueva
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-soft leading-relaxed mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] text-ink-faint font-semibold">{item.time}</span>
                      <span className="text-[9px] text-divider">•</span>
                      <span className="text-[9px] text-primary uppercase font-bold tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inline Actions Drawer (Hover triggered on desktop, always visible on mobile) */}
                <div className="absolute right-2 top-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-divider/30 shadow-2xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {!item.isRead && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      title="Marcar como leída"
                      className="p-1 text-[#0EA65C] hover:bg-[#E6F7EC] rounded-md cursor-pointer transition-colors"
                    >
                      <Check size={11} className="stroke-[3]" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Eliminar"
                    className="p-1 text-red-500 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-14 text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center text-ink-faint">
                <BellOff size={22} />
              </div>
              <div>
                <h5 className="font-sora font-extrabold text-xs text-ink">Historial limpio</h5>
                <p className="text-[10px] text-ink-soft max-w-[200px] mx-auto mt-0.5 leading-relaxed">
                  No hay notificaciones {activeFilter !== 'todas' ? `en la categoría de ${activeFilter}` : ''} en este momento.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
