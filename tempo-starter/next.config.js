/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Optimize webpack for better performance and cache handling
  webpack: (config, { isServer, dev }) => {
    // Optimize module resolution
    config.resolve.symlinks = false;

    // Optimize memory usage and prevent large string serialization
    config.optimization.moduleIds = "deterministic";
    config.optimization.chunkIds = "deterministic";

    // Add cache optimization for production builds
    if (!dev) {
      // Use memory cache with size limits to prevent large string serialization
      config.cache = {
        type: "memory",
        maxGenerations: 1,
      };

      // Optimize for smaller bundles
      config.optimization.minimize = true;
    }

    // Optimize chunk splitting to reduce bundle sizes
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate vendor chunks to improve caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
            enforce: true,
          },
          // Separate common chunks
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  // Enable compression
  compress: true,
  // Optimize build output
  generateBuildId: async () => {
    // Use a shorter build ID to reduce string sizes
    return `build-${Date.now()}`;
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 13.4.8 up to 14.1.3:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],

    // NextJS 15+ (Not yet supported, coming soon)
  };
}

module.exports = nextConfig;
