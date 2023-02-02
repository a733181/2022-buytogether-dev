import { defineStore, storeToRefs } from 'pinia';
import { reactive, computed } from 'vue';

import { apiAuth } from '@/axios/index';
import router from '@/router/index';

import { useSwalStore } from '@/stores/swal';
import { useCartStore } from '@/stores/carts';

export const useOrderStore = defineStore('orders', () => {
  const order = reactive({
    sellList: [],
    buyList: [],
    paid: {
      list: [],
      addressId: '',
      bankId: '',
      _id: '',
    },
  });

  const showProduct = reactive({
    list: {},
  });

  const orderPaid = computed(() => order.paid);
  const orderBuy = computed(() => order.buyList);
  const orderSell = computed(() => order.sellList);

  const { cart } = storeToRefs(useCartStore());
  const { swalSuccess, swalError } = useSwalStore();

  const checkoutHandler = async (form) => {
    try {
      const { data } = await apiAuth.post('/orders', form);
      cart.value.length = 0;
      order.paid.list = cart.value.list;
      order.paid.addressId = form.addressId;
      order.paid.bankId = form.bankId;
      order.paid._id = data.result._id;
      swalSuccess('下單成功');
      router.push('/paid');
    } catch (error) {
      swalError(error);
    }
  };

  const paidHandler = async ({ orderId, productId }) => {
    try {
      const { data } = await apiAuth.post(`/orders/paid/${orderId}`, {
        productId,
      });

      if (productId !== '' && order.paid.list.length > 0) {
        const index = order.paid.list.findIndex(
          (item) => item.productId._id === productId
        );
        order.paid.list[index].productId.paid = true;

        const isAllPaid = order.paid.list.every((item) => item.productId.paid);
        if (isAllPaid) router.push('/member/order');
      }
      if (productId === '') {
        router.push('/member/order');
      }

      if (order.buyList.length) {
        const index = order.buyList.findIndex(
          (item) => item._id === data.result._id
        );
        order.buyList[index] = data.result;
        if (!!showProduct.list) {
          showProduct.list = data.result;
        }
      }

      await getMemberSellOrderHandler();
      swalSuccess('付款成功');
    } catch (error) {
      swalError(error);
    }
  };

  const getMemberBuyOrderHandler = async () => {
    try {
      const { data } = await apiAuth.get('/orders/buy');
      order.buyList = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  const getMemberSellOrderHandler = async () => {
    try {
      const { data } = await apiAuth.get('/orders/sell');
      order.sellList = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  return {
    orderPaid,
    orderBuy,
    orderSell,
    showProduct,
    checkoutHandler,
    paidHandler,
    getMemberBuyOrderHandler,
    getMemberSellOrderHandler,
  };
});
