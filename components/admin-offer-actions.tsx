'use client'

import { archiveOffer, deleteOffer } from '@/app/actions/offers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminOfferActions({ id }: { id: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false)
  async function archive() { setBusy(true); await archiveOffer(id); router.refresh(); setBusy(false) }
  async function remove() { if (!window.confirm('¿Eliminar esta oferta?')) return; setBusy(true); await deleteOffer(id); router.refresh(); setBusy(false) }
  return <div className="admin-actions"><button onClick={archive} disabled={busy}>Archivar</button><button className="danger-action" onClick={remove} disabled={busy}>Eliminar</button></div>
}
