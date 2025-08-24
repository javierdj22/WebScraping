import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [status, setStatus] = useState<{[id: string]: string}>({});

  const handleSearch = async () => {
    // Fetch jobs from backend
    const res = await fetch(`/api/jobs/search?keywords=${keywords}&location=${location}`);
    const data = await res.json();
    setJobs(data);
  };

  // const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) setCv(e.target.files[0]);
  // };

  const handleApply = async (job: any) => {
    if (!cv) return alert('Sube tu CV primero');
    const formData = new FormData();
    formData.append('jobId', job.id);
    formData.append('cv', cv);
    // ...add other fields as needed
    const res = await fetch('/api/jobs/apply', { method: 'POST', body: formData });
    const result = await res.json();
    setStatus(s => ({ ...s, [job.id]: result.status }));
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/applications">Ver mis postulaciones</Link>
      </div>
      <h2>Configuración de búsqueda</h2>
      <input placeholder="Palabras clave" value={keywords} onChange={e => setKeywords(e.target.value)} />
      <input placeholder="Ubicación" value={location} onChange={e => setLocation(e.target.value)} />
      {/* <input type="file" accept="application/pdf" onChange={handleCvUpload} /> */}
      <button onClick={handleSearch}>Buscar</button>
      <h2>Resultados</h2>
      <table>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Puesto</th>
            <th>Link</th>
            <th>Acción</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.company}</td>
              <td>{job.position}</td>
              <td><a href={job.link} target="_blank" rel="noopener noreferrer">Ver oferta</a></td>
              <td><button onClick={() => handleApply(job)}>Enviar CV</button></td>
              <td>{status[job.id]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
