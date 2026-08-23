'use client';

import { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { ChefHat, Clock, CheckCircle2, Play, AlertCircle, Utensils, RefreshCw } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
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
  items: OrderItem[];
  table: {
    number: number;
  };
  createdAt: string;
}

export default function KitchenDisplaySystemPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PREPARING' | 'READY'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // Live poll kitchen tickets
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        // Filter active kitchen orders (exclude SERVED / CANCELLED unless filtered)
        const kitchenOrders = data.filter((o) => o.status !== 'SERVED' && o.status !== 'CANCELLED');
        setOrders(kitchenOrders);
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

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      alert('Could not update order status.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  const getTimerMinutes = (createdAt: string) => {
    const elapsedMs = new Date().getTime() - new Date(createdAt).getTime();
    return Math.floor(elapsedMs / 60000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      <NavigationHeader />

      {/* Header Controls */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-zinc-950 flex items-center justify-center font-black">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">Kitchen Display System (KDS)</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xs text-zinc-400">Live order queue for chefs & line cooks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['ALL', 'PENDING', 'PREPARING', 'READY'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === filter
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {filter} ({filter === 'ALL' ? orders.length : orders.filter((o) => o.status === filter).length})
                </button>
              ))}
            </div>

            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Grid Display */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {loading ? (
          <div className="py-20 text-center text-zinc-500 animate-pulse">Loading Kitchen Queue...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 space-y-3">
            <Utensils className="w-12 h-12 mx-auto stroke-1 opacity-40" />
            <h3 className="text-base font-bold text-zinc-400">Kitchen Ticket Queue Clear</h3>
            <p className="text-xs text-zinc-600">All customer orders have been cooked and served!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const minutes = getTimerMinutes(order.createdAt);
              const timerColor =
                minutes > 20
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : minutes > 10
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

              return (
                <div
                  key={order.id}
                  className={`bg-zinc-900 border rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all ${
                    order.status === 'PENDING'
                      ? 'border-amber-500/60 ring-1 ring-amber-500/20'
                      : order.status === 'PREPARING'
                      ? 'border-blue-500/60'
                      : 'border-emerald-500/60'
                  }`}
                >
                  {/* Ticket Header */}
                  <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 font-black flex items-center justify-center text-lg">
                        T{order.table.number}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                          Ticket #{order.id.substring(0, 6)}
                        </span>
                        <h3 className="font-extrabold text-sm text-zinc-100">Table {order.table.number}</h3>
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1 ${timerColor}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{minutes}m ago</span>
                    </div>
                  </div>

                  {/* Ticket Items List */}
                  <div className="p-4 flex-1 space-y-3">
                    <div className="space-y-2 divide-y divide-zinc-800/60">
                      {order.items.map((item) => (
                        <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 font-black text-sm">
                              {item.quantity}x
                            </span>
                            <div>
                              <span className="font-bold text-sm text-zinc-100">{item.menuItem.name}</span>
                              {item.notes && (
                                <span className="block text-xs font-semibold text-red-400/90 italic">
                                  🚨 Note: {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 ${
                              item.menuItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="p-2.5 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 font-medium">
                        <strong>Kitchen Special Notes:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                      >
                        <Play className="w-4 h-4 fill-zinc-950" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                        className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Order Plated & Ready</span>
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Order Served</span>
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
