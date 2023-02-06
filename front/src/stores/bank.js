import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

import { apiAuth } from '@/axios/index';
import router from '@/router/index';

import { useSwalStore } from '@/stores/swal';

export const useBankStore = defineStore('bank', () => {
  const { swalSuccess, swalError } = useSwalStore();

  const banks = reactive({
    list: [],
    edit: {
      _id: '',
      bankName: '',
      bankNumber: '',
      preset: false,
      type: 'user',
    },
  });

  const banksAdmin = reactive({
    list: [],
    user: [],
  });

  const listBank = computed(() => {
    return banks.list;
  });

  const editBank = computed(() => {
    return banks.edit;
  });

  const changeEditBankHandler = (
    data = {
      _id: '',
      bankName: '',
      bankNumber: '',
      preset: false,
      type: 'user',
    }
  ) => {
    banks.edit._id = data._id;
    banks.edit.bankName = data.bankName;
    banks.edit.bankNumber = data.bankNumber;
    banks.edit.preset = data.preset;
    banks.edit.type = data.type;
  };

  const addBankHandler = () => {
    changeEditBankHandler();
    router.push('/member/bankinfo');
  };

  const sumbitBankHandler = async (form) => {
    try {
      if (banks.edit._id === '') {
        if (form.preset && banks.list.length > 0) {
          const index = banks.list.findIndex((item) => item.preset);
          if (index !== -1) {
            banks.list[index].preset = false;
          }
        }

        const { data } = await apiAuth.post('/users/bank', form);
        banks.list.push(data.result);
      } else {
        if (form.preset) {
          const index = banks.list.findIndex((item) => item.preset);
          if (index !== -1) {
            banks.list[index].preset = false;
          }
        }

        const { data } = await apiAuth.patch(`/users/bank/${form._id}`, form);

        const index = banks.list.findIndex(
          (item) => item._id === data.result._id
        );
        banks.list[index] = data.result;
      }

      swalSuccess(banks.edit._id === '' ? '新增成功' : '修改成功');
      changeEditBankHandler();
    } catch (error) {
      swalError(error);
    }
    router.go(-1);
  };

  const editBankHandler = (id) => {
    if (banksAdmin.list.length === 0) {
      const index = banks.list.findIndex((item) => item._id === id);
      changeEditBankHandler(banks.list[index]);
    } else {
      const index = banksAdmin.user.findIndex((item) => item._id === id);
      changeEditBankHandler({ ...banksAdmin.user[index], type: 'admin' });
    }
    router.push('/member/bankinfo');
  };

  const cancelBankHandler = () => {
    changeEditBankHandler();
    router.go(-1);
  };

  const deleteBankHandler = async (id) => {
    try {
      await apiAuth.delete(`/users/bank/${id}`);
      const index = banks.list.findIndex((item) => {
        return item._id === id;
      });
      banks.list.splice(index, 1);

      swalSuccess('成功刪除');
    } catch (error) {
      swalError(error);
    }
  };

  const adminViewUserBankListHanlder = (userId) => {
    banksAdmin.user = banksAdmin.list.filter((item) => (item.userId = userId));

    router.push('/member/memberadminbank');
  };

  return {
    banks,
    banksAdmin,
    listBank,
    editBank,
    addBankHandler,
    sumbitBankHandler,
    editBankHandler,
    cancelBankHandler,
    deleteBankHandler,
    adminViewUserBankListHanlder,
  };
});
