# backend/Dockerfile
FROM node:16-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json .
RUN npm install

# Copiar código fuente
COPY src ./src

# Variables de entorno
ENV PORT=3000
ENV MONGO_URI=mongodb://database:27017/fda

EXPOSE 3000

CMD ["node", "src/server.js"]