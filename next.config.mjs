/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        AWS_REGION: process.env.AWS_REGION,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    },
}

export default nextConfig
