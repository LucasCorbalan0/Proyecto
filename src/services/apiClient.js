// src/services/apiClient.js
import axios from 'axios';

// 1. Creamos una instancia de Axios
const apiClient = axios.create({
  // Esta es la URL de tu back-end
  baseURL: 'http://localhost:3001/api', 
});

// 2. Configuramos un "interceptor"
// Esta función se ejecutará ANTES de cada petición.
apiClient.interceptors.request.use(
  (config) => {
    // 3. Busca el token que guardamos en el login
    const token = localStorage.getItem('token');

    // 4. Si el token existe, lo añade a los encabezados
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;