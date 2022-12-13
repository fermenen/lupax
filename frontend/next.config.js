const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  env: {
    NEXT_PUBLIC_URL_BASE_API: process.env.NEXT_PUBLIC_URL_BASE_API,
    NEXT_PUBLIC_URI_SUPERTOKENS: process.env.NEXT_PUBLIC_URI_SUPERTOKENS,
    NEXT_PUBLIC_API_KEY_SUPERTOKENS: process.env.NEXT_PUBLIC_API_KEY_SUPERTOKENS,
    NEXT_PUBLIC_WEBSITE_DOMAIN: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
    NEXT_PUBLIC_ID_EXTENSION_CHROME: process.env.NEXT_PUBLIC_ID_EXTENSION_CHROME,
    NEXT_PUBLIC_DSN_GLITCHTIP: process.env.NEXT_PUBLIC_DSN_GLITCHTIP
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
