import type { Professional } from '@/types'

export const PROFESSIONALS: Professional[] = [
  { id: 'pro1', name: 'Marcelo Rodríguez', trade: 'Electricista', category: 'Hogar', stars: 4.9, reviews: 87, price: 8000, verified: true, pro: true, isMatriculado: true, matriculaNum: 'MAT-ELE-2024-01', bio: 'Electricista matriculado con 12 años de experiencia. Garantía en todos mis trabajos. Instalaciones residenciales, tableros, trifásicas, domótica.', location: 'Catamarca Capital', distance: 0.8, stats: { response: '20 min', reliability: 98, experience: '12 años' } },
  { id: 'pro2', name: 'Ana Lucía Pereyra', trade: 'Plomero', category: 'Hogar', stars: 5.0, reviews: 23, price: 6500, verified: true, pro: false, isMatriculado: true, matriculaNum: 'MAT-PLO-9921', bio: 'Instalaciones de agua y gas. Especialista en termofusión. Reparación de cañerías y destapes.', location: 'Valle Viejo', distance: 1.4, stats: { response: '45 min', reliability: 95, experience: '5 años' } },
  { id: 'pro3', name: 'Roberto Salas', trade: 'Gasista', category: 'Hogar', stars: 4.7, reviews: 54, price: 9500, verified: true, pro: false, isMatriculado: true, matriculaNum: 'MAT-GAS-5582', bio: 'Plomería integral y gasista matriculado de 1ra categoría. Instalación y reparación de calefones, termotanques y redes de gas.', location: 'Catamarca Capital', distance: 3.6, stats: { response: '1 hr', reliability: 92, experience: '18 años' } },
  { id: 'pro4', name: 'Diego Fernández', trade: 'Albañil', category: 'Construccion', stars: 4.8, reviews: 112, price: 7000, verified: true, pro: true, isMatriculado: false, bio: 'Construcción, refacción y terminaciones. Especialista en cerámicos y revestimientos. Presupuesto sin cargo.', location: 'Catamarca Capital', distance: 2.1, stats: { response: '30 min', reliability: 96, experience: '20 años' } },
  { id: 'pro5', name: 'Laura Martínez', trade: 'Pintor', category: 'Hogar', stars: 4.6, reviews: 38, price: 5500, verified: true, pro: false, isMatriculado: false, bio: 'Pintura interior y exterior. Látex, esmaltes, estuco veneciano. Trabajo limpio y prolijo garantizado.', location: 'Fray M. Esquiú', distance: 4.2, stats: { response: '2 hrs', reliability: 90, experience: '8 años' } },
  { id: 'pro6', name: 'Carlos Medina', trade: 'Carpintero', category: 'Hogar', stars: 4.9, reviews: 61, price: 11000, verified: true, pro: true, isMatriculado: false, bio: 'Muebles a medida, restauración, deck y pérgolas. Madera maciza y melamina. Diseño personalizado.', location: 'Valle Viejo', distance: 2.8, stats: { response: '1 hr', reliability: 94, experience: '15 años' } },
  { id: 'pro7', name: 'Sofía Quiroga', trade: 'Electricista', category: 'Hogar', stars: 4.5, reviews: 19, price: 7500, verified: true, pro: false, isMatriculado: true, matriculaNum: 'MAT-ELE-2023-07', bio: 'Electricista matriculada. Instalaciones domiciliarias, detección de fallas, luces LED y automatización.', location: 'Catamarca Capital', distance: 1.2, stats: { response: '40 min', reliability: 91, experience: '4 años' } },
  { id: 'pro8', name: 'Hugo Villanueva', trade: 'Plomero', category: 'Hogar', stars: 4.3, reviews: 45, price: 6000, verified: false, pro: false, isMatriculado: false, bio: 'Plomería en general, destapes, soldadura de cañerías. Atención inmediata para urgencias.', location: 'San Fernando del Valle', distance: 5.1, stats: { response: '2 hrs', reliability: 85, experience: '10 años' } },
]

export const AVATAR_COLORS: Record<string, string> = {
  pro1: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
  pro2: 'linear-gradient(135deg,#3dd68c,#2e8b57)',
  pro3: 'linear-gradient(135deg,#f59e0b,#d97706)',
  pro4: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
  pro5: 'linear-gradient(135deg,#ec4899,#be185d)',
  pro6: 'linear-gradient(135deg,#0f172a,#334155)',
  pro7: 'linear-gradient(135deg,#0ea5e9,#2563eb)',
  pro8: 'linear-gradient(135deg,#10b981,#059669)',
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function tradeEmoji(trade: string) {
  const map: Record<string, string> = { Electricista: '⚡', Plomero: '🔧', Gasista: '🔥', Albañil: '🏗️', Pintor: '🎨', Carpintero: '🪵' }
  return map[trade] ?? '🛠️'
}
