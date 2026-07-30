'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HomePage from '../views/HomePage';
import PropertiesPage from '../views/PropertiesPage';
import PropertyDetailPage from '../views/PropertyDetailPage';
import ShootServicePage from '../views/ShootServicePage';
import SubmitListingPage from '../views/SubmitListingPage';
import AdminDashboardPage from '../views/AdminDashboardPage';
import ShootRequestModal from '../components/Admin/ShootRequestModal';
import { INITIAL_PROPERTIES } from '../data/propertiesData';

export default function Page() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState(INITIAL_PROPERTIES[0].id);
  const [areaUnit, setAreaUnit] = useState('sqft');
  const [isShootModalOpen, setIsShootModalOpen] = useState(false);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const handleViewDetails = (id) => {
    setSelectedPropertyId(id);
    setCurrentPage('detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLaunch360 = (id) => {
    setSelectedPropertyId(id);
    setCurrentPage('detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <div className="min-h-screen flex flex-col">
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

      {/* MAD.CO SHOOT REQUEST MODAL */}
      <ShootRequestModal
        isOpen={isShootModalOpen}
        onClose={() => setIsShootModalOpen(false)}
      />
    </div>
  );
}
