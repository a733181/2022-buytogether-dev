import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';

import { api, apiAuth } from '@/axios/index';
import router from '@/router/index';

import { useSwalStore } from '@/stores/swal';
import { useUserStore } from '@/stores/users';

export const useProductsStore = defineStore('products', () => {
  const user = useUserStore();
  const { swalSuccess, swalError } = useSwalStore();

  const product = reactive({
    list: [],
    edit: {
      _id: '',
      userId: '',
      name: '',
      price: '',
      maxNumber: '',
      description: '',
      image: '',
      images: [],
      isSell: false,
      category: '',
      youtubeId: '',
      bankId: '',
    },
    allSell: [],
    item: {},
    member: {
      data: [],
      member: {},
    },
    sellFatorite: [],
  });

  const editProduct = computed(() => product.edit);

  const listProduct = computed(() => product.list);

  const allSellProduct = computed(() => product.allSell);

  const sellProdcut = computed(() => product.item);

  const memberHomeProduct = computed(() => product.member);

  const sellFatorite = computed(() => product.sellFatorite);

  const changeEditProductHander = (
    data = {
      _id: '',
      userId: '',
      name: '',
      price: '',
      maxNumber: '',
      description: '',
      image: '',
      images: [],
      isSell: false,
      category: '',
      youtubeId: '',
      bankId: '',
    }
  ) => {
    product.edit._id = data._id;
    product.edit.userId = data.userId;
    product.edit.name = data.name;
    product.edit.price = data.price;
    product.edit.maxNumber = data.maxNumber;
    product.edit.description = data.description;
    product.edit.image = data.image;
    product.edit.images = data.images;
    product.edit.isSell = data.isSell;
    product.edit.category = data.category;
    product.edit.youtubeId = data.youtubeId;
    product.edit.bankId = data.bankId;
  };

  const addProductHandler = () => {
    changeEditProductHander();
    router.push('/member/product');
  };

  const sumbitProductHandler = async (form) => {
    try {
      if (product.edit._id === '') {
        const { data } = await apiAuth.post('/products', form);
        product.list.push(data.result);
      } else {
        const { data } = await apiAuth.patch(
          `/products/${form.get('_id')}`,
          form
        );
        const index = product.list.findIndex(
          (item) => item._id === data.result._id
        );
        product.list[index] = data.result;
      }

      swalSuccess(product.edit._id === '' ? '新增成功' : '修改成功');
      changeEditProductHander();
      router.push('/member/productlist');
    } catch (error) {
      swalError(error);
    }
  };

  const getAllProductHandler = async () => {
    try {
      const { data } = await apiAuth.get('/products/member');
      product.list = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  const cancelProductHandler = () => {
    changeEditProductHander();
    router.push('/member/productlist');
  };

  const editProductHandler = (id) => {
    const index = product.list.findIndex((item) => item._id === id);
    changeEditProductHander(product.list[index]);
    router.push('/member/product');
  };

  const deleteProductHandler = async (id) => {
    try {
      await apiAuth.delete(`/products/${id}`);
      const index = product.list.findIndex((item) => item._id === id);
      product.list.splice(index, 1);
      swalSuccess('成功刪除');
    } catch (error) {
      swalError(error);
    }
  };

  const getAllSellProdcutHandler = async () => {
    try {
      const { data } = await api.get('/products');
      product.allSell = data.result;
      if (user.isMember) {
        product.allSell = product.allSell.filter(
          (item) => !item.userId.black.some((item) => item === user.users._id)
        );
      }
    } catch (error) {
      swalError(error);
    }
  };

  const getSellProdctHander = async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      product.item = data.result;
      if (user.isMember) {
        const isBlack = product.item.userId.black.some(
          (item) => item === user.users._id
        );
        if (isBlack) {
          swalError('已被加入黑名單');
          router.push('/products');
        }
      }
    } catch (error) {
      swalError(error);
    }
  };

  const getMemberSellProductHandler = async (userId) => {
    try {
      const { data } = await api.get(`/products/memberhome/${userId}`);
      product.member = data.result;
      if (!product.member?.image) {
        product.member.member.image = `https://source.boringavatars.com/beam/256/${product.member.member.name}?colors=ffabab,ffdaab,ddffab,abe4ff,d9abff`;
      }

      if (user.isMember) {
        const isBlack = product.member.member.black.some(
          (item) => item === user.users._id
        );
        if (isBlack) {
          swalError('已被加入黑名單');
          router.push('/products');
        }
      }
    } catch (error) {
      swalError(error);
    }
  };

  const changeLikesHandler = (index, data) => {
    const indexLike = data[index].likes.findIndex(
      (item) => item === user.users._id
    );

    if (indexLike !== -1) {
      data[index].likes.splice(indexLike, 1);
    } else {
      data[index].likes.push(user.users._id);
    }
  };

  const clickLikesHandler = async (productId) => {
    if (!user.isLoginHandler()) return;

    try {
      await apiAuth.post('/products/likes', { productId });
      const indexSellProduct = product.allSell.findIndex(
        (item) => item._id === productId
      );
      const indexMemberProduct = product.member.data.findIndex(
        (item) => item._id === productId
      );

      if (indexSellProduct !== -1) {
        changeLikesHandler(indexSellProduct, product.allSell);
      } else if (indexMemberProduct !== -1) {
        changeLikesHandler(indexMemberProduct, product.member.data);
      }
    } catch (error) {
      swalError(error);
    }
  };

  const getFatoriteHandler = async () => {
    try {
      const { data } = await apiAuth.get('/products/favorite');
      product.sellFatorite = data.result;
    } catch (error) {
      swalError(error);
    }
  };

  return {
    allSellProduct,
    listProduct,
    editProduct,
    sellProdcut,
    memberHomeProduct,
    sellFatorite,
    addProductHandler,
    sumbitProductHandler,
    getAllProductHandler,
    cancelProductHandler,
    editProductHandler,
    deleteProductHandler,
    getAllSellProdcutHandler,
    getSellProdctHander,
    clickLikesHandler,
    getMemberSellProductHandler,
    getFatoriteHandler,
  };
});
