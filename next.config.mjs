/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Allow embedding inside Telegram WebView
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "connect-src 'self' https: wss:",
              "frame-ancestors 'self' https://*.telegram.org https://web.telegram.org https://*.t.me",
            ].join("; "),
          },
          // Backward compatible directive for some UA
          { key: "X-Frame-Options", value: "ALLOW-FROM https://web.telegram.org" },
        ],
      },
    ];
  },
};

export default nextConfig;
