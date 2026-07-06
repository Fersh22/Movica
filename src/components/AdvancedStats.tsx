import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart2, TrendingUp, Users, Bike, Star, ClipboardList, DollarSign,
  Download, FileText, Printer, Calendar, Clock, ArrowRight, RefreshCw, 
  ChevronRight, ShoppingBag, Send, Coffee, ThumbsUp, AlertCircle, ShieldAlert,
  Search, CheckCircle2, Award, Zap
} from 'lucide-react';

// Types
export type FilterType = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'anio';

interface GeneralStats {
  servicesCompleted: number;
  revenue: number;
  newClients: number;
  activePartners: number;
  averageRating: number;
  categories: {
    mototaxi: number;
    domicilio: number;
    encomiendas: number;
    compra: number;
    mandados: number;
  };
}

interface ClientStat {
  id: string;
  name: string;
  phone: string;
  servicesCount: number;
  spent: number;
  status: 'frecuente' | 'nuevo' | 'inactivo';
  lastService: string;
  avatar: string;
}

interface PartnerStat {
  id: string;
  name: string;
  vehicle: string;
  servicesCount: number;
  rating: number;
  earnings: number;
  acceptanceTime: string; // e.g. "45s", "1.2m"
  status: 'online' | 'offline';
  avatar: string;
}

interface ServiceTypeStat {
  icon: string;
  name: string;
  key: string;
  count: number;
  revenue: number;
  completedRate: number; // e.g. 98%
  avgFare: number;
  color: string;
}

// Simulated data set for each filter
const STATS_BY_FILTER: Record<FilterType, {
  general: GeneralStats;
  clients: ClientStat[];
  partners: PartnerStat[];
  serviceTypes: ServiceTypeStat[];
  chartData: {
    labels: string[];
    services: number[];
    revenue: number[];
  };
  hourlyDemand: { hour: string; services: number; percentage: number }[];
}> = {
  hoy: {
    general: {
      servicesCompleted: 142,
      revenue: 846000,
      newClients: 18,
      activePartners: 32,
      averageRating: 4.88,
      categories: {
        mototaxi: 68,
        domicilio: 42,
        encomiendas: 16,
        compra: 10,
        mandados: 6
      }
    },
    clients: [
      { id: 'c-1', name: 'Alvaro Sonic Alvarez', phone: '+57 315 224 8899', servicesCount: 4, spent: 28000, status: 'frecuente', lastService: 'Hace 30 min', avatar: '👨‍💻' },
      { id: 'c-2', name: 'Maria Camila Vega', phone: '+57 312 456 7890', servicesCount: 3, spent: 19500, status: 'frecuente', lastService: 'Hace 2 horas', avatar: '👩' },
      { id: 'c-3', name: 'Carlos Mario Peña', phone: '+57 318 901 2345', servicesCount: 2, spent: 15000, status: 'frecuente', lastService: 'Hace 4 horas', avatar: '👨' },
      { id: 'c-4', name: 'Diana Patricia Gomez', phone: '+57 320 678 9012', servicesCount: 1, spent: 8000, status: 'nuevo', lastService: 'Hace 1 hora', avatar: '👩‍🦳' },
      { id: 'c-5', name: 'Jorge Eliecer Ortiz', phone: '+57 310 345 6789', servicesCount: 0, spent: 0, status: 'inactivo', lastService: 'Hace 8 días', avatar: '👴' }
    ],
    partners: [
      { id: 'p-1', name: 'Yeison Ramirez', vehicle: 'Suzuki GN 125 (KJL-88D)', servicesCount: 14, rating: 4.95, earnings: 92000, acceptanceTime: '18s', status: 'online', avatar: '🏍️' },
      { id: 'p-2', name: 'Andres Felipe Ortiz', vehicle: 'Yamaha Crypton (ZMW-12F)', servicesCount: 12, rating: 4.90, earnings: 78000, acceptanceTime: '24s', status: 'online', avatar: '🛵' },
      { id: 'p-3', name: 'Diego Alejandro Castro', vehicle: 'Bajaj Pulsar (QWE-99A)', servicesCount: 11, rating: 4.82, earnings: 74500, acceptanceTime: '35s', status: 'online', avatar: '🏍️' },
      { id: 'p-4', name: 'Carlos Mario Giraldo', vehicle: 'Honda Splendor (YTR-45C)', servicesCount: 9, rating: 4.75, earnings: 58000, acceptanceTime: '52s', status: 'online', avatar: '🛵' },
      { id: 'p-5', name: 'Jose Luis Pinilla', vehicle: 'Yamaha FZ25 (TRX-102)', servicesCount: 6, rating: 4.60, earnings: 42000, acceptanceTime: '1.4m', status: 'offline', avatar: '🏍️' }
    ],
    serviceTypes: [
      { icon: '🛵', name: 'Mototaxi', key: 'mototaxi', count: 68, revenue: 340000, completedRate: 98.5, avgFare: 5000, color: 'bg-primary' },
      { icon: '🍔', name: 'Domicilios', key: 'domicilio', count: 42, revenue: 252000, completedRate: 96.2, avgFare: 6000, color: 'bg-amber-500' },
      { icon: '📦', name: 'Encomiendas', key: 'encomiendas', count: 16, revenue: 128000, completedRate: 100.0, avgFare: 8000, color: 'bg-blue-500' },
      { icon: '🛒', name: 'Compra de productos', key: 'compra', count: 10, revenue: 80000, completedRate: 94.0, avgFare: 8000, color: 'bg-purple-500' },
      { icon: '📋', name: 'Mandados personales', key: 'mandados', count: 6, revenue: 46000, completedRate: 100.0, avgFare: 7660, color: 'bg-rose-500' }
    ],
    chartData: {
      labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      services: [12, 28, 38, 22, 34, 8],
      revenue: [72000, 168000, 228000, 132000, 204000, 42000]
    },
    hourlyDemand: [
      { hour: '07 AM - 09 AM (Pico Mañana)', services: 32, percentage: 78 },
      { hour: '11:30 AM - 01:30 PM (Almuerzo)', services: 44, percentage: 95 },
      { hour: '05 PM - 07 PM (Retorno/Pico Tarde)', services: 38, percentage: 86 },
      { hour: 'Horas Valle (Tarde/Noche)', services: 28, percentage: 42 }
    ]
  },
  semana: {
    general: {
      servicesCompleted: 980,
      revenue: 5980000,
      newClients: 112,
      activePartners: 48,
      averageRating: 4.85,
      categories: {
        mototaxi: 480,
        domicilio: 290,
        encomiendas: 110,
        compra: 65,
        mandados: 35
      }
    },
    clients: [
      { id: 'c-1', name: 'Alvaro Sonic Alvarez', phone: '+57 315 224 8899', servicesCount: 22, spent: 154000, status: 'frecuente', lastService: 'Hace 30 min', avatar: '👨‍💻' },
      { id: 'c-2', name: 'Maria Camila Vega', phone: '+57 312 456 7890', servicesCount: 18, spent: 117000, status: 'frecuente', lastService: 'Hace 2 horas', avatar: '👩' },
      { id: 'c-3', name: 'Carlos Mario Peña', phone: '+57 318 901 2345', servicesCount: 15, spent: 105000, status: 'frecuente', lastService: 'Hace 4 horas', avatar: '👨' },
      { id: 'c-4', name: 'Diana Patricia Gomez', phone: '+57 320 678 9012', servicesCount: 6, spent: 44000, status: 'nuevo', lastService: 'Hace 1 hora', avatar: '👩‍🦳' },
      { id: 'c-5', name: 'Jorge Eliecer Ortiz', phone: '+57 310 345 6789', servicesCount: 1, spent: 6000, status: 'inactivo', lastService: 'Hace 6 días', avatar: '👴' }
    ],
    partners: [
      { id: 'p-1', name: 'Yeison Ramirez', vehicle: 'Suzuki GN 125 (KJL-88D)', servicesCount: 88, rating: 4.96, earnings: 580000, acceptanceTime: '15s', status: 'online', avatar: '🏍️' },
      { id: 'p-2', name: 'Andres Felipe Ortiz', vehicle: 'Yamaha Crypton (ZMW-12F)', servicesCount: 82, rating: 4.92, earnings: 540000, acceptanceTime: '22s', status: 'online', avatar: '🛵' },
      { id: 'p-3', name: 'Diego Alejandro Castro', vehicle: 'Bajaj Pulsar (QWE-99A)', servicesCount: 79, rating: 4.85, earnings: 512000, acceptanceTime: '32s', status: 'online', avatar: '🏍️' },
      { id: 'p-4', name: 'Carlos Mario Giraldo', vehicle: 'Honda Splendor (YTR-45C)', servicesCount: 71, rating: 4.79, earnings: 460000, acceptanceTime: '48s', status: 'online', avatar: '🛵' },
      { id: 'p-5', name: 'Jose Luis Pinilla', vehicle: 'Yamaha FZ25 (TRX-102)', servicesCount: 54, rating: 4.65, earnings: 345000, acceptanceTime: '1.2m', status: 'offline', avatar: '🏍️' }
    ],
    serviceTypes: [
      { icon: '🛵', name: 'Mototaxi', key: 'mototaxi', count: 480, revenue: 2400000, completedRate: 98.2, avgFare: 5000, color: 'bg-primary' },
      { icon: '🍔', name: 'Domicilios', key: 'domicilio', count: 290, revenue: 1740000, completedRate: 95.8, avgFare: 6000, color: 'bg-amber-500' },
      { icon: '📦', name: 'Encomiendas', key: 'encomiendas', count: 110, revenue: 880000, completedRate: 99.1, avgFare: 8000, color: 'bg-blue-500' },
      { icon: '🛒', name: 'Compra de productos', key: 'compra', count: 65, revenue: 520000, completedRate: 93.5, avgFare: 8000, color: 'bg-purple-500' },
      { icon: '📋', name: 'Mandados personales', key: 'mandados', count: 35, revenue: 440000, completedRate: 97.1, avgFare: 12570, color: 'bg-rose-500' }
    ],
    chartData: {
      labels: ['Lunes', 'Martes', 'Miérc.', 'Jueves', 'Viernes', 'Sáb.', 'Dom.'],
      services: [110, 125, 132, 128, 164, 185, 136],
      revenue: [671000, 762500, 805200, 780800, 1000400, 1128500, 829600]
    },
    hourlyDemand: [
      { hour: '07 AM - 09 AM (Pico Mañana)', services: 210, percentage: 75 },
      { hour: '11:30 AM - 01:30 PM (Almuerzo)', services: 295, percentage: 92 },
      { hour: '05 PM - 07 PM (Retorno/Pico Tarde)', services: 265, percentage: 84 },
      { hour: 'Horas Valle (Tarde/Noche)', services: 210, percentage: 45 }
    ]
  },
  mes: {
    general: {
      servicesCompleted: 4200,
      revenue: 25620000,
      newClients: 450,
      activePartners: 54,
      averageRating: 4.84,
      categories: {
        mototaxi: 2100,
        domicilio: 1200,
        encomiendas: 480,
        compra: 270,
        mandados: 150
      }
    },
    clients: [
      { id: 'c-1', name: 'Alvaro Sonic Alvarez', phone: '+57 315 224 8899', servicesCount: 84, spent: 588000, status: 'frecuente', lastService: 'Hace 30 min', avatar: '👨‍💻' },
      { id: 'c-2', name: 'Maria Camila Vega', phone: '+57 312 456 7890', servicesCount: 68, spent: 442000, status: 'frecuente', lastService: 'Hace 2 horas', avatar: '👩' },
      { id: 'c-3', name: 'Carlos Mario Peña', phone: '+57 318 901 2345', servicesCount: 52, spent: 364000, status: 'frecuente', lastService: 'Hace 4 horas', avatar: '👨' },
      { id: 'c-4', name: 'Diana Patricia Gomez', phone: '+57 320 678 9012', servicesCount: 14, spent: 98000, status: 'nuevo', lastService: 'Hace 1 hora', avatar: '👩‍🦳' },
      { id: 'c-5', name: 'Jorge Eliecer Ortiz', phone: '+57 310 345 6789', servicesCount: 2, spent: 12000, status: 'inactivo', lastService: 'Hace 15 días', avatar: '👴' }
    ],
    partners: [
      { id: 'p-1', name: 'Yeison Ramirez', vehicle: 'Suzuki GN 125 (KJL-88D)', servicesCount: 360, rating: 4.97, earnings: 2450000, acceptanceTime: '14s', status: 'online', avatar: '🏍️' },
      { id: 'p-2', name: 'Andres Felipe Ortiz', vehicle: 'Yamaha Crypton (ZMW-12F)', servicesCount: 335, rating: 4.93, earnings: 2210000, acceptanceTime: '21s', status: 'online', avatar: '🛵' },
      { id: 'p-3', name: 'Diego Alejandro Castro', vehicle: 'Bajaj Pulsar (QWE-99A)', servicesCount: 310, rating: 4.86, earnings: 2046000, acceptanceTime: '30s', status: 'online', avatar: '🏍️' },
      { id: 'p-4', name: 'Carlos Mario Giraldo', vehicle: 'Honda Splendor (YTR-45C)', servicesCount: 290, rating: 4.80, earnings: 1914000, acceptanceTime: '45s', status: 'online', avatar: '🛵' },
      { id: 'p-5', name: 'Jose Luis Pinilla', vehicle: 'Yamaha FZ25 (TRX-102)', servicesCount: 210, rating: 4.67, earnings: 1386000, acceptanceTime: '1.1m', status: 'offline', avatar: '🏍️' }
    ],
    serviceTypes: [
      { icon: '🛵', name: 'Mototaxi', key: 'mototaxi', count: 2100, revenue: 10500000, completedRate: 98.4, avgFare: 5000, color: 'bg-primary' },
      { icon: '🍔', name: 'Domicilios', key: 'domicilio', count: 1200, revenue: 7200000, completedRate: 96.0, avgFare: 6000, color: 'bg-amber-500' },
      { icon: '📦', name: 'Encomiendas', key: 'encomiendas', count: 480, revenue: 3840000, completedRate: 99.3, avgFare: 8000, color: 'bg-blue-500' },
      { icon: '🛒', name: 'Compra de productos', key: 'compra', count: 270, revenue: 2160000, completedRate: 94.2, avgFare: 8000, color: 'bg-purple-500' },
      { icon: '📋', name: 'Mandados personales', key: 'mandados', count: 150, revenue: 1920000, completedRate: 97.5, avgFare: 12800, color: 'bg-rose-500' }
    ],
    chartData: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      services: [940, 1050, 1120, 1090],
      revenue: [5734000, 6405000, 6832000, 6649000]
    },
    hourlyDemand: [
      { hour: '07 AM - 09 AM (Pico Mañana)', services: 920, percentage: 76 },
      { hour: '11:30 AM - 01:30 PM (Almuerzo)', services: 1280, percentage: 94 },
      { hour: '05 PM - 07 PM (Retorno/Pico Tarde)', services: 1140, percentage: 85 },
      { hour: 'Horas Valle (Tarde/Noche)', services: 860, percentage: 48 }
    ]
  },
  trimestre: {
    general: {
      servicesCompleted: 13100,
      revenue: 79910000,
      newClients: 1280,
      activePartners: 62,
      averageRating: 4.83,
      categories: {
        mototaxi: 6550,
        domicilio: 3740,
        encomiendas: 1490,
        compra: 840,
        mandados: 480
      }
    },
    clients: [
      { id: 'c-1', name: 'Alvaro Sonic Alvarez', phone: '+57 315 224 8899', servicesCount: 248, spent: 1736000, status: 'frecuente', lastService: 'Hace 30 min', avatar: '👨‍💻' },
      { id: 'c-2', name: 'Maria Camila Vega', phone: '+57 312 456 7890', servicesCount: 198, spent: 1287000, status: 'frecuente', lastService: 'Hace 2 horas', avatar: '👩' },
      { id: 'c-3', name: 'Carlos Mario Peña', phone: '+57 318 901 2345', servicesCount: 164, spent: 1148000, status: 'frecuente', lastService: 'Hace 4 horas', avatar: '👨' },
      { id: 'c-4', name: 'Diana Patricia Gomez', phone: '+57 320 678 9012', servicesCount: 38, spent: 266000, status: 'nuevo', lastService: 'Hace 1 hora', avatar: '👩‍🦳' },
      { id: 'c-5', name: 'Jorge Eliecer Ortiz', phone: '+57 310 345 6789', servicesCount: 11, spent: 72000, status: 'inactivo', lastService: 'Hace 24 días', avatar: '👴' }
    ],
    partners: [
      { id: 'p-1', name: 'Yeison Ramirez', vehicle: 'Suzuki GN 125 (KJL-88D)', servicesCount: 1120, rating: 4.96, earnings: 7616000, acceptanceTime: '13s', status: 'online', avatar: '🏍️' },
      { id: 'p-2', name: 'Andres Felipe Ortiz', vehicle: 'Yamaha Crypton (ZMW-12F)', servicesCount: 1045, rating: 4.94, earnings: 7106000, acceptanceTime: '19s', status: 'online', avatar: '🛵' },
      { id: 'p-3', name: 'Diego Alejandro Castro', vehicle: 'Bajaj Pulsar (QWE-99A)', servicesCount: 980, rating: 4.88, earnings: 6664000, acceptanceTime: '28s', status: 'online', avatar: '🏍️' },
      { id: 'p-4', name: 'Carlos Mario Giraldo', vehicle: 'Honda Splendor (YTR-45C)', servicesCount: 912, rating: 4.82, earnings: 6201600, acceptanceTime: '42s', status: 'online', avatar: '🛵' },
      { id: 'p-5', name: 'Jose Luis Pinilla', vehicle: 'Yamaha FZ25 (TRX-102)', servicesCount: 680, rating: 4.70, earnings: 4624000, acceptanceTime: '1.0m', status: 'offline', avatar: '🏍️' }
    ],
    serviceTypes: [
      { icon: '🛵', name: 'Mototaxi', key: 'mototaxi', count: 6550, revenue: 32750000, completedRate: 98.6, avgFare: 5000, color: 'bg-primary' },
      { icon: '🍔', name: 'Domicilios', key: 'domicilio', count: 3740, revenue: 22440000, completedRate: 96.1, avgFare: 6000, color: 'bg-amber-500' },
      { icon: '📦', name: 'Encomiendas', key: 'encomiendas', count: 1490, revenue: 11920000, completedRate: 99.4, avgFare: 8000, color: 'bg-blue-500' },
      { icon: '🛒', name: 'Compra de productos', key: 'compra', count: 840, revenue: 6720000, completedRate: 94.6, avgFare: 8000, color: 'bg-purple-500' },
      { icon: '📋', name: 'Mandados personales', key: 'mandados', count: 480, revenue: 6080000, completedRate: 97.8, avgFare: 12660, color: 'bg-rose-500' }
    ],
    chartData: {
      labels: ['Abril', 'Mayo', 'Junio'],
      services: [4100, 4400, 4600],
      revenue: [25010000, 26840000, 28060000]
    },
    hourlyDemand: [
      { hour: '07 AM - 09 AM (Pico Mañana)', services: 2850, percentage: 76 },
      { hour: '11:30 AM - 01:30 PM (Almuerzo)', services: 3980, percentage: 95 },
      { hour: '05 PM - 07 PM (Retorno/Pico Tarde)', services: 3510, percentage: 84 },
      { hour: 'Horas Valle (Tarde/Noche)', services: 2760, percentage: 46 }
    ]
  },
  anio: {
    general: {
      servicesCompleted: 54200,
      revenue: 330620000,
      newClients: 5120,
      activePartners: 70,
      averageRating: 4.82,
      categories: {
        mototaxi: 27100,
        domicilio: 15460,
        encomiendas: 6180,
        compra: 3480,
        mandados: 1980
      }
    },
    clients: [
      { id: 'c-1', name: 'Alvaro Sonic Alvarez', phone: '+57 315 224 8899', servicesCount: 980, spent: 6860000, status: 'frecuente', lastService: 'Hace 30 min', avatar: '👨‍💻' },
      { id: 'c-2', name: 'Maria Camila Vega', phone: '+57 312 456 7890', servicesCount: 785, spent: 5102500, status: 'frecuente', lastService: 'Hace 2 horas', avatar: '👩' },
      { id: 'c-3', name: 'Carlos Mario Peña', phone: '+57 318 901 2345', servicesCount: 654, spent: 4578000, status: 'frecuente', lastService: 'Hace 4 horas', avatar: '👨' },
      { id: 'c-4', name: 'Diana Patricia Gomez', phone: '+57 320 678 9012', servicesCount: 154, spent: 1078000, status: 'nuevo', lastService: 'Hace 1 hora', avatar: '👩‍🦳' },
      { id: 'c-5', name: 'Jorge Eliecer Ortiz', phone: '+57 310 345 6789', servicesCount: 45, spent: 292500, status: 'inactivo', lastService: 'Hace 24 días', avatar: '👴' }
    ],
    partners: [
      { id: 'p-1', name: 'Yeison Ramirez', vehicle: 'Suzuki GN 125 (KJL-88D)', servicesCount: 4620, rating: 4.96, earnings: 31416000, acceptanceTime: '13s', status: 'online', avatar: '🏍️' },
      { id: 'p-2', name: 'Andres Felipe Ortiz', vehicle: 'Yamaha Crypton (ZMW-12F)', servicesCount: 4210, rating: 4.94, earnings: 28628000, acceptanceTime: '20s', status: 'online', avatar: '🛵' },
      { id: 'p-3', name: 'Diego Alejandro Castro', vehicle: 'Bajaj Pulsar (QWE-99A)', servicesCount: 3950, rating: 4.87, earnings: 26860000, acceptanceTime: '29s', status: 'online', avatar: '🏍️' },
      { id: 'p-4', name: 'Carlos Mario Giraldo', vehicle: 'Honda Splendor (YTR-45C)', servicesCount: 3680, rating: 4.81, earnings: 25024000, acceptanceTime: '43s', status: 'online', avatar: '🛵' },
      { id: 'p-5', name: 'Jose Luis Pinilla', vehicle: 'Yamaha FZ25 (TRX-102)', servicesCount: 2950, rating: 4.71, earnings: 20060000, acceptanceTime: '1.0m', status: 'offline', avatar: '🏍️' }
    ],
    serviceTypes: [
      { icon: '🛵', name: 'Mototaxi', key: 'mototaxi', count: 27100, revenue: 135500000, completedRate: 98.5, avgFare: 5000, color: 'bg-primary' },
      { icon: '🍔', name: 'Domicilios', key: 'domicilio', count: 15460, revenue: 92760000, completedRate: 96.2, avgFare: 6000, color: 'bg-amber-500' },
      { icon: '📦', name: 'Encomiendas', key: 'encomiendas', count: 6180, revenue: 49440000, completedRate: 99.2, avgFare: 8000, color: 'bg-blue-500' },
      { icon: '🛒', name: 'Compra de productos', key: 'compra', count: 3480, revenue: 27840000, completedRate: 94.3, avgFare: 8000, color: 'bg-purple-500' },
      { icon: '📋', name: 'Mandados personales', key: 'mandados', count: 1980, revenue: 25080000, completedRate: 97.6, avgFare: 12660, color: 'bg-rose-500' }
    ],
    chartData: {
      labels: ['Ene-Feb', 'Mar-Abr', 'May-Jun', 'Jul-Ago', 'Sep-Oct', 'Nov-Dic'],
      services: [14200, 15600, 16800, 18900, 19400, 21200],
      revenue: [86620000, 95160000, 102480000, 115290000, 118340000, 129320000]
    },
    hourlyDemand: [
      { hour: '07 AM - 09 AM (Pico Mañana)', services: 11420, percentage: 76 },
      { hour: '11:30 AM - 01:30 PM (Almuerzo)', services: 16120, percentage: 95 },
      { hour: '05 PM - 07 PM (Retorno/Pico Tarde)', services: 14220, percentage: 84 },
      { hour: 'Horas Valle (Tarde/Noche)', services: 12440, percentage: 48 }
    ]
  }
};

export default function AdvancedStats() {
  const [filter, setFilter] = useState<FilterType>('mes');
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'clientes' | 'aliados' | 'servicios'>('dashboard');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action Feedback Modals/Toasts
  const [exportModal, setExportModal] = useState<{ isOpen: boolean; type: 'pdf' | 'excel' | 'print'; status: 'idle' | 'processing' | 'success' }>({
    isOpen: false,
    type: 'pdf',
    status: 'idle'
  });

  const currentData = STATS_BY_FILTER[filter];

  // Helper to format currency in Colombian Peso
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExportAction = (type: 'pdf' | 'excel' | 'print') => {
    setExportModal({
      isOpen: true,
      type,
      status: 'processing'
    });

    // Simulate progress
    setTimeout(() => {
      setExportModal(prev => ({
        ...prev,
        status: 'success'
      }));
    }, 2200);
  };

  const closeExportModal = () => {
    setExportModal({ isOpen: false, type: 'pdf', status: 'idle' });
  };

  // Compute stats for Categories chart
  const categoriesList = Object.entries(currentData.general.categories).map(([key, val]) => {
    const numericVal = val as number;
    const total = (Object.values(currentData.general.categories) as number[]).reduce((a, b) => a + b, 0);
    const percentage = total > 0 ? Math.round((numericVal / total) * 100) : 0;
    const config = currentData.serviceTypes.find(st => st.key === key) || { name: key, color: 'bg-primary', icon: '❓' };
    return {
      key,
      name: config.name,
      value: numericVal,
      percentage,
      color: config.color,
      icon: config.icon
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 text-left">
      
      {/* FILTER BAR & EXPORT ACTIONS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white p-4.5 rounded-3xl border border-divider/60 shadow-xs">
        
        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-black text-ink-soft uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
            <Calendar size={13} className="text-primary" /> Periodo:
          </span>
          {[
            { id: 'hoy', label: 'Hoy' },
            { id: 'semana', label: 'Esta Semana' },
            { id: 'mes', label: 'Este Mes' },
            { id: 'trimestre', label: 'Últimos 3 Meses' },
            { id: 'anio', label: 'Este Año' }
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setFilter(p.id as FilterType);
                setSearchQuery('');
              }}
              className={`text-[10.5px] font-black py-2 px-3.5 rounded-xl transition-all cursor-pointer select-none ${
                filter === p.id 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'bg-surface-alt/80 text-ink-soft hover:bg-surface-alt border border-divider/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExportAction('excel')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-[#D4F0DF] text-emerald-700 text-[10.5px] font-black uppercase px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border border-emerald-200"
          >
            <Download size={13} /> Excel
          </button>
          <button
            type="button"
            onClick={() => handleExportAction('pdf')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10.5px] font-black uppercase px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border border-rose-150"
          >
            <FileText size={13} /> PDF
          </button>
          <button
            type="button"
            onClick={() => handleExportAction('print')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10.5px] font-black uppercase px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border border-blue-200"
          >
            <Printer size={13} /> Imprimir
          </button>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION (BENTO LEVEL) */}
      <div className="flex border-b border-divider/60 bg-surface-alt/40 p-1.5 rounded-2xl gap-1">
        {[
          { id: 'dashboard', label: 'Dashboard General 📈' },
          { id: 'clientes', label: 'Clientes Frecuentes 👥' },
          { id: 'aliados', label: 'Conductores & Aliados 🛵' },
          { id: 'servicios', label: 'Por Tipo de Servicio 📦' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 text-[11px] font-black py-2.5 rounded-xl transition-all text-center cursor-pointer ${
              activeSubTab === tab.id 
                ? 'bg-white text-primary shadow-xs border border-divider/40' 
                : 'text-ink-soft hover:bg-white/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD GENERAL */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* CARDS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white p-4.5 rounded-3xl border border-divider/50 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Servicios Realizados</span>
                <span className="text-sm">📈</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-sora font-extrabold text-ink leading-none">{currentData.general.servicesCompleted}</span>
                <span className="text-[9px] text-emerald-600 font-bold block mt-1">✔ 98.2% completados</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-3xl border border-divider/50 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Ingresos Consolidados</span>
                <span className="text-sm">💰</span>
              </div>
              <div className="mt-3">
                <span className="text-xl font-sora font-extrabold text-primary leading-none">{formatCOP(currentData.general.revenue)}</span>
                <span className="text-[9px] text-ink-soft block mt-1">Recaudo bruto en Aguachica</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-3xl border border-divider/50 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Clientes Nuevos</span>
                <span className="text-sm">👥</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-sora font-extrabold text-ink leading-none">+{currentData.general.newClients}</span>
                <span className="text-[9px] text-emerald-600 font-bold block mt-1">▲ Crecimiento exponencial</span>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-3xl border border-divider/50 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Aliados Activos</span>
                <span className="text-sm">🛵</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-sora font-extrabold text-ink leading-none">{currentData.general.activePartners}</span>
                <span className="text-[9px] text-[#0EA65C] font-bold block mt-1">● Conectados en ruta</span>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1 bg-white p-4.5 rounded-3xl border border-divider/50 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[9.5px] text-ink-soft font-black uppercase tracking-wider">Calificación Promedio</span>
                <span className="text-sm">⭐</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-sora font-extrabold text-ink leading-none">{currentData.general.averageRating}</span>
                  <div className="flex text-amber-500 text-xs">★</div>
                </div>
                <span className="text-[9px] text-ink-soft block mt-1">De un total de 5.0 posibles</span>
              </div>
            </div>

          </div>

          {/* DYNAMIC CHART & Demanda Horaria */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Main Interactive Chart Box (Revenues & Services) */}
            <div className="lg:col-span-8 bg-white border border-divider/60 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-sora font-extrabold text-xs text-ink">Historial de Rendimiento General</h4>
                  <p className="text-[10px] text-ink-soft">Línea de tendencia de viajes vs ingresos percibidos.</p>
                </div>
                
                <div className="flex items-center gap-3 text-[9px] font-bold text-ink-soft">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Servicios Realizados
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Ingresos ($ COP)
                  </div>
                </div>
              </div>

              {/* Draw Custom Animated SVG Chart */}
              <div className="relative h-64 bg-surface-alt/35 rounded-2xl border border-divider/40 p-4 flex flex-col justify-between">
                
                {/* SVG Graph Grid overlay */}
                <div className="absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-divider/60 w-full" />
                  <div className="border-b border-divider/60 w-full" />
                  <div className="border-b border-divider/60 w-full" />
                  <div className="border-b border-divider/60 w-full" />
                </div>

                {/* Main Graph Drawing Area */}
                <div className="flex-1 relative flex items-end">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {/* Background gradient for services curve */}
                    <defs>
                      <linearGradient id="gradient-services" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA65C" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#0EA65C" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="gradient-revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
                      </linearGradient>
                    </defs>

                    {/* Dynamic curve lines based on actual data points */}
                    {(() => {
                      const count = currentData.chartData.services.length;
                      const maxServices = Math.max(...currentData.chartData.services, 1);
                      const maxRevenue = Math.max(...currentData.chartData.revenue, 1);

                      // Calculate coordinate points
                      const ptsServices = currentData.chartData.services.map((val, idx) => {
                        const x = (idx / (count - 1)) * 100; // % scale
                        const y = 90 - (val / maxServices) * 75; // % scale from bottom
                        return { x, y, raw: val };
                      });

                      const ptsRevenue = currentData.chartData.revenue.map((val, idx) => {
                        const x = (idx / (count - 1)) * 100;
                        const y = 90 - (val / maxRevenue) * 75;
                        return { x, y, raw: val };
                      });

                      // Construct path string
                      const dServices = ptsServices.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ');
                      const dServicesArea = `${dServices} L 100% 90% L 0% 90% Z`;

                      const dRevenue = ptsRevenue.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ');
                      const dRevenueArea = `${dRevenue} L 100% 90% L 0% 90% Z`;

                      return (
                        <>
                          {/* Areas */}
                          <path d={dServicesArea} fill="url(#gradient-services)" />
                          <path d={dRevenueArea} fill="url(#gradient-revenue)" />

                          {/* Lines */}
                          <path d={dServices} fill="none" stroke="#0EA65C" strokeWidth="2.5" strokeLinecap="round" />
                          <path d={dRevenue} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />

                          {/* Circle interactive dots */}
                          {ptsServices.map((p, i) => (
                            <g key={`dot-s-${i}`} className="group/dot cursor-pointer">
                              <circle cx={`${p.x}%`} cy={`${p.y}%`} r="4" fill="#0EA65C" className="transition-all hover:r-6" />
                              <circle cx={`${p.x}%`} cy={`${p.y}%`} r="12" fill="transparent" />
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Floating tooltip labels on nodes */}
                  <div className="absolute inset-x-0 bottom-4 flex justify-between px-1.5 pointer-events-none">
                    {currentData.chartData.services.map((val, idx) => {
                      const maxS = Math.max(...currentData.chartData.services);
                      const isHigh = val === maxS;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded ${
                            isHigh ? 'bg-primary text-white' : 'bg-white border border-divider/60 text-ink'
                          }`}>
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="border-t border-divider/50 pt-2 flex justify-between text-[9px] font-bold text-ink-soft">
                  {currentData.chartData.labels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Demanda por Horas Pico / Categorías */}
            <div className="lg:col-span-4 bg-white border border-divider/60 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-sora font-extrabold text-xs text-ink">Horas de Mayor Demanda</h4>
                <p className="text-[10px] text-ink-soft mt-0.5">Rangos horarios con pico de pedidos.</p>
              </div>

              <div className="space-y-3.5 my-auto">
                {currentData.hourlyDemand.map((hd, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-ink flex items-center gap-1">
                        <Clock size={11} className="text-primary" /> {hd.hour}
                      </span>
                      <span className="font-mono font-black text-ink">{hd.services} viajes</span>
                    </div>

                    <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${hd.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#E6F7EC] text-primary-dark p-3 rounded-2xl text-[9.5px] leading-relaxed font-bold flex gap-2">
                <Zap size={15} className="shrink-0 text-primary mt-0.5 animate-pulse" />
                <span>
                  <strong>Tip de Operación:</strong> Los picos de almuerzo e ida a centros de estudio concentran el 64% de los pedidos de mototaxistas en Aguachica.
                </span>
              </div>
            </div>

          </div>

          {/* CATEGORIES BREAKDOWN PROGRESS BENTOS */}
          <div className="bg-white border border-divider/60 rounded-3xl p-5 space-y-4 shadow-sm">
            <div>
              <h4 className="font-sora font-extrabold text-xs text-ink">Servicios Consolidados por Categoría</h4>
              <p className="text-[10px] text-ink-soft">Desglose de uso por cada línea de servicio de Movica.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {categoriesList.map((cat) => (
                <div key={cat.key} className="bg-surface-alt/40 border border-divider/40 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xl p-1.5 bg-white rounded-xl shadow-3xs">{cat.icon}</span>
                    <span className="text-[10px] font-black text-ink-soft uppercase bg-white px-2 py-0.5 rounded-lg border border-divider/40">
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-sora font-extrabold text-[11px] text-ink">{cat.name}</h5>
                    <span className="font-mono font-black text-sm text-ink block">{cat.value} <span className="text-[9px] text-ink-faint font-sans">pedidos</span></span>
                  </div>

                  <div className="h-1.5 w-full bg-divider/60 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CLIENTES FRECUENTES */}
      {activeSubTab === 'clientes' && (
        <div className="space-y-5 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div>
              <h4 className="font-sora font-extrabold text-xs text-ink">Análisis y Segmentación de Clientes</h4>
              <p className="text-[10.5px] text-ink-soft">Lista detallada de clientes recurrentes, nuevos ingresos y usuarios inactivos.</p>
            </div>

            {/* Client Search bar */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={13} />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-divider/60 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
              />
            </div>
          </div>

          <div className="bg-white border border-divider/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-alt/50 border-b border-divider/60 text-[9.5px] text-ink-soft uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4.5">Cliente</th>
                    <th className="py-3.5 px-4.5">Contacto</th>
                    <th className="py-3.5 px-4.5">Viajes</th>
                    <th className="py-3.5 px-4.5">Total Invertido</th>
                    <th className="py-3.5 px-4.5">Último Uso</th>
                    <th className="py-3.5 px-4.5">Estatus</th>
                    <th className="py-3.5 px-4.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                  {currentData.clients
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((client) => (
                      <tr key={client.id} className="hover:bg-surface-alt/25 transition-colors">
                        <td className="py-3.5 px-4.5 flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-surface-alt border border-divider flex items-center justify-center text-base">
                            {client.avatar}
                          </span>
                          <div>
                            <span className="font-bold text-ink block leading-tight">{client.name}</span>
                            <span className="text-[9px] text-ink-faint font-mono">{client.id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4.5 text-ink-soft font-mono text-[11px]">
                          {client.phone}
                        </td>
                        <td className="py-3.5 px-4.5 font-bold text-ink">
                          {client.servicesCount} viajes
                        </td>
                        <td className="py-3.5 px-4.5 font-sora font-black text-[#0EA65C]">
                          {formatCOP(client.spent)}
                        </td>
                        <td className="py-3.5 px-4.5 text-ink-soft text-[10.5px]">
                          {client.lastService}
                        </td>
                        <td className="py-3.5 px-4.5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            client.status === 'frecuente' ? 'bg-[#E6F7EC] text-[#0EA65C]' :
                            client.status === 'nuevo' ? 'bg-blue-50 text-[#0066FF]' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4.5 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`Enviando cupón promocional incentivo a ${client.name} por SMS/WhatsApp...`)}
                            className="bg-primary hover:bg-primary-dark text-white text-[9.5px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Regalar Cupón 🎁
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#0d1a16] to-[#162f26] p-5 rounded-3xl text-white relative overflow-hidden">
              <span className="absolute -right-6 -bottom-6 text-6xl opacity-10">📣</span>
              <h5 className="font-sora font-extrabold text-xs">Campaña de Recuperación de Clientes Inactivos</h5>
              <p className="text-[10px] text-white/80 mt-1 leading-relaxed">
                El sistema de Movica identificó clientes inactivos en las últimas 2 semanas. Haz clic para enviar un código de descuento automatizado vía notificación PUSH y reactivar su interés.
              </p>
              <button
                type="button"
                onClick={() => alert("Notificación PUSH masiva enviada a clientes inactivos con cupón MOVICA15")}
                className="mt-3 bg-white text-primary text-[9px] font-black uppercase px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Enviar Cupón de Reactivación PUSH ⚡
              </button>
            </div>

            <div className="bg-white border border-divider/60 p-5 rounded-3xl flex flex-col justify-between space-y-2">
              <div>
                <h5 className="font-sora font-extrabold text-xs text-ink flex items-center gap-1">
                  <Award size={14} className="text-amber-500 fill-amber-500/10" /> Récord Mensual de Clientes
                </h5>
                <p className="text-[10px] text-ink-soft mt-0.5 leading-relaxed">
                  El cliente <strong>Alvaro Sonic Alvarez</strong> lidera el ranking mensual en Aguachica con un total de <strong>84 servicios completados exitosamente</strong>.
                </p>
              </div>
              <div className="text-[9.5px] font-bold text-ink-faint">
                Premio asignado: Movica VIP Club - Exención de tarifa de recargos nocturnos.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CONDUCTORES Y ALIADOS */}
      {activeSubTab === 'aliados' && (
        <div className="space-y-5 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div>
              <h4 className="font-sora font-extrabold text-xs text-ink">Rendimiento de Conductores y Aliados</h4>
              <p className="text-[10.5px] text-ink-soft">Estadísticas de ganancias, calificaciones de calidad, aceptación rápida y viajes realizados.</p>
            </div>

            {/* Partner search bar */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={13} />
              <input
                type="text"
                placeholder="Buscar aliado..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-divider/60 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
              />
            </div>
          </div>

          <div className="bg-white border border-divider/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-alt/50 border-b border-divider/60 text-[9.5px] text-ink-soft uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4.5">Conductor</th>
                    <th className="py-3.5 px-4.5">Vehículo</th>
                    <th className="py-3.5 px-4.5">Calificación</th>
                    <th className="py-3.5 px-4.5">Viajes</th>
                    <th className="py-3.5 px-4.5">Ganancias Aliado</th>
                    <th className="py-3.5 px-4.5">T. Aceptación</th>
                    <th className="py-3.5 px-4.5">Estado</th>
                    <th className="py-3.5 px-4.5 text-right">Auditoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider/30 text-xs font-semibold">
                  {currentData.partners
                    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((partner) => (
                      <tr key={partner.id} className="hover:bg-surface-alt/25 transition-colors">
                        <td className="py-3.5 px-4.5 flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-surface-alt border border-divider flex items-center justify-center text-lg">
                            {partner.avatar}
                          </span>
                          <div>
                            <span className="font-bold text-ink block leading-tight">{partner.name}</span>
                            <span className="text-[9px] text-ink-faint font-mono">{partner.id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4.5 text-ink-soft font-mono text-[11px]">
                          {partner.vehicle}
                        </td>
                        <td className="py-3.5 px-4.5">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-ink">{partner.rating}</span>
                            <Star size={11} className="text-amber-500 fill-amber-500" />
                          </div>
                        </td>
                        <td className="py-3.5 px-4.5 font-bold text-ink">
                          {partner.servicesCount} viajes
                        </td>
                        <td className="py-3.5 px-4.5 font-sora font-black text-primary">
                          {formatCOP(partner.earnings)}
                        </td>
                        <td className="py-3.5 px-4.5 text-ink-soft text-[10.5px]">
                          ⏱ {partner.acceptanceTime}
                        </td>
                        <td className="py-3.5 px-4.5">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            partner.status === 'online' ? 'bg-[#E6F7EC] text-[#0EA65C]' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {partner.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4.5 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`Abriendo expediente detallado de ${partner.name}...`)}
                            className="text-primary hover:underline text-[10px] font-black uppercase transition-all cursor-pointer"
                          >
                            Ver Hoja 📄
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-alt/40 border border-divider/60 p-4.5 rounded-2xl text-center space-y-1">
              <span className="text-[8.5px] text-ink-soft font-black uppercase tracking-wider block">Tiempo Promedio de Aceptación</span>
              <span className="font-sora font-black text-xl text-ink block">⏱ 24 Segundos</span>
              <span className="text-[8.5px] text-[#0EA65C] font-bold block">Excelente tiempo de respuesta</span>
            </div>
            <div className="bg-surface-alt/40 border border-divider/60 p-4.5 rounded-2xl text-center space-y-1">
              <span className="text-[8.5px] text-ink-soft font-black uppercase tracking-wider block">Calificación de Aliados</span>
              <span className="font-sora font-black text-xl text-ink block">⭐ 4.88 / 5.0</span>
              <span className="text-[8.5px] text-ink-faint block">Basado en opiniones locales</span>
            </div>
            <div className="bg-surface-alt/40 border border-divider/60 p-4.5 rounded-2xl text-center space-y-1">
              <span className="text-[8.5px] text-ink-soft font-black uppercase tracking-wider block">Aliado Estrella de Aguachica</span>
              <span className="font-sora font-black text-xs text-ink block">🏍️ Yeison Ramirez</span>
              <span className="text-[8.5px] text-primary font-bold block">4,620 viajes terminados</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: POR TIPO DE SERVICIO */}
      {activeSubTab === 'servicios' && (
        <div className="space-y-5 text-left">
          
          <div>
            <h4 className="font-sora font-extrabold text-xs text-ink">Desglose de Líneas de Negocio de Movica</h4>
            <p className="text-[10.5px] text-ink-soft">Estadísticas por cada tipo de servicio disponible en el menú de clientes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.serviceTypes.map((st) => (
              <div key={st.key} className="bg-white border border-divider/60 p-5 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                <span className="absolute -right-4 -bottom-4 text-6xl opacity-10">{st.icon}</span>

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-surface-alt rounded-2xl shrink-0">{st.icon}</span>
                    <div>
                      <h5 className="font-sora font-extrabold text-xs text-ink">{st.name}</h5>
                      <span className="text-[8.5px] text-ink-faint">Línea de servicio activa</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-ink">{st.count} pedidos</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-divider/40 py-3.5 text-xs">
                  <div>
                    <span className="text-[8.5px] text-ink-soft font-black uppercase tracking-wider block">Ingreso Estimado</span>
                    <span className="font-sora font-black text-ink mt-0.5 block">{formatCOP(st.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] text-ink-soft font-black uppercase tracking-wider block">Tasa de Éxito</span>
                    <span className="font-sora font-black text-[#0EA65C] mt-0.5 block">{st.completedRate}%</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-[8.5px] text-ink-soft font-black uppercase tracking-wider block">Tarifa Promedio cobrada</span>
                    <span className="font-sora font-black text-primary mt-0.5 block">{formatCOP(st.avgFare)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-ink-soft">
                  <span>Modo: Automático / Tarifa Fija</span>
                  <button
                    type="button"
                    onClick={() => alert(`Abriendo panel de configuración de tarifas para ${st.name}...`)}
                    className="text-primary hover:underline uppercase text-[9px] font-black"
                  >
                    Ajustar Tarifas ⚙️
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* EXPORTING STATUS MODAL */}
      <AnimatePresence>
        {exportModal.isOpen && (
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 border border-divider/80 shadow-2xl space-y-4"
            >
              {exportModal.status === 'processing' ? (
                <div className="text-center py-6 space-y-4">
                  <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-divider border-t-primary animate-spin" />
                    <BarChart2 className="text-primary" size={24} />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-sora font-black text-sm text-ink">Consolidando Reporte</h4>
                    <p className="text-[11px] text-ink-soft leading-relaxed">
                      Procesando millones de registros de Movica en la base de datos simulada de Aguachica...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0EA65C] border border-emerald-100 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-sora font-black text-sm text-ink">¡Exportación Exitosa!</h4>
                    <p className="text-[11px] text-ink-soft leading-relaxed">
                      Se ha generado tu reporte de <strong>{exportModal.type === 'pdf' ? 'PDF Consolidado' : exportModal.type === 'excel' ? 'Excel (XLS)' : 'Impresión Física'}</strong> correctamente.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={closeExportModal}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-sora font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Listo, Continuar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
