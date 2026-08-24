'use client';

import { useState, useEffect } from 'react';
import { PropertyData } from '@/lib/mock-data';
import {
  fetchAdminDashboardDataAction,
  updatePropertyStatusAction,
  togglePropertyFeaturedAction,
  AdminDashboardData,
  updatePropertyTourUrlAction,
  updatePropertyDetailsAction,
  UpdatePropertyDetailsPayload,
  uploadPropertyImageAction,
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
  ExternalLink,
  Link2,
  Pencil,
  Sparkles,
  Search,
  Eye,
} from 'lucide-react';
import { ImageCropper } from '@/components/image-cropper';

export default function AdminDashboardPage() {
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
  const [editingTourProp, setEditingTourProp] = useState<PropertyData | null>(null);
  const [tourUrlInput, setTourUrlInput] = useState('');
  const [tourSaveError, setTourSaveError] = useState<string | null>(null);
  const [savingTourUrl, setSavingTourUrl] = useState(false);

  // Edit Listing state
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdatePropertyDetailsPayload>({
    title: '',
    price: 0,
    bhk: 2,
    address: '',
    city: '',
    locality: '',
    status: 'published',
    description: '',
    cover_image: '',
    featured: false,
    contact_phone: '',
    carpet_area: '',
    map_url: '',
  });
  const [savingPropertyEdit, setSavingPropertyEdit] = useState(false);
  const [propertyEditError, setPropertyEditError] = useState<string | null>(null);

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

  const handleOpenTourEdit = (prop: PropertyData) => {
    setEditingTourProp(prop);
    setTourUrlInput(prop.external_tour_url || '');
    setTourSaveError(null);
  };

  const handleSaveTourUrl = async () => {
    if (!editingTourProp) return;
    setSavingTourUrl(true);
    setTourSaveError(null);

    try {
      const res = await updatePropertyTourUrlAction(editingTourProp.id, tourUrlInput);
      if (!res.success) {
        setTourSaveError(res.error || 'Failed to update 360° Tour Link');
        return;
      }

      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingTourProp.id
            ? {
                ...p,
                external_tour_url: tourUrlInput.trim() || undefined,
                external_tour_provider: res.provider,
              }
            : p
        )
      );

      setModLogs((prev) => [
        {
          id: Date.now().toString(),
          action: tourUrlInput.trim()
            ? `Attached 360° Tour (${res.provider || 'external'}) to listing ID ${editingTourProp.id.slice(0, 8)}`
            : `Removed 360° Tour from listing ID ${editingTourProp.id.slice(0, 8)}`,
          time: 'Just now',
        },
        ...prev,
      ]);

      setEditingTourProp(null);
    } catch (err: any) {
      setTourSaveError(err.message || 'An error occurred while saving.');
    } finally {
      setSavingTourUrl(false);
    }
  };

  const handleOpenEditProperty = (prop: PropertyData) => {
    setEditingProperty(prop);
    setEditForm({
      title: prop.title || '',
      price: prop.price || 0,
      bhk: prop.bhk || 2,
      address: prop.address || '',
      city: prop.city || '',
      locality: prop.locality || prop.address || '',
      status: prop.status || 'draft',
      description: prop.description || '',
      cover_image: prop.cover_image || '',
      featured: Boolean(prop.featured),
      contact_phone: prop.contact_phone || '',
      carpet_area: prop.carpet_area || '',
      map_url: prop.map_url || '',
    });
    setPropertyEditError(null);
  };

  const handleSavePropertyEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProperty) return;
    setSavingPropertyEdit(true);
    setPropertyEditError(null);

    try {
      if (editForm.contact_phone) {
        const phoneClean = editForm.contact_phone.replace(/[^0-9]/g, '');
        if (phoneClean.length < 10) {
          setPropertyEditError('Agent Phone Number must contain at least 10 digits.');
          setSavingPropertyEdit(false);
          return;
        }
      }

      const res = await updatePropertyDetailsAction(editingProperty.id, editForm);
      if (!res.success) {
        setPropertyEditError(res.error || 'Failed to update property listing details.');
        return;
      }

      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingProperty.id
            ? {
                ...p,
                ...editForm,
              }
            : p
        )
      );

      setModLogs((prev) => [
        {
          id: Date.now().toString(),
          action: `Updated listing info for "${editForm.title}" (ID: ${editingProperty.id.slice(0, 8)})`,
          time: 'Just now',
        },
        ...prev,
      ]);

      setEditingProperty(null);
    } catch (err: any) {
      setPropertyEditError(err.message || 'An error occurred while saving.');
    } finally {
      setSavingPropertyEdit(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060608] text-slate-100 p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>ESTATES.MADCO.IN • STAFF COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
            Admin Dashboard &amp; Moderation
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            Live database moderation: approve pending properties, publish listings to public search, review captured leads, and attach 360° virtual tours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-sky-400/40 text-slate-200 hover:text-white transition shadow-sm"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
          
          <Link
            href="/admin/content"
            className="px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 hover:text-white font-mono text-xs font-bold transition flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Edit Hero Copy</span>
          </Link>

          <Link
            href="/admin/tour-builder/22222222-2222-2222-2222-222222222222"
            className="btn-hero-accent text-xs !py-2.5 !px-5 flex items-center space-x-2 shadow-glow-cyan"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Tour Builder</span>
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block">Total Listings</span>
          <span className="text-3xl font-display font-bold text-white mt-1 block">{metrics.totalListings}</span>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] text-amber-300 uppercase font-mono tracking-wider block">Pending Approvals</span>
          <span className="text-3xl font-display font-bold text-amber-400 mt-1 block">
            {metrics.pendingCount}
          </span>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] text-emerald-300 uppercase font-mono tracking-wider block">Published Live</span>
          <span className="text-3xl font-display font-bold text-emerald-400 mt-1 block">{metrics.publishedCount}</span>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] text-sky-300 uppercase font-mono tracking-wider block">Database Lead Enquiries</span>
          <span className="text-3xl font-display font-bold text-sky-400 mt-1 block">{recentEnquiries.length}</span>
        </div>
      </div>

      {/* Section 1: Property Moderation & Approval Pipeline */}
      <section className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight">Live Listing Submissions &amp; Moderation Queue</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Approve &amp; Publish&quot; to push pending owner submissions instantly to the public live marketplace.
            </p>
          </div>
          {loading && (
            <div className="flex items-center space-x-1.5 text-xs text-sky-400 font-mono">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Syncing with Supabase...</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.04] border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3.5">Property Title</th>
                <th className="p-3.5">City &amp; Locality</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">360° Tour</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-white block text-sm">{prop.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{prop.id}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-200 block font-medium">{prop.city}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{prop.locality}</span>
                  </td>
                  <td className="p-3.5 font-mono text-sky-300 font-bold">
                    {prop.price === 0 ? 'Price on Req' : `₹${(prop.price / 10000000).toFixed(2)} Cr`}
                  </td>
                  <td className="p-3.5">
                    {prop.external_tour_url ? (
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                          {prop.external_tour_provider || '360° Tour'}
                        </span>
                        <button
                          onClick={() => handleOpenTourEdit(prop)}
                          className="p-1 text-slate-400 hover:text-sky-300 hover:bg-white/10 rounded transition"
                          title="Edit 360° Tour URL"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenTourEdit(prop)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition flex items-center space-x-1"
                      >
                        <Link2 className="w-3 h-3 text-sky-400" />
                        <span>Attach Tour</span>
                      </button>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        prop.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : prop.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleFeatured(prop.id, Boolean(prop.featured))}
                      className={`p-1.5 rounded-lg transition ${
                        prop.featured ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title="Toggle Featured on Homepage"
                    >
                      <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {actionLoadingId === prop.id ? (
                      <span className="text-xs text-sky-400 font-mono flex items-center justify-end space-x-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating DB...</span>
                      </span>
                    ) : (
                      <>
                        {prop.status !== 'published' ? (
                          <button
                            onClick={() => handleUpdateStatus(prop.id, 'published')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition inline-flex items-center space-x-1 shadow-sm text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve &amp; Publish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(prop.id, 'pending')}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-amber-400/30 text-amber-300 hover:bg-amber-400/10 text-[11px] font-semibold transition"
                          >
                            Unpublish
                          </button>
                        )}
                        {prop.status !== 'rejected' && prop.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateStatus(prop.id, 'rejected')}
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[11px] font-semibold transition"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditProperty(prop)}
                          className="px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[11px] font-bold transition inline-flex items-center space-x-1"
                          title="Edit property listing info"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <Link
                          href={`/property/${prop.slug}`}
                          className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition inline-block text-[11px]"
                        >
                          View
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
        <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <span>Real Customer Inquiries ({recentEnquiries.length})</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Live DB Sync
            </span>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No inquiries logged yet in Supabase.</p>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{enq.visitor_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(enq.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center space-x-1 font-mono">
                      <Phone className="w-3 h-3 text-sky-400" />
                      <span>{enq.visitor_phone}</span>
                    </span>
                    {enq.visitor_email && (
                      <span className="flex items-center space-x-1 font-mono">
                        <Mail className="w-3 h-3 text-sky-400" />
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
        <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Moderation Audit Activity</span>
          </h3>
          <div className="space-y-3">
            {modLogs.map((log) => (
              <div key={log.id} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-300">{log.action}</span>
                <span className="text-slate-500 font-mono text-[10px]">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 360° Tour Link Edit Modal */}
      {editingTourProp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <Compass className="w-5 h-5 text-sky-400" />
                <h3 className="font-display font-bold text-lg text-white">Attach 360° Virtual Tour</h3>
              </div>
              <button
                onClick={() => setEditingTourProp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">
                Property: <span className="text-white font-bold">{editingTourProp.title}</span>
              </p>
              <p className="text-[11px] text-slate-500 font-mono">{editingTourProp.address}, {editingTourProp.city}</p>
            </div>

            {tourSaveError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {tourSaveError}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">360° Tour Embed Link</label>
              <input
                type="url"
                value={tourUrlInput}
                onChange={(e) => setTourUrlInput(e.target.value)}
                placeholder="https://pano.cool/@handle/project or Kuula/Matterport embed URL"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono transition"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                Paste the shareable/embed link to this property&apos;s 360° tour (Panocool, Kuula, Matterport, YouTube 360, etc.).
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setEditingTourProp(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTourUrl}
                disabled={savingTourUrl}
                className="btn-hero-accent text-xs !py-2 !px-5 shadow-glow-cyan"
              >
                {savingTourUrl ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to DB...</span>
                  </>
                ) : (
                  <span>Save 360° Tour Link</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Details Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">Edit Property Listing</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {editingProperty.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProperty(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {propertyEditError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {propertyEditError}
              </div>
            )}

            <form onSubmit={handleSavePropertyEdit} className="space-y-4">
              {/* Property Title */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Luxury 3BHK Oceanfront Penthouse"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                />
              </div>

              {/* City, Locality & BHK */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="e.g. Mangalore"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Locality</label>
                  <input
                    type="text"
                    value={editForm.locality || ''}
                    onChange={(e) => setEditForm({ ...editForm, locality: e.target.value })}
                    placeholder="e.g. Kadri"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">BHK Configuration</label>
                  <select
                    value={editForm.bhk}
                    onChange={(e) => setEditForm({ ...editForm, bhk: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                    <option value={5}>5+ BHK Villa / Penthouse</option>
                  </select>
                </div>
              </div>

              {/* Price & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Price (₹) <span className="text-sky-400 font-normal">*(0 for &quot;Price on Request&quot;)*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50000}
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Listing Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                  >
                    <option value="published">Published (Live Marketplace)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="draft">Draft</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="e.g. 742 Skyline Boulevard, Bandra West"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                />
              </div>

              {/* Thumbnail Image URL & Upload */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Thumbnail / Cover Image</label>
                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-3 items-center">
                    <input
                      type="url"
                      value={editForm.cover_image}
                      onChange={(e) => setEditForm({ ...editForm, cover_image: e.target.value })}
                      placeholder="Paste Image URL..."
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400 transition"
                    />
                    <span className="text-xs text-slate-500 font-bold font-mono">OR</span>
                    <label className="cursor-pointer bg-white/[0.06] border border-white/15 hover:border-sky-400 px-4 py-2 rounded-xl text-xs text-slate-200 hover:text-white transition whitespace-nowrap">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setCropImageSrc(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {editForm.cover_image && (
                    <img src={editForm.cover_image} alt="Thumbnail Preview" className="h-16 w-24 object-cover rounded-lg shadow-md border border-white/10" />
                  )}
                </div>
              </div>

              {/* Publisher WhatsApp */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Publisher WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={editForm.contact_phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">Direct inquiries will be forwarded to this contact.</p>
              </div>

              {/* Carpet Area */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Carpet Area (e.g. 1,680 sq.ft.)</label>
                <input
                  type="text"
                  value={editForm.carpet_area || ''}
                  onChange={(e) => setEditForm({ ...editForm, carpet_area: e.target.value })}
                  placeholder="e.g. 1,680 sq.ft."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono transition"
                />
              </div>

              {/* Map Location Link */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Map Location Link</label>
                <input
                  type="url"
                  value={editForm.map_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, map_url: e.target.value })}
                  placeholder="e.g. https://maps.google.com/?q=..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Property features, amenities, and details..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-400 resize-none transition"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                    className="rounded border-white/20 bg-black/50 text-sky-500 focus:ring-sky-400"
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPropertyEdit}
                  className="btn-hero-accent text-xs !py-2 !px-6 shadow-glow-cyan disabled:opacity-50"
                >
                  {savingPropertyEdit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          aspectRatio={16 / 9}
          onCancel={() => setCropImageSrc(null)}
          onCropDone={async (croppedImageUrl) => {
            if (!editingProperty) return;
            setSavingPropertyEdit(true);
            try {
              const res = await fetch(croppedImageUrl);
              const blob = await res.blob();
              const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
              
              const formData = new FormData();
              formData.append('coverFile', file);
              formData.append('propertyId', editingProperty.id);
              
              const uploadRes = await uploadPropertyImageAction(formData);
              if (uploadRes.success && uploadRes.url) {
                setEditForm({ ...editForm, cover_image: uploadRes.url });
              } else {
                setPropertyEditError(uploadRes.error || 'Failed to upload cropped image.');
              }
            } catch (err) {
              console.error(err);
              setPropertyEditError('An error occurred while uploading the cropped image.');
            } finally {
              setSavingPropertyEdit(false);
              setCropImageSrc(null);
            }
          }}
        />
      )}
    </main>
  );
}
