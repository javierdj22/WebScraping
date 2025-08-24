import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AppLayout from './components/layout/AppLayout.js';
import Login from './Login.js';
import Applications from './Applications.js';
import JobList from './JobList.js';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');  // Redirige al login si no está autenticado
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div>Redirigiendo al login...</div>; // Puedes mostrar un mensaje de espera o algo similar
  }

  return <>{children}</>; // Si está autenticado, renderiza las rutas protegidas
};

const App = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Estado para controlar la verificación de autenticación

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Puedes agregar más validaciones del token si es necesario
      console.log("Usuario autenticado.");
    } else {
      console.log("Usuario no autenticado.");
    }
    setIsAuthChecked(true); // Una vez verificado, cambia el estado
  }, []);

  if (!isAuthChecked) {
    return <div>Cargando...</div>;  // Mientras se verifica la autenticación
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/jobs" />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="applications" element={<Applications />} />
          <Route path="settings" element={<div>Settings Component (TODO)</div>} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
