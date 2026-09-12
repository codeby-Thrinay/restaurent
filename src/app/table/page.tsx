'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavigationHeader from '@/components/NavigationHeader';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { UtensilsCrossed, Users, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  capacity: number;
  section: string;
  status: 'VACANT' | 'OCCUPIED' | 'BILL_REQUESTED' | 'NEEDS_CLEANING';
}

export default function TableSelectionDirectoryPage() {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 3000); // Live poll table statuses
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (err) {
      console.error('Failed to load table list', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VACANT':
        return {
          label: t('vacantStatus'),
          bg: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'OCCUPIED':
        return {
          label: t('occupiedStatus'),
          bg: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'BILL_REQUESTED':
        return {
          label: t('billRequestedStatus'),
          bg: isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse' : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse',
          dot: 'bg-amber-500',
        };
      case 'NEEDS_CLEANING':
        return {
          label: t('needsCleaningStatus'),
          bg: isDark ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
        };
      default:
        return {
          label: t('vacantStatus'),
          bg: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div
      className={`min-h-screen font-sans pb-16 transition-colors ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <NavigationHeader />

      {/* Header Banner */}
      <div
        className={`border-b px-4 py-6 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900/60 to-zinc-950 border-zinc-800/80'
            : 'bg-gradient-to-b from-amber-500/10 via-slate-100 to-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                  {t('digitalDining')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">Select Dining Table & View Live Status</h1>
            </div>
          </div>

          <button
            onClick={fetchTables}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Table Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">All Restaurant Dining Tables</h2>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Click on any table (Table 1, Table 2, Table 3...) to open its digital menu & QR ordering
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-500">
            {tables.length} Total Tables
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className={`h-40 rounded-2xl animate-pulse border ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-200/60 border-slate-300'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              const badge = getStatusBadge(table.status);
              return (
                <Link
                  key={table.id}
                  href={`/table/${table.number}`}
                  className={`border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] group ${
                    isDark
                      ? 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/50'
                      : 'bg-white border-slate-200 hover:border-amber-500/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl font-black text-amber-500 group-hover:text-amber-400 transition-colors">
                        Table {table.number}
                      </span>
                      <span className={`block text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {table.section}
                      </span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold flex items-center gap-1.5 ${badge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t pt-3 border-zinc-800/60">
                    <span className={`flex items-center gap-1 font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <Users className="w-3.5 h-3.5" />
                      {table.capacity} {t('guests')}
                    </span>

                    <span className="font-bold text-amber-500 flex items-center gap-0.5 text-xs group-hover:translate-x-1 transition-transform">
                      {t('tableMenu')} <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
