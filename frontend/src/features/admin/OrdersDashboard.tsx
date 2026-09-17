import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Clock, CheckCircle, ChefHat, PackageCheck, Send, Search } from 'lucide-react';

const STATUSES = [
  { id: 'PENDING', label: 'Pendientes', color: 'bg-zinc-800', icon: <Clock size={16} className="text-zinc-400" /> },
  { id: 'CONFIRMED', label: 'Confirmadas', color: 'bg-blue-950/50', icon: <CheckCircle size={16} className="text-blue-400" /> },
  { id: 'PREPARING', label: 'Preparando', color: 'bg-amber-950/50', icon: <ChefHat size={16} className="text-amber-400" /> },
  { id: 'READY', label: 'Listas', color: 'bg-green-950/50', icon: <PackageCheck size={16} className="text-green-400" /> },
  { id: 'DELIVERED', label: 'Entregadas', color: 'bg-zinc-900', icon: <Send size={16} className="text-zinc-500" /> },
];

export const OrdersDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 10 seconds for new orders
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating status:', error);
      fetchOrders(); // Revert on error
    }
  };

  if (loading) {
    return <div className="text-zinc-400 flex items-center justify-center h-full">Cargando órdenes...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Órdenes en tiempo real</h2>
          <p className="text-zinc-400">Gestioná los pedidos entrantes y actualizá su estado.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar pedido..." 
            className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full pb-4">
          {STATUSES.map(col => (
            <div key={col.id} className="w-80 flex flex-col h-full bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {col.icon}
                  {col.label}
                </div>
                <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full text-zinc-400 font-medium">
                  {orders.filter(o => o.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {orders.filter(o => o.status === col.id).map(order => (
                  <div key={order.id} className={`p-4 rounded-xl border border-zinc-800 shadow-sm ${col.color}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">{order.orderNumber}</span>
                        <h4 className="font-bold text-white mt-2">{order.customerName}</h4>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">
                        {order.type}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items?.map((item: any) => {
                        // Agrupar modificadores para mostrar cantidad, ej: 2x Extra Cheddar
                        const modifierCounts = item.modifiers?.reduce((acc: any, curr: any) => {
                          const name = curr.modifier.name;
                          acc[name] = (acc[name] || 0) + 1;
                          return acc;
                        }, {});

                        const groupedModifiers = modifierCounts 
                          ? Object.entries(modifierCounts).map(([name, count]) => `${count}x ${name}`).join(', ')
                          : '';

                        return (
                          <div key={item.id} className="text-sm">
                            <span className="text-zinc-300 font-medium">{item.quantity}x {item.product.name}</span>
                            {groupedModifiers && (
                              <div className="text-xs text-zinc-500 pl-4 mt-1">
                                + {groupedModifiers}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-xs text-amber-400/90 pl-4 mt-1 italic">
                                💬 "{item.notes}"
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {order.customerAddress && (
                       <div className="text-xs text-zinc-400 bg-zinc-950 p-2 rounded-lg mb-4 line-clamp-2">
                         📍 {order.customerAddress}
                       </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      {col.id === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(order.id, 'CONFIRMED')} className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-2 rounded-lg text-xs font-bold transition-colors">Confirmar</button>
                          <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 py-2 rounded-lg text-xs font-bold transition-colors">Rechazar</button>
                        </>
                      )}
                      {col.id === 'CONFIRMED' && (
                        <button onClick={() => updateStatus(order.id, 'PREPARING')} className="w-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 py-2 rounded-lg text-xs font-bold transition-colors">Empezar a cocinar</button>
                      )}
                      {col.id === 'PREPARING' && (
                        <button onClick={() => updateStatus(order.id, 'READY')} className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 py-2 rounded-lg text-xs font-bold transition-colors">Marcar Lista</button>
                      )}
                      {col.id === 'READY' && (
                        <button onClick={() => updateStatus(order.id, 'DELIVERED')} className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-xs font-bold transition-colors">Entregar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
