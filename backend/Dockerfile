FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend

RUN npm ci --omit=dev

COPY backend .

COPY shared ../shared

CMD ["node", "app.js"]