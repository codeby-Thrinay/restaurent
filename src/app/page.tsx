'use client';

import Link from 'next/link';
import NavigationHeader from '@/components/NavigationHeader';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import {
  UtensilsCrossed,
  ChefHat,
  UserCheck,
  Settings,
  BarChart3,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const portals = [
    {
      title: 'Customer Tables & QR Ordering',
      description: 'Directory of all dining tables (Table 1, Table 2, Table 3...) with live status badges and QR ordering.',
      href: '/table',
      icon: UtensilsCrossed,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-500',
      badge: 'Tables 1 - 10',
    },
    {
      title: 'Kitchen Display System (KDS)',
      description: 'Real-time kitchen ticket queue with color-coded preparation timers and status action triggers.',
      href: '/kitchen',
      icon: ChefHat,
      color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-500',
      badge: 'Live Kitchen Queue',
    },
    {
      title: 'Floor Staff & Waiter Alert Station',
      description: 'Live floor table map (Vacant, Occupied, Bill Requested, Needs Cleaning) and waiter call dispatches.',
      href: '/staff',
      icon: UserCheck,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-500',
      badge: 'Floor Dispatches',
    },
    {
      title: 'Admin Operations & Menu Manager',
      description: 'Complete menu CRUD modal, price adjustments (₹), category sorting, and instant out-of-stock toggles.',
      href: '/admin',
      icon: Settings,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-500',
      badge: 'Menu Management',
    },
    {
      title: 'Table Printable QR Stand Cards',
      description: 'High resolution print-ready QR code stand cards generated dynamically for all 10 dining tables.',
      href: '/admin/qr',
      icon: QrCode,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-500',
      badge: 'Print QR Stands',
    },
    {
      title: 'Executive Owner Analytics',
      description: 'Gross revenue in INR (₹), total order counts, average order value, bestselling dishes ranking & ratings.',
      href: '/owner',
      icon: BarChart3,
      color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-500',
      badge: 'Revenue Insights',
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans pb-20 transition-colors ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <NavigationHeader />

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-extrabold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Digital QR Dining & Operations Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Elevate Your Restaurant Dining Experience with{' '}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              DinePulse
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Seamless table QR ordering, real-time Kitchen KDS tickets, floor staff dispatch alerts, admin menu inventory, and owner revenue analytics.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/table"
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Explore All Tables & Statuses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portals Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black">All Restaurant Portals</h2>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Access customer, kitchen, waiter, admin, and owner interfaces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.href}
                href={portal.href}
                className={`border rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all hover:scale-[1.02] hover:shadow-2xl group ${
                  isDark
                    ? 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/50'
                    : 'bg-white border-slate-200 hover:border-amber-500/50 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br border ${portal.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg group-hover:text-amber-500 transition-colors">
                    {portal.title}
                  </h3>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {portal.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-amber-500 pt-2 border-t border-zinc-800/60">
                  <span>Open Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
