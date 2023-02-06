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
      _id: '',
      code: 0,
      city: '',
      districts: '',
      street: '',
      name: '',
      phone: '',
      preset: false,
    },
  });

  const addressAdmin = reactive({
    list: [],
    edit: {},
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
  };

  const addAddressHandler = () => {
    changeEditAddressHandler();
    router.push('/member/addressinfo');
  };

  const sumbitAddressHandler = async (form) => {
    try {
      if (address.edit._id === '') {
        if (form.preset && address.list.length > 0) {
          const index = address.list.findIndex((item) => item.preset);
          if (index !== -1) {
            address.list[index].preset = false;
          }
        }

        const { data } = await apiAuth.post('/users/address', form);
        address.list.push(data.result);
      } else {
        if (form.preset) {
          const index = address.list.findIndex((item) => item.preset);
          if (index !== -1) {
            address.list[index].preset = false;
          }
        }

        const { data } = await apiAuth.patch(
          `/users/address/${form._id}`,
          form
        );
        const index = address.list.findIndex(
          (item) => item._id === data.result._id
        );
        address.list[index] = data.result;
      }

      swalSuccess(address.edit._id === '' ? '新增成功' : '修改成功');
      changeEditAddressHandler();
      router.go(-1);
    } catch (error) {
      swalError(error);
    }
  };

  const cancelAddressHandler = () => {
    changeEditAddressHandler();
    router.go(-1);
  };

  const editAddressHandler = (id) => {
    const index = address.list.findIndex((item) => item._id === id);
    changeEditAddressHandler(address.list[index]);
    router.push('/member/addressinfo');
  };

  const deleteAddressHandler = async (id) => {
    try {
      await apiAuth.delete(`/users/address/${id}`);
      const index = address.list.findIndex((item) => item.id === id);
      address.list.splice(index, 1);

      swalSuccess('成功刪除');
    } catch (error) {
      swalError(error);
    }
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
  };
});
