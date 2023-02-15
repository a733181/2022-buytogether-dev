<template>
  <form @submit.prevent="submitHandler">
    <div class="mb-6">
      <Textarea
        :classText="props.classText"
        v-model="form.message"
        :error="error.message.error"
        :errorText="error.message.value"
        @click="inputText"
      />
    </div>
    <div class="flex justify-center gap-4">
      <div class="lg:w-1/3">
        <Btn
          text="清除"
          class="w-full"
          className="btn-outline"
          @click="clearHandler"
        />
      </div>
      <div class="lg:w-1/3">
        <Btn
          status="submit"
          text="確定"
          class="w-full"
          :disabled="isLoading"
          :loading="isLoading"
        />
      </div>
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
  classText: {
    type: String,
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

const clearHandler = () => {
  form.message = '';
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
