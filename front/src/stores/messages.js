import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

import { api, apiAuth } from '@/axios/index';

import { useSwalStore } from '@/stores/swal';
import { useUserStore } from '@/stores/users';

export const useMessageStore = defineStore('messages', () => {
  const { swalSuccess, swalError } = useSwalStore();
  const user = useUserStore();

  const message = reactive({
    product: [],
    allProduct: [],
  });

  const messagePage = reactive({
    total: 1,
    current: 1,
  });

  const messageProduct = computed(() => message.product);
  const messageAllProduct = computed(() => message.allProduct);

  const sumbitMessageHandler = async (form) => {
    await apiAuth.post('/messages', form);
    message.product.push({
      message: form.message,
    });
    if (user.isMember) {
      await getAllMemberProductMessageHanlder();
    }
    try {
    } catch (error) {
      swalError(error);
    }
  };

  const getProductMessageHandler = async (productId) => {
    try {
      if (user.isMember) {
        const { data } = await apiAuth.get(
          `/messages/member/${productId}?page=${messagePage.current}`
        );
        message.product = data.result.data;
        messagePage.total = data.result.totalPages;
        return;
      }

      const { data } = await api.get(
        `/messages/${productId}?page=${messagePage.current}`
      );
      message.product = data.result.data;
      messagePage.total = data.result.totalPages;
    } catch (error) {
      swalError(error);
    }
  };

  const getAllMemberProductMessageHanlder = async () => {
    try {
      const { data } = await apiAuth.get('/messages');
      message.allProduct = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  const replayMessageHandler = async (form) => {
    try {
      await apiAuth.patch(`/messages/${form.id}`, {
        reply: form.reply,
      });
      const index = message.allProduct.findIndex(
        (item) => item._id === form.id
      );

      message.allProduct.splice(index, 1);
      swalSuccess('成功回覆');
    } catch (error) {
      swalError(error);
    }
  };

  return {
    messageProduct,
    messageAllProduct,
    messagePage,
    sumbitMessageHandler,
    getProductMessageHandler,
    getAllMemberProductMessageHanlder,
    replayMessageHandler,
  };
});
