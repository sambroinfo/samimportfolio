'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { loadSiteData, slugify } from '../../components/siteData';

export default function ServiceDetailPage({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadSiteData());
  }, []);

  const service = useMemo(() => {
    if (!data) return null;
    return data.services.find((entry) => slugify(entry.title) === params.slug) || null;
  }, [data, params.slug]);

  if (!data) return (
    <main className="detail-shell">
      <div className="detail-card">
        <p className="eyebrow">Loading</p>
        <h1>Loading service details…</h1>
      </div>
    </main>
  );

  if (!service) return (
    <main className="detail-shell">
      <div className="detail-card">
        <p className="eyebrow">Not Found</p>
        <h1>Service not found</h1>
        <Link href="/" className="detail-back-link">← Back to Home</Link>
      </div>
    </main>
  );

  return (
    <main className="detail-shell">
      <div className="detail-card">
        <p className="eyebrow">Service</p>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
        <Link href="/" className="detail-back-link">← Back to Home</Link>
      </div>
    </main>
  );
}
