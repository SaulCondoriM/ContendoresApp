import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Components
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import GameModal from '../components/GameModal';
import LoadingSpinner from '../components/LoadingSpinner';

// Services
import { gameService, categoryService } from '../services/api';

const Home = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gamesData, categoriesData] = await Promise.all([
          gameService.getAllGames(),
          categoryService.getAllCategories()
        ]);
        
        setGames(gamesData);
        setFilteredGames(gamesData);
        setCategories(categoriesData);
        
        toast.success(`¡${gamesData.length} juegos cargados!`);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar y ordenar juegos
  useEffect(() => {
    let filtered = games;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(game => game.category_id === parseInt(selectedCategory));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'release_date':
          return new Date(b.release_date) - new Date(a.release_date);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredGames(filtered);
  }, [games, searchTerm, selectedCategory, sortBy]);

  const handleViewDetails = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleAddToCart = (game) => {
    setCartCount(prev => prev + 1);
    toast.success(`${game.title} agregado al carrito!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#1f2937',
        color: '#fff',
      },
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGame(null);
  };

  const getFeaturedGames = () => {
    return games
      .filter(game => game.rating >= 8.5)
      .slice(0, 3);
  };

  const getTopRatedGames = () => {
    return games
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  };

  const getFreeGames = () => {
    return games.filter(game => game.price === 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar cartCount={cartCount} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingSpinner size="large" message="Cargando la tienda de videojuegos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar cartCount={cartCount} />
      <Toaster position="top-right" />

      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Bienvenido a{' '}
              <span className="text-gradient">GameStore</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Descubre los mejores videojuegos, desde los últimos lanzamientos hasta los clásicos favoritos.
            </p>
            <motion.button
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('games').scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar Juegos
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Games Section */}
      {getFeaturedGames().length > 0 && (
        <section className="py-16 px-4">
          <div className="container-responsive">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4 text-center">
                <span>Juegos Destacados</span>
              </h2>
              <p className="text-gray-400 text-lg">Los mejores juegos con las calificaciones más altas</p>
            </motion.div>

            <div className="hero-stats-grid">
              {getFeaturedGames().map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCard
                    game={game}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section id="games" className="py-16 px-4 section-gradient">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Todos los Juegos</h2>
            <p className="text-gray-400 text-lg">Encuentra tu próximo juego favorito</p>
          </motion.div>

          {/* Search and Filters */}
          <div className="filters-grid">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-gaming w-full"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-gaming"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-gaming"
            >
              <option value="created_at">Más recientes</option>
              <option value="title">Nombre A-Z</option>
              <option value="price">Precio</option>
              <option value="rating">Calificación</option>
              <option value="release_date">Fecha de lanzamiento</option>
            </select>
          </div>

          {/* Games Grid */}
          <AnimatePresence>
            <div className="games-grid">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GameCard
                    game={game}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {filteredGames.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">No se encontraron juegos con los filtros seleccionados.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Top Rated Section */}
      {getTopRatedGames().length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4 text-center">
                <span>Mejor Valorados</span>
              </h2>
              <p className="text-gray-400 text-lg">Los juegos con las mejores reseñas de nuestra comunidad</p>
            </motion.div>

            <div className="games-grid">
              {getTopRatedGames().map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCard
                    game={game}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Free Games Section */}
      {getFreeGames().length > 0 && (
        <section className="py-16 px-4 section-gradient">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4 text-center">
                <span>Juegos Gratuitos</span>
              </h2>
              <p className="text-gray-400 text-lg">Los mejores juegos sin costo alguno</p>
            </motion.div>

            <div className="games-grid">
              {getFreeGames().map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCard
                    game={game}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/50 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-gaming-purple to-gaming-cyan p-2 rounded-lg">
              <span className="text-white text-xl">🎮</span>
            </div>
            <span className="text-2xl font-bold text-gradient">GameStore</span>
          </div>
          <p className="text-gray-400 mb-4">
            Tu destino definitivo para los mejores videojuegos
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 GameStore. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Game Modal */}
      <AnimatePresence>
        {showModal && (
          <GameModal
            game={selectedGame}
            isOpen={showModal}
            onClose={closeModal}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;