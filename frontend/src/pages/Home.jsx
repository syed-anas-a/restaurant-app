import { Link } from 'react-router-dom'

const HERO_IMG =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80'
const SPICE_IMG =
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80'
const MORTAR_IMG =
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80'
const JARS_IMG =
  'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&q=80'
const DINING_IMG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'

function Home() {
  return (
    <div>
      {/* ═══════ Hero ═══════ */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left — copy */}
        <div className="flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0 z-10">
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-text-primary">
            A<br />
            Heritage<br />
            of<br />
            <em className="text-gold">Saffron &amp; Soul</em>
          </h1>

          <p className="mt-8 max-w-md text-text-secondary leading-relaxed">
            Discover a tapestry of flavors curated through generations.
            Every dish is a legacy, every spice a story, and every moment
            an invitation to the extraordinary.
          </p>

          <Link
            to="/menu"
            className="mt-8 self-start bg-gold text-gold-text font-medium text-sm tracking-wide px-7 py-3 rounded-md hover:bg-gold-dark transition-colors"
          >
            Explore the Menu
          </Link>
        </div>

        {/* Right — image */}
        <div className="hidden lg:block relative">
          <img
            src={HERO_IMG}
            alt="Signature dish"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient fade into the dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
        </div>
      </section>

      {/* ═══════ Spices & Spirits ═══════ */}
      <section className="border-t border-dark-border py-20 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-lg mb-12">
          <h2 className="font-display text-3xl text-gold italic mb-4">
            Curated Spirits &amp; Ancient Spices
          </h2>
          <p className="text-text-secondary leading-relaxed">
            From the high mountains of Kashmir to the coast of Malabar,
            we source only the singular best.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[SPICE_IMG, MORTAR_IMG, JARS_IMG].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg aspect-[4/3]">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Dining Atmosphere ═══════ */}
      <section className="bg-teal">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="h-80 lg:h-auto">
            <img
              src={DINING_IMG}
              alt="Restaurant interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
            <h2 className="font-display text-3xl text-gold italic mb-6">
              A Symphony of Atmosphere
            </h2>
            <p className="text-text-primary/80 leading-relaxed mb-4">
              Step into a sanctuary where time slows down. Our interiors are
              designed as a dialogue between modern luxury and ancient Indian
              heritage, featuring hand-carved stone and warm amber lighting
              that cradles your experience.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Every detail — from the handwoven table linen to the brass
              lanterns above — is chosen to honour a tradition of hospitality
              that stretches back centuries.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ CTA Section ═══════ */}
      <section className="border-t border-dark-border py-24 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Menu CTA — actionable */}
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl md:text-4xl text-text-primary italic mb-3">
              Explore Our Menu
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Browse our seasonal menu, place an order for pickup, or simply
              let the flavors find you.
            </p>
            <Link
              to="/menu"
              className="inline-block bg-gold text-gold-text font-medium text-sm tracking-wide px-8 py-3 rounded-md hover:bg-gold-dark transition-colors"
            >
              View Full Menu
            </Link>
          </div>

          {/* Table Booking — coming soon */}
          <div className="text-center md:text-left md:border-l md:border-dark-border md:pl-16">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <h2 className="font-display text-3xl md:text-4xl text-text-muted italic">
                Reserve a Table
              </h2>
              <span className="text-[10px] tracking-widest uppercase text-teal-light bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Online reservations are on their way. For now, call us
              directly and we'll have your table waiting.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
