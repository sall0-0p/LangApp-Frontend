# Stage 1: Build
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Install pnpm if not present in the base image
RUN npm install -g pnpm
RUN pnpm install
COPY web .
RUN pnpm build

# Stage 2: Serve
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]