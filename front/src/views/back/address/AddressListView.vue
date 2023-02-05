<template>
  <div class="container py-20">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <div class="flex">
          <RouterLink to="/member/membership" class="hover:scale-105"
            >帳戶</RouterLink
          >
          <p>&ensp;/&ensp;地址列表</p>
        </div>
      </Breadcrumbs>
      <Btn text="新增地址" @click="addAddressHandler" />
    </div>
    <div class="overflow-auto">
      <table class="w-full table-auto lg:w-1/2 lg:mx-auto">
        <thead>
          <tr>
            <th class="border-2 p-2">郵遞區號</th>
            <th class="border-2 p-2">城市</th>
            <th class="border-2 p-2">區鄉鎮</th>
            <th class="border-2 p-2">街道</th>
            <th class="border-2 p-2">姓名</th>
            <th class="border-2 p-2">電話</th>
            <th class="border-2 p-2">設定</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in listAddress" :key="item._id">
            <td class="border-2 p-2 text-center">
              {{ item.code }}
            </td>
            <td class="border-2 p-2 text-center">
              {{ item.city }}
            </td>
            <td class="border-2 p-2 text-center">
              {{ item.districts }}
            </td>
            <td class="border-2 p-2 text-center">
              {{ item.street }}
            </td>
            <td class="border-2 p-2 text-center">
              {{ item.name }}
            </td>
            <td class="border-2 p-2 text-center">
              {{ item.phone }}
            </td>
            <td class="border-2 p-2">
              <div
                class="flex gap-4 items-center justify-center flex-col lg:flex-row"
              >
                <img
                  src="@/assets/svg/edit.svg"
                  class="w-6 hover:opacity-60"
                  @click="editAddressHandler(item._id)"
                />
                <img
                  src="@/assets/svg/delete.svg"
                  class="w-6 hover:opacity-60"
                  @click="deleteAddressHandler(item._id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useAddressStore } from '@/stores/address';
const address = useAddressStore();
const { addAddressHandler, editAddressHandler, deleteAddressHandler } = address;
const { listAddress } = storeToRefs(address);
</script>
