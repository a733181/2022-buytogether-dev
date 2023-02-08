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
      userId: null,
      _id: '',
      bankName: '',
      bankNumber: '',
      preset: false,
      type: 'user',
    },
  });

  const banksAdmin = reactive({
    list: [],
    user: {
      userId: '',
      list: [],
    },
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

    if (banksAdmin.list.length) {
      banks.edit.userId = banksAdmin.user.userId;
      banks.edit.type = 'admin';
    }
  };

  const sumbitBankHandler = async (form) => {
    try {
      if (form._id === '') {
        if (banksAdmin.list.length) {
          if (form.preset) {
            const bankPreset = banksAdmin.user.list.filter(
              (item) => item.preset
            );

            if (bankPreset[0]) {
              const index = banksAdmin.list.findIndex(
                (item) => item._id === bankPreset[0]._id
              );
              banksAdmin.list[index].preset = false;
            }
          }
        } else {
          if (form.preset && banks.list.length > 0) {
            const index = banks.list.findIndex((item) => item.preset);
            if (index !== -1) {
              banks.list[index].preset = false;
            }
          }
        }
        const { data } = await apiAuth.post('/users/bank', form);

        if (banksAdmin.list.length) {
          banksAdmin.list.push(data.result);
          banksAdmin.user.list = banksAdmin.list.filter(
            (item) => item.userId === banksAdmin.user.userId
          );
        } else {
          banks.list.push(data.result);
        }
      } else {
        if (banksAdmin.list.length) {
          if (form.preset) {
            const bankPreset = banksAdmin.user.list.filter(
              (item) => item.preset
            );
            if (bankPreset[0]) {
              const index = banksAdmin.list.findIndex(
                (item) => item._id === bankPreset[0]._id
              );
              banksAdmin.list[index].preset = false;
            }
          }
        } else {
          if (form.preset) {
            const index = banks.list.findIndex((item) => item.preset);
            if (index !== -1) {
              banks.list[index].preset = false;
            }
          }
        }

        const { data } = await apiAuth.patch(`/users/bank/${form._id}`, form);

        if (banksAdmin.list.length) {
          const index = banksAdmin.list.findIndex(
            (item) => item._id === data.result._id
          );
          banksAdmin.list[index] = data.result;
          banksAdmin.user.list = banksAdmin.list.filter(
            (item) => item.userId === banksAdmin.user.userId
          );
        } else {
          const index = banks.list.findIndex(
            (item) => item._id === data.result._id
          );
          banks.list[index] = data.result;
        }
      }

      swalSuccess(banks.edit._id === '' ? '新增成功' : '修改成功');
      changeEditBankHandler();
    } catch (error) {
      swalError(error);
    }
    router.go(-1);
  };

  const editBankHandler = (id) => {
    if (banksAdmin.list.length) {
      const index = banksAdmin.user.list.findIndex((item) => item._id === id);
      changeEditBankHandler({ ...banksAdmin.user.list[index], type: 'admin' });
    } else {
      const index = banks.list.findIndex((item) => item._id === id);
      changeEditBankHandler(banks.list[index]);
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
      if (banksAdmin.list.length) {
        const index = banksAdmin.list.findIndex((item) => item._id === id);
        banksAdmin.list.splice(index, 1);
        banksAdmin.user.list = banksAdmin.list.filter(
          (item) => item.userId === banksAdmin.user.userId
        );
      } else {
        const index = banks.list.findIndex((item) => {
          return item._id === id;
        });
        banks.list.splice(index, 1);
      }

      swalSuccess('成功刪除');
    } catch (error) {
      swalError(error);
    }
  };

  const adminViewUserBankListHanlder = (userId) => {
    banksAdmin.user.userId = userId;

    banksAdmin.user.list = banksAdmin.list.filter(
      (item) => item.userId === userId
    );
    router.push('/member/adminbank');
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
