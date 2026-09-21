/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    '*.run.app',
    '*.asia-southeast1.run.app',
    'ais-dev-c5v6z6mzcw4muqpadhrnlh-425549117069.asia-southeast1.run.app',
    'ais-pre-c5v6z6mzcw4muqpadhrnlh-425549117069.asia-southeast1.run.app',
    'localhost',
    '127.0.0.1',
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
