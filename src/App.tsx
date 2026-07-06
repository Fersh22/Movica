import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, ClipboardList, Heart, HelpCircle, User, 
  Bike, LogIn, ArrowRight, Smartphone, Sparkles, Shield, Bot,
  Menu, X
} from 'lucide-react';
import { Order, Favorite, UserProfile, ServiceType } from './types';
import { INITIAL_USER, INITIAL_FAVORITES, INITIAL_ORDERS } from './data';

import HomeView from './components/HomeView';
import HistoryView from './components/HistoryView';
import FavoritesView from './components/FavoritesView';
import HelpView from './components/HelpView';
import ProfileView from './components/ProfileView';
import ServiceForm from './components/ServiceForm';
import PartnerPanel from './components/PartnerPanel';
import AdminPanel from './components/AdminPanel';
import AllyRegistrationFlow from './components/AllyRegistrationFlow';
import MerchantPanel from './components/MerchantPanel';
import SecurityCenter from './components/SecurityCenter';
import MoviAssistant from './components/MoviAssistant';
import SupervisorPanel from './components/SupervisorPanel';
import movicaLogo from './assets/images/movica_logo_1783309351402.jpg';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('movica_is_logged_in') === 'true';
  });
  const [userRole, setUserRole] = useState<'cliente' | 'aliado' | 'comercio' | 'admin' | 'supervisor'>(() => {
    return (localStorage.getItem('movica_user_role') as any) || 'cliente';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('movica_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const saved = localStorage.getItem('movica_favorites');
    return saved ? JSON.parse(saved) : INITIAL_FAVORITES;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('movica_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  
  const [isPartnerMode, setIsPartnerMode] = useState<boolean>(false);
  const [isMerchantMode, setIsMerchantMode] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isSupervisorMode, setIsSupervisorMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [activeServiceType, setActiveServiceType] = useState<ServiceType | null>(null);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isMoviOpen, setIsMoviOpen] = useState(false);

  // Light/Dark theme mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('movica_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('movica_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sidebar navigation and About modal states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Auth simulation states
  const [activePortal, setActivePortal] = useState<'cliente' | 'trabajador' | 'comercio' | 'administracion'>('cliente');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Persist states to LocalStorage
  useEffect(() => {
    localStorage.setItem('movica_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('movica_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('movica_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('movica_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('movica_orders', JSON.stringify(orders));
  }, [orders]);

  const handlePortalChange = (portal: 'cliente' | 'trabajador' | 'comercio' | 'administracion') => {
    setActivePortal(portal);
    setAuthMode('login');
    if (portal === 'cliente') {
      setUserRole('cliente');
    } else if (portal === 'trabajador') {
      setUserRole('aliado');
    } else if (portal === 'comercio') {
      setUserRole('comercio');
    } else if (portal === 'administracion') {
      setUserRole('admin');
    }
  };
  
  // Register form fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('Aguachica');
  const [regReferral, setRegReferral] = useState('');
  const [regTerms, setRegTerms] = useState(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;

    const formattedPhone = loginPhone.startsWith('+57') ? loginPhone : `+57 ${loginPhone}`;
    
    // Check if user exists in movica_users
    const savedUsers = localStorage.getItem('movica_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    let existingUser = usersList.find((u: any) => u.phone === formattedPhone);

    let finalName = existingUser ? existingUser.name : '';
    let finalEmail = existingUser ? existingUser.email : '';
    let finalAvatar = finalName ? finalName.charAt(0).toUpperCase() : '';

    if (!existingUser) {
      if (userRole === 'aliado') {
        finalName = 'Alvaro Restrepo';
        finalEmail = 'alvaro.socio@movica.com';
        finalAvatar = '👨‍✈️';
      } else if (userRole === 'comercio') {
        finalName = 'Don Julio - El Corral';
        finalEmail = 'elcorral.aguachica@movica.com';
        finalAvatar = '🏪';
      } else if (userRole === 'admin') {
        finalName = 'Sonia Alvarez';
        finalEmail = 'sonia.admin@movica.com';
        finalAvatar = '💼';
      } else if (userRole === 'supervisor') {
        finalName = 'Carlos Mendoza';
        finalEmail = 'carlos.supervisor@movica.com';
        finalAvatar = '🛡️';
      } else {
        finalName = 'Usuario Nuevo';
        finalEmail = `${formattedPhone.replace(/\s+/g, '')}@correo.com`;
        finalAvatar = '👤';
      }

      const newCli = {
        id: `CLI-${Date.now()}`,
        name: finalName,
        phone: formattedPhone,
        email: finalEmail,
        servicesCount: 0,
        status: 'activo'
      };
      usersList.push(newCli);
      localStorage.setItem('movica_users', JSON.stringify(usersList));
    }

    setUserProfile({
      name: finalName,
      email: finalEmail,
      phone: formattedPhone,
      avatarLetter: finalAvatar,
      addresses: [
        { label: 'Casa', address: 'Calle Principal # 12-34' }
      ]
    });
    setIsLoggedIn(true);

    if (userRole === 'cliente') {
      setIsPartnerMode(false);
      setIsMerchantMode(false);
      setIsAdminMode(false);
      setIsSupervisorMode(false);
      setActiveTab('inicio');
    } else if (userRole === 'aliado') {
      setIsPartnerMode(true);
      setIsMerchantMode(false);
      setIsAdminMode(false);
      setIsSupervisorMode(false);
    } else if (userRole === 'comercio') {
      setIsMerchantMode(true);
      setIsPartnerMode(false);
      setIsAdminMode(false);
      setIsSupervisorMode(false);
    } else if (userRole === 'admin') {
      setIsAdminMode(true);
      setIsPartnerMode(false);
      setIsMerchantMode(false);
      setIsSupervisorMode(false);
    } else if (userRole === 'supervisor') {
      setIsSupervisorMode(true);
      setIsAdminMode(false);
      setIsPartnerMode(false);
      setIsMerchantMode(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    const formattedPhone = regPhone.startsWith('+57') ? regPhone : `+57 ${regPhone}`;
    const newProfile: UserProfile = {
      name: regName.trim(),
      email: regEmail.trim() || `${regName.trim().toLowerCase().replace(/\s+/g, '')}@correo.com`,
      phone: formattedPhone,
      avatarLetter: regName.trim().charAt(0).toUpperCase(),
      addresses: [
        { label: 'Casa', address: 'Calle Principal # 12-34' }
      ]
    };

    setUserProfile(newProfile);
    setIsLoggedIn(true);

    // Save to registered customers list
    const savedUsers = localStorage.getItem('movica_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    if (!usersList.some((u: any) => u.phone === formattedPhone)) {
      usersList.push({
        id: `CLI-${Date.now()}`,
        name: newProfile.name,
        phone: newProfile.phone,
        email: newProfile.email,
        servicesCount: 0,
        status: 'activo'
      });
      localStorage.setItem('movica_users', JSON.stringify(usersList));
    }

    if (userRole === 'cliente') {
      setIsPartnerMode(false);
      setIsMerchantMode(false);
      setIsAdminMode(false);
      setIsSupervisorMode(false);
      setActiveTab('inicio');
    } else if (userRole === 'aliado') {
      setIsPartnerMode(true);
      setIsMerchantMode(false);
      setIsAdminMode(false);
      setIsSupervisorMode(false);
    } else if (userRole === 'comercio') {
      setIsMerchantMode(true);
      setIsPartnerMode(false);
      setIsAdminMode(false);
      setIsSupervisorMode(false);
    } else if (userRole === 'admin') {
      setIsAdminMode(true);
      setIsPartnerMode(false);
      setIsMerchantMode(false);
      setIsSupervisorMode(false);
    } else if (userRole === 'supervisor') {
      setIsSupervisorMode(true);
      setIsAdminMode(false);
      setIsPartnerMode(false);
      setIsMerchantMode(false);
    }
  };

  const handleSelectService = (type: ServiceType) => {
    setActiveServiceType(type);
  };

  const handleBookingSubmit = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setActiveServiceType(null);
    setActiveTab('historial');
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelado' as const } : o));
  };

  const handleAddFavorite = (newFav: Omit<Favorite, 'id'>) => {
    const favorite: Favorite = {
      ...newFav,
      id: `fav-${Date.now()}`
    };
    setFavorites(prev => [...prev, favorite]);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('cliente');
    setIsPartnerMode(false);
    setIsMerchantMode(false);
    setIsAdminMode(false);
    setIsSupervisorMode(false);
    setActivePortal('cliente');
    setLoginPhone('');
    setLoginPin('');
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    localStorage.removeItem('movica_is_logged_in');
    localStorage.removeItem('movica_user_role');
    localStorage.removeItem('movica_user_profile');
  };

  // Nav items configuration
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠', activeIcon: '🏠' },
    { id: 'historial', label: 'Historial', icon: '📜', activeIcon: '📜' },
    { id: 'favoritos', label: 'Favoritos', icon: '❤️', activeIcon: '❤️' },
    { id: 'ayuda', label: 'Ayuda', icon: '💬', activeIcon: '💬' },
    { id: 'perfil', label: 'Perfil', icon: '👤', activeIcon: '👤' }
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <HomeView 
            userProfile={userProfile} 
            onSelectService={handleSelectService}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'historial':
        return (
          <HistoryView 
            orders={orders} 
            onCancelOrder={handleCancelOrder}
          />
        );
      case 'favoritos':
        return (
          <FavoritesView 
            favorites={favorites}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        );
      case 'ayuda':
        return <HelpView />;
      case 'perfil':
        return (
          <ProfileView 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
            }}
            onOpenSecurity={() => {
              setIsSecurityOpen(true);
            }}
            onSwitchToPartner={() => {
              setIsPartnerMode(true);
              setIsMerchantMode(false);
              setIsAdminMode(false);
              setIsSupervisorMode(false);
            }}
            onSwitchToMerchant={() => {
              setIsMerchantMode(true);
              setIsPartnerMode(false);
              setIsAdminMode(false);
              setIsSupervisorMode(false);
            }}
            onSwitchToAdmin={() => {
              setIsAdminMode(true);
              setIsPartnerMode(false);
              setIsMerchantMode(false);
              setIsSupervisorMode(false);
            }}
            onSwitchToSupervisor={() => {
              setIsSupervisorMode(true);
              setIsAdminMode(false);
              setIsPartnerMode(false);
              setIsMerchantMode(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (isLoggedIn && isAdminMode) {
    return (
      <AdminPanel 
        onBackToClient={() => {
          if (userRole === 'admin') {
            handleLogout();
          } else {
            setIsAdminMode(false);
            setIsPartnerMode(false);
            setIsSupervisorMode(false);
          }
        }}
        clientOrders={orders}
      />
    );
  }

  if (isLoggedIn && isSupervisorMode) {
    return (
      <SupervisorPanel 
        onBackToAdmin={() => {
          if (userRole === 'supervisor') {
            handleLogout();
          } else {
            setIsSupervisorMode(false);
            setIsAdminMode(false);
          }
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0d0b] text-ink' : 'bg-[#EAEAE4] text-ink'} font-sans flex flex-col items-center justify-center p-4 md:py-10 transition-colors duration-300`}>
      {/* App metadata header outside of phone */}
      <div className="text-center mb-6 hidden md:block">
        <h1 className="font-sora font-extrabold text-3xl text-ink tracking-tight flex items-center justify-center gap-2">
          <img src={movicaLogo} alt="Movica Logo" className="w-11 h-11 object-contain rounded-xl shadow-xs" referrerPolicy="no-referrer" />
          <span>Movica</span>
        </h1>
        <p className="text-xs text-ink-soft max-w-[480px] mt-1.5 leading-relaxed font-medium">
          Panel interactivo premium de Movica (Aguachica, Colombia). Explora la vista de cliente, panel de aliado o panel de administración.
        </p>

        {/* Desktop Theme Mode Toggle */}
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-bg border border-divider text-ink shadow-sm hover:bg-surface-alt transition-all cursor-pointer active:scale-95"
          >
            {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        </div>

        {isLoggedIn && (userRole === 'admin' || userRole === 'supervisor') && (
          <div className="mt-4 inline-flex flex-wrap items-center justify-center bg-white/90 backdrop-blur-sm border border-divider rounded-full p-1 shadow-md gap-1">
            <button
              onClick={() => {
                setIsPartnerMode(false);
                setIsMerchantMode(false);
                setIsAdminMode(false);
                setIsSupervisorMode(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                (!isPartnerMode && !isMerchantMode && !isAdminMode && !isSupervisorMode) 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              📱 Modo Cliente
            </button>
            <button
              onClick={() => {
                setIsPartnerMode(true);
                setIsMerchantMode(false);
                setIsAdminMode(false);
                setIsSupervisorMode(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                (isPartnerMode && !isMerchantMode && !isAdminMode && !isSupervisorMode) 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              🛵 Panel Aliado
            </button>
            <button
              onClick={() => {
                setIsMerchantMode(true);
                setIsPartnerMode(false);
                setIsAdminMode(false);
                setIsSupervisorMode(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                (isMerchantMode && !isPartnerMode && !isAdminMode && !isSupervisorMode) 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              🏪 Panel Comercio
            </button>
            <button
              onClick={() => {
                setIsAdminMode(true);
                setIsPartnerMode(false);
                setIsMerchantMode(false);
                setIsSupervisorMode(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                (isAdminMode && !isSupervisorMode) 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              💼 Panel Admin
            </button>
            <button
              onClick={() => {
                setIsSupervisorMode(true);
                setIsPartnerMode(false);
                setIsMerchantMode(false);
                setIsAdminMode(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSupervisorMode 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              🛡️ Panel Supervisor
            </button>
          </div>
        )}
      </div>

      {/* PHONE DEVICE SIMULATOR FRAME */}
      <div className="w-full h-[100dvh] md:w-[375px] md:h-[812px] bg-bg rounded-none md:rounded-[44px] md:border-[10px] md:border-[#0d1a16] md:shadow-[0_25px_50px_-12px_rgba(13,13,13,0.35),0_0_0_2px_#0d1a16] relative overflow-hidden flex flex-col transition-colors duration-300">
        {/* Notch - only displayed in device frame on desktop */}
        <div className="hidden md:block absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-6 bg-[#0d1a16] rounded-full z-[100]"></div>

        {/* Content canvas */}
        <div className="flex-1 flex flex-col relative h-full">

          {/* TOP BAR WITH HAMBURGER BUTTON (☰) - persistent across main client view and auth */}
          {(!isLoggedIn || (!isPartnerMode && !isMerchantMode && !isAdminMode && !isSupervisorMode)) && (
            <div className="h-14 border-b border-divider/30 flex items-center justify-between px-4 bg-bg flex-shrink-0 z-40 relative mt-4 md:mt-8 transition-colors duration-300">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-surface-alt hover:bg-divider/50 flex items-center justify-center text-ink cursor-pointer active:scale-95 transition-all"
                title="Menú"
              >
                <Menu size={18} />
              </button>
              <div className="flex items-center gap-1.5">
                <img src={movicaLogo} alt="Movica Logo" className="w-6 h-6 object-contain rounded-md" referrerPolicy="no-referrer" />
                <span className="font-sora font-black tracking-tight text-ink text-sm">Movica</span>
              </div>
              <div className="w-10 h-10 flex items-center justify-center">
                {isLoggedIn && (
                  <button
                    onClick={() => setActiveTab('perfil')}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-sora font-extrabold text-[11px] shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    title="Ver Perfil"
                  >
                    {userProfile.avatarLetter}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SIDEBAR DRAWER OVERLAY */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute inset-0 bg-black z-50 cursor-pointer"
                />
                
                {/* Sidebar Panel */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute top-0 bottom-0 left-0 w-[280px] bg-bg z-50 shadow-2xl flex flex-col justify-between p-6 text-left transition-colors duration-300"
                >
                  <div className="space-y-6">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-divider/50">
                      <div className="flex items-center gap-2">
                        <img src={movicaLogo} alt="Movica Logo" className="w-9 h-9 object-contain rounded-xl shadow-xs" referrerPolicy="no-referrer" />
                        <span className="font-sora font-black text-base text-ink tracking-tight">Movica</span>
                      </div>
                      <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-8 h-8 rounded-lg bg-surface-alt hover:bg-divider/50 flex items-center justify-center text-ink cursor-pointer transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Navigation List */}
                    <div className="space-y-2">
                      {[
                        { id: 'inicio', label: 'Inicio', icon: '🏠', desc: 'Aplicación para clientes' },
                        { id: 'aliados', label: 'Portal de Aliados', icon: '🛵', desc: 'Acceso para motorizados' },
                        { id: 'admin', label: 'Acceso Administrativo', icon: '🔐', desc: 'Consola de control principal' },
                        { id: 'ayuda', label: 'Ayuda', icon: '❓', desc: 'Preguntas y soporte técnico' },
                        { id: 'acerca', label: 'Acerca de Movica', icon: 'ℹ️', desc: 'Información de la plataforma' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setIsSidebarOpen(false);
                            if (item.id === 'inicio') {
                              if (isLoggedIn) {
                                setIsPartnerMode(false);
                                setIsMerchantMode(false);
                                setIsAdminMode(false);
                                setIsSupervisorMode(false);
                                setActiveTab('inicio');
                              } else {
                                handlePortalChange('cliente');
                              }
                            } else if (item.id === 'aliados') {
                              if (isLoggedIn && userRole === 'aliado') {
                                setIsPartnerMode(true);
                                setIsAdminMode(false);
                                setIsSupervisorMode(false);
                              } else {
                                handleLogout();
                                handlePortalChange('trabajador');
                              }
                            } else if (item.id === 'admin') {
                              if (isLoggedIn && (userRole === 'admin' || userRole === 'supervisor')) {
                                if (userRole === 'admin') {
                                  setIsAdminMode(true);
                                  setIsSupervisorMode(false);
                                } else {
                                  setIsSupervisorMode(true);
                                  setIsAdminMode(false);
                                }
                              } else {
                                handleLogout();
                                handlePortalChange('administracion');
                              }
                            } else if (item.id === 'ayuda') {
                              if (isLoggedIn) {
                                setIsPartnerMode(false);
                                setIsMerchantMode(false);
                                setIsAdminMode(false);
                                setIsSupervisorMode(false);
                                setActiveTab('ayuda');
                              } else {
                                alert("Para recibir soporte, por favor inicia sesión o regístrate en Movica.");
                              }
                            } else if (item.id === 'acerca') {
                              setShowAboutModal(true);
                            }
                          }}
                          className="w-full p-3 rounded-2xl flex items-start gap-3 hover:bg-surface-alt/50 transition-all text-left cursor-pointer"
                        >
                          <span className="text-xl mt-0.5">{item.icon}</span>
                          <div>
                            <span className="font-sora font-extrabold text-xs text-ink block leading-none">{item.label}</span>
                            <span className="text-[9px] text-ink-soft block mt-1 font-semibold">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Theme Toggle in Sidebar */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-surface-alt/50 transition-all text-left cursor-pointer border border-divider/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
                          <div>
                            <span className="font-sora font-extrabold text-xs text-ink block leading-none">
                              {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                            </span>
                            <span className="text-[9px] text-ink-soft block mt-1 font-semibold">Tocar para cambiar tema</span>
                          </div>
                        </div>
                        <div className={`w-8 h-5 rounded-full p-0.5 transition-colors ${isDarkMode ? 'bg-primary' : 'bg-divider/50'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${isDarkMode ? 'translate-x-3' : 'translate-x-0'}`} />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Footer block */}
                  <div className="pt-4 border-t border-divider/50 space-y-1">
                    <p className="text-[10px] font-black uppercase text-ink-faint tracking-wider">Movica OS v2.0</p>
                    <p className="text-[8px] text-ink-soft leading-tight">Plataforma integral de transporte y mensajería en Aguachica, Colombia.</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ACERCA DE MOVICA MODAL OVERLAY */}
          <AnimatePresence>
            {showAboutModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-white z-[60] flex flex-col p-6 text-left justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-divider/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">ℹ️</span>
                      <span className="font-sora font-black text-sm text-ink">Acerca de Movica</span>
                    </div>
                    <button
                      onClick={() => setShowAboutModal(false)}
                      className="w-8 h-8 rounded-lg bg-surface-alt hover:bg-divider/50 flex items-center justify-center text-ink cursor-pointer transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs text-ink-soft leading-relaxed">
                    <div className="flex flex-col items-center text-center space-y-2 py-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-3xl shadow-lg">
                        🛵
                      </div>
                      <div>
                        <h3 className="font-sora font-extrabold text-base text-ink">Movica Colombia</h3>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">Aguachica, Cesar</p>
                      </div>
                    </div>

                    <p>
                      <strong>Movica</strong> es la plataforma tecnológica líder en Aguachica y el sur del Cesar, diseñada para conectar a los habitantes con soluciones eficientes de movilidad y logística de extremo a extremo.
                    </p>
                    <p>
                      Nuestra misión es dignificar y organizar el mototaxismo local, facilitar los envíos de paquetes de forma confiable, realizar tus mandados cotidianos y potenciar el comercio local a través de nuestra red de aliados estratégicos.
                    </p>

                    <div className="bg-surface-alt p-3.5 rounded-2xl border border-divider/40 space-y-2">
                      <h4 className="font-sora font-bold text-ink text-xs">Información de la App</h4>
                      <div className="grid grid-cols-2 gap-y-1.5 font-medium text-[11px]">
                        <span className="text-ink-soft/80">Versión:</span>
                        <span className="text-ink font-bold text-right">2.1.0-Release</span>
                        <span className="text-ink-soft/80">Soporte Regional:</span>
                        <span className="text-ink font-bold text-right">Aguachica & Ocaña</span>
                        <span className="text-ink-soft/80">Servidor Core:</span>
                        <span className="text-ink font-bold text-right text-emerald-600 font-semibold">En línea (COP)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowAboutModal(false)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-3 rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-95 text-center"
                  >
                    Entendido
                  </button>
                  <p className="text-[9px] text-center text-ink-faint font-bold uppercase tracking-wider">© 2026 Movica Technologies SAS. Todos los derechos reservados.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoggedIn ? (
            isMerchantMode ? (
              <div className="flex-1 overflow-hidden relative flex flex-col h-full bg-[#F4F6F4]">
                <MerchantPanel 
                  onBackToClient={() => {
                    if (userRole === 'comercio') {
                      handleLogout();
                    } else {
                      setIsMerchantMode(false);
                    }
                  }}
                  userPhone={userProfile.phone}
                  userName={userProfile.name}
                  userEmail={userProfile.email}
                />
              </div>
            ) : isPartnerMode ? (
              <div className="flex-1 overflow-hidden relative flex flex-col h-full bg-bg transition-colors duration-300">
                {(() => {
                  const saved = localStorage.getItem('movica_ally_application');
                  const appStatus = saved ? JSON.parse(saved).status : null;
                  
                  if (appStatus === 'aprobado') {
                    return (
                      <div className="p-6 h-full flex flex-col overflow-hidden">
                        <PartnerPanel 
                          onBackToClient={() => {
                            if (userRole === 'aliado') {
                              handleLogout();
                            } else {
                              setIsPartnerMode(false);
                            }
                          }}
                          clientOrders={orders}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <AllyRegistrationFlow 
                        onClose={() => {
                          if (userRole === 'aliado') {
                            handleLogout();
                          } else {
                            setIsPartnerMode(false);
                          }
                        }}
                        userPhone={userProfile.phone}
                        userName={userProfile.name}
                        userEmail={userProfile.email}
                        onSuccess={() => {
                          setIsPartnerMode(true);
                        }}
                      />
                    );
                  }
                })()}
              </div>
            ) : (
              <>
                {/* Dynamic Screen Header Spacer */}
                <div className="h-4 flex-shrink-0 bg-bg transition-colors duration-300"></div>

                {/* Viewport Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-28 content-scrollbar relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="h-full"
                    >
                      {renderActiveTabContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Dynamic Service Form Sheet Overlay */}
                <AnimatePresence>
                  {activeServiceType && (
                    <motion.div
                      initial={{ opacity: 0, y: '100%' }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                      className="absolute inset-0 z-50"
                    >
                      <ServiceForm 
                        type={activeServiceType} 
                        onClose={() => setActiveServiceType(null)} 
                        onSubmit={handleBookingSubmit}
                        userProfile={userProfile}
                        favorites={favorites}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FLOATING MOVI ASSISTANT BUTTON */}
                <div className="absolute bottom-40 right-4 z-40">
                  <button
                    onClick={() => setIsMoviOpen(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-primary via-primary-dark to-[#0d1a16] text-white flex items-center justify-center shadow-lg shadow-primary/35 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-primary-surface relative"
                    title="Movi Assistant 🤖"
                  >
                    <Bot size={22} className="animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white flex items-center justify-center">
                      <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                    </span>
                  </button>
                </div>

                {/* MOVI ASSISTANT OVERLAY */}
                <AnimatePresence>
                  {isMoviOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: '100%' }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                      className="absolute inset-0 bg-bg z-50 flex flex-col"
                    >
                      <MoviAssistant 
                        userProfile={userProfile}
                        orders={orders}
                        onClose={() => setIsMoviOpen(false)}
                        onSelectService={(type) => handleSelectService(type)}
                        onNavigateToTab={(tab) => setActiveTab(tab)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FLOATING SECURITY BUTTON */}
                <div className="absolute bottom-24 right-4 z-40">
                  <button
                    onClick={() => setIsSecurityOpen(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/35 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-bounce"
                    title="Centro de Seguridad y SOS"
                  >
                    <Shield size={22} className="animate-pulse" />
                  </button>
                </div>

                {/* SECURITY CENTER OVERLAY */}
                <AnimatePresence>
                  {isSecurityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: '100%' }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                      className="absolute inset-0 bg-bg z-50 flex flex-col"
                    >
                      <SecurityCenter 
                        userProfile={userProfile}
                        onClose={() => setIsSecurityOpen(false)}
                        mode="cliente"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BOTTOM NAVIGATION BAR */}
                <div className="absolute bottom-5 left-4 right-4 h-[68px] bg-bg rounded-3xl shadow-[0_12px_28px_rgba(13,13,13,0.12)] border border-divider/40 flex items-center justify-around px-2 z-40 transition-colors duration-300">
                  {navItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setActiveServiceType(null); // auto-close booking sheets
                        }}
                        className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl relative transition-all duration-150 cursor-pointer"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="navGlow"
                            className="absolute inset-0 bg-primary-surface rounded-2xl -z-10"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className={`text-[20px] transition-transform ${isActive ? 'scale-110 -translate-y-0.5' : 'text-ink-faint'}`}>
                          {isActive ? item.activeIcon : item.icon}
                        </span>
                        <span className={`text-[9px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-primary' : 'text-ink-faint'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )
          ) : (
            /* ADVANCED DUAL-PANE AUTHENTICATION SCREEN */
            <div className="flex-1 bg-bg flex flex-col justify-between p-6 overflow-y-auto content-scrollbar relative transition-colors duration-300">
              <div className="space-y-6">
                {/* Brand Logo Header */}
                <div className="space-y-2 flex flex-col items-center text-center">
                  {activePortal !== 'administracion' ? (
                    <img src={movicaLogo} alt="Movica Logo" className="w-16 h-16 object-contain rounded-2xl shadow-sm border border-divider/10 bg-bg" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-2xl shadow-lg shadow-primary/20">
                      🔑
                    </div>
                  )}
                  <div>
                    <h2 className="font-sora font-extrabold text-xl text-ink tracking-tight">
                      {activePortal === 'cliente' ? 'Movica' : activePortal === 'trabajador' ? 'Movica Aliados' : 'Consola Administrativa'}
                    </h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {activePortal === 'cliente' ? 'Tu ciudad a un toque' : activePortal === 'trabajador' ? '¡Conduce, entrega y gana en Aguachica!' : 'Acceso restringido para personal autorizado'}
                    </p>
                  </div>
                </div>

                {/* Tab Switcher / Admin info */}
                {activePortal !== 'administracion' ? (
                  <div className="bg-surface-alt p-1 rounded-xl flex gap-1 border border-divider/40">
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        authMode === 'login'
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => setAuthMode('register')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        authMode === 'register'
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      Registrarse
                    </button>
                  </div>
                ) : (
                  <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 text-center">
                    <span className="font-sora font-extrabold text-xs text-primary-dark block">🔑 Acceso Administrativo Autorizado</span>
                    <p className="text-[10px] text-ink-soft mt-0.5 font-medium">Solo personal registrado puede ingresar al Backoffice.</p>
                  </div>
                )}

                {/* Sub-role Toggle for Admin Portal */}
                {activePortal === 'administracion' && (
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[9px] font-black text-ink-soft uppercase tracking-wider">Rol de Operación</label>
                    <div className="grid grid-cols-2 gap-1 bg-surface-alt p-1 rounded-xl border border-divider/40">
                      {[
                        { id: 'admin', label: 'Administrador Principal', icon: '💼' },
                        { id: 'supervisor', label: 'Supervisor de Zona', icon: '🛡️' }
                      ].map(role => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setUserRole(role.id as any)}
                          className={`py-2 rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            userRole === role.id
                              ? 'bg-white text-ink shadow-xs border border-divider/30 font-black'
                              : 'text-ink-soft hover:text-ink'
                          }`}
                        >
                          <span>{role.icon}</span>
                          <span>{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {authMode === 'login' ? (
                    <motion.form
                      key="loginForm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={handleLoginSubmit}
                      className="space-y-4 text-left"
                    >
                      <div>
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Número de Teléfono</label>
                        <div className="flex gap-2">
                          <span className="bg-surface-alt border border-divider/60 text-xs font-bold rounded-xl px-3 py-3 flex items-center justify-center text-ink-soft">
                            +57
                          </span>
                          <input 
                            type="tel" 
                            required
                            value={loginPhone}
                            onChange={e => setLoginPhone(e.target.value)}
                            placeholder="312 456 7890"
                            className="w-full flex-1 bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">PIN de Acceso (4 dígitos)</label>
                        <input 
                          type="password" 
                          maxLength={4}
                          value={loginPin}
                          onChange={e => setLoginPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold text-center tracking-widest focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 mt-2"
                      >
                        Ingresar a Mi Cuenta <ArrowRight size={14} />
                      </button>


                    </motion.form>
                  ) : (
                    <motion.form
                      key="registerForm"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={handleRegisterSubmit}
                      className="space-y-3.5 text-left"
                    >
                      <div>
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          required
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          placeholder="Ej: Ferney Gómez"
                          className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Número de Teléfono</label>
                        <div className="flex gap-2">
                          <span className="bg-surface-alt border border-divider/60 text-xs font-bold rounded-xl px-3 py-3 flex items-center justify-center text-ink-soft">
                            +57
                          </span>
                          <input 
                            type="tel" 
                            required
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            placeholder="312 456 7890"
                            className="w-full flex-1 bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Correo Electrónico (Opcional)</label>
                        <input 
                          type="email" 
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className="w-full bg-surface-alt border border-divider/40 rounded-xl px-4 py-3 text-xs font-semibold focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Ciudad</label>
                          <select 
                            value={regCity}
                            onChange={e => setRegCity(e.target.value)}
                            className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-3 text-xs font-semibold text-ink focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none appearance-none"
                          >
                            <option value="Aguachica">Aguachica</option>
                            <option value="Ocaña">Ocaña</option>
                            <option value="Bucaramanga">Bucaramanga</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider mb-1">Código Promocional</label>
                          <input 
                            type="text" 
                            value={regReferral}
                            onChange={e => setRegReferral(e.target.value.toUpperCase())}
                            placeholder="Ej. MOVICA"
                            className="w-full bg-surface-alt border border-divider/40 rounded-xl px-3 py-3 text-xs font-bold text-primary-dark focus:ring-1 focus:ring-primary focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <input 
                          type="checkbox" 
                          id="terms"
                          checked={regTerms}
                          onChange={e => setRegTerms(e.target.checked)}
                          className="w-4 h-4 text-primary bg-surface-alt border-divider rounded focus:ring-primary accent-primary mt-0.5 cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-[9px] text-ink-soft font-semibold leading-relaxed cursor-pointer select-none">
                          Acepto los <span className="text-primary font-bold hover:underline">Términos de Servicio</span> y políticas de tratamiento de datos personales de Movica.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={!regTerms || !regName.trim() || !regPhone.trim()}
                        className={`w-full font-sora py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 mt-2 ${
                          regTerms && regName.trim() && regPhone.trim()
                            ? 'bg-primary hover:bg-primary-dark text-white cursor-pointer active:scale-95'
                            : 'bg-ink-faint text-white cursor-not-allowed shadow-none'
                        }`}
                      >
                        Crear Cuenta y Comenzar <ArrowRight size={14} />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Secure badge disclaimer */}
              <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-divider/40 mt-6">
                <span className="text-xs">🛡️</span>
                <p className="text-[9px] text-ink-soft font-bold uppercase tracking-wider">Cifrado de seguridad de extremo a extremo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
