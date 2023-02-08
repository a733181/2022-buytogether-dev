import { defineStore } from 'pinia';
import { useSwalStore } from '@/stores/swal';

export const useReportsStore = defineStore('reports', () => {
  const { swalSuccess, swalError } = useSwalStore();
  const createReporteHandler = (from) => {
    try {
    } catch (error) {
      swalError(error);
    }
  };

  return {
    createReporteHandler,
  };
});
