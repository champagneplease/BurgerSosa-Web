# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Build the NestJS application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Generate Prisma client for production
RUN npx prisma generate

# Copy a startup script
COPY start.sh ./
RUN chmod +x start.sh

# Start the application using the startup script
CMD ["./start.sh"]
