import { useEffect } from 'react';

export function useNoindex() {
  useEffect(() => {
    let tag = document.querySelector('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'robots');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', 'noindex, nofollow');
    return () => {
      tag.setAttribute('content', 'index, follow');
    };
  }, []);
}
