// https://securityheaders.com
const ContentSecurityPolicyData = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  style-src 'self' 'unsafe-inline';
  child-src 'none';
  connect-src *;
  font-src 'self';
`;

// https://nextjs.org/docs/advanced-features/security-headers
const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    // Need to replace line breaks so its a one line string
    value: ContentSecurityPolicyData.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Permissions-Policy',
    value: 'geolocation=()',
  },
];

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    //config.optimization.minimize = false;
    return config;
  },
  headers: () => [
    {
      // Apply these headers to all routes in your application.
      source: '/(.*)',
      headers: process.env.NODE_ENV === 'production' ? securityHeaders : [],
    },
  ],
};
