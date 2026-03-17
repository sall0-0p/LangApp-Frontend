# Stage 1: Build
FROM node:20-alpine AS build-stage

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy workspace configuration AND root tsconfig
# We need the root package.json, pnpm-workspace.yaml, and tsconfig.json
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./

# 2. Copy the source code for ALL packages
# This is crucial: 'web' depends on 'shared', so both must exist relative to root
COPY shared ./shared
COPY web ./web

# 3. Install dependencies for the ENTIRE workspace
# --frozen-lockfile ensures we use exact versions from pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# 4. Build the specific project
# We run the build command from the root, targeting the web package
RUN pnpm --filter @myapp/web build

# Stage 2: Serve
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the correct path in the monorepo
COPY --from=build-stage /app/web/dist /usr/share/nginx/html

# Copy the nginx config (ensure this file exists in your local web/ directory)
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]