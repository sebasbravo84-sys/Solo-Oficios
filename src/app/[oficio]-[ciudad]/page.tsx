import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PROFESSIONALS } from '@/lib/mock-data'
import { AVATAR_COLORS, getInitials } from '@/lib/mock-data'

const OFICIOS_VALIDOS = ['electricistas', 'plomeros', 'gasistas', 'albaniles', 'pintores', 'carpinteros']
const CIUDADES_VALIDAS = ['catamarca', 'cordoba', 'buenos-aires', 'rosario', 'mendoza', 'tucuman', 'salta', 'neuquen', 'bariloche']

const OFICIO_MAP: Record<string, string> = {
  electricistas: 'Electricista',
  plomeros: 'Plomero',
  gasistas: 'Gasista',
  albaniles: 'Albañil',
  pintores: 'Pintor',
  carpinteros: 'Carpintero',
}

const CIUDAD_MAP: Record<string, string> = {
  catamarca: 'Catamarca',
  cordoba: 'Córdoba',
  'buenos-aires': 'Buenos Aires',
  rosario: 'Rosario',
  mendoza: 'Mendoza',
  tucuman: 'Tucumán',
  salta: 'Salta',
  neuquen: 'Neuquén',
  bariloche: 'Bariloche',
}

type Params = Promise<{ 'oficio-ciudad': string }>

function parseSlug(slug: string) {
  for (const oficio of OFICIOS_VALIDOS) {
    for (const ciudad of CIUDADES_VALIDAS) {
      if (slug === `${oficio}-${ciudad}`) return { oficio, ciudad }
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { 'oficio-ciudad': slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) return {}
  const oficio = OFICIO_MAP[parsed.oficio]
  const ciudad = CIUDAD_MAP[parsed.ciudad]
  return {
    title: `${oficio}s en ${ciudad} — Verificados | SoloOficios`,
    description: `Encontrá los mejores ${oficio.toLowerCase()}s en ${ciudad}. Profesionales verificados, con reseñas reales y precios claros. Gratis para clientes.`,
  }
}

export async function generateStaticParams() {
  const params = []
  for (const oficio of OFICIOS_VALIDOS) {
    for (const ciudad of CIUDADES_VALIDAS) {
      params.push({ 'oficio-ciudad': `${oficio}-${ciudad}` })
    }
  }
  return params
}

export default async function OficioCiudadPage({ params }: { params: Params }) {
  const { 'oficio-ciudad': slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) notFound()

  const oficioLabel = OFICIO_MAP[parsed.oficio]
  const ciudadLabel = CIUDAD_MAP[parsed.ciudad]

  const pros = PROFESSIONALS.filter(p => p.trade === oficioLabel)

  return (
    <>
      <Navbar />

      {/* HERO SEO */}
      <section style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: 'clamp(48px,6vw,80px) 20px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(37,99,235,.3)', border: '1px solid rgba(37,99,235,.5)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, color: '#93c5fd', marginBottom: 20 }}>
            {pros.length} profesionales verificados
          </div>
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(32px,6vw,56px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16, lineHeight: 1.1 }}>
            {oficioLabel}s en {ciudadLabel}
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
            Profesionales verificados con DNI y matrícula habilitante. Reseñas reales de clientes. Gratis para contratar.
          </p>
          <Link href={`/busqueda?cat=${oficioLabel}`} style={{ padding: '14px 32px', background: '#2563eb', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
            Ver todos los {oficioLabel.toLowerCase()}s →
          </Link>
        </div>
      </section>

      {/* PROFESIONALES */}
      <section style={{ padding: 'clamp(40px,6vw,60px) 20px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 900, marginBottom: 24 }}>
          {oficioLabel}s disponibles en {ciudadLabel}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {(pros.length > 0 ? pros : PROFESSIONALS.slice(0, 3)).map(pro => (
            <Link key={pro.id} href={`/perfil/${pro.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: AVATAR_COLORS[pro.id] ?? '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 900, color: '#fff' }}>
                    {getInitials(pro.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{pro.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{pro.trade} · {pro.location}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>★ {pro.stars} ({pro.reviews})</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>${pro.price.toLocaleString('es-AR')}/hr</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TEXTO SEO */}
      <section style={{ padding: '0 20px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: '#f8fafc', borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
            ¿Cómo contratar un {oficioLabel.toLowerCase()} en {ciudadLabel}?
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 16 }}>
            En SoloOficios podés encontrar {oficioLabel.toLowerCase()}s en {ciudadLabel} de forma rápida y segura. Todos los profesionales pasan por un proceso de verificación de identidad y habilitación profesional antes de aparecer en la plataforma.
          </p>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 24 }}>
            Para contratar un {oficioLabel.toLowerCase()} en {ciudadLabel}: describí el trabajo, recibí presupuestos en minutos y coordiná directamente por el Chat Seguro. Sin comisiones para el cliente.
          </p>
          <Link href="/como-funciona" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
            Ver cómo funciona SoloOficios →
          </Link>
        </div>
      </section>

      <footer style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>© 2025 SoloOficios. Hecho con ❤️ en Argentina.</p>
      </footer>
    </>
  )
}
