// Este archivo crea el contexto de autenticación.
// Sirve para compartir la información del usuario (logueado o no)
// entre todos los componentes de la aplicación sin tener que pasar props manualmente.

import { createContext } from 'react';

// Se crea el contexto, que será usado por el AuthProvider
const AuthContext = createContext();

export default AuthContext;
