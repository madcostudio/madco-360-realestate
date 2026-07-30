'use client';

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  Link, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MANGALORE_LOCALITIES } from '../data/propertiesData';

export default function SubmitListingPage({ onSubmitNewProperty, onNavigateHome }) {
  const [step, setStep] = useState(1); // 1: Info, 2: 360 Nodes & Hotspots, 3: Success

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [listingType, setListingType] = useState('sale');
  const [type, setType] = useState('flat');
  const [locality, setLocality] = useState('Kadri');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [areaSqFt, setAreaSqFt] = useState('1850');
  const [description, setDescription] = useState('');
  const [facing, setFacing] = useState('East');

  // 360 Rooms Builder State
  const [rooms, setRooms] = useState([
    { id: 'room-1', name: 'Main Living Room', presetType: 'living', hotspots: [] },
    { id: 'room-2', name: 'Master Bedroom', presetType: 'bedroom', hotspots: [] }
  ]);

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPreset, setNewRoomPreset] = useState('balcony');

  const addRoom = () => {
    if (!newRoomName) return;
    const newId = `room-${Date.now()}`;
    setRooms(prev => [
      ...prev,
      { id: newId, name: newRoomName, presetType: newRoomPreset, hotspots: [] }
    ]);
    setNewRoomName('');
  };

  const removeRoom = (id) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const addHotspotToRoom = (sourceRoomId, targetRoomId) => {
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    if (!targetRoom) return;

    setRooms(prev => prev.map(room => {
      if (room.id === sourceRoomId) {
        return {
          ...room,
          hotspots: [
            ...room.hotspots,
            {
              id: `hs-${Date.now()}`,
              yaw: Math.floor(Math.random() * 120) - 60,
              pitch: -5,
              type: 'transition',
              targetRoomId: targetRoomId,
              title: `Step to ${targetRoom.name}`,
              description: `Navigate to ${targetRoom.name}`
            }
          ]
        };
      }
      return room;
    }));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const newProperty = {
      id: `prop-submitted-${Date.now()}`,
      title: title || 'Modern Mangalore Residence',
      tagline: `360° Verified Listing in ${locality}`,
      type: type,
      listingType: listingType,
      price: Number(price) || 8500000,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      carpetAreaSqFt: Math.round(Number(areaSqFt) * 0.85),
      locality: locality,
      address: address || `${locality}, Mangalore`,
      verified360: false, // Pending admin approval!
      status: 'pending_approval',
      madcoShootDate: 'Owner Submitted (Pending Review)',
      photographer: 'Owner Self-Submission',
      facing: facing,
      furnishing: 'Semi-Furnished',
      age: 'Brand New',
      possession: 'Immediate',
      reraId: 'Pending Verification',
      maintenanceFee: '₹3,500/mo',
      description: description || 'Owner self-submitted property with equirectangular 360 panorama nodes.',
      amenities: ['360° VR Tour', 'Power Backup', 'Security', 'Vastu Compliant'],
      highlights: ['Equirectangular 360° tour submitted by owner', 'Pending Mad.co spatial audit'],
      nearbyLandmarks: [{ name: `${locality} Center`, distance: '0.5 km' }],
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
      tour360: {
        startRoomId: rooms[0]?.id || 'room-1',
        rooms: rooms.map((r, i) => ({
          ...r,
          floorMapPos: { x: 30 + (i * 25), y: 40 + (i * 10) },
          initialYaw: 0,
          initialPitch: 0
        }))
      }
    };

    onSubmitNewProperty(newProperty);
    setStep(3);
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* PAGE HEADER */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Secondary Owner Portal
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Submit Equirectangular 360° Listing</h1>
          <p className="text-slate-400 text-sm mt-1">
            Owners with existing 360° camera footage can build room nodes & submit for Mad.co admin verification.
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 shrink-0">
          <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${step === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>1</span>
          <span className="text-slate-600 font-bold">→</span>
          <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${step === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>2</span>
          <span className="text-slate-600 font-bold">→</span>
          <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${step === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>3</span>
        </div>
      </div>

      {step === 3 ? (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-white">Listing Submitted to Admin Approval Queue!</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Your property <strong className="text-amber-400">"{title}"</strong> has been sent to Mad.co Studio admins. Our spatial team will audit the 360° node mapping and publish your listing with the <strong className="text-emerald-400">Verified 360° Badge</strong>.
          </p>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 text-slate-400">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-amber-400 font-bold">Pending Admin Audit</span>
            </div>
            <div className="flex justify-between">
              <span>360 Nodes Mapped:</span>
              <span className="text-white font-bold">{rooms.length} Rooms</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Approval Time:</span>
              <span className="text-slate-200 font-bold">Within 4 Hours</span>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg"
          >
            Explore 360° Listings
          </button>
        </div>
      ) : (
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleFinalSubmit} className="space-y-8">

          {step === 1 ? (
            /* STEP 1: BASIC PROPERTY DETAILS */
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <h2 className="text-white font-bold text-lg border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>Step 1: Property Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Property Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kadri Heights Modern 3BHK Apartment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Listing Purpose</label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="sale">For Sale (Buy)</option>
                    <option value="rent">For Rent (Tenants)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Price in ₹ INR</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8500000 for ₹85 L or 30000 for Rent"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Property Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="flat">Flat / Apartment</option>
                    <option value="villa">Independent Villa</option>
                    <option value="house">Independent House</option>
                    <option value="plot">Residential Plot</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Mangalore Locality</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {MANGALORE_LOCALITIES.filter(l => l !== 'All Localities').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Built-up Area (sq ft)</label>
                  <input
                    type="number"
                    required
                    placeholder="1850"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Bedrooms (BHK)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Near landmark, road name, Mangalore"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg flex items-center gap-2"
                >
                  <span>Proceed to 360° Tour Node Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: 360 EQUIRECTANGULAR ROOM BUILDER & HOTSPOT CONNECTOR */
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>Step 2: Map 360° Equirectangular Room Nodes</span>
                </h2>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  {rooms.length} Spatial Rooms
                </span>
              </div>

              {/* ADD NEW ROOM BAR */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Room Name (e.g. Sea View Balcony)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="flex-1 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none"
                />
                <select
                  value={newRoomPreset}
                  onChange={(e) => setNewRoomPreset(e.target.value)}
                  className="bg-slate-900 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-800"
                >
                  <option value="living">Living Room Sphere</option>
                  <option value="bedroom">Bedroom Sphere</option>
                  <option value="kitchen">Kitchen Sphere</option>
                  <option value="balcony">Balcony / Outdoor Deck</option>
                </select>
                <button
                  type="button"
                  onClick={addRoom}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" /> Add Room Node
                </button>
              </div>

              {/* ROOMS LIST & HOTSPOT LINKER */}
              <div className="space-y-4">
                {rooms.map((room, idx) => (
                  <div key={room.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">{room.name}</h4>
                          <span className="text-[11px] text-slate-400 capitalize">{room.presetType} preset • {room.hotspots.length} hotspots connected</span>
                        </div>
                      </div>

                      {rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoom(room.id)}
                          className="text-slate-500 hover:text-rose-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* CONNECT TO OTHER ROOMS */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold">Connect Walkway Hotspot To:</span>
                      {rooms.filter(r => r.id !== room.id).map(target => (
                        <button
                          key={target.id}
                          type="button"
                          onClick={() => addHotspotToRoom(room.id, target.id)}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 border border-slate-800 flex items-center gap-1 transition"
                        >
                          <Link className="w-3 h-3" /> + {target.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  ← Back to Step 1
                </button>

                <button
                  type="submit"
                  className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg"
                >
                  Submit 360° Listing for Admin Approval
                </button>
              </div>

            </div>
          )}

        </form>
      )}

    </div>
  );
}
