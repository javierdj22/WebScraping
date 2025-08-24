import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Si no está abierto, no renderizar el modal
  if (!isOpen) return null;

  // Usar useEffect para manejar el evento de "Escape" de forma más limpia
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Solo añadir el listener cuando el modal esté abierto
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      // Eliminar el listener al desmontar o cuando el modal se cierre
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[80vh] overflow-y-auto relative" // Reduje la altura a 80% de la pantalla
        onClick={(e) => e.stopPropagation()} // Previene cerrar el modal al hacer clic dentro
      >
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {children}

        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
