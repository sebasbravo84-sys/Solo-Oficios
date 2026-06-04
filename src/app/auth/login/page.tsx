'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Link href="/" style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 800, color: '#2563eb', textDecoration: 'none', letterSpacing: '-1px', marginBottom: 40 }}>
        Solo<span style={{ color: '#0f172a' }}>Oficios</span>
      </Link>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 40, width: '100%', maxWidth: 440, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Bienvenido de nuevo</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>Ingresá para ver tus solicitudes y mensajes.</p>

        <form onSubmit={handleSubmit}>
          <Field label="Email">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" style={inputStyle} />
          </Field>
          <Field label="Contraseña">
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </Field>

          <div style={{ textAlign: 'right', marginBottom: 24, marginTop: -8 }}>
            <Link href="/auth/reset" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, borderRadius: 12, fontSize: 16, fontWeight: 800, background: '#2563eb', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/auth/registro" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Registrate gratis</Link>
        </div>

        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 12, color: '#94a3b8' }}>o ingresá con</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>

        <button onClick={async () => { const sb = createClient(); await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } }) }} style={{ width: '100%', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit' }}>
          <span style={{ fontSize: 18 }}>G</span> Continuar con Google
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
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
