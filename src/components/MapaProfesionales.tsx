'use client'

import { useEffect, useRef } from 'react'
import type { Professional } from '@/types'

interface Props {
  professionals: Professional[]
  center?: [number, number]
}

// Coordenadas aproximadas de ciudades argentinas
const CITY_COORDS: Record<string, [number, number]> = {
  'Catamarca Capital': [-28.4696, -65.7852],
  'San Fernando del Valle': [-28.4696, -65.7852],
  'Valle Viejo': [-28.5122, -65.8019],
  'Fray Mamerto Esquiú': [-28.5444, -65.7817],
  'Buenos Aires': [-34.6037, -58.3816],
  'Córdoba Capital': [-31.4201, -64.1888],
  'Rosario': [-32.9468, -60.6393],
  'Mendoza Capital': [-32.8908, -68.8272],
  'San Miguel de Tucumán': [-26.8083, -65.2176],
  'San Salvador de Jujuy': [-24.1858, -65.2995],
  'Salta Capital': [-24.7829, -65.4232],
  'Resistencia': [-27.4514, -58.9861],
  'Neuquén Capital': [-38.9516, -68.0591],
  'San Carlos de Bariloche': [-41.1335, -71.3103],
  'Posadas': [-27.3671, -55.8961],
  'Paraná': [-31.7333, -60.5333],
  'Santa Fe Capital': [-31.6333, -60.7000],
  'La Plata': [-34.9215, -57.9545],
  'Mar del Plata': [-38.0023, -57.5575],
  'Bahía Blanca': [-38.7196, -62.2724],
}

function getCoords(location: string): [number, number] {
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (location.toLowerCase().includes(city.toLowerCase())) return coords
  }
  return [-28.4696, -65.7852] // default Catamarca
}

export default function MapaProfesionales({ professionals, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(L => {
      // Fix default icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const mapCenter = center ?? [-28.4696, -65.7852]
      const map = L.map(mapRef.current!).setView(mapCenter, 12)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      professionals.forEach(pro => {
        const coords = getCoords(pro.location)
        const jitter: [number, number] = [
          coords[0] + (Math.random() - 0.5) * 0.05,
          coords[1] + (Math.random() - 0.5) * 0.05,
        ]

        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${pro.pro ? '#2563eb' : '#0ea5e9'};color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
            ${pro.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })

        L.marker(jitter, { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:180px">
              <strong style="font-size:14px">${pro.name}</strong><br>
              <span style="color:#64748b;font-size:12px">${pro.trade}</span><br>
              <span style="color:#f59e0b">★</span> <strong>${pro.stars}</strong> (${pro.reviews} reseñas)<br>
              <strong style="color:#2563eb;font-size:15px">$${pro.price.toLocaleString('es-AR')}/hr</strong><br>
              <a href="/perfil/${pro.id}" style="color:#2563eb;font-size:12px;font-weight:700">Ver perfil →</a>
            </div>
          `)
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
    </>
  )
}
