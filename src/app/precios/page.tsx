import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import type { Metadata } from 'next'
import CheckoutButton from './CheckoutButton'

export const metadata: Metadata = {
  title: 'Planes y precios — SoloOficios',
  description: 'Elegí el plan que mejor se adapta a tu negocio. Empezá gratis y crecé con nosotros.',
}

const PLANES = [
  {
    id: 'free',
    nombre: 'Gratis',
    precio: 0,
    desc: 'Para empezar a recibir clientes',
    color: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    features: [
      '5 solicitudes por mes',
      'Perfil básico visible',
      'Chat con clientes',
      'Reseñas de clientes',
      'Verificación de DNI',
    ],
    noFeatures: [
      'Badge "Pro" en búsquedas',
      'Aparecer primero en resultados',
      'Estadísticas avanzadas',
      'Soporte prioritario',
    ],
    cta: 'Empezar gratis',
    ctaLink: '/onboarding',
    mpPlanId: null,
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: 4999,
    desc: 'Para profesionales que quieren crecer',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#2563eb',
    badge: '⭐ Más popular',
    features: [
      'Solicitudes ilimitadas',
      'Badge "Pro" destacado',
      'Aparecer primero en búsquedas',
      'Estadísticas de visitas',
      'Chat con clientes',
      'Reseñas de clientes',
      'Verificación de DNI y matrícula',
      'Soporte por email',
    ],
    noFeatures: [
      'Soporte prioritario 24hs',
    ],
    cta: 'Suscribirme al plan Pro',
    ctaLink: null,
    mpPlanId: process.env.NEXT_PUBLIC_MP_PLAN_PRO_ID ?? 'plan_pro',
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: 9999,
    desc: 'Para profesionales consolidados',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#7c3aed',
    features: [
      'Todo lo del plan Pro',
      'Posición #1 garantizada',
      'Estadísticas avanzadas + exportar',
      'Soporte prioritario 24hs',
      'Perfil destacado en landing',
      'Publicidad en búsquedas',
    ],
    noFeatures: [],
    cta: 'Suscribirme al plan Premium',
    ctaLink: null,
    mpPlanId: process.env.NEXT_PUBLIC_MP_PLAN_PREMIUM_ID ?? 'plan_premium',
  },
]

const COMPARACION = [
  { feature: 'Solicitudes por mes', free: '5', pro: 'Ilimitadas', premium: 'Ilimitadas' },
  { feature: 'Badge en búsquedas', free: '—', pro: '⭐ Pro', premium: '💎 Premium' },
  { feature: 'Posición en resultados', free: 'Normal', pro: 'Arriba', premium: '#1 garantizado' },
  { feature: 'Estadísticas', free: 'Básicas', pro: 'Avanzadas', premium: 'Completas + export' },
  { feature: 'Soporte', free: 'Email', pro: 'Email prioritario', premium: '24hs prioritario' },
  { feature: 'Perfil en landing', free: '—', pro: '—', premium: '✓' },
]

export default function PreciosPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: 'clamp(60px,8vw,100px) 20px', background: '#f8fafc' }}>
        <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '6px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
          Sin costos ocultos
        </div>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(36px,6vw,56px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16, lineHeight: 1.1 }}>
          Planes para cada etapa<br />de tu negocio
        </h1>
        <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto 16px', lineHeight: 1.7 }}>
          Empezá gratis y escalá cuando estés listo. Sin contrato, cancelás cuando quieras.
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>Para clientes siempre es 100% gratis.</p>
      </section>

      {/* PLANES */}
      <section style={{ padding: '0 20px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          {PLANES.map(plan => (
            <div key={plan.id} style={{ background: plan.bg, border: `2px solid ${plan.border}`, borderRadius: 24, padding: 32, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', padding: '6px 20px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{plan.nombre}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
                  {plan.precio === 0 ? (
                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 48, fontWeight: 900, color: '#0f172a' }}>Gratis</span>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 48, fontWeight: 900, color: '#0f172a' }}>${plan.precio.toLocaleString('es-AR')}</span>
                      <span style={{ fontSize: 14, color: '#64748b', marginBottom: 10 }}>/mes</span>
                    </>
                  )}
                </div>
                <p style={{ fontSize: 14, color: '#64748b' }}>{plan.desc}</p>
              </div>

              <div style={{ flex: 1, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
                {plan.noFeatures.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, marginBottom: 10, alignItems: 'flex-start', opacity: 0.4 }}>
                    <span style={{ flexShrink: 0, marginTop: 1 }}>✕</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {plan.ctaLink ? (
                <Link href={plan.ctaLink} style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#f1f5f9', color: '#0f172a', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 15, border: '1px solid #e2e8f0' }}>
                  {plan.cta}
                </Link>
              ) : (
                <CheckoutButton planId={plan.mpPlanId!} planNombre={plan.nombre} precio={plan.precio} color={plan.color} cta={plan.cta} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TABLA COMPARACIÓN */}
      <section style={{ padding: '0 20px 80px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px' }}>
          Comparación detallada
        </h2>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Característica</div>
            {['Gratis', 'Pro', 'Premium'].map(p => (
              <div key={p} style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, textAlign: 'center', color: p === 'Pro' ? '#2563eb' : p === 'Premium' ? '#7c3aed' : '#0f172a' }}>{p}</div>
            ))}
          </div>
          {COMPARACION.map((row, i) => (
            <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < COMPARACION.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
              <div style={{ padding: '14px 20px', fontSize: 14, color: '#0f172a' }}>{row.feature}</div>
              <div style={{ padding: '14px 20px', fontSize: 13, textAlign: 'center', color: '#64748b' }}>{row.free}</div>
              <div style={{ padding: '14px 20px', fontSize: 13, textAlign: 'center', color: '#2563eb', fontWeight: 600 }}>{row.pro}</div>
              <div style={{ padding: '14px 20px', fontSize: 13, textAlign: 'center', color: '#7c3aed', fontWeight: 600 }}>{row.premium}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f8fafc', padding: 'clamp(60px,8vw,80px) 20px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, textAlign: 'center', marginBottom: 40 }}>Preguntas frecuentes</h2>
          {[
            { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, sin penalidades. La suscripción se cancela al finalizar el período ya abonado.' },
            { q: '¿Cómo se cobra?', a: 'Mediante MercadoPago con débito automático mensual. Aceptamos todas las tarjetas.' },
            { q: '¿Hay período de prueba?', a: 'El plan gratuito es permanente y sin límite de tiempo. Podés probar antes de suscribirte.' },
            { q: '¿Qué pasa si supero las 5 solicitudes del plan gratis?', a: 'Las solicitudes nuevas quedan en cola. Para recibirlas sin límite, suscribite al plan Pro.' },
          ].map(f => (
            <div key={f.q} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: 'clamp(32px,5vw,60px) 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>© 2025 SoloOficios. Hecho con ❤️ en Argentina.</p>
      </footer>
    </>
  )
}
