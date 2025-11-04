import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import ProtectedRoute from './components/ProtectedRoute';
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Hero from "./components/hero.jsx";
import About from "./components/about.jsx";
import Services from "./components/services.jsx";
import Departments from "./components/departments.jsx";
import Appointment from './components/appointment.jsx';
import Contact from './components/contact.jsx';
import MedicosPage from "./pages/medicos/page.jsx";
import InnovacionesPage from "./pages/innovaciones/page.jsx";
import InstalacionesPage from "./pages/instalaciones/page.jsx";
import AdminDashboard from "./pages/dashboard/admin/page.jsx";
import MedicoDashboard from "./pages/dashboard/medico/page.jsx";
import PacienteDashboard from "./pages/dashboard/paciente/page.jsx";
import HabitacionesPage from "./pages/dashboard/medico/habitaciones/page.jsx";


function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
      {/* Rutas principales con Header y Footer */}
      <Route
        path="/"
        element={
          <MainLayout>
            <>
              <Hero />
              <About />
              <Services />
              <Departments />
              <Appointment />
              <Contact />
            </>
          </MainLayout>
        }
      />
      <Route
        path="/medicos"
        element={
          <MainLayout>
            <MedicosPage />
          </MainLayout>
        }
      />
      <Route
        path="/innovaciones"
        element={
          <MainLayout>
            <InnovacionesPage />
          </MainLayout>
        }
      />
      <Route
        path="/instalaciones"
        element={
          <MainLayout>
            <InstalacionesPage />
          </MainLayout>
        }
      />

      {/* Rutas del dashboard sin Header ni Footer */}
      <Route 
        path="/dashboard/superadmin" 
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/recepcionista" 
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/medico" 
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <MedicoDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/enfermero" 
        element={
          <ProtectedRoute allowedRoles={[5]}>
            <MedicoDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/paciente" 
        element={
          <ProtectedRoute allowedRoles={[6]}>
            <PacienteDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
    </AuthProvider>
  );
}

export default App;
