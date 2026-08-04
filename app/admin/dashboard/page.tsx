'use client';

import { useState, useEffect } from 'react';
import { getCurrentAuth, AuthState, isAdmin } from '@/lib/auth';
import { DEMO_PROPERTIES_LIST, DEMO_ENQUIRIES, DEMO_CAPTURE_BOOKINGS, DEMO_USERS, PropertyData } from '@/lib/mock-data';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, XCircle, Star, Compass, Layers, Users, FileText, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [auth, setAuth] = useState<AuthState>({ user: null, role: 'admin', isAuthenticated: true });
  const [properties, setProperties] = useState<PropertyData[]>(DEMO_PROPERTIES_LIST);
  const [modLogs, setModLogs] = useState<Array<{ id: string; action: string; time: string }>>([
    { id: '1', action: 'Approved listing "Luxury 2BHK Penthouse"', time: '10 mins ago' },
    { id: '2', action: 'Attached 360° Tour to property ID 11111111', time: '1 hour ago' },
  ]);

  useEffect(() => {
    setAuth(getCurrentAuth());
  }, []);

  const handleApproveProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'published' as const } : p))
    );
    setModLogs((prev) => [
      { id: Date.now().toString(), action: `Approved property ID ${id.slice(0, 8)}`, time: 'Just now' },
      ...prev,
    ]);
  };

  const handleToggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-brass text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-brass" />
            <span>Madco Estates Staff Command Center</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">Admin Dashboard & Moderation Pipeline</h1>
          <p className="text-slate-400 text-xs mt-1">
            Approve listings, manage 360° tour scene attachments, schedule capture visits, and monitor system audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/tour-builder/22222222-2222-2222-2222-222222222222"
            className="px-5 py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs shadow-lg shadow-brass/20 transition flex items-center space-x-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Visual Tour Builder</span>
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Total Listings</span>
          <span className="text-3xl font-serif font-bold text-white mt-1 block">{properties.length}</span>
        </div>
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Pending Approvals</span>
          <span className="text-3xl font-serif font-bold text-amber-400 mt-1 block">
            {properties.filter((p) => p.status === 'pending' || p.status === 'draft').length}
          </span>
        </div>
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Capture Bookings</span>
          <span className="text-3xl font-serif font-bold text-fern mt-1 block">{DEMO_CAPTURE_BOOKINGS.length}</span>
        </div>
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Total Lead Enquiries</span>
          <span className="text-3xl font-serif font-bold text-brass mt-1 block">{DEMO_ENQUIRIES.length}</span>
        </div>
      </div>

      {/* Section 1: Property Moderation & Approval Pipeline */}
      <section className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-xl font-serif font-bold text-white">Listing Submissions Approval Queue</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-3">Property Title</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 font-bold text-white">{prop.title}</td>
                  <td className="p-3 font-mono text-brass">₹{(prop.price / 10000000).toFixed(2)} Cr</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prop.status === 'published' ? 'bg-fern/20 text-fern border border-fern/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleFeatured(prop.id)}
                      className={`p-1 rounded-lg transition ${
                        prop.featured ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title="Toggle Featured on Homepage"
                    >
                      <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {prop.status !== 'published' && (
                      <button
                        onClick={() => handleApproveProperty(prop.id)}
                        className="px-3 py-1.5 rounded-lg bg-fern hover:bg-fern-dark text-slate-950 font-bold transition inline-flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    <Link
                      href={`/admin/tour-builder/${prop.tour_id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-brass font-bold hover:bg-slate-800 transition inline-flex items-center space-x-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Tour Editor</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Users & Moderation Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Accounts Overview */}
        <div className="bg-estate-card border border-estate-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-serif font-bold text-white">Registered Users & Role Matrix</h3>
          <div className="space-y-3">
            {Object.values(DEMO_USERS).map((user) => (
              <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{user.full_name}</h4>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brass/20 text-brass border border-brass/40">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Moderation Log */}
        <div className="bg-estate-card border border-estate-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-serif font-bold text-white">System Moderation Audit Log</h3>
          <div className="space-y-3">
            {modLogs.map((log) => (
              <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-200">{log.action}</span>
                <span className="text-slate-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
