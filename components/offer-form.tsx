'use client'

import { FormEvent, useState } from 'react'
import { createOffer, updateOffer } from '@/app/actions/offers'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { ArrowUpRightIcon } from '@/components/icons'
import type { Offer } from '@/lib/db/schema'
import { sileo } from 'sileo'

type Props = { offer?: Offer }

export function OfferForm({ offer }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
  const [featured, setFeatured] = useState(offer?.featured ?? true)
  const [status, setStatus] = useState(offer?.status || 'published')

  // Dropzone upload state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, etc.).')
      sileo.error({ title: 'Error', description: 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, etc.).' })
      return
    }

    setUploadingImage(true)
    setError('')

    // Fallback reader
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result)
      }
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setImageUrl(data.url)
      } else {
        reader.readAsDataURL(file)
      }
    } catch {
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
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
      featured,
      status,
    }

    const result = await (offer ? updateOffer(offer.id, input) : createOffer(input)).catch((e) => {
      console.error(e)
      return null
    })

    if (!result) {
      setError('Revisa los campos e inténtalo de nuevo.')
      sileo.error({ title: 'Error', description: 'Revisa los campos e inténtalo de nuevo.' })
    } else {
      sileo.success({ title: 'Guardado', description: 'La oferta fue guardada exitosamente.' })
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  return (
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

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              Imagen de la oferta *
            </label>
            <span
              style={{
                fontSize: '11px',
                color: '#ea580c',
                background: 'rgba(254, 243, 199, 0.5)',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid #fde68a',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
              </svg>
              Sugerido: 4:5 vertical (1080 × 1350 px)
            </span>
          </div>
          <input type="hidden" name="imageUrl" value={imageUrl} required />

          {imageUrl ? (
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1.5px solid var(--line)',
                background: '#ffffff',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '96px',
                  aspectRatio: '4 / 5',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#f3f0ea',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src={imageUrl}
                  alt="Vista previa de la oferta"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    {uploadingImage ? 'Subiendo imagen...' : 'Imagen seleccionada'}
                  </strong>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: '#f3f0ea',
                      color: 'var(--muted)',
                    }}
                  >
                    4:5
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '10px' }}>
                  Se mostrará en proporción vertical 4:5 en el carrusel de inicio y catálogo público.
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <label
                    style={{
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      border: '1px solid var(--line)',
                      background: 'var(--paper)',
                      color: 'var(--ink)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    Cambiar foto
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    style={{
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      border: '1px solid #fed7aa',
                      background: '#fff7ed',
                      color: 'var(--coral)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <X style={{ width: '12px', height: '12px' }} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('offer-image-input')?.click()}
              style={{
                border: isDragging ? '2px dashed #f64d0b' : '2px dashed #d6d1c9',
                borderRadius: '16px',
                padding: '32px 20px',
                textAlign: 'center',
                background: isDragging ? 'rgba(254, 242, 242, 0.7)' : '#faf8f5',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                id="offer-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
                }}
              />
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(246, 77, 11, 0.1)',
                  color: 'var(--coral)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                {uploadingImage ? (
                  <Loader2 style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <UploadCloud style={{ width: '24px', height: '24px' }} />
                )}
              </div>
              <strong style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '3px' }}>
                {isDragging ? '¡Suelta tu imagen aquí!' : 'Arrastra y suelta tu imagen aquí'}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '10px' }}>
                o haz clic para explorar en tus archivos (JPG, PNG, WEBP)
              </span>
              
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: '#f1eee7',
                  color: '#655e54',
                  fontSize: '11px',
                  fontWeight: 500,
                  border: '1px solid #e3ded6',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
                </svg>
                <span>Proporción recomendada: <strong>4:5 vertical</strong> (ej. 1080 × 1350 px)</span>
              </div>
            </div>
          )}
        </div>


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

        <button className="button button-sun inline-flex items-center gap-1.5" disabled={loading}>
          {loading ? 'Guardando…' : offer ? 'Guardar cambios' : 'Guardar oferta'}
          {!loading && <ArrowUpRightIcon className="w-3.5 h-3.5" />}
        </button>
      </form>
  )
}
