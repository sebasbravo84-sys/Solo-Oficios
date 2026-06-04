'use client'

import { useState } from 'react'

interface Props {
  professionalId: string
  professionalName: string
  onClose: () => void
}

export default function ReviewForm({ professionalId, professionalName, onClose }: Props) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Seleccioná una calificación'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professional_id: professionalId, rating, comment }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Ocurrió un error')
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⭐</div>
        <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>¡Gracias por tu reseña!</h3>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Tu opinión ayuda a otros usuarios a elegir mejor.</p>
        <button onClick={onClose} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Calificar a {professionalName}</h3>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>¿Cómo fue tu experiencia?</p>

      {/* Stars */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            style={{ fontSize: 36, background: 'none', border: 'none', cursor: 'pointer', filter: (hover || rating) >= s ? 'none' : 'grayscale(1)', opacity: (hover || rating) >= s ? 1 : 0.3, transition: '.15s' }}
          >
            ★
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', marginBottom: 8 }}>
          Comentario (opcional)
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Contá tu experiencia con este profesional..."
          style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#0f172a', fontFamily: 'inherit', outline: 'none', minHeight: 100, resize: 'vertical' }}
        />
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', fontSize: 15 }}>
        {loading ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  )
}
