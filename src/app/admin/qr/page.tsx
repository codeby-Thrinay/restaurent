'use client';

import { useState, useEffect } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { QrCode, Printer, ExternalLink, UtensilsCrossed } from 'lucide-react';
import QRCodeCanvas from 'qrcode';

interface Table {
  id: string;
  number: number;
  capacity: number;
  section: string;
}

export default function AdminQRGeneratorPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [qrDataUrls, setQrDataUrls] = useState<Record<number, string>>({});
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      const data: Table[] = await res.json();
      setTables(data);
      generateQRCodes(data);
    } catch (err) {
      console.error('Failed to load tables', err);
    }
  };

  const generateQRCodes = async (tableList: Table[]) => {
    const urls: Record<number, string> = {};
    const base = window.location.origin;

    for (const table of tableList) {
      const tableUrl = `${base}/table/${table.number}`;
      try {
        const dataUrl = await QRCodeCanvas.toDataURL(tableUrl, {
          width: 300,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' },
        });
        urls[table.number] = dataUrl;
      } catch (err) {
        console.error('QR generation error for table', table.number, err);
      }
    }
    setQrDataUrls(urls);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-16">
      <div className="print:hidden">
        <NavigationHeader />
      </div>

      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Printable Table QR Generator</h1>
              <p className="text-xs text-zinc-400">Generate high-resolution QR cards for each dining table</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" /> Print QR Table Stand Cards
          </button>
        </div>
      </div>

      {/* QR Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => {
            const qrDataUrl = qrDataUrls[table.number];
            const targetUrl = `${origin}/table/${table.number}`;

            return (
              <div
                key={table.id}
                className="bg-white text-zinc-950 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4 border-2 border-amber-500/30 print:break-inside-avoid print:shadow-none print:border-zinc-300"
              >
                {/* Branding Top */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-sm">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-lg tracking-tight">DinePulse</span>
                </div>

                {/* Table Callout */}
                <div className="py-1 px-4 bg-zinc-950 text-amber-400 rounded-full font-black text-sm tracking-wider uppercase">
                  Table {table.number} ({table.section})
                </div>

                {/* QR Canvas Code */}
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt={`QR Code Table ${table.number}`} className="w-44 h-44 object-contain mx-auto" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-zinc-400">
                      Generating...
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-800">Scan to View Menu & Order Food</p>
                  <p className="text-[10px] text-zinc-500 font-mono underline truncate max-w-[200px]">
                    {targetUrl}
                  </p>
                </div>

                {/* Test Link Button */}
                <a
                  href={`/table/${table.number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="print:hidden w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Table {table.number} Menu</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
