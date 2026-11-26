import { siteConfig } from '@/data/siteConfig';

export function Logo({ className = '', size = 'text-2xl' }) {
  return (
    <span className={`font-logo ${size} text-ink ${className}`}>{siteConfig.name}</span>
  );
}
