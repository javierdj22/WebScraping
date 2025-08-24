import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queries } from './api/queries.js'; // Asegúrate que las rutas sean correctas
import dayjs from 'dayjs';

// Componente para mostrar la lista de aplicaciones
const Applications = () => {
  const { data: applications, isLoading, error } = useQuery(
    queries.applications.list().queryKey,
    queries.applications.list().queryFn
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div>Error al cargar las aplicaciones</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Mis Postulaciones</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Fecha</th>
              <th>Empresa</th>
              <th>Puesto</th>
              <th>Estado</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((app : any) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td>{dayjs(app.appliedAt).format('DD/MM/YYYY')}</td>
                <td>{app.company || 'N/A'}</td>
                <td>{app.position || 'N/A'}</td>
                <td>{app.status || 'Pendiente'}</td>
                <td>{app.emailSent && (app.emailStatus === 'sent' ? 'Enviado' : 'Error')}</td>
                <td>
                  <button className="text-indigo-600 hover:text-indigo-900">Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;  