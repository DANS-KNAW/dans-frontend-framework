# Fetching the latest node image on apline linux
FROM node:20-alpine AS builder
RUN apk update && apk add git && npm i -g turbo && npm i -g pnpm

# Setting up the work directory
WORKDIR /app

COPY . .
RUN git submodule update --init --recursive
## RUN turbo prune --scope=@dans-framework/4tu --docker
RUN pnpm i && pnpm build --filter=@dans-framework/4tu

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/apps/4tu/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY apps/4tu/nginx.conf /etc/nginx/conf.d/default.conf
