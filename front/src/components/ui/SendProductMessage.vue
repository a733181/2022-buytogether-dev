<template>
  <form @submit.prevent="submitHandler">
    <div class="mb-6">
      <Textarea
        v-model="form.message"
        title="訊息"
        :error="error.message.error"
        :errorText="error.message.value"
        @click="inputText"
      />
    </div>
    <div class="lg:w-1/3 ml-auto">
      <Btn
        status="submit"
        text="確定"
        class="w-full"
        :disabled="isLoading"
        :loading="isLoading"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import validator from 'validator';

import Btn from '@/components/ui/TheBtn.vue';
import Textarea from '@/components/ui/TheTextarea.vue';

import { useUserStore } from '@/stores/users';

const { isLoginHandler } = useUserStore();

const emit = defineEmits(['message']);

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref(props.isLoading);

const error = reactive({
  message: {
    error: false,
    value: '',
  },
});

const form = reactive({
  message: '',
});

const inputText = () => {
  isLoginHandler();
  error.message.error = false;
};

const validatorFormHandler = () => {
  if (validator.isEmpty(form.message)) {
    error.message.value = '為必填';
    error.message.error = true;
    return true;
  }
  return false;
};

const submitHandler = () => {
  if (validatorFormHandler()) return;
  emit('message', form);
  form.message = '';
};

watch(props, (value) => {
  if (value.isLoading !== isLoading.value) {
    isLoading.value = value.isLoading;
  }
});
</script>
