<template>
  <div class="container py-10">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <div class="flex">
          <RouterLink
            to="/member/shipadmin"
            class="text-primary font-bold hover:scale-105"
            >會員</RouterLink
          >
          <p>&ensp;/&ensp;地址列表</p>
          <p>&ensp;-&ensp;{{ userName }}</p>
        </div>
      </Breadcrumbs>
      <Btn text="新增地址" @click="addAddressHandler" />
    </div>

    <AddressTable :data="addressAdmin.user.list" />
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import AddressTable from '@/components/back/AddressTable.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useAddressStore } from '@/stores/address';
import { useUserStore } from '@/stores/users';

const address = useAddressStore();
const { addAddressHandler } = address;
const { addressAdmin } = storeToRefs(address);
const { userAdmin } = storeToRefs(useUserStore());

const userName = computed(() => {
  const index = userAdmin.value.list.findIndex(
    (item) => item._id === addressAdmin.value.user.userId
  );

  return userAdmin.value.list[index].name;
});
</script>
