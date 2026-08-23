'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import NavigationHeader from '@/components/NavigationHeader';
import { Clock, ChefHat, CheckCircle2, Utensils, Star, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  notes: string | null;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  tableId: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID';
  totalAmount: number;
  notes: string | null;
  items: OrderItem[];
  table: {
    number: number;
  };
  createdAt: string;
}

export default function OrderStatusPage({ params }: { params: { tableId: string } }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { t } = useLanguageStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000); // Live poll order status
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (err) {
      console.error('Error loading order status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, rating, comment }),
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      console.error('Feedback error', err);
      alert('Could not submit feedback.');
    }
  };

  const stages = [
    { key: 'PENDING', label: t('orderReceived'), desc: t('orderSentDesc'), icon: Clock },
    { key: 'PREPARING', label: t('chefCooking'), desc: t('chefCookingDesc'), icon: ChefHat },
    { key: 'READY', label: t('platedReady'), desc: t('platedReadyDesc'), icon: Utensils },
    { key: 'SERVED', label: t('servedToTable'), desc: t('servedDesc'), icon: CheckCircle2 },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PREPARING':
        return 1;
      case 'READY':
        return 2;
      case 'SERVED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIndex = order ? getStageIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      <NavigationHeader />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/table/${params.tableId}`}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToMenu')}
          </Link>
          <span className="text-xs font-mono text-zinc-500">Order #{orderId?.substring(0, 8)}</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-500 animate-pulse">Loading live order tracker...</div>
        ) : !order ? (
          <div className="py-20 text-center text-zinc-500 space-y-3">
            <p className="text-base font-semibold">No active order found for this ticket.</p>
            <Link
              href={`/table/${params.tableId}`}
              className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
            >
              Browse Menu & Order
            </Link>
          </div>
        ) : (
          <>
            {/* Live Progress Pipeline Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">{t('liveStatus')}</span>
                  <h2 className="text-xl font-black">Table {order.table.number} {t('tracker')}</h2>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs">
                  {order.status}
                </div>
              </div>

              {/* Visual Pipeline Bar */}
              <div className="relative pt-2">
                <div className="grid grid-cols-4 gap-2">
                  {stages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/30 scale-110'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-zinc-950 text-zinc-600 border border-zinc-800'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span
                            className={`block text-[11px] font-bold ${
                              isCompleted ? 'text-zinc-100' : 'text-zinc-500'
                            }`}
                          >
                            {stage.label}
                          </span>
                          <span className="hidden sm:block text-[10px] text-zinc-500">{stage.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Receipt Items Summary */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('orderedItems')}</h3>
                <div className="space-y-2 divide-y divide-zinc-800/60">
                  {order.items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-zinc-200">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        {item.notes && <span className="block text-[10px] text-amber-400/90">Note: {item.notes}</span>}
                      </div>
                      <span className="font-bold text-zinc-300">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-sm font-bold">
                  <span className="text-zinc-400">{t('totalAmount')}</span>
                  <span className="text-amber-400 text-base">₹{order.totalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Post Meal Rating Feedback Card */}
            {order.status === 'SERVED' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>{t('rateExperience')}</span>
                </h3>

                {feedbackSubmitted ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-1">
                    <p className="text-sm font-bold text-emerald-400">{t('thankYouFeedback')}</p>
                    <p className="text-xs text-zinc-400">{t('feedbackImprove')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 justify-center py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('feedbackPlaceholder')}
                      rows={3}
                      className="w-full bg-zinc-950 text-xs p-3 rounded-xl border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t('submitFeedback')}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
