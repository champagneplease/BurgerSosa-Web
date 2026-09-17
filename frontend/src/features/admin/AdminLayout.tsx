import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Órdenes' },
    { to: '/admin/inventory', icon: <Package size={20} />, label: 'Inventario' },
    { to: '/admin/catalog', icon: <LayoutDashboard size={20} />, label: 'Catálogo' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex text-white font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black">
              <Store size={20} />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight">Burger Sosa</h1>
              <p className="text-zinc-500 text-xs">Backoffice</p>
            </div>
          </div>
          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="text-zinc-400 p-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Store className="text-amber-500" />
              <h1 className="font-black text-lg">Burger Sosa</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 p-2">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

