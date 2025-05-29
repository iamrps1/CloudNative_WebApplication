# Cloud Native Web Application

A Next.js web application with AWS integration, featuring authentication, file uploads, and more.

## Features

- Next.js 15.1.0 with App Router
- AWS Integration (S3, DynamoDB)
- Authentication with NextAuth.js
- Docker Support
- PDF Viewer and File Upload
- Responsive UI

## Prerequisites

- Node.js 18+
- Docker
- AWS Account with proper credentials

## Environment Variables

Create a `.env` file with:

```env
AWS_REGION=your-region
AWS_S3_BUCKET_NAME=your-bucket
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Docker

```bash
# Build image
docker build -t nextjs-aws-app .

# Run container
docker run -p 3000:3000 \
  -e AWS_REGION=your-region \
  -e AWS_S3_BUCKET_NAME=your-bucket \
  nextjs-aws-app
```

## Testing Credentials

- Email: admin@example.com
- Password: password123

## Project Structure

```
src/
  ├── app/           # Next.js app router
  ├── components/    # React components
  ├── lib/          # Utilities and helpers
  └── utils/        # Common utilities
```

## License

MIT
