# Fetching the latest node image on apline linux
FROM node:18-alpine AS builder
RUN apk update
RUN apk add git

# Setting up the work directory
WORKDIR /app

RUN yarn global add turbo
RUN yarn global add pnpm

COPY . .
## RUN turbo prune --scope=@dans-framework/rda --docker
RUN pnpm i
RUN pnpm build --filter=@dans-framework/rda

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/apps/rda/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY apps/rda/nginx.conf /etc/nginx/conf.d/default.conf