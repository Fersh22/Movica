import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, DollarSign, Clock, Percent, Users, Shield, Palette, Scale, 
  Save, Check, AlertTriangle, Eye, EyeOff, Plus, Trash2, Smartphone, 
  MapPin, Globe, Mail, Phone, Lock, Moon, Sun, Award, Zap, Calendar
} from 'lucide-react';

export default function GeneralConfig() {
  const [activeSubTab, setActiveSubTab] = useState<'empresa' | 'tarifas' | 'horarios' | 'comisiones' | 'usuarios' | 'seguridad' | 'apariencia' | 'legal'>('empresa');
  
  // Custom Toast state
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'info' }>({
    show: false,
    msg: '',
    type: 'success'
  });

  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- SUB-SECTIONS STATE ---

  // 1. Empresa
  const [empresa, setEmpresa] = useState({
    nombre: 'Movica SAS',
    eslogan: 'Movilidad inteligente y domicilios express en Aguachica',
    telefono: '+57 312 884 9900',
    email: 'contacto@movica.co',
    direccion: 'Calle 5 # 14-22, Aguachica, Cesar, Colombia',
    whatsapp: '+57 315 224 8899',
    instagram: '@movica.aguachica',
    facebook: 'facebook.com/movica.co',
    twitter: 'x.com/movica_co'
  });

  // 2. Tarifas
  const [tarifas, setTarifas] = useState({
    baseMototaxi: 2500,
    cuadrasIncluidas: 12,
    adicionalCuadra: 150,
    recargoNocturno: 1000,
    recargoLluvia: 1500,
    encomiendaBase: 4000,
    encomiendaKiloAdicional: 800,
    domicilioBase: 3500,
    compraComision: 12, // %
    mandadoBase: 4500
  });

  // 3. Horarios
  const [horarios, setHorarios] = useState({
    horaInicio: '05:00',
    horaFin: '23:30',
    horariosEspecialesFinde: true,
    horaFinFinde: '01:00',
    recargoFestivo: 1000,
    festivosActivos: [
      { id: '1', nombre: 'Año Nuevo (1 Enero)', activo: true },
      { id: '2', nombre: 'Día del Trabajo (1 Mayo)', activo: true },
      { id: '3', nombre: 'Batalla de Boyacá (7 Agosto)', activo: true },
      { id: '4', nombre: 'Independencia de Cartagena (11 Nov)', activo: false }
    ]
  });

  // 4. Comisiones
  const [comisiones, setComisiones] = useState({
    comisionPorcentaje: 15, // 15% Movica
    bonoDiarioMeta: 5000,
    viajesMetaDiaria: 10,
    incentivoReferidoConductor: 15000,
    incentivoReferidoCliente: 2000
  });

  // 5. Permisos de Usuarios Matrix
  const [permisos, setPermisos] = useState([
    { id: 'p1', desc: 'Ver Finanzas y Liquidaciones', admin: true, supervisor: true, operador: false, cliente: false, aliado: false },
    { id: 'p2', desc: 'Editar Tarifas y Recargos', admin: true, supervisor: false, operador: false, cliente: false, aliado: false },
    { id: 'p3', desc: 'Asignar Conductores Manualmente', admin: true, supervisor: true, operador: true, cliente: false, aliado: false },
    { id: 'p4', desc: 'Suspender Cuentas / Aliados', admin: true, supervisor: true, operador: false, cliente: false, aliado: false },
    { id: 'p5', desc: 'Chatear con soporte', admin: true, supervisor: true, operador: true, cliente: true, aliado: true },
    { id: 'p6', desc: 'Descargar reportes de auditoría', admin: true, supervisor: true, operador: false, cliente: false, aliado: false }
  ]);

  // 6. Seguridad
  const [seguridad, setSeguridad] = useState({
    sessionTimeout: '30_min',
    longitudMinimaClave: 8,
    requiereEspeciales: true,
    requiereMayusculas: true,
    verificacionCelularSMS: true,
    verificarSoatAliado: true,
    bloqueoIntentos: 5
  });

  // 7. Apariencia
  const [apariencia, setApariencia] = useState({
    colorPrincipal: 'emerald', // emerald | blue | amber | slate
    modoOscuroSimulado: false,
    tamanoFuente: 'medium',
    simboloVisual: '🛵'
  });

  // 8. Información Legal
  const [legal, setLegal] = useState({
    terminos: 'Términos y Condiciones Generales de Movica:\n\n1. Servicios de Intermediación: Movica actúa únicamente como facilitador tecnológico entre el Cliente Final y el Conductor Aliado Independiente.\n2. Cumplimiento de Normas: El conductor aliado asume el 100% de la responsabilidad vial, civil y contractual, obligándose a poseer SOAT vigente y licencia de categoría A2.\n3. Cancelaciones: Las cancelaciones injustificadas después de 3 minutos de asignado el conductor generarán un recargo de $1,000 COP en el próximo servicio.',
    privacidad: 'Políticas de Tratamiento de Datos Personales (Habeas Data):\n\nEn cumplimiento de la Ley 1581 de 2012, Movica recopila datos de ubicación satelital en tiempo real únicamente para trazar la ruta del viaje activo y garantizar la seguridad del aliado y el pasajero. Sus datos nunca serán vendidos o transferidos a centrales comerciales de publicidad sin autorización explícita.',
    cancelaciones: 'Políticas de Cancelación de Viajes:\n\n- Clientes: Cancelaciones gratis antes de 3 minutos. Pasado este tiempo se aplica tarifa de penalidad de $1,000 COP.\n- Aliados: El rechazo reiterativo o cancelación de viajes ya aceptados afectará directamente el índice de aceptación del conductor, lo que puede restringir el acceso prioritario al radar de asignación por un periodo de 2 a 12 horas.',
    reembolsos: 'Garantía y Políticas de Reembolsos de Movica:\n\nDado que Movica ofrece servicios de movilidad inmediata y entrega express de productos, los reembolsos se efectuarán únicamente si se comprueba por soporte georreferenciado que el servicio se debitó por pasarelas electrónicas de pago (Daviplata/Nequi) y no fue prestado debido a fallas imputables al aliado asignado.'
  });

  // Handlers
  const handleSaveSection = (sectionName: string) => {
    triggerToast(`Configuración de ${sectionName} guardada con éxito en Aguachica ✔`, 'success');
  };

  const handleTogglePermiso = (id: string, role: 'admin' | 'supervisor' | 'operador' | 'cliente' | 'aliado') => {
    setPermisos(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [role]: !p[role] };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Toast Notice */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 bg-[#0d1a16] text-white border border-primary/50 px-5 py-3 rounded-2xl shadow-xl z-[999] flex items-center gap-2.5 text-xs font-bold"
          >
            <span className="text-primary text-sm">●</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-xs">
        <h3 className="font-sora font-extrabold text-base text-ink">Centro de Configuración de Plataforma</h3>
        <p className="text-xs text-ink-soft mt-0.5">Controla tarifas, comisiones, horarios de funcionamiento, políticas de seguridad y variables de marca de Movica.</p>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT BAR: SUBTABS NAVIGATION */}
        <div className="lg:col-span-3 bg-white border border-divider/60 rounded-3xl p-3 shadow-xs space-y-1">
          {[
            { id: 'empresa', label: 'Datos Empresa', icon: <Building size={14} /> },
            { id: 'tarifas', label: 'Tarifario Oficial', icon: <DollarSign size={14} /> },
            { id: 'horarios', label: 'Horarios de Operación', icon: <Clock size={14} /> },
            { id: 'comisiones', label: 'Comisiones y Metas', icon: <Percent size={14} /> },
            { id: 'usuarios', label: 'Matriz de Permisos', icon: <Users size={14} /> },
            { id: 'seguridad', label: 'Seguridad y Accesos', icon: <Shield size={14} /> },
            { id: 'apariencia', label: 'Identidad Visual', icon: <Palette size={14} /> },
            { id: 'legal', label: 'Sección Legal', icon: <Scale size={14} /> }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSubTab(item.id as any)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeSubTab === item.id 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-ink-soft hover:bg-surface-alt hover:text-ink'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT COLUMN: CONFIG FORMS WITH ANIMATIONS */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-sm space-y-6"
            >
              
              {/* 1. EMPRESA */}
              {activeSubTab === 'empresa' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-sora font-extrabold text-sm text-ink">Identidad de la Empresa</h4>
                      <p className="text-[10.5px] text-ink-soft">Canales de soporte directo de cara al usuario final de Aguachica.</p>
                    </div>
                    <span className="text-xs bg-surface-alt px-2.5 py-1 rounded-lg font-bold border border-divider/30 text-ink-soft">Modulo 19</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Nombre de la Empresa</label>
                      <input 
                        type="text"
                        value={empresa.nombre}
                        onChange={e => setEmpresa({ ...empresa, nombre: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Eslogan Corporativo</label>
                      <input 
                        type="text"
                        value={empresa.eslogan}
                        onChange={e => setEmpresa({ ...empresa, eslogan: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Teléfono de Soporte</label>
                      <input 
                        type="text"
                        value={empresa.telefono}
                        onChange={e => setEmpresa({ ...empresa, telefono: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Correo Electrónico Oficial</label>
                      <input 
                        type="email"
                        value={empresa.email}
                        onChange={e => setEmpresa({ ...empresa, email: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Dirección Sede Principal</label>
                      <input 
                        type="text"
                        value={empresa.direccion}
                        onChange={e => setEmpresa({ ...empresa, direccion: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                      />
                    </div>
                  </div>

                  <div className="border-t border-divider/40 pt-5 space-y-4">
                    <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1.5">
                      <Globe size={13} className="text-primary" /> Enlaces de Redes Sociales
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">WhatsApp Soporte</label>
                        <input 
                          type="text"
                          value={empresa.whatsapp}
                          onChange={e => setEmpresa({ ...empresa, whatsapp: e.target.value })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Instagram</label>
                        <input 
                          type="text"
                          value={empresa.instagram}
                          onChange={e => setEmpresa({ ...empresa, instagram: e.target.value })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Facebook</label>
                        <input 
                          type="text"
                          value={empresa.facebook}
                          onChange={e => setEmpresa({ ...empresa, facebook: e.target.value })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Empresa')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Cambios
                    </button>
                  </div>
                </div>
              )}

              {/* 2. TARIFAS */}
              {activeSubTab === 'tarifas' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Tarifas y Costos de Operación</h4>
                    <p className="text-[10.5px] text-ink-soft">Configura la fórmula del taxímetro simulado para Aguachica y los recargos especiales.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Mototaxi Box */}
                    <div className="border border-divider/50 p-4.5 rounded-2xl bg-surface-alt/20 space-y-4">
                      <div className="flex items-center gap-2 border-b border-divider/40 pb-2">
                        <span className="text-xl">🛵</span>
                        <h5 className="font-sora font-extrabold text-xs text-ink">Parámetros Mototaxi</h5>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Tarifa Base ($)</label>
                          <input 
                            type="number"
                            value={tarifas.baseMototaxi}
                            onChange={e => setTarifas({ ...tarifas, baseMototaxi: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Cuadras Incluidas</label>
                          <input 
                            type="number"
                            value={tarifas.cuadrasIncluded}
                            onChange={e => setTarifas({ ...tarifas, cuadrasIncluded: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5 col-span-2">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Valor cuadra adicional ($)</label>
                          <input 
                            type="number"
                            value={tarifas.adicionalCuadra}
                            onChange={e => setTarifas({ ...tarifas, adicionalCuadra: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Domicilios & Encomiendas */}
                    <div className="border border-divider/50 p-4.5 rounded-2xl bg-surface-alt/20 space-y-4">
                      <div className="flex items-center gap-2 border-b border-divider/40 pb-2">
                        <span className="text-xl">📦</span>
                        <h5 className="font-sora font-extrabold text-xs text-ink">Parámetros Entregas</h5>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Base Encomiendas ($)</label>
                          <input 
                            type="number"
                            value={tarifas.encomiendaBase}
                            onChange={e => setTarifas({ ...tarifas, encomiendaBase: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">X Kilo Extra ($)</label>
                          <input 
                            type="number"
                            value={tarifas.encomiendaKiloAdicional}
                            onChange={e => setTarifas({ ...tarifas, encomiendaKiloAdicional: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5 col-span-2">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Base Domicilios (Alimentos/Tiendas) ($)</label>
                          <input 
                            type="number"
                            value={tarifas.domicilioBase}
                            onChange={e => setTarifas({ ...tarifas, domicilioBase: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Compras & Mandados */}
                    <div className="border border-divider/50 p-4.5 rounded-2xl bg-surface-alt/20 space-y-4">
                      <div className="flex items-center gap-2 border-b border-divider/40 pb-2">
                        <span className="text-xl">🛒</span>
                        <h5 className="font-sora font-extrabold text-xs text-ink">Compras & Mandados</h5>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Base Mandados ($)</label>
                          <input 
                            type="number"
                            value={tarifas.mandadoBase}
                            onChange={e => setTarifas({ ...tarifas, mandadoBase: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Comisión Compra (%)</label>
                          <input 
                            type="number"
                            value={tarifas.compraComision}
                            onChange={e => setTarifas({ ...tarifas, compraComision: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Global Surcharges */}
                    <div className="border border-divider/50 p-4.5 rounded-2xl bg-surface-alt/20 space-y-4">
                      <div className="flex items-center gap-2 border-b border-divider/40 pb-2">
                        <span className="text-xl">🌙</span>
                        <h5 className="font-sora font-extrabold text-xs text-ink">Recargos Climáticos / Horarios</h5>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Recargo Nocturno ($)</label>
                          <input 
                            type="number"
                            value={tarifas.recargoNocturno}
                            onChange={e => setTarifas({ ...tarifas, recargoNocturno: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9.5px] font-bold text-ink-soft">Recargo por Lluvia ($)</label>
                          <input 
                            type="number"
                            value={tarifas.recargoLluvia}
                            onChange={e => setTarifas({ ...tarifas, recargoLluvia: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Tarifas')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Tarifario
                    </button>
                  </div>
                </div>
              )}

              {/* 3. HORARIOS */}
              {activeSubTab === 'horarios' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Horarios de Funcionamiento</h4>
                    <p className="text-[10.5px] text-ink-soft">Define las horas hábiles en que los clientes pueden solicitar viajes.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Hora de Inicio General</label>
                        <input 
                          type="time"
                          value={horarios.horaInicio}
                          onChange={e => setHorarios({ ...horarios, horaInicio: e.target.value })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Hora de Cierre General</label>
                        <input 
                          type="time"
                          value={horarios.horaFin}
                          onChange={e => setHorarios({ ...horarios, horaFin: e.target.value })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink"
                        />
                      </div>

                      <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📅</span>
                          <span className="text-xs font-black text-amber-800">Horario Especial Fin de Semana</span>
                        </div>
                        <p className="text-[10px] text-amber-700/90 leading-relaxed font-semibold">
                          Permite extender el cierre hasta la madrugada los viernes y sábados para cubrir la demanda nocturna.
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[10.5px] font-bold text-ink-soft">Habilitar extensión:</span>
                          <button
                            type="button"
                            onClick={() => setHorarios({ ...horarios, horariosEspecialesFinde: !horarios.horariosEspecialesFinde })}
                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase cursor-pointer ${
                              horarios.horariosEspecialesFinde ? 'bg-primary text-white' : 'bg-divider text-ink-soft'
                            }`}
                          >
                            {horarios.horariosEspecialesFinde ? 'Activo' : 'Inactivo'}
                          </button>
                        </div>
                        {horarios.horariosEspecialesFinde && (
                          <div className="pt-2">
                            <label className="block text-[9px] font-bold text-ink-soft uppercase mb-1">Hora Cierre Fin de Semana</label>
                            <input 
                              type="time"
                              value={horarios.horaFinFinde}
                              onChange={e => setHorarios({ ...horarios, horaFinFinde: e.target.value })}
                              className="w-full bg-white border border-divider/60 rounded-lg px-2 py-1 text-xs font-bold text-ink"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Festivos Box */}
                    <div className="border border-divider/50 p-4.5 rounded-2xl bg-surface-alt/20 space-y-3.5">
                      <div>
                        <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1">
                          <Calendar size={13} className="text-primary" /> Recargo por Festivos
                        </h5>
                        <p className="text-[10px] text-ink-soft mt-0.5">Define los días festivos con recargo automático.</p>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1 bg-white p-3 rounded-xl border border-divider/40">
                          <label className="block text-[9px] font-black text-ink-soft uppercase">Valor del Recargo Festivo ($)</label>
                          <input 
                            type="number"
                            value={horarios.recargoFestivo}
                            onChange={e => setHorarios({ ...horarios, recargoFestivo: parseInt(e.target.value) || 0 })}
                            className="w-full border-0 p-0 text-xs font-black text-ink outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <span className="block text-[9px] font-black text-ink-soft uppercase tracking-wider">Días Festivos Activos:</span>
                          <div className="space-y-1.5">
                            {horarios.festivosActivos.map(fest => (
                              <label key={fest.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-divider/30 text-xs font-bold text-ink cursor-pointer">
                                <span>{fest.nombre}</span>
                                <input 
                                  type="checkbox"
                                  checked={fest.activo}
                                  onChange={() => {
                                    setHorarios({
                                      ...horarios,
                                      festivosActivos: horarios.festivosActivos.map(f => f.id === fest.id ? { ...f, activo: !f.activo } : f)
                                    });
                                  }}
                                  className="rounded border-divider text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Horarios')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Horarios
                    </button>
                  </div>
                </div>
              )}

              {/* 4. COMISIONES Y INCENTIVOS */}
              {activeSubTab === 'comisiones' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Esquema de Comisiones e Incentivos</h4>
                    <p className="text-[10.5px] text-ink-soft">Establece la retención aplicada a los aliados motorizados y las metas de rendimiento.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Retención Movica */}
                    <div className="border border-divider/50 p-5 rounded-2xl bg-surface-alt/30 space-y-4">
                      <div>
                        <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1.5">
                          <Percent size={13} className="text-primary" /> Retención de Comisión de Plataforma
                        </h5>
                        <p className="text-[10px] text-ink-soft mt-0.5">Porcentaje descontado del viaje al conductor aliado.</p>
                      </div>

                      <div className="space-y-3.5 pt-2">
                        <div className="flex justify-between items-center text-xs font-bold text-ink">
                          <span>Comisión de Movica:</span>
                          <span className="font-sora font-black text-sm text-primary">{comisiones.comisionPorcentaje}%</span>
                        </div>
                        <input 
                          type="range"
                          min="5"
                          max="30"
                          step="1"
                          value={comisiones.comisionPorcentaje}
                          onChange={e => setComisiones({ ...comisiones, comisionPorcentaje: parseInt(e.target.value) })}
                          className="w-full accent-primary cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-ink-faint font-bold">
                          <span>Min: 5%</span>
                          <span>Promedio Regional: 15%</span>
                          <span>Max: 30%</span>
                        </div>
                      </div>
                    </div>

                    {/* Incentivos por metas */}
                    <div className="border border-divider/50 p-5 rounded-2xl bg-surface-alt/30 space-y-4">
                      <div>
                        <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1.5">
                          <Award size={13} className="text-amber-500" /> Bonificaciones por Cumplimiento
                        </h5>
                        <p className="text-[10px] text-ink-soft mt-0.5">Premios económicos por metas de viajes diarios.</p>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9.5px] font-bold text-ink-soft">Meta (Viajes/Día)</label>
                            <input 
                              type="number"
                              value={comisiones.viajesMetaDiaria}
                              onChange={e => setComisiones({ ...comisiones, viajesMetaDiaria: parseInt(e.target.value) || 0 })}
                              className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9.5px] font-bold text-ink-soft">Bono Ganado ($)</label>
                            <input 
                              type="number"
                              value={comisiones.bonoDiarioMeta}
                              onChange={e => setComisiones({ ...comisiones, bonoDiarioMeta: parseInt(e.target.value) || 0 })}
                              className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2 text-xs font-bold text-ink font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Programas de Referidos */}
                    <div className="border border-divider/50 p-5 rounded-2xl bg-surface-alt/30 space-y-4 md:col-span-2">
                      <div>
                        <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1.5">
                          <Zap size={13} className="text-primary animate-pulse" /> Incentivos Plan Referidos
                        </h5>
                        <p className="text-[10px] text-ink-soft mt-0.5">Saldo de regalo otorgado al usuario que recomiende la plataforma.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Bono por Referir Conductor Aliado ($)</label>
                          <input 
                            type="number"
                            value={comisiones.incentivoReferidoConductor}
                            onChange={e => setComisiones({ ...comisiones, incentivoReferidoConductor: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2.5 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Bono por Referir Cliente Pasajero ($)</label>
                          <input 
                            type="number"
                            value={comisiones.incentivoReferidoCliente}
                            onChange={e => setComisiones({ ...comisiones, incentivoReferidoCliente: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-2.5 text-xs font-bold text-ink font-mono"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Comisiones')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Comisiones
                    </button>
                  </div>
                </div>
              )}

              {/* 5. PERMISOS DE USUARIOS (MATRIX) */}
              {activeSubTab === 'usuarios' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Matriz de Permisos y Roles de Usuario</h4>
                    <p className="text-[10.5px] text-ink-soft">Configura con precisión qué acciones tiene habilitadas cada rol en el ecosistema.</p>
                  </div>

                  <div className="bg-white border border-divider/50 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-alt/40 border-b border-divider/50 text-[10px] text-ink-soft uppercase font-black">
                            <th className="py-3 px-4">Acción / Permiso del Sistema</th>
                            <th className="py-3 px-2 text-center text-primary">Admin</th>
                            <th className="py-3 px-2 text-center text-amber-600">Superv.</th>
                            <th className="py-3 px-2 text-center text-blue-600">Operador</th>
                            <th className="py-3 px-2 text-center text-purple-600">Cliente</th>
                            <th className="py-3 px-2 text-center text-rose-600">Aliado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-divider/30 text-xs font-bold text-ink">
                          {permisos.map((perm) => (
                            <tr key={perm.id} className="hover:bg-surface-alt/15 transition-colors">
                              <td className="py-3.5 px-4 font-medium text-ink text-[11px]">{perm.desc}</td>
                              
                              <td className="py-3.5 px-2 text-center">
                                <input 
                                  type="checkbox"
                                  checked={perm.admin}
                                  onChange={() => handleTogglePermiso(perm.id, 'admin')}
                                  className="rounded border-divider text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                                />
                              </td>

                              <td className="py-3.5 px-2 text-center">
                                <input 
                                  type="checkbox"
                                  checked={perm.supervisor}
                                  onChange={() => handleTogglePermiso(perm.id, 'supervisor')}
                                  className="rounded border-divider text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                                />
                              </td>

                              <td className="py-3.5 px-2 text-center">
                                <input 
                                  type="checkbox"
                                  checked={perm.operador}
                                  onChange={() => handleTogglePermiso(perm.id, 'operador')}
                                  className="rounded border-divider text-blue-500 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                                />
                              </td>

                              <td className="py-3.5 px-2 text-center">
                                <input 
                                  type="checkbox"
                                  checked={perm.cliente}
                                  onChange={() => handleTogglePermiso(perm.id, 'cliente')}
                                  className="rounded border-divider text-purple-500 focus:ring-purple-500 w-3.5 h-3.5 cursor-pointer"
                                />
                              </td>

                              <td className="py-3.5 px-2 text-center">
                                <input 
                                  type="checkbox"
                                  checked={perm.aliado}
                                  onChange={() => handleTogglePermiso(perm.id, 'aliado')}
                                  className="rounded border-divider text-rose-500 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
                                />
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-[#E6F7EC] text-primary-dark p-3.5 rounded-2xl text-[10px] leading-relaxed font-bold flex gap-2">
                    <Shield size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Nota de Seguridad:</strong> Los administradores conservan acceso absoluto de solo lectura y escritura en todas las tablas transaccionales por defecto. Las modificaciones en esta matriz alterarán los accesos simulados en tiempo real.
                    </span>
                  </div>

                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Permisos de Roles')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Permisos
                    </button>
                  </div>
                </div>
              )}

              {/* 6. SEGURIDAD */}
              {activeSubTab === 'seguridad' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Políticas de Seguridad y Autenticación</h4>
                    <p className="text-[10.5px] text-ink-soft">Administra las barreras contra accesos maliciosos y validaciones de cuenta.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Cierre de Sesión por Inactividad</label>
                        <select 
                          value={seguridad.sessionTimeout}
                          onChange={e => setSeguridad({ ...seguridad, sessionTimeout: e.target.value })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink cursor-pointer"
                        >
                          <option value="5_min">5 minutos</option>
                          <option value="15_min">15 minutos</option>
                          <option value="30_min">30 minutos</option>
                          <option value="1_hora">1 hora</option>
                          <option value="nunca">Nunca cerrar sesión</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Bloqueo por Intentos Fallidos</label>
                        <select 
                          value={seguridad.bloqueoIntentos}
                          onChange={e => setSeguridad({ ...seguridad, bloqueoIntentos: parseInt(e.target.value) || 5 })}
                          className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink cursor-pointer"
                        >
                          <option value="3">3 intentos</option>
                          <option value="5">5 intentos (Recomendado)</option>
                          <option value="10">10 intentos</option>
                        </select>
                      </div>

                      <div className="p-4 bg-rose-50 border border-rose-150 rounded-2xl space-y-1">
                        <h5 className="text-[11px] font-black text-rose-800 uppercase flex items-center gap-1.5">
                          <AlertTriangle size={13} className="text-rose-600" /> Alertas de Acceso Sospechoso
                        </h5>
                        <p className="text-[10px] text-rose-700/90 leading-relaxed font-semibold">
                          Cuando se detecte inicio de sesión desde un nuevo dispositivo, se enviará un código OTP de reseteo preventivo de sesión.
                        </p>
                      </div>
                    </div>

                    <div className="border border-divider/50 p-4.5 rounded-2xl bg-surface-alt/20 space-y-4">
                      <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1.5">
                        <Lock size={13} className="text-primary" /> Políticas de Credenciales & Verificación
                      </h5>

                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-ink-soft">Longitud Mínima de Contraseña</label>
                          <input 
                            type="number"
                            min="6"
                            max="20"
                            value={seguridad.longitudMinimaClave}
                            onChange={e => setSeguridad({ ...seguridad, longitudMinimaClave: parseInt(e.target.value) || 8 })}
                            className="w-full bg-white border border-divider/60 rounded-xl px-3 py-1.5 text-xs font-bold text-ink font-mono"
                          />
                        </div>

                        <label className="flex items-center justify-between p-2 bg-white rounded-xl border border-divider/30 text-xs font-bold text-ink cursor-pointer">
                          <span>Requiere Carácter Especial (!@#)</span>
                          <input 
                            type="checkbox"
                            checked={seguridad.requiereEspeciales}
                            onChange={() => setSeguridad({ ...seguridad, requiereEspeciales: !seguridad.requiereEspeciales })}
                            className="rounded border-divider text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2 bg-white rounded-xl border border-divider/30 text-xs font-bold text-ink cursor-pointer">
                          <span>Requiere Letra Mayúscula (A-Z)</span>
                          <input 
                            type="checkbox"
                            checked={seguridad.requiereMayusculas}
                            onChange={() => setSeguridad({ ...seguridad, requiereMayusculas: !seguridad.requiereMayusculas })}
                            className="rounded border-divider text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2 bg-white rounded-xl border border-divider/30 text-xs font-bold text-ink cursor-pointer">
                          <span>Verificar Celular por SMS (OTP)</span>
                          <input 
                            type="checkbox"
                            checked={seguridad.verificacionCelularSMS}
                            onChange={() => setSeguridad({ ...seguridad, verificacionCelularSMS: !seguridad.verificacionCelularSMS })}
                            className="rounded border-divider text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2 bg-white rounded-xl border border-divider/30 text-xs font-bold text-ink cursor-pointer">
                          <span>Exigir Validación de SOAT Aliados</span>
                          <input 
                            type="checkbox"
                            checked={seguridad.verificarSoatAliado}
                            onChange={() => setSeguridad({ ...seguridad, verificarSoatAliado: !seguridad.verificarSoatAliado })}
                            className="rounded border-divider text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Seguridad')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Parámetros de Seguridad
                    </button>
                  </div>
                </div>
              )}

              {/* 7. APARIENCIA */}
              {activeSubTab === 'apariencia' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Apariencia y Colores de la Marca</h4>
                    <p className="text-[10.5px] text-ink-soft">Personaliza la interfaz de cara a los usuarios en las aplicaciones móviles.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    <div className="md:col-span-7 space-y-5">
                      <div className="space-y-2">
                        <span className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Paleta de Color Principal (Simulada)</span>
                        <div className="grid grid-cols-4 gap-2.5">
                          {[
                            { id: 'emerald', bg: 'bg-[#0EA65C]', border: 'border-emerald-600', name: 'Premium Emerald' },
                            { id: 'blue', bg: 'bg-[#0066FF]', border: 'border-blue-600', name: 'Classic Blue' },
                            { id: 'amber', bg: 'bg-[#F59E0B]', border: 'border-amber-600', name: 'Amber Glow' },
                            { id: 'slate', bg: 'bg-[#0d1a16]', border: 'border-black', name: 'Cosmic Slate' }
                          ].map(col => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => {
                                setApariencia({ ...apariencia, colorPrincipal: col.id });
                                triggerToast(`Color de marca cambiado a ${col.name} (Simulado en la app)`, 'info');
                              }}
                              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                apariencia.colorPrincipal === col.id 
                                  ? 'border-primary ring-2 ring-primary/20 bg-surface-alt' 
                                  : 'border-divider bg-white'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-full ${col.bg} block mx-auto shadow-2xs`} />
                              <span className="text-[9.5px] font-bold text-ink mt-2 block leading-none">{col.id}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Modo Oscuro / Claro Simulador</span>
                        <div className="flex bg-surface-alt p-1.5 rounded-2xl border border-divider/40 gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setApariencia({ ...apariencia, modoOscuroSimulado: false });
                              triggerToast("Cambiado a Modo Claro", 'info');
                            }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                              !apariencia.modoOscuroSimulado 
                                ? 'bg-white text-primary shadow-xs border border-divider/40' 
                                : 'text-ink-soft'
                            }`}
                          >
                            <Sun size={14} /> Modo Claro
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setApariencia({ ...apariencia, modoOscuroSimulado: true });
                              triggerToast("Modo Oscuro (Simulado en app móvil)", 'info');
                            }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                              apariencia.modoOscuroSimulado 
                                ? 'bg-[#0d1a16] text-white shadow-xs border border-white/5' 
                                : 'text-ink-soft'
                            }`}
                          >
                            <Moon size={14} /> Modo Oscuro (Noche)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Símbolo Iconografía App</label>
                          <select
                            value={apariencia.simboloVisual}
                            onChange={e => setApariencia({ ...apariencia, simboloVisual: e.target.value })}
                            className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink cursor-pointer"
                          >
                            <option value="🛵">🛵 Moto clásica</option>
                            <option value="🏍️">🏍️ Moto deportiva</option>
                            <option value="⚡">⚡ Rayo eléctrico</option>
                            <option value="📦">📦 Caja express</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Tamaño de Fuente Principal</label>
                          <select
                            value={apariencia.tamanoFuente}
                            onChange={e => setApariencia({ ...apariencia, tamanoFuente: e.target.value })}
                            className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-ink cursor-pointer"
                          >
                            <option value="small">Pequeño (11px)</option>
                            <option value="medium">Estándar (12px)</option>
                            <option value="large">Grande (14px)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* LIVE SIMULATION BOX ON THE RIGHT */}
                    <div className="md:col-span-5 border border-divider/60 rounded-3xl overflow-hidden shadow-sm bg-surface-alt/30 p-4.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-primary uppercase bg-emerald-50 px-2 py-0.5 rounded-lg border border-primary/20">Simulador de Teléfono</span>
                        <h5 className="font-sora font-extrabold text-[11px] text-ink">Vista Previa Cliente</h5>
                      </div>

                      <div className={`my-4 border border-divider/50 rounded-2xl p-4 shadow-3xs transition-all ${
                        apariencia.modoOscuroSimulado ? 'bg-[#0d1a16] text-white' : 'bg-white text-ink'
                      }`}>
                        {/* Mock top bar */}
                        <div className="flex justify-between items-center text-[9px] font-mono text-ink-soft opacity-60 mb-3">
                          <span>10:14 AM</span>
                          <span>📶 5G 🔋 98%</span>
                        </div>

                        {/* App header logo text representation */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <span className="text-xl">{apariencia.simboloVisual}</span>
                          <span className="font-sora font-extrabold text-sm tracking-tight">Movica SAS</span>
                        </div>

                        {/* Active order button mock using customized visual style */}
                        <div className={`p-3 rounded-xl space-y-1.5 ${
                          apariencia.modoOscuroSimulado ? 'bg-white/5 border border-white/10' : 'bg-surface-alt/50 border border-divider/30'
                        }`}>
                          <span className="text-[9.5px] font-black opacity-70 uppercase tracking-wider block">Tu próximo viaje</span>
                          <span className="font-sora font-bold text-xs">Parque Principal → Calle 5</span>
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold mt-1">
                            <span className="text-[#0EA65C]">$5.000 COP</span>
                            <span className="text-primary text-[9px] uppercase font-black">Asignado 🏍️</span>
                          </div>
                        </div>

                        {/* Call to action customized by chosen style color */}
                        <button
                          type="button"
                          className={`w-full mt-4 text-[10px] font-black uppercase py-2 rounded-xl text-white transition-all ${
                            apariencia.colorPrincipal === 'emerald' ? 'bg-[#0EA65C]' :
                            apariencia.colorPrincipal === 'blue' ? 'bg-[#0066FF]' :
                            apariencia.colorPrincipal === 'amber' ? 'bg-[#F59E0B]' : 'bg-[#1e293b]'
                          }`}
                        >
                          Solicitar Servicio
                        </button>
                      </div>

                      <div className="text-[9.5px] text-ink-soft font-bold text-center leading-relaxed">
                        Los clientes de Aguachica recibirán esta interfaz según el esquema guardado.
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Apariencia')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Apariencia
                    </button>
                  </div>
                </div>
              )}

              {/* 8. SECCIÓN LEGAL */}
              {activeSubTab === 'legal' && (
                <div className="space-y-6">
                  <div className="border-b border-divider/40 pb-4">
                    <h4 className="font-sora font-extrabold text-sm text-ink">Información Legal y Contractual</h4>
                    <p className="text-[10.5px] text-ink-soft">Redacta y modifica las cláusulas que rigen los servicios tecnológicos de Movica.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Términos y Condiciones Generales</label>
                      <textarea
                        rows={4}
                        value={legal.terminos}
                        onChange={e => setLegal({ ...legal, terminos: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-medium font-sans leading-relaxed resize-none text-ink"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Política de Tratamiento de Datos (Privacidad)</label>
                      <textarea
                        rows={4}
                        value={legal.privacidad}
                        onChange={e => setLegal({ ...legal, privacidad: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-medium font-sans leading-relaxed resize-none text-ink"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Políticas de Cancelación de Servicios</label>
                      <textarea
                        rows={3}
                        value={legal.cancelaciones}
                        onChange={e => setLegal({ ...legal, cancelaciones: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-medium font-sans leading-relaxed resize-none text-ink"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-ink-soft uppercase tracking-wider">Política de Garantía y Reembolsos</label>
                      <textarea
                        rows={3}
                        value={legal.reembolsos}
                        onChange={e => setLegal({ ...legal, reembolsos: e.target.value })}
                        className="w-full bg-surface-alt border-0 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-medium font-sans leading-relaxed resize-none text-ink"
                      />
                    </div>
                  </div>

                  <div className="border-t border-divider/40 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSection('Sección Legal')}
                      className="bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Save size={13} /> Guardar Textos Legales
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
