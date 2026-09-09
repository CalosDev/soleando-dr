'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTravelerAction } from '@/features/travelers/actions'

export function DeleteTravelerButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (isConfirming) confirmButtonRef.current?.focus() }, [isConfirming])

  async function removeTraveler() {
    setIsDeleting(true)
    setError('')
    const result = await deleteTravelerAction(id)
    setIsDeleting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  if (!isConfirming) return <button className="account-danger-button" type="button" onClick={() => setIsConfirming(true)}>Eliminar</button>

  return <div className="delete-traveler-confirmation" role="alertdialog" aria-modal="true" aria-label={`Eliminar a ${name}`}>
    <p>¿Eliminar a {name} de tus viajeros guardados?</p>
    <span>Esto elimina a la persona de tus viajeros guardados.</span>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div><button ref={confirmButtonRef} className="account-danger-button" type="button" onClick={removeTraveler} disabled={isDeleting}>{isDeleting ? 'Eliminando…' : 'Sí, eliminar'}</button><button className="account-cancel-link" type="button" onClick={() => setIsConfirming(false)} disabled={isDeleting}>Cancelar</button></div>
  </div>
}
