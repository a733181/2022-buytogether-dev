import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSwalStore } from '@/stores/swal';
import { apiAuth } from '@/axios/index';

export const useReportsStore = defineStore('reports', () => {
  const { swalSuccess, swalError } = useSwalStore();
  const reports = ref([]);

  const createReporteHandler = async (form) => {
    try {
      await apiAuth.post('/reports', form);
      swalSuccess('檢舉成功');
    } catch (error) {
      swalError(error);
    }
  };

  return {
    reports,
    createReporteHandler,
  };
});
