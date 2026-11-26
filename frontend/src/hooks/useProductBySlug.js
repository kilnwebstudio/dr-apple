import { useEffect, useState } from 'react';
import { fetchProductBySlug } from '@/lib/products';

export function useProductBySlug(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((data) => {
        if (active) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { product, loading, error };
}
