'use client';

import { useState, useEffect } from 'react';
import { getCurrentAuth, AuthState } from '@/lib/auth';
import { PropertyData } from '@/lib/mock-data';
import {
  fetchAdminDashboardDataAction,
  updatePropertyStatusAction,
  togglePropertyFeaturedAction,
  AdminDashboardData,
} from '@/app/actions/admin-moderation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  Compass,
  Layers,
  Users,
  FileText,
  Loader2,
  RefreshCw,
  MessageSquare,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [auth, setAuth] = useState<AuthState>({ user: null, role: 'admin', isAuthenticated: true });
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<AdminDashboardData['recentEnquiries']>([]);
  const [metrics, setMetrics] = useState({
    totalListings: 0,
    pendingCount: 0,
    publishedCount: 0,
    enquiriesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [modLogs, setModLogs] = useState<Array<{ id: string; action: string; time: string }>>([
    { id: '1', action: 'Connected to live Supabase Postgres schema', time: 'Active' },
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboardDataAction();
      setProperties(data.properties);
      setRecentEnquiries(data.recentEnquiries);
      setMetrics({
        totalListings: data.totalListings,
        pendingCount: data.pendingCount,
        publishedCount: data.publishedCount,
        enquiriesCount: data.enquiriesCount,
      });
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAuth(getCurrentAuth());
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'published' | 'pending' | 'rejected') => {
    setActionLoadingId(id);
    try {
      const res = await updatePropertyStatusAction(id, newStatus);
      if (res.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        setMetrics((prev) => ({
          ...prev,
          pendingCount:
            newStatus === 'pending'
              ? prev.pendingCount + 1
              : Math.max(0, prev.pendingCount - 1),
          publishedCount:
            newStatus === 'published'
              ? prev.publishedCount + 1
              : prev.publishedCount - (properties.find((p) => p.id === id)?.status === 'published' ? 1 : 0),
        }));
        setModLogs((prev) => [
          {
            id: Date.now().toString(),
            action: `Set status to "${newStatus}" for listing ID ${id.slice(0, 8)}`,
            time: 'Just now',
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await togglePropertyFeaturedAction(id, !currentFeatured);
      if (res.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !currentFeatured } : p))
        );
        setModLogs((prev) => [
          {
            id: Date.now().toString(),
            action: `${!currentFeatured ? 'Featured' : 'Unfeatured'} listing ID ${id.slice(0, 8)} on homepage`,
            time: 'Just now',
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
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
            Live database moderation: approve pending properties, publish listings to public search, review captured leads, and attach 360° virtual tours.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-estate-card border border-estate-border hover:border-brass text-slate-300 hover:text-white transition"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/tour-builder/22222222-2222-2222-2222-222222222222"
            className="px-5 py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs shadow-lg shadow-brass/20 transition flex items-center space-x-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Tour Builder</span>
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Total Listings</span>
          <span className="text-3xl font-serif font-bold text-white mt-1 block">{metrics.totalListings}</span>
        </div>
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Pending Approvals</span>
          <span className="text-3xl font-serif font-bold text-amber-400 mt-1 block">
            {metrics.pendingCount}
          </span>
        </div>
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Published Live</span>
          <span className="text-3xl font-serif font-bold text-fern mt-1 block">{metrics.publishedCount}</span>
        </div>
        <div className="bg-estate-card border border-estate-border rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block">Database Lead Enquiries</span>
          <span className="text-3xl font-serif font-bold text-brass mt-1 block">{recentEnquiries.length}</span>
        </div>
      </div>

      {/* Section 1: Property Moderation & Approval Pipeline */}
      <section className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Live Listing Submissions & Moderation Queue</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Approve &amp; Publish&quot; to push pending owner submissions instantly to the public live marketplace.
            </p>
          </div>
          {loading && (
            <div className="flex items-center space-x-1 text-xs text-brass">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Syncing with Supabase...</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-3">Property Title</th>
                <th className="p-3">City & Locality</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3">
                    <span className="font-bold text-white block">{prop.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{prop.id}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-slate-300 block">{prop.city}</span>
                    <span className="text-[10px] text-slate-500">{prop.locality}</span>
                  </td>
                  <td className="p-3 font-mono text-brass">₹{(prop.price / 10000000).toFixed(2)} Cr</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prop.status === 'published'
                          ? 'bg-fern/20 text-fern border border-fern/40'
                          : prop.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleFeatured(prop.id, Boolean(prop.featured))}
                      className={`p-1 rounded-lg transition ${
                        prop.featured ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title="Toggle Featured on Homepage"
                    >
                      <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {actionLoadingId === prop.id ? (
                      <span className="text-xs text-brass flex items-center justify-end space-x-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating DB...</span>
                      </span>
                    ) : (
                      <>
                        {prop.status !== 'published' ? (
                          <button
                            onClick={() => handleUpdateStatus(prop.id, 'published')}
                            className="px-3 py-1.5 rounded-lg bg-fern hover:bg-fern-dark text-slate-950 font-bold transition inline-flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve &amp; Publish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(prop.id, 'pending')}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-600/40 text-amber-400 hover:bg-slate-800 text-[11px] font-semibold transition"
                          >
                            Unpublish
                          </button>
                        )}
                        {prop.status !== 'rejected' && prop.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateStatus(prop.id, 'rejected')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-red-900/50 text-red-400 hover:bg-red-950/40 text-[11px] font-semibold transition"
                          >
                            Reject
                          </button>
                        )}
                        <Link
                          href={`/property/${prop.slug}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition inline-block text-[11px]"
                        >
                          View Listing
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Recent Lead Enquiries & Moderation Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Lead Enquiries Table */}
        <div className="bg-estate-card border border-estate-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-brass" />
              <span>Recent Inquiries Captured</span>
            </h3>
            <span className="text-xs text-brass font-mono font-bold">{recentEnquiries.length} leads</span>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No visitor leads captured yet.</p>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{enq.visitor_name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-brass/20 text-brass">
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">&quot;{enq.message}&quot;</p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-brass" />
                      <span>{enq.visitor_phone}</span>
                    </span>
                    {enq.visitor_email && (
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-brass" />
                        <span>{enq.visitor_email}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Moderation Log */}
        <div className="bg-estate-card border border-estate-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-brass" />
            <span>Moderation Audit Activity</span>
          </h3>
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

