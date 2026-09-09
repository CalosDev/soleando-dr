import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { BookingHero } from '@/components/home/booking-hero'
import { StatsStrip } from '@/components/home/stats-strip'
import { PopularDestinations } from '@/components/home/popular-destinations'
import { FeaturedHotels } from '@/components/home/featured-hotels'
import { ExperiencesSection } from '@/components/home/experiences-section'
import { CruisesSection } from '@/components/home/cruises-section'
import { ValueBentoGrid } from '@/components/home/value-bento-grid'
import { ComparisonMatrix } from '@/components/home/comparison-matrix'
import { CustomerReviews } from '@/components/home/customer-reviews'
import { FaqSection } from '@/components/home/faq-section'
import { FinalCta } from '@/components/home/final-cta'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-[#fadc40] selection:text-black">
      <SiteHeader variant="solid" />

      <Link
        href="/ofertas"
        className="relative z-30 flex min-h-10 items-center justify-center gap-2 bg-[#fadc40] px-4 py-2 text-center text-xs font-bold text-stone-900 transition-colors hover:bg-[#f6d132] focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-stone-900"
      >
        <span>Nuevas salidas 2027 disponibles</span>
        <span className="inline-flex items-center gap-1 underline underline-offset-2">
          Ver ofertas
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </Link>

      <main className="flex-1">
        <BookingHero />
        <StatsStrip />
        <PopularDestinations />
        <FeaturedHotels />
        <ExperiencesSection />
        <CruisesSection />
        <ValueBentoGrid />
        <ComparisonMatrix />
        <CustomerReviews />
        <FaqSection />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  )
}
