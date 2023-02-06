<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/member/membershipadmin" class="hover:scale-105"
          >會員</RouterLink
        >
        <p>&ensp;/&ensp;編輯</p>
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
          :error="error.name.error"
          :errorText="error.name.value"
          @click="error.name.error = false"
        />
        <Input
          title="Email"
          type="email"
          class="mb-8"
          v-model="form.email"
          :error="error.email.error"
          :errorText="error.email.value"
          @click="error.email.error = false"
        />
        <Input
          title="電話"
          class="mb-8"
          v-model="form.phone"
          :error="error.phone.error"
          :errorText="error.phone.value"
          @click="error.phone.error = false"
        />
        <div class="flex justify-between mt-8">
          <Btn
            text="取消"
            className="btn-outline"
            class="w-1/3"
            @click="cancelEditUserHandler"
          />
          <Btn
            type="sumbit"
            text="確定"
            class="w-1/3"
            :disabled="isLoading"
            :loading="isLoading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import validator from 'validator';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Input from '@/components/ui/TheInput.vue';
import Btn from '@/components/ui/TheBtn.vue';
import UploadImage from '@/components/ui/UploadImage.vue';

import { useUserStore } from '@/stores/users';

const router = useRouter();
const user = useUserStore();
const { editAdminUserHander } = user;
const { userAdmin } = storeToRefs(user);

const isLoading = ref(false);

const error = reactive({
  name: {
    type: String,
    error: false,
  },
  email: {
    type: String,
    error: false,
  },
  phone: {
    type: String,
    error: false,
  },
});

const form = reactive({
  _id: userAdmin.value.edit._id || '',
  name: userAdmin.value.edit.name || '',
  image: userAdmin.value.edit.image || '',
  email: userAdmin.value.edit.email || '',
  phone: userAdmin.value.edit.phone || '',
});

const validatorFormHandler = () => {
  if (validator.isEmpty(form.name)) {
    error.name.value = '為必填';
    error.name.error = true;
    return true;
  }
  if (!validator.isByteLength(form.name, { max: 12 })) {
    error.name.value = '長度小於 12';
    error.name.error = true;
    return true;
  }
  return false;
};

const submitHandler = async () => {
  if (validatorFormHandler()) return;
  isLoading.value = true;
  const fd = new FormData();
  if (
    form.image &&
    form.image !== userAdmin.value.edit.image &&
    form.image.type.startsWith('image/')
  ) {
    fd.append('id', form._id);
    fd.append('name', form.name);
    fd.append('image', form.image);
    fd.append('phone', form.phone);
    fd.append('email', form.email);
  } else {
    fd.append('id', form._id);
    fd.append('name', form.name);
    fd.append('phone', form.phone);
    fd.append('email', form.email);
  }
  await editAdminUserHander(fd);
  isLoading.value = false;
};

const cancelEditUserHandler = () => {
  userAdmin.value.edit = {};
  router.push('/member/membershipadmin');
};
</script>
