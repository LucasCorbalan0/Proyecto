import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Hero from '../components/hero.jsx';
import About from '../components/about.jsx';
import Services from '../components/services.jsx';
import Departments from '../components/departments.jsx';
import Appointment from '../components/appointment.jsx';
import Contact from '../components/contact.jsx';
import MedicosPage from '../app/medicos/page.jsx';
import InnovacionesPage from '../app/innovaciones/page.jsx';
import InstalacionesPage from '../app/instalaciones/page.jsx';
import AdminDashboard from '../app/dashboard/admin/page.jsx';
import MedicoDashboard from '../app/dashboard/medico/page.jsx';
import PacienteDashboard from '../app/dashboard/paciente/page.jsx';
import HabitacionesPage from '../app/dashboard/medico/habitaciones/page.jsx';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Services />
              <Departments />
              <Appointment />
              <Contact />
            </>
          }
        />
        <Route path="/medicos" element={<MedicosPage />} />
        <Route path="/innovaciones" element={<InnovacionesPage />} />
        <Route path="/instalaciones" element={<InstalacionesPage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/medico" element={<MedicoDashboard />} />
        <Route path="/dashboard/paciente" element={<PacienteDashboard />} />
        <Route path="/dashboard/medico/habitaciones" element={<HabitacionesPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
