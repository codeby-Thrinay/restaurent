'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, ChefHat, UserCheck, Settings, BarChart3, QrCode, Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function NavigationHeader() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguageStore();

  const links = [
    { name: t('customerMenu'), href: '/table/1', icon: UtensilsCrossed, badge: 'QR Scan' },
    { name: t('kitchenKds'), href: '/kitchen', icon: ChefHat, badge: 'Live Tickets' },
    { name: t('staffFloor'), href: '/staff', icon: UserCheck, badge: 'Waiters' },
    { name: t('adminPortal'), href: '/admin', icon: Settings, badge: 'Menu & Stock' },
    { name: t('qrCodes'), href: '/admin/qr', icon: QrCode, badge: 'Print' },
    { name: t('ownerAnalytics'), href: '/owner', icon: BarChart3, badge: 'Insights' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                DinePulse
              </span>
              <span className="block text-[10px] uppercase font-semibold text-zinc-400 -mt-1 tracking-widest">
                {t('digitalDining')}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle & Quick Demo Switcher */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  language === 'en' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  language === 'hi' ? 'bg-amber-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇮🇳 हिंदी
              </button>
            </div>

            <Link
              href="/table/1"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{t('simulateTableScan')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Links Bar */}
      <div className="md:hidden flex items-center justify-around bg-zinc-900 border-t border-zinc-800 px-2 py-2 text-[10px]">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 p-1 rounded ${
                isActive ? 'text-amber-400 font-bold' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.badge}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
