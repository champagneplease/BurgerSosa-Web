# Build stage
FROM node:20-alpine as build

WORKDIR /app

# COPY package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Accept VITE_API_URL as a build argument and set it as ENV so Vite picks it up during bundling
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=80

# Copy the Nginx configuration template (Nginx Alpine will auto-replace ${PORT})
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# We don't use EXPOSE because Railway uses the PORT env variable dynamically

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
