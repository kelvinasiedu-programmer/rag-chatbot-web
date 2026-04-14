/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow deployment behind a subpath if needed (GitHub Pages)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
