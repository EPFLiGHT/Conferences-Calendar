/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  // Note: For GitHub Pages, the workflow temporarily excludes the API directory
  // For Vercel, API routes are included and deployed as serverless functions
  images: {
    unoptimized: true,
  },
}

export default nextConfig
