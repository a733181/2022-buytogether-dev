<template>
  <div class="container py-20">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <div class="flex">
          <RouterLink to="/member/membership" class="hover:scale-105"
            >帳戶</RouterLink
          >
          <p>&ensp;/&ensp;帳戶列表</p>
        </div>
      </Breadcrumbs>
      <Btn text="新增帳戶" @click="addBankHandler" />
    </div>
    <BankTable :data="listBank" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';
import BankTable from '@/components/ui/TheBankTable.vue';

import { useBankStore } from '@/stores/bank';

const bank = useBankStore();
const { addBankHandler } = bank;
const { listBank } = storeToRefs(bank);
</script>
