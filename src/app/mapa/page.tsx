import Navbar from '@/components/layout/Navbar'
import MapaClient from './MapaClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mapa de profesionales — SoloOficios',
  description: 'Encontrá profesionales verificados cerca tuyo en el mapa.',
}

export default function MapaPage() {
  return (
    <>
      <Navbar />
      <MapaClient />
    </>
  )
}
