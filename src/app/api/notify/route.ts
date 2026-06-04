import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { professional_id, message, type } = await request.json()

  // Guardar notificación en DB
  await supabase.from('notifications').insert({
    user_id: professional_id,
    from_user_id: user.id,
    message,
    type: type ?? 'solicitud',
    read: false,
  })

  return NextResponse.json({ ok: true })
}
