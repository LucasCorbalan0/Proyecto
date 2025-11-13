import apiClient from './apiClient.js'; // Importamos nuestro cliente Axios

// Llama a POST /api/auth/login
// Devuelve la respuesta del backend con { token, usuario }
export const login = async (nombre_usuario, password) => {
  const response = await apiClient.post('/auth/login', {
    nombre_usuario,
    password
  });

  console.log('Login response:', response.data);
  
  // Guardamos el token JWT en localStorage (necesario para los interceptores de Axios)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  // El contexto se encarga de guardar el usuario en localStorage
  // (en el componente LoginModal llamamos a authLogin(usuario))
  
  return response;
};

// Llama a POST /api/auth/register
export const register = (datosDelFormulario) => {
  // datosDelFormulario = { nombre, apellido, dni, genero, direccion, email, telefono, nombre_usuario, password }
  return apiClient.post('/auth/register', datosDelFormulario);
};

// Llama a GET /api/auth/profile
export const getProfile = () => {
  // El interceptor de apiClient.js se encarga de poner el token
  return apiClient.get('/auth/profile');
};