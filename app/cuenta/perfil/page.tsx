import { ProfileForm } from '@/components/account/profile-form'
import { getProfile } from '@/features/profile/queries'
import { requireUser } from '@/lib/auth-session'

function getNameParts(name: string) {
  const [firstName = '', ...lastName] = name.trim().split(/\s+/)
  return { firstName, lastName: lastName.join(' ') }
}

export default async function AccountProfilePage() {
  const user = await requireUser('/cuenta/perfil')
  const profile = await getProfile(user.id)
  const fallbackName = getNameParts(user.name)
  const initialValues = {
    firstName: profile?.firstName ?? fallbackName.firstName,
    lastName: profile?.lastName ?? fallbackName.lastName,
    phone: profile?.phone ?? '',
    countryCode: profile?.countryCode ?? '',
  }

  return <main className="account-content-page">
    <section className="account-content-card" aria-labelledby="profile-title">
      <p className="eyebrow">Mi perfil</p>
      <h1 id="profile-title">Información <em>personal.</em></h1>
      <p>Estos datos te ayudarán a completar futuras reservas con mayor rapidez.</p>
      <div className="account-readonly-email"><span>Correo electrónico</span><strong>{user.email}</strong><small>El correo pertenece a tu cuenta y no se puede cambiar desde aquí.</small></div>
      <ProfileForm initialValues={initialValues} />
    </section>
  </main>
}
