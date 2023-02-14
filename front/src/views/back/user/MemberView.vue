<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <p class="text-primary font-bold">帳戶</p>
    </Breadcrumbs>

    <div class="lg:w-1/2 mx-auto border-2 px-5 py-4 mb-8">
      <h2 class="mb-8 text-2xl">基本資訊</h2>
      <div
        class="mb-4 flex lg:items-center flex-col lg:flex-row gap-2 border-b-2 pb-4"
      >
        <p class="lg:w-2/12">名稱</p>
        <div class="flex-1 flex justify-between items-center">
          <div class="flex items-center">
            <img
              :src="users.image"
              class="w-8 h-8 mr-3 rounded-full object-cover"
            />
            <p>{{ users.name }}</p>
          </div>
          <RouterLink to="/member/nameinfo" class="hover:opacity-50">
            <img
              src="@/assets/svg/arrow.svg"
              alt=""
              class="w-4 h-full rotate-180 ml-auto"
            />
          </RouterLink>
        </div>
      </div>
      <div
        class="mb-4 flex lg:items-center flex-col lg:flex-row gap-2 border-b-2 pb-4"
      >
        <p class="lg:w-2/12">Email</p>
        <div class="flex-1 flex justify-between items-center">
          <p>{{ users.email }}</p>
          <RouterLink to="/member/emailinfo" class="hover:opacity-50">
            <img
              src="@/assets/svg/arrow.svg"
              alt=""
              class="w-4 h-full rotate-180 ml-auto"
            />
          </RouterLink>
        </div>
      </div>
      <div
        class="mb-4 flex lg:items-center flex-col lg:flex-row gap-2 border-b-2 pb-4"
      >
        <p class="lg:w-2/12">收付款帳戶</p>
        <p>{{ defaultBank }}</p>
        <div class="flex-1 flex justify-between items-center">
          <RouterLink to="/member/banklist" class="ml-auto hover:opacity-50">
            <img src="@/assets/svg/arrow.svg" class="w-4 h-full rotate-180" />
          </RouterLink>
        </div>
      </div>
      <div
        class="mb-4 flex lg:items-center flex-col lg:flex-row gap-2 border-b-2 pb-4"
      >
        <p class="lg:w-2/12">地址</p>
        <p>{{ defaultAddress }}</p>
        <div class="flex-1 flex justify-between items-center">
          <RouterLink to="/member/addresslist" class="ml-auto hover:opacity-50">
            <img src="@/assets/svg/arrow.svg" class="w-4 h-full rotate-180" />
          </RouterLink>
        </div>
      </div>
      <div class="flex lg:items-center flex-col lg:flex-row gap-2 pb-4">
        <p class="lg:w-2/12">手機號碼</p>
        <p>{{ users.phone }}</p>
      </div>
    </div>

    <div class="lg:w-1/2 mx-auto border-2 p-5">
      <h2 class="mb-8 text-2xl">其他</h2>
      <div
        class="mb-4 flex lg:items-center flex-col lg:flex-row gap-2 border-b-2 pb-4"
      >
        <p class="lg:w-2/12">團購網回覆</p>
        <div class="flex-1 flex justify-between items-center">
          <RouterLink to="/member/message" class="ml-auto hover:opacity-50">
            <img src="@/assets/svg/arrow.svg" class="w-4 h-full rotate-180" />
          </RouterLink>
        </div>
      </div>
      <div class="flex lg:items-center flex-row gap-2">
        <p class="lg:w-2/12">黑名單</p>
        <RouterLink to="/member/blacklist" class="ml-auto hover:opacity-50">
          <img
            src="@/assets/svg/arrow.svg"
            alt=""
            class="w-4 h-full rotate-180"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';

import { useUserStore } from '@/stores/users';
import { useBankStore } from '@/stores/bank';
import { useAddressStore } from '@/stores/address';

const { users } = storeToRefs(useUserStore());
const { listBank } = storeToRefs(useBankStore());
const { listAddress } = storeToRefs(useAddressStore());

const defaultBank = computed(() => {
  const index = listBank.value.findIndex((item) => item.preset);
  if (index === -1 && listBank.value.length === 0) {
    return '';
  } else if (index === -1) {
    return `${listBank.value[0].bankName} - ${listBank.value[0].bankNumber}`;
  } else {
    return `${listBank.value[index].bankName} - ${listBank.value[index].bankNumber}`;
  }
});

const defaultAddress = computed(() => {
  const index = listAddress.value.findIndex((item) => item.preset);

  if (index === -1 && listAddress.value.length === 0) {
    return '';
  } else if (index === -1) {
    return `${listAddress.value[0].code} ${listAddress.value[0].city} ${listAddress.value[0].districts} ${listAddress.value[0].street}`;
  } else {
    return `${listAddress.value[index].code} ${listAddress.value[index].city} ${listAddress.value[index].districts} ${listAddress.value[index].street}`;
  }
});
</script>
