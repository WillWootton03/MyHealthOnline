FROM node:22-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend

RUN npm ci 

COPY backend .
COPY shared ../shared

RUN npm run build

FROM node:22-alpine

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/backend/dist ./dist

CMD ["node", "dist/backend/app.js"]