import { useEffect, useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { Spinner } from './Spinner';

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = window.setTimeout(() => setHidden(true), reduce ? 200 : 900);
    const t2 = window.setTimeout(() => setGone(true), reduce ? 500 : 1400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white ${
        hidden ? 'animate-fadeOut' : 'opacity-100'
      }`}
      aria-hidden={hidden}
    >
      <span
        className="font-logo text-4xl text-ink sm:text-5xl"
        style={{ animation: 'fadeIn 0.5s ease both' }}
      >
        {siteConfig.name}
      </span>
      <div className="mt-6">
        <Spinner className="h-5 w-5" />
      </div>
    </div>
  );
}
