'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Upload } from 'lucide-react'

export function ImageField({ defaultValue = '' }: { defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function uploadSelectedFile() {
    const file = inputRef.current?.files?.[0]
    if (!file) return
    setError(null)
    setIsUploading(true)

    try {
      const data = new FormData()
      data.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: data })
      const result = await response.json() as { url?: string; error?: string }
      if (!response.ok || !result.url) throw new Error(result.error || 'No se pudo cargar la imagen.')
      setValue(result.url)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo cargar la imagen.')
    } finally {
      setIsUploading(false)
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
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="catalog-image-file" />
            <label htmlFor="catalog-image-file" className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Elegir archivo</label>
            <button type="button" onClick={uploadSelectedFile} disabled={isUploading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#f64d0b] px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e04408] disabled:cursor-not-allowed disabled:opacity-60">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {isUploading ? 'Subiendo…' : 'Subir'}
            </button>
          </div>
        </div>
      </div>
      <label className="block text-sm font-semibold text-stone-800">
        URL de imagen
        <input name="image" type="url" required value={value} onChange={(event) => setValue(event.target.value)} placeholder="https://… o una imagen subida" className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-[#f64d0b] focus:ring-4 focus:ring-[#f64d0b]/10" />
      </label>
      {value && <img src={value} alt="Vista previa de la imagen seleccionada" className="aspect-[16/9] w-full max-w-md rounded-2xl border border-stone-200 object-cover" />}
      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  )
}
