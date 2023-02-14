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
          <p>&ensp;/&ensp;地址列表</p>
        </div>
      </Breadcrumbs>
      <Btn text="新增地址" @click="addAddressHandler" />
    </div>
    <AddressTable :data="listAddress" />
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';

import AddressTable from '@/components/back/AddressTable.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useAddressStore } from '@/stores/address';
const address = useAddressStore();
const { addAddressHandler } = address;
const { listAddress } = storeToRefs(address);
</script>
