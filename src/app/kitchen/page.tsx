'use client';

import { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { useThemeStore } from '@/store/useThemeStore';
import { ChefHat, Clock, CheckCircle2, Flame, RefreshCw, AlertCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  notes: string | null;
  menuItem: {
    name: string;
    isVeg: boolean;
  };
}

interface Order {
  id: string;
  tableId: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  table: {
    number: number;
  };
}

export default function KitchenKdsPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.filter((o: Order) => o.status !== 'SERVED' && o.status !== 'CANCELLED'));
      }
    } catch (err) {
      console.error('Failed to load kitchen tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error('Status update failed', err);
      alert('Failed to update ticket status');
    }
  };

  return (
    <div
      className={`min-h-screen font-sans pb-16 transition-colors ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <NavigationHeader />

      {/* KDS Banner */}
      <div
        className={`border-b px-4 py-4 transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Kitchen Display System (KDS)</h1>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Real-time active order prep queue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
              {orders.length} Active Tickets
            </span>
            <button
              onClick={fetchOrders}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Grid Queue */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {loading ? (
          <div className="py-20 text-center text-zinc-500 animate-pulse">Loading Kitchen Queue...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 text-zinc-500 space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto opacity-30 stroke-1" />
            <p className="text-base font-semibold">Kitchen queue is clear!</p>
            <p className="text-xs text-zinc-600">New table orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => {
              const minutesAgo = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
              const isUrgent = minutesAgo >= 10;

              const cardBorder =
                order.status === 'PENDING'
                  ? isDark
                    ? 'border-amber-500/80 bg-zinc-900'
                    : 'border-amber-500 bg-white shadow-md'
                  : order.status === 'PREPARING'
                  ? isDark
                    ? 'border-blue-500/80 bg-zinc-900'
                    : 'border-blue-500 bg-white shadow-md'
                  : isDark
                  ? 'border-emerald-500/80 bg-zinc-900'
                  : 'border-emerald-500 bg-white shadow-md';

              return (
                <div
                  key={order.id}
                  className={`border rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl transition-all ${cardBorder}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-2 border-zinc-800/80">
                      <div>
                        <span className="text-xl font-black">Table {order.table.number}</span>
                        <span className="block text-[10px] text-zinc-400 font-mono">
                          #{order.id.substring(0, 6)}
                        </span>
                      </div>

                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isUrgent
                            ? 'bg-red-500 text-white animate-pulse'
                            : isDark
                            ? 'bg-zinc-950 text-amber-400 border border-zinc-800'
                            : 'bg-slate-100 text-amber-600 border border-slate-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{minutesAgo}m ago</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{order.notes}</span>
                      </div>
                    )}

                    <div className="space-y-2 pt-1 divide-y divide-zinc-800/60">
                      {order.items.map((item) => (
                        <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                                {item.quantity}x
                              </span>
                              <span className="font-extrabold text-sm">{item.menuItem.name}</span>
                            </div>
                            {item.notes && (
                              <span className="block text-[11px] text-red-400 font-medium ml-8">
                                Note: {item.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <Flame className="w-4 h-4" /> Start Cooking
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                        className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Plated & Ready
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Served to Guest
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
