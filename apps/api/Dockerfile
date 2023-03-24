FROM node:16-alpine AS builder
WORKDIR "/app"
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:16-alpine AS production

# Expose an override these when the container is built
ENV MAIL_FROM=''
ENV MAIL_TRANSPORT=''

ENV JWT_SECRET=''
ENV JWT_EXPIRES_IN=''
ENV JWT_REFRESH_SECRET=''
ENV JWT_REFRESH_EXPIRES_IN=''

ENV DATABASE_URL=''
ENV RUN_MIGRATIONS=true
ENV RUN_SEEDERS=true

ENV NODE_ENV=production

WORKDIR "/app"
# Add curl and check if its available
RUN apk --no-cache add curl
RUN curl --version

# copy application files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

#expose docker port
EXPOSE 3000

CMD [ "sh", "-c", "npm run start:prod"]

