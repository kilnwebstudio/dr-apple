import { Link } from 'react-router-dom';
import { Reveal } from '@/components/Reveal';
import { usePageMeta } from '@/hooks/usePageMeta';

export function AboutPage() {
  usePageMeta(
    'About — Dr Apple',
    'The story of Dr Apple, an independent gadget shop in Kano, Nigeria.'
  );

  return (
    <div className="bg-white pt-12">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <Reveal>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            About Dr Apple.
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink/75">
            <p>
              Dr Apple started as a small counter inside Rahma Plaza, Farm Center, Kano —
              with a simple idea: make good phones and gadgets easy to buy, without the
              stress. Whether you know everything about specs or just want a phone that
              works, we treat you the same.
            </p>
            <p>
              Today we stock the latest from Apple, Samsung and Google Pixel, reliable
              chargers and power banks from Anker, and budget-friendly phones from Vivo,
              Tecno and Realme. If we don’t have it, we’ll do our best to get it for you.
            </p>
            <p>
              We’re not an authorized Apple reseller — we’re an independent shop. That means
              honest advice, fair prices, and a quick chat on WhatsApp whenever you need
              one.
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 rounded-2xl bg-[#f5f5f7] p-6">
            <h2 className="text-base font-semibold text-ink">Come say hello.</h2>
            <p className="mt-2 text-[14px] text-ink/65">
              We’re open every day. Walk in, or send us a message first.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-block text-[14px] text-accent hover:underline"
            >
              Contact & directions →
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
