import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/admin/AuthContext';
import { useNoindex } from '@/hooks/useNoindex';
import { Spinner } from '@/components/Spinner';

export function AdminLogin() {
  useNoindex();
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin/products', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(username, password);
    setBusy(false);
    if (error) {
      setError(error);
    } else {
      navigate('/admin/products');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-ink">
          Admin Login
        </h1>
        <p className="mt-2 text-center text-[14px] text-ink/55">
          Sign in to manage Dr Apple.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-[13px] font-medium text-ink/70">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f5f5f7] px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-accent"
              placeholder="owner"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-ink/70">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f5f5f7] px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-accent"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
