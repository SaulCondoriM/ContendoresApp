-- Script de inicialización para Docker
-- La base de datos ya está creada por las variables de entorno de Docker

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de juegos
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    release_date DATE,
    rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 10),
    image_url VARCHAR(500),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_genre (genre),
    INDEX idx_platform (platform),
    INDEX idx_rating (rating),
    INDEX idx_price (price)
);

-- Tabla de reviews (para futuras implementaciones)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Insertar categorías por defecto
INSERT IGNORE INTO categories (name, description) VALUES
('Acción', 'Juegos de acción y aventura con combate y adrenalina'),
('RPG', 'Juegos de rol donde desarrollas personajes y historias'),
('Estrategia', 'Juegos que requieren planificación y táctica'),
('Deportes', 'Simuladores deportivos y juegos competitivos'),
('Aventura', 'Juegos enfocados en exploración y narrativa'),
('Puzzle', 'Juegos de lógica y resolución de problemas'),
('Simulación', 'Simuladores de vida real y gestión'),
('Terror', 'Juegos de horror y suspenso'),
('Multijugador', 'Juegos diseñados para múltiples jugadores'),
('Indie', 'Juegos desarrollados por estudios independientes');

-- Insertar juegos de ejemplo
INSERT IGNORE INTO games (title, description, genre, platform, price, release_date, rating, image_url, category_id) VALUES
('Cyber Warriors 2024', 'Un épico juego de acción cyberpunk en un mundo futurista donde debes salvar la humanidad de la inteligencia artificial corrupta.', 'Acción/Aventura', 'PC, PlayStation 5, Xbox Series X', 59.99, '2024-03-15', 9.2, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop', 1),

('Dragon Quest: Legends', 'Embárcate en una aventura épica en un mundo de fantasía lleno de dragones, magia y héroes legendarios.', 'RPG', 'PC, Nintendo Switch', 49.99, '2024-02-20', 8.8, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop', 2),

('Tactical Empire', 'Construye tu imperio y conquista el mundo en este innovador juego de estrategia en tiempo real.', 'Estrategia', 'PC, Mac', 39.99, '2024-01-10', 8.5, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop', 3),

('FIFA Champions 2024', 'La experiencia futbolística más realista con equipos actualizados y modos de juego innovadores.', 'Deportes', 'PC, PlayStation 5, Xbox Series X', 69.99, '2024-04-01', 9.0, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop', 4),

('Mystery Island', 'Explora una isla misteriosa llena de secretos antiguos y resuelve enigmas para descubrir la verdad.', 'Aventura', 'PC, PlayStation 5, Xbox Series X, Nintendo Switch', 34.99, '2024-05-12', 8.3, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop', 5),

('Brain Teasers Pro', 'Desafía tu mente con cientos de puzzles únicos y entrenamientos cerebrales diseñados por expertos.', 'Puzzle', 'PC, Mobile, Nintendo Switch', 19.99, '2024-06-01', 8.7, 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=300&fit=crop', 6),

('City Builder Deluxe', 'Diseña y gestiona la ciudad de tus sueños con herramientas avanzadas y físicas realistas.', 'Simulación', 'PC, Mac', 44.99, '2024-03-25', 8.4, 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=500&h=300&fit=crop', 7),

('Nightmare Manor', 'Adéntrate en una mansión embrujada donde cada habitación esconde terrores inimaginables.', 'Terror', 'PC, PlayStation 5, Xbox Series X', 29.99, '2024-07-15', 8.9, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop', 8),

('Battle Royale Ultimate', 'Lucha hasta el final en mapas gigantes con hasta 200 jugadores en batallas épicas.', 'Multijugador', 'PC, PlayStation 5, Xbox Series X, Mobile', 0.00, '2024-08-01', 9.1, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop', 9),

('Pixel Art Adventure', 'Un hermoso juego indie con arte pixel que cuenta una historia emotiva sobre amistad y valor.', 'Indie', 'PC, Nintendo Switch', 24.99, '2024-09-01', 8.6, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop', 10);

-- Insertar algunas reviews de ejemplo
INSERT IGNORE INTO reviews (game_id, user_name, rating, comment) VALUES
(1, 'GamerPro2024', 5, '¡Increíble experiencia! Los gráficos son espectaculares y la historia te atrapa desde el primer minuto.'),
(1, 'CyberFan', 4, 'Muy buen juego, aunque algunos bugs menores. Definitivamente recomendado.'),
(2, 'RPGMaster', 5, 'El mejor RPG que he jugado en años. Las mecánicas son profundas y adictivas.'),
(3, 'StrategyKing', 4, 'Excelente para los amantes de la estrategia. Requiere mucho pensamiento.'),
(4, 'SoccerLover', 5, '¡El realismo es impresionante! Se siente como estar en un estadio real.'),
(5, 'AdventureSeeker', 4, 'Historia intrigante y puzzles bien diseñados. Muy atmospheric.');

-- Crear índices adicionales para mejorar rendimiento
CREATE INDEX idx_games_title ON games(title);
CREATE INDEX idx_games_created_at ON games(created_at);
CREATE INDEX idx_reviews_game_rating ON reviews(game_id, rating);

-- Mostrar estadísticas finales
SELECT 'Categorías creadas' as Tabla, COUNT(*) as Total FROM categories
UNION ALL
SELECT 'Juegos creados' as Tabla, COUNT(*) as Total FROM games
UNION ALL
SELECT 'Reviews creadas' as Tabla, COUNT(*) as Total FROM reviews;