/**
 * MOVICA - UTILIDADES DE SEGURIDAD Y PREPARACIÓN DE SCHEMAS DE BASE DE DATOS
 * 
 * Contiene diagramas documentados y utilidades de ayuda para asegurar
 * la consistencia de los esquemas en el motor relacional de base de datos relacional (PostgreSQL).
 */

/**
 * REPRESENTACIÓN DEL ESQUEMA ENTIDAD-RELACIÓN PARA POSTGRESQL (DRIZZLE ORM / SEQUELIZE)
 * 
 * Se detallan las tablas necesarias para la operación y sus relaciones:
 * 
 * 1. TABLA: usuarios (Cliente, Aliado, Comercio, Admin, Supervisor)
 *    - id: UUID (Primary Key)
 *    - nombre: VARCHAR(100)
 *    - correo: VARCHAR(120) UNIQUE
 *    - hash_clave: VARCHAR(255) (Hasheado con Argon2id o bcrypt)
 *    - telefono: VARCHAR(20)
 *    - rol: VARCHAR(30) (cliente, aliado, comercio, supervisor, administrador)
 *    - estado: VARCHAR(20) (activo, suspendido, bloqueado)
 *    - fecha_creacion: TIMESTAMP
 * 
 * 2. TABLA: aliados
 *    - id: UUID (Primary Key) -> Referencia a usuarios.id
 *    - tipo_vehiculo: VARCHAR(50) (moto, carro, bicicleta)
 *    - placa: VARCHAR(15)
 *    - soat_url: TEXT
 *    - licencia_url: TEXT
 *    - calificacion: DECIMAL(3,2)
 *    - disponible: BOOLEAN
 * 
 * 3. TABLA: servicios_pedidos
 *    - id: UUID (Primary Key)
 *    - cliente_id: UUID -> Referencia a usuarios.id
 *    - aliado_id: UUID (Nullable) -> Referencia a aliados.id
 *    - tipo: VARCHAR(30) (mototaxi, domicilio, encomienda, compra, mandado)
 *    - origen: TEXT
 *    - destino: TEXT
 *    - tarifa: DECIMAL(10,2)
 *    - estado: VARCHAR(25) (solicitado, asignado, en_camino, completado, cancelado)
 *    - fecha: TIMESTAMP
 * 
 * 4. TABLA: pagos
 *    - id: UUID (Primary Key)
 *    - pedido_id: UUID -> Referencia a servicios_pedidos.id
 *    - pasarela_tx_id: VARCHAR(100)
 *    - monto: DECIMAL(10,2)
 *    - comision_movica: DECIMAL(10,2)
 *    - metodo: VARCHAR(30) (tarjeta, pse, nequi, efectivo)
 *    - estado: VARCHAR(20) (aprobado, fallido, pendiente)
 * 
 * 5. TABLA: chat_mensajes
 *    - id: UUID (Primary Key)
 *    - pedido_id: UUID -> Referencia a servicios_pedidos.id
 *    - remitente_id: UUID -> Referencia a usuarios.id
 *    - mensaje: TEXT
 *    - enviado_en: TIMESTAMP
 * 
 * 6. TABLA: moderacion_reportes
 *    - id: VARCHAR(20) (Primary Key)
 *    - reportador_id: UUID -> Referencia a usuarios.id
 *    - reportado_id: UUID -> Referencia a usuarios.id
 *    - motivo: TEXT
 *    - estado: VARCHAR(25) (pendiente, archivado, advertido, suspendido, bloqueado)
 *    - fecha: TIMESTAMP
 */

/**
 * Utilidad simple de formateo de moneda para visualización premium de pesos colombianos (COP)
 */
export const formatColombianPesos = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Valida de forma sintáctica y robusta si un correo electrónico cumple el estándar.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calcula la estimación de tarifa de servicio basándose en una base y distancia.
 */
export const calculateEstimatedFare = (type: string, distanceKm: number): number => {
  const baseRates: Record<string, number> = {
    mototaxi: 3500,
    domicilio: 4000,
    encomienda: 5000,
    compra: 6000,
    mandado: 4500
  };

  const ratePerKm = 1200; // COP por kilómetro
  const base = baseRates[type] || 4000;
  
  // Redondear al múltiplo de 100 más cercano para tarifas amigables
  const rawFare = base + (distanceKm * ratePerKm);
  return Math.round(rawFare / 100) * 100;
};
