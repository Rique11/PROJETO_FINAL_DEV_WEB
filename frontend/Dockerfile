# Site estático (next.config.ts usa output: "export") servido pelo nginx.
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# O Next.js grava este valor no JavaScript durante o build.
# No Coolify, cadastre como "Build Variable". Ex.: https://api.<ip>.sslip.io/api/v1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "Defina NEXT_PUBLIC_API_URL como build variable." && exit 1)

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
