const withTwin = require('./withTwin');

const nextConfig = withTwin({
  reactStrictMode: false,
  swcMinify: true, // 코드 경량화 작업에 Terser가 아닌 SWC를 사용합니다.
  transpilePackages: ['ui'],
});

module.exports = nextConfig;
