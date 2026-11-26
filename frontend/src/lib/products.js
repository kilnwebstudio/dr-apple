import { api } from '@/lib/api';

export function formatNaira(amount) {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
}

export function categoryLabel(categoryId) {
  const labels = {
    phones: 'Phones',
    laptops: 'Laptops',
    chargers: 'Chargers & Power',
    audio: 'Audio',
    accessories: 'Accessories',
  };
  return labels[categoryId] ?? categoryId;
}

export async function fetchProducts() {
  const { products } = await api.listProducts();
  return products;
}

export async function fetchProductBySlug(slug) {
  try {
    const { product } = await api.getProduct(slug);
    return product;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}
