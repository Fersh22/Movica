import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, AlertTriangle, UserX, Trash2, Check, Clock, UserCheck, 
  Search, Filter, ShieldAlert, BarChart3, Users, Bike, Store, 
  Eye, Archive, MessageSquare, Calendar, RefreshCw, Sliders, X, 
  FileText, ShieldCheck, Mail, Send, Ban, ArrowDownRight, ArrowUpRight
} from 'lucide-react';

// Data Interfaces
export interface ModerationReport {
  id: string;
  reporterName: string;
  reportedUserType: 'cliente' | 'aliado' | 'comercio';
  reportedUserId: string;
  reportedUserName: string;
  motive: string;
  date: string;
  status: 'pendiente' | 'archivado' | 'advertido' | 'suspendido' | 'bloqueado';
  evidenceText: string;
  evidenceImage?: string; // Gradient class placeholder
}

export interface SanctionHistory {
  id: string;
  userName: string;
  userType: 'cliente' | 'aliado' | 'comercio';
  actionTaken: 'advertencia' | 'suspensión' | 'bloqueo' | 'restablecer';
  motive: string;
  date: string;
  operator: string;
  duration?: string; // for suspension
}

const DEFAULT_REPORTS: ModerationReport[] = [
  {
    id: 'REP-001',
    reporterName: 'Carlos Mario Tobón (Cliente)',
    reportedUserType: 'aliado',
    reportedUserId: 'ALY-01',
    reportedUserName: 'Camilo Torres',
    motive: 'Cobro de tarifa superior a la acordada en la aplicación',
    date: '2026-07-05',
    status: 'pendiente',
    evidenceText: 'El aliado me cobró $5.000 COP extra por concepto de lluvia artificial, cuando el clima estaba soleado y la app ya marcaba el total cerrado.',
    evidenceImage: 'from-amber-400 to-orange-500'
  },
  {
    id: 'REP-002',
    reporterName: 'Diana Rueda (Aliado)',
    reportedUserType: 'cliente',
    reportedUserId: 'CLI-552',
    reportedUserName: 'Santiago Bermúdez',
    motive: 'Cliente ausente y falta de respeto en punto de entrega',
    date: '2026-07-04',
    status: 'pendiente',
    evidenceText: 'Llegué con el pedido caliente a la dirección. El cliente me hizo esperar 25 minutos afuera, luego salió en estado alterado y usó lenguaje soez para descalificar mi trabajo.',
    evidenceImage: 'from-rose-400 to-red-600'
  },
  {
    id: 'REP-003',
    reporterName: 'María Fernanda (Cliente)',
    reportedUserType: 'comercio',
    reportedUserId: 'MERCH-001',
    reportedUserName: 'El Gran Sabor',
    motive: 'Ingredientes en mal estado o producto vencido',
    date: '2026-07-05',
    status: 'pendiente',
    evidenceText: 'La hamburguesa doble traía la lechuga totalmente marchita y el queso desprendía un olor agrio muy fuerte. Tuve que botar el pedido por riesgo de salud.',
    evidenceImage: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'REP-004',
    reporterName: 'Soporte Automático (Movica)',
    reportedUserType: 'aliado',
    reportedUserId: 'ALY-05',
    reportedUserName: 'Brayan Sneider Rojas',
    motive: 'Desviación frecuente de ruta y retrasos severos',
    date: '2026-07-02',
    status: 'archivado',
    evidenceText: 'El GPS del dispositivo detectó 3 desvíos no autorizados superiores a 4 kilómetros durante servicios activos de mensajería.',
    evidenceImage: 'from-slate-600 to-slate-800'
  }
];

const DEFAULT_SANCTIONS: SanctionHistory[] = [
  {
    id: 'SANC-001',
    userName: 'Jessica Alarcón',
    userType: 'cliente',
    actionTaken: 'advertencia',
    motive: 'Cancelación recurrente de servicios en curso',
    date: '2026-07-01',
    operator: 'Admin General',
  },
  {
    id: 'SANC-002',
    userName: 'Juan Pérez',
    userType: 'aliado',
    actionTaken: 'suspensión',
    motive: 'Comportamiento no profesional reportado por comercio',
    date: '2026-06-28',
    operator: 'Supervisor Nocturno',
    duration: '48 Horas'
  },
  {
    id: 'SANC-003',
    userName: 'Inversiones El Chino',
    userType: 'comercio',
    actionTaken: 'bloqueo',
    motive: 'Venta de productos no autorizados o prohibidos',
    date: '2026-06-25',
    operator: 'Admin General'
  }
];

// Helper to initialize database
export function initializeModerationDB() {
  if (!localStorage.getItem('movica_reports')) {
    localStorage.setItem('movica_reports', JSON.stringify(DEFAULT_REPORTS));
  }
  if (!localStorage.getItem('movica_sanctions')) {
    localStorage.setItem('movica_sanctions', JSON.stringify(DEFAULT_SANCTIONS));
  }
}

export function getStoredReports(): ModerationReport[] {
  initializeModerationDB();
  const raw = localStorage.getItem('movica_reports');
  return raw ? JSON.parse(raw) : DEFAULT_REPORTS;
}

export function saveStoredReports(reports: ModerationReport[]) {
  localStorage.setItem('movica_reports', JSON.stringify(reports));
}

export function getStoredSanctions(): SanctionHistory[] {
  initializeModerationDB();
  const raw = localStorage.getItem('movica_sanctions');
  return raw ? JSON.parse(raw) : DEFAULT_SANCTIONS;
}

export function saveStoredSanctions(sanctions: SanctionHistory[]) {
  localStorage.setItem('movica_sanctions', JSON.stringify(sanctions));
}

export default function ModerationManager() {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [sanctions, setSanctions] = useState<SanctionHistory[]>([]);
  
  // Selected Report for detail view or action
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  
  // Active moderation layout tab
  const [activeSubTab, setActiveSubTab] = useState<'pendientes' | 'historial' | 'estadisticas'>('pendientes');

  // Filters
  const [filterUserType, setFilterUserType] = useState<'all' | 'cliente' | 'aliado' | 'comercio'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyActionFilter, setHistoryActionFilter] = useState<'all' | 'advertencia' | 'suspensión' | 'bloqueo' | 'restablecer'>('all');

  // Action dialog states
  const [actioningUser, setActioningUser] = useState<{ id: string; name: string; type: 'cliente' | 'aliado' | 'comercio'; reportId?: string } | null>(null);
  const [actionType, setActionType] = useState<'advertencia' | 'suspensión' | 'bloqueo' | 'restablecer'>('advertencia');
  const [actionMotive, setActionMotive] = useState('');
  const [actionDuration, setActionDuration] = useState('24 Horas');

  useEffect(() => {
    setReports(getStoredReports());
    setSanctions(getStoredSanctions());
  }, []);

  // Actions execution
  const executeModerationAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actioningUser || !actionMotive.trim()) return;

    // 1. Create sanction log entry
    const newSanction: SanctionHistory = {
      id: `SANC-0${sanctions.length + 10}`,
      userName: actioningUser.name,
      userType: actioningUser.type,
      actionTaken: actionType,
      motive: actionMotive,
      date: new Date().toISOString().split('T')[0],
      operator: 'Moderador de Guardia',
      duration: actionType === 'suspensión' ? actionDuration : undefined
    };

    const updatedSanctions = [newSanction, ...sanctions];
    setSanctions(updatedSanctions);
    saveStoredSanctions(updatedSanctions);

    // 2. Update the report status if associated
    if (actioningUser.reportId) {
      const updatedReports = reports.map(rep => {
        if (rep.id === actioningUser.reportId) {
          const statusMap: Record<string, ModerationReport['status']> = {
            'advertencia': 'advertido',
            'suspensión': 'suspendido',
            'bloqueo': 'bloqueado',
            'restablecer': 'pendiente'
          };
          return { ...rep, status: statusMap[actionType] || 'pendiente' };
        }
        return rep;
      });
      setReports(updatedReports);
      saveStoredReports(updatedReports);
    }

    alert(`Acción completada: Se ha registrado la medida de "${actionType.toUpperCase()}" para el usuario ${actioningUser.name}.`);
    setActioningUser(null);
    setSelectedReport(null);
    setActionMotive('');
  };

  const handleArchiveReport = (reportId: string) => {
    if (confirm('¿Deseas archivar este reporte sin aplicar sanciones adicionales?')) {
      const updated = reports.map(rep => {
        if (rep.id === reportId) {
          return { ...rep, status: 'archivado' as const };
        }
        return rep;
      });
      setReports(updated);
      saveStoredReports(updated);
      setSelectedReport(null);
      alert('Reporte archivado y guardado en el histórico de resolución.');
    }
  };

  const handleRestoreAccess = (userName: string, userType: 'cliente' | 'aliado' | 'comercio') => {
    setActioningUser({ id: 'N/A', name: userName, type: userType });
    setActionType('restablecer');
    setActionMotive('Comportamiento corregido o plazo cumplido exitosamente.');
  };

  // Filter calculations
  const pendingReports = reports.filter(r => r.status === 'pendiente');
  const archivedReports = reports.filter(r => r.status === 'archivado');

  const filteredReportsList = reports.filter(r => {
    if (filterUserType !== 'all' && r.reportedUserType !== filterUserType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.reportedUserName.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.motive.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredHistoryList = sanctions.filter(s => {
    if (historyActionFilter !== 'all' && s.actionTaken !== historyActionFilter) return false;
    if (historySearchQuery) {
      const q = historySearchQuery.toLowerCase();
      return (
        s.userName.toLowerCase().includes(q) ||
        s.motive.toLowerCase().includes(q) ||
        s.operator.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats
  const totalBlocked = sanctions.filter(s => s.actionTaken === 'bloqueo').length;
  const totalSuspended = sanctions.filter(s => s.actionTaken === 'suspensión').length;
  const resolvedCount = reports.filter(r => r.status !== 'pendiente').length;
  const unresolvedCount = reports.filter(r => r.status === 'pendiente').length;

  return (
    <div className="space-y-5 text-left">
      
      {/* HEADER SECTION */}
      <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-sora font-extrabold text-base text-ink">Consola de Moderación y Sanciones</h3>
            <p className="text-xs text-ink-soft mt-0.5">Administra quejas de usuarios, evalúa evidencias y aplica suspensiones temporales o bloqueos definitivos.</p>
          </div>
          <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 font-black px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            🛡️ Escudo de Seguridad Activo
          </span>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex gap-2 border-t border-divider/30 pt-4 mt-4">
          <button
            onClick={() => setActiveSubTab('pendientes')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'pendientes'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <ShieldAlert size={14} className={unresolvedCount > 0 ? 'text-rose-500 animate-bounce' : ''} /> 
            Reportes Pendientes ({unresolvedCount})
          </button>
          <button
            onClick={() => setActiveSubTab('historial')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'historial'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Archive size={14} /> Historial de Sanciones ({sanctions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('estadisticas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'estadisticas'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <BarChart3 size={14} /> Métricas de Moderación
          </button>
        </div>
      </div>

      {/* STATS SUMMARY BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shadow-sm">
            🚫
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Bloqueados Permanentemente</span>
            <span className="font-sora font-extrabold text-[15px] text-rose-600">
              {totalBlocked} Usuarios
            </span>
          </div>
        </div>

        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shadow-sm">
            ⏸️
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Suspendidos Temporal</span>
            <span className="font-sora font-extrabold text-[15px] text-amber-600">
              {totalSuspended} Activos
            </span>
          </div>
        </div>

        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shadow-sm">
            ✓
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Reportes Resueltos</span>
            <span className="font-sora font-extrabold text-[15px] text-emerald-600">
              {resolvedCount} Casos
            </span>
          </div>
        </div>

        <div className="bg-white border border-divider/60 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] text-red-500 flex items-center justify-center text-lg shadow-sm">
            ⚠️
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold block uppercase tracking-wider">Pendientes de Fallo</span>
            <span className="font-sora font-extrabold text-[15px] text-red-500">
              {unresolvedCount} Casos
            </span>
          </div>
        </div>

      </div>

      {/* SUB-TABS INTERACTIVE LAYOUTS */}
      <AnimatePresence mode="wait">
        
        {/* SUBTAB 1: REPORTS LISTING & DECISIONS */}
        {activeSubTab === 'pendientes' && (
          <motion.div
            key="pendientes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* LEFT COLUMN: LIST OF REPORTS WITH FILTERS */}
            <div className="lg:col-span-2 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-divider/30 pb-3">
                <h4 className="font-sora font-extrabold text-sm text-ink">Fila de Quejas y Reportes Activos</h4>
                
                {/* Micro Filter Selector */}
                <div className="flex gap-1">
                  {(['all', 'cliente', 'aliado', 'comercio'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterUserType(type)}
                      className={`px-2 py-1 rounded-lg text-[9.5px] font-black uppercase tracking-tight transition-all cursor-pointer ${
                        filterUserType === type 
                          ? 'bg-primary text-white shadow-xs' 
                          : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
                      }`}
                    >
                      {type === 'all' ? 'Todos' : type + 's'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" size={13} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por reportado, remitente o motivo..."
                  className="w-full bg-surface-alt/70 border-0 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-semibold text-ink"
                />
              </div>

              {/* Reports Table/Cards Scroll Area */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto content-scrollbar pr-1">
                {filteredReportsList.length === 0 ? (
                  <div className="py-10 text-center font-semibold text-xs text-ink-soft">
                    No se encontraron reportes activos que coincidan con los filtros.
                  </div>
                ) : (
                  filteredReportsList.map(rep => (
                    <div
                      key={rep.id}
                      onClick={() => setSelectedReport(rep)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex justify-between items-start gap-4 ${
                        selectedReport?.id === rep.id
                          ? 'border-primary bg-primary-surface/10 shadow-md'
                          : 'border-divider/50 bg-white hover:border-divider'
                      }`}
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-sora font-black text-xs text-ink">{rep.id}</span>
                          <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                            rep.reportedUserType === 'cliente' ? 'bg-[#EBF3FF] text-[#0066FF]' :
                            rep.reportedUserType === 'aliado' ? 'bg-orange-50 text-orange-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {rep.reportedUserType}
                          </span>
                          <span className="text-[9.5px] font-semibold text-ink-soft">• {rep.date}</span>
                        </div>

                        <div>
                          <h5 className="font-sora font-extrabold text-xs text-ink">Reportado: {rep.reportedUserName}</h5>
                          <p className="text-[10.5px] text-ink-soft leading-normal mt-0.5 font-semibold line-clamp-1">
                            Motivo: {rep.motive}
                          </p>
                        </div>

                        <div className="text-[10px] font-bold text-ink-soft bg-surface-alt/50 p-2 rounded-xl">
                          <span className="text-ink font-extrabold block text-[9px] uppercase tracking-wider">Emitido por:</span>
                          <span className="truncate block mt-0.5">{rep.reporterName}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between h-full gap-4 flex-shrink-0">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                          rep.status === 'pendiente' ? 'bg-red-50 text-red-500 animate-pulse border border-red-100' :
                          rep.status === 'archivado' ? 'bg-slate-100 text-slate-500' :
                          rep.status === 'advertido' ? 'bg-amber-50 text-amber-600' :
                          rep.status === 'suspendido' ? 'bg-orange-50 text-orange-500' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {rep.status}
                        </span>
                        
                        <button className="text-[10px] text-primary font-black hover:underline flex items-center gap-0.5 cursor-pointer">
                          Ver Detalles <Eye size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTION & SIMULATED EVIDENCE AUDITOR */}
            <div>
              {selectedReport ? (
                <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4 text-left animate-fadeIn">
                  <div className="border-b border-divider/30 pb-3 flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-primary uppercase font-black tracking-wider">Detalle del Caso</span>
                      <h4 className="font-sora font-extrabold text-sm text-ink">{selectedReport.id}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedReport(null)}
                      className="p-1 rounded-lg hover:bg-surface-alt text-ink-soft cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Audited Entity Info card */}
                  <div className="bg-surface-alt p-3.5 rounded-2xl border border-divider/30 space-y-2">
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Usuario Bajo Sospecha:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base shadow-xs">
                        {selectedReport.reportedUserType === 'cliente' ? '👤' : 
                         selectedReport.reportedUserType === 'aliado' ? '🛵' : '🏪'}
                      </div>
                      <div>
                        <h5 className="font-sora font-extrabold text-xs text-ink">{selectedReport.reportedUserName}</h5>
                        <span className="text-[9px] text-ink-soft font-bold">ID: {selectedReport.reportedUserId} • Tipo: <span className="uppercase text-primary">{selectedReport.reportedUserType}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Complaint Reason and Evidence */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Declaración Jurada del Remitente:</span>
                    <p className="text-xs text-ink-soft font-bold bg-amber-500/5 border border-amber-500/15 p-3 rounded-2xl leading-relaxed italic">
                      "{selectedReport.evidenceText}"
                    </p>
                  </div>

                  {/* Simulated Graphic Evidence placeholder */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Evidencia Gráfica Adjunta:</span>
                    <div className={`bg-gradient-to-br ${selectedReport.evidenceImage} h-28 rounded-2xl flex flex-col justify-end p-3 relative overflow-hidden shadow-xs border border-divider/10`}>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                        Captura Simulada GPS/Chat
                      </div>
                      <span className="text-[10px] text-white font-sora font-extrabold drop-shadow-sm truncate">
                        Evidencia_Adjunta_{selectedReport.id}.png
                      </span>
                    </div>
                  </div>

                  {/* Resolution Buttons Panel */}
                  <div className="pt-3 border-t border-divider/30 space-y-2.5">
                    <span className="text-[9px] text-ink-soft block font-bold uppercase tracking-wider">Medidas y Fallo de Moderación:</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleArchiveReport(selectedReport.id)}
                        className="bg-surface-alt hover:bg-divider/50 text-ink-soft hover:text-ink font-sora font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-divider/20"
                      >
                        <Archive size={12} /> Archivar Caso
                      </button>

                      <button
                        onClick={() => {
                          setActioningUser({
                            id: selectedReport.reportedUserId,
                            name: selectedReport.reportedUserName,
                            type: selectedReport.reportedUserType,
                            reportId: selectedReport.id
                          });
                          setActionType('advertencia');
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-sora font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <AlertTriangle size={12} /> Advertir
                      </button>

                      <button
                        onClick={() => {
                          setActioningUser({
                            id: selectedReport.reportedUserId,
                            name: selectedReport.reportedUserName,
                            type: selectedReport.reportedUserType,
                            reportId: selectedReport.id
                          });
                          setActionType('suspensión');
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-sora font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Clock size={12} /> Suspender Temp.
                      </button>

                      <button
                        onClick={() => {
                          setActioningUser({
                            id: selectedReport.reportedUserId,
                            name: selectedReport.reportedUserName,
                            type: selectedReport.reportedUserType,
                            reportId: selectedReport.id
                          });
                          setActionType('bloqueo');
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-sora font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Ban size={12} /> Bloquear Def.
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-alt/40 border border-divider/40 rounded-3xl p-10 text-center min-h-[300px] flex flex-col justify-center items-center">
                  <span className="text-3xl">🛡️</span>
                  <h4 className="font-sora font-extrabold text-xs text-ink mt-2">Detalles del Fallo</h4>
                  <p className="text-[10.5px] text-ink-soft mt-1 font-semibold max-w-[200px] leading-relaxed">
                    Selecciona cualquier reporte de la fila de quejas para auditar evidencias y decretar sanciones.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: SANCTIONS LOG & FILTERS */}
        {activeSubTab === 'historial' && (
          <motion.div
            key="historial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-divider/30 pb-3">
              <h4 className="font-sora font-extrabold text-sm text-ink">Historial de Medidas Correctivas</h4>
              
              {/* Sanction type filter */}
              <div className="flex gap-1.5">
                {(['all', 'advertencia', 'suspensión', 'bloqueo', 'restablecer'] as const).map(act => (
                  <button
                    key={act}
                    onClick={() => setHistoryActionFilter(act)}
                    className={`px-3 py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      historyActionFilter === act 
                        ? 'bg-[#0d1a16] text-white shadow-xs' 
                        : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* History search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" size={13} />
              <input
                type="text"
                value={historySearchQuery}
                onChange={e => setHistorySearchQuery(e.target.value)}
                placeholder="Filtrar por nombre de sancionado, motivo u operador de control..."
                className="w-full bg-surface-alt/70 border-0 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary font-semibold text-ink"
              />
            </div>

            {/* Sanctions History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                    <th className="py-3 px-2">ID Registro</th>
                    <th className="py-3 px-2">Usuario Sancionado</th>
                    <th className="py-3 px-2">Tipo de Medida</th>
                    <th className="py-3 px-2">Motive de Sanción</th>
                    <th className="py-3 px-2">Fecha / Operador</th>
                    <th className="py-3 px-2 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                  {filteredHistoryList.map(sanc => (
                    <tr key={sanc.id} className="hover:bg-surface-alt/20 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-ink-soft">{sanc.id}</td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {sanc.userType === 'cliente' ? '👤' : sanc.userType === 'aliado' ? '🛵' : '🏪'}
                          </span>
                          <div>
                            <span className="font-bold text-ink block">{sanc.userName}</span>
                            <span className="text-[9px] text-ink-soft block uppercase font-black tracking-wider">{sanc.userType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            sanc.actionTaken === 'bloqueo' ? 'bg-red-50 text-red-600' :
                            sanc.actionTaken === 'suspensión' ? 'bg-orange-50 text-orange-600' :
                            sanc.actionTaken === 'advertencia' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {sanc.actionTaken}
                          </span>
                          {sanc.duration && (
                            <span className="text-[9.5px] text-ink-soft font-mono">({sanc.duration})</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-ink-soft font-semibold max-w-[220px] truncate" title={sanc.motive}>
                        {sanc.motive}
                      </td>
                      <td className="py-3.5 px-2 text-ink-soft">
                        <div className="text-[10.5px]">
                          <div>Fecha: {sanc.date}</div>
                          <div className="font-bold">Por: {sanc.operator}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        {sanc.actionTaken !== 'restablecer' ? (
                          <button
                            onClick={() => handleRestoreAccess(sanc.userName, sanc.userType)}
                            className="text-[10.5px] text-emerald-600 hover:text-emerald-700 font-black cursor-pointer hover:underline flex items-center gap-0.5 justify-end"
                          >
                            Restablecer <UserCheck size={11} />
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                            ✓ Activo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: COMPREHENSIVE STATISTICS */}
        {activeSubTab === 'estadisticas' && (
          <motion.div
            key="estadisticas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Box layouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Bar charts distribution */}
              <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3">
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2 flex items-center gap-1.5">
                  <Sliders size={14} className="text-primary" />
                  Distribución de Reportes por Tipo
                </h4>
                
                <div className="space-y-3.5 pt-2 text-xs font-semibold text-ink-soft">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Reportes de Clientes hacia Aliados / Comercio:</span>
                      <span className="text-ink font-extrabold">18 Casos</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Reportes de Aliados hacia Clientes Descomedidos:</span>
                      <span className="text-ink font-extrabold">9 Casos</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Reportes Directos de Comercios por Daños:</span>
                      <span className="text-ink font-extrabold">3 Casos</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Metrics Info */}
              <div className="bg-[#0d1a16] text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-primary text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Auditoría Movica
                </div>

                <div>
                  <h4 className="font-sora font-extrabold text-xs text-primary uppercase tracking-wider">Métricas de Resolución y SLA</h4>
                  <p className="text-[10px] text-white/70 leading-normal mt-0.5 font-semibold">Tasa promedio de respuesta y resolución por parte del equipo de guardia.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <span className="text-white/60 text-[9px] block uppercase font-bold">Tiempo de Respuesta</span>
                    <span className="font-sora font-extrabold text-sm block text-white mt-0.5">14.2 Minutos</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <span className="text-white/60 text-[9px] block uppercase font-bold">Tasa de Efectividad</span>
                    <span className="font-sora font-extrabold text-sm block text-primary mt-0.5">96.8%</span>
                  </div>
                </div>

                <div className="text-[10px] bg-white/5 border border-white/10 p-3 rounded-xl flex gap-2 font-semibold">
                  <span className="text-primary">✓</span>
                  <p className="leading-snug text-white/85 text-[9.5px]">
                    El 92% de los aliados suspendidos por infracciones menores reinciden menos de una vez en los siguientes 90 días naturales.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* POPUP MODAL: EXECUTE MODERATION SANCTION DIALOG */}
      <AnimatePresence>
        {actioningUser && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActioningUser(null)}
              className="absolute inset-0 bg-slate-950"
            />

            <motion.div 
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              className="bg-white border border-divider/60 rounded-3xl p-6 shadow-2xl relative w-full max-w-md z-10 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-wider">Protocolo de Disciplina</span>
                  <h4 className="font-sora font-extrabold text-base text-ink">
                    Sancionar a {actioningUser.name}
                  </h4>
                  <p className="text-[10px] text-ink-soft mt-0.5">Selecciona la severidad de la sanción y detalla el motivo formal para el descargo.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActioningUser(null)}
                  className="p-1 rounded-xl hover:bg-surface-alt text-ink-soft hover:text-ink cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={executeModerationAction} className="space-y-3">
                
                {/* Sanction type select */}
                <div className="space-y-1">
                  <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Tipo de Medida Disciplinaria</label>
                  <select
                    value={actionType}
                    onChange={e => setActionType(e.target.value as any)}
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                  >
                    <option value="advertencia">Enviar Advertencia Escrita ⚠️</option>
                    <option value="suspensión">Suspender Acceso Temporalmente ⏸️</option>
                    <option value="bloqueo">Bloquear Acceso Permanentemente 🚫</option>
                    <option value="restablecer">Restablecer Acceso Total 🔓</option>
                  </select>
                </div>

                {/* Suspension Duration (if suspended) */}
                {actionType === 'suspensión' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Plazo de Suspensión</label>
                    <select
                      value={actionDuration}
                      onChange={e => setActionDuration(e.target.value)}
                      className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                    >
                      <option value="12 Horas">12 Horas</option>
                      <option value="24 Horas">24 Horas</option>
                      <option value="48 Horas">48 Horas</option>
                      <option value="1 Semana">1 Semana</option>
                      <option value="1 Mes">1 Mes</option>
                    </select>
                  </div>
                )}

                {/* Motive input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-ink-soft font-black uppercase tracking-wider block">Justificación Formal de la Medida</label>
                  <textarea
                    required
                    rows={3}
                    value={actionMotive}
                    onChange={e => setActionMotive(e.target.value)}
                    placeholder="Describe detalladamente los hechos, fechas, y referencias de la infracción para el descargo legal..."
                    className="w-full bg-surface-alt border-0 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#0d1a16] hover:bg-[#122420] text-white font-sora font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <ShieldCheck size={14} /> Aplicar Sanción Definitiva
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
