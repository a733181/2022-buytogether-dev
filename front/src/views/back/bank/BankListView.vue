<template>
  <div class="container py-10">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <div class="flex">
          <RouterLink
            to="/member/ship"
            class="text-primary font-bold hover:scale-105"
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

import BankTable from '@/components/back/BankTable.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useBankStore } from '@/stores/bank';

const bank = useBankStore();
const { addBankHandler } = bank;
const { listBank } = storeToRefs(bank);
</script>
