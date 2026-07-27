'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defaultSiteData, loadSiteData, saveSiteData, slugify } from './components/siteData';

const imgManInBlackSuitLookingConfident = 'https://www.figma.com/api/mcp/asset/8bfd3b19-9e69-4d5d-bf02-a63e5740edf3';
const imgVector = 'https://www.figma.com/api/mcp/asset/51d21d88-d514-4168-bb71-3c2379e5f01e';
const imgEllipse9 = 'https://www.figma.com/api/mcp/asset/fb0e1c2f-5b7e-4a0f-9a1c-6f5b7141d9da';
const imgMingcuteLinkedinLine = 'https://www.figma.com/api/mcp/asset/7781951e-805d-421a-ac69-baa9233f9e3b';
const imgEllipse1 = 'https://www.figma.com/api/mcp/asset/fb283baf-8051-480f-9dcd-f62d06fa6831';
const img2User = 'https://www.figma.com/api/mcp/asset/f9a15b01-b0b6-4221-8951-fc01cffa707b';
const imgDownlaod = 'https://www.figma.com/api/mcp/asset/f656fb2a-0e0e-4f7d-ac5b-1e90b3723216';

export default function Home() {
  const [data, setData] = useState(defaultSiteData);

  useEffect(() => {
    setData(loadSiteData());
  }, []);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    if (!data.formEnabled) {
      setFormStatus({ type: 'error', message: 'Contact form is currently disabled.' });
      return;
    }

    const newMessage = {
      id: Date.now(),
      name: formData.name || 'Guest',
      email: formData.email || '',
      subject: formData.subject || 'Message from website',
      message: formData.message || '',
      submittedAt: new Date().toISOString(),
      status: 'new',
      reply: '',
      read: false,
    };

    const updatedData = {
      ...data,
      messages: [...(data.messages || []), newMessage],
    };

    setData(updatedData);
    saveSiteData(updatedData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setFormStatus({ type: 'success', message: 'Your message has been submitted successfully.' });
  };

  const siteStyles = useMemo(() => ({
    '--primary-color': data?.siteSettings?.primaryColor || '#fd6f00',
    '--secondary-color': data?.siteSettings?.secondaryColor || '#e46400',
    '--background-color': data?.siteSettings?.backgroundColor || '#121212',
    '--text-color': data?.siteSettings?.textColor || '#fefefe',
    '--muted-color': data?.siteSettings?.mutedColor || '#959595',
    '--accent-color': data?.siteSettings?.accentColor || '#707070',
  }), [data]);

  if (!data) return null;

  const services = data.services;
  const highlights = data.highlights;
  const skills = [
    { value: '100%', label: 'WordPress', mark: 'W' },
    { value: '100%', label: 'Shopify', mark: 'S' },
    { value: '90%', label: 'Laravel', mark: 'L' },
    { value: '95%', label: 'JavaScript', mark: 'JS' },
  ];
  const portfolioItems = data.portfolio;
  const contactEmail = data.integrations.contactEmail || data.profile.email;
  const cvLink = data.profile.cvUrl || data.profile.cvFile;

  return (
    <main className="page-shell" id="home" style={siteStyles}>
      <section className="hero-section">
        <div className="hero-bg" />
        <header className="topbar">
          <div className="brand">
            {data.siteSettings.logoImage ? (
              <img src={data.siteSettings.logoImage} alt={data.siteSettings.logoText || 'Logo'} className="logo-image" />
            ) : (
              data.siteSettings.logoText || 'SAMIM'
            )}
          </div>
          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About me</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#resume">Resume</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact me</a>
          </nav>
          <a className="primary-btn" href="#contact">Hire Me</a>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Hi I am</p>
            <h1>{data.profile.name}</h1>
            <h2>{data.profile.title}</h2>
            <div className="social-row">
              {data.socials.map((social, index) => (
                <a key={social.id || index} href={social.url} target="_blank" rel="noreferrer" className="social-bubble">
                  {social.iconImage ? <img src={social.iconImage} alt={social.label} className="social-icon-image" /> : <img src={imgEllipse9} alt="circle" />}
                  {!social.iconImage && <img src={imgMingcuteLinkedinLine} alt={social.label} className="social-icon" />}
                </a>
              ))}
            </div>
            <div className="cta-row">
              <a className="primary-btn" href="#contact">Hire Me</a>
              <a className="outline-btn" href={cvLink || `mailto:${data.profile.email}`}>{cvLink ? 'Download CV' : 'Contact Me'}</a>
            </div>
            <div className="highlight-strip">
              {highlights.map((item) => (
                <div key={item.label} className="highlight-item">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <img src={imgVector} alt="decorative vector" className="hero-vector" />
            <div className="profile-frame">
              <img src={imgEllipse1} alt="profile ring" className="profile-ring" />
              <img src={data.profile.image || imgManInBlackSuitLookingConfident} alt="profile portrait" className="portrait" />
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-title">
          <h3>Services</h3>
          <p>I create modern, responsive, and conversion-focused websites for businesses and brands.</p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <Link href={`/services/${slugify(service.title)}`} key={service.id} className="service-card service-card-link">
              <img src={service.iconImage || img2User} alt={service.title} className="service-icon" />
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="portfolio-section" id="portfolio">
        <div className="section-title">
          <h3>Selected Work</h3>
          <p>Selected projects reflecting clean design, strong UX, and reliable development.</p>
        </div>
        <div className="portfolio-grid">
          {portfolioItems.map((item) => (
            <Link href={`/portfolio/${slugify(item.title)}`} key={item.id} className="portfolio-card portfolio-card-link">
              <div className="portfolio-preview" style={{ backgroundImage: item.image ? `url(${item.image})` : 'linear-gradient(135deg, rgba(253,111,0,0.35), rgba(255,255,255,0.06))' }} />
              <div className="portfolio-content">
                <span>{item.category}</span>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="resume-section" id="resume">
        <div className="section-title">
          <h3>Resume</h3>
          <p>Experience and education to highlight your professional story and technical strengths.</p>
        </div>
        <div className="resume-grid">
          <div className="resume-column">
            <h4>Experience</h4>
            {data.resume.experience.map((item) => (
              <article key={item.id} className="resume-card">
                <h5>{item.role}</h5>
                <span>{item.company} · {item.period}</span>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="resume-column">
            <h4>Education</h4>
            {data.resume.education.map((item) => (
              <article key={item.id} className="resume-card">
                <h5>{item.degree}</h5>
                <span>{item.institution} · {item.period}</span>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-visual">
          <img src={data.profile.image || imgManInBlackSuitLookingConfident} alt="about portrait" className="about-portrait" />
        </div>
        <div className="about-copy">
          <h3>About Me</h3>
          <p>{data.profile.intro}</p>
          <a className="primary-btn wide-btn" href={cvLink || `mailto:${data.profile.email}`}>
            <img src={imgDownlaod} alt="download" /> Download CV
          </a>
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="skill-grid">
          {skills.map((skill) => (
            <article key={skill.label} className="skill-card">
              <div className="skill-badge">
                <span className="skill-mark" aria-hidden="true">{skill.mark}</span>
              </div>
              <strong>{skill.value}</strong>
              <span>{skill.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-title">
          <h3>Contact Me</h3>
          <p>Send a message directly from this page and get notified in the admin panel.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="eyebrow">Reach out anytime</p>
            <h3>Let’s build your next website or digital product.</h3>
            <div className="contact-meta">
              <div>
                <strong>Email</strong>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
              <div>
                <strong>Phone</strong>
                <a href={`tel:${data.profile.phone}`}>{data.profile.phone}</a>
              </div>
            </div>
            <div className="contact-links">
              <a className="primary-btn" href={`mailto:${contactEmail}`}>Email Me</a>
              {data.socials[0] && <a className="outline-btn" href={data.socials[0].url} target="_blank" rel="noreferrer">{data.socials[0].label || 'LinkedIn'}</a>}
            </div>
            {data.formEnabled ? (
              <p className="hint">Your contact form is live. New submissions will appear in the admin dashboard.</p>
            ) : (
              <p className="hint">Contact form is disabled. Enable it from the admin integrations settings.</p>
            )}
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            {formStatus && (
              <div className={`form-feedback ${formStatus.type}`} role="status" aria-live="polite">
                {formStatus.message}
              </div>
            )}
            <label>Name<input required value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Your name" /></label>
            <label>Email<input required type="email" value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} placeholder="Your email" /></label>
            <label>Subject<input required value={formData.subject} onChange={(e) => handleFormChange('subject', e.target.value)} placeholder="Subject" /></label>
            <label>Message<textarea required value={formData.message} onChange={(e) => handleFormChange('message', e.target.value)} placeholder="Your message" rows="6" /></label>
            <button type="submit" className="primary-btn">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="footer">© 2026 {data.profile.name}. All rights reserved.</footer>
    </main>
  );
}
