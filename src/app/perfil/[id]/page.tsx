import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import PerfilClient from './PerfilClient'
import { getProfessionalById } from '@/lib/data'

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
