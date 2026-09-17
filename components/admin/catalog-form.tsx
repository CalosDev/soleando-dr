import Link from 'next/link'

import type { CatalogItem } from '@/lib/db/schema'
import { ImageField } from '@/components/admin/image-field'

const catalogKinds = [
  { value: 'tour', label: 'Tour o paquete' },
  { value: 'excursion_national', label: 'Excursión nacional' },
  { value: 'excursion_international', label: 'Excursión internacional' },
  { value: 'cruise', label: 'Crucero' },
] as const

type FormAction = (formData: FormData) => Promise<void>

function text(content: unknown, key: string): string {
  if (typeof content !== 'object' || content === null) return ''
  const value = (content as Record<string, unknown>)[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const fieldClass = 'mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm font-normal text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#f64d0b] focus:ring-4 focus:ring-[#f64d0b]/10'

export function CatalogForm({ item, action }: { item?: CatalogItem; action: FormAction }) {
  const content = item?.content

  return (
    <form action={action} className="mt-8 space-y-7 rounded-3xl border border-[#ede8e1] bg-white p-5 shadow-sm sm:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-stone-800">Tipo<select name="kind" defaultValue={item?.kind ?? 'excursion_national'} required className={fieldClass}>{catalogKinds.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select></label>
        <label className="text-sm font-semibold text-stone-800">Estado<select name="status" defaultValue={item?.status ?? 'draft'} required className={fieldClass}><option value="draft">Borrador — aún no visible</option><option value="published">Publicado — visible al público</option><option value="archived">Archivado — oculto</option></select></label>
        <label className="text-sm font-semibold text-stone-800">Título<input name="title" defaultValue={text(content, 'title')} minLength={2} maxLength={140} required className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">URL amigable <span className="font-normal text-stone-500">(opcional)</span><input name="slug" defaultValue={item?.slug ?? ''} placeholder="se-crea-a-partir-del-titulo" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Destino o región<input name="destination" defaultValue={text(content, 'destination') || text(content, 'region')} placeholder="Punta Cana" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Categoría, naviera o plan<input name="category" defaultValue={text(content, 'category') || text(content, 'line') || text(content, 'mealPlan')} placeholder="Aventura, Royal Caribbean…" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Duración<input name="duration" defaultValue={text(content, 'duration')} placeholder="Día completo" className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Orden de aparición<input name="sortOrder" type="number" min="0" step="1" defaultValue={item?.sortOrder ?? 0} required className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Precio desde<input name="priceFrom" type="number" min="0" step="0.01" defaultValue={text(content, 'priceFrom')} className={fieldClass} /></label>
        <label className="text-sm font-semibold text-stone-800">Moneda<input name="currency" maxLength={3} defaultValue={text(content, 'currency') || 'USD'} required className={fieldClass} /></label>
      </div>
      <ImageField defaultValue={text(content, 'image')} />
      <label className="block text-sm font-semibold text-stone-800">Etiqueta <span className="font-normal text-stone-500">(opcional)</span><input name="badge" defaultValue={text(content, 'badge')} placeholder="Más solicitada" className={fieldClass} /></label>
      <label className="block text-sm font-semibold text-stone-800">Descripción<textarea name="description" rows={6} defaultValue={text(content, 'description')} minLength={10} maxLength={2000} required className={fieldClass} /></label>
      <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end"><Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 px-5 text-sm font-bold text-stone-700 hover:bg-stone-50" href="/admin">Cancelar</Link><button className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#f64d0b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#e04408]" type="submit">Guardar contenido</button></div>
    </form>
  )
}
