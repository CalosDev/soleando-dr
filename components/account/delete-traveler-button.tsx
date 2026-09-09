'use client'

import { useState, useTransition } from 'react'
import { deleteTravelerAction } from '@/features/travelers/actions'
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react'

interface DeleteTravelerButtonProps {
  travelerId: string
  travelerName: string
}

export function DeleteTravelerButton({ travelerId, travelerName }: DeleteTravelerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleDelete() {
    setErrorMessage(null)
    startTransition(async () => {
      const res = await deleteTravelerAction(travelerId)
      if (!res.success) {
        setErrorMessage(res.error || 'No se pudo eliminar el viajero.')
      } else {
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        aria-label={`Eliminar a ${travelerName}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Eliminar</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#ede8e1] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 id="delete-dialog-title" className="text-lg font-bold text-stone-900">
                ¿Eliminar a {travelerName}?
              </h3>
              <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
                Esta persona se eliminará de tus viajeros guardados. No podrás seleccionarla de forma automática en futuras reservas.
              </p>
            </div>

            {errorMessage && (
              <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Eliminando…</span>
                  </>
                ) : (
                  <span>Eliminar viajero</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
