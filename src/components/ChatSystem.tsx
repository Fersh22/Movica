import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Phone, Image as ImageIcon, MapPin, Mic, Volume2, 
  Check, CheckCheck, MoreVertical, Search, ArrowLeft,
  Smile, Paperclip, FileText, Play, Pause, ChevronRight,
  Info, Sparkles, HelpCircle, AlertCircle, X, ShieldAlert
} from 'lucide-react';

// Message types matching Módulo 30 requirements
export interface ChatMessage {
  id: string;
  sender: 'client' | 'driver' | 'merchant';
  senderName: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'location' | 'audio' | 'document';
  mediaUrl?: string; // photo path or map thumbnail
  duration?: string; // for voice notes
  isCustomFile?: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  role: 'driver' | 'merchant';
  avatar: string;
  status: 'online' | 'offline' | 'escribiendo...';
  lastSeen?: string;
  vehicle?: string;
  plate?: string;
  messages: ChatMessage[];
  unreadCount: number;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-driver',
    name: 'Ferney Gómez',
    role: 'driver',
    avatar: '🛵',
    status: 'online',
    vehicle: 'Honda CB125F (Negra)',
    plate: 'KJW-82D',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-d1',
        sender: 'driver',
        senderName: 'Ferney Gómez',
        text: '¡Hola! He tomado tu solicitud. Ya estoy preparando el casco adicional y voy en camino.',
        time: '21:30',
        status: 'read',
        type: 'text'
      },
      {
        id: 'msg-c1',
        sender: 'client',
        senderName: 'Tú',
        text: '¡Hola Ferney! Perfecto. Te espero en la entrada del edificio con rejas blancas.',
        time: '21:32',
        status: 'read',
        type: 'text'
      },
      {
        id: 'msg-d2',
        sender: 'driver',
        senderName: 'Ferney Gómez',
        text: '¡Excelente! ¿Vas a cancelar con sencillo o necesitas cambio?',
        time: '21:35',
        status: 'read',
        type: 'text'
      }
    ]
  },
  {
    id: 'thread-merchant',
    name: 'Restaurante El Gran Sabor',
    role: 'merchant',
    avatar: '🍔',
    status: 'online',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-m1',
        sender: 'merchant',
        senderName: 'El Gran Sabor',
        text: 'Buenas noches. Recibimos tu pedido de Hamburguesa Premium con papas rústicas.',
        time: '21:20',
        status: 'read',
        type: 'text'
      },
      {
        id: 'msg-m2',
        sender: 'merchant',
        senderName: 'El Gran Sabor',
        text: 'Tu pedido ya está siendo empacado por nuestro equipo de cocina.',
        time: '21:28',
        status: 'read',
        type: 'text'
      }
    ]
  }
];

export default function ChatSystem() {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-driver');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  
  // Custom states for actions
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPhoneCallActive, setIsPhoneCallActive] = useState(false);
  const [phoneCallSeconds, setPhoneCallSeconds] = useState(0);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // Attachment overlay states
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread.messages, isTyping]);

  // Voice recording simulation timer
  useEffect(() => {
    let timer: any;
    if (isVoiceRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isVoiceRecording]);

  // Phone calling simulation timer
  useEffect(() => {
    let timer: any;
    if (isPhoneCallActive) {
      timer = setInterval(() => {
        setPhoneCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setPhoneCallSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isPhoneCallActive]);

  // Firebase / Supabase Integration Notes for Future Prep
  /*
    === GUÍA DE INTEGRACIÓN EN LA VERSIÓN REAL (FIREBASE / SUPABASE) ===
    
    1. Base de datos real-time:
       Para Firebase Firestore:
       - Escuchar cambios en tiempo real con `onSnapshot(query(collection(db, 'chats', threadId, 'messages'), orderBy('timestamp')))`
       - Para agregar un mensaje: `addDoc(collection(db, 'chats', threadId, 'messages'), { sender, text, timestamp: serverTimestamp(), status: 'sent' })`
       
    2. Para Supabase Realtime Channels:
       - Suscribirse a la tabla con:
         const channel = supabase.channel('room-1')
           .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
             appendNewMessage(payload.new);
           })
           .subscribe();

    3. Para archivos e imágenes:
       - Utilizar Firebase Storage o Supabase Storage para subir imágenes o notas de voz (.wav / .mp3)
       - Subir el archivo, obtener la URL de descarga (`getDownloadURL`) y guardarla en la propiedad `mediaUrl` del mensaje de texto.
  */

  const handleSendMessage = (textToSend?: string, customType: 'text' | 'image' | 'location' | 'audio' | 'document' = 'text', mediaUrl?: string, customDuration?: string) => {
    const finalMsgText = textToSend || inputText;
    if (!finalMsgText.trim() && !mediaUrl) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'client',
      senderName: 'Tú',
      text: finalMsgText,
      time: timeString,
      status: 'sent', // Initial state when sent
      type: customType,
      mediaUrl,
      duration: customDuration
    };

    // 1. Append user message locally
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    if (!textToSend) setInputText('');
    setShowAttachmentMenu(false);

    // Simulate real-time response sequence
    // Step A: Update status to "delivered" after 500ms (ticks double check)
    setTimeout(() => {
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: t.messages.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m)
          };
        }
        return t;
      }));
    }, 600);

    // Step B: Update status to "read" after 1.2s (ticks double blue checks and "Mensaje leído" feedback)
    setTimeout(() => {
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: t.messages.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m)
          };
        }
        return t;
      }));
    }, 1500);

    // Step C: Trigger simulated response based on active thread role
    setTimeout(() => {
      // Set thread status to typing "escribiendo..."
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, status: 'escribiendo...' };
        }
        return t;
      }));
      setIsTyping(true);

      setTimeout(() => {
        // Stop typing
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            return { ...t, status: 'online' };
          }
          return t;
        }));
        setIsTyping(false);

        // Generate response message
        let replyText = '¡Entendido! Lo tengo en cuenta para el servicio.';
        if (activeThread.role === 'driver') {
          if (finalMsgText.toLowerCase().includes('llegando') || finalMsgText.toLowerCase().includes('donde') || finalMsgText.toLowerCase().includes('dónde')) {
            replyText = 'Estoy a dos cuadras de distancia del punto de recogida, cruzo el semáforo y llego 🛵';
          } else if (finalMsgText.toLowerCase().includes('casco')) {
            replyText = 'Sí, llevo el casco premium adicional desinfectado con visera protectora.';
          } else if (finalMsgText.toLowerCase().includes('sencillo') || finalMsgText.toLowerCase().includes('cambio')) {
            replyText = '¡Perfecto! Llevo cambio suficiente de $10.000 y $20.000 para tu comodidad 💵';
          } else if (customType === 'location') {
            replyText = '¡Excelente! Veo tu ubicación exacta en el mapa de Movica. Ya voy directo hacia allá.';
          } else if (customType === 'audio') {
            replyText = 'Recibido tu audio. Ya paré un momento a escucharlo y prosigo el recorrido.';
          }
        } else {
          // Merchant replies
          if (finalMsgText.toLowerCase().includes('listo') || finalMsgText.toLowerCase().includes('pedido') || finalMsgText.toLowerCase().includes('demora')) {
            replyText = 'Tu pedido ya se encuentra en el mostrador listo para ser recogido por el motorizado asignado 🍔';
          } else if (finalMsgText.toLowerCase().includes('factura') || finalMsgText.toLowerCase().includes('comprobante')) {
            replyText = 'Claro que sí, hemos adjuntado la factura física dentro de la bolsa sellada de seguridad.';
          }
        }

        const replyTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
        const autoReply: ChatMessage = {
          id: `msg-auto-${Date.now()}`,
          sender: activeThread.role,
          senderName: activeThread.name,
          text: replyText,
          time: replyTime,
          status: 'read',
          type: 'text'
        };

        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, autoReply]
            };
          }
          return t;
        }));

      }, 1800);

    }, 2200);

  };

  // Preset canned messages triggers (Módulo 30)
  const handleSendCannedMessage = (phrase: string) => {
    handleSendMessage(phrase, 'text');
  };

  // Simulate image upload attachment
  const handleSendImageMock = () => {
    // Simulated delivery validation image
    const images = [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400', // Motorbike
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', // burger
      'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=400'  // parcel package
    ];
    const randomImg = images[Math.floor(Math.random() * images.length)];
    handleSendMessage('📷 Foto de referencia enviada.', 'image', randomImg);
  };

  // Simulate Map location attachment
  const handleSendLocationMock = () => {
    handleSendMessage('📍 Coordenadas en tiempo real: Calle 5 con Carrera 14, Parque Principal de Aguachica.', 'location', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400');
  };

  // Simulate document receipt attachment
  const handleSendDocumentMock = () => {
    handleSendMessage('📄 Comprobante de pago Movica_Factura_10283.pdf (142 KB)', 'document');
  };

  // Voice recorder simulation trigger
  const handleToggleVoiceRecording = () => {
    if (!isVoiceRecording) {
      setIsVoiceRecording(true);
    } else {
      setIsVoiceRecording(false);
      // Append voice message
      const durationStr = `0:${recordingSeconds.toString().padStart(2, '0')}`;
      handleSendMessage('🎤 Nota de voz enviada', 'audio', undefined, durationStr);
    }
  };

  const filteredThreads = threads.filter(t => 
    t.name.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-[580px] bg-white border border-divider/60 rounded-3xl overflow-hidden flex shadow-lg">
      
      {/* THREADS / CHATS SIDEBAR (Left on desktop) */}
      <div className="w-full md:w-80 border-r border-divider/50 flex flex-col bg-white">
        
        {/* Sidebar Header search */}
        <div className="p-4 bg-surface-alt/40 border-b border-divider/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-sora font-extrabold text-sm text-ink flex items-center gap-1.5">
              <span>Mensajes de Movica</span>
              <span className="bg-[#0EA65C]/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-black">
                {threads.length} Activos
              </span>
            </h3>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Buscar chat o aliado..."
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              className="w-full bg-white border border-divider/60 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto content-scrollbar divide-y divide-divider/30">
          {filteredThreads.map(thread => {
            const isSelected = thread.id === activeThreadId;
            const lastMsg = thread.messages[thread.messages.length - 1];
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => {
                  setActiveThreadId(thread.id);
                  // Mark as read
                  setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
                }}
                className={`w-full p-3.5 flex gap-3 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-primary-surface border-l-4 border-primary' : 'hover:bg-surface-alt/30'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0d1a16] to-[#1a382d] text-white flex items-center justify-center text-xl shadow-md flex-shrink-0 relative">
                  {thread.avatar}
                  {thread.status === 'online' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#0EA65C] border-2 border-white" />
                  )}
                  {thread.status === 'escribiendo...' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white animate-bounce" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-sora font-extrabold text-xs text-ink truncate">{thread.name}</h4>
                    <span className="text-[9px] text-ink-faint font-semibold">{lastMsg?.time || 'Ayer'}</span>
                  </div>
                  
                  <p className="text-[10px] text-ink-soft truncate font-medium mt-1">
                    {thread.status === 'escribiendo...' ? (
                      <span className="text-primary font-black animate-pulse">Escribiendo...</span>
                    ) : (
                      lastMsg?.text || 'No hay mensajes'
                    )}
                  </p>
                  
                  {thread.role === 'driver' && thread.plate && (
                    <span className="inline-block bg-primary/10 text-primary-dark font-black text-[7.5px] px-1.5 py-0.25 rounded mt-1.5">
                      {thread.plate}
                    </span>
                  )}
                </div>

                {thread.unreadCount > 0 && (
                  <div className="self-center w-5 h-5 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {thread.unreadCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Future sync indication badge */}
        <div className="p-3 bg-surface-alt/50 border-t border-divider/40 text-[9px] text-left text-ink-soft flex items-center gap-1.5 leading-tight">
          <Info size={11} className="text-primary flex-shrink-0" />
          <span>Sincronizado vía WebSocket local de simulación.</span>
        </div>

      </div>

      {/* CHAT MAIN INTERACTIVE SCREEN (Right on desktop) */}
      <div className="flex-1 flex flex-col bg-slate-50 relative justify-between">
        
        {/* Header containing name and role */}
        <div className="p-3 bg-[#0d1a16] text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              {activeThread.avatar}
            </div>
            <div className="text-left leading-none">
              <h4 className="font-sora font-extrabold text-xs text-white">{activeThread.name}</h4>
              <span className="text-[9px] text-primary font-black mt-0.5 tracking-wider block uppercase">
                {activeThread.status === 'escribiendo...' ? 'Escribiendo...' : activeThread.role === 'driver' ? 'Socio Conductor' : 'Comercio Registrado'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Phone call trigger */}
            <button
              type="button"
              onClick={() => setIsPhoneCallActive(true)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer transition-colors"
              title="Llamada de voz"
            >
              <Phone size={14} className="text-primary" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <MoreVertical size={14} className="text-white/60" />
            </button>
          </div>
        </div>

        {/* MESSAGES VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-4 content-scrollbar bg-[#EAEAE4]/30 space-y-3.5">
          {activeThread.messages.map((message) => {
            const isMe = message.sender === 'client';
            return (
              <div 
                key={message.id}
                className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                {/* Visual bubble rendering based on type */}
                <div className={`p-3.5 rounded-2xl text-left shadow-sm ${
                  isMe 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-ink border border-divider/40 rounded-tl-none'
                }`}>
                  
                  {/* TEXT TYPE */}
                  {message.type === 'text' && (
                    <p className="text-[11.5px] font-semibold leading-relaxed whitespace-pre-line">{message.text}</p>
                  )}

                  {/* IMAGE TYPE */}
                  {message.type === 'image' && (
                    <div className="space-y-2">
                      <img 
                        src={message.mediaUrl} 
                        alt="Media attachment" 
                        referrerPolicy="no-referrer"
                        className="rounded-xl w-full max-w-[200px] h-28 object-cover border border-divider/50 shadow-sm"
                      />
                      <p className="text-[11.5px] font-semibold leading-relaxed">{message.text}</p>
                    </div>
                  )}

                  {/* LOCATION TYPE */}
                  {message.type === 'location' && (
                    <div className="space-y-2 max-w-[200px]">
                      <div className="h-20 bg-emerald-100 rounded-xl border border-divider/60 relative overflow-hidden flex items-center justify-center">
                        <MapPin size={16} className="text-primary animate-bounce z-10" />
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#20382E_1px,transparent_1px)] [background-size:8px_8px]" />
                        <span className="absolute bottom-1 right-2 text-[6.5px] font-black text-ink-soft bg-white/90 px-1 rounded">Aguachica GPS</span>
                      </div>
                      <p className="text-[11.5px] font-semibold leading-relaxed">{message.text}</p>
                    </div>
                  )}

                  {/* AUDIO VOICE NOTE TYPE */}
                  {message.type === 'audio' && (
                    <div className="flex items-center gap-3 w-[200px]">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudioId(isPlayingAudioId === message.id ? null : message.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer ${
                          isMe ? 'bg-primary-dark hover:bg-black/20' : 'bg-primary text-white'
                        }`}
                      >
                        {isPlayingAudioId === message.id ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                      </button>
                      
                      {/* Fake Audio Wave */}
                      <div className="flex-1 flex gap-0.5 items-center h-4">
                        {[0.2, 0.5, 0.8, 0.4, 0.9, 0.6, 0.3, 0.7, 0.5, 0.2].map((height, i) => (
                          <span 
                            key={i} 
                            style={{ height: `${height * 100}%` }}
                            className={`w-1 rounded-full ${
                              isPlayingAudioId === message.id 
                                ? 'bg-white animate-pulse' 
                                : isMe ? 'bg-white/40' : 'bg-primary/30'
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-[9px] font-mono font-bold">{message.duration || '0:12'}</span>
                    </div>
                  )}

                  {/* DOCUMENT TYPE */}
                  {message.type === 'document' && (
                    <div className="flex items-center gap-2.5 max-w-[210px] bg-black/5 p-2 rounded-xl">
                      <FileText size={18} className="text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold truncate">{message.text}</p>
                        <span className="text-[8px] opacity-60">100% Cifrado • PDF</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Status metadata line (sent, delivered, read double blue check checkmarks) */}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[8px] text-ink-faint font-bold">{message.time}</span>
                  {isMe && (
                    <span>
                      {message.status === 'sent' && <Check size={11} className="text-ink-faint" />}
                      {message.status === 'delivered' && <CheckCheck size={11} className="text-ink-faint" />}
                      {message.status === 'read' && <CheckCheck size={11} className="text-primary font-black" />}
                    </span>
                  )}
                  {message.status === 'read' && (
                    <span className="text-[7.5px] text-primary font-extrabold uppercase scale-90">
                      Leído
                    </span>
                  )}
                </div>

              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-divider/50 mr-auto max-w-[150px] shadow-sm">
              <span className="text-[10.5px] text-ink-soft font-semibold">Escribiendo</span>
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200" />
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* CANNED PRESET MESSAGES RAIL (Módulo 30) */}
        <div className="px-3.5 py-2 border-t border-divider/40 bg-white flex gap-1.5 overflow-x-auto whitespace-nowrap content-scrollbar">
          {[
            'Voy llegando. 🛵',
            'Estoy en el punto de recogida. 📍',
            'Tu pedido está listo. 🍔',
            'Gracias por usar Movica. 💚'
          ].map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendCannedMessage(phrase)}
              className="text-[10px] bg-surface-alt hover:bg-primary-surface border border-divider/50 text-ink font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer inline-block"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* INPUT AND ACTIONS ROW */}
        <div className="p-3 border-t border-divider bg-white space-y-2 relative">
          
          <div className="flex gap-2 items-center">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="w-9 h-9 rounded-xl border border-divider/80 text-ink-soft bg-white hover:bg-surface-alt flex items-center justify-center cursor-pointer transition-colors"
              title="Adjuntar archivo"
            >
              <Paperclip size={14} className={showAttachmentMenu ? 'text-primary' : ''} />
            </button>

            {/* Simulated Voice note voice recording trigger */}
            <button
              type="button"
              onClick={handleToggleVoiceRecording}
              className={`w-9 h-9 rounded-xl border border-divider/80 text-ink-soft hover:bg-surface-alt flex items-center justify-center cursor-pointer transition-colors ${
                isVoiceRecording ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' : ''
              }`}
              title="Nota de voz"
            >
              <Mic size={14} />
            </button>

            {/* Input message text field */}
            {isVoiceRecording ? (
              <div className="flex-1 bg-red-50 rounded-xl px-3 py-1.5 text-xs text-red-700 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  Grabando Nota de voz simulada...
                </span>
                <span>0:{recordingSeconds.toString().padStart(2, '0')}</span>
              </div>
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe un mensaje para el servicio..."
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                className="flex-1 bg-surface-alt rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-primary border border-divider/30 outline-none"
              />
            )}

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isVoiceRecording}
              className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all flex-shrink-0 disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>

          {/* ATTACHMENT FLOATING OPTION CARD */}
          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-16 left-4 bg-white border border-divider/60 rounded-2xl p-3 shadow-xl z-30 w-52 text-left space-y-1.5"
              >
                <span className="text-[8.5px] font-black uppercase text-ink-soft block px-2 pb-1 border-b border-divider/30">
                  Simular envío de archivo
                </span>

                <button
                  type="button"
                  onClick={handleSendImageMock}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-surface-alt transition-colors text-xs font-bold text-ink"
                >
                  <ImageIcon size={14} className="text-blue-500" />
                  📷 Compartir Foto
                </button>

                <button
                  type="button"
                  onClick={handleSendLocationMock}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-surface-alt transition-colors text-xs font-bold text-ink"
                >
                  <MapPin size={14} className="text-[#0EA65C]" />
                  📍 Enviar Ubicación
                </button>

                <button
                  type="button"
                  onClick={handleSendDocumentMock}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-surface-alt transition-colors text-xs font-bold text-ink"
                >
                  <FileText size={14} className="text-amber-500" />
                  📄 Comprobante Pago
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* PHONE CALL SIMULATION COVER */}
      <AnimatePresence>
        {isPhoneCallActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0d1a16] z-50 flex flex-col justify-between p-8 text-white text-center"
          >
            <div className="space-y-1.5 mt-8">
              <span className="text-[9px] text-primary font-black uppercase tracking-widest block animate-pulse">Llamada Encriptada Movica</span>
              <h3 className="font-sora font-extrabold text-lg">{activeThread.name}</h3>
              <span className="text-xs text-white/60 block">Socio Conductor • {activeThread.plate || 'Línea de Servicio'}</span>
            </div>

            <div className="my-auto flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl shadow-2xl border border-white/20">
                  {activeThread.avatar}
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-25" />
              </div>
            </div>

            <div className="space-y-8 mb-8">
              <span className="text-xs font-mono font-bold tracking-widest text-white/75">
                {formatCallTime(phoneCallSeconds)}
              </span>
              
              <button
                type="button"
                onClick={() => {
                  setIsPhoneCallActive(false);
                  setPhoneCallSeconds(0);
                }}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white mx-auto cursor-pointer active:scale-95 transition-transform"
              >
                <X size={20} className="stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
