'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PROFESSIONALS, AVATAR_COLORS, getInitials, tradeEmoji } from '@/lib/mock-data'
import { CIUDADES } from '@/lib/ciudades'

const CATEGORIES = [
  { label: '🏠 Hogar', value: 'Hogar' },
  { label: '🚚 Transporte', value: 'Transporte' },
  { label: '💻 Tecnología', value: 'Tecnologia' },
  { label: '🎓 Educación', value: 'Educacion' },
  { label: '🏗️ Construcción', value: 'Construccion' },
  { label: '🐕 Mascotas', value: 'Mascotas' },
  { label: '🎨 Arte', value: 'Arte' },
  { label: '🛠️ Oficios', value: 'Oficios' },
]

export default function BusquedaClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const catParam = searchParams.get('cat')
  const locParam = searchParams.get('loc')
  const urgenteParam = searchParams.get('urgente')

  const [query, setQuery] = useState(catParam ?? '')
  const [ciudad, setCiudad] = useState(locParam ?? 'Catamarca Capital')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [sort, setSort] = useState('relevante')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [maxPrice, setMaxPrice] = useState(30000)
  const [soloMatriculado, setSoloMatriculado] = useState(false)
  const [soloVerificado, setSoloVerificado] = useState(false)
  const [minStars, setMinStars] = useState(0)
  const [filtrosOpen, setFiltrosOpen] = useState(false)

  const showResults = !!(catParam || urgenteParam)

  const filtered = useMemo(() => {
    let list = [...PROFESSIONALS]
    if (catParam) list = list.filter(p => p.trade.toLowerCase().includes(catParam.toLowerCase()) || p.category.toLowerCase().includes(catParam.toLowerCase()))
    if (soloMatriculado) list = list.filter(p => p.isMatriculado)
    if (soloVerificado) list = list.filter(p => p.verified)
    if (minStars > 0) list = list.filter(p => p.stars >= minStars)
    list = list.filter(p => p.price <= maxPrice)
    if (sort === 'precio') list.sort((a, b) => a.price - b.price)
    else if (sort === 'calificacion') list.sort((a, b) => b.stars - a.stars)
    else if (sort === 'resenas') list.sort((a, b) => b.reviews - a.reviews)
    else if (sort === 'distancia') list.sort((a, b) => a.distance - b.distance)
    return list
  }, [catParam, soloMatriculado, soloVerificado, minStars, maxPrice, sort])

  function buscar() {
    const params = new URLSearchParams()
    if (query) params.set('cat', query)
    if (ciudad) params.set('loc', ciudad)
    router.push(`/busqueda?${params.toString()}`)
  }

  // ─── HERO SEARCH (sin parámetros) ───
  if (!showResults) {
    return (
      <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px)', backgroundSize: '52px 52px', opacity: .2, maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%,black,transparent)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%,black,transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 700, height: 700, background: 'radial-gradient(circle,rgba(37,99,235,.07) 0%,transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.2)', padding: '6px 16px', borderRadius: 100, fontSize: 12, color: '#2563eb', fontWeight: 600, marginBottom: 28 }}>
          🛡 Chat Protegido · Profesionales Verificados
        </div>

        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(44px,7vw,80px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-2px', maxWidth: 780, marginBottom: 20 }}>
          ¿Qué servicio<br />necesitás <em style={{ fontStyle: 'italic', color: '#2563eb' }}>hoy</em>?
        </h1>
        <p style={{ fontSize: 17, color: '#64748b', maxWidth: 480, lineHeight: 1.7, fontWeight: 300 }}>
          Encontrá al profesional ideal en tu zona. Verificado, con reseñas reales y precios claros.
        </p>

        {/* Search box */}
        <div style={{ marginTop: 40, width: '100%', maxWidth: 680 }}>
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 16, overflow: 'hidden' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="Ej: electricista, plomero, carpintero..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '18px 22px', fontSize: 16, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}
            />
            <div style={{ width: 1, background: '#cbd5e1', margin: '14px 0' }} />
            <select
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', padding: '0 18px', fontSize: 14, color: '#94a3b8', fontFamily: 'Inter, sans-serif', cursor: 'pointer', maxWidth: 200 }}
            >
              <option value="">Todo el país</option>
              {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={buscar} style={{ background: '#2563eb', border: 'none', padding: '0 28px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Buscar →
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 28 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setSelectedCat(cat.value); setQuery(cat.label.split(' ')[1]); router.push(`/busqueda?cat=${cat.value}`) }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: selectedCat === cat.value ? 'rgba(37,99,235,.1)' : '#f1f5f9', border: `1px solid ${selectedCat === cat.value ? 'rgba(37,99,235,.4)' : '#e2e8f0'}`, borderRadius: 100, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: selectedCat === cat.value ? '#2563eb' : '#94a3b8' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Trust row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Control de antecedentes penales', 'Identidad verificada con DNI', 'Reseñas de clientes reales', 'Gratis para clientes'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
              <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── RESULTS ───
  const filtrosContent = (
    <>
      <FilterTitle>Precio por hora</FilterTitle>
      <div style={{ padding: '4px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 8 }}>
          <span>$3.000</span><span>${maxPrice.toLocaleString('es-AR')}</span>
        </div>
        <input type="range" min={3000} max={30000} step={500} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
      </div>
      <FilterTitle>Verificación</FilterTitle>
      <CheckRow label="DNI verificado" count={91} checked={soloVerificado} onChange={() => setSoloVerificado(v => !v)} />
      <CheckRow label="Matrícula profesional" count={42} checked={soloMatriculado} onChange={() => setSoloMatriculado(v => !v)} />
      <FilterTitle>Calificación mínima</FilterTitle>
      <CheckRow label="⭐⭐⭐⭐⭐ Solo 5 estrellas" count={23} checked={minStars === 5} onChange={() => setMinStars(s => s === 5 ? 0 : 5)} />
      <CheckRow label="⭐⭐⭐⭐+ Más de 4" count={68} checked={minStars === 4} onChange={() => setMinStars(s => s === 4 ? 0 : 4)} />
      <CheckRow label="⭐⭐⭐+ Más de 3" count={87} checked={minStars === 3} onChange={() => setMinStars(s => s === 3 ? 0 : 3)} />
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
        <button onClick={() => { setSoloMatriculado(false); setSoloVerificado(false); setMinStars(0); setMaxPrice(30000); setFiltrosOpen(false) }} style={{ width: '100%', padding: 10, background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 12, color: '#64748b', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
          Limpiar filtros
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>

      {/* SIDEBAR desktop */}
      <div className="busqueda-sidebar" style={{ width: 260, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', padding: '24px 20px', position: 'sticky', top: 70, height: 'calc(100vh - 70px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {filtrosContent}
      </div>

      {/* DRAWER mobile */}
      {filtrosOpen && (
        <div className="busqueda-sidebar open" onClick={e => { if (e.target === e.currentTarget) setFiltrosOpen(false) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 800 }}>Filtros</span>
            <button onClick={() => setFiltrosOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b' }}>✕</button>
          </div>
          {filtrosContent}
          <button onClick={() => setFiltrosOpen(false)} style={{ width: '100%', marginTop: 16, padding: 14, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Ver {filtered.length} resultados
          </button>
        </div>
      )}

      {/* MAIN */}
      <div style={{ flex: 1, padding: '16px 16px', overflow: 'hidden' }}>
        {/* Sort bar */}
        <div className="sort-bar-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="busqueda-filtros-btn" onClick={() => setFiltrosOpen(true)} style={{ display: 'none', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#0f172a' }}>
              ⚙️ Filtros
            </button>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>
              <strong style={{ color: '#0f172a' }}>{filtered.length} profesionales</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Ordenar:</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#0f172a', fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer' }}>
              <option value="relevante">Más relevante</option>
              <option value="calificacion">Mejor calificado</option>
              <option value="precio">Menor precio</option>
              <option value="resenas">Más reseñas</option>
              <option value="distancia">Más cercano</option>
            </select>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ width: 32, height: 32, borderRadius: 8, background: view === v ? 'rgba(37,99,235,.12)' : '#f1f5f9', border: `1px solid ${view === v ? 'rgba(37,99,235,.3)' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', color: view === v ? '#2563eb' : '#64748b' }}>
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sin resultados</p>
            <p>Probá ajustando los filtros o buscando otra categoría.</p>
          </div>
        )}

        {/* GRID VIEW */}
        {view === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 18 }}>
            {filtered.map((pro, i) => (
              <Link key={pro.id} href={`/perfil/${pro.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', animationDelay: `${i * 0.06}s` }}>
                  <div style={{ height: 130, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative' }}>
                    {tradeEmoji(pro.trade)}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 5 }}>
                      {pro.verified && <Badge color="#10b981">✓ Verificado</Badge>}
                      {pro.pro && <Badge color="#2563eb">Pro</Badge>}
                      {pro.isMatriculado && <Badge color="#0ea5e9">Matriculado</Badge>}
                    </div>
                  </div>
                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0, background: AVATAR_COLORS[pro.id] ?? '#2563eb' }}>
                        {getInitials(pro.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{pro.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{pro.trade}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, marginBottom: 10 }}>
                      <span style={{ color: '#f59e0b' }}>★★★★★</span>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{pro.stars.toFixed(1)}</span>
                      <span style={{ color: '#94a3b8' }}>({pro.reviews} reseñas)</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>📍 {pro.location} · {pro.distance} km</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pro.bio}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 900 }}>${pro.price.toLocaleString('es-AR')}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}> / hora</span>
                      </div>
                      <span style={{ padding: '8px 16px', background: '#2563eb', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff' }}>Ver perfil</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((pro) => (
              <Link key={pro.id} href={`/perfil/${pro.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 22px', display: 'flex', gap: 18, alignItems: 'flex-start', cursor: 'pointer' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 26, fontWeight: 900, color: '#fff', flexShrink: 0, background: AVATAR_COLORS[pro.id] ?? '#2563eb' }}>
                    {getInitials(pro.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{pro.name}</div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{pro.trade}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, margin: '8px 0' }}>
                      {pro.verified && <Badge color="#10b981">✓ Verificado</Badge>}
                      {pro.isMatriculado && <Badge color="#0ea5e9">Matriculado</Badge>}
                      {pro.pro && <Badge color="#2563eb">Pro</Badge>}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 10 }}>{pro.bio}</div>
                    <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748b' }}>
                      <span>⭐ {pro.stars.toFixed(1)} ({pro.reviews})</span>
                      <span>📍 {pro.distance} km</span>
                      <span>⚡ Responde en {pro.stats.response}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900 }}>${pro.price.toLocaleString('es-AR')}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>por hora</div>
                    </div>
                    <span style={{ padding: '10px 20px', background: '#2563eb', borderRadius: 9, fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>Ver perfil</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#64748b', marginBottom: 14, marginTop: 20 }}>{children}</div>
}

function CheckRow({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', cursor: 'pointer', fontSize: 13, color: '#94a3b8' }}>
      <div style={{ width: 16, height: 16, border: `1.5px solid ${checked ? '#2563eb' : '#cbd5e1'}`, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checked ? '#2563eb' : 'transparent', transition: '.2s', fontSize: 10, color: '#fff', fontWeight: 900 }}>
        {checked ? '✓' : ''}
      </div>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{count}</span>
    </div>
  )
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const rgba = color === '#10b981' ? 'rgba(61,214,140,.15)' : color === '#2563eb' ? 'rgba(37,99,235,.15)' : 'rgba(110,231,255,.15)'
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: rgba, color, border: `1px solid ${color}40` }}>
      {children}
    </span>
  )
}
