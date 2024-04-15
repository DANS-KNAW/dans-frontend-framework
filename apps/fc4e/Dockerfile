# Fetching the latest node image on apline linux
FROM node:18-alpine AS builder
RUN apk update && apk add git && npm i -g turbo && npm i -g pnpm

# Setting up the work directory
WORKDIR /app

COPY . .
RUN git submodule update --init --recursive

## RUN turbo prune --scope=@dans-framework/fc4e --docker
RUN pnpm i && pnpm build --filter=@dans-framework/fc4e

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/apps/fc4e/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY apps/fc4e/nginx.conf /etc/nginx/conf.d/default.conf
