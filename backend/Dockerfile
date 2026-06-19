# ---- Backend API image ----
FROM node:20-alpine

WORKDIR /app

# Install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# Drop to a non-root user for safety
USER node

CMD ["node", "server.js"]
