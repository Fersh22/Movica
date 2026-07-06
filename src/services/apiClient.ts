/**
 * MOVICA - CLIENTE DE API CENTRALIZADO (PREPARACIÓN PARA BACKEND)
 * 
 * Este módulo contiene el cliente base de API para realizar solicitudes HTTP 
 * a la futura infraestructura backend de Movica (Express, Node, FastAPI, NestJS, etc.)
 * utilizando TypeScript seguro y manejo de tokens.
 */

// URL del servidor API de producción o desarrollo
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.movica.com/v1';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Obtiene el token JWT guardado de forma segura en las sesiones locales del navegador.
 * En la futura integración, se sugiere usar cookies HTTP-only o almacenamiento seguro.
 */
export const getSessionToken = (): string | null => {
  return localStorage.getItem('movica_auth_token');
};

/**
 * Realiza una petición genérica HTTP, inyectando cabeceras de autorización
 * y gestionando errores centralizados.
 */
export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, headers, ...restOptions } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Accept', 'application/json');

  // Inyección de token de seguridad JWT
  if (requiresAuth) {
    const token = getSessionToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    } else {
      // Si el endpoint requiere autenticación y no hay token, podemos lanzar error preventivo
      console.warn(`[API WARNING]: El endpoint "${endpoint}" requiere autenticación pero no se encontró un JWT.`);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // Manejo de códigos de estado de error comunes
    if (response.status === 401) {
      // Token expirado o inválido -> Redireccionar a Login o refrescar sesión
      console.error('[API ERROR]: No autorizado (401). Limpiando credenciales expiradas.');
      localStorage.removeItem('movica_auth_token');
      localStorage.removeItem('movica_user_role');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en servidor API (${response.status})`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`[API FETCH FAILURE] endpoint: ${endpoint} -`, error);
    throw error;
  }
}

/**
 * SIMULADOR INTERACTIVO PARA ENTRADAS Y SALIDAS (API MOCK FALLBACK)
 * Permite que la app actual siga funcionando de forma simulada leyendo de localStorage,
 * pero ya estructurando las peticiones para la conexión real futura.
 */
export const mockApiCall = async <T>(simulateData: T, delayMs = 600): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(simulateData);
    }, delayMs);
  });
};
