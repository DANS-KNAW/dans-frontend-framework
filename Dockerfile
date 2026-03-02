# -------------------------------
# Ultimate multi-app Dockerfile
# -------------------------------

FROM node:20-alpine AS builder

# -------------------------------
# Install tools
# -------------------------------
RUN apk add --no-cache git curl bash
RUN npm install -g turbo pnpm

WORKDIR /app
ARG APP_NAME=ohsmart

# -------------------------------
# Step 1: Copy lockfiles + package.json for caching
# -------------------------------
COPY package.json pnpm-lock.yaml ./
COPY apps/$APP_NAME/package.json ./apps/$APP_NAME/
COPY packages/*/package.json ./packages/*/

# Install dependencies (cached if lockfiles unchanged)
RUN pnpm install --frozen-lockfile

# -------------------------------
# Step 2: Cache Vite & Turbo configs
# -------------------------------
COPY vite.config.ts vite.config.js tsconfig.json ./

# -------------------------------
# Step 3: Copy app source code
# -------------------------------
COPY apps/$APP_NAME ./apps/$APP_NAME
COPY packages ./packages

# -------------------------------
# Step 4: Prepare Vite cache directory (optional but very fast)
# -------------------------------
# This ensures Vite chunks persist across builds
RUN mkdir -p /app/.vite-cache
ENV VITE_CACHE_DIR=/app/.vite-cache

# -------------------------------
# Step 5: Build only the selected app (Turbo + Vite)
# -------------------------------
RUN pnpm turbo build --filter=@dans-framework/$APP_NAME

# -------------------------------
# Step 6: Optional copy of Turbo cache to preserve incremental builds
# -------------------------------
RUN mkdir -p /app/.turbo-cache
ENV TURBO_CACHE_DIR=/app/.turbo-cache
RUN cp -r .turbo /app/.turbo-cache

# -------------------------------
# Nginx stage
# -------------------------------
FROM nginx:alpine

ARG APP_NAME=ohsmart

# Copy the built assets
COPY --from=builder /app/apps/$APP_NAME/dist /usr/share/nginx/html

# Copy app-specific nginx config
COPY apps/$APP_NAME/nginx.conf /etc/nginx/conf.d/default.conf