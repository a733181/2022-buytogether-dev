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
    </div>
    <BankTable :data="banksAdmin.user" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import BankTable from '@/components/ui/TheBankTable.vue';

import { useBankStore } from '@/stores/bank';
import { useUserStore } from '@/stores/users';

const bank = useBankStore();
const { banksAdmin } = storeToRefs(bank);
const { userAdmin } = storeToRefs(useUserStore());

const userName = computed(() => {
  const index = userAdmin.value.list.findIndex(
    (item) => item._id === banksAdmin.value.user[0].userId
  );

  return userAdmin.value.list[index].name;
});
</script>
