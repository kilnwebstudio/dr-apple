import { Link } from 'react-router-dom';
import { formatNaira, categoryLabel } from '@/lib/products';
import { CategoryChip } from '@/components/CategoryChip';

export function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl bg-[#f5f5f7] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden">
        <CategoryChip label={categoryLabel(product.category)} />
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="px-5 pb-5 pt-4">
        <p className="text-[11px] uppercase tracking-wide text-ink/45">{product.brand}</p>
        <h3 className="mt-1 text-[15px] font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 text-[13px] text-ink/55">{product.condition}</p>
        <p className="mt-3 text-[16px] font-bold text-ink">{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
