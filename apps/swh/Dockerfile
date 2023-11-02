# Fetching the latest node image on apline linux
FROM node:18-alpine AS builder
RUN apk update
RUN apk add git

# Setting up the work directory
WORKDIR /app

RUN yarn global add turbo
RUN yarn global add pnpm

COPY . .
## RUN turbo prune --scope=@dans-framework/swh --docker
RUN pnpm i
RUN pnpm build --filter=@dans-framework/swh

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/apps/swh/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY apps/swh/nginx.conf /etc/nginx/conf.d/default.conf