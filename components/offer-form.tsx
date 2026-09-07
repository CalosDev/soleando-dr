'use client'

import { FormEvent, useState } from 'react'
import { createOffer, updateOffer } from '@/app/actions/offers'
import { parseInstagramPost } from '@/app/actions/instagram'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Offer } from '@/lib/db/schema'

type Props = { offer?: Offer }

export function OfferForm({ offer }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const [needsCaption, setNeedsCaption] = useState(false)
  const [manualCaption, setManualCaption] = useState('')

  // Form states
  const [title, setTitle] = useState(offer?.title || '')
  const [destination, setDestination] = useState(offer?.destination || '')
  const [category, setCategory] = useState(offer?.category || 'Excursiones')
  const [price, setPrice] = useState(offer?.price || '')
  const [currency, setCurrency] = useState(offer?.currency || 'USD')
  const [dateLabel, setDateLabel] = useState(offer?.dateLabel || '')
  const [description, setDescription] = useState(offer?.description || '')
  const [includes, setIncludes] = useState(offer?.includes?.join(', ') || '')
  const [imageUrl, setImageUrl] = useState(offer?.imageUrl || '')
  const [instagramUrl, setInstagramUrl] = useState(offer?.instagramUrl || '')
  const [featured, setFeatured] = useState(offer?.featured ?? true)
  const [status, setStatus] = useState(offer?.status || 'published')

  function applyData(d: {
    title: string; destination: string; category: string; price: string; currency: string;
    dateLabel: string; description: string; includes: string; imageUrl: string; instagramUrl: string;
    featured: boolean; status: string;
  }) {
    if (d.title) setTitle(d.title)
    if (d.destination) setDestination(d.destination)
    if (d.category) setCategory(d.category)
    if (d.price) setPrice(d.price)
    if (d.currency) setCurrency(d.currency)
    if (d.dateLabel) setDateLabel(d.dateLabel)
    if (d.description) setDescription(d.description)
    if (d.includes) setIncludes(d.includes)
    if (d.imageUrl) setImageUrl(d.imageUrl)
    setInstagramUrl(d.instagramUrl || importUrl)
    setFeatured(d.featured ?? true)
    setStatus(d.status || 'published')
  }

  async function handleImportInstagram() {
    if (!importUrl.trim()) {
      setError('Pega un enlace de Instagram primero.')
      return
    }
    setImporting(true)
    setError('')
    setImportSuccess('')
    setNeedsCaption(false)

    const res = await parseInstagramPost(importUrl)
    if (!res.ok) {
      setError(res.error || 'No se pudo leer el post de Instagram.')
      setImporting(false)
      return
    }

    if (res.data) applyData(res.data as Parameters<typeof applyData>[0])

    if (res.needsCaption) {
      setNeedsCaption(true)
      setImportSuccess('✅ Imagen importada. Ahora pega el caption del post de Instagram abajo para completar el resto de los campos.')
    } else {
      setImportSuccess('¡Datos de la publicación importados exitosamente! Revisa y pulsa Guardar.')
    }
    setImporting(false)
  }

  async function handleApplyCaption() {
    if (!manualCaption.trim()) return
    setImporting(true)
    setError('')

    const res = await parseInstagramPost(importUrl, manualCaption)
    if (res.ok && res.data) {
      applyData(res.data as Parameters<typeof applyData>[0])
      setNeedsCaption(false)
      setManualCaption('')
      setImportSuccess('¡Datos completos importados desde Instagram! Revisa y pulsa Guardar.')
    } else {
      setError(res.error || 'Error al procesar el caption.')
    }
    setImporting(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const input = {
      title,
      destination,
      category,
      price: price || undefined,
      currency,
      dateLabel: dateLabel || undefined,
      description,
      includes,
      imageUrl,
      instagramUrl: instagramUrl || undefined,
      featured,
      status,
    }

    const result = await (offer ? updateOffer(offer.id, input) : createOffer(input)).catch((e) => {
      console.error(e)
      return null
    })

    if (!result) {
      setError('Revisa los campos e inténtalo de nuevo.')
    } else {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Importador de Instagram */}
      <div
        style={{
          background: '#fff',
          border: '1px solid var(--sun)',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ⚡ Importar automáticamente desde Instagram
          </strong>
          <span style={{ fontSize: '10px', background: 'var(--coral)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Nuevo
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 14px' }}>
          Pega el link de cualquier post de Instagram y completaremos el formulario por ti.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="url"
            placeholder="https://www.instagram.com/p/..."
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            style={{
              flex: 1,
              minWidth: '280px',
              padding: '12px 14px',
              border: '1px solid var(--line)',
              background: 'transparent',
              fontSize: '14px',
            }}
          />
          <button
            type="button"
            onClick={handleImportInstagram}
            disabled={importing}
            className="button button-sun"
            style={{ cursor: 'pointer', border: 'none', opacity: importing ? 0.7 : 1 }}
          >
            {importing ? '⏳ Extrayendo…' : 'Autocompletar con Instagram 🪄'}
          </button>
        </div>

        {/* Error mensaje justo debajo del importador */}
        {error && !needsCaption && (
          <p style={{ color: '#c0392b', fontSize: '13px', margin: '10px 0 0', fontWeight: 500, background: '#fdf2f0', padding: '10px 14px', borderLeft: '3px solid #c0392b' }}>
            ⚠ {error}
          </p>
        )}

        {/* Success */}
        {importSuccess && (
          <p style={{ color: '#2d7a36', fontSize: '13px', margin: '12px 0 0', fontWeight: 500 }}>
            {importSuccess}
          </p>
        )}

        {/* Caption manual step */}
        {needsCaption && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fffbf0', border: '1px solid #f0c040', borderRadius: '6px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 8px', color: '#7a5900' }}>
              📋 Paso 2: Pega el caption del post de Instagram
            </p>
            <p style={{ fontSize: '12px', color: '#7a5900', margin: '0 0 10px' }}>
              Abre el post en Instagram, copia el texto de la publicación y pégalo aquí. Lo analizaremos automáticamente para completar título, precio, fechas y más.
            </p>
            <textarea
              rows={5}
              placeholder="Pega aquí el texto completo del post de Instagram..."
              value={manualCaption}
              onChange={(e) => setManualCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #f0c040',
                background: '#fff',
                fontSize: '13px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={handleApplyCaption}
              disabled={importing || !manualCaption.trim()}
              className="button button-sun"
              style={{ marginTop: '10px', cursor: 'pointer', border: 'none', fontSize: '13px' }}
            >
              {importing ? '⏳ Procesando…' : 'Analizar caption 🔍'}
            </button>
          </div>
        )}
      </div>

      <form className="offer-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Título
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Isla Saona al atardecer"
              required
            />
          </label>
          <label>
            Destino
            <input
              name="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Bayahibe, República Dominicana"
              required
            />
          </label>
          <label>
            Categoría
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Excursiones">Excursiones</option>
              <option value="Viajes">Viajes</option>
              <option value="Resorts">Resorts</option>
              <option value="Cruceros">Cruceros</option>
            </select>
          </label>
          <label>
            Precio (por persona)
            <input
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="129"
              inputMode="decimal"
            />
          </label>
          <label>
            Moneda
            <select
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="DOP">DOP (RD$)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>
          <label>
            Fecha o duración
            <input
              name="dateLabel"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="Día completo · Grupos pequeños"
            />
          </label>
        </div>

        <label>
          Descripción
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Cuenta qué hace especial esta experiencia…"
            required
          />
        </label>

        <label>
          Incluye <span className="field-hint">separa cada elemento con comas</span>
          <input
            name="includes"
            value={includes}
            onChange={(e) => setIncludes(e.target.value)}
            placeholder="Transporte, almuerzo, guía local"
          />
        </label>

        <label>
          URL de imagen
          <input
            name="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            type="text"
            placeholder="https://… o /soleando-peru.jpg"
            required
          />
        </label>

        {imageUrl && (
          <div style={{ position: 'relative', width: '180px', height: '180px', overflow: 'hidden', border: '1px solid var(--line)', background: '#f3f0ea' }}>
            <Image src={imageUrl} alt="Vista previa" fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
        )}


        <label>
          Instagram (opcional)
          <input
            name="instagramUrl"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            type="url"
            placeholder="https://instagram.com/p/…"
          />
        </label>

        <div className="form-options">
          <label className="checkbox">
            <input
              name="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />{' '}
            Destacar en portada
          </label>
          <label>
            Estado
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicada</option>
              <option value="archived">Archivada</option>
            </select>
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="button button-sun" disabled={loading}>
          {loading ? 'Guardando…' : offer ? 'Guardar cambios ↗' : 'Guardar oferta ↗'}
        </button>
      </form>
    </div>
  )
}
