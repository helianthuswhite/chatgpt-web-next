/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "chatalpha.oss-cn-beijing.aliyuncs.com",
            },
        ],
    },
};

module.exports = nextConfig;
