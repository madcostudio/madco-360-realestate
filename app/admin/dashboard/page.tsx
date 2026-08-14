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
} from 'lucide-react';

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
                <th className="p-3">360° Tour</th>
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
                    {prop.external_tour_url ? (
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800 uppercase">
                          {prop.external_tour_provider || '360° Tour'}
                        </span>
                        <button
                          onClick={() => handleOpenTourEdit(prop)}
                          className="p-1 text-slate-400 hover:text-brass hover:bg-slate-800 rounded transition"
                          title="Edit 360° Tour URL"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenTourEdit(prop)}
                        className="px-2 py-1 rounded-md text-[10px] font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center space-x-1"
                      >
                        <Link2 className="w-3 h-3 text-slate-500" />
                        <span>Attach Tour</span>
                      </button>
                    )}
                  </td>
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
                        <button
                          onClick={() => handleOpenEditProperty(prop)}
                          className="px-2.5 py-1.5 rounded-lg bg-brass/10 hover:bg-brass/20 border border-brass/40 text-brass hover:text-brass-light text-[11px] font-bold transition inline-flex items-center space-x-1"
                          title="Edit property listing info"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
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
              <span>Real Customer Inquiries ({recentEnquiries.length})</span>
            </h3>
            <span className="text-xs text-fern font-bold bg-fern/10 px-2.5 py-1 rounded-full border border-fern/30">
              Live DB Sync
            </span>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No inquiries logged yet in Supabase.</p>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{enq.visitor_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(enq.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
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

      {/* 360° Tour Link Edit Modal */}
      {editingTourProp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-estate-card border border-estate-border max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-brass" />
                <h3 className="font-serif font-bold text-lg text-white">Attach 360° Virtual Tour</h3>
              </div>
              <button
                onClick={() => setEditingTourProp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-300 font-bold mb-1">
                Property: <span className="text-white">{editingTourProp.title}</span>
              </p>
              <p className="text-[11px] text-slate-500 font-mono">{editingTourProp.address}, {editingTourProp.city}</p>
            </div>

            {tourSaveError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {tourSaveError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">360° Tour Link</label>
              <input
                type="url"
                value={tourUrlInput}
                onChange={(e) => setTourUrlInput(e.target.value)}
                placeholder="https://pano.cool/@handle/project or Kuula/Matterport embed URL"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brass font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Paste the shareable/embed link to this property&apos;s 360° tour (Panocool, Kuula, Matterport, etc.). Leave blank if you&apos;re building the tour with panoramas instead.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingTourProp(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTourUrl}
                disabled={savingTourUrl}
                className="px-5 py-2 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-brass/20"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-estate-card border border-estate-border max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-brass/20 text-brass">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Edit Property Listing</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {editingProperty.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProperty(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {propertyEditError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {propertyEditError}
              </div>
            )}

            <form onSubmit={handleSavePropertyEdit} className="space-y-4">
              {/* Property Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Luxury 3BHK Oceanfront Penthouse"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brass"
                />
              </div>

              {/* City, Locality & BHK */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="e.g. Mangalore"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brass"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Locality</label>
                  <input
                    type="text"
                    value={editForm.locality || ''}
                    onChange={(e) => setEditForm({ ...editForm, locality: e.target.value })}
                    placeholder="e.g. Kadri"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brass"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">BHK Configuration</label>
                  <select
                    value={editForm.bhk}
                    onChange={(e) => setEditForm({ ...editForm, bhk: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brass"
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
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Price (₹) <span className="text-gold font-normal">*(0 for "Price on Request")*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50000}
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brass font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Listing Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brass"
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="e.g. 742 Skyline Boulevard, Bandra West"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brass"
                />
              </div>

              {/* Thumbnail Image URL & Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Thumbnail / Hero Picture (Cover Image)</label>
                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-3 items-center">
                    <input
                      type="url"
                      value={editForm.cover_image}
                      onChange={(e) => setEditForm({ ...editForm, cover_image: e.target.value })}
                      placeholder="Paste Image URL..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brass transition"
                    />
                    <span className="text-xs text-slate-400 font-bold">OR</span>
                    <label className="cursor-pointer bg-slate-900 border border-slate-700 hover:border-brass px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white transition whitespace-nowrap">
                      Upload from Device
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
                              setEditForm({ ...editForm, cover_image: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {editForm.cover_image && (
                    <img src={editForm.cover_image} alt="Thumbnail Preview" className="h-16 w-24 object-cover rounded-lg shadow-lg border border-slate-700" />
                  )}
                </div>
              </div>

              {/* Publisher WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Publisher WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={editForm.contact_phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brass transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">Users clicking &quot;Send Direct Lead Enquiry&quot; will be directed to this WhatsApp number.</p>
              </div>

              {/* Map Location Link */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Map Location Link</label>
                <input
                  type="url"
                  value={editForm.map_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, map_url: e.target.value })}
                  placeholder="e.g. https://maps.google.com/?q=..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brass transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">Leave blank to use the default search query generated from the address.</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Property features, amenities, and details..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brass resize-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                    className="rounded border-slate-700 text-brass focus:ring-brass"
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPropertyEdit}
                  className="px-6 py-2 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-brass/20 disabled:opacity-60"
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
    </main>
  );
}
