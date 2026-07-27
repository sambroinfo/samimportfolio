import './globals.css';

export const metadata = {
  title: 'Samim | Portfolio',
  description: 'A modern portfolio landing page built from Figma design context.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
