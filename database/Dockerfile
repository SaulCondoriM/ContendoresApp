# Usar la imagen oficial de MariaDB
FROM mariadb:10.11

# Variables de entorno para la configuración de MariaDB
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=gamestore_db
ENV MYSQL_USER=gamestore_user
ENV MYSQL_PASSWORD=gamestore_password

# Copiar el script SQL de inicialización
COPY ./gamestore_db.sql /docker-entrypoint-initdb.d/

# Exponer el puerto 3306
EXPOSE 3306

# Configurar el charset por defecto
ENV MYSQL_CHARSET=utf8mb4
ENV MYSQL_COLLATION=utf8mb4_unicode_ci

# MariaDB se iniciará automáticamente con el script CMD heredado de la imagen base