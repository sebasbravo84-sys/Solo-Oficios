'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const OFICIOS = [
  { icon: '⚡', name: 'Electricista' }, { icon: '🔧', name: 'Plomero' }, { icon: '🔥', name: 'Gasista' },
  { icon: '🏗️', name: 'Albañil' }, { icon: '🎨', name: 'Pintor' }, { icon: '🪵', name: 'Carpintero' },
  { icon: '❄️', name: 'Climatización' }, { icon: '🪟', name: 'Herrería' }, { icon: '🌿', name: 'Jardinero' },
  { icon: '🧹', name: 'Limpieza' }, { icon: '🔩', name: 'Cerrajero' }, { icon: '📡', name: 'Técnico TV/PC' },
]

const RADIOS = ['Solo capital', 'Hasta 10 km', 'Hasta 20 km', 'Hasta 30 km', 'Toda la provincia']

const VERIFICACIONES = [
  { icon: '🪪', title: 'DNI verificado', desc: 'Subí foto de tu DNI para confirmar tu identidad.', pts: '+20 pts' },
  { icon: '📜', title: 'Matrícula profesional', desc: 'Indicá tu número de matrícula habilitante.', pts: '+30 pts' },
  { icon: '🏅', title: 'Sin antecedentes penales', desc: 'Adjuntá el certificado de antecedentes.', pts: '+25 pts' },
]

type Step = 0 | 1 | 2 | 3 | 4

const STEPS = ['Oficio', 'Datos', 'Zona', 'Verificación', 'Listo']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [oficios, setOficios] = useState<string[]>([])
  const [datos, setDatos] = useState({ nombre: '', apellido: '', whatsapp: '', email: '', bio: '' })
  const [radio, setRadio] = useState('Solo capital')
  const [verificaciones, setVerificaciones] = useState<string[]>([])

  function toggleOficio(name: string) {
    setOficios(prev => prev.includes(name) ? prev.filter(o => o !== name) : [...prev, name])
  }

  function toggleVerif(title: string) {
    setVerificaciones(prev => prev.includes(title) ? prev.filter(v => v !== title) : [...prev, title])
  }

  function next() { setStep(s => Math.min(s + 1, 4) as Step) }
  function prev() { setStep(s => Math.max(s - 1, 0) as Step) }

  const progress = (step / 4) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: '#e2e8f0', zIndex: 100 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#0ea5e9,#2563eb)', transition: 'width .5s ease', borderRadius: '0 2px 2px 0' }} />
      </div>

      {/* Top nav */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 99 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 18, fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>
          Solo<span style={{ color: '#0f172a' }}>Oficios</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Step dots */}
          {STEPS.map((s, i) => (
            <div key={s} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: 3, background: i < step ? '#10b981' : i === step ? '#2563eb' : '#cbd5e1', transition: '.3s' }} />
          ))}
          <button onClick={() => router.push('/dashboard')} style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }}>Saltar →</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '80px 24px 100px', textAlign: 'center' }}>

        {/* STEP 0 — OFICIO */}
        {step === 0 && (
          <div style={{ width: '100%', maxWidth: 520 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔧</div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, letterSpacing: '-.8px', marginBottom: 12 }}>
              ¿Cuál es tu <em style={{ fontStyle: 'italic', color: '#2563eb' }}>oficio</em>?
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
              Podés tener más de uno. Elegí los que mejor te representen.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24, textAlign: 'center' }}>
              {OFICIOS.map(o => (
                <button key={o.name} onClick={() => toggleOficio(o.name)} style={{ padding: '14px 10px', border: `1.5px solid ${oficios.includes(o.name) ? '#2563eb' : '#e2e8f0'}`, borderRadius: 14, cursor: 'pointer', background: oficios.includes(o.name) ? 'rgba(37,99,235,.08)' : '#fff', transition: '.18s', fontFamily: 'inherit' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{o.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: oficios.includes(o.name) ? '#2563eb' : '#0f172a' }}>{o.name}</div>
                </button>
              ))}
            </div>
            <button onClick={next} disabled={oficios.length === 0} style={btnStyle(oficios.length === 0)}>
              Continuar →
            </button>
            <button onClick={next} style={{ ...btnSecStyle, marginTop: 10 }}>No encuentro mi oficio, continuar igual</button>
          </div>
        )}

        {/* STEP 1 — DATOS */}
        {step === 1 && (
          <div style={{ width: '100%', maxWidth: 480, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📝</div>
              <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 900, letterSpacing: '-.8px', marginBottom: 8 }}>
                Tus <em style={{ fontStyle: 'italic', color: '#2563eb' }}>datos</em>
              </h1>
              <p style={{ fontSize: 15, color: '#64748b' }}>Esta info aparece en tu perfil público.</p>
            </div>

            {/* Foto placeholder */}
            <div style={{ width: 90, height: 90, borderRadius: 20, border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto 24px', background: '#f8fafc', gap: 4 }}>
              <div style={{ fontSize: 24 }}>📷</div>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Foto de perfil</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <FG label="Nombre"><input type="text" value={datos.nombre} onChange={e => setDatos(d => ({ ...d, nombre: e.target.value }))} placeholder="Carlos" style={fi} /></FG>
              <FG label="Apellido"><input type="text" placeholder="González" style={fi} /></FG>
            </div>
            <FG label="WhatsApp"><input type="tel" placeholder="+54 383 ..." style={fi} /></FG>
            <FG label="Email"><input type="email" value={datos.email} onChange={e => setDatos(d => ({ ...d, email: e.target.value }))} placeholder="carlos@email.com" style={fi} /></FG>
            <FG label="Descripción breve">
              <textarea placeholder="Ej: Electricista con 10 años de experiencia. Garantía en todos mis trabajos." style={{ ...fi, minHeight: 80, resize: 'vertical' }} />
            </FG>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={prev} style={{ ...btnSecStyle, flex: 1 }}>← Atrás</button>
              <button onClick={next} style={{ ...btnStyle(false), flex: 2 }}>Continuar →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — ZONA */}
        {step === 2 && (
          <div style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📍</div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, letterSpacing: '-.8px', marginBottom: 12 }}>
              ¿Dónde <em style={{ fontStyle: 'italic', color: '#2563eb' }}>trabajás</em>?
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
              Los clientes cercanos van a poder encontrarte.
            </p>

            <div style={{ width: '100%', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, cursor: 'pointer' }}>
              <span style={{ fontSize: 28 }}>🗺️</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Catamarca Capital</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Detectado automáticamente · Tocar para cambiar</div>
              </div>
              <span style={{ color: '#94a3b8', fontSize: 18 }}>›</span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, fontWeight: 600 }}>¿Hasta dónde llegás?</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RADIOS.map(r => (
                  <button key={r} onClick={() => setRadio(r)} style={{ padding: '7px 16px', borderRadius: 100, border: `1.5px solid ${radio === r ? '#2563eb' : '#e2e8f0'}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: radio === r ? 'rgba(37,99,235,.1)' : '#fff', color: radio === r ? '#2563eb' : '#94a3b8', fontFamily: 'inherit' }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={prev} style={{ ...btnSecStyle, flex: 1 }}>← Atrás</button>
              <button onClick={next} style={{ ...btnStyle(false), flex: 2 }}>Continuar →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — VERIFICACIÓN */}
        {step === 3 && (
          <div style={{ width: '100%', maxWidth: 460 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛡️</div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, letterSpacing: '-.8px', marginBottom: 12 }}>
              Ganá la <em style={{ fontStyle: 'italic', color: '#2563eb' }}>confianza</em>
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
              Los perfiles verificados reciben 3x más solicitudes. Cada verificación suma puntos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginBottom: 24 }}>
              {VERIFICACIONES.map(v => (
                <div key={v.title} onClick={() => toggleVerif(v.title)} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 16, background: verificaciones.includes(v.title) ? 'rgba(16,185,129,.05)' : '#fff', border: `1.5px solid ${verificaciones.includes(v.title) ? 'rgba(16,185,129,.4)' : '#e2e8f0'}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', transition: '.2s' }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{v.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, lineHeight: 1.5 }}>{v.desc}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', whiteSpace: 'nowrap' }}>{v.pts}</span>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${verificaciones.includes(v.title) ? '#10b981' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: verificaciones.includes(v.title) ? '#10b981' : 'transparent', color: '#fff', flexShrink: 0, transition: '.2s' }}>
                    {verificaciones.includes(v.title) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={prev} style={{ ...btnSecStyle, flex: 1 }}>← Atrás</button>
              <button onClick={next} style={{ ...btnStyle(false), flex: 2 }}>
                {verificaciones.length === 0 ? 'Saltar por ahora →' : `Continuar con ${verificaciones.length} verificación${verificaciones.length > 1 ? 'es' : ''} →`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — ÉXITO */}
        {step === 4 && (
          <div style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,rgba(16,185,129,.6))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, margin: '0 auto 24px', boxShadow: '0 0 0 16px rgba(16,185,129,.08),0 0 0 32px rgba(16,185,129,.04)' }}>
              🎉
            </div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, letterSpacing: '-.8px', marginBottom: 12 }}>
              ¡Estás en <em style={{ fontStyle: 'italic', color: '#10b981' }}>línea</em>!
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 32, maxWidth: 380, margin: '0 auto 32px' }}>
              Tu perfil ya es visible para los clientes de tu zona. Las primeras solicitudes pueden llegar en minutos.
            </p>

            <div style={{ background: 'rgba(37,99,235,.06)', border: '1px solid rgba(37,99,235,.2)', borderRadius: 16, padding: 20, marginBottom: 28, width: '100%', textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Resumen de tu perfil</div>
              {[
                { icon: '🔧', label: 'Oficio', val: oficios.length > 0 ? oficios.join(', ') : 'Sin especificar' },
                { icon: '📍', label: 'Zona', val: `Catamarca Capital · ${radio}` },
                { icon: '🛡️', label: 'Verificaciones', val: verificaciones.length > 0 ? `${verificaciones.length} completada${verificaciones.length > 1 ? 's' : ''}` : 'Pendientes' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>{r.icon} {r.label}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', maxWidth: 220, textAlign: 'right' }}>{r.val}</span>
                </div>
              ))}
            </div>

            <button onClick={() => router.push('/dashboard')} style={btnStyle(false)}>
              Ir a mi Dashboard →
            </button>
            <Link href="/perfil/pro1" style={{ display: 'block', ...btnSecStyle, marginTop: 10, textDecoration: 'none', textAlign: 'center' }}>
              Ver mi perfil público
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function FG({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14, width: '100%' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return { width: '100%', maxWidth: 420, padding: 16, borderRadius: 14, fontSize: 16, fontWeight: 800, fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer', background: disabled ? '#cbd5e1' : 'linear-gradient(135deg,#0ea5e9,#2563eb)', border: 'none', color: '#fff', transition: '.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
}

const btnSecStyle: React.CSSProperties = { width: '100%', maxWidth: 420, padding: 14, borderRadius: 14, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: 'transparent', border: '1.5px solid #e2e8f0', color: '#64748b', transition: '.2s' }

const fi: React.CSSProperties = { width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: '#0f172a', fontFamily: 'inherit', outline: 'none' }
