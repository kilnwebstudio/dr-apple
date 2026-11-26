import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { brands, categories } from '@/data/categories';
import { useProducts } from '@/hooks/useProducts';
import { usePageMeta } from '@/hooks/usePageMeta';

export function ShopPage() {
  usePageMeta(
    'Shop — Dr Apple',
    'Browse phones, laptops, chargers, audio and accessories at Dr Apple, Kano.'
  );

  const { products, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get('category') ?? 'all';
  const [query, setQuery] = useState('');

  const activeCategory = categories.some((c) => c.id === categoryParam) ? categoryParam : 'all';

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catOk = activeCategory === 'all' || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const searchOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [products, activeCategory, query]);

  const setCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setParams(next, { replace: true });
  };

  return (
    <div className="bg-white pt-12">
      <div className="mx-auto max-w-site px-5 pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Shop all products.
        </h1>

        <div className="relative mt-6 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or brands"
            className="w-full rounded-full border border-black/10 bg-[#f5f5f7] py-2.5 pl-10 pr-9 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-accent"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="sticky top-12 z-30 mt-8 border-y border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-site px-5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto py-3">
            <TabChip
              label="All"
              active={activeCategory === 'all'}
              onClick={() => setCategory('all')}
            />
            {categories.map((c) => (
              <TabChip
                key={c.id}
                label={c.label}
                active={activeCategory === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-site px-5 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink/50">
          <span className="font-medium text-ink/70">Brands:</span>
          {brands.map((b) => (
            <span key={b.id}>{b.label}</span>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-black/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink/60">No products match your search.</p>
            <button
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
              className="mt-4 text-[13px] text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 6) * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] transition-colors ${
        active
          ? 'bg-ink text-white'
          : 'bg-[#f5f5f7] text-ink/70 hover:bg-black/10'
      }`}
    >
      {label}
    </button>
  );
}
