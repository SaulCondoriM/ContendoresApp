# 🎮 GameStore - Aplicación de Videojuegos

Una aplicación completa de tienda de videojuegos construida con **React**, **Node.js/Express** y **MariaDB**.

## 🌟 Características

- **Frontend React** con diseño moderno y animaciones
- **Backend API RESTful** con Node.js y Express
- **Base de datos MariaDB** con datos de ejemplo
- **Diseño responsivo** y tema gaming
- **Gestión de videojuegos** (CRUD completo)
- **Sistema de categorías** y filtros
- **Carrito de compras** simulado
- **Interfaz atractiva** con gradientes y efectos visuales

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (animaciones)
- Heroicons
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MySQL2 (para MariaDB)
- CORS
- dotenv

### Base de Datos
- MariaDB/MySQL
- Esquema optimizado con índices
- Datos de ejemplo incluidos

## 📁 Estructura del Proyecto

```
gamestore-app/
├── backend/           # Servidor API Node.js
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/          # Aplicación React
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   └── public/
├── database/          # Scripts de base de datos
│   ├── gamestore_db.sql
│   └── README.md
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- XAMPP con MariaDB/MySQL
- Git

### 1. Configurar Base de Datos

1. Inicia XAMPP y asegúrate de que MySQL esté ejecutándose
2. Abre phpMyAdmin (http://localhost/phpmyadmin)
3. Importa o ejecuta el archivo `database/gamestore_db.sql`
4. Verifica que la base de datos `gamestore_db` se haya creado correctamente

### 2. Configurar Backend

```bash
cd backend
npm install
npm run dev
```

El servidor estará disponible en http://localhost:5000

### 3. Configurar Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en http://localhost:3000

## 🎯 Funcionalidades

### Backend API
- `GET /api/games` - Obtener todos los juegos
- `GET /api/games/:id` - Obtener un juego específico
- `POST /api/games` - Crear un nuevo juego
- `PUT /api/games/:id` - Actualizar un juego
- `DELETE /api/games/:id` - Eliminar un juego
- `GET /api/categories` - Obtener categorías
- `POST /api/categories` - Crear categoría

### Frontend Features
- 🏠 Página principal con juegos destacados
- 🔍 Búsqueda y filtros avanzados
- 🏆 Sección de mejores valorados
- 🆓 Juegos gratuitos
- 📱 Diseño completamente responsivo
- 🛒 Carrito de compras (simulado)
- 🎨 Tema gaming con animaciones

## 🎮 Datos de Ejemplo

La base de datos incluye:
- **10 categorías** de videojuegos
- **10 juegos** de ejemplo con diferentes géneros
- **Reseñas** de usuarios
- **Imágenes** de placeholder atractivas

## 🔧 Configuración Avanzada

### Variables de Entorno (Backend)
Edita el archivo `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gamestore_db
DB_PORT=3306
```

### Personalización del Frontend
- Colores y temas en `tailwind.config.js`
- Estilos personalizados en `src/index.css`
- Configuración de API en `src/services/api.js`

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
1. Verifica que XAMPP esté ejecutándose
2. Confirma las credenciales en `.env`
3. Asegúrate de que la base de datos `gamestore_db` existe

### Problemas con las dependencias
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Puerto en uso
Si el puerto 3000 o 5000 están ocupados:
- Frontend: La aplicación te preguntará si quieres usar otro puerto
- Backend: Cambia el `PORT` en el archivo `.env`

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Sistema de pagos
- [ ] Reseñas reales de usuarios
- [ ] Wishlist personal
- [ ] Sistema de descuentos
- [ ] Modo administrador

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Desarrollador

Creado con ❤️ para demostrar una aplicación full-stack moderna con tecnologías web actuales.

---

¡Disfruta explorando GameStore! 🎮✨