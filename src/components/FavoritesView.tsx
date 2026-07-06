import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, Trash2, X, Star, Heart } from 'lucide-react';
import { Favorite } from '../types';

interface FavoritesViewProps {
  favorites: Favorite[];
  onAddFavorite: (fav: Omit<Favorite, 'id'>) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesView({ favorites, onAddFavorite, onRemoveFavorite }: FavoritesViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [icon, setIcon] = useState('🏠');

  const icons = ['🏠', '💼', '🎓', '❤️', '🛒', '🍕', '🏋️', '🌳', '🔑'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !address.trim()) return;

    onAddFavorite({
      label: label.trim(),
      address: address.trim(),
      icon
    });

    // Reset and close
    setLabel('');
    setAddress('');
    setIcon('🏠');
    setShowAddModal(false);
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-extrabold text-xl text-ink">Direcciones Favoritas</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-surface text-primary hover:bg-primary hover:text-white font-sora py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary-surface text-primary flex items-center justify-center text-3xl shadow-inner">
            ❤️
          </div>
          <h2 className="font-sora font-bold text-lg text-ink">Sin favoritos todavía</h2>
          <p className="text-xs text-ink-soft max-w-[240px] leading-relaxed">
            Guarda tus direcciones y negocios favoritos para pedir más rápido.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {favorites.map(fav => (
            <div
              key={fav.id}
              className="bg-white border border-divider/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all relative group"
            >
              <div className="w-11 h-11 rounded-xl bg-surface-alt flex items-center justify-center text-xl flex-shrink-0">
                {fav.icon}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-sora font-bold text-sm text-ink">{fav.label}</h4>
                <p className="text-xs text-ink-soft truncate mt-0.5">{fav.address}</p>
              </div>
              <button
                onClick={() => onRemoveFavorite(fav.id)}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Eliminar favorito"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD FAVORITE MODAL SHEET */}
      {showAddModal && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col pt-12 animate-slideUp">
          <div className="px-6 pb-4 border-b border-divider flex items-center justify-between">
            <span className="font-sora font-bold text-base text-ink">Nuevo Favorito</span>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-ink cursor-pointer hover:bg-divider transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1.5">
                  Nombre de Referencia
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="Ej: Casa de Mamá, Universidad, Oficina"
                  className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-1.5">
                  Dirección Detallada
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Calle, Carrera, Edificio o Local..."
                  className="w-full bg-surface-alt border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Icon / Emoji */}
              <div>
                <label className="block text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">
                  Icono Representativo
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {icons.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`text-xl p-2.5 rounded-xl border transition-all ${
                        icon === emoji
                          ? 'border-primary bg-primary-surface scale-105'
                          : 'border-divider bg-white hover:bg-surface-alt'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-sora py-4 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              Guardar en Favoritos
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
