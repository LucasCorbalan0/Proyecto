import apiClient from './apiClient'; 


const BASE_PATH = '/admin/users'; 

// [GET] Obtener todos los usuarios
export const getUsers = () => apiClient.get(BASE_PATH);

// [POST] Crear un nuevo usuario
export const createUser = (data) => apiClient.post(BASE_PATH, data);

// [PUT] Actualizar un usuario existente
export const updateUser = (id, data) => apiClient.put(`${BASE_PATH}/${id}`, data);

// [PUT] Cambiar el estado activo/inactivo
export const toggleActiveUser = (id) => apiClient.put(`${BASE_PATH}/toggle/${id}`);

// [DELETE] Eliminar un usuario
export const deleteUser = (id) => apiClient.delete(`${BASE_PATH}/${id}`);
