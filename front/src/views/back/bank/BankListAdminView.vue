<template>
  <div class="container py-20">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <div class="flex">
          <RouterLink to="/member/membershipadmin" class="hover:scale-105"
            >會員</RouterLink
          >
          <p>&ensp;/&ensp;帳戶列表</p>
          <p>&ensp;-&ensp;{{ userName }}</p>
        </div>
      </Breadcrumbs>
      <Btn text="新增帳戶" @click="addBankHandler" />
    </div>
    <BankTable :data="banksAdmin.user.list" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import BankTable from '@/components/back/BankTable.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useBankStore } from '@/stores/bank';
import { useUserStore } from '@/stores/users';

const bank = useBankStore();
const { addBankHandler } = bank;
const { banksAdmin } = storeToRefs(bank);
const { userAdmin } = storeToRefs(useUserStore());

const userName = computed(() => {
  const index = userAdmin.value.list.findIndex(
    (item) => item._id === banksAdmin.value.user.userId
  );

  return userAdmin.value.list[index].name;
});
</script>
