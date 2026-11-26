import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatNaira, categoryLabel } from '@/lib/products';
import { categories } from '@/data/categories';
import { useNoindex } from '@/hooks/useNoindex';
import { Search, Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

const EMPTY_FORM = {
  id: null,
  slug: '',
  name: '',
  brand: '',
  category: 'phones',
  price: '',
  condition: 'New',
  shortDescription: '',
  specs: '[]',
  imageFile: null,
  imageUrl: '',
};

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AdminProducts() {
  useNoindex();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products } = await api.listAllProducts();
      setProducts(products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = products.filter((p) => {
    const catOk = filterCategory === 'all' || p.category === filterCategory;
    const q = search.trim().toLowerCase();
    const searchOk = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const deletedOk = showDeleted || !p.deletedAt;
    return catOk && searchOk && deletedOk;
  });

  const startEdit = (row) => {
    setEditing({
      id: row._id,
      slug: row.slug,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: String(row.price),
      condition: row.condition,
      shortDescription: row.shortDescription ?? '',
      specs: JSON.stringify(row.specs ?? [], null, 2),
      imageFile: null,
      imageUrl: row.images?.[0] ?? '',
    });
    setError(null);
  };

  const startAdd = () => {
    setEditing({ ...EMPTY_FORM });
    setError(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);

    try {
      const slug = editing.slug || slugify(editing.name);
      if (!slug || !editing.name || !editing.brand || !editing.price) {
        throw new Error('Name, brand, slug and price are required');
      }

      let specs;
      try {
        specs = JSON.parse(editing.specs);
      } catch {
        throw new Error('Specs must be valid JSON');
      }

      const payload = {
        slug,
        name: editing.name,
        brand: editing.brand,
        category: editing.category,
        price: Number(editing.price),
        condition: editing.condition,
        shortDescription: editing.shortDescription,
        specs,
        images: editing.imageFile ? [] : editing.imageUrl ? [editing.imageUrl] : [],
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      if (editing.imageFile) formData.append('image', editing.imageFile);

      if (editing.id) {
        await api.updateProduct(editing.id, formData);
      } else {
        await api.createProduct(formData);
      }

      setEditing(null);
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async (row) => {
    if (!confirm(`Remove "${row.name}"? This is a soft delete — the owner can still see it.`)) return;
    try {
      await api.softDeleteProduct(row._id);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (row) => {
    try {
      await api.restoreProduct(row._id);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Products</h1>
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-semibold">Dismiss</button>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-full border border-black/10 bg-white py-2 pl-9 pr-4 text-[13px] text-ink outline-none focus:border-accent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] text-ink outline-none focus:border-accent"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-[13px] text-ink/70">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="rounded"
          />
          Show removed
        </label>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 animate-spin360 rounded-full border-2 border-ink/15 border-t-ink/70" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[14px] text-ink/50">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-black/5 text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Condition</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="font-medium text-ink">{p.name}</div>
                          <div className="text-ink/45">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{categoryLabel(p.category)}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{formatNaira(p.price)}</td>
                    <td className="px-4 py-3 text-ink/70">{p.condition}</td>
                    <td className="px-4 py-3">
                      {p.deletedAt ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">Removed</span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {p.deletedAt ? (
                          <button
                            onClick={() => handleRestore(p)}
                            className="rounded-lg px-2 py-1.5 text-[12px] text-accent hover:bg-accent-50"
                          >
                            Restore
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(p)}
                              className="rounded-lg p-1.5 text-ink/60 hover:bg-black/5 hover:text-ink"
                              aria-label="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleSoftDelete(p)}
                              className="rounded-lg p-1.5 text-ink/60 hover:bg-red-50 hover:text-red-600"
                              aria-label="Remove"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ProductForm
          form={editing}
          setForm={setEditing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

function ProductForm({ form, setForm, onSave, onClose, saving }) {
  const update = (patch) => setForm({ ...form, ...patch });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      update({ imageFile: file });
      const reader = new FileReader();
      reader.onload = () => update({ imageUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
      <div className="mt-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            {form.id ? 'Edit product' : 'Add product'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink/50 hover:bg-black/5">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => update({ name: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })}
              className="form-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand">
              <input
                type="text"
                value={form.brand}
                onChange={(e) => update({ brand: e.target.value })}
                className="form-input"
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update({ slug: e.target.value })}
                className="form-input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
                className="form-input"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Condition">
              <select
                value={form.condition}
                onChange={(e) => update({ condition: e.target.value })}
                className="form-input"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </Field>
          </div>

          <Field label="Price (₦)">
            <input
              type="number"
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
              className="form-input"
              placeholder="0"
            />
          </Field>

          <Field label="Short description">
            <textarea
              value={form.shortDescription}
              onChange={(e) => update({ shortDescription: e.target.value })}
              rows={2}
              className="form-input resize-none"
            />
          </Field>

          <Field label="Specs (JSON array)">
            <textarea
              value={form.specs}
              onChange={(e) => update({ specs: e.target.value })}
              rows={3}
              className="form-input resize-none font-mono text-[12px]"
              placeholder='[{"label":"Display","value":"6.3″ OLED"}]'
            />
          </Field>

          <Field label="Product image">
            <div className="flex items-center gap-3">
              {form.imageUrl && (
                <img src={form.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
              )}
              <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-[13px] font-medium text-ink/70 hover:bg-black/5">
                <Upload size={15} />
                Upload image
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2 text-[13px] font-medium text-ink/70 hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-ink/60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
