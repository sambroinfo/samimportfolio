'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createEmptyEducation, createEmptyExperience, createEmptyHighlight, createEmptyPortfolioItem, createEmptyService, createEmptySocial, defaultSiteData, loadSiteData, saveSiteData, slugify } from '../components/siteData';

export default function AdminPage() {
  const [data, setData] = useState(defaultSiteData);
  const [activeTab, setActiveTab] = useState('site');
  const [hasHydrated, setHasHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [messageReply, setMessageReply] = useState({});

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

  const unreadCount = useMemo(() => {
    return data.messages?.filter((message) => !message.read).length || 0;
  }, [data.messages]);

  const markMessageRead = (index) => {
    setData((prev) => {
      const updated = [...prev.messages];
      if (updated[index]) updated[index] = { ...updated[index], read: true };
      return { ...prev, messages: updated };
    });
  };

  const replyToMessage = (index) => {
    setData((prev) => {
      const updated = [...prev.messages];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          reply: messageReply[index] || updated[index].reply || '',
          status: 'replied',
          read: true,
          repliedAt: new Date().toISOString(),
        };
      }
      return { ...prev, messages: updated };
    });
  };

  const handleAuthLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('samim-admin-auth');
    }
    setAuthenticated(false);
  };

  const handleFieldChange = (section, key, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSettingsChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      siteSettings: { ...prev.siteSettings, [key]: value },
    }));
  };

  const resetAppearance = () => {
    setData((prev) => ({
      ...prev,
      siteSettings: { ...defaultSiteData.siteSettings },
    }));
  };

  const updateArray = (key, index, value) => {
    setData((prev) => {
      const segments = key.split('.');
      if (segments.length === 1) {
        return {
          ...prev,
          [segments[0]]: prev[segments[0]].map((item, itemIndex) => (itemIndex === index ? value : item)),
        };
      }

      const [parentKey, childKey] = segments;
      return {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: prev[parentKey][childKey].map((item, itemIndex) => (itemIndex === index ? value : item)),
        },
      };
    });
  };

  const addItem = (key) => {
    if (key === 'socials') setData((prev) => ({ ...prev, socials: [...prev.socials, createEmptySocial()] }));
    if (key === 'services') setData((prev) => ({ ...prev, services: [...prev.services, createEmptyService()] }));
    if (key === 'portfolio') setData((prev) => ({ ...prev, portfolio: [...prev.portfolio, createEmptyPortfolioItem()] }));
    if (key === 'experience') setData((prev) => ({ ...prev, resume: { ...prev.resume, experience: [...prev.resume.experience, createEmptyExperience()] } }));
    if (key === 'education') setData((prev) => ({ ...prev, resume: { ...prev.resume, education: [...prev.resume.education, createEmptyEducation()] } }));
    if (key === 'highlights') setData((prev) => ({ ...prev, highlights: [...prev.highlights, createEmptyHighlight()] }));
  };

  const removeItem = (key, index) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeResumeItem = (key, index) => {
    setData((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        [key]: prev.resume[key].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <button className={activeTab === 'site' ? 'active' : ''} onClick={() => setActiveTab('site')}>Site Settings</button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile & Social</button>
        <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Services</button>
        <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
        <button className={activeTab === 'resume' ? 'active' : ''} onClick={() => setActiveTab('resume')}>Resume</button>
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Messages {unreadCount > 0 ? `(${unreadCount})` : ''}</button>
        <button className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>Account</button>
        <button className={activeTab === 'integrations' ? 'active' : ''} onClick={() => setActiveTab('integrations')}>Integrations</button>
        <button className="logout-button" onClick={handleAuthLogout}>Logout</button>
      </aside>

      <main className="admin-content">
        {!authReady ? null : !authenticated ? (
          <section className="admin-card auth-block">
            <h3>Access Restricted</h3>
            <p>You must sign in to access the admin dashboard.</p>
            <Link href="/admin/login" className="primary-btn">Go to Admin Login</Link>
          </section>
        ) : (
          <>
            {activeTab === 'site' && (
          <section className="admin-card">
            <h3>Site Customization</h3>
            <div className="grid-two">
              <label>Site Name<input value={data.siteSettings.siteName} onChange={(e) => handleSettingsChange('siteName', e.target.value)} /></label>
              <label>Logo Text<input value={data.siteSettings.logoText} onChange={(e) => handleSettingsChange('logoText', e.target.value)} /></label>
              <label>Logo Image URL<input value={data.siteSettings.logoImage} onChange={(e) => handleSettingsChange('logoImage', e.target.value)} /></label>
              <label>Primary Color<input type="color" value={data.siteSettings.primaryColor} onChange={(e) => handleSettingsChange('primaryColor', e.target.value)} /></label>
              <label>Secondary Color<input type="color" value={data.siteSettings.secondaryColor} onChange={(e) => handleSettingsChange('secondaryColor', e.target.value)} /></label>
              <label>Background Color<input type="color" value={data.siteSettings.backgroundColor} onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)} /></label>
              <label>Text Color<input type="color" value={data.siteSettings.textColor} onChange={(e) => handleSettingsChange('textColor', e.target.value)} /></label>
              <label>Muted Color<input type="color" value={data.siteSettings.mutedColor} onChange={(e) => handleSettingsChange('mutedColor', e.target.value)} /></label>
              <label>Accent Color<input type="color" value={data.siteSettings.accentColor} onChange={(e) => handleSettingsChange('accentColor', e.target.value)} /></label>
            </div>
            <div className="admin-actions">
              <button type="button" onClick={resetAppearance}>Reset Site Appearance</button>
            </div>
            <div className="subsection">
              <h4>Highlights</h4>
              {data.highlights.map((item, index) => (
                <div key={item.id} className="item-block">
                  <input placeholder="Value" value={item.value} onChange={(e) => updateArray('highlights', index, { ...item, value: e.target.value })} />
                  <input placeholder="Label" value={item.label} onChange={(e) => updateArray('highlights', index, { ...item, label: e.target.value })} />
                  <button onClick={() => removeItem('highlights', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addItem('highlights')}>Add Highlight</button>
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="admin-card">
            <h3>Profile & Social</h3>
            <div className="grid-two">
              <label>Name<input value={data.profile.name} onChange={(e) => handleFieldChange('profile', 'name', e.target.value)} /></label>
              <label>Title<input value={data.profile.title} onChange={(e) => handleFieldChange('profile', 'title', e.target.value)} /></label>
              <label>Email<input value={data.profile.email} onChange={(e) => handleFieldChange('profile', 'email', e.target.value)} /></label>
              <label>Phone<input value={data.profile.phone} onChange={(e) => handleFieldChange('profile', 'phone', e.target.value)} /></label>
              <label>CV URL<input value={data.profile.cvUrl} onChange={(e) => handleFieldChange('profile', 'cvUrl', e.target.value)} /></label>
              <label>CV File URL<input value={data.profile.cvFile} onChange={(e) => handleFieldChange('profile', 'cvFile', e.target.value)} /></label>
              <label>Profile Image URL<input value={data.profile.image} onChange={(e) => handleFieldChange('profile', 'image', e.target.value)} /></label>
            </div>
            <textarea value={data.profile.intro} onChange={(e) => handleFieldChange('profile', 'intro', e.target.value)} />

            <div className="subsection">
              <h4>Social Accounts</h4>
              {data.socials.map((item, index) => (
                <div key={item.id} className="item-block">
                  <input placeholder="Label" value={item.label} onChange={(e) => updateArray('socials', index, { ...item, label: e.target.value })} />
                  <input placeholder="Link" value={item.url} onChange={(e) => updateArray('socials', index, { ...item, url: e.target.value })} />
                  <input placeholder="Icon Image URL" value={item.iconImage} onChange={(e) => updateArray('socials', index, { ...item, iconImage: e.target.value })} />
                  <button onClick={() => removeItem('socials', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addItem('socials')}>Add Social</button>
            </div>
          </section>
        )}

        {activeTab === 'services' && (
          <section className="admin-card">
            <h3>Services</h3>
            {data.services.map((service, index) => (
              <div key={service.id} className="item-block">
                <input placeholder="Service Title" value={service.title} onChange={(e) => updateArray('services', index, { ...service, title: e.target.value })} />
                <textarea placeholder="Service Description" value={service.description} onChange={(e) => updateArray('services', index, { ...service, description: e.target.value })} />
                <input placeholder="Icon Image URL" value={service.iconImage} onChange={(e) => updateArray('services', index, { ...service, iconImage: e.target.value })} />
                <p className="item-meta">Preview: /services/{slugify(service.title) || 'new-service'}</p>
                <button onClick={() => removeItem('services', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addItem('services')}>Add Service</button>
          </section>
        )}

        {activeTab === 'portfolio' && (
          <section className="admin-card">
            <h3>Portfolio</h3>
            {data.portfolio.map((item, index) => (
              <div key={item.id} className="item-block">
                <input placeholder="Project Title" value={item.title} onChange={(e) => updateArray('portfolio', index, { ...item, title: e.target.value })} />
                <input placeholder="Category" value={item.category} onChange={(e) => updateArray('portfolio', index, { ...item, category: e.target.value })} />
                <input placeholder="Summary" value={item.summary} onChange={(e) => updateArray('portfolio', index, { ...item, summary: e.target.value })} />
                <textarea placeholder="Full Details" value={item.content} onChange={(e) => updateArray('portfolio', index, { ...item, content: e.target.value })} />
                <input placeholder="Image URL" value={item.image} onChange={(e) => updateArray('portfolio', index, { ...item, image: e.target.value })} />
                <p className="item-meta">Preview: /portfolio/{slugify(item.title) || 'new-project'}</p>
                <button onClick={() => removeItem('portfolio', index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addItem('portfolio')}>Add Project</button>
          </section>
        )}

        {activeTab === 'resume' && (
          <section className="admin-card">
            <h3>Resume</h3>
            <div className="subsection">
              <h4>Experience</h4>
              {data.resume.experience.map((item, index) => (
                <div key={item.id} className="item-block">
                  <input placeholder="Role" value={item.role} onChange={(e) => updateArray('resume.experience', index, { ...item, role: e.target.value })} />
                  <input placeholder="Company" value={item.company} onChange={(e) => updateArray('resume.experience', index, { ...item, company: e.target.value })} />
                  <input placeholder="Period" value={item.period} onChange={(e) => updateArray('resume.experience', index, { ...item, period: e.target.value })} />
                  <textarea placeholder="Description" value={item.description} onChange={(e) => updateArray('resume.experience', index, { ...item, description: e.target.value })} />
                  <button onClick={() => removeResumeItem('experience', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addItem('experience')}>Add Experience</button>
            </div>
            <div className="subsection">
              <h4>Education</h4>
              {data.resume.education.map((item, index) => (
                <div key={item.id} className="item-block">
                  <input placeholder="Degree" value={item.degree} onChange={(e) => updateArray('resume.education', index, { ...item, degree: e.target.value })} />
                  <input placeholder="Institution" value={item.institution} onChange={(e) => updateArray('resume.education', index, { ...item, institution: e.target.value })} />
                  <input placeholder="Period" value={item.period} onChange={(e) => updateArray('resume.education', index, { ...item, period: e.target.value })} />
                  <textarea placeholder="Description" value={item.description} onChange={(e) => updateArray('resume.education', index, { ...item, description: e.target.value })} />
                  <button onClick={() => removeResumeItem('education', index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addItem('education')}>Add Education</button>
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="admin-card">
            <h3>Messages</h3>
            {data.messages?.length ? data.messages.map((message, index) => (
              <div key={message.id || index} className={`item-block message-card ${message.read ? '' : 'unread'}`}>
                <div className="message-header">
                  <div>
                    <strong>{message.name}</strong>
                    <span>{message.email}</span>
                  </div>
                  <div>
                    <span>{message.submittedAt ? new Date(message.submittedAt).toLocaleString() : 'Just now'}</span>
                    {!message.read && <span className="badge">New</span>}
                  </div>
                </div>
                <p>{message.message}</p>
                <textarea
  placeholder="Write reply..."
  value={messageReply[index] ?? message.reply ?? ''}
  onChange={(e) =>
    setMessageReply((prev) => ({
      ...prev,
      [index]: e.target.value,
    }))
  }
/>
                <div className="message-actions">
                  <button onClick={() => markMessageRead(index)}>Mark Read</button>
                  <button onClick={() => replyToMessage(index)}>Save Reply</button>
                </div>
              </div>
            )) : <p>No messages yet. Incoming contact form submissions will appear here.</p>}
          </section>
        )}

        {activeTab === 'account' && (
          <section className="admin-card">
            <h3>Account</h3>
            <div className="grid-two">
              <label>Admin Username<input value={data.adminAuth.username} onChange={(e) => handleFieldChange('adminAuth', 'username', e.target.value)} /></label>
              <label>Admin Email<input value={data.adminAuth.email} onChange={(e) => handleFieldChange('adminAuth', 'email', e.target.value)} /></label>
              <label>Admin Phone<input value={data.adminAuth.phone} onChange={(e) => handleFieldChange('adminAuth', 'phone', e.target.value)} /></label>
              <label>Admin Password<input type="password" value={data.adminAuth.password} onChange={(e) => handleFieldChange('adminAuth', 'password', e.target.value)} /></label>
              <label className="checkbox-label"><input type="checkbox" checked={data.adminAuth.notificationsEnabled} onChange={(e) => handleFieldChange('adminAuth', 'notificationsEnabled', e.target.checked)} /> Enable admin notifications</label>
            </div>
            <p className="hint">Default admin credentials: admin / Admin@#9011</p>
          </section>
        )}

        {activeTab === 'integrations' && (
          <section className="admin-card">
            <h3>Integrations & Essentials</h3>
            <div className="grid-two">
              <label>Google Tag<input value={data.integrations.googleTag} onChange={(e) => setData((prev) => ({ ...prev, integrations: { ...prev.integrations, googleTag: e.target.value } }))} /></label>
              <label>GA4<input value={data.integrations.ga4} onChange={(e) => setData((prev) => ({ ...prev, integrations: { ...prev.integrations, ga4: e.target.value } }))} /></label>
              <label>Facebook Pixel<input value={data.integrations.facebookPixel} onChange={(e) => setData((prev) => ({ ...prev, integrations: { ...prev.integrations, facebookPixel: e.target.value } }))} /></label>
              <label>Form Endpoint<input value={data.integrations.formEndpoint} onChange={(e) => setData((prev) => ({ ...prev, integrations: { ...prev.integrations, formEndpoint: e.target.value } }))} /></label>
              <label>Payment URL<input value={data.integrations.paymentUrl} onChange={(e) => setData((prev) => ({ ...prev, integrations: { ...prev.integrations, paymentUrl: e.target.value } }))} /></label>
              <label>Contact Email<input value={data.integrations.contactEmail} onChange={(e) => setData((prev) => ({ ...prev, integrations: { ...prev.integrations, contactEmail: e.target.value } }))} /></label>
              <label className="checkbox-label"><input type="checkbox" checked={data.formEnabled} onChange={(e) => setData((prev) => ({ ...prev, formEnabled: e.target.checked }))} /> Enable contact form</label>
            </div>
            <p className="hint">These values are saved locally in this browser. Analytics, payment, email delivery, and form endpoints need a server-side integration before they can run in production.</p>
          </section>
        )}

      </>
    )}
      </main>
    </div>
  );
}
