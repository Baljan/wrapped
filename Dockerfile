# Builds the static export and serves it with nginx.
# (GitHub Pages is the primary target, see .github/workflows/pages.yml.)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
