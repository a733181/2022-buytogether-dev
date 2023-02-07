import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';

import { apiAuth } from '@/axios/index';
import router from '@/router/index';

import { useSwalStore } from '@/stores/swal';

export const useAddressStore = defineStore('address', () => {
  const { swalSuccess, swalError } = useSwalStore();

  const address = reactive({
    list: [],
    edit: {
      userId: null,
      _id: '',
      code: 0,
      city: '',
      districts: '',
      street: '',
      name: '',
      phone: '',
      preset: false,
      type: 'user',
    },
  });

  const addressAdmin = reactive({
    list: [],
    user: {
      userId: '',
      list: [],
    },
  });

  const listAddress = computed(() => {
    return address.list;
  });

  const editAddress = computed(() => {
    return address.edit;
  });

  const changeEditAddressHandler = (
    data = {
      _id: '',
      code: 0,
      city: '',
      districts: '',
      street: '',
      name: '',
      phone: '',
      preset: false,
      type: 'user',
    }
  ) => {
    address.edit._id = data._id;
    address.edit.code = data.code;
    address.edit.city = data.city;
    address.edit.districts = data.districts;
    address.edit.street = data.street;
    address.edit.name = data.name;
    address.edit.phone = data.phone;
    address.edit.preset = data.preset;
    address.edit.type = data.type;
  };

  const addAddressHandler = () => {
    changeEditAddressHandler();
    router.push('/member/addressinfo');

    if (addressAdmin.list.length) {
      address.edit.userId = addressAdmin.user.userId;
      address.edit.type = 'admin';
    }
  };

  const sumbitAddressHandler = async (form) => {
    try {
      if (form._id === '') {
        if (addressAdmin.list.length) {
          if (form.preset) {
            const addressPreset = addressAdmin.user.list.filter(
              (item) => item.preset
            );

            if (addressPreset[0]) {
              const index = addressAdmin.list.findIndex(
                (item) => item._id === addressPreset[0]._id
              );
              addressAdmin.list[index].preset = false;
            }
          }
        } else {
          if (form.preset && address.list.length > 0) {
            const index = address.list.findIndex((item) => item.preset);
            if (index !== -1) {
              address.list[index].preset = false;
            }
          }
        }

        const { data } = await apiAuth.post('/users/address', form);

        if (addressAdmin.list.length) {
          addressAdmin.list.push(data.result);
          addressAdmin.user.list = addressAdmin.list.filter(
            (item) => item.userId === addressAdmin.user.userId
          );
        } else {
          address.list.push(data.result);
        }
      } else {
        if (addressAdmin.list.length) {
          if (form.preset) {
            const addressPreset = addressAdmin.user.list.filter(
              (item) => item.preset
            );
            if (addressPreset[0]) {
              const index = addressAdmin.list.findIndex(
                (item) => item._id === addressPreset[0]._id
              );
              addressAdmin.list[index].preset = false;
            }
          }
        } else {
          if (form.preset) {
            const index = address.list.findIndex((item) => item.preset);
            if (index !== -1) {
              address.list[index].preset = false;
            }
          }
        }

        const { data } = await apiAuth.patch(
          `/users/address/${form._id}`,
          form
        );

        if (addressAdmin.list.length) {
          const index = addressAdmin.list.findIndex(
            (item) => item._id === data.result._id
          );
          addressAdmin.list[index] = data.result;
          addressAdmin.user.list = addressAdmin.list.filter(
            (item) => item.userId === addressAdmin.user.userId
          );
        } else {
          const index = address.list.findIndex(
            (item) => item._id === data.result._id
          );
          address.list[index] = data.result;
        }
      }

      swalSuccess(address.edit._id === '' ? '新增成功' : '修改成功');
      changeEditAddressHandler();
      router.go(-1);
    } catch (error) {
      console.log(error);
      swalError(error);
    }
  };

  const cancelAddressHandler = () => {
    changeEditAddressHandler();
    router.go(-1);
  };

  const editAddressHandler = (id) => {
    if (addressAdmin.list.length) {
      const index = addressAdmin.user.list.findIndex((item) => item._id === id);
      changeEditAddressHandler({
        ...addressAdmin.user.list[index],
        type: 'admin',
      });
    } else {
      const index = address.list.findIndex((item) => item._id === id);
      changeEditAddressHandler(address.list[index]);
    }
    router.push('/member/addressinfo');
  };

  const deleteAddressHandler = async (id) => {
    try {
      await apiAuth.delete(`/users/address/${id}`);

      if (addressAdmin.list.length) {
        const index = addressAdmin.list.findIndex((item) => item._id === id);
        addressAdmin.list.splice(index, 1);
        addressAdmin.user.list = addressAdmin.list.filter(
          (item) => item.userId === addressAdmin.user.userId
        );
      } else {
        const index = address.list.findIndex((item) => item.id === id);
        address.list.splice(index, 1);
      }

      swalSuccess('成功刪除');
    } catch (error) {
      swalError(error);
    }
  };

  const adminViewUserAddressListHanlder = (userId) => {
    addressAdmin.user.userId = userId;

    addressAdmin.user.list = addressAdmin.list.filter(
      (item) => item.userId === userId
    );
    router.push('/member/memberadminaddress');
  };

  return {
    address,
    addressAdmin,
    listAddress,
    editAddress,
    addAddressHandler,
    cancelAddressHandler,
    sumbitAddressHandler,
    editAddressHandler,
    deleteAddressHandler,
    adminViewUserAddressListHanlder,
  };
});
