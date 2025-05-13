import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '10.0.0.154', // Add your specific IP
    // You can also add localhost variants if needed:
    'localhost',
    '127.0.0.1',
    'devmarco.swissbix.com'
  ],
};

export default nextConfig;
