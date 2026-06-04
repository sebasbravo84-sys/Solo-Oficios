'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { PROFESSIONALS, AVATAR_COLORS, getInitials } from '@/lib/mock-data'
import type { Professional } from '@/types'

const MapaProfesionales = dynamic(() => import('@/components/MapaProfesionales'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Cargando mapa...</div>,
})

const TRADES = ['Todos', 'Electricista', 'Plomero', 'Gasista', 'Albañil', 'Pintor', 'Carpintero']

export default function MapaClient() {
  const [selectedTrade, setSelectedTrade] = useState('Todos')
  const [selected, setSelected] = useState<Professional | null>(null)

  const filtered = useMemo(() =>
    selectedTrade === 'Todos' ? PROFESSIONALS : PROFESSIONALS.filter(p => p.trade === selectedTrade),
    [selectedTrade]
  )

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', fontFamily: 'Inter, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{ width: 320, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
            {filtered.length} profesionales
          </h2>
          {/* Filtro por oficio */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TRADES.map(t => (
              <button key={t} onClick={() => setSelectedTrade(t)} style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: selectedTrade === t ? '#2563eb' : '#f1f5f9', color: selectedTrade === t ? '#fff' : '#64748b', border: `1px solid ${selectedTrade === t ? '#2563eb' : '#e2e8f0'}` }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de profesionales */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filtered.map(pro => (
            <div key={pro.id} onClick={() => setSelected(pro)} style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: selected?.id === pro.id ? '#eff6ff' : '#fff', borderLeft: selected?.id === pro.id ? '3px solid #2563eb' : '3px solid transparent', transition: '.15s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: AVATAR_COLORS[pro.id] ?? '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 16, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                  {getInitials(pro.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{pro.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{pro.trade} · {pro.location}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: '#f59e0b' }}>★ {pro.stars}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>${pro.price.toLocaleString('es-AR')}/hr</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAPA */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapaProfesionales professionals={filtered} />

        {/* Panel del profesional seleccionado */}
        {selected && (
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', gap: 16, alignItems: 'center', zIndex: 1000, minWidth: 320, maxWidth: '90vw', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: AVATAR_COLORS[selected.id] ?? '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
              {getInitials(selected.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{selected.trade} · ★ {selected.stars} ({selected.reviews})</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#2563eb', marginTop: 2 }}>${selected.price.toLocaleString('es-AR')}/hr</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href={`/perfil/${selected.id}`} style={{ padding: '10px 18px', background: '#2563eb', color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap' }}>
                Ver perfil
              </Link>
              <button onClick={() => setSelected(null)} style={{ padding: '8px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 10, color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
