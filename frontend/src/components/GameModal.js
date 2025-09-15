import React from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  StarIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  TagIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/solid';

const GameModal = ({ game, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !game) return null;

  const formatPrice = (price) => {
    return price === 0 ? 'GRATIS' : `$${price.toFixed(2)}`;
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return 'text-green-400';
    if (rating >= 7) return 'text-yellow-400';
    if (rating >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={game.image_url || 'https://via.placeholder.com/800x400/1f2937/6366f1?text=GameStore'}
            alt={game.title}
            className="w-full h-64 object-cover rounded-t-2xl"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/1f2937/6366f1?text=GameStore';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
          
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="w-6 h-6" />
          </motion.button>

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-gaming-purple text-white px-3 py-1 rounded-full text-sm font-semibold">
              {game.category_name || game.genre}
            </span>
          </div>

          {/* Title and rating */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className={`font-semibold ${getRatingColor(game.rating)}`}>
                  {game.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <span className={`text-2xl font-bold ${game.price === 0 ? 'text-green-400' : 'text-gaming-cyan'}`}>
                {formatPrice(game.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">{game.description}</p>
          </div>

          {/* Game Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <TagIcon className="w-5 h-5 text-gaming-purple" />
                <div>
                  <span className="text-gray-400 text-sm">Género</span>
                  <p className="text-white font-medium">{game.genre}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="w-5 h-5 text-gaming-blue" />
                <div>
                  <span className="text-gray-400 text-sm">Plataformas</span>
                  <p className="text-white font-medium">{game.platform}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-gaming-cyan" />
                <div>
                  <span className="text-gray-400 text-sm">Fecha de Lanzamiento</span>
                  <p className="text-white font-medium">
                    {game.release_date ? formatDate(game.release_date) : 'No disponible'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-gaming-pink" />
                <div>
                  <span className="text-gray-400 text-sm">Precio</span>
                  <p className={`font-bold text-lg ${game.price === 0 ? 'text-green-400' : 'text-gaming-cyan'}`}>
                    {formatPrice(game.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-700">
            <motion.button
              onClick={() => onAddToCart(game)}
              className="flex-1 btn-primary flex items-center justify-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </motion.button>
            
            <motion.button
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Comprar Ahora
            </motion.button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">Información Adicional</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">ID del Juego:</span>
                <span className="text-white ml-2">#{game.id}</span>
              </div>
              <div>
                <span className="text-gray-400">Categoría:</span>
                <span className="text-white ml-2">{game.category_name || 'Sin categoría'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameModal;