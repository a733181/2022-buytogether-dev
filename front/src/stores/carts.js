import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

import { apiAuth } from '@/axios/index';
import router from '@/router/index';

import { useSwalStore } from '@/stores/swal';
import { useUserStore } from '@/stores/users';

export const useCartStore = defineStore('carts', () => {
  const user = useUserStore();
  const { isLoginHandler } = user;

  const { swalSuccess, swalError } = useSwalStore();

  const cart = reactive({
    list: [],
    length: null,
  });

  const clickAddCartHandler = async ({ id, quantity = 1 }) => {
    if (!user.isLoginHandler()) return;
    try {
      const { data } = await apiAuth.post('/users/cart', { id, quantity });
      cart.length = data.result;

      if (router.currentRoute.value.path === '/cart') {
        await getCartList();
      }
    } catch (error) {
      swalError(error);
    }
  };

  const getCartList = async () => {
    try {
      const { data } = await apiAuth.get('/users/cart');
      cart.list = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  const deleteCartHandler = async ({ id }) => {
    try {
      const { data } = await apiAuth.delete(`/users/cart/${id}`);
      cart.length = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  return {
    cart,
    clickAddCartHandler,
    getCartList,
    deleteCartHandler,
  };
});
