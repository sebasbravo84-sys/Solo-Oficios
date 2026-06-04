'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/hooks/useNotifications'

type Section = 'resumen' | 'solicitudes' | 'agenda' | 'mensajes' | 'ganancias' | 'resenas' | 'perfil'

const MOCK_PRO = { name: 'Marcelo Rodríguez', initials: 'MR', trade: 'Electricista', plan: 'Pro', stars: 4.9, reviews: 87 }

const SOLICITUDES = [
  { id: 1, cliente: 'Carlos B.', initials: 'CB', color: '#8b5cf6', desc: 'Cortocircuito en el patio — necesito urgente', tag: 'urgente', precio: '$8.000', time: 'hace 10 min' },
  { id: 2, cliente: 'María G.', initials: 'MG', color: '#10b981', desc: 'Instalación de toma corriente doble en cocina', tag: 'normal', precio: '$5.500', time: 'hace 1 hr' },
  { id: 3, cliente: 'Roberto P.', initials: 'RP', color: '#f59e0b', desc: 'Cambio de tablero eléctrico completo', tag: 'presup', precio: 'A presupuestar', time: 'hace 2 hrs' },
  { id: 4, cliente: 'Sofía L.', initials: 'SL', color: '#0ea5e9', desc: 'Revisión instalación domiciliaria — mudanza', tag: 'normal', precio: '$7.000', time: 'ayer' },
]

const GANANCIAS = [
  { cliente: 'Juan G.', job: 'Instalación tablero trifásico', monto: '+$24.000' },
  { cliente: 'Ana R.', job: 'Reparación cortocircuito', monto: '+$8.500' },
  { cliente: 'Luis M.', job: 'Luces LED cocina', monto: '+$12.000' },
]

const CHART_DATA = [
  { label: 'Lun', h: 40 }, { label: 'Mar', h: 70 }, { label: 'Mié', h: 55 },
  { label: 'Jue', h: 90 }, { label: 'Vie', h: 65 }, { label: 'Sáb', h: 30 }, { label: 'Dom', h: 20 },
]

const NAV_ITEMS: { id: Section; icon: string; label: string; badge?: number }[] = [
  { id: 'resumen', icon: '📊', label: 'Resumen' },
  { id: 'solicitudes', icon: '📨', label: 'Solicitudes', badge: 4 },
  { id: 'agenda', icon: '📅', label: 'Agenda' },
  { id: 'mensajes', icon: '💬', label: 'Mensajes', badge: 2 },
  { id: 'ganancias', icon: '💰', label: 'Ganancias' },
  { id: 'resenas', icon: '⭐', label: 'Reseñas' },
  { id: 'perfil', icon: '👤', label: 'Mi Perfil' },
]

export default function DashboardPage() {
  const [section, setSection] = useState<Section>('resumen')
  const { unread, markAllRead } = useNotifications()

  return (
    <div className="dash-layout" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>

      {/* SIDEBAR — oculto en mobile */}
      <div className="dash-sidebar" style={{ width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', padding: '0 0 24px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 900, color: '#2563eb', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            Solo<span style={{ color: '#0f172a' }}>Oficios</span>
          </Link>
        </div>

        <div style={{ padding: '16px 12px', flex: 1 }}>
          <SideLabel>Principal</SideLabel>
          {NAV_ITEMS.slice(0, 4).map(item => (
            <NavItem key={item.id} item={item} active={section === item.id} onClick={() => setSection(item.id)} />
          ))}

          <SideLabel style={{ marginTop: 16 }}>Negocio</SideLabel>
          {NAV_ITEMS.slice(4).map(item => (
            <NavItem key={item.id} item={item} active={section === item.id} onClick={() => setSection(item.id)} />
          ))}
        </div>

        {/* Pro card */}
        <div style={{ padding: '0 12px', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
          <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{MOCK_PRO.name.split(' ')[0]} {MOCK_PRO.name.split(' ')[1][0]}.</div>
            <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>⚡ Plan {MOCK_PRO.plan}</div>
            <button style={{ width: '100%', marginTop: 10, padding: 8, borderRadius: 8, background: 'linear-gradient(135deg,#0ea5e9,#2563eb)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
              🚀 Ver estadísticas
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ height: 64, background: 'rgba(255,255,255,.97)', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            {NAV_ITEMS.find(n => n.id === section)?.icon} {NAV_ITEMS.find(n => n.id === section)?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href={`/perfil/pro1`} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid #e2e8f0', color: '#64748b', textDecoration: 'none' }}>👁 Ver perfil público</Link>
            <div style={{ position: 'relative' }} onClick={markAllRead}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}>🔔</div>
              {unread > 0 && <div style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #fff' }}>{unread}</div>}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0ea5e9,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 14, fontWeight: 900, color: '#fff', cursor: 'pointer' }}>
              {MOCK_PRO.initials}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(16px,3vw,32px)', maxWidth: 1100, margin: '0 auto', paddingBottom: 80 }}>

          {/* RESUMEN */}
          {section === 'resumen' && (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, letterSpacing: '-.5px' }}>
                  Buen día, <em style={{ fontStyle: 'italic', color: '#2563eb' }}>{MOCK_PRO.name.split(' ')[0]}</em> 👋
                </div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Martes 3 de junio — Tenés 4 solicitudes nuevas hoy.</div>
              </div>

              {/* Stats row */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '📨', label: 'Solicitudes hoy', value: '4', delta: '+2', up: true, bg: '#eff6ff' },
                  { icon: '💰', label: 'Ganancias mes', value: '$124K', delta: '+18%', up: true, bg: '#f0fdf4' },
                  { icon: '⭐', label: 'Calificación', value: '4.9', delta: '+0.1', up: true, bg: '#fffbeb' },
                  { icon: '👁', label: 'Visitas al perfil', value: '342', delta: '-5%', up: false, bg: '#fef2f2' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: s.up ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)', color: s.up ? '#10b981' : '#ef4444' }}>{s.delta}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Grid 2 col */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Solicitudes recientes */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: 14, fontWeight: 700 }}>
                    Solicitudes recientes
                    <button onClick={() => setSection('solicitudes')} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Ver todas →</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {SOLICITUDES.slice(0, 3).map(s => <SolicitudRow key={s.id} s={s} />)}
                  </div>
                </div>

                {/* Chart */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 22 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Actividad semanal</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
                    {CHART_DATA.map(d => (
                      <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${d.h}%`, borderRadius: '6px 6px 0 0', background: 'linear-gradient(180deg,rgba(37,99,235,.8),rgba(37,99,235,.3))' }} />
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid igual */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Ganancias */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 22 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Últimos cobros</div>
                  <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 36, fontWeight: 900 }}>$44.500</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, marginBottom: 14 }}>en los últimos 7 días</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {GANANCIAS.map(g => (
                      <div key={g.cliente} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{g.cliente}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{g.job}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>{g.monto}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perfil completeness */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 22 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Estado del perfil</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>Completado</span>
                    <span style={{ fontWeight: 700 }}>72%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: '72%', background: 'linear-gradient(90deg,#0ea5e9,#2563eb)', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Completar el perfil aumenta las visitas un 3x</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { done: true, label: 'Foto de perfil' },
                      { done: true, label: 'Descripción completa' },
                      { done: true, label: 'Matrícula verificada' },
                      { done: false, label: 'Agregar fotos de trabajos' },
                      { done: false, label: 'Configurar disponibilidad' },
                    ].map(t => (
                      <div key={t.label} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: t.done ? '#94a3b8' : '#0f172a', textDecoration: t.done ? 'line-through' : 'none' }}>
                        <span style={{ fontSize: 14, width: 18 }}>{t.done ? '✅' : '○'}</span>
                        {t.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SOLICITUDES */}
          {section === 'solicitudes' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 24, fontWeight: 900 }}>Solicitudes pendientes</div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>4 solicitudes esperan tu respuesta.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {SOLICITUDES.map(s => <SolicitudCard key={s.id} s={s} />)}
              </div>
            </>
          )}

          {/* AGENDA */}
          {section === 'agenda' && <EmptySection icon="📅" title="Agenda" desc="Tu calendario de trabajos aparecerá aquí. Próximamente." />}

          {/* MENSAJES */}
          {section === 'mensajes' && (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Chat Seguro</div>
              <p style={{ color: '#64748b', marginBottom: 24 }}>Tus conversaciones con clientes están protegidas por SoloOficios.</p>
              <Link href="/chat" style={{ padding: '14px 32px', background: '#2563eb', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>Abrir chat →</Link>
            </div>
          )}

          {/* GANANCIAS */}
          {section === 'ganancias' && <EmptySection icon="💰" title="Ganancias" desc="El resumen de pagos y facturas estará disponible cuando conectes MercadoPago." />}

          {/* RESEÑAS */}
          {section === 'resenas' && <EmptySection icon="⭐" title="Reseñas" desc="Tus calificaciones y comentarios de clientes aparecerán aquí." />}

          {/* PERFIL */}
          {section === 'perfil' && (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>👤</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Tu perfil público</div>
              <p style={{ color: '#64748b', marginBottom: 24 }}>Así te ven los clientes cuando buscan tu oficio.</p>
              <Link href="/perfil/pro1" style={{ padding: '14px 32px', background: '#2563eb', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>Ver perfil →</Link>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAV — solo mobile */}
      <div className="dash-bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => setSection(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', position: 'relative', color: section === item.id ? '#2563eb' : '#94a3b8' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700 }}>{item.label}</span>
            {item.badge && <span style={{ position: 'absolute', top: 2, right: 4, background: '#ef4444', color: '#fff', fontSize: 8, fontWeight: 800, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

function SideLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#94a3b8', padding: '0 12px', marginBottom: 6, ...style }}>{children}</div>
}

function NavItem({ item, active, onClick }: { item: typeof NAV_ITEMS[0]; active: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: active ? '#2563eb' : '#94a3b8', background: active ? 'rgba(37,99,235,.1)' : 'transparent', marginBottom: 2, transition: '.2s' }}>
      <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>{item.badge}</span>}
    </div>
  )
}

function SolicitudRow({ s }: { s: typeof SOLICITUDES[0] }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{s.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.cliente}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.desc}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <TagBadge tag={s.tag} />
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', whiteSpace: 'nowrap' }}>{s.precio}</div>
    </div>
  )
}

function SolicitudCard({ s }: { s: typeof SOLICITUDES[0] }) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending')

  return (
    <div style={{ background: '#fff', border: `1px solid ${status === 'accepted' ? '#86efac' : status === 'declined' ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 16, padding: '20px 22px', display: 'flex', gap: 16, alignItems: 'flex-start', opacity: status !== 'pending' ? 0.6 : 1, transition: '.3s' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 16, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{s.initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{s.cliente}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{s.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2563eb' }}>{s.precio}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.time}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
          <TagBadge tag={s.tag} />
        </div>
        {status === 'pending' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStatus('accepted')} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.3)', color: '#10b981', cursor: 'pointer', fontFamily: 'inherit' }}>✓ Aceptar</button>
            <button onClick={() => setStatus('declined')} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: 'transparent', border: '1px solid #e2e8f0', color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Rechazar</button>
            <Link href="/chat" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.25)', color: '#2563eb', textDecoration: 'none' }}>💬 Responder</Link>
          </div>
        )}
        {status === 'accepted' && <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>✓ Solicitud aceptada</div>}
        {status === 'declined' && <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>✕ Solicitud rechazada</div>}
      </div>
    </div>
  )
}

function TagBadge({ tag }: { tag: string }) {
  const config = {
    urgente: { bg: 'rgba(239,68,68,.12)', color: '#ef4444', border: 'rgba(239,68,68,.25)', label: '🔴 Urgente' },
    normal: { bg: 'rgba(59,130,246,.12)', color: '#3b82f6', border: 'rgba(59,130,246,.25)', label: '📋 Normal' },
    presup: { bg: 'rgba(16,185,129,.1)', color: '#10b981', border: 'rgba(16,185,129,.2)', label: '💬 A presupuestar' },
  }[tag] ?? { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', label: tag }

  return <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 100, fontWeight: 700, letterSpacing: '.3px', background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>{config.label}</span>
}

function EmptySection({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <p style={{ color: '#64748b', maxWidth: 360, margin: '0 auto' }}>{desc}</p>
    </div>
  )
}
