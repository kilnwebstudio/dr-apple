import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { formatNaira } from '@/lib/products';
import { siteConfig } from '@/data/siteConfig';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { Spinner } from '@/components/Spinner';
import { usePageMeta } from '@/hooks/usePageMeta';

export function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProductBySlug(id);

  usePageMeta(
    product ? `${product.name} — Dr Apple` : 'Product — Dr Apple',
    product ? `${product.name} — ${formatNaira(product.price)}. ${product.shortDescription}` : undefined
  );

  const [fulfillment, setFulfillment] = useState('pickup');
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-12">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-12 text-center">
        <h1 className="text-xl font-semibold text-ink">Product not found</h1>
        <Link to="/shop" className="mt-4 text-[14px] text-accent hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const orderLabel = fulfillment === 'pickup' ? 'pickup' : 'delivery';
  const message = `Hi Dr Apple, I'd like to order the ${product.name} (${formatNaira(
    product.price
  )}) for ${orderLabel}.`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white pt-12">
      <div className="mx-auto max-w-site px-5 pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-[13px] text-ink/60 hover:text-ink"
        >
          <ChevronLeft size={15} /> Shop
        </Link>
      </div>

      <div className="mx-auto grid max-w-site grid-cols-1 gap-8 px-5 py-8 md:grid-cols-2 md:gap-12">
        <div>
          <div className="overflow-hidden rounded-2xl bg-[#f5f5f7]">
            <img
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              className="aspect-square w-full object-cover"
              loading="eager"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border-2 transition-colors ${
                    i === activeImage ? 'border-ink' : 'border-transparent'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-16 w-16 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-2">
          <p className="text-[12px] uppercase tracking-wide text-ink/45">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
            {formatNaira(product.price)}
          </p>
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-[12px] font-medium ${
              product.condition === 'New'
                ? 'bg-accent-50 text-accent-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {product.condition}
          </span>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
            {product.shortDescription}
          </p>

          <dl className="mt-8 divide-y divide-black/5 border-y border-black/5">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between py-3 text-[14px]">
                <dt className="text-ink/55">{s.label}</dt>
                <dd className="text-right font-medium text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <p className="mb-2 text-[13px] font-medium text-ink/70">Fulfillment</p>
            <div className="inline-flex rounded-full border border-black/10 p-0.5">
              {['pickup', 'delivery'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFulfillment(f)}
                  className={`rounded-full px-5 py-2 text-[13px] capitalize transition-colors ${
                    fulfillment === f
                      ? 'bg-ink text-white'
                      : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={16} className="opacity-60" />
              Order
            </a>
            <p className="mt-2 text-[12px] text-ink/45">Continues on WhatsApp</p>
          </div>

          <p className="mt-6 text-[12px] text-ink/45">
            Prices may change. Confirm on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
