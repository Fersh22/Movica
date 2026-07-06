import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, HelpCircle, ArrowRight, 
  MapPin, Gift, Bell, Compass, Bike, Check, Star, Shield, Info, ExternalLink
} from 'lucide-react';
import { UserProfile, ServiceType, Order } from '../types';

interface MoviAssistantProps {
  userProfile: UserProfile;
  orders: Order[];
  onClose: () => void;
  onSelectService: (type: ServiceType) => void;
  onNavigateToTab: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'movi' | 'user';
  text: string;
  timestamp: string;
  actions?: { label: string; action: () => void }[];
}

export default function MoviAssistant({ 
  userProfile, 
  orders, 
  onClose, 
  onSelectService, 
  onNavigateToTab 
}: MoviAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentServiceSimulation, setCurrentServiceSimulation] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    const firstName = userProfile.name.split(' ')[0] || 'Ferney';
    setMessages([
      {
        id: 'welcome',
        sender: 'movi',
        text: `🤖 ¡Hola, ${firstName}! Soy Movi, tu asistente inteligente de Movica. Estoy aquí para guiarte, responder tus dudas o ayudarte a pedir tus servicios en Aguachica. ¿En qué te puedo colaborar hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [userProfile]);

  // Simulate active order updates if any order exists
  const activeOrder = orders.find(o => o.status === 'solicitado' || o.status === 'asignado' || o.status === 'en_camino');

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      setIsTyping(false);
      const query = textToSend.toLowerCase();
      let reply = '';
      let actions: { label: string; action: () => void }[] | undefined = undefined;

      if (query.includes('cancelar') || query.includes('cancelo')) {
        reply = '❌ Para cancelar un servicio: ve a la pestaña "Historial" 📜 en el menú inferior, selecciona tu orden activa y presiona "Cancelar Servicio". Es gratuito antes de que llegue el conductor.';
        actions = [{ label: 'Ir al Historial 📜', action: () => { onClose(); onNavigateToTab('historial'); } }];
      } else if (query.includes('dirección') || query.includes('direccion') || query.includes('cambiar ubicacion') || query.includes('cambiar dirección')) {
        reply = '📍 Puedes gestionar tus direcciones en tu Perfil 👤 > "Direcciones Guardadas". Ahí puedes registrar tu casa, trabajo o universidad para pedirlas más rápido.';
        actions = [{ label: 'Ir a Direcciones 👤', action: () => { onClose(); onNavigateToTab('perfil'); } }];
      } else if (query.includes('contacto') || query.includes('aliado') || query.includes('conductor') || query.includes('hablar con él')) {
        reply = '📞 Una vez que un aliado conductor acepta tu servicio, verás un panel en el mapa con botones de chat directo y llamada telefónica para coordinar la recogida.';
      } else if (query.includes('califico') || query.includes('calificar') || query.includes('estrellas')) {
        reply = '⭐ Al finalizar tu servicio, se abrirá de inmediato la pantalla para calificar a tu aliado conductor de 1 a 5 estrellas y dejar un comentario sobre tu experiencia.';
      } else if (query.includes('tarifa') || query.includes('precio') || query.includes('cuanto cuesta') || query.includes('costo')) {
        reply = '💰 En Movica calculamos el valor exacto del servicio antes de que confirmes. La tarifa base de mototaxi en Aguachica es de $2.500 COP.';
        actions = [{ label: 'Pedir Mototaxi 🛵', action: () => { onClose(); onSelectService('mototaxi'); } }];
      } else if (query.includes('domicilio') || query.includes('comida') || query.includes('restaurante') || query.includes('hamburguesa')) {
        reply = '🍔 ¡Puedes pedir comida deliciosa de los mejores restaurantes locales! Tenemos promociones exclusivas en la pestaña de Comercios hoy.';
        actions = [{ label: 'Pedir Domicilio 🍔', action: () => { onClose(); onSelectService('domicilio'); } }];
      } else if (query.includes('encomienda') || query.includes('paquete') || query.includes('enviar')) {
        reply = '📦 Nuestro servicio de Encomienda te permite enviar sobres, llaves o paquetes de forma segura en Aguachica con un socio conductor certificado.';
        actions = [{ label: 'Enviar Encomienda 📦', action: () => { onClose(); onSelectService('encomienda'); } }];
      } else if (query.includes('seguridad') || query.includes('sos') || query.includes('peligro') || query.includes('emergencia')) {
        reply = '🚨 ¡Tu seguridad es primordial! Cuentas con un botón flotante de Escudo Rojo (SOS) disponible en todo momento para alertar a la central y compartir tu ubicación en tiempo real.';
      } else if (query.includes('logros') || query.includes('puntos') || query.includes('insignia') || query.includes('recompensa')) {
        reply = '🏅 ¡Tenemos un Sistema de Logros! Acumulas puntos estrella ⭐ con cada servicio solicitado, subes de nivel y los canjeas por cupones de descuento gratis.';
        actions = [{ label: 'Ver mis Logros 🏅', action: () => { onClose(); onNavigateToTab('perfil'); } }];
      } else if (query.includes('hola') || query.includes('buenos dias') || query.includes('buenas tardes') || query.includes('que tal')) {
        reply = `👋 ¡Hola de nuevo! Qué gran gusto saludarte. Soy Movi, tu asistente. ¿Quieres pedir algún servicio o tienes alguna duda específica hoy en Aguachica?`;
      } else {
        reply = '🤖 Entendido. Como tu asistente virtual Movi, te sugiero utilizar alguna de las acciones rápidas del panel superior o seleccionar una de nuestras preguntas sugeridas para ayudarte de forma más precisa.';
      }

      setMessages(prev => [...prev, {
        id: `movi-${Date.now()}`,
        sender: 'movi',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      }]);
    }, 1000);
  };

  const handleQuickAction = (type: ServiceType | 'historial' | 'soporte') => {
    if (type === 'historial') {
      onClose();
      onNavigateToTab('historial');
    } else if (type === 'soporte') {
      onClose();
      onNavigateToTab('ayuda');
    } else {
      onClose();
      onSelectService(type);
    }
  };

  const handleSuggestionClick = (text: string, actionUrl?: string) => {
    if (actionUrl === 'perfil') {
      onClose();
      onNavigateToTab('perfil');
      alert('Te hemos llevado a tu Perfil. Entra a "Logros, Niveles e Insignias 🏅" o "Cupones y Promociones" para canjear tu cupón disponible.');
    } else if (actionUrl === 'domicilio') {
      onClose();
      onSelectService('domicilio');
    } else {
      handleSendMessage(text);
    }
  };

  const startServiceSimulation = (step: 'camino' | 'minutos' | 'termino' | 'calificar') => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let text = '';
      if (step === 'camino') {
        text = '🛵 **Tu aliado está en camino**: He verificado los sistemas de Movica y tu socio conductor ya ha iniciado su trayecto hacia tu dirección de recogida.';
      } else if (step === 'minutos') {
        text = '📍 **Está a pocos minutos**: El satélite reporta que el aliado se encuentra a menos de 2 minutos de distancia. Prepárate para abordar.';
      } else if (step === 'termino') {
        text = '✅ **El servicio terminó**: ¡Has llegado sano y salvo a tu destino! El viaje se ha completado satisfactoriamente en nuestro sistema.';
      } else if (step === 'calificar') {
        text = '⭐ **No olvides calificar**: Tu conductor espera tu calificación. Por favor, califícalo en la pantalla del servicio para mantener la calidad de la comunidad.';
      }

      setMessages(prev => [...prev, {
        id: `sim-${Date.now()}`,
        sender: 'movi',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#fafbfc]">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-4 flex items-center justify-between text-white shadow-md rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
            🤖
          </div>
          <div className="text-left">
            <h3 className="font-sora font-black text-sm tracking-tight flex items-center gap-1.5">
              Movi Assistant <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Asistente Inteligente Movica</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* BODY CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 content-scrollbar">
        
        {/* QUICK ACTIONS ROW */}
        <div className="space-y-2">
          <span className="text-[9.5px] font-black uppercase text-ink-soft tracking-wider block text-left">
            Acciones Rápidas
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1.5 snap-x content-scrollbar">
            {[
              { label: 'Pedir Mototaxi 🛵', action: () => handleQuickAction('mototaxi') },
              { label: 'Pedir Domicilio 🍔', action: () => handleQuickAction('domicilio') },
              { label: 'Enviar Encomienda 📦', action: () => handleQuickAction('encomienda') },
              { label: 'Hacer Mandado 📋', action: () => handleQuickAction('mandado') },
              { label: 'Comprar Producto 🛒', action: () => handleQuickAction('compra') },
              { label: 'Ver Historial 📜', action: () => handleQuickAction('historial') },
              { label: 'Contactar Soporte 💬', action: () => handleQuickAction('soporte') },
            ].map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={act.action}
                className="snap-center bg-white border border-divider/60 hover:border-primary/40 hover:bg-primary-surface/10 px-3.5 py-2 rounded-xl text-[11px] font-extrabold text-ink shadow-2xs hover:shadow-xs transition-all flex-shrink-0 cursor-pointer"
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* RECOMMENDATIONS & SUGGESTIONS */}
        <div className="space-y-2 text-left">
          <span className="text-[9.5px] font-black uppercase text-ink-soft tracking-wider block">
            Recomendaciones para ti
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div 
              onClick={() => handleSuggestionClick('¿Qué cupones tengo disponibles?', 'perfil')}
              className="p-3 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/70 rounded-2xl cursor-pointer transition-all flex items-center gap-2.5"
            >
              <span className="text-xl">🎟️</span>
              <div className="min-w-0">
                <span className="text-[10.5px] font-extrabold text-rose-800 block leading-tight">Tienes un cupón disponible</span>
                <span className="text-[9px] text-rose-600 block font-semibold mt-0.5">Úsalo en tu siguiente viaje 🎁</span>
              </div>
            </div>

            <div 
              onClick={() => handleSuggestionClick('¿Hay aliados cerca de mi ubicación?')}
              className="p-3 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/70 rounded-2xl cursor-pointer transition-all flex items-center gap-2.5"
            >
              <span className="text-xl">📍</span>
              <div className="min-w-0">
                <span className="text-[10.5px] font-extrabold text-emerald-800 block leading-tight">Hay muchos aliados cerca</span>
                <span className="text-[9px] text-emerald-600 block font-semibold mt-0.5">Conductor disponible en 2 min</span>
              </div>
            </div>

            <div 
              onClick={() => handleSuggestionClick('¿Cuál fue mi último destino solicitado?')}
              className="p-3 bg-amber-50/50 hover:bg-amber-50 border border-amber-100/70 rounded-2xl cursor-pointer transition-all flex items-center gap-2.5"
            >
              <span className="text-xl">🏠</span>
              <div className="min-w-0">
                <span className="text-[10.5px] font-extrabold text-amber-800 block leading-tight">Tu último destino fue...</span>
                <span className="text-[9px] text-amber-600 block font-semibold mt-0.5">Calle 5 # 10-22, Aguachica</span>
              </div>
            </div>

            <div 
              onClick={() => handleSuggestionClick('¿Qué promociones hay hoy?', 'domicilio')}
              className="p-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/70 rounded-2xl cursor-pointer transition-all flex items-center gap-2.5"
            >
              <span className="text-xl">🍔</span>
              <div className="min-w-0">
                <span className="text-[10.5px] font-extrabold text-indigo-800 block leading-tight">Hoy hay promo en Domicilios</span>
                <span className="text-[9px] text-indigo-600 block font-semibold mt-0.5">Envíos gratis en hamburguesas</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE SERVICE SIMULATOR BUTTONS (During Service Updates) */}
        <div className="bg-white border border-divider/50 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-ink">
            <Compass size={14} className="text-primary animate-spin" />
            <span>Simulador de Estado de Servicio (Movi)</span>
          </div>
          <p className="text-[9.5px] text-ink-soft leading-normal">Prueba los flujos del asistente simulando las diferentes etapas de un servicio en camino en Aguachica:</p>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => startServiceSimulation('camino')}
              className="p-2 bg-surface-alt hover:bg-primary-surface border border-divider/40 hover:border-primary/30 text-[10px] font-bold rounded-xl text-ink transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              🛵 Aliado en Camino
            </button>
            <button 
              onClick={() => startServiceSimulation('minutos')}
              className="p-2 bg-surface-alt hover:bg-primary-surface border border-divider/40 hover:border-primary/30 text-[10px] font-bold rounded-xl text-ink transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              📍 A pocos minutos
            </button>
            <button 
              onClick={() => startServiceSimulation('termino')}
              className="p-2 bg-surface-alt hover:bg-primary-surface border border-divider/40 hover:border-primary/30 text-[10px] font-bold rounded-xl text-ink transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              ✅ Servicio Terminado
            </button>
            <button 
              onClick={() => startServiceSimulation('calificar')}
              className="p-2 bg-surface-alt hover:bg-primary-surface border border-divider/40 hover:border-primary/30 text-[10px] font-bold rounded-xl text-ink transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              ⭐ Pedir Calificación
            </button>
          </div>
        </div>

        {/* SUGGESTED FAQS / HELP */}
        <div className="space-y-2 text-left">
          <span className="text-[9.5px] font-black uppercase text-ink-soft tracking-wider block">
            Preguntas Frecuentes
          </span>
          <div className="flex flex-col gap-2">
            {[
              '¿Cómo cancelo un servicio?',
              '¿Cómo cambio mi dirección?',
              '¿Cómo contacto a un aliado?',
              '¿Cómo califico un servicio?',
            ].map((faq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(faq)}
                className="w-full text-left bg-white border border-divider/50 hover:bg-surface-alt p-3 rounded-2xl text-[11px] font-semibold text-ink flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={14} className="text-primary flex-shrink-0" />
                  {faq}
                </span>
                <ArrowRight size={12} className="text-ink-soft flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* CONVERSATION MESSAGES LIST */}
        <div className="space-y-3 border-t border-divider/40 pt-4 text-left">
          <span className="text-[9.5px] font-black uppercase text-ink-soft tracking-wider block">
            Conversación con Movi
          </span>
          
          <div className="space-y-3">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white font-semibold rounded-br-none' 
                      : 'bg-white border border-divider text-ink font-medium rounded-bl-none'
                  }`}
                >
                  {/* Handle markdown bold markers */}
                  {msg.text.split('**').map((part, idx) => 
                    idx % 2 === 1 ? <strong key={idx} className="font-bold">{part}</strong> : part
                  )}
                </div>

                <span className="text-[9px] text-ink-faint mt-1 font-bold">
                  {msg.timestamp}
                </span>

                {/* Subactions attached to the message */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {msg.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={act.action}
                        className="bg-primary-surface text-primary border border-primary/20 hover:bg-primary hover:text-white px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        {act.label} <ExternalLink size={10} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="bg-white border border-divider text-ink p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-ink-soft rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-ink-soft rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-ink-soft rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

      </div>

      {/* FOOTER CHAT INPUT */}
      <div className="p-4 bg-white border-t border-divider/40 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Escribe tu duda o pregunta a Movi..."
          className="flex-1 bg-surface-alt border border-divider/40 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => handleSendMessage(inputText)}
          className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer flex-shrink-0"
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  );
}
