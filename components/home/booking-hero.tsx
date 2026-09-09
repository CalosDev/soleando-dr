import Image from 'next/image'
import { HotelSearchForm } from '@/components/home/hotel-search-form'

export function BookingHero() {
  return (
    <section className="booking-hero" aria-labelledby="home-title">
      <Image src="/soleando-hero.webp" alt="Costa tropical de República Dominicana" fill priority sizes="100vw" className="booking-hero-image" />
      <div className="booking-hero-overlay" />
      <div className="booking-hero-content">
        <p className="hero-kicker">Soleando · República Dominicana</p>
        <h1 id="home-title">Tu próximo viaje empieza aquí.</h1>
        <p>Encuentra hoteles y experiencias para disfrutar República Dominicana y el Caribe con Soleando.</p>
        <HotelSearchForm />
      </div>
    </section>
  )
}
