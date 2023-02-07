import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

import { api, apiAuth } from '@/axios/index';

import { useSwalStore } from '@/stores/swal';
import { useUserStore } from '@/stores/users';

export const useContactStore = defineStore('contacts', () => {
  const { swalSuccess, swalError } = useSwalStore();

  const contact = reactive({
    list: [],
  });

  const sumbitContactHandler = async (form) => {
    try {
      await apiAuth.post('/contact', form);
      swalSuccess('訊息傳送成功');
    } catch (error) {
      swalError(error);
    }
  };

  const getMemberContactHandler = async () => {
    try {
      const { data } = await apiAuth.get('/contact');
      contact.list = data.result;
      console.log(contact.list);
    } catch (error) {
      swalError(error);
    }
  };

  return { sumbitContactHandler, getMemberContactHandler };
});
