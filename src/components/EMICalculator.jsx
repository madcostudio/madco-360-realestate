import React, { useState } from 'react';
import { Calculator, IndianRupee, PieChart, ShieldCheck, ArrowRight } from 'lucide-react';
import { calculateEMI, formatINR } from '../utils/formatters';

export default function EMICalculator({ initialPrice = 10000000 }) {
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const downPaymentAmount = (propertyPrice * downPaymentPct) / 100;
  const loanPrincipal = propertyPrice - downPaymentAmount;

  const { monthlyEMI, totalInterest, totalPayment, formattedEMI } = calculateEMI(
    loanPrincipal,
    interestRate,
    tenureYears
  );

  const principalPct = Math.round((loanPrincipal / totalPayment) * 100) || 50;
  const interestPct = 100 - principalPct;

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">

      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Home Loan EMI Calculator</h3>
            <p className="text-slate-400 text-xs">Estimate monthly payouts for Mangalore properties in ₹ INR</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* INPUT SLIDERS */}
        <div className="space-y-5">

          {/* Property Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Property Value</label>
              <span className="text-sm font-black text-amber-400">{formatINR(propertyPrice)}</span>
            </div>
            <input
              type="range"
              min={2000000}
              max={30000000}
              step={500000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Down Payment % */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Down Payment ({downPaymentPct}%)</label>
              <span className="text-xs font-bold text-slate-300">{formatINR(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Interest Rate % */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Interest Rate (% p.a.)</label>
              <span className="text-xs font-bold text-slate-300">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={7.0}
              max={12.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Tenure (Years) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loan Tenure</label>
              <span className="text-xs font-bold text-slate-300">{tenureYears} Years ({tenureYears * 12} Months)</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* RESULTS CARD & BREAKDOWN */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-6">

          <div className="text-center p-4 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 rounded-2xl border border-indigo-500/30">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block mb-1">
              Estimated Monthly EMI
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
              {formattedEMI}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Based on loan principal of {formatINR(loanPrincipal)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Interest</span>
              <span className="text-sm font-extrabold text-slate-200">{formatINR(totalInterest)}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Payable</span>
              <span className="text-sm font-extrabold text-slate-200">{formatINR(totalPayment)}</span>
            </div>
          </div>

          {/* VISUAL BREAKDOWN BAR */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-indigo-400">Principal ({principalPct}%)</span>
              <span className="text-amber-400">Interest ({interestPct}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalPct}%` }} className="bg-indigo-500 h-full" />
              <div style={{ width: `${interestPct}%` }} className="bg-amber-400 h-full" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
