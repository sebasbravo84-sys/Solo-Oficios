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

const OFICIOS = ['Electricista', 'Plomero', 'Gasista', 'Albañil', 'Pintor', 'Carpintero', 'Cerrajero', 'Climatización', 'Jardinero', 'Limpieza', 'Técnico PC/TV']

const emptyPro = { nombre: '', email: '', trade: 'Electricista', location: 'Catamarca Capital', price: 5000, bio: '', whatsapp: '', matricula_num: '', experience: '1 año', response_time: '1 hr' }

export default function AdminClient({ stats, professionals, profiles, bookings, reviews }: Props) {
  const [tab, setTab] = useState<Tab>('stats')
  const [pros, setPros] = useState(professionals)
  const [users, setUsers] = useState(profiles)
  const [revs, setRevs] = useState(reviews)
  const [books, setBooks] = useState(bookings)

  // Modal estado
  const [modal, setModal] = useState<'add_pro' | 'edit_pro' | 'edit_user' | null>(null)
  const [editingPro, setEditingPro] = useState<Record<string, unknown> | null>(null)
  const [editingUser, setEditingUser] = useState<Record<string, unknown> | null>(null)
  const [proForm, setProForm] = useState(emptyPro)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const supabase = createClient()

  function showMsg(text: string) { setMsg(text); setTimeout(() => setMsg(''), 3000) }

  // ─── PROFESIONALES ───
  async function savePro() {
    setSaving(true)
    if (modal === 'add_pro') {
      const newId = crypto.randomUUID()

      // 1. Primero crear el perfil (professionals.id → profiles.id FK)
      const { error: profileErr } = await supabase.from('profiles').insert({
        id: newId,
        nombre: proForm.nombre,
        email: proForm.email,
        rol: 'profesional',
        whatsapp: proForm.whatsapp || null,
      })
      if (profileErr) { showMsg('Error al crear perfil: ' + profileErr.message); setSaving(false); return }

      // 2. Crear el profesional con el mismo ID
      const { error } = await supabase.from('professionals').insert({
        id: newId,
        trade: proForm.trade,
        location: proForm.location,
        price: proForm.price,
        bio: proForm.bio,
        matricula_num: proForm.matricula_num || null,
        experience: proForm.experience,
        response_time: proForm.response_time,
        verified: false,
        is_pro: false,
        is_matriculado: !!proForm.matricula_num,
      })
      if (error) {
        // Revertir el perfil si falla el profesional
        await supabase.from('profiles').delete().eq('id', newId)
        showMsg('Error: ' + error.message); setSaving(false); return
      }
      setPros(prev => [{ id: newId, trade: proForm.trade, location: proForm.location, price: proForm.price, bio: proForm.bio, verified: false, stars: 0, reviews_count: 0, profiles: { nombre: proForm.nombre, email: proForm.email } }, ...prev])
      showMsg('✓ Profesional agregado correctamente.')
    } else if (modal === 'edit_pro' && editingPro) {
      const { error } = await supabase.from('professionals').update({
        trade: proForm.trade,
        location: proForm.location,
        price: proForm.price,
        bio: proForm.bio,
        matricula_num: proForm.matricula_num || null,
        is_matriculado: !!proForm.matricula_num,
        experience: proForm.experience,
        response_time: proForm.response_time,
      }).eq('id', editingPro.id as string)
      if (error) { showMsg('Error: ' + error.message); setSaving(false); return }
      setPros(prev => prev.map(p => p.id === editingPro.id ? { ...p, ...proForm } : p))
      showMsg('Profesional actualizado.')
    }
    setSaving(false)
    setModal(null)
  }

  async function toggleVerified(id: string, current: boolean) {
    await supabase.from('professionals').update({ verified: !current }).eq('id', id)
    setPros(prev => prev.map(p => p.id === id ? { ...p, verified: !current } : p))
    showMsg(current ? 'Profesional suspendido.' : 'Profesional verificado.')
  }

  async function deletePro(id: string) {
    if (!confirm('¿Eliminar este profesional? Esta acción no se puede deshacer.')) return
    await supabase.from('professionals').delete().eq('id', id)
    setPros(prev => prev.filter(p => p.id !== id))
    showMsg('Profesional eliminado.')
  }

  function openEditPro(pro: Record<string, unknown>) {
    const profile = pro.profiles as Record<string, unknown> | null
    setEditingPro(pro)
    setProForm({
      nombre: profile?.nombre as string ?? '',
      email: profile?.email as string ?? '',
      trade: pro.trade as string ?? 'Electricista',
      location: pro.location as string ?? '',
      price: pro.price as number ?? 5000,
      bio: pro.bio as string ?? '',
      whatsapp: '',
      matricula_num: pro.matricula_num as string ?? '',
      experience: pro.experience as string ?? '',
      response_time: pro.response_time as string ?? '',
    })
    setModal('edit_pro')
  }

  // ─── USUARIOS ───
  async function toggleBlock(id: string, isBlocked: boolean) {
    await supabase.from('profiles').update({ blocked: !isBlocked }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: !isBlocked } : u))
    showMsg(isBlocked ? 'Usuario desbloqueado.' : 'Usuario bloqueado.')
  }

  async function deleteUser(id: string) {
    if (!confirm('¿Eliminar este usuario? Se eliminarán todos sus datos.')) return
    await supabase.from('profiles').delete().eq('id', id)
    setUsers(prev => prev.filter(u => u.id !== id))
    showMsg('Usuario eliminado.')
  }

  // ─── RESEÑAS ───
  async function deleteReview(id: string) {
    if (!confirm('¿Eliminar esta reseña?')) return
    await supabase.from('reviews').delete().eq('id', id)
    setRevs(prev => prev.filter(r => r.id !== id))
    showMsg('Reseña eliminada.')
  }

  // ─── SOLICITUDES ───
  async function updateBookingStatus(id: string, status: string) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    showMsg('Solicitud actualizada.')
  }

  async function deleteBooking(id: string) {
    if (!confirm('¿Eliminar esta solicitud?')) return
    await supabase.from('bookings').delete().eq('id', id)
    setBooks(prev => prev.filter(b => b.id !== id))
    showMsg('Solicitud eliminada.')
  }

  const NAV: { id: Tab; icon: string; label: string; count: number }[] = [
    { id: 'stats', icon: '📊', label: 'Resumen', count: 0 },
    { id: 'profesionales', icon: '🛠️', label: 'Profesionales', count: pros.length },
    { id: 'usuarios', icon: '👥', label: 'Usuarios', count: users.length },
    { id: 'solicitudes', icon: '📨', label: 'Solicitudes', count: books.length },
    { id: 'resenas', icon: '⭐', label: 'Reseñas', count: revs.length },
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
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: tab === item.id ? '#fff' : '#94a3b8', background: tab === item.id ? 'rgba(37,99,235,.3)' : 'transparent', border: 'none', marginBottom: 4, textAlign: 'left', fontFamily: 'inherit', transition: '.15s' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count > 0 && <span style={{ background: '#1e293b', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, color: '#64748b' }}>{item.count}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b' }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Dashboard</Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 32, overflow: 'auto', maxWidth: 'calc(100vw - 240px)' }}>

        {/* Toast */}
        {msg && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            ✓ {msg}
          </div>
        )}

        {/* RESUMEN */}
        {tab === 'stats' && (
          <>
            <PageHeader title="Resumen general" sub="Estado actual de la plataforma SoloOficios." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
              {[
                { icon: '🛠️', label: 'Profesionales', value: stats.pros, color: '#eff6ff' },
                { icon: '👥', label: 'Usuarios', value: stats.users, color: '#f0fdf4' },
                { icon: '📨', label: 'Solicitudes', value: stats.bookings, color: '#fffbeb' },
                { icon: '⭐', label: 'Reseñas', value: stats.reviews, color: '#fdf4ff' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
                  <div style={{ width: 44, height: 44, background: s.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 36, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Accesos rápidos</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Btn onClick={() => { setModal('add_pro'); setProForm(emptyPro) }} label="+ Agregar profesional" color="#2563eb" />
                <Btn onClick={() => setTab('solicitudes')} label="📨 Ver solicitudes" color="#64748b" />
                <Btn onClick={() => setTab('resenas')} label="⭐ Moderar reseñas" color="#64748b" />
                <Btn onClick={() => setTab('usuarios')} label="👥 Ver usuarios" color="#64748b" />
              </div>
            </div>
          </>
        )}

        {/* PROFESIONALES */}
        {tab === 'profesionales' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <PageHeader title="Profesionales" sub={`${pros.length} registrados en la plataforma.`} />
              <Btn onClick={() => { setModal('add_pro'); setProForm(emptyPro) }} label="+ Agregar profesional" color="#2563eb" />
            </div>

            {pros.length === 0 ? <EmptyState icon="🛠️" text="No hay profesionales todavía." /> : (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <Thead cols={['Nombre', 'Oficio', 'Ciudad', 'Precio/hr', 'Estado', 'Acciones']} />
                  </thead>
                  <tbody>
                    {pros.map(pro => {
                      const profile = pro.profiles as Record<string, unknown> | null
                      return (
                        <tr key={pro.id as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Td bold>{profile?.nombre as string ?? '—'}</Td>
                          <Td muted>{pro.trade as string}</Td>
                          <Td muted>{pro.location as string}</Td>
                          <Td>${(pro.price as number)?.toLocaleString('es-AR')}</Td>
                          <td style={{ padding: '14px 16px' }}>
                            <StatusBadge ok={pro.verified as boolean} okLabel="Verificado" noLabel="Sin verificar" />
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <ActionBar>
                              <ActionBtn onClick={() => openEditPro(pro)} color="#eff6ff" text="#2563eb" label="✏️ Editar" />
                              <ActionBtn onClick={() => toggleVerified(pro.id as string, pro.verified as boolean)} color={pro.verified ? '#fef2f2' : '#dcfce7'} text={pro.verified ? '#ef4444' : '#16a34a'} label={pro.verified ? '🚫 Suspender' : '✓ Verificar'} />
                              <Link href={`/perfil/${pro.id}`} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#f8fafc', color: '#64748b', textDecoration: 'none', border: '1px solid #e2e8f0' }}>👁 Ver</Link>
                              <ActionBtn onClick={() => deletePro(pro.id as string)} color="#fef2f2" text="#ef4444" label="🗑️ Eliminar" />
                            </ActionBar>
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
            <PageHeader title="Usuarios registrados" sub={`${users.length} usuarios en la plataforma.`} />
            {users.length === 0 ? <EmptyState icon="👥" text="No hay usuarios todavía." /> : (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead><Thead cols={['Nombre', 'Email', 'Rol', 'Estado', 'Fecha', 'Acciones']} /></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Td bold>{u.nombre as string ?? '—'}</Td>
                        <Td muted>{u.email as string}</Td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: u.rol === 'profesional' ? '#eff6ff' : '#f0fdf4', color: u.rol === 'profesional' ? '#2563eb' : '#16a34a' }}>
                            {u.rol as string}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge ok={!u.blocked} okLabel="Activo" noLabel="Bloqueado" />
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                          {new Date(u.created_at as string).toLocaleDateString('es-AR')}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <ActionBar>
                            <ActionBtn onClick={() => toggleBlock(u.id as string, u.blocked as boolean)} color={u.blocked ? '#dcfce7' : '#fef3c7'} text={u.blocked ? '#16a34a' : '#d97706'} label={u.blocked ? '🔓 Desbloquear' : '🔒 Bloquear'} />
                            <ActionBtn onClick={() => deleteUser(u.id as string)} color="#fef2f2" text="#ef4444" label="🗑️ Eliminar" />
                          </ActionBar>
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
            <PageHeader title="Solicitudes de servicio" sub={`${books.length} solicitudes registradas.`} />
            {books.length === 0 ? <EmptyState icon="📨" text="No hay solicitudes todavía." /> : (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead><Thead cols={['Cliente', 'Descripción', 'Urgencia', 'Estado', 'Fecha', 'Acciones']} /></thead>
                  <tbody>
                    {books.map(b => {
                      const client = b.profiles as Record<string, unknown> | null
                      const STATUS_COLORS: Record<string, [string, string]> = {
                        pending: ['#fef3c7', '#d97706'],
                        confirmed: ['#dcfce7', '#16a34a'],
                        completed: ['#e0f2fe', '#0284c7'],
                        cancelled: ['#fef2f2', '#ef4444'],
                      }
                      const [bg, color] = STATUS_COLORS[b.status as string] ?? ['#f1f5f9', '#64748b']
                      const labels: Record<string, string> = { pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado' }
                      return (
                        <tr key={b.id as string} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Td bold>{client?.nombre as string ?? '—'}</Td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b', maxWidth: 200 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.description as string}</div>
                          </td>
                          <Td muted>{b.urgency as string}</Td>
                          <td style={{ padding: '14px 16px' }}>
                            <select value={b.status as string} onChange={e => updateBookingStatus(b.id as string, e.target.value)} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: bg, color, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                              {Object.entries(labels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                            {new Date(b.created_at as string).toLocaleDateString('es-AR')}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <ActionBtn onClick={() => deleteBooking(b.id as string)} color="#fef2f2" text="#ef4444" label="🗑️ Eliminar" />
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
            <PageHeader title="Moderar reseñas" sub={`${revs.length} reseñas publicadas.`} />
            {revs.length === 0 ? <EmptyState icon="⭐" text="No hay reseñas todavía." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {revs.map(r => {
                  const client = r.profiles as Record<string, unknown> | null
                  return (
                    <div key={r.id as string} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{client?.nombre as string ?? '—'}</span>
                          <span style={{ color: '#f59e0b', fontSize: 15 }}>{'★'.repeat(r.rating as number)}{'☆'.repeat(5 - (r.rating as number))}</span>
                        </div>
                        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{r.comment as string ?? '(Sin comentario)'}</p>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{new Date(r.created_at as string).toLocaleDateString('es-AR')}</div>
                      </div>
                      <ActionBtn onClick={() => deleteReview(r.id as string)} color="#fef2f2" text="#ef4444" label="🗑️ Eliminar" />
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL AGREGAR / EDITAR PROFESIONAL */}
      {(modal === 'add_pro' || modal === 'edit_pro') && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 24, padding: 36, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#64748b' }}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, marginBottom: 24 }}>
              {modal === 'add_pro' ? '+ Agregar profesional' : '✏️ Editar profesional'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <FG label="Nombre completo" colSpan>
                <input value={proForm.nombre} onChange={e => setProForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Carlos González" style={fi} />
              </FG>
              <FG label="Email">
                <input type="email" value={proForm.email} onChange={e => setProForm(f => ({ ...f, email: e.target.value }))} placeholder="carlos@email.com" style={fi} />
              </FG>
              <FG label="WhatsApp">
                <input value={proForm.whatsapp} onChange={e => setProForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+54 383 ..." style={fi} />
              </FG>
              <FG label="Oficio">
                <select value={proForm.trade} onChange={e => setProForm(f => ({ ...f, trade: e.target.value }))} style={fi}>
                  {OFICIOS.map(o => <option key={o}>{o}</option>)}
                </select>
              </FG>
              <FG label="Ciudad">
                <input value={proForm.location} onChange={e => setProForm(f => ({ ...f, location: e.target.value }))} placeholder="Catamarca Capital" style={fi} />
              </FG>
              <FG label="Precio por hora ($)">
                <input type="number" value={proForm.price} onChange={e => setProForm(f => ({ ...f, price: Number(e.target.value) }))} style={fi} />
              </FG>
              <FG label="N° Matrícula (opcional)">
                <input value={proForm.matricula_num} onChange={e => setProForm(f => ({ ...f, matricula_num: e.target.value }))} placeholder="MAT-ELE-2024-01" style={fi} />
              </FG>
              <FG label="Experiencia">
                <input value={proForm.experience} onChange={e => setProForm(f => ({ ...f, experience: e.target.value }))} placeholder="10 años" style={fi} />
              </FG>
              <FG label="Tiempo de respuesta">
                <input value={proForm.response_time} onChange={e => setProForm(f => ({ ...f, response_time: e.target.value }))} placeholder="30 min" style={fi} />
              </FG>
              <FG label="Descripción / Bio" colSpan>
                <textarea value={proForm.bio} onChange={e => setProForm(f => ({ ...f, bio: e.target.value }))} placeholder="Describí los servicios que ofrece..." style={{ ...fi, minHeight: 80, resize: 'vertical' }} />
              </FG>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: 13, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancelar</button>
              <button onClick={savePro} disabled={saving} style={{ flex: 2, padding: 13, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit', fontSize: 14 }}>
                {saving ? 'Guardando...' : modal === 'add_pro' ? 'Agregar profesional' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── COMPONENTES AUXILIARES ───

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{title}</h1>
      <p style={{ color: '#64748b', fontSize: 14 }}>{sub}</p>
    </div>
  )
}

function Thead({ cols }: { cols: string[] }) {
  return (
    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      {cols.map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>)}
    </tr>
  )
}

function Td({ children, bold, muted }: { children: React.ReactNode; bold?: boolean; muted?: boolean }) {
  return <td style={{ padding: '14px 16px', fontSize: bold ? 14 : 13, fontWeight: bold ? 600 : 400, color: muted ? '#64748b' : '#0f172a', whiteSpace: 'nowrap' }}>{children}</td>
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{children}</div>
}

function ActionBtn({ onClick, color, text, label }: { onClick: () => void; color: string; text: string; label: string }) {
  return (
    <button onClick={onClick} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: color, color: text, border: 'none', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  )
}

function Btn({ onClick, label, color }: { onClick: () => void; label: string; color: string }) {
  return (
    <button onClick={onClick} style={{ padding: '10px 18px', background: color, color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
      {label}
    </button>
  )
}

function StatusBadge({ ok, okLabel, noLabel }: { ok: boolean; okLabel: string; noLabel: string }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: ok ? '#dcfce7' : '#fef2f2', color: ok ? '#16a34a' : '#ef4444' }}>
      {ok ? `✓ ${okLabel}` : `✕ ${noLabel}`}
    </span>
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

function FG({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: boolean }) {
  return (
    <div style={{ gridColumn: colSpan ? '1 / -1' : undefined }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const fi: React.CSSProperties = { width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#0f172a', fontFamily: 'inherit', outline: 'none' }
