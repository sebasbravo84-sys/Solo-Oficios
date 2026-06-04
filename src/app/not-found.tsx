import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🔧</div>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 12 }}>
          404
        </h1>
        <p style={{ fontSize: 20, fontFamily: 'var(--font-outfit)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
          Esta página no existe
        </p>
        <p style={{ fontSize: 15, color: '#64748b', maxWidth: 360, lineHeight: 1.7, marginBottom: 36 }}>
          Puede que el profesional ya no esté disponible o que la URL sea incorrecta.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/busqueda" style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
            Buscar profesionales
          </Link>
          <Link href="/" style={{ padding: '14px 28px', background: '#f1f5f9', color: '#0f172a', borderRadius: 12, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  )
}
