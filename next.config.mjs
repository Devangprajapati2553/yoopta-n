/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: {
    module: {
      loaders: [
        {
          test: /plugin\.css$/,
          loaders: ["style-loader", "css"],
        },
      ],
    },
  },
};

export default nextConfig;
