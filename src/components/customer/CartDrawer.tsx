'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { ShoppingBag, X, Plus, Minus, Trash2, Send, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
}

export default function CartDrawer({ isOpen, onClose, tableId }: CartDrawerProps) {
  const router = useRouter();
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const { items, updateQuantity, updateNotes, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity, notes: i.notes })),
          notes: orderNotes,
        }),
      });

      if (!res.ok) throw new Error('Order submission failed');

      const data = await res.json();
      clearCart();
      onClose();
      router.push(`/table/${tableId}/status?orderId=${data.id}`);
    } catch (err) {
      console.error('Order error', err);
      alert('Could not place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div
        className={`w-full max-w-md border-l h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold">{t('yourTableOrder')}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 divide-y ${isDark ? 'divide-zinc-800/60' : 'divide-slate-200'}`}>
          {items.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto opacity-30 stroke-1" />
              <p className="text-sm font-medium">{t('cartEmpty')}</p>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{t('cartEmptySub')}</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}
                    />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm text-amber-500">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>

                {/* Quantity Controls & Notes */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className={`flex items-center gap-1.5 rounded-lg p-1 ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className={`w-6 h-6 rounded flex items-center justify-center ${isDark ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-slate-200 text-slate-700'}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className={`w-6 h-6 rounded flex items-center justify-center ${isDark ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-slate-200 text-slate-700'}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Item note"
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    className={`flex-1 text-xs px-2.5 py-1 rounded border focus:outline-none focus:border-amber-500/50 ${
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-300 placeholder-zinc-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className={`p-4 border-t space-y-4 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <label className={`text-xs font-semibold flex items-center gap-1 mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                <MessageSquare className="w-3.5 h-3.5" /> {t('kitchenNotes')}
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={t('kitchenNotesPlaceholder')}
                rows={2}
                className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:border-amber-500 ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className={`flex items-center justify-between text-sm font-semibold border-t pt-3 ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>{t('totalOrderAmount')}</span>
              <span className="text-xl font-black text-amber-500">₹{totalPrice.toFixed(0)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('sendingToKitchen') : t('sendToKitchen')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
