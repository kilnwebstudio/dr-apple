import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/heroSlides';

const AUTO_ADVANCE_MS = 6000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % heroSlides.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = window.setInterval(next, AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [paused, next]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) prev();
    else if (dx < -40) next();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Shop news"
    >
      <div className="relative h-[80vh] min-h-[500px] max-h-[720px] w-full">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" style={{ height: '40%' }} />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-20 sm:px-10 sm:pb-24">
          <div className="max-w-site">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.id}
                className={`transition-opacity duration-700 ease-out ${
                  i === index ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'
                }`}
                aria-hidden={i !== index}
              >
                <div className="flex flex-col items-start gap-4">
                  <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
                    {slide.headline}
                  </h2>
                  <p className="max-w-md text-base text-white/90 sm:text-xl">
                    {slide.subtext}
                  </p>
                  <Link
                    to={slide.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-ink transition-opacity hover:opacity-80"
                  >
                    {slide.linkLabel}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex gap-2 sm:right-10">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
