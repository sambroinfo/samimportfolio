/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    // A corrupted persistent Webpack cache can omit the generated global CSS
    // chunk during development. Keeping the dev cache in memory avoids that
    // intermittent reload failure; production builds remain unchanged.
    if (dev) config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
