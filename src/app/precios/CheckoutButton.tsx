'use client'

import { useState } from 'react'

interface Props {
  planId: string
  planNombre: string
  precio: number
  color: string
  cta: string
}

export default function CheckoutButton({ planId, planNombre, precio, color, cta }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, planNombre, precio }),
      })
      const { init_point, error } = await res.json()
      if (error) { alert(error); setLoading(false); return }
      window.location.href = init_point
    } catch {
      alert('Ocurrió un error. Intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{ width: '100%', padding: 14, background: color, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', fontSize: 15 }}
    >
      {loading ? 'Redirigiendo a MercadoPago...' : cta}
    </button>
  )
}
