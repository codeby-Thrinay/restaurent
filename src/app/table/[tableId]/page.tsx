'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import NavigationHeader from '@/components/NavigationHeader';
import CartDrawer from '@/components/customer/CartDrawer';
import CallWaiterModal from '@/components/customer/CallWaiterModal';
import RequestBillModal from '@/components/customer/RequestBillModal';
import { Search, BellRing, Receipt, Flame, Leaf, Sparkles, Check, ChevronRight } from 'lucide-react';

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

export default function CustomerTableMenuPage({ params }: { params: { tableId: string } }) {
  const tableNumber = params.tableId;
  const { t } = useLanguageStore();
  const [categories, setCategories] = useState<Category[]>([]);
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24">
      <NavigationHeader />

      {/* Table Banner Header */}
      <div className="bg-gradient-to-b from-amber-500/10 via-zinc-900/60 to-zinc-950 border-b border-zinc-800/80 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              {tableNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">{t('digitalDining')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">{t('tableMenu')} - {tableNumber}</h1>
            </div>
          </div>

          {/* Table Action Quick Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWaiterModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-all shadow"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t('callWaiter')}</span>
            </button>
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-all shadow"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t('requestBill')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Dietary Filters Container */}
      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
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
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
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
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 shrink-0">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                dietaryFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
              }`}
            >
              {t('all')}
            </button>
            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                dietaryFilter === 'VEG' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-zinc-500'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-400" /> {t('veg')}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dishes Grid */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-zinc-900/60 rounded-2xl animate-pulse border border-zinc-800" />
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
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-3.5 flex gap-3 transition-all hover:shadow-xl group"
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
                        <h3 className="font-bold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {dish.name}
                        </h3>
                        <span className="font-extrabold text-sm text-amber-400 whitespace-nowrap">
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-[12px] text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                        {dish.description}
                      </p>

                      {dish.spicyLevel > 0 && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: dish.spicyLevel }).map((_, i) => (
                            <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500" />
                          ))}
                          <span className="text-[10px] text-red-400 font-semibold ml-1">
                            {dish.spicyLevel === 1 ? 'Mild' : dish.spicyLevel === 2 ? 'Medium' : 'Hot'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
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
              <span className="text-base font-black">${totalPrice.toFixed(2)}</span>
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
