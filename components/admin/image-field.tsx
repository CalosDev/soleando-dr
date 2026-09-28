'use client'

import { useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, Upload } from 'lucide-react'

export function ImageField({ defaultValue = '', name = 'image', label = 'Imagen principal', multiple = false, onUploadingChange }: { defaultValue?: string; name?: string; label?: string; multiple?: boolean; onUploadingChange?: (active: boolean) => void }) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function uploadSelectedFile() {
    const files = Array.from(inputRef.current?.files ?? [])
    if (!files.length || isUploading) return
    if (multiple && value.split(/\r?\n/).filter(Boolean).length + files.length > 10) {
      setError('La galería admite hasta 10 imágenes.'); return
    }
    if (files.some((file) => file.size === 0 || file.size > 5 * 1024 * 1024)) {
      setError('Cada imagen debe pesar entre 1 byte y 5 MB.'); return
    }
    setError(null)
    setIsUploading(true)
    onUploadingChange?.(true)

    try {
      for (const file of files) {
        const data = new FormData()
        data.append('file', file)
        const response = await fetch('/api/upload', { method: 'POST', body: data })
        const result = await response.json() as { url?: string; error?: string }
        if (!response.ok || !result.url) throw new Error(result.error || 'No se pudo cargar la imagen.')
        const uploadedUrl = result.url
        setValue((previous) => multiple ? [previous.trim(), uploadedUrl].filter(Boolean).join('\n') : uploadedUrl)
      }
      if (inputRef.current) inputRef.current.value = ''
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo cargar la imagen.')
    } finally {
      setIsUploading(false)
      onUploadingChange?.(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#f64d0b]"><ImagePlus className="h-5 w-5" /></span>
            <span>JPG, PNG o WebP. Máximo 5 MB.</span>
          </div>
          <div className="flex gap-2">
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} disabled={isUploading} className="sr-only" id={inputId} />
            <label htmlFor={inputId} className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Elegir archivo{multiple ? 's' : ''}</label>
            <button type="button" onClick={uploadSelectedFile} disabled={isUploading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f64d0b] px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e04408] disabled:cursor-not-allowed disabled:opacity-60">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {isUploading ? 'Subiendo…' : 'Subir'}
            </button>
          </div>
        </div>
      </div>
      <label className="block text-sm font-semibold text-stone-800">
        {label}
        {multiple ? <textarea name={name} rows={4} value={value} onChange={(event) => setValue(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-3.5 py-3 text-sm font-normal outline-none focus:border-[#f64d0b]" /> : <input name={name} type="text" required value={value} onChange={(event) => setValue(event.target.value)} placeholder="Sube una imagen o usa una ruta local" className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-[#f64d0b] focus:ring-4 focus:ring-[#f64d0b]/10" />}
      </label>
      {value && <div className={multiple ? 'grid grid-cols-2 gap-3 sm:grid-cols-4' : ''}>{value.split(/\r?\n/).filter(Boolean).slice(0, multiple ? 10 : 1).map((src, index) => <img key={`${src}-${index}`} src={src} alt={`Vista previa ${index + 1}`} loading="lazy" className="aspect-[16/9] w-full max-w-md rounded-2xl border border-stone-200 object-cover" />)}</div>}
      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  )
}
