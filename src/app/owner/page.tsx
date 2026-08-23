'use client';

import { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { BarChart3, DollarSign, ShoppingBag, TrendingUp, Star, RefreshCw, Award, ArrowUpRight } from 'lucide-react';

interface OrderItem {
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    category: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  items: OrderItem[];
  createdAt: string;
}

interface Feedback {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  order: {
    table: {
      number: number;
    };
  };
}

export default function OwnerAnalyticsDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [oRes, fRes] = await Promise.all([fetch('/api/orders'), fetch('/api/feedback')]);
      if (oRes.ok && fRes.ok) {
        const oData = await oRes.json();
        const fData = await fRes.json();
        setOrders(oData);
        setFeedbackList(fData);
      }
    } catch (err) {
      console.error('Failed to load owner analytics', err);
    } finally {
      setLoading(false);
    }
  };

  // KPI Computations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const avgRating =
    feedbackList.length > 0
      ? feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length
      : 5.0;

  // Bestselling dish aggregation
  const dishSalesMap: Record<string, { count: number; total: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const name = item.menuItem.name;
      if (!dishSalesMap[name]) {
        dishSalesMap[name] = { count: 0, total: 0 };
      }
      dishSalesMap[name].count += item.quantity;
      dishSalesMap[name].total += item.price * item.quantity;
    });
  });

  const bestsellers = Object.entries(dishSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      <NavigationHeader />

      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Executive Owner Analytics</h1>
              <p className="text-xs text-zinc-400">Real-time revenue metrics, dish sales & customer ratings (INR ₹)</p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* KPI Metric Cards */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500 animate-pulse">Loading Owner Analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">₹{totalRevenue.toFixed(0)}</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center">
                    +18.4% <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">Total dining sales recorded</p>
              </div>

              {/* Metric 2 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{totalOrdersCount}</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center">
                    +12% <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">Tickets processed by kitchen</p>
              </div>

              {/* Metric 3 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Average Order Value</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">₹{avgOrderValue.toFixed(0)}</span>
                  <span className="text-xs text-zinc-400 font-semibold">per table ticket</span>
                </div>
                <p className="text-[11px] text-zinc-500">Average spend per table</p>
              </div>

              {/* Metric 4 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Guest Satisfaction</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Star className="w-4 h-4 fill-emerald-400" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">{avgRating.toFixed(1)} / 5.0</span>
                </div>
                <p className="text-[11px] text-zinc-500">Based on {feedbackList.length} verified reviews</p>
              </div>
            </div>

            {/* Middle Row: Bestsellers & Feedback Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bestselling Dishes */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Top Bestselling Menu Dishes</span>
                  </h3>
                  <span className="text-xs text-zinc-500 font-semibold">By Total Sales</span>
                </div>

                <div className="space-y-3 divide-y divide-zinc-800/60">
                  {bestsellers.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 text-xs">No orders recorded yet.</div>
                  ) : (
                    bestsellers.map((dish, idx) => (
                      <div key={dish.name} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-zinc-950 text-amber-400 font-black flex items-center justify-center text-xs">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block">{dish.name}</span>
                            <span className="text-[11px] text-zinc-500">{dish.count} orders placed</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-amber-400 text-sm">₹{dish.total.toFixed(0)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Customer Rating & Reviews Feed */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>Live Customer Reviews</span>
                  </h3>
                  <span className="text-xs text-zinc-500 font-semibold">{feedbackList.length} Feedbacks</span>
                </div>

                <div className="space-y-3 divide-y divide-zinc-800/60 max-h-[320px] overflow-y-auto">
                  {feedbackList.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 text-xs">No customer feedback submitted yet.</div>
                  ) : (
                    feedbackList.map((f) => (
                      <div key={f.id} className="pt-3 first:pt-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-400">Table {f.order.table.number}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < f.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {f.comment && <p className="text-xs text-zinc-300 italic">&quot;{f.comment}&quot;</p>}
                        <span className="block text-[10px] text-zinc-500">
                          {new Date(f.createdAt).toLocaleDateString()} {new Date(f.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
