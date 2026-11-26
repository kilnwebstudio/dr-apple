import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found — Dr Apple');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-12 text-center">
      <h1 className="text-xl font-semibold text-ink">Page not found</h1>
      <Link to="/" className="mt-4 text-[14px] text-accent hover:underline">
        ← Back home
      </Link>
    </div>
  );
}
