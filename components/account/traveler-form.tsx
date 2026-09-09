'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTravelerAction, updateTravelerAction } from '@/features/travelers/actions'
import { countries } from '@/lib/countries'

type TravelerFormProps = {
  traveler?: { id: string; firstName: string; lastName: string; dateOfBirth: string | null; nationalityCode: string | null }
}

export function TravelerForm({ traveler }: TravelerFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = Boolean(traveler)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    const formData = new FormData(event.currentTarget)
    const values = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfBirth: formData.get('dateOfBirth'),
      nationalityCode: formData.get('nationalityCode'),
    }
    setIsSaving(true)
    const result = traveler ? await updateTravelerAction(traveler.id, values) : await createTravelerAction(values)
    setIsSaving(false)
    if (!result.ok) {
      setError(result.error)
      setFieldErrors(result.fieldErrors ?? {})
      return
    }
    router.replace('/cuenta/viajeros')
    router.refresh()
  }

  return <form className="account-form" onSubmit={onSubmit} noValidate>
    <div className="account-form-grid">
      <label htmlFor="traveler-first-name">Nombre<input id="traveler-first-name" name="firstName" autoComplete="given-name" defaultValue={traveler?.firstName} disabled={isSaving} required aria-invalid={Boolean(fieldErrors.firstName)} aria-describedby={fieldErrors.firstName ? 'traveler-first-name-error' : undefined} />{fieldErrors.firstName && <small id="traveler-first-name-error" className="account-field-error">{fieldErrors.firstName[0]}</small>}</label>
      <label htmlFor="traveler-last-name">Apellido<input id="traveler-last-name" name="lastName" autoComplete="family-name" defaultValue={traveler?.lastName} disabled={isSaving} required aria-invalid={Boolean(fieldErrors.lastName)} aria-describedby={fieldErrors.lastName ? 'traveler-last-name-error' : undefined} />{fieldErrors.lastName && <small id="traveler-last-name-error" className="account-field-error">{fieldErrors.lastName[0]}</small>}</label>
    </div>
    <label htmlFor="traveler-date-of-birth">Fecha de nacimiento <span>Opcional</span><input id="traveler-date-of-birth" name="dateOfBirth" type="date" autoComplete="bday" defaultValue={traveler?.dateOfBirth ?? ''} disabled={isSaving} aria-invalid={Boolean(fieldErrors.dateOfBirth)} aria-describedby={fieldErrors.dateOfBirth ? 'traveler-date-of-birth-error' : undefined} />{fieldErrors.dateOfBirth && <small id="traveler-date-of-birth-error" className="account-field-error">{fieldErrors.dateOfBirth[0]}</small>}</label>
    <label htmlFor="traveler-nationality">Nacionalidad <span>Opcional</span><select id="traveler-nationality" name="nationalityCode" autoComplete="country" defaultValue={traveler?.nationalityCode ?? ''} disabled={isSaving} aria-invalid={Boolean(fieldErrors.nationalityCode)} aria-describedby={fieldErrors.nationalityCode ? 'traveler-nationality-error' : undefined}><option value="">Selecciona una nacionalidad</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select>{fieldErrors.nationalityCode && <small id="traveler-nationality-error" className="account-field-error">{fieldErrors.nationalityCode[0]}</small>}</label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="account-form-actions"><button className="site-button site-button-dark" type="submit" disabled={isSaving}>{isSaving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Guardar viajero'}</button><button className="account-cancel-link" type="button" onClick={() => router.push('/cuenta/viajeros')} disabled={isSaving}>Cancelar</button></div>
  </form>
}
