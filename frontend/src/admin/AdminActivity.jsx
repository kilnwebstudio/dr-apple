import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useNoindex } from '@/hooks/useNoindex';
import { formatNaira } from '@/lib/products';

const ACTION_COLORS = {
  insert: 'bg-green-50 text-green-600',
  update: 'bg-blue-50 text-blue-600',
  remove: 'bg-red-50 text-red-600',
  restore: 'bg-amber-50 text-amber-600',
  delete: 'bg-red-50 text-red-600',
};

export function AdminActivity() {
  useNoindex();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { logs } = await api.listActivity();
        setLogs(logs);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Activity Log</h1>
      <p className="mt-1 text-[13px] text-ink/50">
        Every product change — who did it, when, and what changed.
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-5 w-5 animate-spin360 rounded-full border-2 border-ink/15 border-t-ink/70" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-[14px] text-ink/50">No activity yet.</div>
        ) : (
          <div className="divide-y divide-black/5">
            {logs.map((log) => (
              <div key={log.id}>
                <button
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.02]"
                >
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                      ACTION_COLORS[log.action] || 'bg-gray-100 text-ink/60'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="flex-1 text-[13px] text-ink">
                    <span className="font-medium">{log.productName || 'Unknown product'}</span>
                    <span className="text-ink/45"> — by {log.username || 'unknown'}</span>
                  </span>
                  <span className="whitespace-nowrap text-[12px] text-ink/45">
                    {new Date(log.createdAt).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </button>

                {expanded === log.id && (
                  <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2">
                    {log.oldValues && <DiffPanel title="Old values" values={log.oldValues} />}
                    {log.newValues && <DiffPanel title="New values" values={log.newValues} />}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DiffPanel({ title, values }) {
  const entries = Object.entries(values).filter(
    ([key]) => !['_id', 'id', 'createdAt', 'updatedAt', '__v', 'adminId', 'productId'].includes(key)
  );

  return (
    <div className="rounded-xl bg-[#f5f5f7] p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink/45">
        {title}
      </p>
      <dl className="space-y-1 text-[12px]">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between gap-2">
            <dt className="text-ink/50">{key}</dt>
            <dd className="text-right font-medium text-ink">{formatValue(key, value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatValue(key, value) {
  if (value === null) return '—';
  if (key === 'price' && typeof value === 'number') return formatNaira(value);
  if (key === 'price' && typeof value === 'string') {
    const n = Number(value);
    return isNaN(n) ? value : formatNaira(n);
  }
  if (key === 'images' && Array.isArray(value)) return value.length + ' image(s)';
  if (key === 'specs' && Array.isArray(value)) return value.length + ' spec(s)';
  if (key === 'deletedAt') return value ? 'removed' : 'active';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
