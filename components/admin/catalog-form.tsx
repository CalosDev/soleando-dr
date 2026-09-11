import type { CatalogItem } from '@/lib/db/schema'

const catalogKinds = [
  { value: 'tour', label: 'Tour' },
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

export function CatalogForm({ item, action }: { item?: CatalogItem; action: FormAction }) {
  const content = item?.content
  const title = text(content, 'title')

  return (
    <form action={action} className="admin-form">
      <div className="admin-form-grid">
        <label>
          Tipo
          <select name="kind" defaultValue={item?.kind ?? 'excursion_national'} required>
            {catalogKinds.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
          </select>
        </label>
        <label>
          Estado
          <select name="status" defaultValue={item?.status ?? 'draft'} required>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </label>
        <label>
          Título
          <input name="title" defaultValue={title} minLength={2} required />
        </label>
        <label>
          Slug (opcional)
          <input name="slug" defaultValue={item?.slug ?? ''} placeholder="se-crea-a-partir-del-titulo" />
        </label>
        <label>
          Destino / región
          <input name="destination" defaultValue={text(content, 'destination') || text(content, 'region')} placeholder="Punta Cana" />
        </label>
        <label>
          Categoría / naviera / plan
          <input name="category" defaultValue={text(content, 'category') || text(content, 'line') || text(content, 'mealPlan')} placeholder="Aventura, Royal Caribbean..." />
        </label>
        <label>
          Duración
          <input name="duration" defaultValue={text(content, 'duration')} placeholder="Día completo" />
        </label>
        <label>
          Precio desde
          <input name="priceFrom" type="number" min="0" step="0.01" defaultValue={text(content, 'priceFrom')} />
        </label>
        <label>
          Moneda
          <input name="currency" maxLength={3} defaultValue={text(content, 'currency') || 'USD'} required />
        </label>
        <label>
          Orden de aparición
          <input name="sortOrder" type="number" min="0" step="1" defaultValue={item?.sortOrder ?? 0} required />
        </label>
        <label className="admin-form-full">
          Imagen (ruta local o URL HTTPS)
          <input name="image" type="url" defaultValue={text(content, 'image')} placeholder="/mi-imagen.jpg o https://..." required />
        </label>
        <label className="admin-form-full">
          Etiqueta (opcional)
          <input name="badge" defaultValue={text(content, 'badge')} placeholder="Más solicitada" />
        </label>
        <label className="admin-form-full">
          Descripción
          <textarea name="description" rows={6} defaultValue={text(content, 'description')} minLength={10} required />
        </label>
      </div>
      <div className="admin-form-actions">
        <a className="button button-ghost" href="/admin">Cancelar</a>
        <button className="button button-sun" type="submit">Guardar cambios</button>
      </div>
    </form>
  )
}
