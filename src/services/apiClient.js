// src/services/apiClient.js
import axios from 'axios';

// 1. Creamos una instancia de Axios
const apiClient = axios.create({
  // Esta es la URL de tu back-end
  baseURL: 'http://localhost:3001/api', 
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores en las respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Si el token no es válido o ha expirado
      if (error.response.status === 401) {
        // Limpiamos el localStorage
        localStorage.clear();
        // Redirigimos al login
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;