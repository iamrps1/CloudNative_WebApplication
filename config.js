const config = {
    siteName: {
        fullName: 'Cloud Native Web Application',
        shortName: 'CNWA'
    },
    siteDescription: 'A cloud-native web application built with Next.js and AWS',
    aws: {
        region: process.env.AWS_REGION,
        s3BucketName: process.env.AWS_S3_BUCKET_NAME
    }
};

export default config; 