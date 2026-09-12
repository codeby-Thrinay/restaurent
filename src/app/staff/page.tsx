'use client';

import { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { useThemeStore } from '@/store/useThemeStore';
import { UserCheck, BellRing, Receipt, CheckCircle, RefreshCw, Droplets, Utensils, HelpCircle, DollarSign } from 'lucide-react';

interface WaiterRequest {
  id: string;
  tableId: string;
  type: 'WATER' | 'CUTLERY' | 'HELP' | 'BILL';
  isResolved: boolean;
  createdAt: string;
  table: {
    number: number;
  };
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  section: string;
  status: 'VACANT' | 'OCCUPIED' | 'BILL_REQUESTED' | 'NEEDS_CLEANING';
  orders: {
    id: string;
    totalAmount: number;
    paymentStatus: string;
  }[];
  requests: {
    id: string;
    type: string;
  }[];
}

export default function WaiterStaffPortalPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [tables, setTables] = useState<Table[]>([]);
  const [requests, setRequests] = useState<WaiterRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, rRes] = await Promise.all([fetch('/api/tables'), fetch('/api/requests')]);
      if (tRes.ok && rRes.ok) {
        const tData = await tRes.json();
        const rData = await rRes.json();
        setTables(tData);
        setRequests(rData);
      }
    } catch (err) {
      console.error('Failed to load waiter floor data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to clear alert', err);
      alert('Failed to clear alert');
    }
  };

  const handleTableStatusChange = async (tableId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status: newStatus }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to update table status', err);
      alert('Failed to update table status');
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID', status: 'SERVED' }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to mark order paid', err);
      alert('Failed to mark order paid');
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'WATER':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'CUTLERY':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'BILL':
        return <Receipt className="w-4 h-4 text-emerald-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans pb-16 transition-colors ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <NavigationHeader />

      {/* Header */}
      <div
        className={`border-b px-4 py-4 transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Floor Staff & Waiter Alert Station</h1>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Live floor overview, table checkout & call dispatches
              </p>
            </div>
          </div>

          <button
            onClick={fetchData}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Floor
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Floor Grid Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>Restaurant Floor Map</span>
              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                ({tables.length} Total Tables)
              </span>
            </h2>

            {/* Legend */}
            <div className={`flex items-center gap-3 text-[11px] font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vacant
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Occupied
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Bill Requested
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Needs Cleaning
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-500 animate-pulse">Loading Floor Status...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map((table) => {
                const unpaidOrder = table.orders.find((o) => o.paymentStatus === 'UNPAID');

                const statusBg =
                  table.status === 'VACANT'
                    ? isDark
                      ? 'border-emerald-500/40 bg-zinc-900/60'
                      : 'border-emerald-300 bg-white shadow-sm'
                    : table.status === 'OCCUPIED'
                    ? isDark
                      ? 'border-blue-500/60 bg-zinc-900'
                      : 'border-blue-300 bg-white shadow-sm'
                    : table.status === 'BILL_REQUESTED'
                    ? isDark
                      ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/40 animate-pulse'
                      : 'border-amber-400 bg-amber-50 ring-1 ring-amber-400/40 animate-pulse shadow-md'
                    : isDark
                    ? 'border-red-500/60 bg-red-950/20'
                    : 'border-red-300 bg-red-50 shadow-sm';

                return (
                  <div
                    key={table.id}
                    className={`border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${statusBg}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black">Table {table.number}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-zinc-950 text-zinc-400' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {table.section}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>Status:</span>
                        <span
                          className={`font-bold ${
                            table.status === 'VACANT'
                              ? 'text-emerald-500'
                              : table.status === 'OCCUPIED'
                              ? 'text-blue-500'
                              : table.status === 'BILL_REQUESTED'
                              ? 'text-amber-500'
                              : 'text-red-500'
                          }`}
                        >
                          {table.status.replace('_', ' ')}
                        </span>
                      </div>

                      {unpaidOrder && (
                        <div
                          className={`flex items-center justify-between text-xs pt-1 border-t ${
                            isDark ? 'border-zinc-800' : 'border-slate-200'
                          }`}
                        >
                          <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>Unpaid Bill:</span>
                          <span className="font-extrabold text-amber-500">₹{unpaidOrder.totalAmount.toFixed(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className={`space-y-1.5 pt-2 border-t ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
                      {unpaidOrder && (
                        <button
                          onClick={() => handleMarkPaid(unpaidOrder.id)}
                          className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Mark Bill Paid
                        </button>
                      )}

                      {table.status === 'NEEDS_CLEANING' && (
                        <button
                          onClick={() => handleTableStatusChange(table.id, 'VACANT')}
                          className="w-full py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Cleaned & Vacant
                        </button>
                      )}

                      {table.status === 'VACANT' && (
                        <button
                          onClick={() => handleTableStatusChange(table.id, 'OCCUPIED')}
                          className={`w-full py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                            isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                          }`}
                        >
                          Seat Guests
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Active Waiter Dispatch Alert Calls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-500" />
              <span>Table Assistance Queue</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-extrabold text-xs">
              {requests.length} Pending
            </span>
          </div>

          <div
            className={`border rounded-3xl p-4 divide-y min-h-[300px] transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 divide-zinc-800/60'
                : 'bg-white border-slate-200 divide-slate-200 shadow-sm'
            }`}
          >
            {requests.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto opacity-30 stroke-1" />
                <p className="text-xs font-semibold">No pending waiter calls.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                      {getRequestIcon(req.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">Table {req.table.number}</span>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-500">{req.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolveRequest(req.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow"
                  >
                    Done
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
