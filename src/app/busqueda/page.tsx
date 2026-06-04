import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import BusquedaClient from './BusquedaClient'

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
