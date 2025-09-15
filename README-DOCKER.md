# GameStore - Aplicación Dockerizada

## Descripción
Una aplicación completa de tienda de videojuegos con arquitectura de microservicios utilizando Docker.

## Arquitectura
- **Frontend**: React 18 + nginx (Puerto 80)
- **Backend**: Node.js + Express (Puerto 5000)
- **Base de datos**: MariaDB (Puerto 3306)

## Estructura del Proyecto
```
gamestore-app/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ... (código React)
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ... (código Node.js)
├── database/
│   ├── Dockerfile
│   └── gamestore_db.sql
└── docker-compose.yml
```

## Requisitos Previos
- Docker Desktop instalado
- Docker Compose instalado

## Instrucciones de Ejecución

### 1. Clonar y navegar al proyecto
```bash
cd gamestore-app
```

### 2. Construir y ejecutar todos los contenedores
```bash
docker-compose up --build
```

### 3. Acceder a la aplicación
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Base de datos**: localhost:3306

### 4. Comandos útiles

#### Ejecutar en segundo plano
```bash
docker-compose up -d
```

#### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

#### Ver logs de un servicio específico
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database
```

#### Detener todos los contenedores
```bash
docker-compose down
```

#### Detener y eliminar volúmenes (datos de la BD)
```bash
docker-compose down -v
```

#### Reconstruir un servicio específico
```bash
docker-compose build backend
docker-compose up -d backend
```

### 5. Health Checks
- **Backend**: http://localhost:5000/api/health
- **Base de datos**: Automático (mysqladmin ping)

## Comunicación entre Contenedores

Los contenedores se comunican a través de una red Docker personalizada llamada `gamestore_network`:

- El **frontend** (nginx) actúa como proxy reverso y redirige las llamadas `/api/*` al **backend**
- El **backend** se conecta a la **base de datos** usando el hostname `database`
- Todos los servicios tienen health checks para garantizar su disponibilidad

## Variables de Entorno

### Base de Datos
- `MYSQL_ROOT_PASSWORD=root`
- `MYSQL_DATABASE=gamestore_db`
- `MYSQL_USER=gamestore_user`
- `MYSQL_PASSWORD=gamestore_password`

### Backend
- `NODE_ENV=production`
- `DB_HOST=database`
- `DB_PORT=3306`
- `DB_USER=gamestore_user`
- `DB_PASSWORD=gamestore_password`
- `DB_NAME=gamestore_db`
- `JWT_SECRET=your-super-secret-jwt-key-for-production`

## Volúmenes Persistentes
- `mariadb_data`: Almacena los datos de la base de datos de forma persistente

## Solución de Problemas

### Si el backend no se conecta a la base de datos:
```bash
docker-compose logs database
docker-compose logs backend
```

### Si el frontend no carga:
```bash
docker-compose logs frontend
```

### Para reiniciar completamente:
```bash
docker-compose down -v
docker-compose up --build
```

## Desarrollo

Para desarrollar localmente mientras los contenedores están ejecutándose:

1. Modificar el código fuente
2. Reconstruir el contenedor específico:
   ```bash
   docker-compose build [frontend|backend|database]
   docker-compose up -d [frontend|backend|database]
   ```

## Producción

Para despliegue en producción:

1. Cambiar las variables de entorno en `docker-compose.yml`
2. Utilizar secrets para las contraseñas
3. Configurar un proxy reverso (nginx/traefik) externo
4. Configurar SSL/TLS
5. Utilizar un registro de contenedores privado