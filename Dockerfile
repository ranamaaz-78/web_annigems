# Stage 1: storefront build (Vite + React)
FROM node:22-alpine AS build
WORKDIR /app

# Set these in Coolify as build-time variables
ARG VITE_API_URL
ARG VITE_CURRENCY=EUR

COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .

# Stops the build if VITE_API_URL is missing, otherwise the site would call localhost
RUN test -n "$VITE_API_URL" && npm run build

# Stage 2: Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
