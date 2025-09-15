import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de red
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const gameService = {
  // Obtener todos los juegos
  getAllGames: async () => {
    try {
      const response = await api.get('/games');
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar los juegos');
    }
  },

  // Obtener un juego específico
  getGameById: async (id) => {
    try {
      const response = await api.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar el juego');
    }
  },

  // Crear un nuevo juego
  createGame: async (gameData) => {
    try {
      const response = await api.post('/games', gameData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear el juego');
    }
  },

  // Actualizar un juego
  updateGame: async (id, gameData) => {
    try {
      const response = await api.put(`/games/${id}`, gameData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar el juego');
    }
  },

  // Eliminar un juego
  deleteGame: async (id) => {
    try {
      const response = await api.delete(`/games/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar el juego');
    }
  },
};

export const categoryService = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar las categorías');
    }
  },

  // Crear una nueva categoría
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear la categoría');
    }
  },
};

export default api;