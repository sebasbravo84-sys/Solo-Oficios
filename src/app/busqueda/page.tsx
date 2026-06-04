import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import BusquedaClient from './BusquedaClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscar profesionales — SoloOficios',
  description: 'Encontrá electricistas, plomeros, gasistas, carpinteros y más en tu ciudad. Profesionales verificados con reseñas reales.',
}

export default function BusquedaPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Cargando...</div>}>
        <BusquedaClient />
      </Suspense>
    </>
  )
}
