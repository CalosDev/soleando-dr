import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { WhatsappIcon, InstagramOutlineIcon, MapPinOutlineIcon, ArrowUpRightIcon } from '@/components/icons'

export function SiteFooter() {
  return (
    <footer className="bg-[#1c1917] text-[#fdfbf7] border-t border-stone-800 content-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800/90">
          {/* Columna 1 & 2: Identidad de Marca */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-block bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm hover:opacity-95 transition-opacity"
              aria-label="Soleando, volver al inicio"
            >
              <Image
                src="/455673599_799977638919739_4642999437038293761_n-removebg-preview.png"
                alt="Soleando Logo"
                width={180}
                height={56}
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-stone-300 max-w-sm leading-relaxed">
              Plataforma de viajes de República Dominicana. Hoteles todo incluido, resorts de lujo, excursiones auténticas y cruceros por el Caribe.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-300 pt-1">
              <MapPinOutlineIcon className="w-4 h-4 text-[#f64d0b] shrink-0" />
              <span>{siteConfig.location}</span>
            </div>
          </div>

          {/* Columna 3: Explorar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
              Explorar
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/hoteles" className="hover:text-[#fadc40] transition-colors">
                  Hoteles & Resorts
                </Link>
              </li>
              <li>
                <Link href="/experiencias" className="hover:text-[#fadc40] transition-colors">
                  Experiencias & Tours
                </Link>
              </li>
              <li>
                <Link href="/cruceros" className="hover:text-[#fadc40] transition-colors">
                  Cruceros por el Caribe
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Empresa */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
              Empresa
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/nosotros" className="hover:text-[#fadc40] transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-[#fadc40] transition-colors">
                  Contacto directo
                </Link>
              </li>
              <li>
                <Link href="/politicas" className="hover:text-[#fadc40] transition-colors">
                  Políticas & Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 5: Conectar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
              Atención & Redes
            </h3>
            <div className="space-y-3 pt-1">
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 hover:text-white transition-all text-xs font-bold shadow-xs group"
              >
                <WhatsappIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Hablar por WhatsApp</span>
                <ArrowUpRightIcon className="w-3 h-3 text-emerald-400" />
              </a>
              <div>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-stone-800 text-stone-300 hover:text-[#fadc40] hover:border-stone-700 transition-colors text-xs font-medium"
                >
                  <InstagramOutlineIcon className="w-4 h-4 text-stone-400" />
                  <span>{siteConfig.instagramHandle}</span>
                  <ArrowUpRightIcon className="w-3 h-3 text-stone-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior de copyright y legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Soleando DR. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <Link href="/politicas#cancelaciones" className="hover:text-stone-200 transition-colors">
              Cancelaciones
            </Link>
            <span>·</span>
            <Link href="/politicas#terminos" className="hover:text-stone-200 transition-colors">
              Términos
            </Link>
            <span>·</span>
            <Link href="/politicas#privacidad" className="hover:text-stone-200 transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
