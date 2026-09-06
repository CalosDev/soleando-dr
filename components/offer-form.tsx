'use client'

import { FormEvent, useState } from 'react'
import { createOffer, updateOffer } from '@/app/actions/offers'
import { useRouter } from 'next/navigation'
import type { Offer } from '@/lib/db/schema'

type Props = { offer?: Offer }

export function OfferForm({ offer }: Props) {
  const router = useRouter(); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(''); const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries()); const input = { ...payload, featured: form.get('featured') === 'on', status: form.get('status') || 'draft' }
    const result = await (offer ? updateOffer(offer.id, input) : createOffer(input)).catch(() => null)
    if (!result) setError('Revisa los campos e inténtalo de nuevo.'); else { router.push('/admin'); router.refresh() }
    setLoading(false)
  }
  return <form className="offer-form" onSubmit={submit}>
    <div className="form-grid"><label>Título<input name="title" defaultValue={offer?.title} placeholder="Isla Saona al atardecer" required /></label><label>Destino<input name="destination" defaultValue={offer?.destination} placeholder="Bayahibe, República Dominicana" required /></label><label>Categoría<select name="category" defaultValue={offer?.category || 'Excursiones'}><option>Excursiones</option><option>Viajes</option><option>Resorts</option><option>Cruceros</option></select></label><label>Precio<input name="price" defaultValue={offer?.price || ''} placeholder="129" inputMode="decimal" /></label><label>Moneda<select name="currency" defaultValue={offer?.currency || 'USD'}><option>USD</option><option>DOP</option><option>EUR</option></select></label><label>Fecha o duración<input name="dateLabel" defaultValue={offer?.dateLabel || ''} placeholder="Día completo · Grupos pequeños" /></label></div>
    <label>Descripción<textarea name="description" defaultValue={offer?.description} rows={4} placeholder="Cuenta qué hace especial esta experiencia…" required /></label><label>Incluye <span className="field-hint">separa cada elemento con comas</span><input name="includes" defaultValue={offer?.includes?.join(', ')} placeholder="Transporte, almuerzo, guía local" /></label><label>URL de imagen<input name="imageUrl" defaultValue={offer?.imageUrl} type="url" placeholder="https://… o /soleando-beach.png" required /></label><label>Instagram (opcional)<input name="instagramUrl" defaultValue={offer?.instagramUrl || ''} type="url" placeholder="https://instagram.com/p/…" /></label><div className="form-options"><label className="checkbox"><input name="featured" type="checkbox" defaultChecked={offer?.featured} /> Destacar en portada</label><label>Estado<select name="status" defaultValue={offer?.status || 'draft'}><option value="draft">Borrador</option><option value="published">Publicada</option><option value="archived">Archivada</option></select></label></div>{error && <p className="form-error">{error}</p>}<button className="button button-sun" disabled={loading}>{loading ? 'Guardando…' : offer ? 'Guardar cambios ↗' : 'Guardar oferta ↗'}</button>
  </form>
}
