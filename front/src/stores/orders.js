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
    adminList: [],
  });

  const showProduct = reactive({
    list: {},
  });

  const orderPaid = computed(() => order.paid);
  const orderBuy = computed(() => order.buyList);
  const orderSell = computed(() => order.sellList);
  const orderAdmin = computed(() => order.adminList);

  const { cart } = storeToRefs(useCartStore());
  const { swalSuccess, swalError } = useSwalStore();

  const checkouOrdertHandler = async (form) => {
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

  const changeBuyAndSellList = (data) => {
    if (order.buyList.length) {
      const index = order.buyList.findIndex(
        (item) => item._id === data.result._id
      );
      order.buyList[index] = data.result;
      if (!!showProduct.list) {
        showProduct.list = data.result;
      }
    }

    if (order.sellList.length) {
      const index = order.sellList.findIndex(
        (item) => item._id === data.result._id
      );
      order.sellList[index] = data.result;
      if (!!showProduct.list) {
        showProduct.list = data.result;
      }
    }
    if (order.adminList.length) {
      const index = order.adminList.findIndex(
        (item) => item._id === data.result._id
      );
      order.adminList[index] = data.result;
      if (!!showProduct.list) {
        showProduct.list = data.result;
      }
    }
  };

  const paidOrderHandler = async ({ orderId, productId }) => {
    try {
      const { data } = await apiAuth.patch(`/orders/${orderId}`, {
        productId,
        type: 'paid',
      });
      if (productId !== '' && order.paid.list.length > 0) {
        const index = order.paid.list.findIndex(
          (item) => item.productId._id === productId
        );
        order.paid.list[index].productId.paid = true;

        const isAllPaid = order.paid.list.every((item) => item.productId.paid);
        if (isAllPaid) router.push('/member/orderlist');
      }
      if (productId === '') {
        router.push('/member/orderlist');
      }

      if (productId !== '') {
        changeBuyAndSellList(data);
      }

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

  const getAdminOrder = async () => {
    try {
      const { data } = await apiAuth.get('/orders/all');
      order.adminList = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  const shipOrderHandler = async ({ orderId, productId }) => {
    try {
      const { data } = await apiAuth.patch(`/orders/${orderId}`, {
        productId,
        type: 'ship',
      });

      changeBuyAndSellList(data);

      swalSuccess('出貨成功');
    } catch (error) {
      swalError(error);
    }
  };

  const cancelOrderHandler = async ({ orderId, productId }) => {
    const { data } = await apiAuth.patch(`/orders/${orderId}`, {
      productId,
      type: 'cancel',
    });

    changeBuyAndSellList(data);

    try {
    } catch (error) {
      swalError(error);
    }
  };

  const changeStatusOrderHandler = async (form) => {
    try {
      const { data } = await apiAuth.patch(`/orders/${form.id}`, form);

      if (order.buyList.length && form.member === 'buy') {
        const index = order.buyList.findIndex(
          (item) => item._id === data.result._id
        );
        order.buyList[index] = data.result;
        if (!!showProduct.list) {
          showProduct.list = data.result;
        }
      }

      if (order.sellList.length && form.member === 'sell') {
        const index = order.sellList.findIndex(
          (item) => item._id === data.result._id
        );
        order.sellList[index] = data.result;
        if (!!showProduct.list) {
          showProduct.list = data.result;
        }
      }

      if (form.status === 0) {
        swalSuccess('取消封存成功');
      } else if (form.status === 1) {
        swalSuccess('封存成功');
      }
    } catch (error) {
      swalError(error);
    }
  };

  return {
    orderPaid,
    orderBuy,
    orderSell,
    orderAdmin,
    showProduct,
    checkouOrdertHandler,
    paidOrderHandler,
    shipOrderHandler,
    getMemberBuyOrderHandler,
    getMemberSellOrderHandler,
    getAdminOrder,
    changeStatusOrderHandler,
    cancelOrderHandler,
  };
});
