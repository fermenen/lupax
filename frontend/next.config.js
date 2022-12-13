const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  env: {
    NEXT_PUBLIC_URL_BASE_API: process.env.NEXT_PUBLIC_URL_BASE_API,
    NEXT_PUBLIC_WEBSITE_DOMAIN: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN
  },
  async rewrites() {
    return [
      {
        source: "/bee.js",
        destination: "https://cdn.splitbee.io/sb.js",
      },
      {
        source: "/_hive/:slug",
        destination: "https://hive.splitbee.io/:slug",
      },
    ];
  },

}

module.exports = nextConfig
