# Sistema de Gestión Hospitalaria

Este proyecto está organizado en dos partes principales: Frontend y Backend.

## Estructura del Proyecto

```
Proyecto/
├── Frontend/                # Aplicación React + Vite
│   ├── src/                # Código fuente del frontend
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── assets/        # Recursos estáticos
│   │   └── ...
│   ├── public/            # Archivos públicos
│   └── ...                # Archivos de configuración (vite, eslint, etc.)
│
├── Backend/               # Servidor Node.js + Express
│   ├── config/           # Configuración del servidor
│   ├── controllers/      # Controladores
│   ├── middleware/       # Middleware personalizado
│   ├── routes/          # Rutas de la API
│   └── server.js        # Punto de entrada del servidor
│
└── README.md            # Este archivo

```

## Configuración del Proyecto

### Frontend
1. Navegar al directorio Frontend:
   ```bash
   cd Frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Backend
1. Navegar al directorio Backend:
   ```bash
   cd Backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   - Crear archivo `.env` basado en `.env.example`
   - Configurar las variables necesarias
4. Iniciar el servidor:
   ```bash
   npm start
   ```

## Base de Datos
- El sistema utiliza MySQL
- La base de datos por defecto es 'hospitaldb'
- Asegúrate de tener MySQL instalado y corriendo
- Configura las credenciales en el archivo `.env` del Backend