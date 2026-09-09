import Image from 'next/image'

interface MissingOfferImageProps {
  title: string
}

export function MissingOfferImage({ title }: MissingOfferImageProps) {
  return (
    <div
      role="img"
      aria-label={`Imagen de ${title} en actualización`}
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-stone-900 via-stone-800 to-[#513b25] px-6 text-center text-white"
    >
      <div className="rounded-2xl bg-white/95 p-3 shadow-lg">
        <Image
          src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
          alt=""
          width={96}
          height={96}
          className="h-14 w-14 object-contain"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold">Imagen en actualización</p>
        <p className="text-xs leading-relaxed text-white/75">Consulta los detalles de esta experiencia con nuestro equipo.</p>
      </div>
    </div>
  )
}
