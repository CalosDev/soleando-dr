'use client'

import { useActionState, useCallback, useState } from 'react'
import Link from 'next/link'

import type { CatalogItem } from '@/lib/db/schema'
import { ImageField } from '@/components/admin/image-field'
import type { CatalogFormState } from '@/features/catalog/schemas'

const catalogKinds = [
  { value: 'tour', label: 'Tour o paquete' },
  { value: 'excursion_national', label: 'Excursión nacional' },
  { value: 'excursion_international', label: 'Excursión internacional' },
  { value: 'cruise', label: 'Crucero' },
] as const

type FormAction = (previous: CatalogFormState, formData: FormData) => Promise<CatalogFormState>

function text(content: unknown, key: string): string {
  if (typeof content !== 'object' || content === null) return ''
  const value = (content as Record<string, unknown>)[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const fieldClass = 'mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm font-normal text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#f64d0b] focus:ring-4 focus:ring-[#f64d0b]/10'

function listText(content: unknown, key: string): string {
  const value = content && typeof content === 'object' ? (content as Record<string, unknown>)[key] : null
  return typeof value === 'string' ? value : Array.isArray(value) ? value.filter((entry) => typeof entry === 'string').join('\n') : ''
}

function itineraryText(content: unknown): string {
  const value = content && typeof content === 'object' ? (content as Record<string, unknown>).itinerary : null
  return Array.isArray(value) ? value.map((entry) => `${entry.step} | ${entry.title} | ${entry.description}`).join('\n') : ''
}

export function CatalogForm({ item, action }: { item?: CatalogItem; action: FormAction }) {
  const content = item?.content
  const [kind, setKind] = useState(item?.kind ?? 'excursion_national')
  const [uploadCount, setUploadCount] = useState(0)
  const uploading = uploadCount > 0
  const setUploading = useCallback((active: boolean) => setUploadCount((count) => Math.max(0, count + (active ? 1 : -1))), [])
  const [state, formAction, pending] = useActionState(action, null)
  const editableContent = { ...(content && typeof content === 'object' ? content : {}), ...state?.fields }

  return (
    <form action={formAction} className="mt-8 space-y-7 rounded-3xl border border-[#ede8e1] bg-white p-5 shadow-sm sm:p-7">
      <fieldset disabled={pending} className="space-y-7 disabled:opacity-70">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-stone-800">Tipo<select name="kind" value={kind} onChange={(event) => setKind(event.target.value)} required className={fieldClass}>{catalogKinds.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select></label>
        <label className="text-sm font-semibold text-stone-800">Estado<select name="status" defaultValue={state?.fields?.status ?? item?.status ?? 'draft'} required className={fieldClass}><option value="draft">Borrador — aún no visible</option><option value="published">Publicado — visible al público</option><option value="archived">Archivado — oculto</option></select></label>
        <label className="text-sm font-semibold text-stone-800">Título<input name="title" defaultValue={text(editableContent, 'title')} minLength={2} maxLength={140} required className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">URL amigable <span className="font-normal text-stone-500">(opcional)</span><input name="slug" defaultValue={state?.fields?.slug ?? item?.slug ?? ''} placeholder="se-crea-a-partir-del-titulo" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Destino o región<input name="destination" defaultValue={text(editableContent, 'destination') || text(editableContent, 'region')} placeholder="Punta Cana" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Categoría, naviera o plan<input name="category" defaultValue={text(editableContent, 'category') || text(editableContent, 'line') || text(editableContent, 'mealPlan')} placeholder="Aventura, Royal Caribbean…" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Duración<input name="duration" defaultValue={text(editableContent, 'duration')} placeholder="Día completo" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Orden de aparición<input name="sortOrder" type="number" min="0" step="1" defaultValue={state?.fields?.sortOrder ?? item?.sortOrder ?? 0} required className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Precio desde<input name="priceFrom" type="number" min="0" step="0.01" defaultValue={text(editableContent, 'priceFrom')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Moneda<input name="currency" maxLength={3} defaultValue={text(editableContent, 'currency') || 'USD'} required className={fieldClass} /></label>
      </div>
      <ImageField defaultValue={text(editableContent, 'image')} onUploadingChange={setUploading} />
      <label className="block text-sm font-semibold text-stone-800">Etiqueta <span className="font-normal text-stone-500">(opcional)</span><input name="badge" defaultValue={text(editableContent, 'badge')} placeholder="Más solicitada" className={fieldClass} /></label>
      <label className="block text-sm font-semibold text-stone-800">Descripción<textarea name="description" rows={6} defaultValue={text(editableContent, 'description')} minLength={10} maxLength={2000} required className={fieldClass} /></label>
      <ImageField name="gallery" label="Galería (una URL por línea, máximo 10)" multiple defaultValue={listText(editableContent, 'gallery')} onUploadingChange={setUploading} />
      <label className="block text-sm font-semibold text-stone-800">Fechas o frecuencia de salidas<textarea name="departures" rows={2} maxLength={500} defaultValue={text(editableContent, 'departures')} placeholder="Indica únicamente las fechas o frecuencia confirmadas" className={fieldClass} /></label>
      {kind === 'cruise' ? <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-stone-800">Naviera<input name="line" maxLength={100} defaultValue={text(editableContent, 'line')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Puerto de salida<input name="departurePort" maxLength={100} defaultValue={text(editableContent, 'departurePort')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800 md:col-span-2">Ruta (un puerto por línea)<textarea name="cruiseItinerary" rows={5} maxLength={2000} defaultValue={state?.fields?.cruiseItinerary ?? text(content, 'itinerary').split('·').map((part) => part.trim()).join('\n')} className={fieldClass} /></label>
      </div> : <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-stone-800">Modalidad o tamaño del grupo<input name="groupType" maxLength={100} defaultValue={text(editableContent, 'groupType')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Dificultad<input name="difficulty" maxLength={80} defaultValue={text(editableContent, 'difficulty')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Precio aproximado en RD$ (opcional)<input name="priceRD" type="number" min="0" step="0.01" defaultValue={text(editableContent, 'priceRD')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800 md:col-span-2">Itinerario (una etapa por línea)<span className="mt-1 block font-normal text-stone-500">Formato: horario o día | título | descripción</span><textarea name="experienceItinerary" rows={6} maxLength={25000} defaultValue={state?.fields?.experienceItinerary ?? itineraryText(content)} className={fieldClass} /></label>
      </div>}
      <div className="grid gap-5 md:grid-cols-2">{[['included', 'Incluye'], ['notIncluded', 'No incluye'], ['recommendations', 'Recomendaciones']].map(([name, label]) => <label key={name} className="text-sm font-semibold text-stone-800">{label} <span className="font-normal text-stone-500">(un elemento por línea)</span><textarea name={name} rows={4} maxLength={25000} defaultValue={listText(editableContent, name)} className={fieldClass} /></label>)}</div>
      {state?.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{state.error}</p>}
      <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end"><Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 px-5 text-sm font-bold text-stone-700 hover:bg-stone-50" href="/admin">Cancelar</Link><button disabled={pending || uploading} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04408] disabled:opacity-60 disabled:cursor-not-allowed" type="submit">{pending ? 'Guardando…' : uploading ? 'Espera a que terminen las imágenes…' : 'Guardar contenido'}</button></div>
      </fieldset>
    </form>
  )
}
