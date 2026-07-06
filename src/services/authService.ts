/**
 * MOVICA - SERVICIO DE AUTENTICACIÓN, SESIÓN Y ROLES
 * 
 * Gestiona el ciclo de vida del usuario, permisos y verificación de tokens JWT.
 * Preparado para conectarse con Firebase Auth, Supabase Auth o un backend personalizado.
 */

import { apiFetch, mockApiCall } from './apiClient';

export type UserRole = 'cliente' | 'aliado' | 'comercio' | 'supervisor' | 'administrador';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarLetter: string;
  permissions: string[];
}

/**
 * Matriz de Permisos de Movica
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  cliente: ['order:create', 'order:read', 'chat:write', 'rating:write', 'profile:write'],
  aliado: ['order:accept', 'order:update', 'chat:write', 'wallet:read', 'profile:write'],
  comercio: ['menu:write', 'order:accept', 'wallet:read', 'profile:write'],
  supervisor: ['order:reassign', 'order:read', 'chat:read', 'alerts:resolve', 'moderation:warn'],
  administrador: ['*'] // Permiso absoluto para configurar tarifas, asignar roles y moderar
};

/**
 * Inicia sesión en el servidor remoto
 */
export async function loginUser(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  /**
   * FUTURA INTEGRACIÓN CON BACKEND:
   * 
   * return await apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
   *   method: 'POST',
   *   requiresAuth: false,
   *   body: JSON.stringify({ email, password })
   * });
   */
  
  // Simulación interactiva:
  const mockUser: AuthUser = {
    id: 'USR-8819',
    name: email.split('@')[0].toUpperCase(),
    email: email,
    phone: '+57 300 123 4567',
    role: email.includes('admin') ? 'administrador' : email.includes('super') ? 'supervisor' : 'cliente',
    avatarLetter: email.charAt(0).toUpperCase(),
    permissions: email.includes('admin') ? ROLE_PERMISSIONS.administrador : ROLE_PERMISSIONS.cliente
  };

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU1ItODgxOSIsInJvbGUiOiJjbGllbnRlIn0';

  return mockApiCall({
    token: mockToken,
    user: mockUser
  });
}

/**
 * Registra un nuevo aliado en el sistema (Módulo 21 - Verificación)
 */
export async function registerAlly(formData: any): Promise<{ success: boolean; allyId: string }> {
  /**
   * FUTURA INTEGRACIÓN CON BACKEND / CLOUDINARY:
   * 
   * 1. Se suben los archivos PDF (Cédula, Licencia, SOAT) a Cloudinary / S3.
   * 2. Se envía el JSON con las URLs de los documentos adjuntos al backend:
   * 
   * return await apiFetch<{ success: boolean; allyId: string }>('/allies/register', {
   *   method: 'POST',
   *   requiresAuth: false,
   *   body: JSON.stringify(formData)
   * });
   */
  return mockApiCall({
    success: true,
    allyId: 'ALY-' + Math.floor(Math.random() * 900 + 100)
  });
}

/**
 * Cierra la sesión activa borrando los tokens
 */
export function logoutUser(): void {
  localStorage.removeItem('movica_auth_token');
  localStorage.removeItem('movica_user_role');
  console.log('[SESSION]: Sesión destruida localmente.');
}

/**
 * Valida si el usuario actual cuenta con los permisos necesarios
 */
export function hasPermission(user: AuthUser, requiredPermission: string): boolean {
  if (user.permissions.includes('*')) return true;
  return user.permissions.includes(requiredPermission);
}
