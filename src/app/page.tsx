import Link from 'next/link';
import { UtensilsCrossed, ChefHat, UserCheck, Settings, QrCode, BarChart3, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';

export default function HomeLandingPage() {
  const features = [
    {
      title: 'Customer QR Menu & Order',
      href: '/table/1',
      badge: 'Mobile First',
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
      icon: UtensilsCrossed,
      desc: 'Customers scan table QR code to view dynamic menu, filter dietary tags (veg/spicy), add dish notes, place orders, call waiter, and request bill.',
    },
    {
      title: 'Kitchen Display System (KDS)',
      href: '/kitchen',
      badge: 'Live Ticket Queue',
      color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
      icon: ChefHat,
      desc: 'Chefs view incoming order tickets with color-coded preparation timers, dish notes, and one-click status transitions (Cooking -> Ready).',
    },
    {
      title: 'Floor Staff & Waiter Station',
      href: '/staff',
      badge: 'Instant Dispatch',
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
      icon: UserCheck,
      desc: 'Floor servers monitor table grid status (Vacant, Occupied, Bill Requested, Cleaning), resolve water/cutlery alerts, and process checkouts.',
    },
    {
      title: 'Admin Operations & Stock',
      href: '/admin',
      badge: 'Menu Management',
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
      icon: Settings,
      desc: 'Managers manage menu categories, add new dishes with photos and prices, toggle instant item out-of-stock availability, and edit prices.',
    },
    {
      title: 'Table Printable QR Generator',
      href: '/admin/qr',
      badge: 'Print Ready',
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
      icon: QrCode,
      desc: 'Automatically generate high-resolution QR table stand cards for Table 1..N with custom encoded table URLs ready for printing.',
    },
    {
      title: 'Executive Owner Dashboard',
      href: '/owner',
      badge: 'Analytics & Ratings',
      color: 'from-amber-400/20 to-amber-500/10 border-amber-400/30 text-amber-300',
      icon: BarChart3,
      desc: 'Owners track real-time gross revenue, total order count, average spend per table, top bestselling dishes, and live customer reviews.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      <NavigationHeader />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-zinc-900/40 to-zinc-950 border-b border-zinc-800/80 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Restaurant Management Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
            DinePulse Digital Restaurant Suite
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate customer wait times, prevent kitchen order errors, and streamline restaurant operations with table QR ordering, real-time staff dispatch, admin stock management, and owner analytics.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/table/1"
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Simulate Customer Scan (Table 1)</span>
            </Link>
            <Link
              href="/kitchen"
              className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Open Kitchen Display (KDS)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Feature Portals Showcase */}
      <div className="max-w-7xl mx-auto px-4 pt-12 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Explore Platform Views</h2>
          <p className="text-xs text-zinc-400">Click any card below to launch the interactive portal demo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${f.color} border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-zinc-950 text-zinc-400 border border-zinc-800">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>{f.title}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fully Functional & Connected to Database</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
