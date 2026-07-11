FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend .

COPY shared ../shared


FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/app.js"]