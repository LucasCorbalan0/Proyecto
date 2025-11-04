// src/services/auth.service.js
import apiClient from './apiClient.js'; // Importamos nuestro cliente Axios

// Llama a POST /api/auth/login
export const login = (nombre_usuario, password) => {
  return apiClient.post('/auth/login', {
    nombre_usuario,
    password
  });
};

// Llama a POST /api/auth/register
export const register = (datosDelFormulario) => {
  // datosDelFormulario = { nombre, apellido, dni, ... }
  return apiClient.post('/auth/register', datosDelFormulario);
};

// Llama a GET /api/auth/profile
export const getProfile = () => {
  // El interceptor de apiClient.js se encarga de poner el token
  return apiClient.get('/auth/profile');
};