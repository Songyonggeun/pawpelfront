/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images:{
        deviceSizes:[320, 480, 640, 750, 828, 1080, 1200, 1440, 1920],
        imageSizes:[16, 32, 48, 64, 96, 128, 256, 384],
        formats:["image/webp","image/avif"]
    },
    env: {},
    compress:true,
    experimental:{
    }
}
export default nextConfig;