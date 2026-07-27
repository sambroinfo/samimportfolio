'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadSiteData, slugify } from '../../components/siteData';

export default function PortfolioDetailPage({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadSiteData());
  }, []);

  const item = useMemo(() => {
    if (!data) return null;
    return data.portfolio.find((entry) => slugify(entry.title) === params.slug) || null;
  }, [data, params.slug]);

  if (!data) return (
    <main className="detail-shell">
      <div className="detail-card">
        <p className="eyebrow">Loading</p>
        <h1>Loading portfolio details…</h1>
      </div>
    </main>
  );

  if (!item) return (
    <main className="detail-shell">
      <div className="detail-card">
        <p className="eyebrow">Not Found</p>
        <h1>Portfolio project not found</h1>
        <Link href="/" className="detail-back-link">← Back to Home</Link>
      </div>
    </main>
  );

  return (
    <main className="detail-shell">
      <div className="detail-card">
        <p className="eyebrow">Portfolio Project</p>
        <h1>{item.title}</h1>
        <p><strong>Category:</strong> {item.category}</p>
        <p>{item.content}</p>
        <Link href="/" className="detail-back-link">← Back to Home</Link>
      </div>
    </main>
  );
}
