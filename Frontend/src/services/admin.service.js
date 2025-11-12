import apiClient from './apiClient'; 


const BASE_PATH = '/admin/users'; 

// Mapeo de nombres de rol a IDs (basado en valores comunes del sistema)
const roleMap = {
  'Médico': 1,
  'Enfermero': 2,
  'Recepcionista': 3,
  'Administrativo': 4,
  'Paciente': 5
};

// Mapeador de campos del formulario frontend a campos del backend
const mapFormToBackend = (formData) => {
  const roleId = roleMap[formData.rol] || 1; // Default a Médico (1)
  
  return {
    nombre: formData.nombre,
    apellido: formData.apellido,
    dni: formData.dni,
    email: formData.email,
    fecha_nacimiento: formData.fechaNacimiento || null,
    telefono: formData.telefono,
    nombre_usuario: formData.username,
    genero: formData.genero,
    direccion: formData.direccion,
    password: formData.password,
    id_rol_sistema: roleId
  };
};

// [GET] Obtener todos los usuarios
export const getUsers = () => apiClient.get(BASE_PATH);

// [POST] Crear un nuevo usuario
export const createUser = (data) => {
  const backendData = mapFormToBackend(data);
  return apiClient.post(BASE_PATH, backendData);
};

// [PUT] Actualizar un usuario existente
export const updateUser = (id, data) => {
  const backendData = mapFormToBackend(data);
  return apiClient.put(`${BASE_PATH}/${id}`, backendData);
};

// [PUT] Cambiar el estado activo/inactivo
export const toggleActiveUser = (id) => apiClient.put(`${BASE_PATH}/toggle/${id}`);

// [DELETE] Eliminar un usuario
export const deleteUser = (id) => apiClient.delete(`${BASE_PATH}/${id}`);
