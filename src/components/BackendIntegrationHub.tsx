import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Cpu, ShieldCheck, Code, Globe, RefreshCw, Server, 
  Layers, Lock, Key, Users, Bike, Store, DollarSign, Bell, MessageSquare, 
  Map, Cloud, Zap, ArrowRight, Play, CheckCircle2, AlertCircle, FileCode,
  Sliders, Copy, Info
} from 'lucide-react';
import { formatColombianPesos } from '../utils/backendHelpers';

// Database Schema interface
interface DbTable {
  name: string;
  icon: React.ReactNode;
  description: string;
  columns: { name: string; type: string; key?: 'PK' | 'FK'; ref?: string; note?: string }[];
  rules: string;
}

const DB_SCHEMA_TABLES: DbTable[] = [
  {
    name: 'usuarios',
    icon: <Users size={16} className="text-blue-500" />,
    description: 'Centraliza a Clientes, Aliados, Comercios, Supervisores y Administradores.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', note: 'Identificador único de sesión' },
      { name: 'nombre', type: 'VARCHAR(100)', note: 'Nombre completo o razón social' },
      { name: 'correo', type: 'VARCHAR(120)', note: 'Email único para autenticación' },
      { name: 'hash_clave', type: 'VARCHAR(255)', note: 'Hasheado con Argon2id seguro' },
      { name: 'telefono', type: 'VARCHAR(20)', note: 'Contacto verificado' },
      { name: 'rol', type: 'VARCHAR(30)', note: 'cliente | aliado | comercio | supervisor | administrador' },
      { name: 'estado', type: 'VARCHAR(20)', note: 'activo | suspendido | bloqueado' },
      { name: 'fecha_creacion', type: 'TIMESTAMP', note: 'Fecha de alta' }
    ],
    rules: 'Acceso de lectura y escritura restringido al propio usuario mediante políticas RLS (Row Level Security).'
  },
  {
    name: 'aliados',
    icon: <Bike size={16} className="text-orange-500" />,
    description: 'Guarda el perfil operacional, vehículo, licencias, SOAT y balance de ganancias.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', note: 'Referencia directa a usuarios.id' },
      { name: 'tipo_vehiculo', type: 'VARCHAR(50)', note: 'moto | carro | bicicleta' },
      { name: 'placa', type: 'VARCHAR(15)', note: 'Placa visible registrada' },
      { name: 'soat_url', type: 'TEXT', note: 'URL de soporte en Cloudinary' },
      { name: 'licencia_url', type: 'TEXT', note: 'URL de soporte en Cloudinary' },
      { name: 'calificacion', type: 'DECIMAL(3,2)', note: 'Promedio dinámico de estrellas' },
      { name: 'disponible', type: 'BOOLEAN', note: 'Filtro para despacho live' }
    ],
    rules: 'Modificable por el propio aliado y el Supervisor. Consultable por Clientes en servicios activos.'
  },
  {
    name: 'comercios',
    icon: <Store size={16} className="text-amber-500" />,
    description: 'Establecimientos comerciales registrados, menús y tiempos estimados.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', note: 'Referencia directa a usuarios.id' },
      { name: 'nombre_comercial', type: 'VARCHAR(120)', note: 'Razón comercial visible' },
      { name: 'direccion', type: 'TEXT', note: 'Punto de recojo físico' },
      { name: 'categoria', type: 'VARCHAR(50)', note: 'restaurante | drogueria | mercado | licor' },
      { name: 'esta_abierto', type: 'BOOLEAN', note: 'Horario de atención live' },
      { name: 'rating', type: 'DECIMAL(3,2)', note: 'Reputación comercial' }
    ],
    rules: 'Lectura pública para Clientes. Edición autorizada para el administrador y el perfil comercial asignado.'
  },
  {
    name: 'servicios_pedidos',
    icon: <Zap size={16} className="text-yellow-500" />,
    description: 'Contratos operacionales de Mototaxi, Domicilios, Encomiendas, Compras y Mandados.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', note: 'ID de rastreo de servicio' },
      { name: 'cliente_id', type: 'UUID', key: 'FK', ref: 'usuarios.id', note: 'Cliente que paga la tarifa' },
      { name: 'aliado_id', type: 'UUID', key: 'FK', ref: 'aliados.id', note: 'Conductor asignado (puede ser nulo al inicio)' },
      { name: 'tipo', type: 'VARCHAR(30)', note: 'mototaxi | domicilio | encomienda | compra | mandado' },
      { name: 'origen_lat_lng', type: 'VARCHAR(60)', note: 'Coordenadas del punto A' },
      { name: 'destino_lat_lng', type: 'VARCHAR(60)', note: 'Coordenadas del punto B' },
      { name: 'origen_direccion', type: 'TEXT', note: 'Dirección física legible punto A' },
      { name: 'destino_direccion', type: 'TEXT', note: 'Dirección física legible punto B' },
      { name: 'tarifa_total', type: 'DECIMAL(10,2)', note: 'Precio en COP cerrado por algoritmo' },
      { name: 'estado', type: 'VARCHAR(25)', note: 'solicitado | asignado | en_camino | completado | cancelado' },
      { name: 'fecha', type: 'TIMESTAMP', note: 'Fecha de solicitud' }
    ],
    rules: 'Escritura permitida a Clientes. Asignación modificable por el sistema de despacho en tiempo real o supervisores.'
  },
  {
    name: 'pagos',
    icon: <DollarSign size={16} className="text-emerald-500" />,
    description: 'Auditoría de pasarelas de pago y distribución de comisiones por servicio.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK', note: 'Identificador contable' },
      { name: 'pedido_id', type: 'UUID', key: 'FK', ref: 'servicios_pedidos.id', note: 'Servicio relacionado' },
      { name: 'transaccion_referencia', type: 'VARCHAR(100)', note: 'ID devuelto por Wompi / Stripe / Bold' },
      { name: 'monto_bruto', type: 'DECIMAL(10,2)', note: 'Total pagado por cliente' },
      { name: 'comision_plataforma', type: 'DECIMAL(10,2)', note: 'Porcentaje retenido por Movica (15%)' },
      { name: 'monto_aliado', type: 'DECIMAL(10,2)', note: 'Porcentaje que va a la billetera del aliado (85%)' },
      { name: 'metodo_pago', type: 'VARCHAR(30)', note: 'tarjeta | pse | nequi | efectivo' },
      { name: 'estado_pago', type: 'VARCHAR(20)', note: 'aprobado | fallido | en_proceso' }
    ],
    rules: 'Inmutable una vez insertado por el webhook de confirmación de la pasarela de pagos.'
  },
  {
    name: 'calificaciones',
    icon: <Info size={16} className="text-purple-500" />,
    description: 'Reseñas y feedback mutuo entre clientes y conductores.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK' },
      { name: 'pedido_id', type: 'UUID', key: 'FK', ref: 'servicios_pedidos.id' },
      { name: 'evaluador_id', type: 'UUID', key: 'FK', ref: 'usuarios.id' },
      { name: 'evaluado_id', type: 'UUID', key: 'FK', ref: 'usuarios.id' },
      { name: 'estrellas', type: 'INT', note: 'Rango de 1 a 5' },
      { name: 'comentario', type: 'TEXT', note: 'Justificación opcional' }
    ],
    rules: 'Escritura única permitida una vez por servicio completado exitosamente.'
  },
  {
    name: 'notificaciones',
    icon: <Bell size={16} className="text-amber-600" />,
    description: 'Historial de push notifications enviadas mediante OneSignal o FCM.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK' },
      { name: 'usuario_id', type: 'UUID', key: 'FK', ref: 'usuarios.id' },
      { name: 'titulo', type: 'VARCHAR(150)' },
      { name: 'cuerpo', type: 'TEXT' },
      { name: 'leido', type: 'BOOLEAN' },
      { name: 'enviado_en', type: 'TIMESTAMP' }
    ],
    rules: 'Lectura exclusiva para el usuario destinatario.'
  },
  {
    name: 'chat_mensajes',
    icon: <MessageSquare size={16} className="text-teal-500" />,
    description: 'Logs del chat de soporte técnico y mensajería en vivo cliente-aliado.',
    columns: [
      { name: 'id', type: 'UUID', key: 'PK' },
      { name: 'pedido_id', type: 'UUID', key: 'FK', ref: 'servicios_pedidos.id' },
      { name: 'remitente_id', type: 'UUID', key: 'FK', ref: 'usuarios.id' },
      { name: 'mensaje', type: 'TEXT' },
      { name: 'fecha_envio', type: 'TIMESTAMP' }
    ],
    rules: 'Consultable en tiempo real mediante suscripción de Websockets por los implicados del pedido.'
  }
];

// Playground API Endpoints
interface PlaygroundEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  defaultPayload: string;
  expectedResponse: string;
  requiresAuth: boolean;
  requiredRole?: string;
}

const PLAYGROUND_ENDPOINTS: PlaygroundEndpoint[] = [
  {
    path: '/api/v1/auth/login',
    method: 'POST',
    description: 'Autenticación central de usuarios. Genera un token JWT firmado y devuelve el rol operacional.',
    defaultPayload: JSON.stringify({ email: 'supervisor.movica@gmail.com', password: '••••••••••••' }, null, 2),
    expectedResponse: JSON.stringify({
      status: 'success',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'USR-8829',
        nombre: 'Camilo Cardona',
        correo: 'supervisor.movica@gmail.com',
        rol: 'supervisor',
        permisos: ['order:reassign', 'order:read', 'chat:read', 'alerts:resolve', 'moderation:warn']
      }
    }, null, 2),
    requiresAuth: false
  },
  {
    path: '/api/v1/orders/create',
    method: 'POST',
    description: 'Crea una orden de servicio (Mototaxi, Mandado, etc). Inicia el despacho automático.',
    defaultPayload: JSON.stringify({
      tipo: 'mototaxi',
      origen_direccion: 'Calle 10 #43A-30, Medellín',
      destino_direccion: 'C.C. El Tesoro, Poblado',
      origen_lat_lng: '6.2081,-75.5678',
      destino_lat_lng: '6.2001,-75.5492',
      metodo_pago: 'pse',
      tarifa_total: 8500
    }, null, 2),
    expectedResponse: JSON.stringify({
      status: 'created',
      orderId: 'ORD-99023',
      estimatedArrivalMinutes: 6,
      dispatchStatus: 'buscando_aliado',
      fareLocked: true
    }, null, 2),
    requiresAuth: true,
    requiredRole: 'cliente'
  },
  {
    path: '/api/v1/payments/process',
    method: 'POST',
    description: 'Procesa la transacción monetaria mediante pasarela Wompi / Stripe con token de tarjeta.',
    defaultPayload: JSON.stringify({
      orderId: 'ORD-99023',
      paymentToken: 'tok_pse_wompi_8912hjsad',
      amount: 8500,
      currency: 'COP'
    }, null, 2),
    expectedResponse: JSON.stringify({
      status: 'success',
      transactionId: 'TX-WOMPI-998127391',
      settlementStatus: 'approved',
      commissionAmount: 1275, // 15% Movica
      payoutAmount: 7225 // 85% Aliado
    }, null, 2),
    requiresAuth: true,
    requiredRole: 'cliente'
  },
  {
    path: '/api/v1/moderation/sanction',
    method: 'POST',
    description: 'Ejecuta una medida disciplinaria sobre un usuario infractor (Advertencia, Suspensión, Bloqueo).',
    defaultPayload: JSON.stringify({
      reportedUserId: 'ALY-01',
      reportId: 'REP-001',
      actionType: 'suspensión',
      duration: '48 Horas',
      motive: 'Cobro de tarifa superior injustificada de forma reiterada.'
    }, null, 2),
    expectedResponse: JSON.stringify({
      status: 'success',
      sanctionId: 'SANC-00912',
      userNotified: true,
      channels: ['push', 'email'],
      restrictiveSessionTokensRevoked: true
    }, null, 2),
    requiresAuth: true,
    requiredRole: 'supervisor | administrador'
  }
];

export default function BackendIntegrationHub() {
  const [activeTab, setActiveTab] = useState<'arquitectura' | 'db' | 'playground' | 'apis'>('arquitectura');
  
  // DB tab internal state
  const [selectedTable, setSelectedTable] = useState<DbTable>(DB_SCHEMA_TABLES[0]);

  // Playground internal states
  const [selectedEndpoint, setSelectedEndpoint] = useState<PlaygroundEndpoint>(PLAYGROUND_ENDPOINTS[0]);
  const [customPayload, setCustomPayload] = useState<string>(PLAYGROUND_ENDPOINTS[0].defaultPayload);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const handleEndpointSelect = (ep: PlaygroundEndpoint) => {
    setSelectedEndpoint(ep);
    setCustomPayload(ep.defaultPayload);
    setPlaygroundOutput('');
    setStatusCode(null);
  };

  const handleTestAPI = () => {
    setIsPlaying(true);
    setPlaygroundOutput('');
    setStatusCode(null);

    // Simulate Network Latency
    setTimeout(() => {
      setIsPlaying(false);
      setStatusCode(selectedEndpoint.path.includes('sanction') ? 200 : 201);
      setPlaygroundOutput(selectedEndpoint.expectedResponse);
    }, 1200);
  };

  const [copiedText, setCopiedText] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-5 text-left">
      
      {/* CENTRAL MODULE BAR */}
      <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-sora font-extrabold text-base text-ink">Centro de Control de API y Backend (MÓDULO 34)</h3>
            <p className="text-xs text-ink-soft mt-0.5">Soporte de ingeniería y simulación de flujos de base de datos relacionales, pasarelas de pago, tokens y seguridad JWT.</p>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 font-black px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            🔌 Preparado para Producción
          </span>
        </div>

        {/* CONTROLS MENU */}
        <div className="flex flex-wrap gap-2 border-t border-divider/30 pt-4 mt-4">
          <button
            onClick={() => setActiveTab('arquitectura')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'arquitectura'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Layers size={14} /> Arquitectura Modular
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'db'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Database size={14} /> Esquemas Relacionales
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Cpu size={14} /> Playground de APIs
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'apis'
                ? 'bg-[#0d1a16] text-white shadow-sm'
                : 'bg-surface-alt text-ink-soft hover:bg-divider/50'
            }`}
          >
            <Globe size={14} /> Conectores de APIs Externas
          </button>
        </div>
      </div>

      {/* CORE SECTIONS */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: MODULAR ARCHITECTURE OVERVIEW */}
        {activeTab === 'arquitectura' && (
          <motion.div
            key="arquitectura"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* Folder structures & guidelines card */}
            <div className="lg:col-span-2 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2">
                Estructura Limpia Organizada (Clean Architecture)
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed font-medium">
                La aplicación ha sido dividida en capas independientes. Esto previene el acoplamiento rígido de código, facilitando que cualquier desarrollador reemplace el almacenamiento ficticio local actual por llamadas reales a servicios Web Sockets en pocas horas.
              </p>

              {/* Graphical directories box */}
              <div className="bg-surface-alt/70 rounded-2xl p-4 border border-divider/30 font-mono text-xs text-ink space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">/src/models/</span>
                  <div className="flex-1">
                    <span className="text-ink font-bold block">Modelos de Dominio</span>
                    <span className="text-ink-soft text-[10.5px] block mt-0.5">Define las entidades de negocio inmutables (Order, UserProfile, PartnerProfile, etc.) libres de librerías secundarias.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-divider/30 pt-3">
                  <span className="text-blue-600 font-bold">/src/services/</span>
                  <div className="flex-1">
                    <span className="text-ink font-bold block">Servicios y Clientes de API</span>
                    <span className="text-ink-soft text-[10.5px] block mt-0.5">Controladores de peticiones fetch centralizados (`apiClient.ts`), lógica de autenticación JWT (`authService.ts`) y adaptadores para Google Maps, Wompi y OneSignal.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-divider/30 pt-3">
                  <span className="text-purple-600 font-bold">/src/components/</span>
                  <div className="flex-1">
                    <span className="text-ink font-bold block">Vistas e Interfaces React</span>
                    <span className="text-ink-soft text-[10.5px] block mt-0.5">Encargada de renderizar la UI con Tailwind CSS sin depender de la infraestructura de almacenamiento final (desacoplada).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-divider/30 pt-3">
                  <span className="text-amber-600 font-bold">/src/utils/</span>
                  <div className="flex-1">
                    <span className="text-ink font-bold block">Utilidades y Validaciones</span>
                    <span className="text-ink-soft text-[10.5px] block mt-0.5">Contiene helpers matemáticos, formateadores monetarios COP, validadores sintácticos de email y calculadoras de tarifas.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECURITY MATRIX IN RIGHT PANEL */}
            <div className="bg-[#0d1a16] text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9px] text-primary font-black uppercase tracking-wider block">Estándar de Seguridad</span>
                <h4 className="font-sora font-extrabold text-sm text-white">Matriz de Roles y JWT</h4>
                <p className="text-[11px] text-white/70 leading-normal mt-1 font-medium">
                  El control de accesos se valida en el Gateway API del backend mediante tokens JWT firmados criptográficamente.
                </p>
              </div>

              {/* Key Info items */}
              <div className="space-y-3.5 text-xs">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                  <Lock size={15} className="text-primary flex-shrink-0" />
                  <div>
                    <span className="font-bold block text-white">HTTP-Only Cookies</span>
                    <span className="text-white/60 text-[10px] block mt-0.5">Protege los tokens contra ataques XSS (Cross-Site Scripting) bloqueando lectura JavaScript.</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                  <Key size={15} className="text-primary flex-shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Políticas PostgreSQL RLS</span>
                    <span className="text-white/60 text-[10px] block mt-0.5">El motor de base de datos restringe accesos por ID de usuario directo a nivel de fila.</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                  <ShieldCheck size={15} className="text-primary flex-shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Revocación Inmediata</span>
                    <span className="text-white/60 text-[10px] block mt-0.5">Sanciones en Módulo 33 eliminan al instante el token de las listas de sesión válidas (Redis cache check).</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-primary/80 font-semibold bg-white/5 p-3 rounded-xl border border-white/10">
                🔒 Encriptación de claves: Las contraseñas se protegen en la tabla 'usuarios' utilizando Argon2id con salt aleatorio de 16 bytes.
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DATABASE SCHEMA VISUALIZER */}
        {activeTab === 'db' && (
          <motion.div
            key="db"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* Left table list selector */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3">
              <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2">
                Colecciones y Tablas Relacionales
              </h4>
              <p className="text-xs text-ink-soft leading-snug font-medium mb-2">
                Haz clic en cualquier tabla del modelo relacional para inspeccionar sus columnas, llaves primarias (PK), foráneas (FK), y políticas de seguridad PostgreSQL:
              </p>

              <div className="space-y-2 max-h-[360px] overflow-y-auto content-scrollbar pr-1">
                {DB_SCHEMA_TABLES.map(table => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedTable.name === table.name
                        ? 'border-primary bg-primary-surface/10 shadow-xs'
                        : 'border-divider/50 hover:border-divider'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-surface-alt rounded-lg shadow-sm">
                        {table.icon}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-ink">{table.name}</span>
                        <span className="text-[10px] text-ink-soft block line-clamp-1">{table.description}</span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-ink-soft" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right details panel detailing selected table columns */}
            <div className="lg:col-span-2 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-divider/30 pb-2">
                <div>
                  <span className="text-[9.5px] text-primary uppercase font-black tracking-wider">Esquema Relacional</span>
                  <h4 className="font-sora font-extrabold text-base text-ink flex items-center gap-2">
                    Tabla: <span className="font-mono bg-surface-alt px-2.5 py-0.5 rounded text-sm font-bold text-ink">{selectedTable.name}</span>
                  </h4>
                </div>
                <button
                  onClick={() => handleCopy(`CREATE TABLE ${selectedTable.name} (...)`)}
                  className="px-2.5 py-1 bg-surface-alt hover:bg-divider/50 rounded-lg text-[10.5px] font-bold text-ink-soft flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={12} /> {copiedText ? 'Copiado' : 'Copiar DDL'}
                </button>
              </div>

              <p className="text-xs text-ink-soft font-semibold bg-surface-alt/70 p-3 rounded-2xl">
                📝 {selectedTable.description}
              </p>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-semibold">
                  <thead>
                    <tr className="border-b border-divider/50 text-[10px] text-ink-soft uppercase tracking-wider font-bold">
                      <th className="py-2 px-1">Columna</th>
                      <th className="py-2 px-1">Tipo de Dato</th>
                      <th className="py-2 px-1">Restricciones / Refs</th>
                      <th className="py-2 px-1">Uso Operacional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider/20 font-medium">
                    {selectedTable.columns.map(col => (
                      <tr key={col.name} className="hover:bg-surface-alt/20 transition-colors">
                        <td className="py-2.5 px-1 font-mono text-ink font-bold">{col.name}</td>
                        <td className="py-2.5 px-1 font-mono text-ink-soft text-[11px]">{col.type}</td>
                        <td className="py-2.5 px-1">
                          {col.key === 'PK' && (
                            <span className="bg-red-50 text-red-600 text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase border border-red-200">PRIMARY KEY</span>
                          )}
                          {col.key === 'FK' && (
                            <span className="bg-blue-50 text-blue-600 text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase border border-blue-200" title={`Refiere a ${col.ref}`}>
                              FK ➔ {col.ref}
                            </span>
                          )}
                          {!col.key && <span className="text-ink-soft text-[10px]">-</span>}
                        </td>
                        <td className="py-2.5 px-1 text-ink-soft text-[11px]">{col.note || 'Campo operativo general'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Security Rule card */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Políticas RLS & Autorizaciones</span>
                <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                  {selectedTable.rules}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: API PLAYGROUND SIMULATOR */}
        {activeTab === 'playground' && (
          <motion.div
            key="playground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* Select API Endpoint Panel */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3">
              <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider border-b border-divider/30 pb-2">
                Endpoints de API Disponibles
              </h4>
              <p className="text-xs text-ink-soft leading-snug font-medium mb-1">
                Selecciona un endpoint para simular la petición de red, payload de entrada y cabeceras de seguridad JWT:
              </p>

              <div className="space-y-2">
                {PLAYGROUND_ENDPOINTS.map(ep => (
                  <button
                    key={ep.path}
                    onClick={() => handleEndpointSelect(ep)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedEndpoint.path === ep.path
                        ? 'border-primary bg-primary-surface/10 shadow-xs'
                        : 'border-divider/50 hover:border-divider'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        ep.method === 'POST' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {ep.method}
                      </span>
                      {ep.requiresAuth && (
                        <span className="text-[8.5px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase border border-red-200 flex items-center gap-0.5">
                          🔑 JWT
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-ink block truncate">{ep.path}</span>
                    <p className="text-[10px] text-ink-soft mt-1 line-clamp-1 leading-normal font-semibold">{ep.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated request & response payload areas */}
            <div className="lg:col-span-2 bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-divider/30 pb-2">
                <div>
                  <span className="text-[9.5px] text-primary uppercase font-black tracking-wider">Simulador de Petición REST</span>
                  <h4 className="font-sora font-extrabold text-sm text-ink font-mono mt-0.5">
                    {selectedEndpoint.method} {selectedEndpoint.path}
                  </h4>
                </div>

                <button
                  onClick={handleTestAPI}
                  disabled={isPlaying}
                  className="bg-[#0d1a16] hover:bg-[#122420] disabled:bg-divider/50 text-white font-sora font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isPlaying ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Conectando...
                    </>
                  ) : (
                    <>
                      <Play size={12} /> Probar API (Simular)
                    </>
                  )}
                </button>
              </div>

              {/* Info text box */}
              <p className="text-xs text-ink-soft font-semibold leading-relaxed">
                {selectedEndpoint.description} 
                {selectedEndpoint.requiresAuth && (
                  <span className="text-red-600 font-extrabold block mt-1">
                    ⚠️ Seguridad activa: Solo accesible por usuarios autenticados con rol de "{selectedEndpoint.requiredRole}".
                  </span>
                )}
              </p>

              {/* Code blocks area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Payload */}
                <div className="space-y-1">
                  <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">Cuerpo de la Petición (Request Body)</span>
                  <textarea
                    value={customPayload}
                    onChange={e => setCustomPayload(e.target.value)}
                    className="w-full bg-[#18181b] text-emerald-400 font-mono text-[11px] p-3.5 rounded-xl h-48 outline-none border border-zinc-800 focus:ring-1 focus:ring-primary leading-normal"
                  />
                </div>

                {/* Response Payload */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-ink-soft font-bold uppercase tracking-wider block">Respuesta del Servidor (Response)</span>
                    {statusCode && (
                      <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        statusCode < 300 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        Status: {statusCode} {statusCode === 201 ? 'Created' : 'OK'}
                      </span>
                    )}
                  </div>
                  <div className="bg-[#18181b] p-3.5 rounded-xl h-48 border border-zinc-800 overflow-y-auto content-scrollbar font-mono text-[11.5px] text-zinc-300 relative">
                    {isPlaying && (
                      <div className="absolute inset-0 bg-[#18181b]/80 flex flex-col justify-center items-center">
                        <RefreshCw size={24} className="text-primary animate-spin" />
                        <span className="text-[10px] text-zinc-400 mt-2 font-sans font-bold">Simulando respuesta segura de servidor...</span>
                      </div>
                    )}
                    {playgroundOutput ? (
                      <pre className="whitespace-pre-wrap">{playgroundOutput}</pre>
                    ) : (
                      <span className="text-zinc-500 italic block mt-1">Haz clic en "Probar API" para emitir la petición segura de prueba y recibir el cuerpo de respuesta JSON.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: THIRD PARTY CONNECTORS */}
        {activeTab === 'apis' && (
          <motion.div
            key="apis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* Google Maps Card */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-2xl shadow-xs text-xl">🗺️</div>
                <span className="text-[8.5px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full uppercase">Google Maps</span>
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider">Geolocalización & Tarificación</h4>
                <p className="text-[11.5px] text-ink-soft leading-normal mt-0.5 font-medium">
                  Se utiliza para geocodificar direcciones de origen/destino, rastrear aliados en vivo mediante WebSockets y calcular tarifas óptimas por kilómetro utilizando la Matrix API de Google.
                </p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/20 font-mono text-[10px] text-ink-soft leading-normal">
                <span className="text-emerald-700 block font-bold">// Endpoint Producción:</span>
                maps.googleapis.com/maps/api/distancematrix
              </div>
            </div>

            {/* Payment Gateways Card */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-2xl shadow-xs text-xl">💳</div>
                <span className="text-[8.5px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase">Wompi / Stripe</span>
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider">Pasarela de Pagos Segura</h4>
                <p className="text-[11.5px] text-ink-soft leading-normal mt-0.5 font-medium">
                  Procesa tarjetas de crédito, cuentas de débito PSE, Nequi y Daviplata en pesos colombianos (COP), reteniendo de manera segura el 15% de comisión para la plataforma antes del desembolso al aliado.
                </p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/20 font-mono text-[10px] text-ink-soft leading-normal">
                <span className="text-emerald-700 block font-bold">// Endpoint Producción:</span>
                api.wompi.co/v1/transactions
              </div>
            </div>

            {/* Cloudinary Card */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-2xl shadow-xs text-xl">☁️</div>
                <span className="text-[8.5px] bg-purple-100 text-purple-700 font-black px-2 py-0.5 rounded-full uppercase">Cloudinary</span>
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider">Almacenamiento de Documentos</h4>
                <p className="text-[11.5px] text-ink-soft leading-normal mt-0.5 font-medium">
                  Almacena y sirve archivos e imágenes pesadas con CDN optimizado, como los PDF de licencias y SOAT cargados por aliados en el Módulo 21 y capturas de evidencias de quejas en el Módulo 33.
                </p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/20 font-mono text-[10px] text-ink-soft leading-normal">
                <span className="text-emerald-700 block font-bold">// Endpoint Producción:</span>
                api.cloudinary.com/v1_1/movica/upload
              </div>
            </div>

            {/* OneSignal Notifications Card */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-2xl shadow-xs text-xl">🔔</div>
                <span className="text-[8.5px] bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-full uppercase">OneSignal</span>
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider">Notificaciones Push Live</h4>
                <p className="text-[11.5px] text-ink-soft leading-normal mt-0.5 font-medium">
                  Envía alertas automáticas en tiempo real al dispositivo móvil del aliado ante un nuevo pedido en curso, e informa de forma proactiva al cliente del progreso de su encomienda o viaje de mototaxi.
                </p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/20 font-mono text-[10px] text-ink-soft leading-normal">
                <span className="text-emerald-700 block font-bold">// Endpoint Producción:</span>
                onesignal.com/api/v1/notifications
              </div>
            </div>

            {/* Supabase Realtime Card */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-2xl shadow-xs text-xl">⚡</div>
                <span className="text-[8.5px] bg-teal-100 text-teal-700 font-black px-2 py-0.5 rounded-full uppercase">Supabase Realtime</span>
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider">Bases NoSQL y Websockets</h4>
                <p className="text-[11.5px] text-ink-soft leading-normal mt-0.5 font-medium">
                  Suscripción a canales de mensajería interactiva del Módulo 29 (Chats de conductores/soporte) y actualización instantánea de despachos con reasignación en vivo para Supervisores (Módulo 32).
                </p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/20 font-mono text-[10px] text-ink-soft leading-normal">
                <span className="text-emerald-700 block font-bold">// Endpoint Producción:</span>
                wss://movica.supabase.co/realtime/v1
              </div>
            </div>

            {/* Firebase Auth Card */}
            <div className="bg-white border border-divider/60 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-2xl shadow-xs text-xl">🔥</div>
                <span className="text-[8.5px] bg-yellow-100 text-yellow-700 font-black px-2 py-0.5 rounded-full uppercase">Firebase Auth</span>
              </div>
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink uppercase tracking-wider">Autenticación OAuth y Teléfono</h4>
                <p className="text-[11.5px] text-ink-soft leading-normal mt-0.5 font-medium">
                  Administra de manera transparente el inicio de sesión mediante cuentas de Google, Apple o SMS (OTP) de teléfono celular, reduciendo la fricción para que los usuarios entren de manera segura.
                </p>
              </div>
              <div className="bg-surface-alt p-3 rounded-xl border border-divider/20 font-mono text-[10px] text-ink-soft leading-normal">
                <span className="text-emerald-700 block font-bold">// Endpoint Producción:</span>
                identitytoolkit.googleapis.com
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
