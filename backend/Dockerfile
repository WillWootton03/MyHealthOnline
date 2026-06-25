# Parent image for Node.js
FROM node:22-alpine

# Set working dir
WORKDIR /usr/src/app

# Copy pkg manager files
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# EXPOSE ON PORT
EXPOSE 3000

# RUN npm app in dev mode
CMD ["npm", "run", "dev"]