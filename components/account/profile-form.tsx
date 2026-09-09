'use client'

import { FormEvent, useState } from 'react'
import { updateProfileAction } from '@/features/profile/actions'
import { countries } from '@/lib/countries'

type ProfileFormProps = {
  initialValues: { firstName: string; lastName: string; phone: string; countryCode: string }
}

export function ProfileForm({ initialValues }: ProfileFormProps) {
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSuccess('')
    const formData = new FormData(event.currentTarget)
    setIsSaving(true)
    const result = await updateProfileAction({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      countryCode: formData.get('countryCode'),
    })
    setIsSaving(false)
    if (!result.ok) {
      setError(result.error)
      setFieldErrors(result.fieldErrors ?? {})
      return
    }
    setSuccess('Tus datos se guardaron correctamente.')
  }

  return <form className="account-form" onSubmit={onSubmit} noValidate>
    <div className="account-form-grid">
      <label htmlFor="profile-first-name">Nombre<input id="profile-first-name" name="firstName" autoComplete="given-name" defaultValue={initialValues.firstName} disabled={isSaving} required aria-invalid={Boolean(fieldErrors.firstName)} aria-describedby={fieldErrors.firstName ? 'profile-first-name-error' : undefined} />{fieldErrors.firstName && <small id="profile-first-name-error" className="account-field-error">{fieldErrors.firstName[0]}</small>}</label>
      <label htmlFor="profile-last-name">Apellido<input id="profile-last-name" name="lastName" autoComplete="family-name" defaultValue={initialValues.lastName} disabled={isSaving} required aria-invalid={Boolean(fieldErrors.lastName)} aria-describedby={fieldErrors.lastName ? 'profile-last-name-error' : undefined} />{fieldErrors.lastName && <small id="profile-last-name-error" className="account-field-error">{fieldErrors.lastName[0]}</small>}</label>
    </div>
    <label htmlFor="profile-phone">Teléfono <span>Opcional</span><input id="profile-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={initialValues.phone} disabled={isSaving} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'profile-phone-error' : undefined} />{fieldErrors.phone && <small id="profile-phone-error" className="account-field-error">{fieldErrors.phone[0]}</small>}</label>
    <label htmlFor="profile-country">País de residencia <span>Opcional</span><select id="profile-country" name="countryCode" autoComplete="country" defaultValue={initialValues.countryCode} disabled={isSaving} aria-invalid={Boolean(fieldErrors.countryCode)} aria-describedby={fieldErrors.countryCode ? 'profile-country-error' : undefined}><option value="">Selecciona un país</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select>{fieldErrors.countryCode && <small id="profile-country-error" className="account-field-error">{fieldErrors.countryCode[0]}</small>}</label>
    {error && <p className="form-error" role="alert">{error}</p>}
    {success && <p className="account-form-success" role="status">{success}</p>}
    <button className="site-button site-button-dark" type="submit" disabled={isSaving}>{isSaving ? 'Guardando…' : 'Guardar cambios'}</button>
  </form>
}
