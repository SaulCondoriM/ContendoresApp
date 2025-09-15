const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint para Docker
app.get('/api/health', (req, res) => {
  // Verificar conexión a la base de datos
  db.ping((err) => {
    if (err) {
      return res.status(503).json({ 
        status: 'error', 
        message: 'Database connection failed' 
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Backend is healthy',
      timestamp: new Date().toISOString()
    });
  });
});

// Configuración de conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gamestore_db',
  port: process.env.DB_PORT || 3306,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Función para conectar con reintentos
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
    
    // Configurar el manejador de desconexión
    db.on('error', (err) => {
      console.error('Error en la base de datos:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connectWithRetry();
      } else {
        throw err;
      }
    });
  });
  
  return db;
}

// Crear conexión a la base de datos
const db = connectWithRetry();

// Rutas

// Obtener todos los juegos
app.get('/api/games', (req, res) => {
  const query = `
    SELECT g.*, c.name as category_name 
    FROM games g 
    LEFT JOIN categories c ON g.category_id = c.id 
    ORDER BY g.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener juegos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
});

// Obtener un juego por ID
app.get('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const query = `
    SELECT g.*, c.name as category_name 
    FROM games g 
    LEFT JOIN categories c ON g.category_id = c.id 
    WHERE g.id = ?
  `;
  
  db.query(query, [gameId], (err, results) => {
    if (err) {
      console.error('Error al obtener juego:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// Crear un nuevo juego
app.post('/api/games', (req, res) => {
  const { title, description, genre, platform, price, release_date, rating, image_url, category_id } = req.body;
  
  if (!title || !description || !genre || !platform || price === undefined) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }
  
  const query = `
    INSERT INTO games (title, description, genre, platform, price, release_date, rating, image_url, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [title, description, genre, platform, price, release_date, rating || 0, image_url, category_id];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear juego:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Juego creado exitosamente' 
    });
  });
});

// Actualizar un juego
app.put('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const { title, description, genre, platform, price, release_date, rating, image_url, category_id } = req.body;
  
  const query = `
    UPDATE games 
    SET title = ?, description = ?, genre = ?, platform = ?, price = ?, 
        release_date = ?, rating = ?, image_url = ?, category_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  
  const values = [title, description, genre, platform, price, release_date, rating, image_url, category_id, gameId];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar juego:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.json({ message: 'Juego actualizado exitosamente' });
  });
});

// Eliminar un juego
app.delete('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  
  db.query('DELETE FROM games WHERE id = ?', [gameId], (err, result) => {
    if (err) {
      console.error('Error al eliminar juego:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    
    res.json({ message: 'Juego eliminado exitosamente' });
  });
});

// Obtener todas las categorías
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY name', (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
});

// Crear una nueva categoría
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
  }
  
  const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
  
  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error('Error al crear categoría:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Categoría creada exitosamente' 
    });
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🎮 GameStore API está funcionando!',
    version: '1.0.0',
    endpoints: [
      'GET /api/games - Obtener todos los juegos',
      'GET /api/games/:id - Obtener un juego específico',
      'POST /api/games - Crear un nuevo juego',
      'PUT /api/games/:id - Actualizar un juego',
      'DELETE /api/games/:id - Eliminar un juego',
      'GET /api/categories - Obtener todas las categorías',
      'POST /api/categories - Crear una nueva categoría'
    ]
  });
});

// Manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Panel de documentación disponible en http://localhost:${PORT}`);
});

module.exports = app;