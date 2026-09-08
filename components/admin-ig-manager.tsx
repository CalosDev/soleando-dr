'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  fetchIgPostPreview,
  saveIgPostAction,
  deleteIgPostAction,
  moveIgPostAction,
} from '@/app/actions/ig-feed'
import type { ManagedIgPost } from '@/lib/ig-feed-store'
import { sileo } from 'sileo'

type Props = {
  initialPosts: ManagedIgPost[]
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6" aria-hidden="true" style={{ display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4-8.2 8.2z" fill="#fff" />
      <path d="M12 0c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm-1.9 16.7l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4-8.2 8.2z" fill="#0095F6" />
    </svg>
  )
}

export function AdminIgManager({ initialPosts }: Props) {
  const [posts, setPosts] = useState<ManagedIgPost[]>(initialPosts)
  const [inputUrl, setInputUrl] = useState('')
  const [loadingFetch, setLoadingFetch] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Draft post loaded from autofill
  const [draftPost, setDraftPost] = useState<ManagedIgPost | null>(null)

  // Step 1: Fetch and autofill
  const handleAutofill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputUrl.trim()) return

    setLoadingFetch(true)
    setError(null)
    setSuccess(null)

    const res = await fetchIgPostPreview(inputUrl)
    setLoadingFetch(false)

    if (!res.ok || !res.data) {
      setError(res.error || 'No se pudo obtener información del enlace.')
      sileo.error({ title: 'Error', description: res.error || 'No se pudo obtener información del enlace.' })
      return
    }

    setDraftPost(res.data)
    setSuccess('¡Datos de Instagram obtenidos con éxito! Revisa la vista previa a continuación.')
    sileo.success({ title: '¡Éxito!', description: 'Datos de Instagram obtenidos con éxito.' })
  }

  // Step 2: Save to carousel
  const handleSaveDraft = async () => {
    if (!draftPost) return

    setLoadingSave(true)
    setError(null)
    setSuccess(null)

    const res = await saveIgPostAction(draftPost)
    setLoadingSave(false)

    if (!res.ok) {
      setError(res.error || 'Error al guardar la publicación.')
      sileo.error({ title: 'Error', description: res.error || 'Error al guardar la publicación.' })
      return
    }

    // Prepend to local state
    setPosts([draftPost, ...posts.filter((p) => p.id !== draftPost.id)])
    setDraftPost(null)
    setInputUrl('')
    setSuccess('🎉 ¡Publicación agregada con éxito en la primera posición del carrusel!')
    sileo.success({ title: '¡Publicado!', description: 'Publicación agregada con éxito al carrusel.' })
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const res = await moveIgPostAction(id, direction)
    if (res.ok) {
      const index = posts.findIndex((p) => p.id === id)
      if (index === -1) return
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= posts.length) return
      const updated = [...posts]
      const [removed] = updated.splice(index, 1)
      updated.splice(newIndex, 0, removed)
      setPosts(updated)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta publicación del carrusel?')) return
    await deleteIgPostAction(id)
    setPosts(posts.filter((p) => p.id !== id))
    sileo.success({ title: 'Eliminado', description: 'La publicación fue removida del carrusel.' })
  }

  return (
    <div style={{ display: 'grid', gap: '36px' }}>
      {/* 1. Import / Autofill Box */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#f64d0b',
              background: '#fff7ed',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '8px',
            }}
          >
            Autocompletado Rápido
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Agregar Reel o Publicación de Instagram
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Pega el enlace de cualquier publicación o Reel público de <strong>@soleandodr</strong>. El sistema extraerá la portada, el texto, la ubicación y el formato automáticamente.
          </p>
        </div>

        <form onSubmit={handleAutofill} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <input
              type="url"
              placeholder="https://www.instagram.com/reel/Dc8wQL-xd8-/ o https://www.instagram.com/p/..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              required
              disabled={loadingFetch}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                background: '#f8fafc',
                transition: 'border-color 0.2s ease',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loadingFetch || !inputUrl.trim()}
            style={{
              padding: '13px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #fadc40 0%, #f8a815 25%, #f87a12 50%, #f64d0b 75%, #ff2e00 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: loadingFetch || !inputUrl.trim() ? 'not-allowed' : 'pointer',
              opacity: loadingFetch || !inputUrl.trim() ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(220,39,67,0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            {loadingFetch ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Extrayendo datos de IG...
              </>
            ) : (
              <>✨ Autocompletar desde Instagram ↗</>
            )}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', border: '1px solid #fecaca' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f0fdf4', color: '#15803d', borderRadius: '8px', fontSize: '13px', border: '1px solid #bbf7d0' }}>
            {success}
          </div>
        )}
      </div>

      {/* 2. Live Preview & Draft Confirmation Area (when autofilled) */}
      {draftPost && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '2px solid #f64d0b',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(246,77,11,0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Left Column: Form to edit extracted fields */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span
                style={{
                  background: draftPost.media_type === 'VIDEO' ? '#fef3c7' : '#e0f2fe',
                  color: draftPost.media_type === 'VIDEO' ? '#b45309' : '#0369a1',
                  fontWeight: 700,
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}
              >
                {draftPost.media_type === 'VIDEO' ? '🎬 Formato Reel (Video)' : '📸 Formato Foto / Post'}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Portada descargada en: <code>{draftPost.media_url}</code>
              </span>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Leyenda / Descripción del Post:
                </label>
                <textarea
                  rows={3}
                  value={draftPost.caption || ''}
                  onChange={(e) => setDraftPost({ ...draftPost, caption: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Ubicación:
                  </label>
                  <input
                    type="text"
                    value={draftPost.location || ''}
                    onChange={(e) => setDraftPost({ ...draftPost, location: e.target.value })}
                    placeholder="Ej: Punta Cana, Rep. Dom."
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Tipo de Publicación:
                  </label>
                  <select
                    value={draftPost.media_type}
                    onChange={(e) =>
                      setDraftPost({
                        ...draftPost,
                        media_type: e.target.value as 'VIDEO' | 'IMAGE',
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#fff',
                    }}
                  >
                    <option value="VIDEO">Reel (Con icono de reproducción)</option>
                    <option value="IMAGE">Post / Foto</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Contador de "Me gusta":
                </label>
                <input
                  type="number"
                  value={draftPost.likesCount || 1200}
                  onChange={(e) => setDraftPost({ ...draftPost, likesCount: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loadingSave}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '8px',
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loadingSave ? 'Publicando...' : '🚀 Guardar y Publicar en el Carrusel ↗'}
                </button>
                <button
                  type="button"
                  onClick={() => setDraftPost(null)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Live Card Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>
              VISTA PREVIA EN VIVO (CARRUSEL):
            </span>
            <div
              style={{
                width: '320px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      padding: '2px',
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #fadc40, #f87a12, #ff2e00)',
                      display: 'flex',
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #fff', overflow: 'hidden', position: 'relative' }}>
                      <Image src="/soleando-hero.png" alt="Avatar" fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>
                      soleandodr <VerifiedBadge />
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{draftPost.location}</span>
                  </div>
                </div>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>•••</span>
              </div>

              {/* Media */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#000' }}>
                <Image
                  src={draftPost.thumbnail_url || draftPost.media_url}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                {draftPost.media_type === 'VIDEO' && (
                  <>
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                      REEL
                    </span>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: '14px', marginLeft: '2px' }}>▶</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions & Caption */}
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                  {(draftPost.likesCount || 1200).toLocaleString('es-DO')} me gusta
                </div>
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
                  <strong>soleandodr</strong> {draftPost.caption?.slice(0, 85)}...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Manage Existing Posts List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Publicaciones en el Carrusel ({posts.length})
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Las <strong>primeras 6</strong> se muestran en la web principal en este orden exacto.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {posts.map((post, idx) => {
            const isVisibleOnWeb = idx < 6
            const isVideo = post.media_type === 'VIDEO'

            return (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: isVisibleOnWeb ? '#ffffff' : '#f8fafc',
                  border: isVisibleOnWeb ? '1.5px solid #e2e8f0' : '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  boxShadow: isVisibleOnWeb ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
                }}
              >
                {/* Position Badge */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isVisibleOnWeb ? '#f64d0b' : '#94a3b8',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  #{idx + 1}
                </div>

                {/* Thumbnail */}
                <div
                  style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#111',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={post.thumbnail_url || post.media_url}
                    alt={post.caption || 'IG post'}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  {isVideo && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '3px',
                        right: '3px',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        fontSize: '8px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                      }}
                    >
                      REEL
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: isVideo ? '#fef3c7' : '#e0f2fe',
                        color: isVideo ? '#b45309' : '#0369a1',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isVideo ? 'Reel' : 'Post'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      📍 {post.location || 'República Dominicana'}
                    </span>
                    {isVisibleOnWeb && (
                      <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                        Visible en Web
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      margin: '0 0 2px 0',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '600px',
                    }}
                  >
                    {post.caption ? post.caption.split('\n')[0] : 'Sin texto'}
                  </p>

                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '11px', color: '#f64d0b', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Ver en Instagram ↗
                  </a>
                </div>

                {/* Reorder Buttons */}
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleMove(post.id, 'up')}
                    disabled={idx === 0}
                    title="Subir posición"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      opacity: idx === 0 ? 0.3 : 1,
                      fontSize: '12px',
                    }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMove(post.id, 'down')}
                    disabled={idx === posts.length - 1}
                    title="Bajar posición"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      cursor: idx === posts.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: idx === posts.length - 1 ? 0.3 : 1,
                      fontSize: '12px',
                    }}
                  >
                    ▼
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    background: '#fff',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Eliminar
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
