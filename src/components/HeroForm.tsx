'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 16px', border: '1.5px solid #cbd5e1',
  borderRadius: 10, fontSize: 15, outline: 'none', background: '#fff',
  color: '#0f172a', fontFamily: 'Inter, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#475569',
  textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px',
}

export default function HeroForm() {
  const router = useRouter()
  const [form, setForm] = useState({ cat: '', subcat: '', asunto: '', detalle: '', direccion: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (form.cat) params.set('cat', form.cat)
    if (form.direccion) params.set('loc', form.direccion)
    router.push(`/busqueda?${params.toString()}`)
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: 40, width: '100%', maxWidth: 520, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.4)' }}>
      <div style={{ background: '#0ea5e9', color: 'white', padding: '6px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-outfit)', display: 'inline-block', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Soluciones rápidas
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#0f172a', fontFamily: 'var(--font-outfit)', display: 'flex', alignItems: 'center', gap: 10 }}>
        🔍 Encontrá tu especialista
      </h2>
      <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
        Describí lo que necesitás y recibí presupuestos en minutos.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Rubro</label>
            <select style={inputStyle} value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
              <option value="">Seleccionar...</option>
              <option value="Electricista">Electricidad</option>
              <option value="Plomero">Plomería</option>
              <option value="Albañil">Albañilería</option>
              <option value="Gasista">Gas</option>
              <option value="Pintor">Pintura</option>
              <option value="Carpintero">Carpintería</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Especialidad</label>
            <select style={inputStyle} value={form.subcat} onChange={e => setForm(f => ({ ...f, subcat: e.target.value }))}>
              <option value="">Opcional</option>
              <option value="Instalacion">Instalación</option>
              <option value="Reparacion">Reparación</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Asunto breve</label>
          <input type="text" style={inputStyle} placeholder="Ej. Cambio de toma corriente" value={form.asunto} onChange={e => setForm(f => ({ ...f, asunto: e.target.value }))} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Detalle del trabajo</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} placeholder="Ej. Necesito revisar un cortocircuito en el patio trasero..." value={form.detalle} onChange={e => setForm(f => ({ ...f, detalle: e.target.value }))} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Tu dirección</label>
          <input type="text" style={inputStyle} list="ciudades-ar" placeholder="Ingresá calle, ciudad o provincia" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />
          <datalist id="ciudades-ar">
            <option value="Catamarca Capital, Catamarca" />
            <option value="Valle Viejo, Catamarca" />
            <option value="San Fernando del Valle, Catamarca" />
            <option value="San Miguel de Tucumán, Tucumán" />
            <option value="Córdoba Capital, Córdoba" />
            <option value="Buenos Aires, CABA" />
            <option value="Rosario, Santa Fe" />
            <option value="Mendoza Capital, Mendoza" />
          </datalist>
        </div>

        <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '18px 24px', borderRadius: 10, fontWeight: 600, fontFamily: 'var(--font-outfit)', fontSize: 17, width: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          Solicitar Presupuestos
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </div>
  )
}
