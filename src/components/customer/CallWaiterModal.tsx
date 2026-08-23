'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { BellRing, X, Droplets, Utensils, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
}

export default function CallWaiterModal({ isOpen, onClose, tableId }: CallWaiterModalProps) {
  const { t } = useLanguageStore();
  const [selectedType, setSelectedType] = useState<string>('HELP');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, type: selectedType }),
      });

      if (!res.ok) throw new Error('Request failed');
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Waiter alert error', err);
      alert('Could not notify waiter. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const options = [
    { type: 'WATER', label: t('waterRefill'), icon: Droplets, desc: t('waterDesc') },
    { type: 'CUTLERY', label: t('extraCutlery'), icon: Utensils, desc: t('cutleryDesc') },
    { type: 'HELP', label: t('generalAssistance'), icon: HelpCircle, desc: t('assistanceDesc') },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {sentSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-400">{t('waiterNotified')}</h3>
            <p className="text-xs text-zinc-400">{t('waiterOnWay')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('callTableWaiter')}</h3>
                <p className="text-xs text-zinc-400">{t('selectHelp')}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white ring-1 ring-amber-500/30'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`} />
                    <div>
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className="block text-[11px] text-zinc-400">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSendRequest}
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <BellRing className="w-4 h-4" />
              <span>{isSending ? t('alertingStaff') : t('sendAlert')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
