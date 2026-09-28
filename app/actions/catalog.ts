'use server'

import { and, asc, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { buildCatalogContent, parseCatalogForm, type CatalogFormState } from '@/features/catalog/schemas'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { catalogItems, type CatalogItem } from '@/lib/db/schema'

async function requireAdminAction(): Promise<void> {
  try {
    const session = await auth?.api.getSession({ headers: await headers() })
    if (session?.user && (session.user as { role?: string }).role === 'admin') return
  } catch {}

  throw new Error('Unauthorized')
}

function mediaAreSupported(image: string, gallery: string[] = []): boolean {
  return [image, ...gallery].every((value) => {
    if (value.startsWith('/')) return true
    try {
      const url = new URL(value)
      const storage = process.env.SUPABASE_URL && new URL(process.env.SUPABASE_URL)
      return Boolean(storage && url.origin === storage.origin && !url.search && !url.hash && !url.username && !url.password && url.pathname.startsWith('/storage/v1/object/public/soleando-media/'))
    } catch { return false }
  })
}

function saveError(error: unknown): { error: string } {
  const cause = error as { code?: string; cause?: { code?: string } }
  if ((cause.cause?.code ?? cause.code) === '23505') return { error: 'Ya existe contenido de este tipo con esa URL amigable. Usa otra.' }
  console.error('Catalog save failed', cause.cause?.code ?? cause.code ?? 'unknown')
  return { error: 'No pudimos guardar el contenido. Tus campos siguen aquí; intenta nuevamente.' }
}

function revalidateCatalog(): void {
  revalidatePath('/')
  revalidatePath('/experiencias')
  revalidatePath('/excursiones')
  revalidatePath('/cruceros')
  revalidatePath('/hoteles')
  revalidatePath('/admin')
  revalidatePath('/experiencias/[slug]', 'page')
  revalidatePath('/excursiones/[slug]', 'page')
  revalidatePath('/cruceros/[id]', 'page')
  revalidatePath('/sitemap.xml')
}

export async function getAdminCatalogItems(): Promise<CatalogItem[]> {
  await requireAdminAction()
  if (!db) return []

  return db.select().from(catalogItems).orderBy(asc(catalogItems.kind), asc(catalogItems.sortOrder), desc(catalogItems.updatedAt))
}

export async function getAdminCatalogItem(id: string): Promise<CatalogItem | null> {
  await requireAdminAction()
  if (!db) return null

  const [item] = await db.select().from(catalogItems).where(eq(catalogItems.id, id))
  return item ?? null
}

export async function createCatalogItem(formData: FormData): Promise<{ error: string } | void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  const parsed = parseCatalogForm(formData)
  if (!parsed.success) return { error: `Revisa ${parsed.error.issues[0].path.join('.')}: ${parsed.error.issues[0].message}` }
  const values = parsed.data
  if (!mediaAreSupported(values.image, values.gallery)) return { error: 'Sube las imágenes a Supabase desde este formulario o usa una ruta de imagen local.' }
  const id = `catalog-${crypto.randomUUID()}`
  const content = buildCatalogContent(values, id)
  if (!content.slug) return { error: 'El título o la URL deben contener letras o números.' }

  try { await db.insert(catalogItems).values({
    id,
    kind: values.kind,
    slug: String(content.slug),
    content,
    status: values.status,
    sortOrder: values.sortOrder,
  }) } catch (error) { return saveError(error) }

  revalidateCatalog()
  redirect('/admin')
}

export async function updateCatalogItem(id: string, formData: FormData): Promise<{ error: string } | void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  const parsed = parseCatalogForm(formData)
  if (!parsed.success) return { error: `Revisa ${parsed.error.issues[0].path.join('.')}: ${parsed.error.issues[0].message}` }
  const values = parsed.data
  if (!mediaAreSupported(values.image, values.gallery)) return { error: 'Sube las imágenes a Supabase desde este formulario o usa una ruta de imagen local.' }
  const [current] = await db.select({ content: catalogItems.content }).from(catalogItems).where(eq(catalogItems.id, id))
  if (!current) throw new Error('El contenido no existe.')
  const content = buildCatalogContent(values, id, current.content)
  if (!content.slug) return { error: 'El título o la URL deben contener letras o números.' }

  try { await db.update(catalogItems)
    .set({ kind: values.kind, slug: String(content.slug), content, status: values.status, sortOrder: values.sortOrder, updatedAt: new Date() })
    .where(eq(catalogItems.id, id)) } catch (error) { return saveError(error) }

  revalidateCatalog()
  redirect('/admin')
}

// Stateful wrappers retain the existing action contract and native form support.
export async function createCatalogItemState(_previous: CatalogFormState, data: FormData): Promise<CatalogFormState> {
  const result = await createCatalogItem(data)
  return result ? { ...result, fields: Object.fromEntries(Array.from(data).filter(([key, value]) => !key.startsWith('$ACTION') && typeof value === 'string')) as Record<string, string> } : null
}

export async function updateCatalogItemState(id: string, _previous: CatalogFormState, data: FormData): Promise<CatalogFormState> {
  const result = await updateCatalogItem(id, data)
  return result ? { ...result, fields: Object.fromEntries(Array.from(data).filter(([key, value]) => !key.startsWith('$ACTION') && typeof value === 'string')) as Record<string, string> } : null
}

export async function archiveCatalogItem(id: string): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  await db.update(catalogItems).set({ status: 'archived', updatedAt: new Date() }).where(eq(catalogItems.id, id))
  revalidateCatalog()
}

export async function deleteCatalogItem(id: string): Promise<void> {
  await requireAdminAction()
  if (!db) throw new Error('El catálogo no está disponible.')

  await db.delete(catalogItems).where(and(eq(catalogItems.id, id)))
  revalidateCatalog()
}
