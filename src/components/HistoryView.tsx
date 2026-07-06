import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Bike, ChevronRight, X, Phone, Check, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { Order } from '../types';
import RatingsSystem from './RatingsSystem';

interface HistoryViewProps {
  orders: Order[];
  onCancelOrder?: (id: string) => void;
}

export default function HistoryView({ orders, onCancelOrder }: HistoryViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'solicitado':
        return (
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            Solicitado
          </span>
        );
      case 'asignado':
        return (
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            Asignado
          </span>
        );
      case 'en_camino':
        return (
          <span className="text-xs bg-primary-surface text-primary-dark font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            En Camino
          </span>
        );
      case 'completado':
        return (
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Check size={12} />
            Completado
          </span>
        );
      case 'cancelado':
        return (
          <span className="text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <X size={12} />
            Cancelado
          </span>
        );
    }
  };

  const getServiceEmoji = (type: Order['type']) => {
    switch (type) {
      case 'mototaxi': return '🛵';
      case 'domicilio': return '🍔';
      case 'encomienda': return '📦';
      case 'compra': return '🛒';
      case 'mandado': return '📋';
    }
  };

  return (
    <div className="w-full h-full relative">
      <h2 className="font-sora font-extrabold text-xl text-ink mb-4">Tu Historial</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary-surface text-primary flex items-center justify-center text-3xl shadow-inner">
            📜
          </div>
          <h2 className="font-sora font-bold text-lg text-ink">Aún no tienes viajes</h2>
          <p className="text-xs text-ink-soft max-w-[240px] leading-relaxed">
            Cuando uses un servicio de Movica, tu historial aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {orders.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white border border-divider/50 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-alt flex items-center justify-center text-2xl flex-shrink-0">
                {getServiceEmoji(order.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-sora font-bold text-sm text-ink truncate">{order.title}</h4>
                  <span className="text-[10px] text-ink-faint font-semibold font-mono">{order.id}</span>
                </div>
                <p className="text-xs text-ink-soft truncate mt-0.5">{order.details}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className="text-[10px] text-ink-soft font-medium flex items-center gap-1">
                    <Clock size={10} /> {order.date}
                  </span>
                  <span className="text-xs font-bold text-primary">${order.price.toLocaleString('es-CO')}</span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center text-ink-soft flex-shrink-0">
                <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDER DETAILS OVERLAY */}
      {selectedOrder && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12 animate-slideUp">
          <div className="px-6 pb-4 border-b border-divider flex items-center justify-between">
            <span className="font-sora font-bold text-base text-ink">Detalle del Servicio</span>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 content-scrollbar pb-24">
            {/* Header / ID & Status */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-ink-soft font-bold font-mono uppercase tracking-wider block">ID: {selectedOrder.id}</span>
                <h3 className="font-sora font-extrabold text-base text-ink mt-0.5">{selectedOrder.title}</h3>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Price block */}
            <div className="bg-primary-surface/40 p-4 rounded-2xl border border-primary-surface/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-ink-soft font-semibold block">Total del servicio</span>
                <span className="text-[10px] text-primary-dark font-medium">Pago acordado en efectivo / transferencia</span>
              </div>
              <span className="font-sora font-extrabold text-lg text-primary-dark">${selectedOrder.price.toLocaleString('es-CO')} COP</span>
            </div>

            {/* Addresses route */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Ruta del Servicio</h4>
              <div className="relative pl-6 space-y-4 border-l border-dashed border-divider ml-2.5">
                <div className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-primary"></div>
                <div>
                  <span className="text-[10px] font-extrabold text-primary uppercase block">Punto de Recogida / Inicio</span>
                  <p className="text-xs text-ink font-semibold mt-0.5">{selectedOrder.pickupAddress || 'No especificado'}</p>
                </div>
                
                <div className="absolute -left-1 bottom-1 w-2.5 h-2.5 rounded-full bg-accent"></div>
                <div>
                  <span className="text-[10px] font-extrabold text-accent uppercase block">Punto de Entrega / Fin</span>
                  <p className="text-xs text-ink font-semibold mt-0.5">{selectedOrder.deliveryAddress || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Order items if Domicilio */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Productos solicitados</h4>
                <div className="bg-surface-alt p-3.5 rounded-xl space-y-2 border border-divider/50">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-medium">
                      <span className="text-ink">{item.qty}x {item.name}</span>
                      <span className="text-ink-soft">${(item.price * item.qty).toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                  <div className="border-t border-divider pt-2 flex justify-between text-xs font-bold text-ink">
                    <span>Costo Productos</span>
                    <span>${selectedOrder.items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {selectedOrder.instructions && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Notas / Instrucciones</h4>
                <div className="bg-amber-500/5 p-3.5 rounded-xl border border-accent/20 text-xs font-medium text-ink-soft leading-relaxed">
                  {selectedOrder.instructions}
                </div>
              </div>
            )}

            {/* Driver Profile */}
            {selectedOrder.driver && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Tu Conductor Asignado</h4>
                <div className="bg-surface-alt/70 p-4 rounded-2xl border border-divider flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-surface text-2xl flex items-center justify-center flex-shrink-0">
                    {selectedOrder.driver.avatar}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h5 className="font-bold text-sm text-ink">{selectedOrder.driver.name}</h5>
                    <p className="text-[11px] text-ink-soft mt-0.5">{selectedOrder.driver.vehicle} • <span className="font-mono bg-divider px-1.5 py-0.5 rounded text-[10px] text-ink">{selectedOrder.driver.plate}</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-extrabold text-primary">★ {selectedOrder.driver.rating}</span>
                    <a
                      href={`tel:${selectedOrder.driver.phone}`}
                      className="w-8 h-8 rounded-full bg-primary-surface text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      <Phone size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Rating Section if completado */}
            {selectedOrder.status === 'completado' && (
              <div className="pt-2 border-t border-divider/60 space-y-3">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <h4 className="font-sora font-extrabold text-xs text-ink">¿Cómo estuvo este servicio de {selectedOrder.driver?.name || 'nuestro aliado'}?</h4>
                      <p className="text-[10px] text-ink-soft leading-relaxed">Déjanos tu opinión y califica los aspectos técnicos del viaje.</p>
                    </div>
                  </div>
                  
                  {/* Embedded Ratings Form */}
                  <div className="bg-white rounded-2xl border border-divider/40 p-2 shadow-xs">
                    <RatingsSystem initialViewMode="form" />
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Action if solicitado */}
            {selectedOrder.status === 'solicitado' && onCancelOrder && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    onCancelOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-sora py-3.5 rounded-xl text-xs font-bold border border-red-200/50 transition-all cursor-pointer active:scale-95"
                >
                  Cancelar Solicitud
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
