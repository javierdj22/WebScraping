import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export const mutations = {
  postulateJob: (jobId: string) => ({
    mutationKey: ['postulateJob', jobId],
    mutationFn: async (): Promise<any> => {
      const response = await api.post('/jobs/postulate', { job_id: jobId });
      return response.data;
    },
  }),

  scrapeJobs: (searchTerm: string) => ({
    mutationKey: ['scrapeJobs', searchTerm],
    mutationFn: async (): Promise<any> => {
      const response = await api.post('/jobs/scrape', { searchTerm });
      return response.data;
    },
  }),
  
  getJobDetail: (link: string) => ({
    mutationKey: ['getJobDetail', link],
    mutationFn: async (): Promise<any> => {
      const response = await api.post('/jobs/scrape/detail', { link });
      return response.data;
    },
  }),
};