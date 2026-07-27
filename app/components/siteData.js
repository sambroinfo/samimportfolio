export const defaultSiteData = {
  siteSettings: {
    siteName: 'SAMIM',
    logoText: 'SAMIM',
    logoImage: '',
    primaryColor: '#fd6f00',
    secondaryColor: '#e46400',
    backgroundColor: '#121212',
    textColor: '#fefefe',
    mutedColor: '#959595',
    accentColor: '#707070',
  },
  profile: {
    name: 'Mohammad Salah Uddin (Samim)',
    title: 'Web Designer & Developer',
    intro: 'I’m a web designer and developer with strong experience in WordPress and Shopify website design and development. I also work with Laravel, HTML, JavaScript, and related technologies to build modern, functional, and user-friendly websites.',
    email: 'samim@srtechcommunication.com',
    phone: '+880123456789',
    image: 'https://www.figma.com/api/mcp/asset/8bfd3b19-9e69-4d5d-bf02-a63e5740edf3',
    cvUrl: '',
    cvFile: '',
  },
  socials: [
    { id: 1, label: 'LinkedIn', url: 'https://www.linkedin.com', iconImage: '' },
    { id: 2, label: 'Dribbble', url: 'https://dribbble.com', iconImage: '' },
  ],
  services: [
    { id: 1, title: 'WordPress Website Design', description: 'Modern WordPress websites tailored for business growth and strong presentation.', iconImage: '' },
    { id: 2, title: 'Shopify Store Design', description: 'Conversion-focused Shopify storefronts designed for customer trust and ease of checkout.', iconImage: '' },
    { id: 3, title: 'Laravel Development', description: 'Reliable Laravel web applications with powerful backend logic and clean structure.', iconImage: '' },
  ],
  portfolio: [
    { id: 1, title: 'Finance Dashboard', category: 'Product design', summary: 'A thoughtful dashboard experience for modern analytics teams.', content: 'This portfolio item can be edited from the admin panel and expanded with custom project details, image galleries, and client outcomes.', image: '' },
    { id: 2, title: 'Mobile Commerce', category: 'Mobile UX', summary: 'An elegant mobile user journey for converting shoppers.', content: 'Use this area to describe your mobile experience design, project challenges, and delivered results.', image: '' },
    { id: 3, title: 'Creative Studio', category: 'Brand system', summary: 'A refreshed visual identity and interaction language.', content: 'Show how your brand strategy and design system elevated a modern digital project.', image: '' },
  ],
  resume: {
    experience: [
      { id: 1, role: 'Freelance Web Designer & Developer', company: 'SR Tech Communication', period: '2022 - Present', description: 'Built websites for businesses using WordPress, Shopify, Laravel, and custom front-end solutions.' },
    ],
    education: [
      { id: 1, degree: 'Bachelor of Science', institution: 'University', period: '2018 - 2022', description: 'Studied computer science and web development fundamentals.' },
    ],
  },
  integrations: {
    googleTag: '',
    ga4: '',
    facebookPixel: '',
    formEndpoint: '',
    paymentUrl: '',
    contactEmail: 'samim@srtechcommunication.com',
  },
  emailSetup: {
    fromEmail: 'admin@srtechcommunication.com',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
  },
  adminAuth: {
    username: 'admin',
    password: 'Admin@#9011',
    email: 'admin@srtechcommunication.com',
    phone: '+880123456789',
    notificationsEnabled: true,
  },
  messages: [],
  formEnabled: true,
  highlights: [
    { id: 1, value: '5+', label: 'Experiences' },
    { id: 2, value: '20+', label: 'Project done' },
    { id: 3, value: '80+', label: 'Happy Clients' },
  ],
};

export function createEmptySocial() {
  return { id: Date.now(), label: '', url: '', iconImage: '' };
}

export function createEmptyService() {
  return { id: Date.now(), title: '', description: '', iconImage: '' };
}

export function createEmptyPortfolioItem() {
  return { id: Date.now(), title: '', category: '', summary: '', content: '', image: '' };
}

export function createEmptyExperience() {
  return { id: Date.now(), role: '', company: '', period: '', description: '' };
}

export function createEmptyEducation() {
  return { id: Date.now(), degree: '', institution: '', period: '', description: '' };
}

export function createEmptyHighlight() {
  return { id: Date.now(), value: '', label: '' };
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function safeColor(value, fallback) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function safeList(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

export function loadSiteData() {
  if (typeof window === 'undefined') return defaultSiteData;
  const raw = window.localStorage.getItem('samim-portfolio-data');
  if (!raw) return defaultSiteData;
  try {
    const parsed = JSON.parse(raw);
    const siteSettings = { ...defaultSiteData.siteSettings, ...(parsed.siteSettings || {}) };

    return {
      ...defaultSiteData,
      ...parsed,
      siteSettings: {
        ...siteSettings,
        primaryColor: safeColor(siteSettings.primaryColor, defaultSiteData.siteSettings.primaryColor),
        secondaryColor: safeColor(siteSettings.secondaryColor, defaultSiteData.siteSettings.secondaryColor),
        backgroundColor: safeColor(siteSettings.backgroundColor, defaultSiteData.siteSettings.backgroundColor),
        textColor: safeColor(siteSettings.textColor, defaultSiteData.siteSettings.textColor),
        mutedColor: safeColor(siteSettings.mutedColor, defaultSiteData.siteSettings.mutedColor),
        accentColor: safeColor(siteSettings.accentColor, defaultSiteData.siteSettings.accentColor),
      },
      profile: { ...defaultSiteData.profile, ...(parsed.profile || {}) },
      socials: safeList(parsed.socials, defaultSiteData.socials),
      services: safeList(parsed.services, defaultSiteData.services),
      portfolio: safeList(parsed.portfolio, defaultSiteData.portfolio),
      resume: {
        experience: safeList(parsed.resume?.experience, defaultSiteData.resume.experience),
        education: safeList(parsed.resume?.education, defaultSiteData.resume.education),
      },
      integrations: { ...defaultSiteData.integrations, ...(parsed.integrations || {}) },
      emailSetup: { ...defaultSiteData.emailSetup, ...(parsed.emailSetup || {}) },
      adminAuth: { ...defaultSiteData.adminAuth, ...(parsed.adminAuth || {}) },
      messages: safeList(parsed.messages, defaultSiteData.messages),
      formEnabled: parsed.formEnabled !== undefined ? parsed.formEnabled : defaultSiteData.formEnabled,
      highlights: safeList(parsed.highlights, defaultSiteData.highlights),
    };
  } catch {
    return defaultSiteData;
  }
}

export function saveSiteData(data) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('samim-portfolio-data', JSON.stringify(data));
}
