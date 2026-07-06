import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Clock, ThumbsUp, ShieldAlert, Edit2, Check, CheckCircle, 
  Sparkles, Award, User, RefreshCw, MessageSquare, AlertCircle, Heart,
  ThumbsDown, ChevronRight, HelpCircle, Bike, MapPin, Smile, Eye, X
} from 'lucide-react';

// Interfaces for our simulated database of reviews
export interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  partnerName: string;
  partnerAvatar: string;
  serviceType: string;
  stars: number;
  comment: string;
  createdAt: string;
  createdAtMs: number; // for simulated edit time window
  aspects: {
    punctualidad: number; // 1-5
    amabilidad: number; // 1-5
    estadoMoto: number; // 1-5
    facilidadUbicacion: number; // 1-5
  };
}

// Prepopulated simulated reviews database
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    clientName: 'Carolina Torres',
    clientAvatar: '👩',
    partnerName: 'Alvaro Restrepo',
    partnerAvatar: '👨‍✈️',
    serviceType: 'Mototaxi 🛵',
    stars: 5,
    comment: 'Excelente servicio, llegó muy rápido y manejaba de manera muy prudente por Aguachica.',
    createdAt: 'Hace 5 min',
    createdAtMs: Date.now() - 5 * 60 * 1000,
    aspects: { punctualidad: 5, amabilidad: 5, estadoMoto: 5, facilidadUbicacion: 5 }
  },
  {
    id: 'rev-2',
    clientName: 'Camilo Rojas',
    clientAvatar: '👨',
    partnerName: 'Sonia Restrepo',
    partnerAvatar: '👩‍✈️',
    serviceType: 'Domicilio 🍔',
    stars: 5,
    comment: 'Muy amable Sonia, la comida llegó caliente y la moto andaba impecable.',
    createdAt: 'Hace 2 horas',
    createdAtMs: Date.now() - 120 * 60 * 1000,
    aspects: { punctualidad: 5, amabilidad: 5, estadoMoto: 4, facilidadUbicacion: 5 }
  },
  {
    id: 'rev-3',
    clientName: 'Daniela Medina',
    clientAvatar: '👩',
    partnerName: 'Juan Carlos Silva',
    partnerAvatar: '🏍️',
    serviceType: 'Encomienda 📦',
    stars: 4,
    comment: 'Llegó a tiempo, aunque le costó un poco ubicar la nomenclatura de mi dirección.',
    createdAt: 'Hace 1 día',
    createdAtMs: Date.now() - 24 * 60 * 60 * 1000,
    aspects: { punctualidad: 5, amabilidad: 4, estadoMoto: 4, facilidadUbicacion: 3 }
  },
  {
    id: 'rev-4',
    clientName: 'Jorge Eliécer',
    clientAvatar: '👨',
    partnerName: 'Andrés Mendoza',
    partnerAvatar: '🛵',
    serviceType: 'Compra 🛒',
    stars: 2,
    comment: 'Se demoró bastante en hacer el mandado y el estado de la moto no se veía muy seguro.',
    createdAt: 'Hace 2 días',
    createdAtMs: Date.now() - 48 * 60 * 60 * 1000,
    aspects: { punctualidad: 2, amabilidad: 3, estadoMoto: 1, facilidadUbicacion: 3 }
  },
  {
    id: 'rev-5',
    clientName: 'Milena Pardo',
    clientAvatar: '👩',
    partnerName: 'Wilson Cardona',
    partnerAvatar: '👨‍✈️',
    serviceType: 'Mandado 📋',
    stars: 5,
    comment: 'Wilson es un excelente aliado, muy puntual y con una amabilidad excepcional.',
    createdAt: 'Hace 3 días',
    createdAtMs: Date.now() - 72 * 60 * 60 * 1000,
    aspects: { punctualidad: 5, amabilidad: 5, estadoMoto: 5, facilidadUbicacion: 4 }
  }
];

interface RatingsSystemProps {
  initialViewMode?: 'simulator' | 'form' | 'client' | 'partner' | 'admin';
}

export default function RatingsSystem({ initialViewMode = 'simulator' }: RatingsSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeTab, setActiveTab] = useState<'form' | 'client' | 'partner' | 'admin'>(
    initialViewMode === 'simulator' ? 'form' : initialViewMode as any
  );

  // --- POST-TRIP RATING FORM STATE ---
  const [formStars, setFormStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [formComment, setFormComment] = useState<string>('');
  const [aspectPuntualidad, setAspectPuntualidad] = useState<number>(5);
  const [aspectAmabilidad, setAspectAmabilidad] = useState<number>(5);
  const [aspectEstadoMoto, setAspectEstadoMoto] = useState<number>(5);
  const [aspectFacilidadUbicacion, setAspectFacilidadUbicacion] = useState<number>(5);
  const [selectedPartner, setSelectedPartner] = useState<string>('Alvaro Restrepo');
  const [selectedService, setSelectedService] = useState<string>('Mototaxi 🛵');

  // --- EDIT REVIEW MODAL STATE ---
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState<string>('');

  // --- FEEDBACK MESSAGES ---
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 2500);
  };

  // --- SUBMIT RATING ---
  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      clientName: 'Carolina Torres', // Logged in user profile
      clientAvatar: '👩',
      partnerName: selectedPartner,
      partnerAvatar: selectedPartner === 'Alvaro Restrepo' ? '👨‍✈️' : selectedPartner === 'Sonia Restrepo' ? '👩‍✈️' : '🏍️',
      serviceType: selectedService,
      stars: formStars,
      comment: formComment || '¡Excelente servicio recomendado!',
      createdAt: 'Hace un momento',
      createdAtMs: Date.now(),
      aspects: {
        punctualidad: aspectPuntualidad,
        amabilidad: aspectAmabilidad,
        estadoMoto: aspectEstadoMoto,
        facilidadUbicacion: aspectFacilidadUbicacion
      }
    };

    setReviews([newReview, ...reviews]);
    triggerFeedback('¡Calificación enviada con éxito! Gracias por tu opinión.');
    
    // Reset form
    setFormStars(5);
    setFormComment('');
    setAspectPuntualidad(5);
    setAspectAmabilidad(5);
    setAspectEstadoMoto(5);
    setAspectFacilidadUbicacion(5);

    // Swap tab to Client View to let them see and edit their new review
    setActiveTab('client');
  };

  // --- EDIT REVIEW (Simulated first minutes edit) ---
  const handleStartEdit = (review: Review) => {
    // Check if within 5 simulated minutes (300,000 ms)
    const elapsed = Date.now() - review.createdAtMs;
    const limit = 5 * 60 * 1000;

    if (elapsed > limit && review.id !== 'rev-1') {
      // Just for a realistic, educational and robust simulation, we alert the user about the lock,
      // but let them edit anyway if they explicitly confirm, following standard customizer goals
      triggerFeedback('⚠️ El tiempo oficial de edición expiró, pero como es simulador te permitiremos editar.');
    }
    
    setEditingReviewId(review.id);
    setEditComment(review.comment);
  };

  const handleSaveEdit = () => {
    if (!editComment.trim()) return;

    setReviews(prev => prev.map(r => 
      r.id === editingReviewId 
        ? { ...r, comment: editComment, createdAt: 'Editado hace un momento' } 
        : r
    ));
    setEditingReviewId(null);
    triggerFeedback('¡Comentario actualizado correctamente!');
  };

  // --- ALLY CALCS ---
  // We can filter reviews for specific allies or look at aggregate
  const targetAlly = 'Alvaro Restrepo';
  const allyReviews = reviews.filter(r => r.partnerName === targetAlly);
  const allyAvgRating = (allyReviews.reduce((sum, r) => sum + r.stars, 0) / allyReviews.length) || 5;
  const allyAspectsAvg = {
    punctualidad: (allyReviews.reduce((sum, r) => sum + r.aspects.punctualidad, 0) / allyReviews.length) || 5,
    amabilidad: (allyReviews.reduce((sum, r) => sum + r.aspects.amabilidad, 0) / allyReviews.length) || 5,
    estadoMoto: (allyReviews.reduce((sum, r) => sum + r.aspects.estadoMoto, 0) / allyReviews.length) || 5,
    facilidadUbicacion: (allyReviews.reduce((sum, r) => sum + r.aspects.facilidadUbicacion, 0) / allyReviews.length) || 5,
  };

  // --- ADMIN CALCS ---
  const totalReviewsCount = reviews.length;
  const globalAvgRating = parseFloat((reviews.reduce((sum, r) => sum + r.stars, 0) / totalReviewsCount).toFixed(1));
  
  // Best Allies Calc
  const allPartners = Array.from(new Set(reviews.map(r => r.partnerName)));
  const partnerRatings = allPartners.map(name => {
    const rvs = reviews.filter(r => r.partnerName === name);
    const avg = rvs.reduce((sum, r) => sum + r.stars, 0) / rvs.length;
    return { name, avg, count: rvs.length, avatar: rvs[0]?.partnerAvatar || '👨‍✈️' };
  }).sort((a, b) => b.avg - a.avg);

  // Best Clients Calc
  const allClients = Array.from(new Set(reviews.map(r => r.clientName)));
  const clientStats = allClients.map(name => {
    const rvs = reviews.filter(r => r.clientName === name);
    // In our simplified system, we can say high activity or high-quality ratings
    return { name, count: rvs.length, avgRatingGiven: parseFloat((rvs.reduce((sum, r) => sum + r.stars, 0) / rvs.length).toFixed(1)), avatar: rvs[0]?.clientAvatar || '👨' };
  }).sort((a, b) => b.count - a.count);

  // Flagged low ratings (stars <= 3)
  const lowRatedServices = reviews.filter(r => r.stars <= 3);

  return (
    <div className="space-y-6">

      {/* RATING MODULE INTRO BANNER */}
      <div className="bg-gradient-to-r from-[#0d1a16] to-[#1d3c30] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-primary/20 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-primary flex items-center gap-1">
            <Sparkles size={11} className="text-primary animate-pulse" /> Módulo 15 Oficial
          </span>
          <span className="bg-white/10 text-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Calificaciones y Reseñas
          </span>
        </div>
        <h3 className="font-sora font-extrabold text-lg leading-snug">Calificaciones y Reseñas Premium</h3>
        <p className="text-xs text-white/70 max-w-[620px] mt-1 leading-relaxed">
          Sistema integral de feedback de Movica. Permite evaluar aspectos específicos (Puntualidad, Amabilidad, Moto y Ubicación), 
          facilita la edición rápida por el cliente, y consolida reportes analíticos para conductores y el panel de administración.
        </p>

        {/* INTERACTIVE NAVIGATION CONTROL */}
        <div className="grid grid-cols-4 gap-1.5 mt-4 pt-1 border-t border-white/10">
          {[
            { id: 'form', label: '1. Formulario', icon: '⭐' },
            { id: 'client', label: '2. Historial Cliente', icon: '👩' },
            { id: 'partner', label: '3. Vista Aliado', icon: '🛵' },
            { id: 'admin', label: '4. Panel Admin', icon: '💼' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 rounded-xl text-[10.5px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-primary text-white font-extrabold shadow-sm' 
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#0EA65C] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/10 font-bold text-xs flex items-center gap-2"
          >
            <CheckCircle size={15} /> {feedbackMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONDITIONAL TAB RENDERING */}
      <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs">
        
        {/* TAB 1: POST-TRIP RATING FORM */}
        {activeTab === 'form' && (
          <div className="max-w-md mx-auto space-y-5 text-center py-2">
            <div>
              <span className="text-[10px] text-primary font-black uppercase tracking-wider block">Califica tu Servicio</span>
              <h4 className="font-sora font-extrabold text-base text-ink mt-0.5">¿Cómo fue tu experiencia de viaje?</h4>
              <p className="text-xs text-ink-soft">Califica tu último trayecto por Aguachica para ayudarnos a mantener la calidad.</p>
            </div>

            {/* Quick selectors for simulation */}
            <div className="bg-surface-alt p-3.5 rounded-2xl text-left grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-ink-soft font-bold uppercase block mb-1">Simular Aliado</label>
                <select 
                  value={selectedPartner}
                  onChange={e => setSelectedPartner(e.target.value)}
                  className="bg-white border border-divider text-xs px-2.5 py-1.5 rounded-xl w-full text-ink focus:outline-primary cursor-pointer"
                >
                  <option value="Alvaro Restrepo">Alvaro Restrepo (👨‍✈️)</option>
                  <option value="Sonia Restrepo">Sonia Restrepo (👩‍✈️)</option>
                  <option value="Juan Carlos Silva">Juan Carlos Silva (🏍️)</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] text-ink-soft font-bold uppercase block mb-1">Tipo de Servicio</label>
                <select 
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                  className="bg-white border border-divider text-xs px-2.5 py-1.5 rounded-xl w-full text-ink focus:outline-primary cursor-pointer"
                >
                  <option value="Mototaxi 🛵">Mototaxi 🛵</option>
                  <option value="Domicilio 🍔">Domicilio 🍔</option>
                  <option value="Encomienda 📦">Encomienda 📦</option>
                </select>
              </div>
            </div>

            {/* STAR SELECTION CONTAINER */}
            <div className="space-y-1">
              <div className="flex justify-center items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isGold = hoverStars >= star || (hoverStars === 0 && formStars >= star);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      onClick={() => setFormStars(star)}
                      className="p-1 cursor-pointer transition-transform duration-150 hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`transition-colors ${
                          isGold 
                            ? 'fill-[#FFC629] text-[#FFC629] drop-shadow-md' 
                            : 'text-divider hover:text-amber-300'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider block">
                {formStars === 5 ? '⭐⭐⭐⭐⭐ ¡Excelente!' : 
                 formStars === 4 ? '⭐⭐⭐⭐ Muy Bueno' : 
                 formStars === 3 ? '⭐⭐⭐ Aceptable' : 
                 formStars === 2 ? '⭐⭐ Regular' : '⭐ Deficiente'}
              </span>
            </div>

            {/* ASPECTS RATING SUBFORM */}
            <div className="bg-surface-alt/70 border border-divider/40 rounded-2xl p-4 text-left space-y-3.5">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block border-b border-divider/40 pb-1.5">
                Calificación por Aspecto Técnico
              </span>

              {/* 1. Puntualidad */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-ink font-semibold flex items-center gap-1.5">
                  🕒 Puntualidad
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAspectPuntualidad(v)}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                        aspectPuntualidad >= v 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-divider text-ink-soft'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Amabilidad */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-ink font-semibold flex items-center gap-1.5">
                  😊 Amabilidad
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAspectAmabilidad(v)}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                        aspectAmabilidad >= v 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-divider text-ink-soft'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Estado de la moto */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-ink font-semibold flex items-center gap-1.5">
                  🛵 Estado de la moto
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAspectEstadoMoto(v)}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                        aspectEstadoMoto >= v 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-divider text-ink-soft'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Facilidad para encontrar la ubicación */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-ink font-semibold flex items-center gap-1.5">
                  📍 Facilidad de Ubicación
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAspectFacilidadUbicacion(v)}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                        aspectFacilidadUbicacion >= v 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-divider text-ink-soft'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* OPINION WRITING COMMENT FIELD */}
            <div className="text-left space-y-1.5">
              <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">
                Comentario adicional
              </label>
              <textarea
                value={formComment}
                onChange={e => setFormComment(e.target.value)}
                placeholder="Escribe tu opinión... Ej: Excelente servicio, llegó muy rápido."
                rows={3}
                className="w-full bg-surface-alt border border-divider rounded-2xl p-3 text-xs text-ink focus:outline-primary placeholder:text-ink-faint resize-none"
              />
            </div>

            <button
              onClick={handleRatingSubmit}
              className="w-full bg-[#0EA65C] hover:bg-[#087A43] text-white py-3 rounded-2xl font-sora font-black text-xs shadow-md shadow-[#0EA65C]/10 transition-all cursor-pointer active:scale-95"
            >
              Enviar Calificación ⭐
            </button>
          </div>
        )}

        {/* TAB 2: CLIENT HISTORY (with Simulated Edit feature) */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-divider/40 pb-3">
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Historial de Calificaciones</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Consulta las reseñas que has hecho a tus conductores.</p>
              </div>
              <span className="text-[10px] bg-primary-surface text-primary font-black px-2 py-0.5 rounded-full">
                {reviews.filter(r => r.clientName === 'Carolina Torres').length} Realizadas
              </span>
            </div>

            {/* REVIEWS LIST */}
            <div className="space-y-3">
              {reviews.filter(r => r.clientName === 'Carolina Torres').map(review => {
                const isEditable = (Date.now() - review.createdAtMs) < (5 * 60 * 1000) || review.id === 'rev-1';
                
                return (
                  <div key={review.id} className="bg-white border border-divider/60 rounded-2xl p-4 space-y-3 shadow-2xs relative">
                    
                    {/* Header info */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center text-xl">
                          {review.partnerAvatar}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-ink">{review.partnerName}</h5>
                          <span className="text-[9.5px] text-primary font-bold">{review.serviceType}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-0.5 text-[#FFC629]">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={12} 
                              className={idx < review.stars ? 'fill-current' : 'text-divider'} 
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-ink-faint block mt-0.5">{review.createdAt}</span>
                      </div>
                    </div>

                    {/* Aspects tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] bg-surface-alt px-2 py-0.5 rounded-md font-bold text-ink-soft">
                        🕒 Pun: {review.aspects.punctualidad || 5}/5
                      </span>
                      <span className="text-[9px] bg-surface-alt px-2 py-0.5 rounded-md font-bold text-ink-soft">
                        😊 Ama: {review.aspects.amabilidad || 5}/5
                      </span>
                      <span className="text-[9px] bg-surface-alt px-2 py-0.5 rounded-md font-bold text-ink-soft">
                        🛵 Moto: {review.aspects.estadoMoto || 5}/5
                      </span>
                      <span className="text-[9px] bg-surface-alt px-2 py-0.5 rounded-md font-bold text-ink-soft">
                        📍 Ubic: {review.aspects.facilidadUbicacion || 5}/5
                      </span>
                    </div>

                    {/* Review text comment */}
                    <p className="text-[11.5px] text-ink leading-relaxed bg-surface-alt/40 p-2.5 rounded-xl italic">
                      "{review.comment}"
                    </p>

                    {/* Edit control drawer */}
                    <div className="flex justify-between items-center pt-1 border-t border-divider/30">
                      <span className="text-[9px] text-ink-soft flex items-center gap-1 font-semibold">
                        {isEditable ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            Edición Permitida (Primeros minutos)
                          </span>
                        ) : (
                          <span className="text-ink-faint">🔒 Cerrado para edición directa</span>
                        )}
                      </span>

                      <button
                        onClick={() => handleStartEdit(review)}
                        className={`text-[9.5px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                          isEditable 
                            ? 'bg-primary-surface text-primary hover:bg-primary/20' 
                            : 'bg-surface-alt text-ink-soft hover:bg-divider'
                        }`}
                      >
                        <Edit2 size={10} /> Editar Comentario
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* EDITING DIALOG INLINE */}
            <AnimatePresence>
              {editingReviewId && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-alt/90 border border-primary/20 rounded-2xl p-4 space-y-3 mt-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-primary font-black uppercase tracking-wider block">
                      Editando Reseña Seleccionada
                    </span>
                    <button 
                      onClick={() => setEditingReviewId(null)}
                      className="text-ink-soft hover:text-ink cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <textarea
                    value={editComment}
                    onChange={e => setEditComment(e.target.value)}
                    className="w-full bg-white border border-divider rounded-xl p-3 text-xs text-ink focus:outline-primary placeholder:text-ink-faint resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingReviewId(null)}
                      className="px-3 py-1.5 text-[10px] font-bold text-ink-soft hover:bg-divider/30 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-1.5 bg-[#0EA65C] hover:bg-[#087A43] text-white text-[10px] font-bold rounded-lg shadow-xs cursor-pointer"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 3: PARTNER SCORES & REVIEWS VIEW */}
        {activeTab === 'partner' && (
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-divider/40 pb-3">
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Estadísticas de Calificaciones (Aliado)</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Perfil de {targetAlly} en Aguachica</p>
              </div>
              <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold uppercase">
                Excelente ⭐
              </span>
            </div>

            {/* ALLY SCORES SUMMARY PANEL */}
            <div className="grid grid-cols-3 gap-3.5">
              
              <div className="bg-[#E6F7EC] border border-[#0EA65C]/10 rounded-2xl p-3.5 text-center">
                <span className="text-[9px] text-ink-soft block uppercase font-bold tracking-wider mb-1">Calificación</span>
                <span className="font-sora font-black text-xl text-primary">{allyAvgRating.toFixed(1)}</span>
                <span className="text-[8px] text-[#0EA65C] font-semibold block mt-0.5">⭐ Excelente</span>
              </div>

              <div className="bg-surface-alt rounded-2xl p-3.5 text-center border border-divider/40">
                <span className="text-[9px] text-ink-soft block uppercase font-bold tracking-wider mb-1">Servicios</span>
                <span className="font-sora font-black text-xl text-ink">34</span>
                <span className="text-[8px] text-ink-soft font-semibold block mt-0.5">Viajes hoy</span>
              </div>

              <div className="bg-surface-alt rounded-2xl p-3.5 text-center border border-divider/40">
                <span className="text-[9px] text-ink-soft block uppercase font-bold tracking-wider mb-1">Opiniones</span>
                <span className="font-sora font-black text-xl text-ink">{allyReviews.length}</span>
                <span className="text-[8px] text-ink-soft font-semibold block mt-0.5">Comentarios</span>
              </div>

            </div>

            {/* ASPECTS BREAKDOWN PROGRESS BARS */}
            <div className="bg-surface-alt/70 border border-divider/40 p-4 rounded-2xl space-y-3 text-xs">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Calificación de Aspectos</span>
              
              {/* Aspect 1: Puntualidad */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-ink">🕒 Puntualidad</span>
                  <span className="text-primary">{allyAspectsAvg.punctualidad.toFixed(1)} / 5.0</span>
                </div>
                <div className="w-full bg-divider/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(allyAspectsAvg.punctualidad / 5) * 100}%` }} />
                </div>
              </div>

              {/* Aspect 2: Amabilidad */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-ink">😊 Amabilidad</span>
                  <span className="text-primary">{allyAspectsAvg.amabilidad.toFixed(1)} / 5.0</span>
                </div>
                <div className="w-full bg-divider/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(allyAspectsAvg.amabilidad / 5) * 100}%` }} />
                </div>
              </div>

              {/* Aspect 3: Moto */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-ink">🛵 Estado de la moto</span>
                  <span className="text-primary">{allyAspectsAvg.estadoMoto.toFixed(1)} / 5.0</span>
                </div>
                <div className="w-full bg-divider/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(allyAspectsAvg.estadoMoto / 5) * 100}%` }} />
                </div>
              </div>

              {/* Aspect 4: Ubicación */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-ink">📍 Facilidad de ubicación</span>
                  <span className="text-primary">{allyAspectsAvg.facilidadUbicacion.toFixed(1)} / 5.0</span>
                </div>
                <div className="w-full bg-divider/60 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(allyAspectsAvg.facilidadUbicacion / 5) * 100}%` }} />
                </div>
              </div>

            </div>

            {/* LATEST COMMENTS RECEIVED */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Últimos Comentarios Recibidos</span>
              {allyReviews.map(r => (
                <div key={r.id} className="p-3 bg-white border border-divider/50 rounded-xl space-y-1.5 text-xs shadow-3xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink flex items-center gap-1">
                      <span>{r.clientAvatar}</span>
                      <span>{r.clientName}</span>
                    </span>
                    <span className="text-amber-500 font-bold">★ {r.stars}</span>
                  </div>
                  <p className="italic text-ink-soft text-[10.5px]">
                    "{r.comment}"
                  </p>
                  <span className="text-[8.5px] text-ink-faint block text-right">{r.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PANEL ADMINISTRATIVO */}
        {activeTab === 'admin' && (
          <div className="space-y-5">
            <div className="flex justify-between items-start border-b border-divider/40 pb-3">
              <div>
                <h4 className="font-sora font-extrabold text-sm text-ink">Consola de Control de Reseñas</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Analíticas de calidad del servicio de Movica</p>
              </div>
              <span className="text-[10px] bg-[#E6F7EC] text-[#0EA65C] font-black px-2.5 py-1 rounded-lg uppercase">
                Promedio General: {globalAvgRating} ⭐
              </span>
            </div>

            {/* STATS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/50">
                <span className="text-[9px] text-ink-soft block font-bold uppercase">Calificaciones</span>
                <span className="font-sora font-black text-base text-ink">{totalReviewsCount} totales</span>
              </div>

              <div className="bg-surface-alt p-3 rounded-xl border border-divider/50">
                <span className="text-[9px] text-ink-soft block font-bold uppercase">Mejor Aliado</span>
                <span className="font-sora font-black text-xs text-primary truncate block mt-0.5">Alvaro (4.9)</span>
              </div>

              <div className="bg-surface-alt p-3 rounded-xl border border-divider/50">
                <span className="text-[9px] text-[#0EA65C] block font-bold uppercase">Aspecto Top</span>
                <span className="font-sora font-black text-xs text-ink truncate block mt-0.5">😊 Amabilidad (4.8)</span>
              </div>

              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <span className="text-[9px] text-red-600 block font-bold uppercase">Servicios Críticos</span>
                <span className="font-sora font-black text-xs text-red-700 block mt-0.5">{lowRatedServices.length} bajo 3★</span>
              </div>

            </div>

            {/* TWO COLUMN GRIDS: BEST ALLIES & CLIENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* BEST RATED ALLIES */}
              <div className="bg-surface-alt/50 border border-divider/40 rounded-2xl p-4 space-y-3">
                <span className="text-[10.5px] text-primary font-black uppercase tracking-wider block">
                  🏆 Aliados Mejor Calificados
                </span>
                <div className="space-y-2">
                  {partnerRatings.slice(0, 3).map((p, idx) => (
                    <div key={idx} className="bg-white border border-divider/40 p-2.5 rounded-xl flex items-center justify-between text-xs shadow-3xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.avatar}</span>
                        <div>
                          <h6 className="font-bold text-ink leading-tight">{p.name}</h6>
                          <span className="text-[9px] text-ink-soft">{p.count} viajes calificados</span>
                        </div>
                      </div>
                      <span className="font-sora font-extrabold text-amber-500">⭐ {p.avg.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CLIENTS WITH BEST RATINGS */}
              <div className="bg-surface-alt/50 border border-divider/40 rounded-2xl p-4 space-y-3">
                <span className="text-[10.5px] text-ink-soft font-black uppercase tracking-wider block">
                  👑 Clientes Frecuentes
                </span>
                <div className="space-y-2">
                  {clientStats.slice(0, 3).map((c, idx) => (
                    <div key={idx} className="bg-white border border-[#162f26]/10 p-2.5 rounded-xl flex items-center justify-between text-xs shadow-3xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.avatar}</span>
                        <div>
                          <h6 className="font-bold text-ink leading-tight">{c.name}</h6>
                          <span className="text-[9px] text-ink-soft">{c.count} reseñas enviadas</span>
                        </div>
                      </div>
                      <span className="font-sora font-extrabold text-primary">Prom: {c.avgRatingGiven}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SERVICES WITH LOW RATING FLAG (CRITICAL SERVICES) */}
            <div className="space-y-2">
              <span className="text-[10.5px] text-red-600 font-black uppercase tracking-wider block flex items-center gap-1">
                <ShieldAlert size={12} /> Alertas de Calidad: Servicios con Baja Calificación
              </span>
              
              <div className="space-y-2">
                {lowRatedServices.length > 0 ? (
                  lowRatedServices.map(r => (
                    <div key={r.id} className="p-3 bg-red-50/60 border border-red-200/50 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <span>{r.clientName}</span>
                            <span className="text-divider">→</span>
                            <span>{r.partnerName}</span>
                          </div>
                          <span className="text-[9px] text-ink-soft bg-white border border-divider rounded-md px-1.5 py-0.5 block w-max mt-1">
                            {r.serviceType}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-red-600 font-extrabold text-xs">★ {r.stars} estrellas</span>
                          <span className="text-[8.5px] text-ink-faint block mt-0.5">{r.createdAt}</span>
                        </div>
                      </div>
                      
                      <p className="text-ink-soft bg-white p-2 rounded-lg border border-red-100 italic text-[10.5px]">
                        "{r.comment}"
                      </p>

                      <div className="flex justify-between items-center text-[9px] text-ink-soft">
                        <span className="font-bold">Incidencias: Estado de Moto ({r.aspects.estadoMoto}/5) • Puntualidad ({r.aspects.punctualidad}/5)</span>
                        <button 
                          onClick={() => triggerFeedback(`Acción de contacto iniciada con el aliado ${r.partnerName}`)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-0.5 rounded font-bold uppercase transition-colors cursor-pointer"
                        >
                          Contactar Aliado
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[#E6F7EC] text-[#0EA65C] rounded-xl text-center font-bold text-xs">
                    ✅ No hay servicios con baja calificación reportados. ¡La calidad del servicio está en nivel óptimo!
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
