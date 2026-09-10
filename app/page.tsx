import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { HeroCinematic } from '@/components/home/hero-cinematic'
import { PopularDestinations } from '@/components/home/popular-destinations'
import { FeaturedHotels } from '@/components/home/featured-hotels'
import { ExperiencesSection } from '@/components/home/experiences-section'
import { CruisesSection } from '@/components/home/cruises-section'
import { ValueBentoGrid } from '@/components/home/value-bento-grid'
import { ComparisonMatrix } from '@/components/home/comparison-matrix'
import { CustomerReviews } from '@/components/home/customer-reviews'
import { FaqSection } from '@/components/home/faq-section'
import { FinalCta } from '@/components/home/final-cta'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-[#fadc40] selection:text-black">
      <SiteHeader variant="transparent" />

      <main className="flex-1">
        <HeroCinematic />
        <PopularDestinations />
        <FeaturedHotels />
        <ExperiencesSection />
        <CruisesSection />
        <ValueBentoGrid />
        <CustomerReviews />
        <FaqSection />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  )
}
