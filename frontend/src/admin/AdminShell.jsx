import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Package, Users, Activity, LogOut } from 'lucide-react';
import { useAuth } from '@/admin/AuthContext';

export function AdminShell({ children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/admin');
  };

  const isOwner = user?.role === 'owner';

  const navItems = [
    { label: 'Products', to: '/admin/products', icon: <Package size={18} />, ownerOnly: false },
    { label: 'Admins', to: '/admin/admins', icon: <Users size={18} />, ownerOnly: true },
    { label: 'Activity', to: '/admin/activity', icon: <Activity size={18} />, ownerOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-5">
          <Link to="/admin/products" className="font-logo text-xl text-ink">
            Dr Apple
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-ink/50">
              {user?.username} · {user?.role}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 text-[12px] font-medium text-ink/70 hover:text-ink"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto">
          {navItems
            .filter((item) => !item.ownerOnly || isOwner)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-ink text-white'
                      : 'bg-white text-ink/70 hover:bg-black/5'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
