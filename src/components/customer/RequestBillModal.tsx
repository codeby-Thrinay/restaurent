'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CreditCard, Banknote, QrCode, X, CheckCircle2, Receipt } from 'lucide-react';

interface RequestBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  totalAmount: number;
}

export default function RequestBillModal({ isOpen, onClose, tableId, totalAmount }: RequestBillModalProps) {
  const { t } = useLanguageStore();
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH' | 'UPI'>('CARD');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestBill = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, type: 'BILL' }),
      });

      if (!res.ok) throw new Error('Bill request failed');
      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Bill request error', err);
      alert('Could not request bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const perPerson = totalAmount / splitCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {requestSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-amber-400">{t('billRequested')}</h3>
            <p className="text-xs text-zinc-400">
              {t('serverBringingBill')} <strong>₹{totalAmount.toFixed(0)}</strong>
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('requestTableBill')}</h3>
                <p className="text-xs text-zinc-400">{t('selectPayment')}</p>
              </div>
            </div>

            {/* Total summary */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">{t('totalBillAmount')}</span>
              <span className="text-xl font-black text-amber-400">₹{totalAmount.toFixed(0)}</span>
            </div>

            {/* Split bill calculator */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">{t('splitBill')}</label>
              <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSplitCount((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{splitCount}</span>
                  <button
                    onClick={() => setSplitCount((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-300 font-semibold">
                  ₹{perPerson.toFixed(0)} <span className="text-zinc-500 font-normal">/ {t('person')}</span>
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">{t('paymentOption')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CARD', label: t('cardPos'), icon: CreditCard },
                  { id: 'CASH', label: t('cashOnTable'), icon: Banknote },
                  { id: 'UPI', label: t('upiQr'), icon: QrCode },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as 'CARD' | 'CASH' | 'UPI')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleRequestBill}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Receipt className="w-4 h-4" />
              <span>{isSubmitting ? t('requesting') : t('requestPrintedBill')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
