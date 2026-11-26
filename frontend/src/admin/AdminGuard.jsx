import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/admin/AuthContext';
import { useNoindex } from '@/hooks/useNoindex';
import { AdminShell } from '@/admin/AdminShell';

export function AdminGuard({ ownerOnly = false }) {
  useNoindex();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin360 rounded-full border-2 border-ink/15 border-t-ink/70" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  if (ownerOnly && user.role !== 'owner') {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
