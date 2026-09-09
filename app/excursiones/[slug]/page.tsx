import { permanentRedirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ExcursionSlugPageRedirect({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/experiencias/${slug}`)
}
