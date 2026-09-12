'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, ChefHat, UserCheck, Settings, BarChart3, QrCode, Sun, Moon } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function NavigationHeader() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  const isDark = theme === 'dark';

  const links = [
    { name: 'Customer Tables', href: '/table', icon: UtensilsCrossed, badge: 'All Tables' },
    { name: t('kitchenKds'), href: '/kitchen', icon: ChefHat, badge: 'Live Tickets' },
    { name: t('staffFloor'), href: '/staff', icon: UserCheck, badge: 'Waiters' },
    { name: t('adminPortal'), href: '/admin', icon: Settings, badge: 'Menu & Stock' },
    { name: t('qrCodes'), href: '/admin/qr', icon: QrCode, badge: 'Print' },
    { name: t('ownerAnalytics'), href: '/owner', icon: BarChart3, badge: 'Insights' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-zinc-950/90 border-zinc-800 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                DinePulse
              </span>
              <span
                className={`block text-[10px] uppercase font-semibold -mt-1 tracking-widest ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                {t('digitalDining')}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold'
                      : isDark
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Theme Toggle + Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
                  : 'bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Language Switcher */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  language === 'hi'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇮🇳 हिंदी
              </button>
            </div>

            <Link
              href="/table"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{t('simulateTableScan')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Links Bar */}
      <div
        className={`md:hidden flex items-center justify-around border-t px-2 py-2 text-[10px] ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 p-1 rounded ${
                isActive ? 'text-amber-500 font-bold' : isDark ? 'text-zinc-400' : 'text-slate-600'
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
