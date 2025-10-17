/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  // NO 'output: export' - this allows API routes to work on Vercel
  // GitHub Pages deployment still uses the original next.config.mjs with 'output: export'
  images: {
    unoptimized: true,
  },
}

export default nextConfig
