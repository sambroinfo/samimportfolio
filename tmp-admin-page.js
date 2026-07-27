'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { defaultSiteData, loadSiteData, saveSiteData } from '../components/siteData';

export default function AdminPage() {
  const [data, setData] = useState(defaultSiteData);
  const [activeTab, setActiveTab] = useState('site');
  const [hasHydrated, setHasHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const stored = loadSiteData();
    setData(stored);
    setHasHydrated(true);
    const isAuth = typeof window !== 'undefined' && window.localStorage.getItem('samim-admin-auth') === 'true';
    setAuthenticated(isAuth);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    saveSiteData(data);
  }, [data, hasHydrated]);

  const handleAuthLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('samim-admin-auth');
    }
    setAuthenticated(false);
  };

  const renderTabContent = () => {
    if (!authReady) return null;

    if (!authenticated) {
      return (
        <section className="admin-card auth-block">
          <h3>Access Restricted</h3>
          <p>You must sign in to access the admin dashboard.</p>
          <Link href="/admin/login" className="primary-btn">Go to Admin Login</Link>
        </section>
      );
    }

    return (
      <section className="admin-card">
        <h3>{activeTab === 'site' ? 'Site Settings' : 'Admin'}</h3>
        <p>Editing tab: {activeTab}</p>
      </section>
    );
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <button className={activeTab === 'site' ? 'active' : ''} onClick={() => setActiveTab('site')}>Site Settings</button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile & Social</button>
        <button className="logout-button" onClick={handleAuthLogout}>Logout</button>
      </aside>
      <main className="admin-content">{renderTabContent()}</main>
    </div>
  );
}
