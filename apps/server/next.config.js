const withTwin = require('./withTwin');

const nextConfig = withTwin({
  reactStrictMode: true, // 초기 세팅에 이미 포함된 내용입니다.
  swcMinify: false,
});

module.exports = nextConfig;
