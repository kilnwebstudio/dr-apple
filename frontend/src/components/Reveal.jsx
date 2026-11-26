import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${shown ? 'animate-fadeUp' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
