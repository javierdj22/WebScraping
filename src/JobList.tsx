import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mutations } from './api/mutation.js';
import Modal from './components/modal/Modal.js';

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  link: string;
}

interface JobDetail {
  company: string;
  level: string;
  location: string;
  logoUrl: string;
  requirements: string[];
  summaryHtml: string;
  title: string;
}

const JobList = () => {
  const [jobs, setJobs] = useState<ScrapedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ScrapedJob | null>(null);
  const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mutación para obtener trabajos scrapeados
  const scrapeMutation = useMutation(() => mutations.scrapeJobs("full Stack").mutationFn(), {
    onMutate: () => {
      setIsLoadingJobs(true);
      setError(null);
    },
    onSuccess: (data: any) => {
      setIsLoadingJobs(false);
      if (Array.isArray(data?.results)) {
        setJobs(data.results);
      } else {
        setJobs([]);
        setError("No se encontraron resultados");
      }
    },
    onError: (err: any) => {
      setIsLoadingJobs(false);
      setError("Error al obtener los trabajos");
      console.error(err);
    },
  });

  // Mutación para obtener detalles de un trabajo
  const jobDetailMutation = useMutation(
    (link: string) => mutations.getJobDetail(link).mutationFn(),
    {
      onMutate: () => {
        setIsLoadingDetail(true);
        setError(null);
      },
      onSuccess: (data: any) => {
        setIsLoadingDetail(false);
        console.log("data detail:", data?.results);
        
        setJobDetail(data?.results);
      },
      onError: (err: any) => {
        setIsLoadingDetail(false);
        setError("Error al obtener los detalles del trabajo");
        console.error(err);
      },
    }
  );

  // Función para manejar la búsqueda de trabajos
  const handleScrape = () => {
    scrapeMutation.mutate();
  };

  // Función para manejar el clic en un trabajo
  const handleJobClick = (job: ScrapedJob) => {
    console.log("Trabajo seleccionado:", job);
    setSelectedJob(job); // Establece el trabajo seleccionado
    jobDetailMutation.mutate(job.link); // Obtiene los detalles del trabajo
  };

  // Función para cerrar el modal sin perder los detalles
  const handleCloseModal = () => {
    setSelectedJob(null); // Solo elimina el trabajo seleccionado
    setJobDetail(null);  // Limpiar los detalles del trabajo al cerrar el modal
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Listado de Ofertas Scrapeadas</h2>

      <button
        onClick={handleScrape}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isLoadingJobs}
      >
        {isLoadingJobs ? "Buscando trabajos..." : "Buscar trabajos Full Stack"}
      </button>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <ul>
        {jobs.map((job, idx) => (
          <li
            key={idx}
            className="mb-2 p-2 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => handleJobClick(job)}
          >
            <strong>{job.title || "Sin título"}</strong> - <em>{job.company || "Sin empresa"}</em> - <span>{job.location || "Sin ubicación"}</span>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={selectedJob !== null} // Solo se muestra si hay un trabajo seleccionado
        onClose={handleCloseModal}
        title={selectedJob?.title || 'Detalles del trabajo'}
      >
        {isLoadingDetail && !jobDetail ? (
          <p className="text-center text-gray-500">Cargando detalles...</p>
        ) : jobDetail ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-4">
            {/* Columna izquierda: Logo, Empresa, Ubicación y Nivel */}
            <div className="space-y-6">
              {/* Logo */}
              {jobDetail.logoUrl ? (
                <div className="flex justify-center">
                  <img
                    src={jobDetail.logoUrl}
                    alt="Logo de la empresa"
                    className="h-20 w-auto shadow-md rounded-md border border-gray-200"
                  />
                </div>
              ) : (
                <p className="text-center text-gray-600"><strong>Logo:</strong> No disponible</p>
              )}

              {/* Empresa */}
              <p className="text-xl font-semibold text-gray-800"><strong>Empresa:</strong> {jobDetail.company || 'No disponible'}</p>

              {/* Nivel */}
              {jobDetail.level ? (
                <p className="text-xl font-semibold text-gray-800"><strong>Nivel:</strong> {jobDetail.level}</p>
              ) : (
                <p className="text-center text-gray-600"><strong>Nivel:</strong> No disponible</p>
              )}

              {/* Ubicación */}
              <p className="text-xl font-semibold text-gray-800"><strong>Ubicación:</strong> {jobDetail.location || 'No disponible'}</p>

              {/* Descripción */}
              <div>
                <p className="font-semibold text-gray-700 text-lg"><strong>Descripción:</strong></p>
                {jobDetail.summaryHtml ? (
                  <div className="mt-2 text-gray-600" dangerouslySetInnerHTML={{ __html: jobDetail.summaryHtml }} />
                ) : (
                  <p className="text-center text-gray-600">No disponible</p>
                )}
              </div>
            </div>

            {/* Columna derecha: Requisitos */}
            <div className="space-y-6">
              <p className="font-semibold text-gray-800 text-xl"><strong>Requisitos:</strong></p>
              {jobDetail.requirements && jobDetail.requirements.length > 0 ? (
                <div className="space-y-3">
                  {jobDetail.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-blue-600">•</span>
                      <p className="text-gray-700">{req}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No hay requisitos disponibles</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">No se pudieron cargar los detalles del trabajo.</p>
        )}

        {/* Link a la oferta */}
        {selectedJob?.link && (
          <div className="mt-6 text-center">
            <a
              href={selectedJob.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-lg font-medium"
            >
              Ver oferta completa
            </a>
          </div>
        )}
      </Modal>


    </div>
  );
};

export default JobList;
