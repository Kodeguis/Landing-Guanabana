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
  mapsUrl: 'https://maps.app.goo.gl/khHUPd63Z1bsaZLRA',
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

export const ALLIES = [
  'Match Slowbar',
  'Domina',
  'Tertulia',
  'Jama-Upao',
  'Vasca',
  'Latiendo Café',
  'Expressa Coffee',
  'Jersey Coffee',
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
