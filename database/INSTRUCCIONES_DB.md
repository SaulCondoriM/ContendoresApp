# 🗃️ Configuración de Base de Datos - GameStore

## Instrucciones para Configurar la Base de Datos

### Paso 1: Iniciar XAMPP
1. Abre XAMPP Control Panel
2. Inicia los servicios **Apache** y **MySQL**
3. Verifica que el estado sea "Running" para ambos

### Paso 2: Acceder a phpMyAdmin
1. Abre tu navegador
2. Ve a: http://localhost/phpmyadmin
3. Usa las credenciales por defecto (usuario: `root`, sin contraseña)

### Paso 3: Crear la Base de Datos
1. En phpMyAdmin, haz clic en la pestaña **"SQL"**
2. Copia y pega el contenido completo del archivo `gamestore_db.sql`
3. Haz clic en **"Continuar"** o **"Go"**
4. Verifica que se haya creado la base de datos `gamestore_db`

### Paso 4: Verificar la Instalación
Deberías ver:
- ✅ Base de datos `gamestore_db` creada
- ✅ Tabla `categories` con 10 registros
- ✅ Tabla `games` con 10 juegos de ejemplo
- ✅ Tabla `reviews` con reseñas de ejemplo

### Credenciales de Conexión
```
Host: localhost
Usuario: root
Contraseña: (vacía)
Base de datos: gamestore_db
Puerto: 3306
```

### Verificación Rápida
Ejecuta esta consulta en phpMyAdmin para verificar:
```sql
SELECT 
    (SELECT COUNT(*) FROM categories) as categorias,
    (SELECT COUNT(*) FROM games) as juegos,
    (SELECT COUNT(*) FROM reviews) as reseñas;
```

Resultado esperado: `categorias: 10, juegos: 10, reseñas: 6`

---

Una vez configurada la base de datos, puedes continuar con la ejecución del backend y frontend.