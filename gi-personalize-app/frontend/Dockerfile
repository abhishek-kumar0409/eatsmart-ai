# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from the build stage to nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
