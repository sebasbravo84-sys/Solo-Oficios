'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: number
  text: string
  sent: boolean
  time: string
  type?: 'presupuesto' | 'sistema'
  presupuesto?: { titulo: string; monto: number; horas: number }
}

interface Conversation {
  id: string
  name: string
  initials: string
  color: string
  trade: string
  preview: string
  time: string
  unread: number
  online: boolean
  tag: 'oficio' | 'urgente' | 'presup' | 'cerrado'
  stars: number
  reviews: number
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', name: 'Marcelo Rodríguez', initials: 'MR', color: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
    trade: 'Electricista', preview: 'Sí, puedo ir mañana a las 10hs.', time: '10:42', unread: 2, online: true, tag: 'urgente',
    stars: 4.9, reviews: 87,
    messages: [
      { id: 1, text: 'Hola Marcelo, tengo un cortocircuito en el patio. ¿Podés venir hoy?', sent: true, time: '10:30' },
      { id: 2, text: 'Hola! Sí, puedo pasar a las 18hs. ¿Me mandás la dirección?', sent: false, time: '10:35' },
      { id: 3, text: 'Claro, Rivadavia 540 piso 2. ¿Cuánto cobrás la visita?', sent: true, time: '10:37' },
      { id: 4, text: 'La visita es gratis si hacés el trabajo. Si no, $2.500.', sent: false, time: '10:39' },
      { id: 5, text: 'Perfecto. Te espero a las 18hs.', sent: true, time: '10:41' },
      { id: 6, text: 'Sí, puedo ir mañana a las 10hs. 👍', sent: false, time: '10:42' },
    ],
  },
  {
    id: 'c2', name: 'Ana Lucía Pereyra', initials: 'AL', color: 'linear-gradient(135deg,#10b981,#059669)',
    trade: 'Plomera', preview: 'Te mando el presupuesto ahora.', time: 'ayer', unread: 0, online: false, tag: 'presup',
    stars: 5.0, reviews: 23,
    messages: [
      { id: 1, text: 'Buenos días Ana, ¿podés hacer una instalación de termotanque?', sent: true, time: '09:00' },
      { id: 2, text: 'Sí, claro. ¿Qué marca es el termotanque?', sent: false, time: '09:15' },
      { id: 3, text: 'Es un Rheem 80 litros, nuevo, yo lo tengo.', sent: true, time: '09:20' },
      { id: 4, text: 'Perfecto. Te mando el presupuesto ahora.', sent: false, time: '09:22',
        type: 'presupuesto', presupuesto: { titulo: 'Instalación termotanque Rheem 80L', monto: 18000, horas: 3 } },
    ],
  },
  {
    id: 'c3', name: 'Roberto Salas', initials: 'RS', color: 'linear-gradient(135deg,#f59e0b,#d97706)',
    trade: 'Gasista', preview: '¡Gracias! Fue un placer.', time: 'lun', unread: 0, online: false, tag: 'cerrado',
    stars: 4.7, reviews: 54,
    messages: [
      { id: 1, text: 'Roberto, quedó todo perfecto. Muchas gracias.', sent: true, time: '16:00' },
      { id: 2, text: '¡A usted! Un placer. Cualquier cosa me avisa.', sent: false, time: '16:05' },
    ],
  },
]

const TAG_CONFIG = {
  oficio: { label: 'Oficio', bg: 'rgba(91,141,248,.1)', color: '#3b82f6', border: 'rgba(91,141,248,.2)' },
  urgente: { label: 'Urgente', bg: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'rgba(239,68,68,.2)' },
  presup: { label: 'Presupuesto', bg: 'rgba(16,185,129,.1)', color: '#10b981', border: 'rgba(16,185,129,.2)' },
  cerrado: { label: 'Cerrado', bg: 'rgba(100,116,139,.1)', color: '#64748b', border: '#e2e8f0' },
}

export default function ChatPage() {
  const [activeId, setActiveId] = useState('c1')
  const [text, setText] = useState('')
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const active = conversations.find(c => c.id === activeId)!

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages])

  function sendMessage() {
    if (!text.trim()) return
    const newMsg: Message = { id: Date.now(), text: text.trim(), sent: true, time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) }
    setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, newMsg], preview: text.trim() } : c))
    setText('')

    // Fake reply
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply: Message = { id: Date.now() + 1, text: '¡Perfecto! Te confirmo en breve. 👍', sent: false, time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) }
      setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c))
    }, 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, sans-serif', background: '#0f172a', color: '#f1f5f9' }}>

      {/* Topbar */}
      <div style={{ height: 60, background: 'rgba(15,23,42,.97)', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>
          Solo<span style={{ color: '#f1f5f9' }}>Oficios</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
            Chat Seguro
          </div>
          <Link href="/dashboard" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Dashboard</Link>
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 60px)' }}>

        {/* SIDEBAR — Conversaciones */}
        <div style={{ width: 320, flexShrink: 0, borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
          <div style={{ padding: '18px 18px 12px', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 900, letterSpacing: '-.3px', marginBottom: 12 }}>
              Mensajes <em style={{ fontStyle: 'italic', color: '#2563eb' }}>seguros</em>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '9px 13px' }}>
              <span style={{ color: '#64748b' }}>🔍</span>
              <input placeholder="Buscar conversación..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#f1f5f9', fontFamily: 'inherit', flex: 1 }} />
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.map(conv => {
              const tag = TAG_CONFIG[conv.tag]
              return (
                <div key={conv.id} onClick={() => setActiveId(conv.id)} style={{ display: 'flex', gap: 12, padding: '14px 18px', cursor: 'pointer', borderBottom: '1px solid #1e293b', background: conv.id === activeId ? 'rgba(37,99,235,.06)' : 'transparent', borderRight: conv.id === activeId ? '2px solid #2563eb' : '2px solid transparent', transition: '.15s', position: 'relative' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: conv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0, position: 'relative' }}>
                    {conv.initials}
                    {conv.online && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, background: '#10b981', borderRadius: '50%', border: '2px solid #0f172a' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: conv.unread > 0 ? 700 : 600, color: '#f1f5f9' }}>{conv.name}</span>
                      <span style={{ fontSize: 10, color: '#475569', whiteSpace: 'nowrap', marginLeft: 8, marginTop: 1 }}>{conv.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: conv.unread > 0 ? '#e2e8f0' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 5 }}>{conv.preview}</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: tag.bg, color: tag.color, border: `1px solid ${tag.border}` }}>{tag.label}</span>
                    </div>
                  </div>
                  {conv.unread > 0 && <div style={{ position: 'absolute', top: 14, right: 18, background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{conv.unread}</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* CHAT MAIN */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Chat header */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: active.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 16, fontWeight: 900, color: '#fff' }}>
                {active.initials}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{active.name}</div>
                <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, background: active.online ? '#10b981' : '#475569', borderRadius: '50%' }} />
                  {active.online ? 'En línea' : 'Desconectado'} · {active.trade}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href={`/perfil/${active.id === 'c1' ? 'pro1' : active.id === 'c2' ? 'pro2' : 'pro3'}`} style={{ width: 34, height: 34, borderRadius: 9, background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', textDecoration: 'none' }}>👤</Link>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer' }}>📞</div>
            </div>
          </div>

          {/* Context banner */}
          <div style={{ background: 'linear-gradient(90deg,rgba(37,99,235,.07),rgba(14,165,233,.07))', borderBottom: '1px solid #1e293b', padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Servicio protegido por SoloOficios</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Mantené el pago y la comunicación en la plataforma para estar cubierto.</div>
            </div>
            <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: 'rgba(37,99,235,.15)', color: '#3b82f6', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Acordar precio
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {active.messages.map(msg => (
              <div key={msg.id}>
                {msg.type === 'presupuesto' && msg.presupuesto ? (
                  <div style={{ alignSelf: 'flex-start', maxWidth: '72%', marginBottom: 4 }}>
                    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, overflow: 'hidden', width: 280 }}>
                      <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.12),rgba(37,99,235,.08))', padding: '14px 16px', borderBottom: '1px solid #334155' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#10b981', marginBottom: 6 }}>PRESUPUESTO</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{msg.presupuesto.titulo}</div>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        {[{ l: 'Mano de obra', v: `$${msg.presupuesto.monto.toLocaleString('es-AR')}` }, { l: 'Tiempo estimado', v: `${msg.presupuesto.horas}hs` }].map(r => (
                          <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                            <span style={{ color: '#64748b' }}>{r.l}</span><span style={{ fontWeight: 600 }}>{r.v}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: 10, marginTop: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>Total</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-outfit)' }}>${msg.presupuesto.monto.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid #334155' }}>
                        <button style={{ flex: 1, padding: 9, borderRadius: 9, fontSize: 12, fontWeight: 700, background: 'rgba(16,185,129,.18)', color: '#10b981', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✓ Aceptar</button>
                        <button style={{ flex: 1, padding: 9, borderRadius: 9, fontSize: 12, fontWeight: 700, background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Rechazar</button>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{msg.time}</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10, maxWidth: '72%', alignSelf: msg.sent ? 'flex-end' : 'flex-start', flexDirection: msg.sent ? 'row-reverse' : 'row' }}>
                    {!msg.sent && (
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: active.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0, marginTop: 2 }}>
                        {active.initials}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ padding: '11px 15px', borderRadius: 16, fontSize: 13, lineHeight: 1.6, background: msg.sent ? '#1e293b' : '#131e2e', border: `1px solid ${msg.sent ? '#334155' : '#1e293b'}`, borderBottomRightRadius: msg.sent ? 5 : 16, borderBottomLeftRadius: msg.sent ? 16 : 5 }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10, color: '#475569', textAlign: msg.sent ? 'right' : 'left' }}>
                        {msg.time} {msg.sent && '✓✓'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: active.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 12, fontWeight: 900, color: '#fff' }}>{active.initials}</div>
                <div style={{ background: '#131e2e', border: '1px solid #1e293b', borderRadius: 16, borderBottomLeftRadius: 5, padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#64748b', animation: `td .9s ${i * .2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: '16px 22px', borderTop: '1px solid #1e293b', background: '#0f172a', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {['📎 Adjuntar', '💲 Presupuesto', '📅 Agendar'].map(tool => (
                <button key={tool} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155', fontSize: 11, fontWeight: 600, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>{tool}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Escribí un mensaje... (Enter para enviar)"
                style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '12px 16px', fontSize: 14, color: '#f1f5f9', fontFamily: 'inherit', outline: 'none', resize: 'none', minHeight: 46, maxHeight: 120, lineHeight: 1.5 }}
                rows={1}
              />
              <button onClick={sendMessage} style={{ width: 46, height: 46, borderRadius: 13, background: '#2563eb', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}>
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Info profesional */}
        <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid #1e293b', background: '#0f172a', overflowY: 'auto' }}>
          <div style={{ padding: '20px 18px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#475569', marginBottom: 14 }}>Profesional</div>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: active.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 auto 10px' }}>{active.initials}</div>
            <div style={{ fontSize: 15, fontWeight: 700, textAlign: 'center' }}>{active.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 2 }}>{active.trade}</div>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'rgba(16,185,129,.12)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)' }}>✓ Verificado</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: 'rgba(37,99,235,.1)', color: '#2563eb', border: '1px solid rgba(37,99,235,.2)' }}>⚡ Pro</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              {[{ n: `${active.stars}`, l: 'Estrellas' }, { n: `${active.reviews}`, l: 'Reseñas' }].map(s => (
                <div key={s.l} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 900 }}>{s.n}</div>
                  <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <Link href="/perfil/pro1" style={{ display: 'block', width: '100%', padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#2563eb', color: '#fff', textAlign: 'center', textDecoration: 'none', marginTop: 12 }}>Ver perfil completo</Link>
            <button style={{ width: '100%', padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 700, background: 'transparent', border: '1px solid #334155', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>Dejar reseña ⭐</button>
          </div>

          <div style={{ padding: '20px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#475569', marginBottom: 14 }}>Archivos compartidos</div>
            {['Foto del tablero.jpg', 'Presupuesto.pdf'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 9, cursor: 'pointer', marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{f.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                <span style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes td{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
    </div>
  )
}
