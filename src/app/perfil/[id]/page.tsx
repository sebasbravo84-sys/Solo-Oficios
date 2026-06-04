import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import PerfilClient from './PerfilClient'
import { getProfessionalById } from '@/lib/data'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const pro = await getProfessionalById(id)
  if (!pro) return {}
  return {
    title: `${pro.name} — ${pro.trade} en ${pro.location} | SoloOficios`,
    description: pro.bio,
  }
}

export default async function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pro = await getProfessionalById(id)
  if (!pro) notFound()

  return (
    <>
      <Navbar />
      <PerfilClient pro={pro} />
    </>
  )
}
