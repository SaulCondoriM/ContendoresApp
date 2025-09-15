# Documentación Técnica - GameStore Dockerizada

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Configuración de Contenedores](#configuración-de-contenedores)
3. [Comunicación entre Contenedores](#comunicación-entre-contenedores)
4. [Dockerfiles Explicados](#dockerfiles-explicados)
5. [Docker Compose Orquestación](#docker-compose-orquestación)
6. [Health Checks y Monitoreo](#health-checks-y-monitoreo)
7. [Volúmenes y Persistencia](#volúmenes-y-persistencia)
8. [Variables de Entorno](#variables-de-entorno)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura General

### Diagrama de Arquitectura
```
┌─────────────────────────────────────────────────────────┐
│                    HOST SYSTEM                          │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │   Frontend    │  │    Backend    │  │  Database   │ │
│  │   (nginx)     │  │  (Node.js)    │  │  (MariaDB)  │ │
│  │   Port 3000   │  │   Port 5000   │  │  Port 3307  │ │
│  │               │  │               │  │             │ │
│  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌─────────┐ │ │
│  │ │   React   │ │  │ │  Express  │ │  │ │ MariaDB │ │ │
│  │ │   Build   │ │  │ │    API    │ │  │ │ Server  │ │ │
│  │ └───────────┘ │  │ └───────────┘ │  │ └─────────┘ │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
│           │                  │                  │      │
│           │    gamestore_network (bridge)       │      │
│           └─────────────────────┬────────────────┘      │
│                                │                       │
└────────────────────────────────────────────────────────┘
```

### Stack Tecnológico por Contenedor
- **Frontend**: React 18 + nginx Alpine
- **Backend**: Node.js 18 + Express + MySQL2
- **Database**: MariaDB 10.11 + datos iniciales

---

## 🐳 Configuración de Contenedores

### 1. Container Frontend

#### Características Técnicas:
- **Imagen Base**: `node:18-alpine` (build) + `nginx:alpine` (serve)
- **Estrategia**: Multi-stage build
- **Puerto Interno**: 80
- **Puerto Externo**: 3000
- **Dependencias**: Backend container health check

#### Proceso de Build:
1. **Stage 1 (Build)**:
   ```dockerfile
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   ```

2. **Stage 2 (Serve)**:
   ```dockerfile
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   ```

#### Configuración nginx:
- Sirve archivos estáticos de React
- Proxy reverso para `/api/*` → `http://backend:5000`
- Manejo de SPA (Single Page Application) routing

### 2. Container Backend

#### Características Técnicas:
- **Imagen Base**: `node:18-alpine`
- **Puerto**: 5000
- **Dependencias**: Database container health check
- **Health Check**: Endpoint `/api/health`

#### Funcionalidades Implementadas:
- **Conexión con Retry**: Reintenta conexión a DB cada 5 segundos
- **Manejo de Desconexiones**: Reconexión automática
- **Health Endpoint**: Verifica estado de DB y API
- **CORS Habilitado**: Para comunicación con frontend

#### Lógica de Conexión Mejorada:
```javascript
function connectWithRetry() {
  const db = mysql.createConnection(dbConfig);
  
  db.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err.message);
      console.log('⏳ Reintentando conexión en 5 segundos...');
      setTimeout(connectWithRetry, 5000);
      return;
    }
    console.log('✅ Conectado a la base de datos MariaDB');
  });
  
  return db;
}
```

### 3. Container Database

#### Características Técnicas:
- **Imagen Base**: `mariadb:10.11`
- **Puerto Interno**: 3306
- **Puerto Externo**: 3307 (evita conflicto con XAMPP)
- **Inicialización**: Script SQL automático

#### Configuración de Inicialización:
- Variables de entorno para configuración automática
- Script SQL ejecutado en `/docker-entrypoint-initdb.d/`
- Creación automática de usuario y base de datos

---

## 🔗 Comunicación entre Contenedores

### Red Docker Personalizada
```yaml
networks:
  gamestore_network:
    driver: bridge
```

### Flujo de Comunicación

#### 1. Usuario → Frontend
```
Browser Request: http://localhost:3000
└── nginx Container (port 80 interno)
    ├── Static Files: Serve React build
    └── API Calls: Proxy to backend
```

#### 2. Frontend → Backend
```
Frontend Request: /api/games
├── nginx proxy_pass: http://backend:5000
└── Backend Container: Express server
```

#### 3. Backend → Database
```
Backend Query: SELECT * FROM games
├── Connection: mysql://gamestore_user@database:3306
└── Database Container: MariaDB server
```

### Resolución de Nombres
- **Hostname Resolution**: Docker DNS interno
- **Service Names**: `frontend`, `backend`, `database`
- **Network Isolation**: Solo contenedores en `gamestore_network`

---

## 📄 Dockerfiles Explicados

### Frontend Dockerfile (Multi-stage)
```dockerfile
# Etapa 1: Build de React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install                    # Todas las dependencias para build
COPY . .
RUN npm run build                  # Genera carpeta /build

# Etapa 2: Servidor nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html   # Solo archivos compilados
COPY nginx.conf /etc/nginx/conf.d/default.conf      # Configuración personalizada
EXPOSE 80
```

**Ventajas del Multi-stage**:
- Imagen final más pequeña (solo archivos compilados)
- No incluye Node.js ni dependencias de desarrollo
- Optimización para producción

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache curl        # Para health checks
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production       # Solo dependencias de producción
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Optimizaciones**:
- Alpine Linux (imagen más ligera)
- Solo dependencias de producción
- curl instalado para health checks

### Database Dockerfile
```dockerfile
FROM mariadb:10.11
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=gamestore_db
ENV MYSQL_USER=gamestore_user
ENV MYSQL_PASSWORD=gamestore_password
COPY ./gamestore_db.sql /docker-entrypoint-initdb.d/
EXPOSE 3306
```

**Funcionalidades**:
- Configuración automática via variables de entorno
- Inicialización automática de schema y datos
- Ejecución de scripts SQL al primer arranque

---

## 🎛️ Docker Compose Orquestación

### Configuración Principal
```yaml
services:
  database:
    build: ./database
    ports: ["3307:3306"]
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot"]
      timeout: 20s
      retries: 10
    
  backend:
    build: ./backend
    ports: ["5000:5000"]
    depends_on:
      database:
        condition: service_healthy    # Espera que DB esté ready
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      timeout: 10s
      retries: 5
    
  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on:
      backend:
        condition: service_healthy    # Espera que Backend esté ready
```

### Orden de Inicialización
1. **Database**: Se inicia primero, ejecuta health check
2. **Backend**: Espera a que database esté healthy, luego inicia
3. **Frontend**: Espera a que backend esté healthy, luego inicia

### Dependencias y Health Checks
- **Secuencial**: Cada contenedor espera al anterior
- **Validación**: Health checks aseguran disponibilidad real
- **Fault Tolerance**: Reintentos automáticos en fallos

---

## 🔍 Health Checks y Monitoreo

### Database Health Check
```bash
mysqladmin ping -h localhost -u root -proot
```
- **Propósito**: Verifica que MariaDB acepta conexiones
- **Frecuencia**: Cada 20 segundos
- **Reintentos**: 10 veces antes de marcar como unhealthy

### Backend Health Check
```bash
curl -f http://localhost:5000/api/health
```
- **Propósito**: Verifica API y conexión a DB
- **Respuesta Esperada**: `{"status":"ok"}`
- **Frecuencia**: Cada 10 segundos

### Frontend Monitoring
- **No Health Check**: nginx es muy estable
- **Dependencia**: Solo inicia si backend está healthy
- **Logs**: Acceso y error logs de nginx

### Comandos de Monitoreo
```bash
# Ver estado de contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f [service_name]

# Ver health status específico
docker inspect gamestore_backend --format='{{.State.Health.Status}}'
```

---

## 💾 Volúmenes y Persistencia

### Volumen de Base de Datos
```yaml
volumes:
  mariadb_data:
    driver: local
```

#### Características:
- **Persistencia**: Datos sobreviven a recreación de contenedores
- **Ubicación**: Gestionado por Docker Engine
- **Backup**: Puede ser respaldado usando Docker volumes

#### Comandos de Gestión:
```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect gamestore-app_mariadb_data

# Backup del volumen
docker run --rm -v gamestore-app_mariadb_data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz /data

# Restore del volumen
docker run --rm -v gamestore-app_mariadb_data:/data -v $(pwd):/backup alpine tar xzf /backup/db-backup.tar.gz -C /
```

---

## 🔧 Variables de Entorno

### Database Environment
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root
  MYSQL_DATABASE: gamestore_db
  MYSQL_USER: gamestore_user
  MYSQL_PASSWORD: gamestore_password
  MYSQL_CHARSET: utf8mb4
  MYSQL_COLLATION: utf8mb4_unicode_ci
```

### Backend Environment
```yaml
environment:
  NODE_ENV: production
  DB_HOST: database              # Hostname del contenedor DB
  DB_PORT: 3306                  # Puerto interno (no el 3307 externo)
  DB_USER: gamestore_user
  DB_PASSWORD: gamestore_password
  DB_NAME: gamestore_db
  JWT_SECRET: your-super-secret-jwt-key-for-production
  PORT: 5000
```

### Consideraciones de Seguridad
- **Desarrollo**: Variables hardcodeadas en docker-compose.yml
- **Producción**: Usar Docker secrets o archivos .env
- **JWT Secret**: Cambiar por valor seguro en producción
- **DB Passwords**: Usar secrets management en producción

---

## 🚨 Troubleshooting

### Problemas Comunes y Soluciones

#### 1. Puerto Ocupado
**Error**: `bind: address already in use`
**Causa**: Puerto ya usado por otro servicio (ej: XAMPP en 80, 3306)
**Solución**:
```yaml
ports:
  - "3000:80"    # Cambiar puerto externo
  - "3307:3306"  # Usar puerto alternativo
```

#### 2. Backend No Conecta a DB
**Error**: `connect ECONNREFUSED`
**Causa**: Backend intenta conectar antes que DB esté listo
**Solución**: Implementado retry logic en backend
```javascript
function connectWithRetry() {
  // Reintenta cada 5 segundos
  setTimeout(connectWithRetry, 5000);
}
```

#### 3. Frontend No Carga
**Problema**: nginx no sirve archivos React
**Solución**: Verificar nginx.conf y try_files
```nginx
location / {
    try_files $uri $uri/ /index.html;  # SPA routing
}
```

#### 4. API Calls Fallan desde Frontend
**Problema**: CORS o proxy mal configurado
**Solución**: nginx proxy_pass correcto
```nginx
location /api/ {
    proxy_pass http://backend:5000;
}
```

### Comandos de Debugging

#### Logs Detallados
```bash
# Logs de todos los servicios
docker compose logs -f

# Logs de servicio específico
docker compose logs -f backend

# Logs desde timestamp específico
docker compose logs --since 2023-01-01T10:00:00 backend
```

#### Inspección de Contenedores
```bash
# Entrar al contenedor en ejecución
docker compose exec backend sh
docker compose exec database mysql -u root -p

# Inspeccionar configuración
docker inspect gamestore_backend

# Ver procesos dentro del contenedor
docker compose exec backend ps aux
```

#### Network Debugging
```bash
# Listar redes
docker network ls

# Inspeccionar red
docker network inspect gamestore-app_gamestore_network

# Test de conectividad entre contenedores
docker compose exec backend ping database
docker compose exec frontend curl backend:5000/api/health
```

### Performance Monitoring
```bash
# Estadísticas de recursos
docker stats

# Uso de recursos por contenedor
docker compose exec backend top
docker compose exec database mysqladmin processlist -u root -p
```

---

## 📊 Métricas y Performance

### Recursos por Contenedor
- **Database**: ~150MB RAM, datos persistentes
- **Backend**: ~50MB RAM, procesamiento de API
- **Frontend**: ~20MB RAM, solo nginx sirviendo estáticos

### Tiempos de Startup
- **Database**: ~30 segundos (inicialización + health check)
- **Backend**: ~15 segundos (después de DB ready)
- **Frontend**: ~5 segundos (después de backend ready)

### Optimizaciones Implementadas
- **Multi-stage builds**: Reduce tamaño de imagen frontend
- **Alpine images**: Menor superficie de ataque y tamaño
- **Health checks**: Evita traffic a contenedores no ready
- **Production npm install**: Solo dependencias necesarias

---

## 🎯 Conclusión

Esta configuración proporciona:

1. **Aislamiento**: Cada servicio en su propio contenedor
2. **Escalabilidad**: Fácil escalar servicios individualmente
3. **Mantenibilidad**: Configuración declarativa y versionada
4. **Robustez**: Health checks y retry logic
5. **Desarrollo Local**: Fácil setup con un comando
6. **Portabilidad**: Funciona en cualquier sistema con Docker

La arquitectura permite desarrollo, testing y despliegue consistente across diferentes ambientes.

---

*Documentación técnica creada para GameStore v1.0 - Septiembre 2025*