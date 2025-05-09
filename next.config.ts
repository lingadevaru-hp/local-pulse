
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Note: For a more robust PWA setup, consider using a package like '@ducanh2912/next-pwa'.
  // This config does not automatically generate service workers or manifest files.
  // Those are handled manually in the /public folder and registered in _app.tsx or layout.tsx.
};

export default nextConfig;
