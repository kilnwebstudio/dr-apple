import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph';
import { Reveal } from '@/components/Reveal';
import { usePageMeta } from '@/hooks/usePageMeta';

export function ContactPage() {
  usePageMeta(
    'Contact — Dr Apple',
    'Visit Dr Apple at Rahma Plaza, Farm Center, Kano. Call or WhatsApp +234 813 784 3328.'
  );

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hi Dr Apple, I have a question.'
  )}`;

  return (
    <div className="bg-white pt-12">
      <div className="mx-auto max-w-site px-5 py-16 sm:py-24">
        <Reveal>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            Get in touch.
          </h1>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal>
            <div className="space-y-6">
              <Detail
                icon={<MapPin size={20} />}
                title="Address"
                lines={[siteConfig.location.label]}
                link={{ label: 'Open in Google Maps', href: siteConfig.location.mapUrl }}
              />
              <Detail
                icon={<Clock size={20} />}
                title="Hours"
                lines={[siteConfig.hours]}
              />
              <Detail
                icon={<Phone size={20} />}
                title="Phone / WhatsApp"
                lines={[siteConfig.phone]}
                link={{ label: `Call ${siteConfig.phone}`, href: `tel:${siteConfig.phone.replace(/\s/g, '')}` }}
              />

              <div className="rounded-2xl bg-[#f5f5f7] p-6">
                <h2 className="text-base font-semibold text-ink">Send us a message</h2>
                <p className="mt-2 text-[14px] text-ink/65">
                  The quickest way to reach us is WhatsApp. We usually reply within minutes
                  during opening hours.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
                <p className="mt-2 text-[12px] text-ink/45">Continues on WhatsApp</p>
              </div>

              <div>
                <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink/50">
                  Follow us
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {siteConfig.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-black/10 px-4 py-2 text-[13px] text-ink/80 transition-colors hover:bg-ink hover:text-white"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl bg-[#f5f5f7]">
              <a
                href={siteConfig.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label="Open Google Maps"
              >
                <iframe
                  title="Map of Dr Apple, Rahma Plaza, Farm Center, Kano"
                  src="https://www.google.com/maps?q=Rahma+Plaza+Farm+Center+Kano&output=embed"
                  className="h-[360px] w-full border-0 md:h-full md:min-h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, title, lines, link }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-ink/70">
        {icon}
        <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink/50">
          {title}
        </h2>
      </div>
      <div className="mt-2">
        {lines.map((l, i) => (
          <p key={i} className="text-[15px] text-ink/85">
            {l}
          </p>
        ))}
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-[14px] text-accent hover:underline"
          >
            {link.label} →
          </a>
        )}
      </div>
    </div>
  );
}
