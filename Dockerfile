# syntax=docker/dockerfile:1.7
# ============================================================
# Multi-app monorepo Dockerfile
# Usage: docker build --build-arg APP_NAME=my-app .
# ============================================================

FROM node:20-alpine AS base
RUN corepack enable && corepack install -g pnpm@10
WORKDIR /app


# ============================================================
# Stage 1: Install ALL dependencies
# ============================================================
FROM base AS deps

# Copy root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy ALL package.jsons preserving directory structure
# This works because BuildKit handles globs before flattening — but we
# need to copy the whole apps/packages dirs at shallow depth.
# Simplest reliable approach: copy everything except src/dist via .dockerignore
COPY apps/ ./apps/
COPY packages/ ./packages/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline


# ============================================================
# Stage 2: Build the selected app
# ============================================================
FROM deps AS builder

ARG APP_NAME
RUN test -n "$APP_NAME" || (echo "ERROR: APP_NAME build arg is required" && exit 1)

COPY turbo.json ./

# .env.production is optional — use a shell trick to avoid hard failure
RUN --mount=type=bind,source=apps,target=/mnt/env-src \
    if [ -f "/mnt/env-src/$APP_NAME/.env.production" ]; then \
      cp "/mnt/env-src/$APP_NAME/.env.production" "./apps/$APP_NAME/.env.production"; \
    fi

RUN --mount=type=cache,id=turbo,target=/root/.cache/turbo \
    pnpm turbo build --filter=@dans-framework/$APP_NAME --cache-dir=/root/.cache/turbo

RUN test -d "apps/$APP_NAME/dist" || \
    (echo "ERROR: Build did not produce apps/$APP_NAME/dist — check turbo.json outputs" && exit 1)


# ============================================================
# Stage 3: Production nginx image
# ============================================================
FROM nginx:1.27-alpine AS runtime

ARG APP_NAME
RUN test -n "$APP_NAME" || (echo "ERROR: APP_NAME build arg is required" && exit 1)

RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    include /etc/nginx/mime.types;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript
               application/json application/xml image/svg+xml;

    add_header X-Frame-Options           "SAMEORIGIN"             always;
    add_header X-Content-Type-Options    "nosniff"                always;
    add_header X-XSS-Protection          "1; mode=block"          always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy        "camera=(), microphone=(), geolocation=()" always;

    server_tokens off;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:js|css|woff2?|ttf|eot|ico|png|jpg|jpeg|svg|gif|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /health {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    location ~ /\. {
        deny all;
    }
}
EOF

RUN chown -R nginx:nginx \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx \
        /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

COPY --from=builder --chown=nginx:nginx \
     /app/apps/$APP_NAME/dist /usr/share/nginx/html

USER nginx
EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]