import { defineStore, storeToRefs } from 'pinia';
import { ref, computed, reactive } from 'vue';

import { api, apiAuth } from '@/axios/index';
import router from '@/router/index';

import { useBankStore } from '@/stores/bank';
import { useAddressStore } from '@/stores/address';
import { useCartStore } from '@/stores/carts';
import { useSwalStore } from '@/stores/swal';
import { useProductsStore } from '@/stores/products';
import { useMessageStore } from '@/stores/messages';

export const useUserStore = defineStore(
  'user',
  () => {
    const { swalSuccess, swalError } = useSwalStore();

    const bank = useBankStore();
    const address = useAddressStore();
    const { cart } = storeToRefs(useCartStore());
    const products = useProductsStore();
    const { getAllMemberProductMessageHanlder } = useMessageStore();

    const isLogin = ref(true);

    const users = reactive({
      _id: '',
      phone: '',
      role: 0,
      name: '',
      email: '',
      image: '',
      bank: '',
      address: '',
      favorites: [],
      track: [],
      black: [],
      trackList: [],
      blackList: [],
    });
    const token = ref('');

    const userAdmin = reactive({
      list: [],
      edit: {},
    });

    const isMember = computed(() => token.value.length > 0);

    const isAdmin = computed(() => users.role === 1);

    const favorites = computed(() => users.favorites);

    const trackList = computed(() => users.trackList);

    const blackList = computed(() => users.blackList);

    const isLoginHandler = () => {
      if (!isMember.value) {
        swalError('請先登入');
        router.push('/member/ship');
        return false;
      }
      return true;
    };

    const changeUserDataHandler = (
      data = {
        _id: '',
        phone: '',
        role: 0,
        name: '',
        email: '',
        image: '',
        bank: '',
        address: '',
        favorites: [],
        track: [],
        black: [],
      }
    ) => {
      users._id = data._id;
      users.phone = data.phone;
      users.role = data.role;
      users.name = data.name;
      users.email = data.email;
      users.image =
        data.image ||
        `https://source.boringavatars.com/beam/256/${users.name}?colors=ffabab,ffdaab,ddffab,abe4ff,d9abff`;
      users.bank = data.bank;
      users.address = data.address;
      users.favorites = data.favorites;
      users.track = data.track;
      users.black = data.black;
    };

    const registerHandler = async (form) => {
      try {
        await api.post('/users', form);
        swalSuccess('註冊成功');
        isLogin.value = true;
        if (userAdmin.list.length) {
          await getAdminAllUserHanlder();
          router.push('/member/shipadmin');
        }
      } catch (error) {
        swalError(error);
        isLogin.value = false;
      }
    };

    const loginHandler = async (form) => {
      try {
        const { data } = await api.post('/users/login', form);
        changeUserDataHandler(data.result);
        token.value = data.result.token;
        cart.value.length = data.result.cart;
        bank.banks.list = data.result.banks;
        address.address.list = data.result.address;
        await getAllMemberProductMessageHanlder();

        swalSuccess('登入成功');
        if (isAdmin.value) {
          router.push('/member/orderalllist');
        } else {
          router.push('/member/orderlist');
        }
      } catch (error) {
        swalError(error);
      }
    };

    const logoutHandler = async () => {
      try {
        await apiAuth.delete('/users/logout');
        changeUserDataHandler();
        token.value = '';
        cart.value.length = '';
        router.push('/');
        swalSuccess('登出成功');
      } catch (error) {
        swalError(error);
      }
    };

    const getUserHandler = async () => {
      if (token.value.length === 0) return;

      try {
        const { data } = await apiAuth.get('/users/me');
        changeUserDataHandler(data.result);

        cart.value.length = data.result.cart;
        bank.banks.list = data.result.banks;
        address.address.list = data.result.address;
        await getAllMemberProductMessageHanlder();

        if (isAdmin.value) {
          await getAdminAllUserHanlder();
        }
      } catch (error) {
        logoutHandler();
      }
    };

    const editUserHander = async (form) => {
      try {
        const { data } = await apiAuth.patch('/users/edit', form);
        if (form.get('name')) {
          if (data.result?.image) {
            users.name = data.result.name;
            users.image = data.result.image;
          } else {
            users.name = form.get('name');
          }
        } else if (form.get('email')) {
          users.email = form.get('email');
        }

        swalSuccess('修改成功');
        router.push('/member/ship');
      } catch (error) {
        swalError(error);
      }
    };

    const editAdminUserHander = async (form) => {
      try {
        const { data } = await apiAuth.patch('/users/member', form);
        const index = userAdmin.list.findIndex(
          (item) => item._id === form.get('id')
        );
        userAdmin.list[index] = data.result;
        swalSuccess('修改成功');
        router.push('/member/shipadmin');
      } catch (error) {
        swalError(error);
      }
    };

    const changeListHalder = (index, data, id) => {
      if (index === -1) {
        data.push(id);
      } else {
        data.splice(index, 1);
      }
    };

    const clickFavoriteHandler = async (productId) => {
      if (!isLoginHandler()) return;
      try {
        const index = users.favorites.findIndex((item) => item === productId);
        await apiAuth.patch('/users/favorite', { productId });
        changeListHalder(index, users.favorites, productId);

        if (products.sellFatorite.length > 0) {
          products.getFatoriteHandler();
        }
      } catch (error) {
        swalError(error);
      }
    };

    const clickListHandler = async ({ id, type = 'track' }) => {
      if (!isLoginHandler()) return;
      try {
        const indexTrack = users.track.findIndex((item) => item === id);
        const indexBlack = users.black.findIndex((item) => item === id);

        await apiAuth.patch('/users/list', { id, type });
        if (type === 'track') {
          changeListHalder(indexTrack, users.track, id);
        } else {
          changeListHalder(indexBlack, users.black, id);
        }
      } catch (error) {
        swalError(error);
      }
    };

    const getTrackListHandler = async () => {
      try {
        const { data } = await apiAuth.get('/users/track');
        users.trackList = data.result;
        users.trackList.forEach((item) => {
          item.image =
            item.image ||
            `https://source.boringavatars.com/beam/256/${item.name}?colors=ffabab,ffdaab,ddffab,abe4ff,d9abff`;
        });
      } catch (error) {
        swalError(error);
      }
    };

    const getBlackListHanlder = async () => {
      try {
        const { data } = await apiAuth.get('/users/black');
        users.blackList = data.result;
        users.blackList.forEach((item) => {
          item.image =
            item.image ||
            `https://source.boringavatars.com/beam/256/${item.name}?colors=ffabab,ffdaab,ddffab,abe4ff,d9abff`;
        });
      } catch (error) {
        swalError(error);
      }
    };

    const getAdminAllUserHanlder = async () => {
      try {
        const { data } = await apiAuth.get('/users/all');
        userAdmin.list = data.result.users;
        bank.banksAdmin.list = data.result.banks;
        address.addressAdmin.list = data.result.address;
        userAdmin.list.forEach((user) => {
          user.image =
            user?.image ||
            `https://source.boringavatars.com/beam/256/${users.name}?colors=ffabab,ffdaab,ddffab,abe4ff,d9abff`;
        });
      } catch (error) {
        swalError(error);
      }
    };

    return {
      isLogin,
      token,
      isMember,
      isAdmin,
      users,
      favorites,
      trackList,
      blackList,
      userAdmin,
      registerHandler,
      loginHandler,
      logoutHandler,
      getUserHandler,
      editUserHander,
      editAdminUserHander,
      clickFavoriteHandler,
      clickListHandler,
      isLoginHandler,
      getTrackListHandler,
      getBlackListHanlder,
      getAdminAllUserHanlder,
    };
  },
  {
    persist: {
      key: 'key',
      paths: ['token'],
    },
  }
);
