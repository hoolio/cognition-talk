const isProd = process.env.NODE_ENV === 'production';
const repo = 'cognition-talk';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
