'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import NavigationHeader from '@/components/NavigationHeader';
import CartDrawer from '@/components/customer/CartDrawer';
import CallWaiterModal from '@/components/customer/CallWaiterModal';
import RequestBillModal from '@/components/customer/RequestBillModal';
import { Search, BellRing, Receipt, Flame, Leaf, Sparkles, Check, ChevronRight, Info } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  spicyLevel: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
}

interface TableDetails {
  id: string;
  number: number;
  capacity: number;
  section: string;
  status: 'VACANT' | 'OCCUPIED' | 'BILL_REQUESTED' | 'NEEDS_CLEANING';
}

export default function CustomerTableMenuPage({ params }: { params: { tableId: string } }) {
  const tableNumber = params.tableId;
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [categories, setCategories] = useState<Category[]>([]);
  const [tableInfo, setTableInfo] = useState<TableDetails | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEG' | 'NONVEG'>('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Cart store
  const { addItem, getTotalCount, getTotalPrice, items: cartItems, setTable } = useCartStore();

  useEffect(() => {
    setTable(params.tableId, parseInt(params.tableId));
    fetchMenu();
    fetchTableStatus();

    const interval = setInterval(fetchTableStatus, 3000); // Live poll table status
    return () => clearInterval(interval);
  }, [params.tableId]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error loading menu', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableStatus = async () => {
    try {
      const res = await fetch(`/api/tables/${params.tableId}`);
      if (res.ok) {
        const data = await res.json();
        setTableInfo(data);
      }
    } catch (err) {
      console.error('Error loading table status', err);
    }
  };

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  const allDishes = categories.flatMap((cat) => cat.items);

  const filteredDishes = allDishes.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDietary =
      dietaryFilter === 'ALL' || (dietaryFilter === 'VEG' ? dish.isVeg : !dish.isVeg);
    const matchesCategory =
      activeCategory === 'ALL' || dish.categoryId === activeCategory;

    return matchesSearch && matchesDietary && matchesCategory;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'VACANT':
        return {
          label: t('vacantStatus'),
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'OCCUPIED':
        return {
          label: t('occupiedStatus'),
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          dot: 'bg-blue-400',
        };
      case 'BILL_REQUESTED':
        return {
          label: t('billRequestedStatus'),
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse',
          dot: 'bg-amber-400',
        };
      case 'NEEDS_CLEANING':
        return {
          label: t('needsCleaningStatus'),
          color: 'bg-red-500/20 text-red-400 border-red-500/40',
          dot: 'bg-red-400',
        };
      default:
        return {
          label: t('occupiedStatus'),
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          dot: 'bg-blue-400',
        };
    }
  };

  const statusBadge = getStatusBadge(tableInfo?.status);

  return (
    <div
      className={`min-h-screen font-sans pb-24 transition-colors ${
        isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <NavigationHeader />

      {/* Table Banner Header */}
      <div
        className={`border-b px-4 py-6 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900/60 to-zinc-950 border-zinc-800/80'
            : 'bg-gradient-to-b from-amber-500/10 via-slate-100 to-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              {tableNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-500">{t('digitalDining')}</span>
                
                {/* Live Table Status Badge */}
                <div
                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold flex items-center gap-1.5 ${statusBadge.color}`}
                  title={`${t('tableStatus')}: ${statusBadge.label}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                  <span>{t('tableStatus')}: {statusBadge.label}</span>
                </div>
              </div>

              <h1 className="text-xl font-extrabold tracking-tight mt-0.5">
                {t('tableMenu')} - {tableNumber} {tableInfo?.section ? `(${tableInfo.section})` : ''}
              </h1>
            </div>
          </div>

          {/* Table Action Quick Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsWaiterModalOpen(true)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <BellRing className="w-4 h-4 text-amber-500" />
              <span>{t('callWaiter')}</span>
            </button>
            <button
              onClick={() => setIsBillModalOpen(true)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4 text-emerald-500" />
              <span>{t('requestBill')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Dietary Filters Container */}
      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-inner border ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category Tabs & Veg/Non-Veg Filter */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'ALL'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                  : isDark
                  ? 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {t('allItems')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                    : isDark
                    ? 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div
            className={`flex items-center gap-1 p-1 rounded-xl border shrink-0 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                dietaryFilter === 'ALL'
                  ? isDark
                    ? 'bg-zinc-800 text-white'
                    : 'bg-slate-200 text-slate-900'
                  : 'text-zinc-500'
              }`}
            >
              {t('all')}
            </button>
            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                dietaryFilter === 'VEG' ? 'bg-emerald-500/20 text-emerald-500 font-bold' : 'text-zinc-500'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-500" /> {t('veg')}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dishes Grid */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-32 rounded-2xl animate-pulse border ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-200/60 border-slate-300'
                }`}
              />
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 space-y-2">
            <Sparkles className="w-10 h-10 mx-auto opacity-30 stroke-1" />
            <p className="text-sm font-medium">No dishes match your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDishes.map((dish) => {
              const inCartCount = cartItems.find((i) => i.id === dish.id)?.quantity || 0;
              return (
                <div
                  key={dish.id}
                  className={`border rounded-2xl p-3.5 flex gap-3 transition-all hover:shadow-xl group ${
                    isDark
                      ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700/80'
                      : 'bg-white border-slate-200 hover:border-amber-500/40 shadow-sm'
                  }`}
                >
                  {/* Dish Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-950 shrink-0">
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        No Image
                      </div>
                    )}
                    <div
                      className={`absolute top-1.5 left-1.5 w-4 h-4 rounded-md flex items-center justify-center border bg-zinc-950 ${
                        dish.isVeg ? 'border-emerald-500' : 'border-red-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                  </div>

                  {/* Dish Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3
                          className={`font-bold text-sm transition-colors ${
                            isDark
                              ? 'text-zinc-100 group-hover:text-amber-400'
                              : 'text-slate-900 group-hover:text-amber-600'
                          }`}
                        >
                          {dish.name}
                        </h3>
                        <span className="font-extrabold text-sm text-amber-500 whitespace-nowrap">
                          ₹{dish.price.toFixed(0)}
                        </span>
                      </div>

                      <p
                        className={`text-[12px] line-clamp-2 mt-0.5 leading-snug ${
                          isDark ? 'text-zinc-400' : 'text-slate-500'
                        }`}
                      >
                        {dish.description}
                      </p>

                      {dish.spicyLevel > 0 && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: dish.spicyLevel }).map((_, i) => (
                            <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500" />
                          ))}
                          <span className="text-[10px] text-red-500 font-semibold ml-1">
                            {dish.spicyLevel === 1 ? 'Mild' : dish.spicyLevel === 2 ? 'Medium' : 'Hot'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        {dish.isAvailable ? t('inStock') : t('soldOut')}
                      </span>

                      {dish.isAvailable && (
                        <button
                          onClick={() =>
                            addItem({
                              id: dish.id,
                              name: dish.name,
                              price: dish.price,
                              image: dish.image,
                              isVeg: dish.isVeg,
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            inCartCount > 0
                              ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                          }`}
                        >
                          {inCartCount > 0 ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> {t('added')} ({inCartCount})
                            </>
                          ) : (
                            t('addDish')
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating View Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-bold shadow-2xl shadow-amber-500/40 flex items-center justify-between group hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 text-amber-400 flex items-center justify-center text-xs font-extrabold">
                {totalCount}
              </div>
              <span className="text-sm font-black tracking-wide">{t('viewOrderTicket')}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-black">₹{totalPrice.toFixed(0)}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* Slide-over & Popups */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} tableId={params.tableId} />
      <CallWaiterModal isOpen={isWaiterModalOpen} onClose={() => setIsWaiterModalOpen(false)} tableId={params.tableId} />
      <RequestBillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        tableId={params.tableId}
        totalAmount={totalPrice}
      />
    </div>
  );
}
