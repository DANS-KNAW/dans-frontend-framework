# Fetching the latest node image on apline linux
FROM node:18-alpine AS builder
RUN apk update && apk add git && npm i -g turbo && npm i -g pnpm

# Setting up the work directory
WORKDIR /app

COPY . .
RUN git submodule update --init --recursive
## RUN turbo prune --scope=@dans-framework/ohsmart --docker
RUN pnpm i && pnpm build --filter=@dans-framework/ohsmart

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/apps/ohsmart/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY apps/ohsmart/nginx.conf /etc/nginx/conf.d/default.conf
