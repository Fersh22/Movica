import { Order, Favorite, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: "",
  email: "",
  phone: "",
  avatarLetter: "",
  addresses: []
};

export const INITIAL_FAVORITES: Favorite[] = [];

export const DEMO_DRIVERS: any[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const RESTAURANTS_MOCK = [
  {
    id: 'r1',
    name: 'Burgers & Co',
    cuisine: 'Hamburguesas & Papas',
    rating: 4.7,
    deliveryTime: '20-30 min',
    image: '🍔',
    menu: [
      { name: 'Hamburguesa Doble Especial', price: 16900, desc: 'Doble carne de res 120g, queso cheddar, tocineta, lechuga y salsa de la casa.' },
      { name: 'Hamburguesa Pollo Crispy', price: 14900, desc: 'Pechuga apanada súper crujiente, ensalada coleslaw, pepinillos y mayonesa spicy.' },
      { name: 'Papas Rústicas', price: 6000, desc: 'Papas cortadas a mano espolvoreadas con pimentón y sal marina.' },
      { name: 'Gaseosa 350ml', price: 3500, desc: 'Coca Cola, Sprite o Fanta helada.' }
    ]
  },
  {
    id: 'r2',
    name: 'La Pizzería Toscana',
    cuisine: 'Pizza artesanal en horno de leña',
    rating: 4.8,
    deliveryTime: '25-35 min',
    image: '🍕',
    menu: [
      { name: 'Pizza Jamón y Queso (Personal)', price: 12000, desc: 'Salsa pomodoro natural, mozzarella, jamón cocido y orégano.' },
      { name: 'Pizza Pepperoni Suprema (Personal)', price: 15500, desc: 'Doble pepperoni americano, mozzarella y toque de chile pepper.' },
      { name: 'Pizza Cuatro Quesos', price: 17000, desc: 'Mozzarella, parmesano, queso azul y provolone.' },
      { name: 'Te Hatsu Limón', price: 4800, desc: 'Té helado premium de infusión natural.' }
    ]
  },
  {
    id: 'r3',
    name: 'Súper Mercadito Familiar',
    cuisine: 'Víveres y Abarrotes',
    rating: 4.5,
    deliveryTime: '15-25 min',
    image: '🛒',
    menu: [
      { name: 'Paquete de Leche x6', price: 18000, desc: 'Leche entera pasteurizada 900ml cada una.' },
      { name: 'Aceite de Girasol 1L', price: 12500, desc: 'Ideal para todo tipo de cocciones.' },
      { name: 'Arroz Premium 1kg', price: 4200, desc: 'Grano entero seleccionado.' },
      { name: 'Huevos A x30', price: 16000, desc: 'Canasta de huevos frescos del campo.' }
    ]
  }
];

export const FAQS = [
  { q: '¿Cómo funciona el servicio de Mototaxi?', a: 'Ingresas tu origen y destino, calculamos el costo estimado de inmediato y te asignamos un conductor de confianza calificado en menos de 2 minutos.' },
  { q: '¿Qué puedo pedir en Enviar encomienda?', a: 'Puedes enviar documentos, cajas, llaves o cualquier producto que quepa de forma segura en la moto de nuestros afiliados, con peso menor a 12 kg.' },
  { q: '¿Cuáles son las tarifas bases de Movica?', a: 'Nuestra tarifa de mototaxi inicia en $2.500 COP, los domicilios en $3.500 COP y las encomiendas según la distancia recorrida.' },
  { q: '¿El pago es en efectivo o digital?', a: 'Por ahora puedes pagar en efectivo al recibir el servicio o vía transferencia bancaria directa (Nequi/Daviplata) acordando con el conductor.' }
];
