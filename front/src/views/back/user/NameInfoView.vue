<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/member/membership" class="hover:scale-105"
          >帳戶</RouterLink
        >
        <p>&ensp;/&ensp;名稱編輯</p>
      </div>
    </Breadcrumbs>
    <div class="lg:w-1/2 mx-auto border-2 px-5 py-4">
      <h2 class="mb-8 text-2xl">修改資訊</h2>
      <form @submit.prevent="submitHandler">
        <UploadImage
          v-model="form.image"
          className="avatar"
          id="avatar"
          class="mx-auto w-fit"
        />
        <Input
          title="名稱"
          class="mb-8"
          v-model="form.name"
          :error="error.error"
          :errorText="error.value"
          @click="error.error = false"
        />
        <div class="flex justify-between mt-8">
          <RouterLink to="/member/membership" class="w-1/3 block">
            <Btn text="取消" className="btn-outline" class="w-full" />
          </RouterLink>
          <Btn type="sumbit" text="確定" class="w-1/3" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import validator from 'validator';
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Input from '@/components/ui/TheInput.vue';
import Btn from '@/components/ui/TheBtn.vue';
import UploadImage from '@/components/ui/UploadImage.vue';

import { useUserStore } from '@/stores/users';

const user = useUserStore();
const { editUserHander } = user;
const { users } = storeToRefs(user);

const form = reactive({
  name: users.value.name || '',
  image: users.value.image || '',
});

const error = reactive({
  error: false,
  value: '',
});

const validatorFormHandler = () => {
  if (validator.isEmpty(form.name)) {
    error.value = '為必填';
    error.error = true;
    return true;
  }
  if (!validator.isByteLength(form.name, { max: 12 })) {
    error.value = '長度小於 12';
    error.error = true;
    return true;
  }
  return false;
};

const submitHandler = () => {
  if (validatorFormHandler()) return;
  const fd = new FormData();
  if (
    form.image &&
    form.image !== users.value.image &&
    form.image.type.startsWith('image/')
  ) {
    fd.append('name', form.name);
    fd.append('image', form.image);
    editUserHander(fd);
  } else {
    fd.append('name', form.name);
    editUserHander(fd);
  }
};
</script>
