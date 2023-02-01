import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useModelStore = defineStore('models', () => {
  const toggleShow = ref(false);

  return {
    toggleShow,
  };
});
