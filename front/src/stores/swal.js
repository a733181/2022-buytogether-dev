import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useSwalStore = defineStore('swal', () => {
  const swalSuccess = (text) => {
    Swal.fire({
      icon: 'success',
      title: '成功',
      text,
    });
  };

  const swalError = (error) => {
    const errorText =
      typeof error === 'string'
        ? error
        : error?.response?.data?.message || '發生錯誤';
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: errorText,
    });
  };

  return {
    swalSuccess,
    swalError,
  };
});
