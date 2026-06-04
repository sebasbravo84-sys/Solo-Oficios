import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json({ error: 'MercadoPago no configurado' }, { status: 500 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Debés iniciar sesión para suscribirte' }, { status: 401 })
  }

  const { planNombre, precio } = await request.json()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solo-oficios.vercel.app'

  const client = new MercadoPagoConfig({ accessToken })
  const preference = new Preference(client)

  const { init_point } = await preference.create({
    body: {
      items: [
        {
          id: `plan_${planNombre.toLowerCase()}`,
          title: `SoloOficios — Plan ${planNombre}`,
          description: `Suscripción mensual al plan ${planNombre} de SoloOficios`,
          quantity: 1,
          unit_price: precio,
          currency_id: 'ARS',
        },
      ],
      payer: { email: user.email },
      back_urls: {
        success: `${baseUrl}/dashboard?pago=exitoso`,
        failure: `${baseUrl}/precios?pago=fallido`,
        pending: `${baseUrl}/dashboard?pago=pendiente`,
      },
      auto_return: 'approved',
      external_reference: `${user.id}|${planNombre.toLowerCase()}`,
      statement_descriptor: 'SOLOOFICIOS',
    },
  })

  return NextResponse.json({ init_point })
}
