'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#0f172a', color: '#f8fafc', padding: '10px 40px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📍 Catamarca, Argentina — <strong>Servicios verificados 24/7</strong></span>
        <span>¿Sos profesional? <Link href="/onboarding" style={{ color: '#38bdf8', fontWeight: 600 }}>Registrate gratis →</Link></span>
      </div>

      {/* Nav */}
      <nav style={{
        height: 80, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 800, color: '#2563eb', textDecoration: 'none', letterSpacing: '-1px' }}>
          Solo<span style={{ color: '#0f172a', fontWeight: 700 }}>Oficios</span>
        </Link>

        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          <Link href="/busqueda" style={{ color: '#64748b', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Buscar</Link>
          <Link href="/onboarding" style={{ color: '#64748b', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Publicar oficio</Link>
          <Link href="/auth/login" style={{
            background: '#f1f5f9', padding: '10px 20px', borderRadius: 30,
            fontWeight: 600, color: '#2563eb', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-outfit)'
          }}>
            👤 Ingresar
          </Link>
          <Link href="/busqueda?urgente=true" style={{
            background: '#fee2e2', color: '#ef4444', padding: '10px 20px',
            borderRadius: 30, fontWeight: 800, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            🚨 Urgente
          </Link>
        </div>
      </nav>
    </>
  )
}
