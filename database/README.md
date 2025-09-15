# GameStore Database

Este directorio contiene los scripts de base de datos para el proyecto GameStore.

## Estructura de la Base de Datos

### Tablas:

1. **categories** - Categorías de videojuegos
   - id (Primary Key)
   - name (Nombre único de la categoría)
   - description (Descripción de la categoría)
   - created_at, updated_at (Timestamps)

2. **games** - Información de videojuegos
   - id (Primary Key)
   - title (Título del juego)
   - description (Descripción detallada)
   - genre (Género del juego)
   - platform (Plataformas disponibles)
   - price (Precio del juego)
   - release_date (Fecha de lanzamiento)
   - rating (Calificación 0-10)
   - image_url (URL de la imagen)
   - category_id (Foreign Key a categories)
   - created_at, updated_at (Timestamps)

3. **reviews** - Reseñas de usuarios
   - id (Primary Key)
   - game_id (Foreign Key a games)
   - user_name (Nombre del usuario)
   - rating (Calificación 1-5)
   - comment (Comentario)
   - created_at (Timestamp)

## Configuración

1. Asegúrate de tener XAMPP ejecutándose con MariaDB/MySQL
2. Abre phpMyAdmin o cliente MySQL
3. Ejecuta el script `gamestore_db.sql`
4. La base de datos se creará con datos de ejemplo

## Datos de Ejemplo

El script incluye:
- 10 categorías de videojuegos
- 10 juegos de ejemplo con diferentes géneros
- Reseñas de ejemplo para algunos juegos

## Conexión desde Backend

El backend se conecta usando las credenciales:
- Host: localhost
- Usuario: root
- Contraseña: (vacía por defecto en XAMPP)
- Base de datos: gamestore_db
- Puerto: 3306