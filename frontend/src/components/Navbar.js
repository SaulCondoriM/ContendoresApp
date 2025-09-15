import React from 'react';
import { motion } from 'framer-motion';
import { 
  ComputerDesktopIcon, 
  ShoppingBagIcon, 
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Navbar = ({ cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Inicio', href: '#home', icon: ComputerDesktopIcon },
    { name: 'Juegos', href: '#games', icon: ComputerDesktopIcon },
    { name: 'Categorías', href: '#categories', icon: ComputerDesktopIcon },
    { name: 'Ofertas', href: '#offers', icon: ComputerDesktopIcon },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-50"
      style={{ 
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #374151'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <motion.div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            whileHover={{ scale: 1.05 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              padding: '8px',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
            }}>
              <ComputerDesktopIcon style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              GameStore
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div style={{ display: 'none' }} className="desktop-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '40px' }}>
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  style={{
                    color: '#d1d5db',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05, color: '#06b6d4' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Cart Button */}
            <motion.button
              style={{
                position: 'relative',
                padding: '8px',
                color: '#d1d5db',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.1, color: '#06b6d4' }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBagIcon style={{ width: '24px', height: '24px' }} />
              {cartCount > 0 && (
                <motion.span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ec4899',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Button */}
            <motion.button
              style={{
                padding: '8px',
                color: '#d1d5db',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.1, color: '#06b6d4' }}
              whileTap={{ scale: 0.9 }}
            >
              <UserCircleIcon style={{ width: '24px', height: '24px' }} />
            </motion.button>

            {/* Mobile menu button */}
            <div className="mobile-menu">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  padding: '8px',
                  color: '#d1d5db',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <XMarkIcon style={{ width: '24px', height: '24px' }} />
                ) : (
                  <Bars3Icon style={{ width: '24px', height: '24px' }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ paddingBottom: '12px' }}
          >
            <div style={{
              padding: '8px',
              marginTop: '8px',
              background: 'rgba(17, 24, 39, 0.5)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  style={{
                    color: '#d1d5db',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ x: 5, color: '#06b6d4' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon style={{ width: '20px', height: '20px' }} />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;