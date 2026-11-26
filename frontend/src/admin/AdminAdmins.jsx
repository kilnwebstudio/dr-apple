import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/admin/AuthContext';
import { useNoindex } from '@/hooks/useNoindex';
import { api } from '@/lib/api';
import { Plus, Trash2, X } from 'lucide-react';

export function AdminAdmins() {
  useNoindex();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [busy, setBusy] = useState(false);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { admins } = await api.listAdmins();
      setAdmins(admins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleCreate = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.createAdmin(form.username, form.password, form.role);
      setShowForm(false);
      setForm({ username: '', password: '', role: 'admin' });
      await loadAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (admin) => {
    if (admin.id === user?.id) {
      setError('Cannot remove yourself');
      return;
    }
    if (!confirm(`Remove admin "${admin.username}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await api.deleteAdmin(admin.id);
      await loadAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Admins</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} /> Add admin
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-semibold">Dismiss</button>
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 animate-spin360 rounded-full border-2 border-ink/15 border-t-ink/70" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-black/5 text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-medium text-ink">{a.username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          a.role === 'owner'
                            ? 'bg-accent-50 text-accent-600'
                            : 'bg-gray-100 text-ink/60'
                        }`}
                      >
                        {a.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/55">
                      {new Date(a.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {a.role !== 'owner' && (
                        <button
                          onClick={() => handleDelete(a)}
                          className="rounded-lg p-1.5 text-ink/60 hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove admin"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm">
          <div className="mt-8 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Add admin</h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-ink/50 hover:bg-black/5">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-[12px] font-medium text-ink/60">Username</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="form-input mt-1"
                  placeholder="e.g. sales1"
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-medium text-ink/60">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="form-input mt-1"
                  placeholder="At least 6 characters"
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-medium text-ink/60">Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="form-input mt-1"
                >
                  <option value="admin">admin</option>
                  <option value="owner">owner</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full px-5 py-2 text-[13px] font-medium text-ink/70 hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={busy || !form.username || !form.password}
                className="rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? 'Creating...' : 'Create admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
