import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿Cómo funciona? — SoloOficios',
  description: 'Encontrá un profesional verificado en 3 simples pasos. Gratis para clientes, sin sorpresas.',
}

const PASOS_CLIENTE = [
  { n: '1', icon: '🔍', title: 'Buscá tu servicio', desc: 'Escribí lo que necesitás — electricista, plomero, gasista — y elegí tu ciudad. En segundos ves profesionales verificados cerca tuyo.' },
  { n: '2', icon: '📋', title: 'Solicitá presupuesto', desc: 'Describí el trabajo y enviá la solicitud. El profesional te responde por el Chat Seguro con un presupuesto claro, sin llamadas ni intermediarios.' },
  { n: '3', icon: '⭐', title: 'Confirmá y calificá', desc: 'Acordá el trabajo, pagá de forma segura y al finalizar dejá tu reseña. Tu opinión ayuda a otros vecinos a elegir mejor.' },
]

const PASOS_PRO = [
  { n: '1', icon: '📝', title: 'Creá tu perfil gratis', desc: 'Registrate, completá tu oficio, zona y datos. El perfil tarda menos de 5 minutos y aparece en búsquedas inmediatamente.' },
  { n: '2', icon: '✅', title: 'Verificá tu identidad', desc: 'Subí tu DNI y matrícula profesional. Los perfiles verificados reciben hasta 3 veces más solicitudes.' },
  { n: '3', icon: '💰', title: 'Recibí trabajos y cobrá', desc: 'Aceptá solicitudes, coordiná por el chat y cobrá directo. Sin comisiones ocultas en el plan gratuito.' },
]

const GARANTIAS = [
  { icon: '🛡️', title: 'Chat protegido', desc: 'Toda la comunicación queda registrada dentro de la plataforma.' },
  { icon: '🪪', title: 'DNI verificado', desc: 'Confirmamos la identidad de cada profesional antes de habilitarlo.' },
  { icon: '📜', title: 'Matrícula habilitante', desc: 'Verificamos que el profesional esté habilitado para ejercer.' },
  { icon: '⭐', title: 'Reseñas reales', desc: 'Solo clientes que contrataron el servicio pueden dejar una reseña.' },
  { icon: '🆓', title: 'Gratis para clientes', desc: 'Buscar y contactar profesionales es 100% gratuito para el cliente.' },
  { icon: '📍', title: 'Profesionales locales', desc: 'Mostramos solo profesionales de tu zona para una respuesta rápida.' },
]

const FAQ = [
  { q: '¿Cuánto cuesta usar SoloOficios?', a: 'Para clientes es completamente gratis. Para profesionales existe un plan gratuito con límite de solicitudes y planes pagos con más visibilidad.' },
  { q: '¿Cómo sé que el profesional es confiable?', a: 'Verificamos DNI, matrícula y antecedentes. Además, las reseñas son de clientes reales que contrataron el servicio.' },
  { q: '¿Qué pasa si el trabajo no quedó bien?', a: 'Tenés el chat como registro de lo acordado. Podés dejar una reseña negativa y el equipo de SoloOficios interviene en disputas.' },
  { q: '¿En qué ciudades está disponible?', a: 'Actualmente operamos en toda Argentina. Comenzamos con mayor presencia en Catamarca y estamos expandiéndonos a todo el país.' },
  { q: '¿Puedo tener más de un oficio en mi perfil?', a: 'Sí, podés agregar todos los oficios que ejercés. Cada uno aparece en las búsquedas correspondientes.' },
]

export default function ComoFuncionaPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: 'clamp(60px,8vw,100px) 20px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(37,99,235,.3)', border: '1px solid rgba(37,99,235,.5)', borderRadius: 100, padding: '6px 20px', fontSize: 13, fontWeight: 600, color: '#93c5fd', marginBottom: 24 }}>
            Simple, seguro y gratuito para clientes
          </div>
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 20, lineHeight: 1.1 }}>
            ¿Cómo funciona<br />SoloOficios?
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40 }}>
            Conectamos hogares con profesionales verificados en minutos. Sin llamadas, sin sorpresas, con total seguridad.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/busqueda" style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
              Buscar profesional
            </Link>
            <Link href="/onboarding" style={{ padding: '14px 28px', background: 'rgba(255,255,255,.1)', color: '#fff', borderRadius: 12, fontWeight: 600, textDecoration: 'none', fontSize: 15, border: '1px solid rgba(255,255,255,.2)' }}>
              Registrarme como profesional
            </Link>
          </div>
        </div>
      </section>

      {/* PARA CLIENTES */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 20px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>Para clientes</span>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, marginTop: 16, letterSpacing: '-1px' }}>
            Encontrá al profesional ideal en 3 pasos
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32 }}>
          {PASOS_CLIENTE.map((p, i) => (
            <div key={p.n} style={{ position: 'relative' }}>
              {i < PASOS_CLIENTE.length - 1 && (
                <div className="hide-mobile" style={{ position: 'absolute', top: 40, left: '60%', width: '80%', height: 2, background: 'linear-gradient(90deg,#2563eb,#e2e8f0)', zIndex: 0 }} />
              )}
              <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #e2e8f0', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 56, height: 56, background: '#eff6ff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>
                  {p.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 800, color: '#2563eb', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Paso {p.n}
                </div>
                <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/busqueda" style={{ padding: '16px 36px', background: '#2563eb', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>
            Empezar a buscar →
          </Link>
        </div>
      </section>

      {/* PARA PROFESIONALES */}
      <section style={{ background: '#f8fafc', padding: 'clamp(60px,8vw,100px) 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>Para profesionales</span>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, marginTop: 16, letterSpacing: '-1px' }}>
              Conseguí más clientes sin pagar comisiones
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32 }}>
            {PASOS_PRO.map(p => (
              <div key={p.n} style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 56, height: 56, background: '#dcfce7', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>
                  {p.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 800, color: '#16a34a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Paso {p.n}
                </div>
                <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/onboarding" style={{ padding: '16px 36px', background: '#16a34a', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>
              Registrarme gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* GARANTÍAS */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 20px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, textAlign: 'center', marginBottom: 16, letterSpacing: '-1px' }}>
          Tu seguridad, nuestra prioridad
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 48 }}>
          Cada profesional pasa por un proceso de verificación antes de aparecer en la plataforma.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          {GARANTIAS.map(g => (
            <div key={g.title} style={{ display: 'flex', gap: 16, padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{g.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{g.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f8fafc', padding: 'clamp(60px,8vw,100px) 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, textAlign: 'center', marginBottom: 48, letterSpacing: '-1px' }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQ.map(f => (
              <div key={f.q} style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{f.q}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: 'clamp(60px,8vw,80px) 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>
          ¿Listo para empezar?
        </h2>
        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 36 }}>Gratis para clientes. Sin tarjeta de crédito.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/busqueda" style={{ padding: '16px 32px', background: '#2563eb', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>
            Buscar profesional
          </Link>
          <Link href="/onboarding" style={{ padding: '16px 32px', background: '#f1f5f9', color: '#0f172a', borderRadius: 12, fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>
            Soy profesional
          </Link>
        </div>
      </section>

      <footer style={{ padding: 'clamp(32px,5vw,60px) 20px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>© 2025 SoloOficios. Hecho con ❤️ en Argentina.</p>
      </footer>
    </>
  )
}
