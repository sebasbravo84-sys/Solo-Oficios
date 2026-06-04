export interface Professional {
  id: string
  name: string
  trade: string
  category: string
  stars: number
  reviews: number
  price: number
  verified: boolean
  pro: boolean
  isMatriculado: boolean
  matriculaNum?: string
  bio: string
  location: string
  distance: number
  avatarUrl?: string
  stats: {
    response: string
    reliability: number
    experience: string
  }
}

export interface Review {
  id: string
  professionalId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface Booking {
  id: string
  professionalId: string
  userId: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  date: string
  description: string
  price: number
  createdAt: string
}

export type TradeCategory = 'Hogar' | 'Construccion' | 'Tecnologia' | 'Salud' | 'Educacion'
