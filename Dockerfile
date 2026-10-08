FROM node:16-alpine

WORKDIR /app

# Install build deps for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package.json .
RUN npm install --production

COPY app.js .

# Data volume for SQLite db
RUN mkdir -p /data

VOLUME ["/data"]

EXPOSE 3000

CMD ["node", "app.js"]
