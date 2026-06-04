'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Tab = 'stats' | 'profesionales' | 'usuarios' | 'solicitudes' | 'resenas'

interface Props {
  stats: { pros: number; users: number; bookings: number; reviews: number }
  professionals: Record<string, unknown>[]
  profiles: Record<string, unknown>[]
  bookings: Record<string, unknown>[]
  reviews: Record<string, unknown>[]
}

export default function AdminClient({ stats, professionals, profiles, bookings, reviews }: Props) {
  const [tab, setTab] = useState<Tab>('stats')
  const [pros, setPros] = useState(professionals)
  const [revs, setRevs] = useState(reviews)
  const supabase = createClient()

  async function toggleProVerified(id: string, current: boolean) {
    await supabase.from('professionals').update({ verified: !current }).eq('id', id)
    setPros(prev => prev.map(p => p.id === id ? { ...p, verified: !current } : p))
  }

  async function deleteReview(id: string) {
    if (!confirm('¿Eliminar esta reseña?')) return
    await supabase.from('reviews').delete().eq('id', id)
    setRevs(prev => prev.filter(r => r.id !== id))
  }

  const NAV: { id: Tab; icon: string; label: string; count?: number }[] = [
    { id: 'stats', icon: '📊', label: 'Resumen' },
    { id: 'profesionales', icon: '🛠️', label: 'Profesionales', count: stats.pros },
    { id: 'usuarios', icon: '👥', label: 'Usuarios', count: stats.users },
    { id: 'solicitudes', icon: '📨', label: 'Solicitudes', count: stats.bookings },
    { id: 'resenas', icon: '⭐', label: 'Reseñas', count: stats.reviews },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>

      {/* SIDEBAR */}
      <div style={{ width: 240, flexShrink: 0, background: '#0f172a', color: '#f1f5f9', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>
            Solo<span style={{ color: '#f1f5f9' }}>Oficios</span>
          </Link>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Panel Admin</div>
        </div>

        <div style={{ padding: '16px 12px', flex: 1 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: tab === item.id ? '#fff' : '#94a3b8', background: tab === item.id ? 'rgba(37,99,235,.3)' : 'transparent', border: 'none', marginBottom: 4, textAlign: 'left', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count !== undefined && <span style={{ background: '#1e293b', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, color: '#64748b' }}>{item.count}</span>}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Volver al Dashboard</Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>

        {/* STATS */}
        {tab === 'stats' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Resumen general</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>Estado actual de la plataforma.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
              {[
                { icon: '🛠️', label: 'Profesionales', value: stats.pros, color: '#eff6ff', desc: 'registrados' },
                { icon: '👥', label: 'Usuarios', value: stats.users, color: '#f0fdf4', desc: 'en total' },
                { icon: '📨', label: 'Solicitudes', value: stats.bookings, color: '#fffbeb', desc: 'recibidas' },
                { icon: '⭐', label: 'Reseñas', value: stats.reviews, color: '#fdf4ff', desc: 'publicadas' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
                  <div style={{ width: 44, height: 44, background: s.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 36, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label} {s.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Accesos rápidos</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: '+ Agregar profesional', tab: 'profesionales' as Tab },
                  { label: '🔍 Ver solicitudes pendientes', tab: 'solicitudes' as Tab },
                  { label: '⚠️ Moderar reseñas', tab: 'resenas' as Tab },
                ].map(a => (
                  <button key={a.label} onClick={() => setTab(a.tab)} style={{ padding: '10px 18px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#0f172a' }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PROFESIONALES */}
        {tab === 'profesionales' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900 }}>Profesionales</h1>
              <span style={{ fontSize: 13, color: '#64748b' }}>{pros.length} registrados</span>
            </div>

            {pros.length === 0 ? (
              <EmptyState icon="🛠️" text="No hay profesionales registrados todavía." />
            ) : (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Nombre', 'Oficio', 'Ciudad', 'Estrellas', 'Verificado', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pros.map((pro) => {
                      const profile = pro.profiles as Record<string, unknown> | null
                      return (
                        <tr key={pro.id as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>{profile?.nombre as string ?? '—'}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{pro.trade as string}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{pro.location as string}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13 }}>★ {(pro.stars as number)?.toFixed(1) ?? '—'}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: pro.verified ? '#dcfce7' : '#fef2f2', color: pro.verified ? '#16a34a' : '#ef4444' }}>
                              {pro.verified ? '✓ Verificado' : '✕ Sin verificar'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => toggleProVerified(pro.id as string, pro.verified as boolean)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: pro.verified ? '#fef2f2' : '#dcfce7', color: pro.verified ? '#ef4444' : '#16a34a', border: 'none' }}>
                                {pro.verified ? 'Suspender' : 'Verificar'}
                              </button>
                              <Link href={`/perfil/${pro.id}`} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#2563eb', textDecoration: 'none' }}>
                                Ver perfil
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* USUARIOS */}
        {tab === 'usuarios' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Usuarios registrados</h1>
            {profiles.length === 0 ? (
              <EmptyState icon="👥" text="No hay usuarios registrados todavía." />
            ) : (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Nombre', 'Email', 'Rol', 'Registrado'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.id as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>{p.nombre as string ?? '—'}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{p.email as string}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: p.rol === 'profesional' ? '#eff6ff' : '#f0fdf4', color: p.rol === 'profesional' ? '#2563eb' : '#16a34a' }}>
                            {p.rol as string}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                          {new Date(p.created_at as string).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* SOLICITUDES */}
        {tab === 'solicitudes' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Solicitudes de servicio</h1>
            {bookings.length === 0 ? (
              <EmptyState icon="📨" text="No hay solicitudes todavía." />
            ) : (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Cliente', 'Descripción', 'Urgencia', 'Estado', 'Fecha'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => {
                      const client = b.profiles as Record<string, unknown> | null
                      const statusColor = { pending: '#fef3c7', confirmed: '#dcfce7', completed: '#e0f2fe', cancelled: '#fef2f2' }[b.status as string] ?? '#f1f5f9'
                      const statusText = { pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado' }[b.status as string] ?? b.status as string
                      return (
                        <tr key={b.id as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>{client?.nombre as string ?? '—'}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b', maxWidth: 240 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.description as string}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{b.urgency as string}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: statusColor }}>
                              {statusText}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                            {new Date(b.created_at as string).toLocaleDateString('es-AR')}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* RESEÑAS */}
        {tab === 'resenas' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Moderar reseñas</h1>
            {revs.length === 0 ? (
              <EmptyState icon="⭐" text="No hay reseñas todavía." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {revs.map((r) => {
                  const client = r.profiles as Record<string, unknown> | null
                  return (
                    <div key={r.id as string} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{client?.nombre as string ?? '—'}</span>
                          <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating as number)}{'☆'.repeat(5 - (r.rating as number))}</span>
                        </div>
                        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{r.comment as string ?? '(Sin comentario)'}</p>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                          {new Date(r.created_at as string).toLocaleDateString('es-AR')}
                        </div>
                      </div>
                      <button onClick={() => deleteReview(r.id as string)} style={{ padding: '8px 14px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                        🗑️ Eliminar
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontSize: 15 }}>{text}</p>
    </div>
  )
}
