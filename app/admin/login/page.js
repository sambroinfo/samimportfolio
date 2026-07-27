'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { defaultSiteData, loadSiteData } from '../../components/siteData';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminAuth, setAdminAuth] = useState(defaultSiteData.adminAuth);

  useEffect(() => {
    setAdminAuth(loadSiteData().adminAuth || defaultSiteData.adminAuth);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === adminAuth.username && password === adminAuth.password) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('samim-admin-auth', 'true');
      }
      router.push('/admin');
      return;
    }
    setError('Invalid username or password.');
  };

  return (
    <main className="admin-login-shell">
      <section className="admin-card">
        <h2>Admin Login</h2>
        <p>Sign in with your admin credentials to manage the portfolio content.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin@#9011" />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="auth-actions">
            <button type="submit">Sign In</button>
            <Link href="/" className="outline-btn">Back to Home</Link>
          </div>
        </form>
        <p className="hint">This local-only login is intended for development. Use server-side authentication before publishing the admin area.</p>
      </section>
    </main>
  );
}
