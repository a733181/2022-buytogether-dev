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
    } catch (error) {
      swalError(error);
    }
  };

  const getAdminContactHandler = async () => {
    try {
      const { data } = await apiAuth.get('/contact/admin');
      contact.list = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  const replayContactHandler = async (from) => {
    try {
      await apiAuth.patch('/contact', from);
      const index = contact.list.findIndex((item) => item._id === from.id);

      contact.list[index].reply = from.reply;
      swalSuccess('回覆成功');
    } catch (error) {
      swalError(error);
    }
  };

  return {
    contact,
    sumbitContactHandler,
    getMemberContactHandler,
    getAdminContactHandler,
    replayContactHandler,
  };
});
