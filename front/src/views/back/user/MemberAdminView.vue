<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <p>帳戶</p>
    </Breadcrumbs>
    <div class="overflow-auto mb-10">
      <table class="w-full table-auto text-center">
        <thead>
          <tr>
            <th class="border-2 p-2">名稱</th>
            <th class="border-2 p-2">Email</th>
            <th class="border-2 p-2">收付款帳戶</th>
            <th class="border-2 p-2">地址</th>
            <th class="border-2 p-2">手機號碼</th>
            <th class="border-2 p-2">設定</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userAdmin.list" :key="user._id">
            <td class="border-2 p-2">
              <div class="flex flex-col lg:flex-row">
                <img
                  :src="user.image"
                  class="w-8 h-8 lg:mr-3 lg:ml-2 rounded-full object-cover"
                />
                <p>{{ user.name }}</p>
              </div>
            </td>
            <td class="border-2 p-2">{{ user.email }}</td>
            <td class="border-2 p-2"></td>
            <td class="border-2 p-2"></td>
            <td class="border-2 p-2">{{ user.phone }}</td>
            <td class="border-2 p-2">
              <img
                src="@/assets/svg/edit.svg"
                class="w-6 hover:opacity-60 mx-auto"
                @click=""
              />
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

import { useUserStore } from '@/stores/users';
import { useBankStore } from '@/stores/bank';
import { useAddressStore } from '@/stores/address';

const user = useUserStore();
const { getAdminAllUserHanlder } = user;
const { userAdmin } = storeToRefs(user);

getAdminAllUserHanlder();
</script>

<style scoped></style>
