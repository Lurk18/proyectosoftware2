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
ENV DATABASE_URL=postgres://miusuario:mipassword@database:5432/mibasededatos

EXPOSE 3000

CMD ["node", "src/server.js"]