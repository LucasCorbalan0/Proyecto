import apiClient from './apiClient.js';

const API_URL = '/infraestructura/habitaciones';
const API_URL_CAMAS = '/infraestructura/camas/occupy';

// Obtener todos los elementos de infraestructura
export const getInfraestructura = async () => {
  return apiClient.get(API_URL);
};

// Crear un nuevo elemento
export const createInfraestructura = async (formData) => {
  return apiClient.post(API_URL, formData);
};

// Actualizar un elemento
export const updateInfraestructura = async (id, formData) => {
  // El ID aquí es el id_habitacion de la BD
  return apiClient.put(`${API_URL}/${id}`, formData); 
};

// Eliminar un elemento
export const deleteInfraestructura = async (id) => {
  // El ID es el id_habitacion de la BD
  return apiClient.delete(`${API_URL}/${id}`);
};

// Simular la ocupación de una cama
export const occupyCama = async (habitacionId) => {
  // habitacionId es el id_habitacion de la BD
  return apiClient.post(`${API_URL_CAMAS}/${habitacionId}`);
};