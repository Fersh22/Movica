/**
 * MOVICA - INTEGRACIÓN DE SERVICIOS Y APIS DE TERCEROS
 * 
 * Este archivo centraliza los adaptadores de API y las notas de arquitectura
 * para conectar servicios externos indispensables de la operación de Movica.
 */

/**
 * 1. GOOGLE MAPS PLATFORM (Geolocalización, Rutas y Direcciones)
 * 
 * Se integrará para calcular distancias óptimas, tarifas por kilómetro,
 * geocodificación inversa (convertir coordenadas a dirección) y dibujar el recorrido del aliado en tiempo real.
 * 
 * Documentación de referencia para el equipo de desarrollo:
 * SDK: @googlemaps/js-api-loader
 */
export const googleMapsConfig = {
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyFake_Maps_Key_Movica',
  libraries: ['places', 'geometry'] as const,
  defaultCenter: { lat: 6.2442, lng: -75.5812 }, // Medellín por defecto
};

/**
 * Simula el cálculo de distancia y tiempo utilizando Google Matrix API
 */
export async function calculateRouteDistance(origin: string, destination: string): Promise<{ distanceKm: number; durationMinutes: number }> {
  // Comentario arquitectónico:
  // En producción, esto consumirá: https://maps.googleapis.com/maps/api/distancematrix/json
  console.log(`[Google Maps API] Calculando ruta de "${origin}" a "${destination}"`);
  
  return {
    distanceKm: parseFloat((Math.random() * 8 + 1).toFixed(2)),
    durationMinutes: Math.floor(Math.random() * 20 + 8)
  };
}


/**
 * 2. PASARELAS DE PAGO (Wompi, Stripe, PayU, Bold)
 * 
 * Permite procesar tarjetas de crédito, PSE, Nequi y Daviplata de forma segura,
 * reteniendo la comisión de Movica (15%) y distribuyendo el balance al aliado.
 */
export interface PaymentIntent {
  orderId: string;
  amount: number;
  paymentMethod: 'tarjeta' | 'pse' | 'nequi' | 'efectivo';
  currency: 'COP';
}

export async function processPaymentGateway(intent: PaymentIntent): Promise<{ transactionId: string; status: 'APPROVED' | 'DECLINED' | 'PENDING' }> {
  // Comentario arquitectónico:
  // Si se usa Wompi (Colombia): se creará la firma con llave privada en el Backend
  // para evitar fraude, consumiendo: https://production.wompi.co/v1/transactions
  console.log(`[Pasarela de Pago] Iniciando cargo de $${intent.amount} COP para la orden ${intent.orderId}`);
  
  return {
    transactionId: `TX-WOMPI-${Math.floor(Math.random() * 10000000)}`,
    status: 'APPROVED'
  };
}


/**
 * 3. CLOUDINARY / AWS S3 (Almacenamiento de Evidencias y Documentos)
 * 
 * Utilizado para cargar de manera eficiente los archivos cargados en el Módulo 21
 * (SOAT, Cédula de Aliados) y las fotos de evidencias de Moderación del Módulo 33.
 */
export async function uploadToCloudinary(fileBlob: Blob, folder: 'documents' | 'evidence' | 'avatar'): Promise<{ secureUrl: string; publicId: string }> {
  // Comentario arquitectónico:
  // Permite ahorrar espacio en el servidor de base de datos cargando el blob directamente
  // mediante un "Signed Upload Preset" seguro.
  console.log(`[Cloudinary SDK] Cargando archivo de tipo binario a carpeta "${folder}"`);
  
  return {
    secureUrl: `https://res.cloudinary.com/movica/image/upload/v1625/${folder}/evidence_sample.jpg`,
    publicId: `movica/${folder}/file_${Date.now()}`
  };
}


/**
 * 4. ONESIGNAL / FIREBASE CLOUD MESSAGING (Notificaciones Push en tiempo real)
 * 
 * Permite alertar instantáneamente a los aliados de nuevas solicitudes de envío o mototaxi
 * que se generen en su radio de acción, e informar al cliente cuando su pedido esté en camino.
 */
export async function sendPushNotification(targetUserId: string, title: string, body: string, data?: Record<string, string>): Promise<{ success: boolean; messageId: string }> {
  // Comentario arquitectónico:
  // Se conecta a la API de OneSignal inyectando el App ID y la REST API Key desde las variables de entorno del backend.
  // Endpoint: https://onesignal.com/api/v1/notifications
  console.log(`[OneSignal Push] Enviando alerta a usuario ${targetUserId}: "${title} - ${body}"`);
  
  return {
    success: true,
    messageId: `OS-MSG-${Math.floor(Math.random() * 900000 + 100000)}`
  };
}


/**
 * 5. FIREBASE FIRESTORE & SUPABASE DATABASE (Servicios y Alertas en tiempo real)
 * 
 * Para el Chat interactivo del Módulo 29, la reasignación de servicios del Módulo 32,
 * y los estados de pedidos activos, se empleará un WebSocket o suscripción en tiempo real
 * proporcionado de manera nativa por Firebase o Supabase (PostgreSQL Listen/Notify).
 */
export const getSupabaseConfig = () => {
  return {
    supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://movica.supabase.co',
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FakeKey'
  };
};
