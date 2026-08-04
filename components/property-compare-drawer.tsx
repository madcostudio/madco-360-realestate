'use client';

import { useState } from 'react';
import { PropertyData } from '@/lib/mock-data';
import Link from 'next/link';
import { Layers, X, Compass, Check, ArrowRight } from 'lucide-react';

interface PropertyCompareDrawerProps {
  properties: PropertyData[];
}

export function PropertyCompareDrawer({ properties }: PropertyCompareDrawerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([properties[0]?.id || '']);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare up to 3 properties at a time.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparedItems = properties.filter((p) => selectedIds.includes(p.id));

  return (
    <>
      {/* Floating Bottom Bar Indicator */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-estate-card/90 backdrop-blur-xl border border-brass/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 hover:border-brass transition"
        >
          <Layers className="w-5 h-5 text-brass" />
          <span className="font-bold text-xs">Compare Listings ({selectedIds.length}/3)</span>
        </button>
      </div>

      {/* Comparison Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-estate-card border border-estate-border text-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-brass font-bold">Listing Comparison</span>
                <h3 className="text-2xl font-serif font-bold text-white">Compare Up to 3 Properties</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {properties.map((p) => {
                const isChecked = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleSelect(p.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                      isChecked
                        ? 'bg-brass text-slate-950 border-brass'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                    <span className="truncate max-w-[180px]">{p.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Comparison Side-by-Side Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xl font-bold font-mono text-brass block">
                      ₹{(item.price / 10000000).toFixed(2)} Cr
                    </span>
                    <h4 className="font-serif font-bold text-base text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.address}</p>
                  </div>

                  <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">BHK Specs:</span>
                      <span className="font-bold text-white">{item.bhk} BHK Suite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">360° Walkthrough:</span>
                      <span className="font-bold text-fern flex items-center space-x-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Available</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-slate-200 capitalize">{item.status}</span>
                    </div>
                  </div>

                  <Link
                    href={`/property/${item.slug}/tour`}
                    className="w-full py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs text-center transition flex items-center justify-center space-x-1"
                  >
                    <span>Launch 360 Tour</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
