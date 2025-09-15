# Dockerfile para Backend (Node.js/Express)
FROM node:18-alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]