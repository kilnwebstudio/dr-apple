import { Link } from 'react-router-dom';
import { MapPin, Clock, Truck, Store, ArrowRight } from 'lucide-react';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { categories } from '@/data/categories';
import { useProducts } from '@/hooks/useProducts';
import { siteConfig } from '@/data/siteConfig';
import { usePageMeta } from '@/hooks/usePageMeta';

export function HomePage() {
  usePageMeta(
    'Dr Apple — Gadgets & Accessories in Kano',
    'Shop iPhones, Samsung, Google Pixel, MacBooks, Anker chargers and more at Dr Apple, Rahma Plaza, Farm Center, Kano. Pickup & delivery available.'
  );

  const { products, loading } = useProducts();

  const featured = loading
    ? []
    : products.filter((p) =>
        ['iphone-18', 'iphone-duo', 'macbook-neo', 'samsung-galaxy-s25-ultra', 'google-pixel-9-pro', 'airpods-4'].includes(
          p.slug
        )
      ).slice(0, 6);

  const displayProducts = featured.length > 0 ? featured : products.slice(0, 6);

  return (
    <div>
      <HeroSlideshow />

      <section className="py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)' }}>
        <div className="mx-auto max-w-site px-5">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              Shop by category.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 60}>
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="group relative block overflow-hidden rounded-2xl"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{cat.label}</h3>
                    <p className="mt-1 text-[13px] text-white/70">{cat.examples}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[12px] font-semibold text-white transition-opacity group-hover:opacity-90">
                      Browse category
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] py-20 sm:py-28">
        <div className="mx-auto max-w-site px-5">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              Popular right now.
            </h2>
          </Reveal>
          {loading ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-black/5" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {displayProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-block rounded-full border border-ink/15 px-6 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Browse all products
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-site px-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoCard
              icon={<Store size={22} />}
              title="Pickup in-store"
              text="Order ahead and pick up at our shop in Farm Center, Kano."
            />
            <InfoCard
              icon={<Truck size={22} />}
              title="Delivery available"
              text="We deliver across Kano and beyond. Ask us on WhatsApp."
            />
            <InfoCard
              icon={<MapPin size={22} />}
              title="Visit us"
              text={siteConfig.location.label}
              link={{ label: 'Get directions', href: siteConfig.location.mapUrl }}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-ink/55">
            <Clock size={15} />
            <span>{siteConfig.hours}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, text, link }) {
  return (
    <Reveal>
      <div className="flex flex-col items-center rounded-2xl bg-[#f5f5f7] p-6 text-center sm:items-start sm:text-left">
        <div className="text-ink/70">{icon}</div>
        <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-[13px] text-ink/55">{text}</p>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-[13px] text-accent hover:underline"
          >
            {link.label} →
          </a>
        )}
      </div>
    </Reveal>
  );
}
