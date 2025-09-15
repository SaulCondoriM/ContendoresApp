import React from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  EyeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/solid';

const GameCard = ({ game, onViewDetails, onAddToCart }) => {
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return numPrice === 0 ? 'GRATIS' : `$${numPrice.toFixed(2)}`;
  };

  const getRatingColor = (rating) => {
    const numRating = Number(rating) || 0;
    if (numRating >= 9) return 'text-green-400';
    if (numRating >= 7) return 'text-yellow-400';
    if (numRating >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className="card-gaming game-card cursor-pointer group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        border: '1px solid #374151',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Imagen del juego */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px', flex: '0 0 auto' }}>
        <img
          src={game.image_url || 'https://via.placeholder.com/300x200/1f2937/6366f1?text=GameStore'}
          alt={game.title}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/1f2937/6366f1?text=GameStore';
          }}
        />
        
        {/* Overlay con botones */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }} className="group-hover:opacity-100">
          <motion.button
            onClick={() => onViewDetails(game)}
            style={{
              background: '#6366f1',
              color: 'white',
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.1, background: '#3b82f6' }}
            whileTap={{ scale: 0.9 }}
          >
            <EyeIcon style={{ width: '16px', height: '16px' }} />
          </motion.button>
          
          <motion.button
            onClick={() => onAddToCart(game)}
            style={{
              background: '#16a34a',
              color: 'white',
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.1, background: '#15803d' }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCartIcon style={{ width: '16px', height: '16px' }} />
          </motion.button>
        </div>

        {/* Badge de precio */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            background: Number(game.price) === 0 ? '#16a34a' : '#06b6d4',
            color: 'white'
          }}>
            {formatPrice(game.price)}
          </span>
        </div>

        {/* Badge de categoría */}
        {game.category_name && (
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span style={{
              background: '#6366f1',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {game.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Información del juego */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1', justifyContent: 'space-between' }}>
        <div style={{ flex: '1' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            lineHeight: '1.4',
            transition: 'color 0.3s ease',
            marginBottom: '8px'
          }} className="group-hover:text-cyan-400">
            {game.title}
          </h3>

          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0,
            lineHeight: '1.5',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            marginBottom: '12px'
          }}>
            {game.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <StarIcon style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
            <span style={{
              fontSize: '14px',
              fontWeight: '600'
            }} className={getRatingColor(game.rating)}>
              {game.rating ? Number(game.rating).toFixed(1) : 'N/A'}
            </span>
          </div>            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              {game.platform?.split(',')[0] || 'PC'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid #374151',
            marginBottom: '16px'
          }}>
            <span style={{ color: '#06b6d4', fontWeight: '600', fontSize: '14px' }}>
              {game.genre}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CurrencyDollarIcon style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
              <span style={{
                fontWeight: 'bold',
                color: Number(game.price) === 0 ? '#16a34a' : 'white',
                fontSize: '14px'
              }}>
                {formatPrice(game.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            onClick={() => onViewDetails(game)}
            className="btn-secondary"
            style={{
              flex: 1,
              fontSize: '13px',
              padding: '10px 14px',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ver Detalles
          </motion.button>
          
          <motion.button
            onClick={() => onAddToCart(game)}
            className="btn-primary"
            style={{
              flex: 1,
              fontSize: '13px',
              padding: '10px 14px',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Agregar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;