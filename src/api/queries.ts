// src/queries.ts
import axios from 'axios';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  // Agrega otros campos según la respuesta de tu API
}

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export const queries = {
  jobs: {
    list: (filters?: any) => ({
      queryKey: ['jobs', filters],
      queryFn: async (): Promise<Job[]> => {  // Aquí indicamos que la respuesta es un arreglo de trabajos
        const { data } = await api.get('/jobs', { params: filters });
        return data;
      },
    }),
  },
  applications: {
    list: () => ({
      queryKey: ['applications'],
      queryFn: async () => {
        const { data } = await api.get('/applications');
        return data;
      },
    }),
  },
};
