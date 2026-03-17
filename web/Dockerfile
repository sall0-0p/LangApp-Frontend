# Stage 1: Build the application
FROM node:20-alpine AS build-stage

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy lockfile and package.json first to leverage Docker caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the app (adjust 'build' if your script name is different)
RUN pnpm build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the previous stage
# Note: Check if your build folder is 'dist' or 'build'
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy your custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]