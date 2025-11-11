import apiClient from './apiClient.js'; // Importamos nuestro cliente Axios

// Llama a POST /api/auth/login
export const login = async (nombre_usuario, password) => {
  const response = await apiClient.post('/auth/login', {
    nombre_usuario,
    password
  });

  console.log('Login response:', response.data);
  
  // Guardamos el token JWT
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  // Guardamos los datos del usuario
  if (response.data.usuario) {
    console.log('Usuario recibido:', response.data.usuario);
    if (response.data.usuario.id_paciente) {
      localStorage.setItem('id_paciente', response.data.usuario.id_paciente);
    }
    localStorage.setItem('nombre', response.data.usuario.nombre);
    localStorage.setItem('apellido', response.data.usuario.apellido);
    localStorage.setItem('email', response.data.usuario.email);
    localStorage.setItem('rol', response.data.usuario.rol);
  }
  
  return response;
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