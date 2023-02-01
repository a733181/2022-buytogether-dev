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
    }
  ) => {
    banks.edit._id = data._id;
    banks.edit.bankName = data.bankName;
    banks.edit.bankNumber = data.bankNumber;
  };

  const getAllBankHandler = async () => {
    try {
      const { data } = await apiAuth.get('/users/bank');
      banks.list = data.result;
    } catch (error) {}
  };

  const addBankHandler = () => {
    changeEditBankHandler();
    router.push('/member/bankinfo');
  };

  const sumbitBankHandler = async (form) => {
    try {
      if (banks.edit._id === '') {
        const { data } = await apiAuth.post('/users/bank', form);
        banks.list.push(data.result);
      } else {
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
    const index = banks.list.findIndex((item) => item._id === id);
    changeEditBankHandler(banks.list[index]);
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

  return {
    listBank,
    editBank,
    getAllBankHandler,
    addBankHandler,
    sumbitBankHandler,
    editBankHandler,
    cancelBankHandler,
    deleteBankHandler,
  };
});
