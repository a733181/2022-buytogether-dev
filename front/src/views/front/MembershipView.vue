<template>
  <div class="container py-20">
    <Breadcrumbs>
      <p>
        {{ isLogin ? '登入' : '註冊' }}
      </p>
    </Breadcrumbs>

    <form @submit.prevent="submitHandler" class="lg:w-1/2 mx-auto">
      <Input
        title="手機號碼"
        v-model="form.phone"
        type="text"
        :error="error.phone.error"
        :errorText="error.phone.value"
        @click="error.phone.error = false"
      />
      <Input
        title="密碼"
        v-model="form.password"
        type="password"
        :error="error.password.error"
        :errorText="error.password.value"
        @click="error.password.error = false"
      />
      <div class="flex justify-between mt-10">
        <Btn
          status="button"
          class="w-1/3"
          className="btn-outline"
          @click="isLogin = !isLogin"
          :text="isLogin ? '註冊' : '返回'"
        />
        <Btn
          status="submit"
          class="w-1/3"
          text="確定"
          :disabled="isLoading"
          :loading="isLoading"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import validator from 'validator';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Input from '@/components/ui/TheInput.vue';

import { useUserStore } from '@/stores/users';

const isLoading = ref(false);

const user = useUserStore();
const { registerHandler, loginHandler } = user;
const { isLogin } = storeToRefs(user);

const form = reactive({
  phone: '',
  password: '',
});

const error = reactive({
  phone: {
    error: false,
    value: '',
  },
  password: {
    error: false,
    value: '',
  },
});

const validatorFormHandler = () => {
  if (validator.isEmpty(form.phone)) {
    error.phone.value = '為必填';
    error.phone.error = true;
    return true;
  }
  if (validator.isEmpty(form.password)) {
    error.password.value = '為必填';
    error.password.error = true;
    return true;
  }
  if (!validator.isMobilePhone(form.phone, ['zh-TW'])) {
    error.phone.value = '格式錯誤';
    error.phone.error = true;
    return true;
  }
  if (!validator.isByteLength(form.password, { min: 4, max: 20 })) {
    error.password.value = '長度大於 4 小於 20';
    error.password.error = true;
    return true;
  }
  return false;
};

const submitHandler = async () => {
  if (validatorFormHandler()) return;
  isLoading.value = true;

  if (isLogin.value) {
    await loginHandler(form);
  } else {
    await registerHandler(form);
  }
  isLoading.value = false;
};
</script>
