'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Professional } from '@/types'
import { AVATAR_COLORS, getInitials, tradeEmoji } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'
import ReviewForm from '@/components/ReviewForm'

const MOCK_REVIEWS = [
  { name: 'Juan Carlos G.', stars: 5, text: 'Excelente profesional. Llegó puntual, resolvió rápido y el cobro fue lo acordado. Muy recomendable.', date: 'hace 3 días' },
  { name: 'Lucía M.', stars: 5, text: 'Súper prolijo y atento. Se nota que sabe mucho de su oficio. Muchas gracias!', date: 'hace 1 semana' },
  { name: 'Ramón T.', stars: 5, text: 'Lo contraté para una instalación de tablero trifásico. Todo perfecto, garantía incluida.', date: 'hace 2 semanas' },
]

const PORTFOLIO_EMOJIS = ['⚡', '🔧', '🏠', '📷', '🛠️', '🔌']

type Tab = 'info' | 'portfolio' | 'reviews'

export default function PerfilClient({ pro }: { pro: Professional }) {
  const [tab, setTab] = useState<Tab>('info')
  const [modalOpen, setModalOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '', urgencia: 'Lo antes posible' })

  const avatarColor = AVATAR_COLORS[pro.id] ?? 'linear-gradient(135deg,#2563eb,#0ea5e9)'
  const initials = getInitials(pro.name)
  const supabase = createClient()

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Guardar booking en Supabase
      await supabase.from('bookings').insert({
        professional_id: pro.id,
        client_id: user.id,
        description: form.descripcion,
        urgency: form.urgencia,
        status: 'pending',
      })

      // Notificar al profesional
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: pro.id,
          message: `Nueva solicitud: "${form.descripcion.slice(0, 60)}..."`,
          type: 'solicitud',
        }),
      })

      // Crear conversación si no existe
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('professional_id', pro.id)
        .eq('client_id', user.id)
        .single()

      if (!existing) {
        await supabase.from('conversations').insert({
          professional_id: pro.id,
          client_id: user.id,
          last_message: form.descripcion,
        })
      }
    }

    setSending(false)
    setSent(true)
  }

  function closeModal() {
    setModalOpen(false)
    setTimeout(() => setSent(false), 300)
  }

  return (
    <>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(180deg,#fff 0%,#f8fafc 100%)', borderBottom: '1px solid #e2e8f0', padding: '32px 0 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
          <div className="perfil-hero-top" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 0 }}>
            {/* Avatar */}
            <div style={{ width: 100, height: 100, borderRadius: 24, background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 42, fontWeight: 900, color: '#fff', flexShrink: 0, border: '4px solid #fff', boxShadow: `0 0 0 2px #2563eb` }}>
              {initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 34, fontWeight: 900, letterSpacing: '-1px' }}>{pro.name}</h1>
              <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 4 }}>{pro.trade} · {pro.location}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                {pro.verified && <PBadge color="#10b981">✓ Verificado</PBadge>}
                {pro.pro && <PBadge color="#2563eb">⚡ Pro</PBadge>}
                {pro.isMatriculado && <PBadge color="#0ea5e9">📜 Matriculado</PBadge>}
                <PBadge color="#64748b">🛡 DNI Verificado</PBadge>
              </div>
            </div>

            {/* Stars */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                <span style={{ color: '#2563eb', fontSize: 20 }}>★★★★★</span>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 26, fontWeight: 900 }}>{pro.stars.toFixed(1)}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{pro.reviews} reseñas reales</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', marginTop: 35, borderBottom: '1px solid #e2e8f0' }}>
            {(['info', 'portfolio', 'reviews'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '14px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: tab === t ? '#2563eb' : '#64748b', borderBottom: `3px solid ${tab === t ? '#2563eb' : 'transparent'}`, background: 'none', border: 'none', borderBottomWidth: 3, borderBottomStyle: 'solid', borderBottomColor: tab === t ? '#2563eb' : 'transparent', marginBottom: -1, transition: '.2s', fontFamily: 'inherit' }}>
                {t === 'info' ? 'Información' : t === 'portfolio' ? 'Trabajos' : 'Reseñas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="perfil-body" style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>

        {/* MAIN CONTENT */}
        <div>
          {/* TAB: INFO */}
          {tab === 'info' && (
            <>
              <Section title="Sobre mí">
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
                  {pro.bio}<br /><br />
                  Cuento con todas las herramientas necesarias para realizar un trabajo profesional y garantizado. Mi prioridad es la satisfacción del cliente y la seguridad de las instalaciones.
                </p>
              </Section>

              <Section title="Especialidades">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {[pro.trade, 'Urgencias 24hs', 'Mantenimiento preventivo', 'Garantía SoloOficios', 'Presupuesto sin cargo'].map(s => (
                    <span key={s} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </Section>

              <Section title="Estadísticas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {[
                    { label: 'Experiencia', value: pro.stats.experience },
                    { label: 'Confiabilidad', value: `${pro.stats.reliability}%` },
                    { label: 'Responde en', value: pro.stats.response },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {pro.isMatriculado && pro.matriculaNum && (
                <Section title="Credencial profesional">
                  <div style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(14,165,233,.2)', borderRadius: 14, padding: 16, fontSize: 13, color: '#64748b', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 28 }}>📜</span>
                    <div>
                      <strong style={{ color: '#0f172a' }}>Matrícula Profesional</strong><br />
                      Número: <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>{pro.matriculaNum}</span><br />
                      Habilitado para ejercer en la provincia de Catamarca.
                    </div>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* TAB: PORTFOLIO */}
          {tab === 'portfolio' && (
            <Section title="Trabajos realizados">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {PORTFOLIO_EMOJIS.map((emoji, i) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: 16, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, cursor: 'pointer' }}>
                    {emoji}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 16, textAlign: 'center' }}>
                Las fotos de trabajos reales estarán disponibles cuando el profesional complete su perfil.
              </p>
            </Section>
          )}

          {/* TAB: REVIEWS */}
          {tab === 'reviews' && (
            <Section title="Lo que dicen los clientes">
              {/* Summary */}
              <div style={{ display: 'flex', gap: 30, alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 60, fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>{pro.stars.toFixed(1)}</div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3].map(n => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, fontSize: 12, color: '#64748b' }}>
                      <span>{n}★</span>
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#2563eb', width: n === 5 ? '90%' : n === 4 ? '10%' : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Review cards */}
              {MOCK_REVIEWS.map((r) => (
                <div key={r.name} style={{ padding: '20px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</span>
                    <span style={{ color: '#2563eb' }}>{'★'.repeat(r.stars)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{r.text}</p>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{r.date}</div>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 28, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900 }}>
              ${pro.price.toLocaleString('es-AR')} <span style={{ fontSize: 14, fontFamily: 'Inter,sans-serif', color: '#64748b', fontWeight: 400 }}>/ hora estimada</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#10b981', fontWeight: 600, margin: '14px 0 20px' }}>
              <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Disponible ahora
            </div>

            <button onClick={() => setModalOpen(true)} style={{ width: '100%', padding: 15, borderRadius: 12, fontSize: 16, fontWeight: 800, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 12, fontFamily: 'inherit' }}>
              Solicitar Servicio Seguro 🛡️
            </button>
            <Link href="/chat" style={{ display: 'block', width: '100%', padding: 15, borderRadius: 12, fontSize: 15, fontWeight: 600, background: 'transparent', color: '#0f172a', border: '1.5px solid #cbd5e1', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginBottom: 20 }}>
              Enviar mensaje
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[{ n: pro.reviews, l: 'Trabajos' }, { n: pro.stars.toFixed(1), l: 'Estrellas' }].map(s => (
                <div key={s.l} style={{ background: '#f8fafc', borderRadius: 14, padding: 12, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900 }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 3, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: 16, background: 'rgba(61,214,140,.05)', border: '1px solid rgba(61,214,140,.15)', borderRadius: 14, fontSize: 12, color: '#94a3b8', lineHeight: 1.6, display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <div>
                <strong style={{ color: '#0f172a' }}>Garantía SoloOficios</strong><br />
                Mantené el pago y el chat en la plataforma para estar protegido.
              </div>
            </div>
            <button onClick={() => setReviewOpen(true)} style={{ width: '100%', marginTop: 12, padding: 12, background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}>
              Dejar reseña ⭐
            </button>
          </div>

          <Link href="/busqueda" style={{ display: 'block', marginTop: 16, textAlign: 'center', color: '#64748b', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
            ← Volver a buscar
          </Link>
        </div>
      </div>

      {/* MODAL CONTACTO */}
      {modalOpen && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 28, width: 500, maxWidth: '100%', padding: 40, position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: '50%' }}>✕</button>

            {!sent ? (
              <form onSubmit={handleSend}>
                <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Solicitar servicio</h2>
                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>
                  Completá los datos y <strong>{pro.name}</strong> te contactará por el Chat Seguro.
                </p>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1.5px', marginBottom: 8 }}>Tu nombre</label>
                  <input required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Juan Pérez" style={{ width: '100%', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', color: '#0f172a', fontFamily: 'inherit', outline: 'none', fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1.5px', marginBottom: 8 }}>¿Cuál es el trabajo?</label>
                  <textarea required value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Describí brevemente qué necesitás hacer..." style={{ width: '100%', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', color: '#0f172a', fontFamily: 'inherit', outline: 'none', fontSize: 14, minHeight: 110, resize: 'vertical' }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1.5px', marginBottom: 8 }}>Urgencia</label>
                  <select value={form.urgencia} onChange={e => setForm(f => ({ ...f, urgencia: e.target.value }))} style={{ width: '100%', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', color: '#0f172a', fontFamily: 'inherit', outline: 'none', fontSize: 14 }}>
                    <option>Lo antes posible (urgente)</option>
                    <option>Esta semana</option>
                    <option>Próximamente</option>
                  </select>
                </div>

                <button type="submit" disabled={sending} style={{ width: '100%', padding: 15, borderRadius: 12, fontSize: 15, fontWeight: 800, background: '#2563eb', color: '#fff', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, fontFamily: 'inherit' }}>
                  {sending ? 'Enviando...' : 'Enviar y Abrir Chat Seguro 🛡️'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 12 }}>Sin comisiones para vos. SoloOficios te protege.</p>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🛡️</div>
                <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>¡Solicitud enviada!</h2>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 28 }}>
                  Tu solicitud fue enviada. <strong>{pro.name}</strong> fue notificado y te responderá por el chat interno.
                </p>
                <Link href="/chat" style={{ display: 'block', width: '100%', padding: 15, borderRadius: 12, fontSize: 15, fontWeight: 800, background: '#3b82f6', color: '#fff', textDecoration: 'none', textAlign: 'center' }}>
                  Ir al Chat Seguro →
                </Link>
                <button onClick={closeModal} style={{ marginTop: 16, background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL RESEÑA */}
      {reviewOpen && (
        <div onClick={() => setReviewOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 28, width: 480, maxWidth: '100%', padding: 40, position: 'relative' }}>
            <button onClick={() => setReviewOpen(false)} style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: '50%' }}>✕</button>
            <ReviewForm professionalId={pro.id} professionalName={pro.name} onClose={() => setReviewOpen(false)} />
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 900, marginBottom: 18, color: '#0f172a' }}>{title}</h3>
      {children}
    </div>
  )
}

function PBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 800, padding: '5px 14px', borderRadius: 100, letterSpacing: '.5px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6, background: `${color}18`, color, border: `1px solid ${color}40` }}>
      {children}
    </span>
  )
}
