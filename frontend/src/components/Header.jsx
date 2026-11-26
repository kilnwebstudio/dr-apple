import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white/70 backdrop-blur-xl border-b border-black/5">
      <div className="mx-auto flex h-12 max-w-site items-center justify-between px-5">
        <Link
          to="/"
          className="font-logo text-2xl leading-none text-ink transition-opacity hover:opacity-70"
          aria-label={`${siteConfig.name} home`}
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 text-[13px] font-semibold tracking-wide transition-colors ${
                  isActive
                    ? 'text-ink bg-black/5'
                    : 'text-ink/85 hover:text-ink hover:bg-black/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center text-ink sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden">
          <div className="absolute inset-x-0 top-12 bg-white/95 backdrop-blur-xl border-b border-black/5 px-5 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-lg px-2 py-3 text-base font-semibold text-ink/90 active:bg-black/5"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
