const withTwin = require('./withTwin');

const nextConfig = withTwin({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['ui'],
});

module.exports = nextConfig;
