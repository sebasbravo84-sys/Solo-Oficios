'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Top bar — solo desktop */}
      <div className="hide-mobile" style={{ background: '#0f172a', color: '#f8fafc', padding: '10px 40px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📍 Argentina — <strong>Servicios verificados 24/7</strong></span>
        <span>¿Sos profesional? <Link href="/onboarding" style={{ color: '#38bdf8', fontWeight: 600 }}>Registrate gratis →</Link></span>
      </div>

      {/* Nav */}
      <nav style={{ height: 70, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 24, fontWeight: 800, color: '#2563eb', textDecoration: 'none', letterSpacing: '-1px' }}>
          Solo<span style={{ color: '#0f172a', fontWeight: 700 }}>Oficios</span>
        </Link>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/busqueda" style={{ color: '#64748b', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Buscar</Link>
          <Link href="/onboarding" style={{ color: '#64748b', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Publicar oficio</Link>
          <Link href="/auth/login" style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: 30, fontWeight: 600, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-outfit)' }}>
            👤 Ingresar
          </Link>
          <Link href="/busqueda?urgente=true" style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 20px', borderRadius: 30, fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            🚨 Urgente
          </Link>
        </div>

        {/* Mobile: urgente + hamburger */}
        <div className="show-mobile" style={{ alignItems: 'center', gap: 10 }}>
          <Link href="/busqueda?urgente=true" style={{ background: '#fee2e2', color: '#ef4444', padding: '8px 14px', borderRadius: 30, fontWeight: 800, textDecoration: 'none', fontSize: 13 }}>
            🚨 Urgente
          </Link>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: '#0f172a', padding: '4px 8px', lineHeight: 1 }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 70, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 99, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          {[
            { href: '/busqueda', label: '🔍 Buscar profesionales' },
            { href: '/onboarding', label: '🛠️ Publicar mi oficio' },
            { href: '/auth/login', label: '👤 Ingresar' },
            { href: '/auth/registro', label: '✨ Crear cuenta gratis' },
            { href: '/dashboard', label: '📊 Mi Dashboard' },
            { href: '/chat', label: '💬 Mensajes' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '16px 20px', borderRadius: 14, fontSize: 16, fontWeight: 600, color: '#0f172a', textDecoration: 'none', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
