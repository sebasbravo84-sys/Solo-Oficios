import { createClient } from './supabase/server'
import { PROFESSIONALS } from './mock-data'
import type { Professional } from '@/types'

// Mapea una fila de Supabase al tipo Professional
function rowToProfessional(row: Record<string, unknown>): Professional {
  return {
    id: row.id as string,
    name: (row.nombre as string) ?? '',
    trade: (row.trade as string) ?? '',
    category: (row.category as string) ?? 'Hogar',
    stars: Number(row.stars ?? 0),
    reviews: Number(row.reviews_count ?? 0),
    price: Number(row.price ?? 0),
    verified: Boolean(row.verified),
    pro: Boolean(row.is_pro),
    isMatriculado: Boolean(row.is_matriculado),
    matriculaNum: (row.matricula_num as string | undefined),
    bio: (row.bio as string) ?? '',
    location: (row.location as string) ?? '',
    distance: 0,
    avatarUrl: (row.avatar_url as string | undefined),
    stats: {
      response: (row.response_time as string) ?? '1 hr',
      reliability: Number(row.reliability ?? 90),
      experience: (row.experience as string) ?? '',
    },
  }
}

// Busca profesionales con filtros opcionales
export async function getProfessionals(opts?: {
  trade?: string
  maxPrice?: number
  onlyVerified?: boolean
  onlyMatriculado?: boolean
  minStars?: number
}): Promise<Professional[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
    // Dev: retorna mock data
    return filterMock(opts)
  }

  try {
    const supabase = await createClient()
    let query = supabase
      .from('professionals')
      .select('*, profiles(nombre, avatar_url)')

    if (opts?.trade) {
      query = query.ilike('trade', `%${opts.trade}%`)
    }
    if (opts?.maxPrice) {
      query = query.lte('price', opts.maxPrice)
    }
    if (opts?.onlyVerified) {
      query = query.eq('verified', true)
    }
    if (opts?.onlyMatriculado) {
      query = query.eq('is_matriculado', true)
    }
    if (opts?.minStars) {
      query = query.gte('stars', opts.minStars)
    }

    const { data, error } = await query.order('stars', { ascending: false })
    if (error || !data) return filterMock(opts)

    return data.map((row) => ({
      ...rowToProfessional(row),
      name: (row.profiles as Record<string, unknown>)?.nombre as string ?? '',
      avatarUrl: (row.profiles as Record<string, unknown>)?.avatar_url as string | undefined,
    }))
  } catch {
    return filterMock(opts)
  }
}

// Obtiene un profesional por ID
export async function getProfessionalById(id: string): Promise<Professional | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
    return PROFESSIONALS.find(p => p.id === id) ?? null
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('professionals')
      .select('*, profiles(nombre, avatar_url)')
      .eq('id', id)
      .single()

    if (error || !data) return PROFESSIONALS.find(p => p.id === id) ?? null

    return {
      ...rowToProfessional(data),
      name: (data.profiles as Record<string, unknown>)?.nombre as string ?? '',
      avatarUrl: (data.profiles as Record<string, unknown>)?.avatar_url as string | undefined,
    }
  } catch {
    return PROFESSIONALS.find(p => p.id === id) ?? null
  }
}

// Fallback: filtra mock data con los mismos criterios
function filterMock(opts?: Parameters<typeof getProfessionals>[0]): Professional[] {
  let list = [...PROFESSIONALS]
  if (opts?.trade) list = list.filter(p => p.trade.toLowerCase().includes(opts.trade!.toLowerCase()))
  if (opts?.maxPrice) list = list.filter(p => p.price <= opts.maxPrice!)
  if (opts?.onlyVerified) list = list.filter(p => p.verified)
  if (opts?.onlyMatriculado) list = list.filter(p => p.isMatriculado)
  if (opts?.minStars) list = list.filter(p => p.stars >= opts.minStars!)
  return list
}
