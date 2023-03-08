const withTwin = require('./withTwin');

const nextConfig = withTwin({
  reactStrictMode: true, // 초기 세팅에 이미 포함된 내용입니다.
  swcMinify: true, // 코드 경량화 작업에 Terser가 아닌 SWC를 사용합니다.
  transpilePackages: ['ui'],
});

module.exports = nextConfig;
