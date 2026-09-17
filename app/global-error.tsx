'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error('Global application error', error)
  }, [error])

  return (
    <html lang="es">
      <body style={{ margin: 0, background: '#fdfbf7', color: '#1c1917', fontFamily: 'Arial, sans-serif' }}>
        <main style={{ display: 'grid', minHeight: '100vh', placeItems: 'center', padding: '24px' }}>
          <section style={{ width: '100%', maxWidth: '560px', border: '1px solid #ede8e1', borderRadius: '24px', background: '#fff', padding: '40px', textAlign: 'center', boxShadow: '0 8px 30px rgba(28,25,23,0.08)' }}>
            <p style={{ margin: 0, color: '#f64d0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Soleando DR</p>
            <h1 style={{ margin: '14px 0 0', fontSize: '30px' }}>Algo no salió como esperábamos</h1>
            <p style={{ margin: '14px 0 0', color: '#57534e', lineHeight: 1.6 }}>Estamos trabajando para que puedas continuar. Intenta cargar de nuevo.</p>
            <button type="button" onClick={retry} style={{ marginTop: '26px', minHeight: '44px', border: 0, borderRadius: '12px', background: '#f64d0b', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 700, padding: '0 20px' }}>Intentar otra vez</button>
          </section>
        </main>
      </body>
    </html>
  )
}
