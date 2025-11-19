# Sistema de Gestión Hospitalaria

Plataforma completa de gestión hospitalaria con dashboard de pacientes, búsqueda de médicos, reserva de turnos, gestión de consultas, recetas, estudios y facturación.

## 🚀 Stack Tecnológico

**Frontend:**

- React 18 con Vite
- Tailwind CSS para estilos
- Axios para HTTP requests
- React Router para navegación

**Backend:**

- Node.js + Express
- MySQL/MariaDB
- JWT para autenticación
- Express Async Handler

## 📁 Estructura del Proyecto

```
Proyecto/
├── Frontend/
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/
│   │   │   └── dashboard/
│   │   │       ├── paciente/    # Dashboard del paciente
│   │   │       │   ├── sections/    # Módulos (Inicio, Consultas, etc.)
│   │   │       │   └── services/    # API service layer
│   │   │       └── ...
│   │   ├── context/             # React Context (autenticación)
│   │   ├── hooks/               # Hooks personalizados
│   │   └── services/            # Servicios globales
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── Backend/
│   ├── config/
│   │   └── database.js          # Conexión MySQL
│   ├── controllers/
│   │   ├── pacienteController.js
│   │   ├── medicoController.js
│   │   ├── auth.controller.js
│   │   └── ...
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── pacienteRoutes.js
│   │   ├── medicoRoutes.js
│   │   └── ...
│   ├── index.js                 # Punto de entrada
│   ├── .env                     # Variables de entorno
│   └── package.json
│
├── Dump20251023.sql             # Dump de BD
└── README.md
```

## ⚙️ Configuración

### Prerequisites

- Node.js v16+
- MySQL 8.0+
- npm o yarn

### Backend Setup

1. Navegar al directorio Backend:

```bash
cd Backend
npm install
```

2. Crear archivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=hospitaldb
PORT=3001
JWT_SECRET=tu_secreto_aqui
```

3. Importar base de datos:

```bash
mysql -h localhost -u root -p123456 hospitaldb < ../Dump20251023.sql
```

4. Iniciar servidor:

```bash
npm run dev
```

### Frontend Setup

1. Navegar al directorio Frontend:

```bash
cd Frontend
npm install
```

2. Iniciar servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🔌 API Endpoints Principales

### Autenticación

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Médico Dashboard

- `GET /api/medicos/:id_medico/stats` - Estadísticas del médico
- `GET /api/medicos/:id_medico/turnos` - Turnos en espera
- `GET /api/medicos/:id_medico/disponibilidad` - Disponibilidad horaria
- `POST /api/medicos/:id_medico/disponibilidad` - Agregar disponibilidad
- `GET /api/medicos/:id_medico/consultas` - Consultas realizadas
- `POST /api/medicos/:id_medico/consultas` - Crear consulta
- `GET /api/medicos/:id_medico/recetas` - Recetas emitidas
- `POST /api/medicos/:id_medico/recetas` - Crear receta
- `GET /api/medicos/:id_medico/estudios` - Estudios solicitados
- `POST /api/medicos/:id_medico/estudios` - Solicitar estudio
- `GET /api/medicos/:id_medico/cirugias` - Cirugías programadas
- `POST /api/medicos/:id_medico/cirugias` - Programar cirugía
- `GET /api/medicos/paciente/:id_paciente/historial-clinico` - Historial clínico completo del paciente

### Paciente Dashboard

- `GET /api/pacientes/dashboard/:id` - Resumen dashboard
- `GET /api/pacientes/datos/:id` - Datos personales
- `GET /api/pacientes/:id/historia-clinica` - Historia clínica
- `GET /api/pacientes/consultas/:id` - Consultas
- `GET /api/pacientes/recetas/:id` - Recetas
- `GET /api/pacientes/estudios/:id` - Estudios
- `GET /api/pacientes/facturas/:id` - Facturas

### Búsqueda de Médicos y Turnos

- `GET /api/pacientes/especialidades` - Listar especialidades
- `GET /api/pacientes/medicos` - Buscar médicos
- `GET /api/pacientes/disponibilidad/:id_medico` - Disponibilidad
- `POST /api/pacientes/:id_paciente/reservar-turno` - Reservar turno

## 📊 Base de Datos

La aplicación utiliza MySQL con las siguientes tablas principales:

- `usuarios` - Usuarios del sistema
- `pacientes` - Datos de pacientes
- `medicos` - Información de médicos
- `turnos` - Turnos reservados
- `consultas` - Registro de consultas
- `recetas` - Recetas médicas
- `estudios_medicos` - Estudios realizados
- `facturas` - Facturación
- `disponibilidad_medicos` - Horarios disponibles

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Después del login, el token se almacena en localStorage y se envía con cada request.

## 📊 Características Principales

✅ Dashboard integral del médico

- Inicio con estadísticas (consultas, recetas, disponibilidad)
- Agenda de turnos con pacientes
- Historial clínico completo de pacientes
- Gestión de disponibilidad horaria
- Registro de consultas con diagnósticos
- Emisión de recetas electrónicas
- Solicitud de estudios médicos
- Programación de cirugías

✅ Dashboard integral del paciente
✅ Búsqueda y filtro de médicos por especialidad
✅ Reserva de turnos online
✅ Visualización de consultas y recetas
✅ Gestión de estudios médicos
✅ Sistema de facturación
✅ Historia clínica del paciente
✅ Autenticación JWT segura

## 🛠️ Desarrollo

Para desarrollo, ambos servidores deben estar corriendo:

Terminal 1 (Backend):

```bash
cd Backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd Frontend
npm run dev
```

## 📄 Licencia

Proyecto privado - Hospital
