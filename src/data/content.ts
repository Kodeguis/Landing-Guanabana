import { OFFICIAL_PHONE } from './products';

export const SITE = {
  name: 'Guanábana Horneada',
  legalName: 'Guanábana Horneada S.A.C.',
  tagline: '100% Masa Madre · Trujillo',
  description:
    'Panadería, confitería y pastelería artesanal en Trujillo, Perú. Fermentación 100% masa madre con trigo integral andino.',
  address: 'Urb. Las Flores Mz. D Lote 3, Víctor Larco Herrera, Trujillo',
  shortAddress: 'Urb. Las Flores Mz. D Lote 3, Víctor Larco',
  city: 'Trujillo, La Libertad, Perú',
  coords: { lat: -8.1273804, lng: -79.04438 },
  mapsUrl: 'https://maps.app.goo.gl/khHUPd63Z1bsaZLRA',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=-8.1273804%2C-79.04438',
  placeEmbedUrl: 'https://www.google.com/maps?q=-8.1273804,-79.04438&z=17&hl=es&output=embed',
  cityEmbedUrl: 'https://www.google.com/maps?q=Trujillo,+Peru&z=12&hl=es&output=embed',
  cityMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Trujillo%2C%20Peru',
  instagram: 'https://www.instagram.com/guanabana.horneada',
  linktree: 'https://linktr.ee/Guanabana.horneada',
  whatsappPhone: OFFICIAL_PHONE,
};

export const HOURS = [
  { label: 'Mañana', time: '08:00 – 13:00' },
  { label: 'Tarde', time: '15:30 – 19:30' },
];

export const HOURS_NOTE = 'Lunes a sábado';

export const AGUA_AZUCAR = {
  name: 'Agua y Azúcar',
  tagline: 'Confitería artesanal',
  description: 'Confitería de frutas',
  instagram: 'https://www.instagram.com/aguayazucar.confiteria',
  logo: '/agua-azucar-logo.png',
};

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nuestra Carta', href: '#carta' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Aliados', href: '#aliados' },
  { label: 'Ubícanos', href: '#visitanos' },
];

export interface Ally {
  name: string;
  address: string;
  note?: string;
  mapsUrl: string;
  embedUrl: string;
}

const mapsEmbedCoords = (lat: number, lng: number, zoom = 17) =>
  `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=es&output=embed`;

/**
 * Puntos aliados con los enlaces oficiales de Google Maps compartidos por el negocio.
 * `embedUrl` usa las coordenadas exactas de cada enlace.
 */
export const ALLIES: Ally[] = [
  {
    name: 'Match Slowbar',
    address: 'Las Magnolias 383, Víctor Larco Herrera 13009',
    mapsUrl: 'https://maps.app.goo.gl/U8TxXpn3MtSgGa3D8',
    embedUrl: mapsEmbedCoords(-8.1310101, -79.0383956),
  },
  {
    name: 'Domina',
    address: 'Sta. Rosa Manzana L, Trujillo 13001',
    mapsUrl: 'https://maps.app.goo.gl/5CjCdgq8fY7QRoGGA',
    embedUrl: mapsEmbedCoords(-8.1274883, -79.036905),
  },
  {
    name: 'Tertulia',
    address: 'Jirón Sibelius 984, Trujillo 13001',
    mapsUrl: 'https://maps.app.goo.gl/BoWam5a2XRfCNWm37',
    embedUrl: mapsEmbedCoords(-8.0984078, -79.0349833),
  },
  {
    name: 'Jama-Upao',
    address: 'Gran Teatro UPAO, Trujillo 13008',
    note: 'En la azotea del teatro de UPAO',
    mapsUrl: 'https://maps.app.goo.gl/1MQASHWc75ZuCsde9',
    embedUrl: mapsEmbedCoords(-8.1275289, -79.0310881),
  },
  {
    name: 'Vasca',
    address: 'Av. Larco 427, Trujillo 13008',
    mapsUrl: 'https://maps.app.goo.gl/Z4cbkhUG8tfcCiJd7',
    embedUrl: mapsEmbedCoords(-8.1191511, -79.033947),
  },
  {
    name: 'Latiendo Café',
    address: 'Santo Toribio de Mogrovejo 357, Trujillo 13008',
    mapsUrl: 'https://maps.app.goo.gl/ezhndKfmcQBgDyux8',
    embedUrl: mapsEmbedCoords(-8.1175621, -79.034655),
  },
  {
    name: 'Espressa Coffee',
    address: 'San Martín de Porres 197, Trujillo 13008',
    mapsUrl: 'https://maps.app.goo.gl/d3ageQck4nBHmgPn6',
    embedUrl: mapsEmbedCoords(-8.1200798, -79.0369038),
  },
  {
    name: 'Jersey Coffee',
    address: 'Martínez de Compañón 724, Trujillo 13008',
    mapsUrl: 'https://maps.app.goo.gl/riamoVhETCakhi7h9',
    embedUrl: mapsEmbedCoords(-8.1209054, -79.0385661),
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  chips?: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: '01',
    question: '¿Qué insumos utilizan para elaborar sus productos?',
    answer:
      'Seleccionamos trigo integral andino, sal marina de las salineras milenarias de Maras y mantequilla cajamarquina natural. Nada más: insumos reales, de origen peruano y sin atajos.',
    chips: ['Trigo integral andino · 25%', 'Sal de Maras · 100% pura', 'Conservantes · 0% químicos'],
  },
  {
    id: '02',
    question: '¿Cuánto tiempo reposa la masa madre?',
    answer:
      'El tiempo no se apura. Guardamos la masa en frío entre 24 y 48 horas para potenciar aromas profundos, una miga ligera y una corteza dorada perfecta.',
    chips: ['Tiempo de reposo · 36 horas', 'Gluten pre-digerido', 'Aroma máximo'],
  },
  {
    id: '03',
    question: '¿Cómo logran un pan crocante, aireado y ligero?',
    answer:
      'Horneamos a alta temperatura con vapor y una fermentación lenta que desarrolla la alveolatura natural. El resultado es una corteza crujiente que se mantiene fresca por días.',
    chips: ['Horneado con vapor', 'Corteza caramelizada', 'Miga alveolada'],
  },
  {
    id: '04',
    question: '¿Por qué nuestro pan de masa madre no inflama el estómago?',
    answer:
      'El pan comercial se apura en pocas horas con levaduras industriales. Nuestra fermentación de 24 a 48 horas permite que las bacterias lácticas hagan una pre-digestión natural que neutraliza el ácido fítico y facilita una digestión liviana.',
    chips: ['Fermentación lenta', 'Fácil digestión', 'Cero levadura industrial'],
  },
];

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export const CONSULT_MESSAGE =
  '¡Hola Guanábana Horneada! 🐊🥖 Quisiera consultar por la disponibilidad de sus productos de hoy.';
