import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ShootServicePage from './pages/ShootServicePage';
import SubmitListingPage from './pages/SubmitListingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ShootRequestModal from './components/Admin/ShootRequestModal';
import { INITIAL_PROPERTIES } from './data/propertiesData';

export default function App() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState(INITIAL_PROPERTIES[0].id);
  const [areaUnit, setAreaUnit] = useState('sqft');
  const [isShootModalOpen, setIsShootModalOpen] = useState(false);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const handleViewDetails = (id) => {
    setSelectedPropertyId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunch360 = (id) => {
    setSelectedPropertyId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveProperty = (id) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          verified360: true,
          status: 'published',
          madcoShootDate: 'Verified by Mad.co Admin (Today)'
        };
      }
      return p;
    }));
  };

  const handleRejectProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmitNewProperty = (newProperty) => {
    setProperties(prev => [newProperty, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">

      {/* GLOBAL NAVBAR */}
      <Navbar
        areaUnit={areaUnit}
        setAreaUnit={setAreaUnit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onRequestShoot={() => setIsShootModalOpen(true)}
      />

      {/* MAIN DYNAMIC PAGE CONTENT */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            properties={properties}
            areaUnit={areaUnit}
            onViewDetails={handleViewDetails}
            onLaunch360={handleLaunch360}
            onNavigateProperties={() => setCurrentPage('properties')}
            onRequestShoot={() => setIsShootModalOpen(true)}
          />
        )}

        {currentPage === 'properties' && (
          <PropertiesPage
            properties={properties}
            areaUnit={areaUnit}
            onViewDetails={handleViewDetails}
            onLaunch360={handleLaunch360}
          />
        )}

        {currentPage === 'detail' && (
          <PropertyDetailPage
            property={selectedProperty}
            areaUnit={areaUnit}
            onNavigateBack={() => setCurrentPage('properties')}
          />
        )}

        {currentPage === 'shoot-service' && (
          <ShootServicePage
            onRequestShoot={() => setIsShootModalOpen(true)}
          />
        )}

        {currentPage === 'submit-listing' && (
          <SubmitListingPage
            onSubmitNewProperty={handleSubmitNewProperty}
            onNavigateHome={() => setCurrentPage('properties')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            properties={properties}
            onApproveProperty={handleApproveProperty}
            onRejectProperty={handleRejectProperty}
            onViewProperty={handleViewDetails}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-white font-extrabold text-lg">Mad.co 360° Real Estate</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 text-xs font-bold">Mangalore, KA</span>
          </div>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            "Walk through your next home before you ever step inside it." Spatial 360° virtual tours professionally shot and stitched by Mad.co Studio (madco.in).
          </p>
          <p className="text-[11px] text-slate-400">
            © 2026 Mad.co Spatial Marketing Studio. All rights reserved. Curated for Mangalore, Karnataka.
          </p>
        </div>
      </footer>

      {/* MAD.CO SHOOT REQUEST MODAL */}
      <ShootRequestModal
        isOpen={isShootModalOpen}
        onClose={() => setIsShootModalOpen(false)}
      />

    </div>
  );
}
