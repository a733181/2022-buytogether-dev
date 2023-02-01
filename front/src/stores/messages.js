import { defineStore, storeToRefs } from 'pinia';

import { apiAuth } from '@/axios/index';

import { useSwalStore } from '@/stores/swal';

export const useMessageStore = defineStore('messages', () => {
  const { swalSuccess, swalError } = useSwalStore();

  const sumbitMessageHandler = async (form) => {
    await apiAuth.post('/messages', form);
    try {
    } catch (error) {
      swalError(error);
    }
  };

  return { sumbitMessageHandler };
});
