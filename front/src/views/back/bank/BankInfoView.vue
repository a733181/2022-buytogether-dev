<template>
  <div class="container py-20">
    <Breadcrumbs v-if="editBank.type != 'admin'" class="mb-10">
      <div class="flex">
        <RouterLink to="/member/membership" class="hover:scale-105"
          >帳戶</RouterLink
        >
        <p>&ensp;/&ensp;</p>
        <RouterLink to="/member/banklist" class="hover:scale-105"
          >帳戶列表</RouterLink
        >

        <p>
          {{ editBank._id ? '&ensp;/&ensp;修改帳戶' : '&ensp;/&ensp;新增帳戶' }}
        </p>
      </div>
    </Breadcrumbs>
    <Breadcrumbs v-else class="mb-10">
      <div class="flex">
        <RouterLink to="/member/membershipadmin" class="hover:scale-105"
          >會員</RouterLink
        >
        <p>&ensp;/&ensp;</p>
        <RouterLink to="/member/memberadminbank" class="hover:scale-105"
          >帳戶列表</RouterLink
        >

        <p>
          {{ editBank._id ? '&ensp;/&ensp;修改帳戶' : '&ensp;/&ensp;新增帳戶' }}
        </p>
      </div>
    </Breadcrumbs>

    <form @submit.prevent="submitHandler">
      <Input
        title="代號"
        v-model="form.bankName"
        :error="error.bankName.error"
        :errorText="error.bankName.value"
        @click="error.bankName.error = false"
        :select="bankNumberLists"
      />
      <Input
        title="帳號"
        v-model="form.bankNumber"
        :error="error.bankNumber.error"
        :errorText="error.bankNumber.value"
        @click="error.bankNumber.error = false"
      />
      <Input
        title="預設"
        type="checkbox"
        v-model="form.preset"
        id="bankpreset"
      />
      <div class="flex justify-between mt-8">
        <Btn
          text="取消"
          className="btn-outline"
          class="w-1/3"
          @click="cancelBankHandler"
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
</template>

<script setup>
import { ref, reactive } from 'vue';
import validator from 'validator';
import { storeToRefs } from 'pinia';

import { useBankStore } from '@/stores/bank';
import { useCategoryStore } from '@/stores/category';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Input from '@/components/ui/TheInput.vue';

import Btn from '@/components/ui/TheBtn.vue';

const isLoading = ref(false);

const bank = useBankStore();
const { sumbitBankHandler, cancelBankHandler } = bank;
const { editBank } = storeToRefs(bank);
const { bankNumberLists } = useCategoryStore();

const form = reactive({
  _id: editBank.value._id || '',
  userId: editBank.value.userId || null,
  bankName: editBank.value.bankName || '',
  bankNumber: editBank.value.bankNumber
    ? String(editBank.value.bankNumber)
    : '',
  preset: editBank.value.preset || false,
});

const error = reactive({
  bankName: {
    error: false,
    value: '',
  },
  bankNumber: {
    error: false,
    value: '',
  },
});

const validatorFormHandler = () => {
  if (validator.isEmpty(form.bankName)) {
    error.bankName.value = '為必填';
    error.bankName.error = true;
    return true;
  }
  if (validator.isEmpty(form.bankNumber)) {
    error.bankNumber.value = '為必填';
    error.bankNumber.error = true;
    return true;
  }

  if (!validator.isNumeric(form.bankNumber)) {
    error.bankNumber.value = '不是數字';
    error.bankNumber.error = true;
    return true;
  }

  if (!validator.isByteLength(form.bankNumber, { min: 11, max: 16 })) {
    error.bankNumber.value = '長度大於 11 小於 16';
    error.bankNumber.error = true;
    return true;
  }
  if (!bankNumberLists.some((item) => item === form.bankName)) {
    error.bankName.value = '格式錯誤';
    error.bankName.error = true;
    return true;
  }

  return false;
};

const submitHandler = async () => {
  if (validatorFormHandler()) return;
  isLoading.value = true;
  await sumbitBankHandler(form);
  isLoading.value = false;
};
</script>
