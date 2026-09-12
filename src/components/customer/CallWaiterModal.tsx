'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { BellRing, Droplets, Utensils, HelpCircle, X, CheckCircle2 } from 'lucide-react';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
}

export default function CallWaiterModal({ isOpen, onClose, tableId }: CallWaiterModalProps) {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [requestType, setRequestType] = useState<'WATER' | 'CUTLERY' | 'HELP'>('WATER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!isOpen) return null;

  const handleSendRequest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, type: requestType }),
      });

      if (!res.ok) throw new Error('Request failed');
      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Call waiter error', err);
      alert('Could not notify waiter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    {
      id: 'WATER',
      title: t('waterRefill'),
      desc: t('waterDesc'),
      icon: Droplets,
      color: 'text-blue-400',
    },
    {
      id: 'CUTLERY',
      title: t('extraCutlery'),
      desc: t('cutleryDesc'),
      icon: Utensils,
      color: 'text-amber-400',
    },
    {
      id: 'HELP',
      title: t('generalAssistance'),
      desc: t('assistanceDesc'),
      icon: HelpCircle,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm border rounded-2xl p-5 space-y-4 shadow-2xl relative transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {requestSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-400">{t('waiterNotified')}</h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t('waiterOnWay')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">{t('callTableWaiter')}</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t('selectHelp')}</p>
              </div>
            </div>

            <div className="space-y-2">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = requestType === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => setRequestType(opt.id as 'WATER' | 'CUTLERY' | 'HELP')}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/40'
                        : isDark
                        ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${opt.color}`} />
                    <div>
                      <h4 className="font-bold text-xs">{opt.title}</h4>
                      <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSendRequest}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <BellRing className="w-4 h-4" />
              <span>{isSubmitting ? t('alertingStaff') : t('sendAlert')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
