import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import HeroForm from '@/components/HeroForm'

const categories = [
  { name: 'Electricidad', slug: 'Electricista', svgPath: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
  { name: 'Plomería', slug: 'Plomero', svgPath: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
  { name: 'Gas', slug: 'Gasista', svgPath: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /> },
  { name: 'Albañilería', slug: 'Albañil', svgPath: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /></> },
  { name: 'Pintura', slug: 'Pintor', svgPath: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /> },
  { name: 'Carpintería', slug: 'Carpintero', svgPath: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></> },
]

const reviews = [
  { name: 'Martín Acosta', img: 'https://i.pravatar.cc/150?img=11', stars: 5, text: 'Pude elegir entre tres plomeros en cuestión de minutos. Todos con perfil verificado. El trabajo quedó impecable y el precio muy razonable.' },
  { name: 'Luciana Hernández', img: 'https://i.pravatar.cc/150?img=33', stars: 5, text: 'La tranquilidad de saber que contrato gente matriculada no tiene precio. La aplicación es rapidísima y muy intuitiva.' },
  { name: 'Tomás Romero', img: 'https://i.pravatar.cc/150?img=53', stars: 4, text: 'Excelentes profesionales cerca de mi casa. Mando fotos del problema y recibo cotizaciones antes de que lleguen. Muy recomendado.' },
]

const featured = [
  { id: 'pro1', initials: 'MR', name: 'Marcelo Rodríguez', trade: 'Electricista Matriculado', stars: '★★★★½', reviews: 87, distance: '0.8 km' },
  { id: 'pro2', initials: 'AL', name: 'Ana Lucía Pereyra', trade: 'Plomera Matriculada', stars: '★★★★★', reviews: 23, distance: '1.4 km' },
  { id: 'pro3', initials: 'RS', name: 'Roberto Salas', trade: 'Gasista Matriculado', stars: '★★★★½', reviews: 54, distance: '3.6 km' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{
        padding: '60px 20px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(37,99,235,0.5)), url('https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=2400&auto=format&fit=crop') no-repeat center center/cover",
        minHeight: 'auto',
      }}>
        <div className="hero-content-wrap" style={{ maxWidth: 1240, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 60, position: 'relative', zIndex: 2 }}>
          <div style={{ flex: 1, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontFamily: 'var(--font-outfit)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1.5px' }}>
              La red de expertos<br />para tu hogar
            </h1>
            <p style={{ fontSize: 18, color: '#e2e8f0', textShadow: '0 2px 4px rgba(0,0,0,0.8)', lineHeight: 1.5 }}>
              Encontrá miles de profesionales verificados listos para solucionar tus proyectos.
            </p>
          </div>
          <HeroForm />
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="section-wrap" style={{ padding: '60px 40px', maxWidth: 1240, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px,5vw,32px)', fontFamily: 'var(--font-outfit)', fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>Explorá nuestros servicios</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Gente de oficio preparada para ayudarte en lo que tu casa necesite.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 16px', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/busqueda?cat=${cat.slug}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: 90 }}>
              <span style={{ background: '#fff', borderRadius: '50%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', marginBottom: 10, display: 'flex', justifyContent: 'center', width: 72, height: 72, alignItems: 'center', border: '1px solid #cbd5e1' }}>
                <svg viewBox="0 0 24 24" width={34} height={34} stroke="#2563eb" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {cat.svgPath}
                </svg>
              </span>
              <span style={{ fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-outfit)', textAlign: 'center' }}>{cat.name}</span>
            </Link>
          ))}
          <Link href="/busqueda" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: 110 }}>
            <span style={{ background: '#fff', borderRadius: '50%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', marginBottom: 16, display: 'flex', justifyContent: 'center', width: 88, height: 88, alignItems: 'center', border: '1px solid #cbd5e1' }}>
              <svg viewBox="0 0 24 24" width={34} height={34} stroke="#2563eb" strokeWidth={1.5} fill="none"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={16} /><line x1={8} y1={12} x2={16} y2={12} /></svg>
            </span>
            <span style={{ fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-outfit)', textAlign: 'center' }}>Ver más rubros</span>
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-wrap" style={{ padding: '0 40px 60px', maxWidth: 1240, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px,5vw,32px)', fontFamily: 'var(--font-outfit)', fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>La comunidad recomienda</h2>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 16, color: '#64748b', padding: '16px 24px', background: 'white', borderRadius: 40, display: 'inline-block', border: '1px solid #cbd5e1' }}>
            Más de <strong style={{ color: '#0f172a' }}>12.500</strong> conexiones exitosas promedian <strong style={{ color: '#0f172a' }}>4.8</strong> ⭐
          </span>
        </div>
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {reviews.map((r) => (
            <div key={r.name} style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt={r.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-outfit)', fontSize: 17, marginBottom: 4 }}>{r.name}</div>
                  <div style={{ color: '#f59e0b', fontSize: 15, letterSpacing: 3 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                </div>
              </div>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="section-wrap" style={{ padding: '0 40px 60px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 30, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 'clamp(20px,5vw,32px)', fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>Destacados de esta semana</h2>
          <Link href="/busqueda" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-outfit)' }}>Ver lista completa →</Link>
        </div>
        <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {featured.map((p) => (
            <Link key={p.id} href={`/perfil/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-outfit)', fontSize: 20, fontWeight: 700, color: '#0ea5e9', border: '1px solid #bae6fd' }}>
                    {p.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-outfit)' }}>{p.name}</div>
                    <span style={{ background: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>✓ Certificado</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, color: '#0f172a', fontWeight: 500, marginBottom: 12 }}>{p.trade}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b', borderTop: '1px solid #cbd5e1', paddingTop: 16 }}>
                  <span style={{ color: '#0ea5e9', fontWeight: 700 }}>{p.stars} ({p.reviews})</span>
                  <span>A {p.distance} de distancia</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="section-wrap" style={{ padding: '0 40px 60px', maxWidth: 1240, margin: '0 auto' }}>
        <div className="app-banner-wrap" style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', borderRadius: 32, padding: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: 540, width: '100%' }}>
            <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontFamily: 'var(--font-outfit)', fontWeight: 700, marginBottom: 20, lineHeight: 1.1, letterSpacing: '-1px' }}>
              Recibí avisos de<br />trabajos cerca tuyo
            </h2>
            <p style={{ fontSize: 16, marginBottom: 28, opacity: 0.9, lineHeight: 1.5 }}>
              Dejá tu email y te avisamos cuando haya solicitudes en tu zona.
            </p>
            <div className="app-input-wrap" style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <input type="email" placeholder="tu@email.com" style={{ flex: 1, padding: '14px 20px', borderRadius: 14, border: 'none', fontSize: 15, background: 'white', outline: 'none', minWidth: 0 }} />
              <button style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0 24px', borderRadius: 14, fontWeight: 600, fontFamily: 'var(--font-outfit)', cursor: 'pointer', fontSize: 15, whiteSpace: 'nowrap' }}>
                Anotarme
              </button>
            </div>
          </div>
          <div className="hide-mobile" style={{ fontSize: 100 }}>🔧</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,40px)', textAlign: 'center', background: '#fff', borderTop: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px,4vw,40px)', marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Cómo funciona', href: '/como-funciona' },
            { label: 'Para Profesionales', href: '/onboarding' },
            { label: 'Precios', href: '/precios' },
            { label: 'Ayuda', href: '/como-funciona#faq' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{ color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-outfit)' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>© 2025 SoloOficios. Hecho con ❤️ en Argentina.</p>
      </footer>
    </>
  )
}
