import { BookingHero } from '@/components/home/booking-hero'
import { CruisesSection } from '@/components/home/cruises-section'
import { ExperiencesSection } from '@/components/home/experiences-section'
import { FeaturedHotels } from '@/components/home/featured-hotels'
import { FinalCta } from '@/components/home/final-cta'
import { PopularDestinations } from '@/components/home/popular-destinations'
import { WhySoleando } from '@/components/home/why-soleando'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

export default function HomePage() {
  return <><SiteHeader /><main><BookingHero /><PopularDestinations /><FeaturedHotels /><ExperiencesSection /><CruisesSection /><WhySoleando /><FinalCta /></main><SiteFooter /></>
}
