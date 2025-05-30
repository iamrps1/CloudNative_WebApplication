# Step 1: Base image
FROM node:18-alpine AS builder
WORKDIR /app

# Step 2: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 3: Copy source code and build app
COPY . .
RUN npm run build

# Step 4: Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "run", "start"]
