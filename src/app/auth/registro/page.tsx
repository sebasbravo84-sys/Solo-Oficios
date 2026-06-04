'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Rol = 'cliente' | 'profesional'

export default function RegistroPage() {
  const router = useRouter()
  const [rol, setRol] = useState<Rol>('cliente')
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { nombre: form.nombre, rol },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (rol === 'profesional') {
        router.push('/onboarding')
      } else {
        setSuccess(true)
      }
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>📬</div>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 12 }}>¡Revisá tu email!</h2>
        <p style={{ fontSize: 15, color: '#64748b', maxWidth: 360, lineHeight: 1.7 }}>
          Te enviamos un enlace de confirmación a <strong>{form.email}</strong>. Hacé clic para activar tu cuenta.
        </p>
        <Link href="/busqueda" style={{ marginTop: 32, display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: '#2563eb', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
          Explorar profesionales →
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 800, color: '#2563eb', textDecoration: 'none', letterSpacing: '-1px', marginBottom: 40 }}>
        Solo<span style={{ color: '#0f172a' }}>Oficios</span>
      </Link>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 40, width: '100%', maxWidth: 480, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Creá tu cuenta gratis</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Elegí cómo querés usar SoloOficios.</p>

        {/* Selector de rol */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {([
            { value: 'cliente', icon: '🏠', name: 'Busco un servicio', desc: 'Quiero contratar profesionales' },
            { value: 'profesional', icon: '🛠️', name: 'Soy profesional', desc: 'Quiero ofrecer mis servicios' },
          ] as const).map(opt => (
            <button key={opt.value} type="button" onClick={() => setRol(opt.value)} style={{ background: rol === opt.value ? 'rgba(37,99,235,.05)' : '#f8fafc', border: `2px solid ${rol === opt.value ? '#2563eb' : '#e2e8f0'}`, borderRadius: 16, padding: '20px 16px', cursor: 'pointer', textAlign: 'center', transition: '.2s', fontFamily: 'inherit' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{opt.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{opt.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>{opt.desc}</div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${rol === opt.value ? '#2563eb' : '#cbd5e1'}`, margin: '10px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: rol === opt.value ? '#2563eb' : 'transparent', fontSize: 11, color: '#fff', fontWeight: 900 }}>
                {rol === opt.value ? '✓' : ''}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Nombre completo">
            <input type="text" required value={form.nombre} onChange={set('nombre')} placeholder="Ej: Juan Pérez" style={inputStyle} />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={set('email')} placeholder="tu@email.com" style={inputStyle} />
          </Field>
          <Field label="Contraseña">
            <input type="password" required minLength={8} value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" style={inputStyle} />
          </Field>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, borderRadius: 12, fontSize: 16, fontWeight: 800, background: '#2563eb', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
            {loading ? 'Creando cuenta...' : rol === 'profesional' ? 'Crear cuenta y completar perfil →' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
          Al registrarte aceptás nuestros <Link href="#" style={{ color: '#2563eb' }}>Términos de uso</Link> y <Link href="#" style={{ color: '#2563eb' }}>Política de privacidad</Link>.
        </p>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Ingresá</Link>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px', border: '1.5px solid #e2e8f0',
  borderRadius: 12, fontSize: 15, outline: 'none', background: '#f8fafc',
  color: '#0f172a', fontFamily: 'inherit',
}
