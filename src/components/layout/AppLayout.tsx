import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  PaperAirplaneIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const menuItems = [
  { text: 'Ofertas', icon: BriefcaseIcon, path: '/jobs' },
  { text: 'Postulaciones', icon: PaperAirplaneIcon, path: '/applications' },
  { text: 'Configuración', icon: Cog6ToothIcon, path: '/settings' }
];

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <div className="fixed inset-y-0 flex w-64 flex-col">
        <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
          <h1 className="text-xl font-bold text-white">Bot CV Dashboard</h1>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto bg-gray-800">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.text}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex flex-1 flex-col pl-64">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
