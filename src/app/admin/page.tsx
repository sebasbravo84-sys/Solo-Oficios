import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  if (!adminEmails.includes(user.email ?? '')) redirect('/')

  // Cargar datos para el panel
  const [
    { data: professionals, count: prosCount },
    { data: profiles, count: usersCount },
    { data: bookings, count: bookingsCount },
    { data: reviews, count: reviewsCount },
  ] = await Promise.all([
    supabase.from('professionals').select('*, profiles(nombre, email)', { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
    supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
    supabase.from('bookings').select('*, profiles!bookings_client_id_fkey(nombre, email)', { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
    supabase.from('reviews').select('*, profiles!reviews_client_id_fkey(nombre)', { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
  ])

  const stats = {
    pros: prosCount ?? 0,
    users: usersCount ?? 0,
    bookings: bookingsCount ?? 0,
    reviews: reviewsCount ?? 0,
  }

  return (
    <AdminClient
      stats={stats}
      professionals={professionals ?? []}
      profiles={profiles ?? []}
      bookings={bookings ?? []}
      reviews={reviews ?? []}
    />
  )
}
