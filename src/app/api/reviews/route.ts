import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { professional_id, rating, comment, booking_id } = await request.json()

  if (!professional_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const { data, error } = await supabase.from('reviews').insert({
    professional_id,
    client_id: user.id,
    booking_id: booking_id ?? null,
    rating,
    comment,
  }).select().single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ya dejaste una reseña para este trabajo' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, review: data })
}
