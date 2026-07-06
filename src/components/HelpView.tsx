import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, ChevronDown, MessageSquare, Send, X, 
  ShieldAlert, PhoneCall, ArrowLeft, Upload, Check, 
  FileText, Calendar, Clock, AlertTriangle, User, 
  Store, Bike, DollarSign, Search, PlusCircle, Sparkles
} from 'lucide-react';
import { FAQS } from '../data';
import ChatSystem from './ChatSystem';

export interface SupportCase {
  id: string;
  type: 'aliado' | 'cliente' | 'comercio' | 'cobro' | 'objeto_perdido' | 'error_app';
  typeName: string;
  description: string;
  attachedImage?: string;
  statusKey: 'revision' | 'resuelto' | 'cerrado';
  date: string;
  messages: {
    id: string;
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }[];
}

const DEFAULT_SUPPORT_CASES: SupportCase[] = [
  {
    id: "CASO-8021",
    type: "cobro",
    typeName: "Cobros incorrectos",
    description: "El conductor me cobró $2,000 COP adicionales sobre el valor estimado en la app para la encomienda.",
    attachedImage: "recibo_pago.jpg",
    statusKey: "resuelto",
    date: "02 Jul 2026, 09:15 AM",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "El conductor me cobró $2,000 COP adicionales sobre el valor estimado en la app para la encomienda.",
        timestamp: "02 Jul 2026, 09:15 AM"
      },
      {
        id: "m2",
        sender: "support",
        text: "Hola. Lamentamos este inconveniente. Hemos verificado con el conductor y efectivamente aplicó un recargo inválido. Ya reembolsamos los $2,000 COP a tu monedero Movica y aplicamos un llamado de atención en su perfil. ¡Gracias por reportarlo!",
        timestamp: "02 Jul 2026, 09:45 AM"
      }
    ]
  },
  {
    id: "CASO-8022",
    type: "objeto_perdido",
    typeName: "Objetos perdidos",
    description: "Olvidé un paraguas de color azul con mango de madera en el mototaxi que tomé ayer en la tarde.",
    attachedImage: "paraguas_azul.jpg",
    statusKey: "revision",
    date: "03 Jul 2026, 04:30 PM",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Olvidé un paraguas de color azul con mango de madera en el mototaxi que tomé ayer en la tarde.",
        timestamp: "03 Jul 2026, 04:30 PM"
      },
      {
        id: "m2",
        sender: "support",
        text: "Hola. Hemos contactado al aliado conductor de tu viaje. Él confirma que encontró el paraguas en la parrilla trasera. ¿Deseas que te lo acerquemos hoy o prefieres pasar por las oficinas centrales?",
        timestamp: "03 Jul 2026, 05:00 PM"
      }
    ]
  }
];

export default function HelpView() {
  const [activeScreen, setActiveScreen] = useState<'main' | 'faqs' | 'report' | 'chat' | 'history' | 'service_chat'>('main');
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  
  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');

  // Report Form state
  const [reportType, setReportType] = useState<'aliado' | 'cliente' | 'comercio' | 'cobro' | 'objeto_perdido' | 'error_app'>('aliado');
  const [reportDesc, setReportDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Chat simulator state
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load cases from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('movica_support_cases');
    if (saved) {
      setCases(JSON.parse(saved));
    } else {
      localStorage.setItem('movica_support_cases', JSON.stringify(DEFAULT_SUPPORT_CASES));
      setCases(DEFAULT_SUPPORT_CASES);
    }
  }, []);

  const saveCases = (updatedCases: SupportCase[]) => {
    setCases(updatedCases);
    localStorage.setItem('movica_support_cases', JSON.stringify(updatedCases));
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCase?.messages, isTyping, activeScreen]);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    const typesMap = {
      aliado: "Problemas con un aliado",
      cliente: "Problemas con un cliente",
      comercio: "Problemas con un comercio",
      cobro: "Cobros incorrectos",
      objeto_perdido: "Objetos perdidos",
      error_app: "Errores de la aplicación"
    };

    const newCase: SupportCase = {
      id: `CASO-${Math.floor(1000 + Math.random() * 9000)}`,
      type: reportType,
      typeName: typesMap[reportType],
      description: reportDesc,
      attachedImage: attachedImage || undefined,
      statusKey: 'revision',
      date: new Date().toLocaleString('es-CO', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'user',
          text: reportDesc + (attachedImage ? `\n[Imagen adjunta: ${attachedImage}]` : ''),
          timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
        }
      ]
    };

    const updated = [newCase, ...cases];
    saveCases(updated);
    setSubmitSuccess(true);
    setReportDesc('');
    setAttachedImage(null);

    // Auto-reply simulation for new case
    setTimeout(() => {
      const updatedLatest = JSON.parse(localStorage.getItem('movica_support_cases') || '[]');
      const targetCase = updatedLatest.find((c: SupportCase) => c.id === newCase.id);
      if (targetCase) {
        const supportMsg = {
          id: `msg-${Date.now()}-2`,
          sender: 'support' as const,
          text: `¡Hola! Hemos registrado tu solicitud bajo el número ${newCase.id}. Un asesor de soporte técnico de Movica está revisando tu caso. Te daremos una respuesta oficial en este chat en breve.`,
          timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        targetCase.messages.push(supportMsg);
        const finalCases = updatedLatest.map((c: SupportCase) => c.id === newCase.id ? targetCase : c);
        saveCases(finalCases);
      }
    }, 2500);
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const mockFiles = ['evidencia_captura_1.png', 'captura_tarifa_final.jpg', 'foto_objeto_olvidado.png', 'comprobante_pago_movica.jpg'];
      const chosen = mockFiles[Math.floor(Math.random() * mockFiles.length)];
      setAttachedImage(chosen);
    }, 1200);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedCase) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    const updatedCase = {
      ...selectedCase,
      messages: [...selectedCase.messages, userMsg]
    };

    setSelectedCase(updatedCase);
    const updatedAll = cases.map(c => c.id === selectedCase.id ? updatedCase : c);
    saveCases(updatedAll);
    setInputMessage('');
    setIsTyping(true);

    // Simulate smart support replies
    setTimeout(() => {
      let replyText = "Entiendo perfectamente tu inconveniente. Estamos validando esta información directamente en nuestra central operativa de Aguachica.";
      const textLower = userMsg.text.toLowerCase();

      if (textLower.includes('cobro') || textLower.includes('tarifa') || textLower.includes('dinero') || textLower.includes('plata')) {
        replyText = "Hemos escalado la consulta de cobro con nuestro equipo de tarifas. Si el recargo es injustificado, generaremos un saldo a tu favor de manera inmediata.";
      } else if (textLower.includes('llave') || textLower.includes('olvide') || textLower.includes('paraguas') || textLower.includes('maleta') || textLower.includes('perdi')) {
        replyText = "Entendido. Nos comunicaremos directamente con el aliado asignado para programar la devolución segura de tus pertenencias. Te mantendremos informado.";
      } else if (textLower.includes('hola') || textLower.includes('buen') || textLower.includes('tarde') || textLower.includes('dia')) {
        replyText = "¡Hola! Gracias por comunicarte. Estamos listos para ayudarte con el caso. ¿Tienes algún dato o evidencia adicional que desees compartir?";
      }

      const supportReply = {
        id: `msg-rep-${Date.now()}`,
        sender: 'support' as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
      };

      const finalCase = {
        ...updatedCase,
        messages: [...updatedCase.messages, supportReply]
      };

      setSelectedCase(finalCase);
      const finalAll = cases.map(c => c.id === selectedCase.id ? finalCase : c);
      saveCases(finalAll);
      setIsTyping(false);
    }, 2000);
  };

  // Filter FAQs
  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="w-full h-full min-h-[500px] relative pb-8 text-left">
      
      {/* SCREEN: MAIN MENU */}
      {activeScreen === 'main' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="font-sora font-extrabold text-xl text-ink">Centro de Soporte Movica</h2>
            <p className="text-xs text-ink-soft mt-0.5">Estamos aquí para ayudarte. Selecciona una opción para continuar.</p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Chat en Vivo - MÓDULO 30 */}
            <button
              onClick={() => setActiveScreen('service_chat')}
              className="p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/35 hover:border-primary hover:bg-primary-surface flex flex-col text-left gap-3.5 shadow-sm transition-all cursor-pointer group col-span-1 sm:col-span-2 relative overflow-hidden"
            >
              <div className="absolute right-4 top-4 bg-primary text-white text-[8px] font-black px-2 py-0.75 rounded-full uppercase tracking-wider animate-pulse">
                Nuevo Módulo 30
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                💬
              </div>
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-[13.5px] text-ink flex items-center gap-1.5">
                  Chat de Servicio en Vivo <span className="text-xs">⚡</span>
                </h4>
                <p className="text-[11px] text-ink-soft leading-relaxed font-semibold">
                  Interactúa en tiempo real con tu conductor asignado (Ferney) o con el restaurante (El Gran Sabor). Prueba las respuestas automáticas, llamadas de voz y el envío de fotos, comprobantes y mapas.
                </p>
              </div>
            </button>

            {/* Preguntas frecuentes */}
            <button
              onClick={() => {
                setActiveScreen('faqs');
                setExpandedFaq(null);
                setFaqSearch('');
              }}
              className="p-5 rounded-3xl bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/10 flex flex-col text-left gap-3.5 shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#EBF3FF] text-[#0066FF] flex items-center justify-center text-xl shadow-xs">
                ❓
              </div>
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-[13px] text-ink flex items-center gap-1">
                  Preguntas frecuentes 
                </h4>
                <p className="text-[10.5px] text-ink-soft leading-relaxed">
                  Consulta respuestas rápidas sobre tarifas, mototaxis, envíos y comercios aliados.
                </p>
              </div>
            </button>

            {/* Reportar un problema */}
            <button
              onClick={() => {
                setActiveScreen('report');
                setSubmitSuccess(false);
                setReportDesc('');
                setAttachedImage(null);
              }}
              className="p-5 rounded-3xl bg-white border border-divider/50 hover:border-red-300 hover:bg-red-50/10 flex flex-col text-left gap-3.5 shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-xl shadow-xs">
                🚨
              </div>
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-[13px] text-ink">Reportar un problema</h4>
                <p className="text-[10.5px] text-ink-soft leading-relaxed">
                  Informa sobre cobros incorrectos, objetos perdidos, problemas de app o con conductores.
                </p>
              </div>
            </button>

            {/* Contactar soporte */}
            <button
              onClick={() => {
                // If there are cases, open history to let them select one or chat, or open the latest
                if (cases.length > 0) {
                  setSelectedCase(cases[0]);
                  setActiveScreen('chat');
                } else {
                  // create a dummy General Case
                  setActiveScreen('report');
                }
              }}
              className="p-5 rounded-3xl bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/10 flex flex-col text-left gap-3.5 shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary-surface text-primary flex items-center justify-center text-xl shadow-xs">
                💬
              </div>
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-[13px] text-ink">Chatear con Soporte</h4>
                <p className="text-[10.5px] text-ink-soft leading-relaxed">
                  Habla directamente con nuestro personal operativo en Aguachica.
                </p>
              </div>
            </button>

            {/* Historial de solicitudes */}
            <button
              onClick={() => setActiveScreen('history')}
              className="p-5 rounded-3xl bg-white border border-divider/50 hover:border-primary/20 hover:bg-surface-alt/10 flex flex-col text-left gap-3.5 shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl shadow-xs">
                📄
              </div>
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-[13px] text-ink flex items-center justify-between">
                  <span>Historial de solicitudes</span>
                  {cases.filter(c => c.statusKey === 'revision').length > 0 && (
                    <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                      {cases.filter(c => c.statusKey === 'revision').length} Activo
                    </span>
                  )}
                </h4>
                <p className="text-[10.5px] text-ink-soft leading-relaxed">
                  Sigue el estado de tus reclamos pasados y actuales y lee las respuestas oficiales.
                </p>
              </div>
            </button>

          </div>

          {/* Quick Line Alert banner */}
          <div className="bg-[#0D1A16] p-4.5 rounded-3xl text-white shadow-sm flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[8px] bg-primary text-white font-black uppercase px-2 py-0.5 rounded-full">
                Línea Directa de Emergencia
              </span>
              <h4 className="font-sora font-extrabold text-[12.5px] text-white">¿Sufriste un accidente o emergencia?</h4>
              <p className="text-[10.5px] text-white/70 leading-relaxed font-semibold">Llámanos inmediatamente para coordinar asistencia vial con las autoridades locales.</p>
            </div>
            <a 
              href="tel:+573001234567"
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg flex-shrink-0 transition-all active:scale-95 cursor-pointer"
            >
              📞
            </a>
          </div>
        </div>
      )}

      {/* SCREEN: FAQS ACCORDION */}
      {activeScreen === 'faqs' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveScreen('main')}
              className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h3 className="font-sora font-extrabold text-base text-ink">Preguntas Frecuentes</h3>
              <p className="text-[10px] text-ink-soft">Resuelve tus dudas sobre el ecosistema Movica.</p>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input 
              type="text"
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full bg-white border border-divider/60 rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
            />
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center bg-white border border-divider/40 rounded-3xl text-ink-soft text-xs italic">
                No encontramos resultados para tu búsqueda. Intenta con otra palabra.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="bg-white border border-divider/40 rounded-2xl overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left font-bold text-[12.5px] text-ink cursor-pointer hover:bg-surface-alt/10 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <HelpCircle size={15} className="text-primary flex-shrink-0" />
                        <span>{faq.q}</span>
                      </div>
                      <ChevronDown 
                        size={14} 
                        className={`text-ink-soft transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180 text-primary' : ''}`} 
                      />
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-[11.5px] text-ink-soft leading-relaxed border-t border-divider/20 bg-surface-alt/5 animate-fadeIn font-semibold">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SCREEN: REPORT A PROBLEM FORM */}
      {activeScreen === 'report' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveScreen('main')}
              className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h3 className="font-sora font-extrabold text-base text-ink">Reportar un problema</h3>
              <p className="text-[10px] text-ink-soft">Informa y adjunta pruebas. Resolveremos en menos de 24 horas.</p>
            </div>
          </div>

          {submitSuccess ? (
            <div className="bg-white border border-divider/60 rounded-3xl p-6 text-center space-y-4 shadow-sm">
              <span className="text-5xl block animate-bounce">🎉</span>
              <div className="space-y-1">
                <h4 className="font-sora font-extrabold text-sm text-ink">¡Reporte Enviado con Éxito!</h4>
                <p className="text-[11px] text-ink-soft leading-relaxed font-semibold max-w-xs mx-auto">
                  Hemos registrado tu ticket de soporte técnico. Puedes realizar su seguimiento e interactuar con el equipo de soporte desde el chat en tu Historial.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto pt-2">
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setActiveScreen('main');
                  }}
                  className="bg-surface-alt hover:bg-divider text-ink py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Ir al Inicio
                </button>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setActiveScreen('history');
                  }}
                  className="bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer text-center"
                >
                  Ver Historial
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateReport} className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
              
              {/* Type selector */}
              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
                  ¿Sobre qué es el reporte?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'aliado', label: 'Aliado Conductor', icon: <Bike size={14} /> },
                    { id: 'cliente', label: 'Cliente Pasajero', icon: <User size={14} /> },
                    { id: 'comercio', label: 'Local o Comercio', icon: <Store size={14} /> },
                    { id: 'cobro', label: 'Cobro Incorrecto', icon: <DollarSign size={14} /> },
                    { id: 'objeto_perdido', label: 'Objeto Perdido', icon: <AlertTriangle size={14} /> },
                    { id: 'error_app', label: 'Fallo de la App', icon: <Sparkles size={14} /> }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReportType(opt.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        reportType === opt.id 
                          ? 'border-primary bg-primary-surface text-primary shadow-xs' 
                          : 'border-divider/50 hover:bg-surface-alt/10 text-ink-soft'
                      }`}
                    >
                      <span className={`${reportType === opt.id ? 'text-primary' : 'text-ink-faint'}`}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description field */}
              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
                  Describe el problema en detalle
                </label>
                <textarea
                  required
                  rows={4}
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  placeholder="Por favor sé detallado. Agrega ID de viajes, horas, montos o nombres si los tienes..."
                  className="w-full bg-surface-alt border border-divider/40 rounded-2xl p-4 text-xs font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-ink placeholder:text-ink-faint/80"
                />
              </div>

              {/* Simulated drag & drop / click upload component */}
              <div>
                <label className="block text-[9.5px] font-bold text-ink-soft uppercase tracking-wider mb-2">
                  Adjuntar captura o foto (Simulado)
                </label>

                <div 
                  onClick={handleSimulateUpload}
                  className="w-full border-2 border-dashed border-divider hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface-alt/10 hover:bg-primary-surface/10"
                >
                  {isUploading ? (
                    <div className="space-y-2">
                      <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block"></span>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Subiendo evidencia...</p>
                    </div>
                  ) : attachedImage ? (
                    <div className="space-y-1.5">
                      <div className="w-9 h-9 rounded-full bg-[#E6F7EC] text-[#0EA65C] flex items-center justify-center mx-auto text-lg">
                        <Check size={16} />
                      </div>
                      <p className="text-xs text-ink font-bold font-mono">{attachedImage}</p>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAttachedImage(null);
                        }}
                        className="text-[10px] text-red-500 font-bold underline cursor-pointer"
                      >
                        Eliminar archivo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload size={22} className="text-ink-faint mx-auto mb-1" />
                      <p className="text-xs text-ink font-bold">Haz clic o arrastra una imagen aquí</p>
                      <p className="text-[9.5px] text-ink-soft leading-normal">Admite formatos JPG, PNG de hasta 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-extrabold text-xs py-3.5 rounded-2xl shadow-sm cursor-pointer transition-all text-center active:scale-95"
              >
                Enviar Reporte a Central Operativa
              </button>

            </form>
          )}
        </div>
      )}

      {/* SCREEN: SOLICITUDES HISTORY LIST */}
      {activeScreen === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <button 
                onClick={() => setActiveScreen('main')}
                className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-all"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-sora font-extrabold text-base text-ink">Tus Solicitudes</h3>
                <p className="text-[10px] text-ink-soft">Historial y chat en tiempo real de tus reclamos.</p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveScreen('report');
                setSubmitSuccess(false);
              }}
              className="bg-primary/10 hover:bg-primary/15 text-primary text-[10.5px] font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle size={13} /> Nuevo Reclamo
            </button>
          </div>

          <div className="space-y-3">
            {cases.length === 0 ? (
              <div className="p-10 text-center bg-white border border-divider/40 rounded-3xl space-y-2">
                <span className="text-4xl">📄</span>
                <p className="text-xs text-ink-soft font-bold italic">No tienes ningún reporte de soporte registrado.</p>
                <button
                  onClick={() => setActiveScreen('report')}
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl mt-2 cursor-pointer shadow-xs inline-block"
                >
                  Crear primer reporte
                </button>
              </div>
            ) : (
              cases.map(item => {
                const badgeStyle = {
                  revision: { bg: "bg-amber-50 text-amber-800 border-amber-200/50", label: "🟡 En revisión" },
                  resuelto: { bg: "bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/20", label: "🟢 Resuelto" },
                  cerrado: { bg: "bg-red-50 text-red-700 border-red-200", label: "🔴 Cerrado" }
                }[item.statusKey] || { bg: "bg-surface-alt text-ink-soft border-divider", label: "Desconocido" };

                return (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedCase(item);
                      setActiveScreen('chat');
                    }}
                    className="p-4 rounded-3xl bg-white border border-divider/40 hover:border-primary/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col gap-3 text-left shadow-xs"
                  >
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black font-mono text-ink-faint">ID: {item.id}</span>
                        <h4 className="font-sora font-extrabold text-[12.5px] text-ink">{item.typeName}</h4>
                      </div>
                      <span className={`text-[9.5px] font-black uppercase px-2.5 py-0.75 rounded-full border ${badgeStyle.bg}`}>
                        {badgeStyle.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-soft leading-relaxed line-clamp-2 font-semibold">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-divider/30 flex items-center justify-between text-[10px] text-ink-soft font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-primary" />
                        <span>{item.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-primary font-bold">
                        <MessageSquare size={11} />
                        <span>{item.messages.length} mensajes</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SCREEN: DIRECT CHAT WITH SUPPORT AGENT */}
      {activeScreen === 'chat' && selectedCase && (() => {
        const badgeStyle = {
          revision: { bg: "bg-amber-50 text-amber-800 border-amber-200/50", label: "En revisión 🟡" },
          resuelto: { bg: "bg-[#E6F7EC] text-[#0EA65C] border-[#0EA65C]/20", label: "Resuelto 🟢" },
          cerrado: { bg: "bg-red-50 text-red-700 border-red-200", label: "Cerrado 🔴" }
        }[selectedCase.statusKey] || { bg: "bg-surface-alt text-ink-soft border-divider", label: "Desconocido" };

        return (
          <div className="h-[480px] bg-white border border-divider/60 rounded-3xl overflow-hidden flex flex-col relative shadow-sm animate-fadeIn text-left">
            
            {/* Header */}
            <div className="p-4 border-b border-divider/60 bg-surface-alt/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveScreen('history')}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-divider/50 cursor-pointer text-ink hover:bg-surface-alt transition-colors"
                >
                  <ArrowLeft size={14} />
                </button>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-ink-soft font-bold">{selectedCase.id}</span>
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.25 rounded-md border ${badgeStyle.bg}`}>
                      {badgeStyle.label}
                    </span>
                  </div>
                  <h4 className="font-sora font-extrabold text-[12px] text-ink line-clamp-1">{selectedCase.typeName}</h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-surface text-lg flex items-center justify-center">
                  👩‍💼
                </div>
              </div>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-surface-alt/10 content-scrollbar pb-20">
              
              {/* Initial Report Summary bubble */}
              <div className="p-3.5 rounded-2xl bg-white border border-divider/50 text-[11px] text-ink-soft space-y-1 text-left font-semibold shadow-2xs">
                <div className="text-[9px] uppercase tracking-wide text-ink-faint font-bold">Detalle Inicial del Caso:</div>
                <p className="text-ink leading-relaxed">{selectedCase.description}</p>
                {selectedCase.attachedImage && (
                  <div className="pt-1.5 flex items-center gap-1.5 text-primary text-[10px] font-mono font-bold">
                    <span>📎 Evidencia:</span>
                    <span className="underline">{selectedCase.attachedImage}</span>
                  </div>
                )}
              </div>

              {selectedCase.messages.map((msg, index) => {
                const isSupport = msg.sender === 'support';
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isSupport ? 'justify-start' : 'justify-end'} animate-scaleIn`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs text-xs leading-relaxed ${
                      isSupport 
                        ? 'bg-[#EBF3FF] text-[#0044B3] border border-[#0066FF]/10 rounded-tl-none font-semibold' 
                        : 'bg-primary text-white rounded-tr-none font-medium'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[8px] block text-right mt-1.5 font-bold font-mono ${isSupport ? 'text-[#0044B3]/60' : 'text-white/70'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#EBF3FF] text-primary border border-[#0066FF]/10 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            {selectedCase.statusKey === 'cerrado' ? (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-red-50 border-t border-red-100 text-center text-[10.5px] text-red-600 font-bold">
                ⚠️ Este ticket de soporte ha sido cerrado. No se permiten más mensajes.
              </div>
            ) : (
              <form 
                onSubmit={handleSendChatMessage}
                className="absolute bottom-3 left-3 right-3 bg-white border border-divider/60 rounded-2xl p-1.5 flex items-center gap-2 shadow-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Escribe un mensaje de respuesta..."
                  className="flex-1 bg-transparent border-0 px-3 py-2 text-xs outline-none text-ink font-semibold"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                    inputMessage.trim() 
                      ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-xs' 
                      : 'bg-surface-alt text-ink-faint'
                  }`}
                >
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        );
      })()}

      {/* SCREEN: SERVICE CHAT - MÓDULO 30 */}
      {activeScreen === 'service_chat' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveScreen('main')}
              className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h3 className="font-sora font-extrabold text-base text-ink">Chat de Servicio en Tiempo Real</h3>
              <p className="text-[10px] text-ink-soft">Simulación de chat de WhatsApp con conductores y comercios de Movica.</p>
            </div>
          </div>

          <ChatSystem />
        </div>
      )}

    </div>
  );
}
